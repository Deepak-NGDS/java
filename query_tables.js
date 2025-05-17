import { createConnection } from 'mysql2/promise';
// import config from './config_db.json' assert {type:'json'};
import fs from 'fs';

async function dbConnection() {
    try {
        const config = fs.readFileSync('config_db.json','utf-8')  //returns back a string
        const configj = JSON.parse(config) // object of js in JSON format
      const connection = await createConnection(configj)
      console.log('Connection established')
      return connection
    } catch (error) {
      console.log( error)
    }
  }

async function sqlQuery(tableName) {
const tables = ['dat_ser_ord','dat_ser_orders_log','dat_ser_orders', 'dat_ser_orders_assets']
const connection = await dbConnection()
try {
    const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM '+ tableName)
//   console.log(rows)
  const count = rows[0].count
  return { count, table: tableName }
  //   console.log(`${tableName} has ${count} `)
} 
catch (error) {
//   console.log("table does not exist")
    for (let table of tables) {
    try {
        const [rows] = await connection.execute( 'SELECT COUNT(*) AS count FROM ' + table)
      const count = rows[0].count;
      return { count, table };        
        //   console.log(`exisitng ${table} has ${count} `)
    } 
    catch (error) {
    //   console.log(error)
    }
  }
}
finally {
await connection.end()
}
}

try {
    const { count, table } = await sqlQuery('dat_ser_order')
    console.log(` ${table} has ${count} `)
  } catch (error) {
    console.log(error)
  }





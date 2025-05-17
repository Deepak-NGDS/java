import { createConnection } from 'mysql2/promise';
// import config from './config_db.json' assert {type:'json'};
import fs from 'fs';

async function dbConnection(sqlQuery) {
    try {
        const config = fs.readFileSync('config_db.json','utf-8')  //returns back a string
        const configj = JSON.parse(config) // object of js in JSON format
        console.log(config)
        console.log(configj)
      const connection = await createConnection(configj)
      
      console.log('Connection established')
      const [rows] = await connection.execute(sqlQuery)
    //   console.log('data', rows)
      await connection.close()
      return rows
    } catch (error) {
      console.log( error)
    }
  }

  try{
  const result= await dbConnection("SELECT * FROM dat_ser_order Where id = 46091");
  console.log("result",result)
  }

  catch(error){
    console.log("wrong table name",error)  
    
  }

  try {

    const newResult= await dbConnection("SELECT * FROM dat_ser_orders_log Where order_id_fk = 46091");
    console.log("result",newResult)
  }
  catch(error){
    console.log("newResult error ",error)
  }


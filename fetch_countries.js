import { createConnection } from 'mysql2/promise';
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

async function fetchCountries() {
  const response = await fetch('https://hub-test.vena.energy/api/userManagement/getAllCountries')
     const data = await response.json()
  return data.data 
}

async function insertCountries(countries) {
    const connection = await dbConnection();
  
  const sqlQuery = `INSERT IGNORE INTO mas_countries (id, cname, created_on, created_by_fk,hcode, address, contact_num, fax_num,maps_loc, currency_id_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
//   const sqlQuery = `INSERT IGNORE INTO mas_countries (id, cname, created_on, created_by_fk,hcode, address, contact_num, fax_num,maps_loc, currency_id_fk) VALUES ?`
  // const values = countries.map(c =>[
  //   c.id,c.cname,c.created_on, c.created_by_fk,c.hcode,c.address,c.contact_num,c.fax_num,c.maps_loc,c.currency_id_fk
  // ])  //bulk mapping of the values using map and there will be only one placeholder in the insert statement
  for (const c of countries){
      await connection.query(sqlQuery, [c.id,c.cname,c.created_on, c.created_by_fk,c.hcode,c.address,c.contact_num,c.fax_num,c.maps_loc,c.currency_id_fk])
    }  //const c is the object of each country in the countries array
    // await connection.query(sqlQuery,[values]) //returns a promise 
    await connection.end()
  }
try {
  const countries = await fetchCountries()
  await insertCountries(countries)
  console.log("data inserted")
} catch (error) {
  console.log(error)
}

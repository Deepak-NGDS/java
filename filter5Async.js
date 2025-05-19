import { createConnection } from 'mysql2/promise';
import fs from 'fs';
function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
   }
async function insertCountries(){
    try{
    const config = fs.readFileSync('config_db.json', 'utf-8')
    const configj = JSON.parse(config)
    const response = await fetch('https://hub-test.vena.energy/api/userManagement/getAllCountries')
    const data = await response.json()
    const fivedata = data.data.slice(5,10)
    const connection= await createConnection(configj)
    try {
        await connection.query('TRUNCATE TABLE mas_countries');
        const sql = `INSERT IGNORE INTO mas_countries (id, cname, created_on, created_by_fk, hcode, address, contact_num, fax_num, maps_loc, currency_id_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        for (let i = 0; i < 5 ; i++) {
          const c = fivedata[i]
          const values = [c.id, c.cname, c.created_on, c.created_by_fk, c.hcode,c.address, c.contact_num, c.fax_num, c.maps_loc, c.currency_id_fk];
          await connection.query(sql, values);
          await Delay(1000)
        }
      } finally {
        await connection.end()
      }
    } catch (error) {
      console.log(error)
}
}

try{
await insertCountries()
console.log("inserted 5 countries")
}
catch(error){
    console.log(error)
}
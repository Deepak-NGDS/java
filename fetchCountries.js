import { createConnection } from 'mysql2/promise';
import fs from 'fs';

function insertCountries() {
  return new Promise((resolve, reject) => {
    const config = fs.readFileSync('config_db.json', 'utf-8')
    const configj = JSON.parse(config)
    fetch('https://hub-test.vena.energy/api/userManagement/getAllCountries')
      .then((response) =>{return response.json()})
      .then((data) => {
        const countries = data.data
        createConnection(configj)
          .then((connection) => {
            const sqlQuery = `INSERT IGNORE INTO mas_countries (id, cname, created_on, created_by_fk, hcode, address, contact_num, fax_num, maps_loc, currency_id_fk) VALUES ?`;
              const values = countries.map(c =>[c.id,c.cname,c.created_on, c.created_by_fk,c.hcode,c.address,c.contact_num,c.fax_num,c.maps_loc,c.currency_id_fk])
               connection.query(sqlQuery, [values])
              .then((qdata) => {
                connection.close()
                resolve(qdata)
              })
          })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

insertCountries()
  .then((qdata) => {
    console.log(qdata)
  })
  .catch((error) => {
    console.log(error)
  })

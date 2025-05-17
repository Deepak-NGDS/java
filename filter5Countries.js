import { createConnection } from 'mysql2/promise';
import fs from 'fs';

function insertCountries() {
  return new Promise((resolve, reject) => {
    const config = fs.readFileSync('config_db.json', 'utf-8')
    const configj = JSON.parse(config)
    fetch('https://hub-test.vena.energy/api/userManagement/getAllCountries')
      .then((response) => response.json())
      .then((data) => data.data.slice(5,10))
      .then((fivedata) => {
        createConnection(configj)
          .then((connection) => {
            connection.query('TRUNCATE TABLE mas_countries')
              .then(() => {
                const sql = `INSERT IGNORE INTO mas_countries (id, cname, created_on, created_by_fk, hcode, address, contact_num, fax_num, maps_loc, currency_id_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                let count = 0
                function insertNext() {
                  if (count >= 5) {
                    connection.close()
                    resolve()
                    return;
                  }
                  const c = fivedata [count]
                  const values = [c.id, c.cname, c.created_on, c.created_by_fk,c.hcode, c.address, c.contact_num, c.fax_num,c.maps_loc, c.currency_id_fk]
                  connection.query(sql, values)
                    .then(() => {
                      count++;
                      setTimeout(insertNext, 1000)
                    })
                    .catch((error) => {
                      connection.close();
                      reject(error);
                    })
                }
                insertNext()
                })
            })
        })
    })

}

insertCountries()
  .then(() => 
    {console.log("5 countries are inserted")})
  .catch((error) =>{
   console.log(error)})

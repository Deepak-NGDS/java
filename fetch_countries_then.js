import { createConnection } from 'mysql2/promise';
import fs from 'fs';

function dbConnection (){
   return new Promise((resolve,reject)=>{
    const config = fs.readFileSync('config_db.json','utf-8')  //returns back a string
    const configj = JSON.parse(config) // object of js in JSON format
    createConnection(configj)
     .then((connection)=>{
        resolve(connection)
    })
    .catch((error)=>{
        reject(error)
        console.log(error)
    })
    })
}

function fetchCountries(){
    return new Promise((resolve,reject)=>{
        fetch('https://hub-test.vena.energy/api/userManagement/getAllCountries')
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            resolve(data.data)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

function insertCountries(countries){
    return new Promise((resolve,reject)=>{
        dbConnection()
        .then((connection)=>{

        const sqlQuery = `INSERT IGNORE INTO mas_countries (id, cname, created_on, created_by_fk,hcode, address, contact_num, fax_num,maps_loc, currency_id_fk) VALUES ?`
        
        const values = countries.map(c =>[
            c.id,c.cname,c.created_on, c.created_by_fk,c.hcode,c.address,c.contact_num,c.fax_num,c.maps_loc,c.currency_id_fk
        ])
        return connection.query(sqlQuery,[values])
        .then((qdata)=>{
            connection.close()
            resolve(qdata)
        })   
    })
    .catch((error)=>{
        reject(error)
        console.log(error)
    })
    })
}
    fetchCountries()
    .then((countries)=>{
       
        insertCountries(countries)
        .then((qdata)=>{
            console.log(qdata)
        })
     })
   
    .catch((error)=>{
        console.log(error)
    })
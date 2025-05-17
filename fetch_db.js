import { createConnection } from 'mysql2/promise';

function dbConnection(con) {
return new Promise((resolve,reject) =>{
let connection
createConnection (con)
.then((con)=>{
    connection = con
     console.log("established connection")
     return connection.execute('SELECT * FROM dat_ser_orders WHERE id = 46091');
    })
        .then((rows)=>{
            connection.end()
            resolve(rows)
            console.log(rows)
            })
        .catch((error) =>{
                reject(error)
            })
})
} 

dbConnection({host : "35.244.19.98",
user: "hubber",
password: "VenaHub@18",
database: "mhub"})
.then ((rows)=>{
    console.log(rows)
    }) 
.catch((error)=>{
    console.log("error connections")
})
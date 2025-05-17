import { createConnection } from 'mysql2/promise';

function dbQuery(con,sqlQuery) {
    return new Promise ((resolve,reject)=>{
        let connection
        createConnection(con)
        .then((conn)=>{
            connection = conn
            console.log("connection established")
            connection.execute(sqlQuery)
        .then((rows)=>{
            connection.end()
            resolve(rows)
        })
        .catch((error)=>{
            reject("error in reject")
        })

        })
    })
}

dbQuery(
    { host : "35.244.19.98",
      user: "hubber",
      password: "VenaHub@18",
      database: "mhub"}
, "SELECT * FROM dat_ser_order Where id = 460912"
).then ((rows)=>{
    console.log(".then",rows)
}).catch((error)=>{
    console.log("error query .then",error)
})

try{
    const rows = await dbQuery({
        host : "35.244.19.98",
        user: "hubber",
        password: "VenaHub@18",
        database: "mhub"
    }, "SELECT * FROM dat_ser_order Where id = 460912")
    console.log("await:",rows)
}
catch(error)
{
    console.log("error query await",error)
}
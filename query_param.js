import { createConnection } from 'mysql2/promise';

function dbQuery(con, sqlQuery) {
  return new Promise((resolve, reject) => {
    let connection
    createConnection(con)
      .then((conn) => {
        connection = conn
        console.log("Connected");
         connection.execute(sqlQuery)
        .then(([rows]) => {
          connection.end();
          resolve(rows);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

dbQuery(
    { host : "35.244.19.98",
      user: "hubber",
      password: "VenaHub@18",
      database: "mhub"},
    "SELECT * FROM dat_ser_orders WHERE id = 46091"
  ).then((rows) => {
    console.log("using .then", rows);
  }).catch((error) =>{
    console.log(error)
})
  

try {
      const rows = await dbQuery(
        { host : "35.244.19.98",
          user: "hubber",
          password: "VenaHub@18",
          database: "mhub"},
        "SELECT * FROM dat_ser_orders WHERE id = 46091"
      );
      console.log(" using await", rows);
    } 
catch (error) {
      console.log(error);
}
  
  
  
  
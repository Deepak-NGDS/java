import { createConnection } from 'mysql2/promise';
import fs from 'fs';

const config = fs.readFileSync('config_dbs.json', 'utf-8')
const configj = JSON.parse(config)

function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
   }

function logtonewdb(message) {
    const timeStamp=Date.now()
   
    return createConnection(configj.dev_db)
    .then((connection)=>{
       return connection.execute(`INSERT INTO test_logs_swathi (ts,description) VALUES (?,?)`, [timeStamp,message])

    })
}

function fetchPlantFromDev(id){
   return createConnection(configj.dev_db)
    .then ((connection)=>{
       return connection.execute(`SELECT * FROM mas_sites WHERE id = ?`,[id])
})
    .then(([rows])=>{
        return rows

    })
} 

function insertIntomydb(c){
   return createConnection(configj.my_db)
    .then((connection)=>{
        const sql = `INSERT INTO mas_sites (id,name,region_id_fk, asset_type_id_fk, created_on,created_by_fk,comm_date,lati,longi,unit_price,site_capacity,power_metric_fk,
        address,spv_id_fk,utr_num,store_address,contact_num,fax_num,num_of_turbines,price_unit,feeder_id_fk,isDataCollectionEnabled,alias_name,timezone_id_fk,effeciency,
        def_air_density,hcode,isMetMastAvailable) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        const values = [c.id,c.name,c.region_id_fk, c.asset_type_id_fk, c.created_on,c.created_by_fk,c.comm_date,c.lati,c.longi,c.unit_price,c.site_capacity,c.power_metric_fk,
            c.address,c.spv_id_fk,c.utr_num,c.store_address,c.contact_num,c.fax_num,c.num_of_turbines,c.price_unit,c.feeder_id_fk,c.isDataCollectionEnabled,c.alias_name,c.timezone_id_fk,c.effeciency,
            c.def_air_density,c.hcode,c.isMetMastAvailable]
       return connection.query(sql,values)
    })

}

function main(count){
    let currentid=267
    return new Promise((resolve,reject)=>{
        function allPlants(){
            if(currentid >= 267 + count){
               return resolve()
            }

    const id = currentid++
    const t= Date.now()
    const t1= t % 2000
    return logtonewdb(` Going to fetch ${id} from devdb`)
    .then(()=>Delay(t1))
    .then(()=>fetchPlantFromDev(id))
    .then((rows)=>{
        if(rows.length ===0){
            return logtonewdb(` no such ${id} present in table`)
            .then(()=> allPlants())

        }
    return Delay(t1)
    .then(()=>
      logtonewdb ( ` fetched ${id} from devdb`)
    )
    .then(()=>Delay(t1))
    .then(()=>logtonewdb(` Going to insert ${id} into mydb`))
    .then(()=>Delay(t1))
    .then(()=>insertIntomydb(rows[0]))
    .then(()=>Delay(t1))
    .then(()=>logtonewdb(`inserted ${id} into mydb`))
})
.catch((error) =>{
    allPlants()
})
}
    allPlants()
})


}

main(128)
.then(()=>{
    console.log("all the plant id are inserted")
})
.catch((error)=>{
    console.log(error)
})
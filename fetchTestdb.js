import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import  {format} from "date-fns"

const config = fs.readFileSync('config_db.json', 'utf-8')
const configj = JSON.parse(config)

function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
   }

function logtonewdb(plant_id,message) {
    const timestamp = format(new Date(), 'YYYY-MM-DD HH:MM:SS')
    const dateonly = format (new Date(),'YYYY-MM-DD')
    createConnection(configj.new_db)
    .then((connection)=>{
        connection.execute(`INSERT INTO test_logs (ts,tdate,plant_id,plant_name,description) VALUES (?,?,?)`, [timestamp,dateonly,plant_id,message])

    }).then(()=>connection.end())
}

function fetchPlantFromDev(id){
    createConnection(configj.dev_db)
    .then ((connection)=>
        connection.execute(`SELECT * FROM mas_sites WHERE id = ?`,[id])
    )
    .then(([rows])=>{
        connection.end()
        return rows

    })
} 

function insertIntomydb(c){
    createConnection(configj.my_db)
    .then((connection)=>{
        const sql = `INSERT INTO mas_sites (id,name,region_id_fk, asset_type_id_fk, created_on,created_by_fk,comm_date,lati,longi,unit_price,site_capacity,power_metric_fk,
        address,spv_id_fk,utr_num,store_address,contact_num,fax_num,num_of_turbines,price_unit,feeder_id_fk,isDataCollectionEnabled,alias_name,timezone_id_fk,effeciency,
        def_air_density,hcode,isMetMastAvailable) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        const values = [c.id,c.name,c.region_id_fk, c.asset_type_id_fk, c.created_on,c.created_by_fk,c.comm_date,c.lati,c.longi,c.unit_price,c.site_capacity,c.power_metric_fk,
            c.address,c.spv_id_fk,c.utr_num,c.store_address,c.contact_num,c.fax_num,c.num_of_turbines,c.price_unit,c.feeder_id_fk,c.isDataCollectionEnabled,c.alias_name,c.timezone_id_fk,c.effeciency,
            c.def_air_density,c.hcode,c.isMetMastAvailable]
        connection.query(sql,[c])
        .then(()=>{
            connection.end()
        })
    })

}

function main(count){
    let currentid=267
    new Promise((resolve,reject)=>{
        function allPlants(){
            if(currentid >= 267 + count){
                resolve()
            }

    const id = currentid++
    const t= date.now()
    const t1= t % 2000
    logtonewdb(`${id}` ,` Going to fetch ${id} from devdb`)
    .then(()=>
    Delay(t1))
    .then(()=>
    fetchPlantFromDev(id)
    )
    .then((c)=>{
        if(c.length==0){
            logtonewdb(`${id}` ,` no such ${id} present in table`)
            .then(()=> next())

        }
    })

    const plantid = c[0]
    .then(()=>{
        Delay(t1)
    })
    .then(()=>{
      logtonewdb ( `${id}` ,` fetched ${id} from devdb`)
    })
    .then(()=>{
        Delay(t1)
    })
    .then(()=>{
        logtonewdb(`${id}` ,` Going to insert ${id} into mydb`)
    })
    .then(()=>{Delay(t1)})
    .then(()=>{
        insertIntomydb(plantid)
    })
    .then(()=>{
        Delay(t1)
    })
    .then(()=>{
        logtonewdb(`${id}` ,`inserted ${id} into mydb`)
    })
.catch((error)=>{
    reject(error)
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
import { createConnection } from 'mysql2/promise';
import fs from 'fs';

const config = fs.readFileSync('config_dbs.json', 'utf-8')
const configj = JSON.parse(config)

function delayTime(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
   }

function delayTimelog(ms,plant_id = 10, plant_name = 'log', comnc_date = '2025-05-20', capacity = 0, message=null){
    if (ms>200){
        return logtotestdb ({ delayTime: ms,plant_id,plant_name,comnc_date,capacity,message})
            .then(()=> delayTime(ms))
    } else {
        return delayTime(ms)
    }

}

function logtotestdb({ delayTime, plant_id = 10, plant_name = 'log', comnc_date = '2025-05-20', capacity = 0, message=null }) {
    const offset = 330 * 60 * 1000;
    const timeStamp= Date.now() + offset;
    const dateOnly = new Date(timeStamp).toISOString()
    return createConnection(configj.dev_db)
    .then((connection)=>{
        return connection.execute(`INSERT INTO test_logs_swathi (ts,tdate,delay,plant_id,plant_name,comnc_date,capacity,description) VALUES (?,?,?,?,?,?,?,?)`, 
        [timeStamp,dateOnly, delayTime, plant_id, plant_name, comnc_date, capacity, message])
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
        const sql = `INSERT IGNORE INTO mas_sites (id,name,region_id_fk, asset_type_id_fk, created_on,created_by_fk,comm_date,lati,longi,unit_price,site_capacity,power_metric_fk,
        address,spv_id_fk,utr_num,store_address,contact_num,fax_num,num_of_turbines,price_unit,feeder_id_fk,isDataCollectionEnabled,alias_name,timezone_id_fk,effeciency,
        def_air_density,hcode,isMetMastAvailable) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        const values = [c.id,c.name,c.region_id_fk, c.asset_type_id_fk, c.created_on,c.created_by_fk,c.comm_date,c.lati,c.longi,c.unit_price,c.site_capacity,c.power_metric_fk,
            c.address,c.spv_id_fk,c.utr_num,c.store_address,c.contact_num,c.fax_num,c.num_of_turbines,c.price_unit,c.feeder_id_fk,c.isDataCollectionEnabled,c.alias_name,c.timezone_id_fk,c.effeciency,
            c.def_air_density,c.hcode,c.isMetMastAvailable]
       return connection.query(sql,values)
    })

}

function main(count){
    let currentid=295
    return new Promise((resolve,reject)=>{
        function allPlants(){
            if(currentid >= 295 + count){
               return resolve()
            }

            const id = currentid++
            // stage 1        
          delayTimelog(500,10, 'log',  '2025-05-20', 0, `Stage 1 - Waiting for 500 ms before fetching the plant`)
         .then(() =>{
            return logtotestdb({ delayTime: 500, plant_id: 10, plant_name: 'log', comnc_date: '2025-05-20' , capacity: 0, message: `going to fetch the plant of ${id} from devdb` })

        })
          .then(()=>{
             const t1= Date.now() % 2000
           return delayTimelog( t1, 10,  'log', '2025-05-20',  0, `Waiting for ${t1} to go to 2nd stage`)
            .then(()=>t1)
          })
            // stage 2
          .then((t1) => {
            return delayTimelog( t1, 10,  'log', '2025-05-20',  0, `stage 2- Waiting for ${t1} in 2nd  stage`)
            .then(()=>fetchPlantFromDev(id))
            .then((rows) => {
              if (rows.length === 0) {
                 return logtotestdb({ delayTime: t1, plant_id: 10, plant_name: 'log', comnc_date: '2025-05-20' , capacity: 0, message: `No such ${id} from devdb` })
                  .then(() => allPlants());
              }
              return {rows,id}
         
            })
        })
            .then(({rows,id})=>{      
              const t2 = Date.now() % 2000
              return delayTimelog( t2, 10,  'log', '2025-05-20',  0, `stage 2- Waiting for ${t2} to go to 3rd stage`)
             .then(()=>({t2,rows,id}))
            })
         
             //stage 3 
                .then(({t2,rows,id}) =>{
                    const row = rows[0]
                   return delayTimelog(t2, 10, 'log', '2025-05-20',0, `Stage 3 - Waiting for ${t2} in 3rd stage stage`)
                   .then(()=> { logtotestdb({ delayTime: t2, plant_id: row.id, plant_name: row.name, comnc_date: row.comm_date, capacity: row.site_capacity, message: ` plant is fetched with ${id} ` })})
                   .then(()=>({row,id}))
                })
                .then(({row,id})=>{
                const t3=Date.now() % 2000
                return delayTimelog(t3, 10,  'log',  '2025-05-20', 0, `Stage 3 - Waiting for ${t3} to go to 4th stage`)
                .then(()=>({t3,row,id}))
            })
           
                //stage 4
            .then(({t3,row,id}) =>{
               return delayTimelog(t3, 10, 'log', '2025-05-20',0, `Stage 4 - Waiting for ${t3} in 4th  stage`)
                .then(() => { logtotestdb({ delayTime: t3, plant_id: row.id, plant_name: row.name, comnc_date: row.comm_date, capacity: row.site_capacity, message: `Going to insert the plant of ${id} into mydb` })})
                .then(()=>({row,id}))
                })
         
            .then(({row,id})=>{
                const t4=Date.now() % 2000
                return delayTimelog(t4, 10,  'log',  '2025-05-20', 0, `Stage 4 - Waiting for ${t4} for 5th stage`)
                .then(()=>({t4,row,id}))
        })
                //stage 5
            .then(({t4,row,id}) => {
                   return delayTimelog(t4, 10, 'log',  '2025-05-20', 0, `Stage 5 - Waiting for ${t4} in 5th stage`)
                 .then(() => insertIntomydb(row))
                 .then(()=>({row,id}))
            })
                .then(({row,id})=>{
                const t5=Date.now() % 2000
                 return delayTimelog(t5, 10,  'log',  '2025-05-20', 0, `Stage 5 - Waiting for ${t5} for 6th stage`)
                    .then(()=>({t5,row,id}))
                })
                
                 //stage 6    
                .then(({t5,row,id}) => {

                 return delayTimelog(t5, 10, 'log', '2025-05-20',  0, `Stage 6 - Waiting for ${t5} in 6th  stage`)
                .then(()=>{logtotestdb({ delayTime: t5, plant_id: row.id, plant_name: row.name, comnc_date: row.comm_date, capacity: row.site_capacity, message: `Inserted the plant of ${id} into mydb` })})
            })
            .then(()=> {return allPlants()})
          .catch((error) => {
            return allPlants() 
          })

                }
                allPlants()
         
            })
         
        }

main(6)
.then(()=>{
    console.log("all the plant id are inserted")
})
.catch((error)=>{
    console.log(error)
})
import { createConnection } from 'mysql2/promise';
import fs from 'fs';

const config = fs.readFileSync('config_dbs.json', 'utf-8')
const configj = JSON.parse(config)

// function delayTime(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//    }

function delayTimelog(ms,plant_id = 10, plant_name = 'log', comnc_date = '2025-05-20', capacity = 0, message=null){
    return new Promise((resolve, reject) => {
    if (ms>200){
            logtotestdb({ delayTime: ms, plant_id, plant_name, comnc_date, capacity, message });
         setTimeout(resolve,ms)
    } else {
        setTimeout(resolve,ms)
    }
})
}

function avgCapacity(row) {
    createConnection(configj.dev_db)
    .then((connection) => {
        return connection.execute("SELECT site_capacity FROM mas_sites WHERE site_capacity > 50")})
        .then(([rows])=>{

        let total =0
        for (let i = 0; i < rows.length; i++) {
         total = total + rows[i].site_capacity
        }
        
        const average = total / rows.length                           
             let current = row.site_capacity 
            console.log("average", average)
            function loop() {
                if (current >= average) {
                    row.site_capacity = current
                   return logtotestdb({delayTime: 0,plant_id: row.id,plant_name: row.name,comnc_date: row.comm_date,capacity:current ,message: `capacity of plant ${row.id} is same as average`})
                } else {
                    current = current + 3

                    logtotestdb({delayTime: 0,plant_id: row.id,plant_name: row.name,comnc_date: row.comm_date,capacity:current ,message: `Incremented to ${current}`})
                    .then(() => {loop()})
                }
            }

           loop()
        })
}


function logtotestdb({ delayTime, plant_id = 10, plant_name = 'log', comnc_date = '2025-05-20', capacity = 0, message=null }) {
    
    return createConnection(configj.dev_db)
    .then((connection)=>{
    const offset = 330 * 60 * 1000;
    const timeStamp= Date.now() + offset;
    const dateOnly = new Date(timeStamp).toISOString()
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


function stage1(id) {
    return new Promise((resolve, reject) => {
    return delayTimelog(500,10, 'log',  '2025-05-20', 0, `Stage 1 - Waiting for 500 ms before fetching the plant`)
        .then(() => logtotestdb({delayTime: 0,plant_id: 10,plant_name: 'log',comnc_date: '2025-05-20',capacity: 0,message: `going to fetch the plant of ${id} from devdb`}))
        .then(() => {
            const t1 = Date.now() % 2000
            return delayTimelog(t1,10, 'log',  '2025-05-20', 0, `Stage 1 - Waiting for ${t1} for 2nd  stage`)
            .then(() => resolve({ id, t1 }))
        }).catch(reject)
})
}


function stage2({ id, t1 }) {
    return new Promise((resolve, reject) => {
    return delayTimelog(t1, 10, 'log', '2025-05-20', 0, `Stage 2 - Waiting for ${t1} in 2nd stage`)
        .then(() => fetchPlantFromDev(id))
        .then((rows) => {
            if (rows.length === 0) {
                return logtotestdb({ delayTime: t1, plant_id: 10, plant_name: 'log', comnc_date: '2025-05-20', capacity: 0, message: `No such ${id} from devdb` })
                    .then(() => resolve(null))
            }
            const row = rows[0]
            const t2 = Date.now() % 2000
            resolve( {id: id,row: row,t2: t2})
        }).catch(reject)
    })
}

function stage3({ id, row, t2}) {
    return new Promise((resolve, reject) => {
    return delayTimelog(t2, 10, 'log', '2025-05-20', 0, `Stage 3 - Waiting for ${t2} in 3rd stage`)
        .then(() => logtotestdb({ delayTime: t2, plant_id: row.id, plant_name: row.name, comnc_date: row.comm_date, capacity: row.site_capacity, message: `Plant is fetched with ${id}` }))
        .then(()=>avgCapacity(row))
        .then(() => {
            const t3 = Date.now() % 2000
            return delayTimelog(t3, 10, 'log', '2025-05-20', 0, `Stage 3 - Waiting for ${t3} to go to 4th stage`)
            .then(() => resolve({ id,row, t3 }))
        }).catch(reject)
})
}

function stage4({ id, row, t3 }) {
    return new Promise((resolve, reject) => {
    return delayTimelog(t3, 10, 'log', '2025-05-20', 0, `Stage 4 - Waiting for ${t3} in 4th stage`)
        .then(() => logtotestdb({ delayTime: t3, plant_id: row.id, plant_name: row.name, comnc_date: row.comm_date, capacity: row.site_capacity, message: `Going to insert the plant of ${id} into mydb` }))
        .then(() => {
            const t4 = Date.now() % 2000
            return delayTimelog(t4, 10, 'log', '2025-05-20', 0, `Stage 4 - Waiting for ${t4} for 5th stage`)
            .then(() => resolve ({ id, row, t4 }))
        }).catch(reject)
})
}

function stage5({ id, row, t4 }) {
    return new Promise((resolve, reject) => {
    return delayTimelog(t4, 10, 'log', '2025-05-20', 0, `Stage 5 - Waiting for ${t4} in 5th stage`)
        .then(() => insertIntomydb(row))
        .then(() => {
            const t5 = Date.now() % 2000
            return delayTimelog(t5, 10, 'log', '2025-05-20', 0, `Stage 5 - Waiting for ${t5} for 6th stage`)
            .then(() => resolve ({ id, row, t5 }))
        }).catch(reject)
})
}

function stage6({ id, row, t5 }) {
    return new Promise((resolve, reject) => {
    return delayTimelog(t5, 10, 'log', '2025-05-20', 0, `Stage 6 - Waiting for ${t5} in 6th stage`)
        .then(() => logtotestdb({ delayTime: t5, plant_id: row.id, plant_name: row.name, comnc_date: row.comm_date, capacity: row.site_capacity, message: `Inserted the plant of ${id} into mydb` }))
        .then(()=> resolve())
        .catch(reject)
})
}

function main(count) {
    let currentid = 295;
    return new Promise((resolve, reject) => {
        function allPlants() {
            if (currentid >= 295 + count) {
                return resolve()
            }
            const id = currentid++
            stage1(id)
                .then((result1) => {
                    return stage2(result1)
                })
                .then((result2) => {
                    return stage3(result2)
                })
                .then((result3) => {
                    return stage4(result3)
                })
                .then((result4) => {
                    return stage5(result4)
                })
                .then((result5) => {
                    return stage6(result5)
                })
                .then(() => {
                    return allPlants()
                })
                .catch((error) => {
                    return allPlants()
                })
        }
        allPlants()
    })
}


main(2)
    .then(() => {
        console.log("all plants processed")
    })
    .catch((error) => {
        console.log(error)
    });
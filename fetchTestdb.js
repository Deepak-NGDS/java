import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import  {format} from "date-fns"

const config = fs.readFileSync('config_db.json', 'utf-8')
const configj = JSON.parse(config)

function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
   }
async function logtonewdb() {
    const connection = createConnection(configj.new_db)
    const timestamp = format(new Date(), 'YYYY-MM-DD HH:MM:SS')
    const id = 
    await connection.execute(`INSERT INTO test_logs(ts,tdate,plantid,plantname,description) VALUES (?,?,?,?,?)`, [timestamp,timestamp,id,plantname,message])
    await connection.close()
}


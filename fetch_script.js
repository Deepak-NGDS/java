import mysql from 'mysql2/promise';
const dbConfig = {
  host: "35.244.19.98",
  user: "hubber",
  password: "VenaHub@18",
  database: "mhub",
};
const tables = ["dat_ser_orders", "dat_ser_orders_log", "dat_ser_orders_assets", "dat_ser_order_files"];
async function fetchYesterdayData(table) {
  try {
    if (!tables.includes(table)) {
      throw new Error("Invalid table name");
    }
    const connection = await mysql.createConnection(dbConfig);  //connect to mysql database
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE DATE(created_on) = ?`,[yesterdayStr] ); // executing the query
    await connection.end();
    //return the  data
    return { table,
      date: yesterdayStr,
      records: rows.length,
      data: rows,
    };
  } catch (err) {
    console.error("Error:", err.message);
    return { error: err.message };
  }
}

async function main() {
  try {
    const data = await fetchYesterdayData("dat_ser_orders_log");
    console.log("Fetched Data:", JSON.stringify(data));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();

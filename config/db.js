import mysql from "mysql2";

// año actual
const date = new Date().getFullYear();

const pool = mysql.createPool({
  host: process.env.APP_SERVER,
  user: process.env.APP_USER,
  password: process.env.APP_PASSWORD,
  port: 3306,
  database: `${process.env.APP_DATABASE}${date}`,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

const connectionPool = pool.promise();

export default connectionPool;

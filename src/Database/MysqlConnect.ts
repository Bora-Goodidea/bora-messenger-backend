import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export default mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 5000,
    connectionLimit: 30, //default 10
})

import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Logger } from '@Logger'

dotenv.config()

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    logging: false,
    entities: [__dirname + '/Entities/*.{ts,js}'],
    migrations: [__dirname + '/Migrations/*.{ts,js}'],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
        Logger.console('Data Source has been initialized!')
    })
    .catch((err) => {
        Logger.error('Error during Data Source initialization', err)
    })
export default AppDataSource

import dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

export default {
    APP_NAME: process.env.APP_NAME,
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_LOGGING: process.env.MYSQL_LOGGING,
    MYSQL_SYNCHRONIZE: process.env.MYSQL_SYNCHRONIZE,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    ACCESS_TOKEN_EXPIRESIN: process.env.ACCESS_TOKEN_EXPIRESIN,
    REFRESH_TOKEN_EXPIRESIN: process.env.REFRESH_TOKEN_EXPIRESIN,
    SFTP_HOST: process.env.SFTP_HOST,
    SFTP_PORT: process.env.SFTP_PORT,
    SFTP_USERNAME: process.env.SFTP_USERNAME,
    SFTP_PASSWORD: process.env.SFTP_PASSWORD,
    SFTP_FILE_DEST_PATH_ROOT: process.env.SFTP_FILE_DEST_PATH_ROOT,
    SFTP_FILE_DEST_PATH: process.env.SFTP_FILE_DEST_PATH,
    MEDIA_HOSTNAME: process.env.MEDIA_HOSTNAME,
}

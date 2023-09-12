import winston from 'winston'
import Config from '@Config'
import fs from 'fs'

const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        sql: 4,
        debug: 5,
    },
    colors: {
        error: 'red',
        warn: 'darkred',
        info: 'white',
        http: 'green',
        sql: 'blue',
        debug: 'gray',
    },
}

const logYear = new Date().getFullYear()
const logMonth = ('00' + (new Date().getMonth() + 1).toString()).slice(-2)
const logDay = ('00' + new Date().getDate().toString()).slice(-2)
const logHour = ('00' + new Date().getHours().toString()).slice(-2)
const logMinute = ('00' + new Date().getMinutes().toString()).slice(-2)
const logSec = ('00' + new Date().getSeconds().toString()).slice(-2)

/**
 * The logger service wrapper.
 */
const logger = winston.createLogger({
    // format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.align(),
        winston.format.printf((info) => {
            const { timestamp, level, message, ...extra } = info

            return `${timestamp} [${level}]: ${message} ${Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''}`
        }),
    ),
    transports: [
        new winston.transports.Console({
            level: 'warn' /* error & warn logs will be logged to console. */,
        }),
        new winston.transports.File({
            filename: `storage/logs/${logYear}${logMonth}/${logYear}-${logMonth}-${logDay}-errors.log`,
            level: 'error' /* only error logs will be logged to the file. */,
            options: {
                createDirectory: true /* Create directory and file if not exists. */,
                flags: 'a' /* `a` for append to the file, `w` for overwrite file on every app-start, default is `w`. */,
            },
        }),
        new winston.transports.File({
            filename: `storage/logs/${logYear}${logMonth}/${logYear}-${logMonth}-${logDay}-logs.log`,
            level: 'info' /* error, warn, & info logs will be logged to the file. */,
            options: {
                createDirectory: true /* Create directory and file if not exists. */,
                flags: 'a' /* `a` for append to the file, `w` for overwrite file on every app-start, default is `w`. */,
            },
        }),
    ],
})

/**
 * A console only logger.
 */
winston.addColors(logLevels.colors)
const consoleLogger = winston.createLogger({
    // format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.json()),

    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.align(),
        winston.format.printf((info) => {
            const { timestamp, level, message, ...extra } = info

            return `${timestamp} [${level}]: ${message} ${Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''}`
        }),
    ),
    transports: [
        new winston.transports.Console({
            level: 'silly' /* error, warn, info, verbose, debug & silly logs will be logged to console. */,
        }),
    ],
})

/**
 * The logging service that includes functionalities to log any error, info or warnings.
 */
export class Logger {
    /**
     * Logs an error message and error stack to the logs `logs/errors.log` file.
     * @param message The error message to be logged.
     * @param error The Error object to log its stack if it was an exception.
     */
    public static error(message: string, error?: Error): void {
        const meta = { stack: error ? error.stack : '' }
        logger.error(message, error ? meta : null)
    }

    /**
     * Logs a warning message to the logs `logs/logs.log` file.
     * @param message The warning message to be logged.
     * @param meta An optional additional warning data.
     */
    public static warn(message: string, meta?: unknown): void {
        logger.warn(message, meta)
    }

    /**
     * Logs a info message to the logs `logs/logs.log` file.
     * @param message The info message to be logged.
     * @param meta An optional additional info data.
     * @param logToConsole Makes sure if it safe to log this info to the console.
     * Could be used to keep sensitive data safe from being logged to the console.
     */
    public static info(message: string, meta?: unknown, logToConsole?: boolean): void {
        logger.info(message, meta)

        /* Make sure if it safe to log this info to the console. */
        if (logToConsole && Config.APP_ENV !== 'production') {
            consoleLogger.info(message, meta)
        }
    }

    /**
     * console log
     * @param message
     * @param meta
     */
    public static console(message: string, meta?: unknown): void {
        if (Config.APP_ENV === 'production') {
            logger.info(`console log: ${message}`, meta)
        } else {
            consoleLogger.info(message, meta)
        }
    }
}

/**
 * morgan log
 */
export const AccessLogStream = fs.createWriteStream(`storage/logs/${logYear}${logMonth}/${logYear}-${logMonth}-${logDay}-access.log`, { flags: 'a' })

export const LogDateTime = () => `${logYear}-${logMonth}-${logDay} ${logHour}:${logMinute}:${logSec}`

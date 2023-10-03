import express, { Application } from 'express';
import path from 'path';
import _ from 'lodash';
import fs from 'fs';
import { TestsRouter, SystemRouter, AuthRouter, MemberRouter, MediaRouter, MessengerRouter } from '@Routes/Api';
import { RestDefaultMiddleware } from '@Middlewares/RestDefaultMiddleware';
import { DefaultRouter as DefaultWebRouter, AuthRouter as AuthWebRouter } from '@Routes/Web';
import { Logger, AccessLogStream, LogDateTime } from '@Logger';
import Config from '@Config';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileupload from 'express-fileupload';
import morgan from 'morgan';
import AppDataSource from '@Database/AppDataSource';

export const checkEnvironment = (): { state: boolean; message: string } => {
    const envFileExist = fs.existsSync('.env');

    if (!envFileExist) {
        return {
            state: false,
            message: `Environment File not found...`,
        };
    }

    const ConfigList: string[] = Object.keys(Config);

    const envCheck = ConfigList.map((e) => {
        if (_.has(Config, e) && _.isEmpty(String(_.get(Config, e)))) {
            return e;
        }
    }).filter((e) => e);

    if (envCheck.length > 0) {
        return {
            state: false,
            message: `${envCheck.join(', ')} Environment Not Found...........`,
        };
    }

    return {
        state: true,
        message: `check end `,
    };
};

// 라우터 등록
const addRouters = (app: Application): void => {
    const baseApiRoute = '/api';
    const baseWebRoute = '/web';
    /* apiRoute */
    app.use(`${baseApiRoute}/tests`, TestsRouter);
    app.use(`${baseApiRoute}/system`, RestDefaultMiddleware, SystemRouter);
    app.use(`${baseApiRoute}/auth`, RestDefaultMiddleware, AuthRouter);
    app.use(`${baseApiRoute}/member`, RestDefaultMiddleware, MemberRouter);
    app.use(`${baseApiRoute}/media`, RestDefaultMiddleware, MediaRouter);
    app.use(`${baseApiRoute}/messenger`, RestDefaultMiddleware, MessengerRouter);

    /* webRoute */
    app.use(`${baseWebRoute}/auth`, AuthWebRouter);
    app.use(`/`, DefaultWebRouter);
};

// 서버 초기화 설정.
export const initServer = (app: Application, Path: string): void => {
    morgan.token('timestamp', () => {
        return LogDateTime();
    });

    app.set('view engine', 'pug');
    app.set('views', path.join(Path, 'Resources/view'));
    app.set('AppRootDir', Path);
    app.use(express.static(path.join(Path, 'Resources/public')));

    app.use(
        morgan(':remote-addr - :remote-user [:timestamp] ":method :url HTTP/:http-version" :status :res[content-length]', {
            stream: AccessLogStream,
        }),
    );

    app.use(
        cors({
            origin: '*',
        }),
    );

    app.locals.user = {
        auth: false,
        user_id: 0,
        email: '',
        status: '',
        level: '',
    };

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(
        fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
        }),
    );

    addRouters(app);
    return;
};

// 서버 시작.
export const startServer = async (app: Application) => {
    Logger.console(``);
    const port = Number(Config.PORT);
    const appName = Config.APP_NAME;
    const appEnv = Config.APP_ENV;

    const AppDatainit = await AppDataSource.initialize();

    if (!AppDatainit.isInitialized) {
        Logger.error(`Database Init Error`);
        return;
    } else {
        Logger.warn(`:: Database Init Success ::`);
    }

    app.listen(port, () => {
        Logger.console(``);
        Logger.console(`Running Name  - ${appName}`);
        Logger.console(`Running Environment - ${appEnv}`);
        Logger.console(`Running on port - ${port}`);
        Logger.console(``);
        Logger.warn(`:: Server Start Success ::`);
        Logger.console(``);
    });
};

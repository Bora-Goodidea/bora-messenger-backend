import { Router } from 'express';
import { Default } from '@Controllers/Api/TestController';
import { CheckStatus, BaseData, ErrorTest } from '@Controllers/Api/SystemController';
import { EmailExist, NickNameExist } from '@Controllers/Api/AuthController';

export const TestsRouter = Router();
export const SystemRouter = Router();
export const AuthRouter = Router();

/* 테스트 Router */
TestsRouter.get('/default', Default);

/* System Router */
SystemRouter.get('/check-status', CheckStatus);
SystemRouter.get('/base-data', BaseData);
SystemRouter.get('/error-test', ErrorTest);

/* Auth Router */
AuthRouter.get('/:email/email-exist', EmailExist);
AuthRouter.get('/:nickname/nickname-exist', NickNameExist);

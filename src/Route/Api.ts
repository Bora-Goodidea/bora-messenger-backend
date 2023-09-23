import { Router } from 'express';
import { Default } from '@Controllers/Api/TestController';
import { CheckStatus, BaseData, ErrorTest, SystemNotice } from '@Controllers/Api/SystemController';
import {
    EmailExists,
    NickNameExists,
    Register,
    Login,
    EmailAuth,
    PasswordReset,
    PasswordChange,
    PasswordResetCodeCheck,
    TokenInfo,
} from '@Controllers/Api/AuthController';
import { RestAuthenticateMiddleware } from '@Middlewares/RestAuthenticateMiddleware';
import { MyProfile } from '@Controllers/Api/MemberController';
import { ImageCreate } from '@Controllers/Api/MediaController';

export const TestsRouter = Router();
export const SystemRouter = Router();
export const AuthRouter = Router();
export const MemberRouter = Router();
export const MediaRouter = Router();

/* 테스트 Router */
TestsRouter.get('/default', Default);

/* System Router */
SystemRouter.get('/check-status', CheckStatus);
SystemRouter.get('/base-data', BaseData);
SystemRouter.get('/error-test', ErrorTest);
SystemRouter.get('/notice', SystemNotice);

/* Auth Router */
AuthRouter.get('/:email/email-exists', EmailExists);
AuthRouter.get('/:nickname/nickname-exists', NickNameExists);
AuthRouter.post('/register', Register);
AuthRouter.post('/login', Login);
AuthRouter.get('/:authCode/email-auth', EmailAuth);
AuthRouter.get('/:resetEmail/password-reset', PasswordReset);
AuthRouter.get('/:resetCode/password-reset-code-check', PasswordResetCodeCheck);
AuthRouter.post('/:resetCode/password-change', PasswordChange);
AuthRouter.get('/token-info', RestAuthenticateMiddleware, TokenInfo);

/* Member Router */
MemberRouter.get('/my-profile', RestAuthenticateMiddleware, MyProfile);

/* Media Router */
MediaRouter.post('/image-create', RestAuthenticateMiddleware, ImageCreate);

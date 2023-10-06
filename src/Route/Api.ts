import { Router } from 'express';
import { Default, RandomString } from '@Controllers/Api/TestController';
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
    TokenRefresh,
} from '@Controllers/Api/AuthController';
import { RestAuthenticateMiddleware } from '@Middlewares/RestAuthenticateMiddleware';
import { MyProfile, ProfileEdit, Members } from '@Controllers/Api/MemberController';
import { ImageCreate } from '@Controllers/Api/MediaController';
import { MessengerChatList, MessengerCreate, MessengerRoomList, MessengerChatChecked } from '@Controllers/Api/MessengerController';

export const TestsRouter = Router();
export const SystemRouter = Router();
export const AuthRouter = Router();
export const MemberRouter = Router();
export const MediaRouter = Router();
export const MessengerRouter = Router();

/* 테스트 Router */
TestsRouter.get('/default', Default);
TestsRouter.get('/rand-string', RandomString);

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
AuthRouter.post('/token-refresh', TokenRefresh);

/* Member Router */
MemberRouter.get('/my-profile', RestAuthenticateMiddleware, MyProfile);
MemberRouter.post('/profile-update', RestAuthenticateMiddleware, ProfileEdit);
MemberRouter.get('/member-list', RestAuthenticateMiddleware, Members);

/* Media Router */
MediaRouter.post('/image-create', RestAuthenticateMiddleware, ImageCreate);

/* Messenger Router */
MessengerRouter.post('/messenger-create', RestAuthenticateMiddleware, MessengerCreate);
MessengerRouter.get('/messenger-room-list', RestAuthenticateMiddleware, MessengerRoomList);
MessengerRouter.get('/:roomCode/chart-list', RestAuthenticateMiddleware, MessengerChatList);
MessengerRouter.post('/chart-checked', RestAuthenticateMiddleware, MessengerChatChecked);

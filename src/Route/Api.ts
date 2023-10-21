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
import { MyProfile, ProfileEdit, UserList, YourProfile } from '@Controllers/Api/UserController';
import { ImageCreate } from '@Controllers/Api/MediaController';
import {
    MessengerChatList,
    MessengerCreate,
    MessengerRoomList,
    MessengerChatChecked,
    MessengerChatCreate,
    MessengerUserRoomList,
    messengerRoomOut,
} from '@Controllers/Api/MessengerController';

export const TestsRouter = Router();
export const SystemRouter = Router();
export const AuthRouter = Router();
export const UserRouter = Router();
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

/* User Router */
UserRouter.get('/my-profile', RestAuthenticateMiddleware, MyProfile);
UserRouter.post('/profile-update', RestAuthenticateMiddleware, ProfileEdit);
UserRouter.get('/user-list', RestAuthenticateMiddleware, UserList);
UserRouter.get('/:profileUid/profile', RestAuthenticateMiddleware, YourProfile);

/* Media Router */
MediaRouter.post('/image-create', RestAuthenticateMiddleware, ImageCreate);

/* Messenger Router */
MessengerRouter.post('/messenger-create', RestAuthenticateMiddleware, MessengerCreate);
MessengerRouter.get('/messenger-room-list', RestAuthenticateMiddleware, MessengerRoomList);
MessengerRouter.get('/:roomCode/chart-list', RestAuthenticateMiddleware, MessengerChatList);
MessengerRouter.post('/chart-checked', RestAuthenticateMiddleware, MessengerChatChecked);
MessengerRouter.post('/:roomCode/messenger-chat-create', RestAuthenticateMiddleware, MessengerChatCreate);
MessengerRouter.get('/messenger-user-room-list', RestAuthenticateMiddleware, MessengerUserRoomList);
MessengerRouter.post('/:roomCode', RestAuthenticateMiddleware, messengerRoomOut);

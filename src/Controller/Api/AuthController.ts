import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessDefault, SuccessResponse } from '@Commons/ResponseProvider';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import Messages from '@Messages';
import { emailValidator } from '@Helper';
import { emailExists, nickNameExists, userCreate, getUserForLogin, emailVerified } from '@Database/Service/UserService';
import { emailAuthSave, getData, authentication } from '@Service/EmailAuthService';
import { v4 as uuidv4 } from 'uuid';
import Config from '@Config';
import MailSender from '@Commons/MailSender';
import { generateLoginToken } from '@TokenManager';

// 이메일 중복 체크
export const EmailExists = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.params;

    const checkEmail = decodeURIComponent(email);

    if (_.isEmpty(checkEmail)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    if (!emailValidator(checkEmail)) {
        return ClientErrorResponse(res, Messages.auth.register.emailValidate);
    }

    // 이메일 중복 체크
    const emailCheck = await emailExists({ email: checkEmail });
    if (emailCheck > 0) {
        return SuccessResponse(res, { email: checkEmail, exist: true });
    } else {
        return SuccessResponse(res, { email: checkEmail, exist: false });
    }
};

// 닉네임 중복 체크
export const NickNameExists = async (req: Request, res: Response): Promise<Response> => {
    const { nickname } = req.params;

    if (_.isEmpty(nickname)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    // 닉네임 중복 체크
    const nicknameCheck = await nickNameExists({ nickname: nickname });
    if (nicknameCheck > 0) {
        return SuccessResponse(res, { nickname: nickname, exist: true });
    } else {
        return SuccessResponse(res, { nickname: nickname, exist: false });
    }
};

// 회원가입
export const Register = async (req: Request, res: Response): Promise<Response> => {
    const authCode = uuidv4();
    const { email, password, nickname } = req.body;

    if (_.isEmpty(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    if (_.isEmpty(password)) {
        return ClientErrorResponse(res, Messages.auth.register.passwordEmpty);
    }

    if (_.isEmpty(nickname)) {
        return ClientErrorResponse(res, Messages.auth.register.nicknameEmpty);
    }

    if (!emailValidator(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailValidate);
    }

    // 이메일 중복 체크
    const emailCheck = await emailExists({ email: email });
    if (emailCheck > 0) {
        return ClientErrorResponse(res, Messages.auth.register.emailExits);
    }

    const task = await userCreate({
        type: `${req.headers['client-type']}`,
        level: `030010`,
        status: `020010`,
        email: email,
        password: `${bcrypt.hashSync(password, Number(Config.BCRYPT_SALT))}`,
        nickname: `${email.split('@')[0].toLowerCase().replace(' ', _)}_${Math.floor(Date.now() / 1000)}`,
    });

    await emailAuthSave({
        user_id: task.id,
        authCode: authCode,
    });

    if (Config.APP_ENV === 'production') {
        MailSender.SendEmailAuth({
            ToEmail: email,
            EmailAuthCode: authCode,
        });
    }

    const payload: { email: string; nickname: string; authcode?: string; authlink?: string } = {
        email: task.email,
        nickname: task.nickname,
        authcode: authCode,
        authlink: Config.PORT
            ? `${Config.HOSTNAME}:${Config.PORT}/web/auth/emailauth/${authCode}`
            : `${Config.HOSTNAME}/web/auth/emailauth/${authCode}`,
    };

    if (Config.APP_ENV === 'development') {
        delete payload.authcode;
        delete payload.authlink;
    }

    return SuccessResponse(res, payload);
};

// 로그인
export const Login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (_.isEmpty(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    if (!emailValidator(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailValidate);
    }

    if (_.isEmpty(password)) {
        return ClientErrorResponse(res, Messages.auth.register.passwordEmpty);
    }

    const findUser = await getUserForLogin({ email: email });

    if (findUser) {
        if (findUser.emailauth && findUser.emailauth.status === 'Y') {
            const checkPassword = await bcrypt.compare(password, findUser.password);
            if (checkPassword) {
                const genToken = await generateLoginToken({ user_id: findUser.id, email: email });
                return SuccessResponse(res, { access_token: genToken.accessToken, refresh_token: genToken.refreshToken });
            } else {
                return ClientErrorResponse(res, Messages.auth.login.checkPassword);
            }
        } else {
            return ClientErrorResponse(res, Messages.auth.login.mustEmailAuth);
        }
    } else {
        return ClientErrorResponse(res, Messages.auth.login.userExits);
    }
};

// 이메일 인증
export const EmailAuth = async (req: Request, res: Response): Promise<Response> => {
    const { authCode } = req.params;

    const selectData = await getData({ authCode: authCode });

    if (selectData) {
        const { id, user_id, status, user } = selectData;

        if (status === 'Y') {
            res.render('emailAuth', { message: Messages.auth.emailAuth.alreadyCode });
        } else if (!user) {
            res.render('emailAuth', { message: Messages.auth.emailAuth.emptyUser });
        } else {
            const step1 = await authentication({ id: id });
            const step2 = await emailVerified({ id: user_id });

            if (step1 && step2) {
                return SuccessDefault(res);
            } else {
                return ClientErrorResponse(res, Messages.error.serverError);
            }
        }
    }
    return ClientErrorResponse(res, Messages.auth.emailAuth.authCodeExits);
};

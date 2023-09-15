import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider';
import _ from 'lodash';
import Messages from '@Messages';
import { emailValidator } from '@Helper';
import { emailExist, nickNameExist } from '@Database/Service/UserService';

// 이메일 중복 체크
export const EmailExist = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;

    const checkEmail = decodeURIComponent(email);

    if (_.isEmpty(checkEmail)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    if (!emailValidator(checkEmail)) {
        ClientErrorResponse(res, Messages.auth.register.emailValidate);
    }

    // 이메일 중복 체크
    const emailCheck = await emailExist({ email: checkEmail });
    if (emailCheck > 0) {
        SuccessResponse(res, { email: checkEmail, exist: true });
    } else {
        SuccessResponse(res, { email: checkEmail, exist: false });
    }
};

// 닉네임 중복 체크
export const NickNameExist = async (req: Request, res: Response): Promise<void> => {
    const { nickname } = req.params;

    if (_.isEmpty(nickname)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    // 닉네임 중복 체크
    const nicknameCheck = await nickNameExist({ nickname: nickname });
    if (nicknameCheck > 0) {
        SuccessResponse(res, { nickname: nickname, exist: true });
    } else {
        SuccessResponse(res, { nickname: nickname, exist: false });
    }
};

// 회원가입
export const Register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, nickname } = req.body;

    if (_.isEmpty(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty);
    }

    if (_.isEmpty(password)) {
        ClientErrorResponse(res, Messages.auth.register.passwordEmpty);
    }

    if (_.isEmpty(nickname)) {
        ClientErrorResponse(res, Messages.auth.register.nicknameEmpty);
    }

    if (!emailValidator(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailValidate);
    }

    // 이메일 중복 체크

    SuccessResponse(res, { test: 'test' });
};

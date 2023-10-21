import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import Config from '@Config';
import bcrypt from 'bcrypt';
import { createToken, getTokenInfo, tokenLogout, tokenUpdate, userCheck } from '@Service/AuthTokenService';
import _ from 'lodash';
import { Logger } from '@Logger';

dotenv.config();

/**
 * 로그인 토큰 생성
 * @param user_id
 * @param email
 */
export const generateLoginToken = async ({ user_id, email }: { user_id: number; email: string }) => {
    const token = bcrypt.hashSync(`${email}`, Number(Config.BCRYPT_SALT));

    const userTokenCheck = await userCheck({ user_id: user_id });

    if (userTokenCheck) {
        await tokenUpdate({ id: userTokenCheck.id, token: token });
    } else {
        await createToken({ token: token, user_id: user_id });
    }

    return {
        accessToken: jsonwebtoken.sign({ token: token }, Config.SECRET_KEY ? Config.SECRET_KEY : 'secret', {
            expiresIn: `${Config.ACCESS_TOKEN_EXPIRESIN}`,
        }),
        refreshToken: jsonwebtoken.sign({ token: token }, Config.SECRET_KEY ? Config.SECRET_KEY : 'secret', {
            expiresIn: `${Config.REFRESH_TOKEN_EXPIRESIN}`,
        }),
    };
};

/**
 * 토큰 확인
 * @param token
 */
export const verifyToken = ({ token }: { token: string }): { status: boolean; token: string } => {
    try {
        const verify = jsonwebtoken.verify(token, Config.SECRET_KEY ? Config.SECRET_KEY : 'secret') as {
            token: string;
        };
        return {
            status: true,
            token: verify.token,
        };
    } catch (e) {
        Logger.error(`refreshToken generate error token: ${token}`);
        Logger.error(`refreshToken generate error`, e as Error);
        return {
            status: true,
            token: ``,
        };
    }
};

/**
 * 로그인 토큰 로그 아웃 처리
 * @param token
 */
export const revokeLogtinToken = async ({ token }: { token: string }): Promise<boolean> => {
    const verify = verifyToken({ token: token });

    if (verify && _.has(verify, 'token')) {
        await tokenLogout({ token: verify.token });
        return true;
    } else {
        return false;
    }
};

/**
 * 토른 refresh
 * @param refreshToken
 */
export const tokenRefresh = async ({
    refreshToken,
}: {
    refreshToken: string;
}): Promise<{
    status: boolean;
    accessToken: string;
    refreshToken: string;
}> => {
    const verify = verifyToken({ token: refreshToken });

    if (verify.status) {
        const tokenInfo = await getTokenInfo({ token: verify.token });
        if (tokenInfo && tokenInfo.user && tokenInfo.user.email) {
            try {
                const genToken = await generateLoginToken({ user_id: tokenInfo.user_id, email: tokenInfo.user.email });
                return {
                    status: true,
                    accessToken: genToken.accessToken,
                    refreshToken: genToken.refreshToken,
                };
            } catch (e) {
                Logger.error(`refreshToken generate error refreshToken: ${refreshToken}`);
                Logger.error(`refreshToken generate error`, e as Error);
                return {
                    status: false,
                    accessToken: ``,
                    refreshToken: ``,
                };
            }
        } else {
            Logger.error(`refreshToken get tokenInfo error refreshToken: ${refreshToken}`);
            return {
                status: false,
                accessToken: ``,
                refreshToken: ``,
            };
        }
    } else {
        Logger.error(`refreshToken verify error: refreshToken: ${refreshToken}`);
        return {
            status: false,
            accessToken: ``,
            refreshToken: ``,
        };
    }
};

/**
 * 토큰 정보
 * @param token
 */
export const tokenInfo = async ({
    token,
}: {
    token: string;
}): Promise<{
    status: boolean;
    token?: {
        status: string;
        user: {
            user_id: number;
            uid: string;
            email: string;
            status: string;
            level: string;
        };
    };
}> => {
    const verify = verifyToken({ token: token });

    if (verify.status) {
        const tokenInfo = await getTokenInfo({ token: verify.token });
        if (tokenInfo && tokenInfo.user) {
            return {
                status: true,
                token: {
                    status: tokenInfo.status,
                    user: {
                        user_id: tokenInfo.user.id,
                        uid: tokenInfo.user.uid,
                        email: tokenInfo.user.email,
                        status: tokenInfo.user.status,
                        level: tokenInfo.user.level,
                    },
                },
            };
        } else {
            Logger.error(`token verify: ${JSON.stringify(tokenInfo)}`);
            return {
                status: false,
            };
        }
    } else {
        Logger.error(`token verify: ${JSON.stringify(verify)}`);
        return {
            status: false,
        };
    }
};

/**
 * 토큰 사용자 정보
 * @param token
 */
export const tokenUser = async ({
    token,
}: {
    token: string;
}): Promise<{
    status: boolean;
    userid?: number;
}> => {
    const verify = verifyToken({ token: token });

    if (verify.status) {
        const tokenInfo = await getTokenInfo({ token: verify.token });
        if (tokenInfo && tokenInfo.user) {
            return {
                status: true,
                userid: tokenInfo.user.id,
            };
        } else {
            Logger.error(`token verify: ${JSON.stringify(tokenInfo)}`);
            return {
                status: false,
            };
        }
    } else {
        Logger.error(`token user verify: ${JSON.stringify(verify)}`);
        return {
            status: false,
        };
    }
};

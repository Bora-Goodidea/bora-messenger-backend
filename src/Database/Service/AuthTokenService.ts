import AppDataSource from '@Database/AppDataSource';
import { AuthToken } from '@Entity/AuthToken';
import { toMySqlDatetime } from '@Helper';
import { UpdateResult } from 'typeorm';

const authTokenRepository = AppDataSource.getRepository(AuthToken);

/**
 * 토큰 등록
 * @param user_id
 * @param token
 */
export const createToken = async ({ user_id, token }: { user_id: number; token: string }): Promise<AuthToken> => {
    return authTokenRepository.save(
        {
            user_id: user_id,
            token: token,
        },
        { transaction: false, data: false },
    );
};

/**
 * 토큰 사용자 체크
 * @param user_id
 */
export const userCheck = async ({ user_id }: { user_id: number }): Promise<AuthToken | null> => {
    return authTokenRepository.findOne({
        select: ['id', 'token', 'status', 'user'],
        where: { user_id: user_id },
        relations: ['user'],
    });
};

/**
 * 토큰 업데이트
 * @param id
 * @param token
 */
export const tokenUpdate = async ({ id, token }: { id: number; token: string }): Promise<UpdateResult> => {
    return authTokenRepository.update({ id: id }, { token: token, status: 'Y', verified_at: toMySqlDatetime(new Date()) });
};

/**
 * 로그아웃 처리
 * @param token
 */
export const tokenLogout = async ({ token }: { token: string }): Promise<UpdateResult> => {
    return authTokenRepository.update({ token: token }, { status: 'N', verified_at: toMySqlDatetime(new Date()) });
};

export const getTokenInfo = async ({ token }: { token: string }): Promise<AuthToken | null> => {
    return authTokenRepository.findOne({
        select: ['id', 'token', 'status', 'user'],
        where: { token: token },
        relations: ['user'],
    });
};

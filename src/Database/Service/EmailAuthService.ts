import AppDataSource from '@Database/AppDataSource';
import { EmailAuth } from '@Entity/EmailAuth';
import { toMySqlDatetime } from '@Helper';
import { UpdateResult } from 'typeorm';

const emailAuthRepository = AppDataSource.getRepository(EmailAuth);

/**
 * 이메일 인증키 등록
 * @param user_id
 * @param authCode
 */
export const emailAuthSave = async ({ user_id, authCode }: { user_id: number; authCode: string }): Promise<EmailAuth> => {
    return emailAuthRepository.save(
        {
            user_id: user_id,
            auth_code: authCode,
        },
        { transaction: false, data: false },
    );
};

/**
 * 인증 데이터 등록
 * @param authCode
 */
export const getData = async ({ authCode }: { authCode: string }): Promise<EmailAuth | null> => {
    return emailAuthRepository.findOne({
        select: ['id', 'user_id', 'auth_code', 'status', 'user'],
        where: { auth_code: authCode },
        relations: ['user'],
    });
};

/**
 * 인증 완료 처리
 * @param id
 */
export const authentication = async ({ id }: { id: number }): Promise<UpdateResult> => {
    return emailAuthRepository.update({ id: id }, { status: 'Y', verified_at: toMySqlDatetime(new Date()) });
};

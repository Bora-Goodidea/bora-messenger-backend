import { UpdateResult } from 'typeorm';
import { Users } from '@Entity/Users';
import AppDataSource from '@Database/AppDataSource';
import { toMySqlDatetime } from '@Helper';

const userRepository = AppDataSource.getRepository(Users);

/**
 * 이메일 중복 체크
 * @param email
 */
export const emailExists = async ({ email }: { email: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { email: email } });

    return task.length;
};

/**
 * 닉네임 중복 체크
 * @param nickname
 */
export const nickNameExists = async ({ nickname }: { nickname: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { nickname: nickname } });

    return task.length;
};

/**
 * 사용자 등록
 * @param type
 * @param level
 * @param status
 * @param email
 * @param password
 * @param nickname
 */
export const userCreate = async ({
    type,
    level,
    status,
    email,
    password,
    nickname,
}: {
    type: string;
    level: string;
    status: string;
    email: string;
    password: string;
    nickname: string;
}): Promise<Users> => {
    return userRepository.save(
        {
            type: type,
            level: level,
            status: status,
            email: email,
            password: password,
            nickname: nickname,
        },
        { transaction: false, data: false },
    );
};

/**
 * 로그인용 회원 정보 조회
 * @param email
 */
export const getUserForLogin = async ({ email }: { email: string }): Promise<Users | null> => {
    return await userRepository.findOne({
        select: [`id`, `email`, 'password', `status`, 'nickname'],
        where: { email: email },
        relations: ['emailauth'],
    });
};

/**
 * 이메인 인증 처리.
 * @param id
 */
export const emailVerified = async ({ id }: { id: number }): Promise<UpdateResult> => {
    return userRepository.update({ id: id }, { status: '020020', email_verified_at: toMySqlDatetime(new Date()) });
};

/**
 * 이메일 사용자 정보
 * @param email
 */
export const getUserByEmail = async ({ email }: { email: string }): Promise<Users | null> => {
    return await userRepository.findOne({ where: { email: email } });
};

/**
 * 비밀 번호 변경
 * @param id
 * @param password
 */
export const changePassword = async ({ id, password }: { id: number; password: string }): Promise<UpdateResult> => {
    return await userRepository.update({ id: id }, { password: password, updated_at: toMySqlDatetime(new Date()) });
};

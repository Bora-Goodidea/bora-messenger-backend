import { Users } from '@Entity/Users';
import AppDataSource from '@Database/AppDataSource';
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

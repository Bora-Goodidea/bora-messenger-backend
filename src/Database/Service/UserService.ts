import { Users } from '@Entity/Users';
import AppDataSource from '@Database/AppDataSource';
const userRepository = AppDataSource.getRepository(Users);
/**
 * 이메일 중복 체크
 * @param email
 */
export const emailExist = async ({ email }: { email: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { email: email } });

    return task.length;
};

/**
 * 닉네임 중복 체크
 * @param nickname
 */
export const nickNameExist = async ({ nickname }: { nickname: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { nickname: nickname } });

    return task.length;
};

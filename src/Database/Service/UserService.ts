import { Not, UpdateResult } from 'typeorm';
import { Users } from '@Entity/Users';
import { Profile } from '@Entity/Profile';
import AppDataSource from '@Database/AppDataSource';
import { toMySqlDatetime } from '@Helper';

const userRepository = AppDataSource.getRepository(Users);
const profileRepository = AppDataSource.getRepository(Profile);

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
 * 닉네임 중복 체크 - 프로필
 * @param nickname
 * @param user_id
 */
export const profileNickNameExits = async ({ user_id, nickname }: { user_id: number; nickname: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { id: Not(user_id), nickname: nickname } });

    return task.length;
};

/**
 * 사용자 등록
 * @param uid
 * @param type
 * @param level
 * @param status
 * @param email
 * @param password
 * @param nickname
 */
export const userCreate = async ({
    uid,
    type,
    level,
    status,
    email,
    password,
    nickname,
}: {
    uid: string;
    type: string;
    level: string;
    status: string;
    email: string;
    password: string;
    nickname: string;
}): Promise<Users> => {
    return userRepository.save(
        {
            uid: uid,
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

/**
 * 기본 프로필 등록
 * @param user_id
 */
export const createDefaultProfile = async ({ user_id }: { user_id: number }): Promise<Profile> => {
    return profileRepository.save(
        {
            user_id: user_id,
            profile_image_id: 1,
        },
        { transaction: false, data: false },
    );
};

/**
 * 사용자 프로필 정보
 * @param user_id
 */
export const getUserProfile = async ({ user_id }: { user_id: number }): Promise<Users | null> => {
    return await userRepository.findOne({
        select: [`id`, `email`, 'nickname'],
        where: { id: user_id },
        relations: ['profile', 'profile.media'],
    });
};

/**
 * 프로필 이미지 변경
 * @param user_id
 * @param media
 */
export const updateProfileImage = async ({ user_id, media }: { user_id: number; media: number }): Promise<UpdateResult> => {
    return profileRepository.update(
        { user_id: user_id },
        {
            profile_image_id: media,
            updated_at: toMySqlDatetime(new Date()),
        },
    );
};

/**
 * 프로필 변경
 * @param user_id
 * @param nickname
 */
export const updateProfile = async ({ user_id, nickname }: { user_id: number; nickname: string }): Promise<UpdateResult> => {
    return userRepository.update(
        { id: user_id },
        {
            nickname: nickname,
            updated_at: toMySqlDatetime(new Date()),
        },
    );
};

/**
 * 사용자 전체 리스트
 */
export const userList = async (): Promise<Users[] | null> => {
    return await userRepository.find({
        select: [`id`, `uid`, `type`, `level`, `status`, `email`, `nickname`, `email_verified_at`, `updated_at`, `created_at`],
        relations: ['typeCode', 'levelCode', 'statusCode', 'profile', 'profile.media', 'active'],
    });
};

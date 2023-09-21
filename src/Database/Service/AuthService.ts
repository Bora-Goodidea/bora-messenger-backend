import AppDataSource from '@Database/AppDataSource';
import { PasswordReset } from '@Entity/PasswordReset';
import { toMySqlDatetime } from '@Helper';
import { UpdateResult } from 'typeorm';

const passwordResetRepository = AppDataSource.getRepository(PasswordReset);

/**
 * 리셋 코드 등록
 * @param user_id
 * @param resetCode
 */
export const createPasswordReset = async ({ user_id, resetCode }: { user_id: number; resetCode: string }): Promise<PasswordReset> => {
    return passwordResetRepository.save(
        {
            user_id: user_id,
            reset_code: resetCode,
        },
        { transaction: false, data: false },
    );
};

/**
 * 비밀번호 리셋코드 정보 조회
 * @param resetCode
 */
export const getPasswordResetInfo = async ({ resetCode }: { resetCode: string }): Promise<PasswordReset | null> => {
    return passwordResetRepository.findOne({
        select: ['id', 'user_id', 'reset_code', 'status', 'user'],
        where: { reset_code: resetCode },
        relations: ['user'],
    });
};

/**
 * 비밀번호 완료 처리
 * @param id
 */
export const passwordResetCompleted = async ({ id }: { id: number }): Promise<UpdateResult> => {
    return passwordResetRepository.update({ id: id }, { status: 'Y', completed_at: toMySqlDatetime(new Date()) });
};

import AppDataSource from '@Database/AppDataSource';
import { MessengerMaster } from '@Entity/MessengerMaster';
import { MessengerTarget } from '@Entity/MessengerTarget';

const messengerMasterRepository = AppDataSource.getRepository(MessengerMaster);
const messengerTargetRepository = AppDataSource.getRepository(MessengerTarget);

/**
 * 메신저 룸 생성
 * @param userId
 * @param roomCode
 * @param gubunCode
 */
export const messengerCreate = async ({
    userId,
    roomCode,
    gubunCode,
}: {
    userId: number;
    roomCode: string;
    gubunCode: string;
}): Promise<MessengerMaster> => {
    return messengerMasterRepository.save(
        {
            user_id: userId,
            gubun_code: gubunCode,
            room_code: roomCode,
        },
        { transaction: false, data: false },
    );
};

/**
 * 차트 타겟(사용자) 등록
 * @param roomId
 * @param userId
 */
export const messengerTargetCreate = async ({ roomId, userId }: { roomId: number; userId: number }): Promise<MessengerTarget> => {
    return messengerTargetRepository.save(
        {
            room_id: roomId,
            user_id: userId,
        },
        { transaction: false, data: false },
    );
};

/**
 * 구분 코드로 메신저 조회 확인
 * @param gubunCode
 */
export const messengerExistsByGubunCode = async ({ gubunCode }: { gubunCode: string }): Promise<number> => {
    const task = await messengerMasterRepository.find({ select: ['id'], where: { gubun_code: gubunCode } });

    return task.length;
};

/**
 * 채팅방 전체 리스트
 * @param userId
 */
export const messengerRoomList = async ({ userId }: { userId: number }): Promise<Array<MessengerMaster>> => {
    return await messengerMasterRepository.find({
        select: ['id', 'user_id', 'room_code', 'updated_at', 'created_at'],
        where: { user_id: userId },
        relations: ['targets.user.profile.media'],
        order: { updated_at: 'DESC' },
    });
};

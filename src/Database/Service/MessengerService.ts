import AppDataSource from '@Database/AppDataSource';
import { MessengerMaster } from '@Entity/MessengerMaster';
import { MessengerTarget } from '@Entity/MessengerTarget';
import { MessengerChat } from '@Entity/MessengerChat';

const messengerMasterRepository = AppDataSource.getRepository(MessengerMaster);
const messengerTargetRepository = AppDataSource.getRepository(MessengerTarget);
const MessengerChatRepository = AppDataSource.getRepository(MessengerChat);

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
        relations: ['targets.user.profile.media', 'chat'],
        order: { updated_at: 'DESC' },
    });
};

/**
 * 메신저 정보 조회
 * @param userId
 * @param roomCode
 */
export const messengerRoomInfoByRoomCode = async ({ userId, roomCode }: { userId: number; roomCode: string }): Promise<MessengerMaster | null> => {
    return await messengerMasterRepository.findOne({
        select: ['id', 'user_id', 'room_code', 'updated_at', 'created_at'],
        relations: ['targets.user.profile.media'],
        where: { user_id: userId, room_code: roomCode },
    });
};

/**
 * 메신저 채팅 리스트
 * @param userId
 */
export const messengerChartList = async ({ roomId }: { roomId: number }): Promise<Array<MessengerChat>> => {
    return await MessengerChatRepository.find({
        select: ['id', 'user_id', 'target_id', 'chat_code', 'message_type', 'message', 'checked', 'created_at'],
        where: { room_id: roomId },
        relations: ['user.profile.media', 'messageType'],
        order: { created_at: 'ASC' },
    });
};

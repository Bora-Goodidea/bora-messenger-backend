import AppDataSource from '@Database/AppDataSource';
import { MessengerMaster } from '@Entity/MessengerMaster';
import { MessengerTarget } from '@Entity/MessengerTarget';
import { MessengerChat } from '@Entity/MessengerChat';
import { MessengerChatChecked } from '@Entity/MessengerChatChecked';
import { UserActive } from '@Entity/UserActive';
import { toMySqlDatetime } from '@Helper';
import { DeleteResult, UpdateResult } from 'typeorm';

const messengerMasterRepository = AppDataSource.getRepository(MessengerMaster);
const messengerTargetRepository = AppDataSource.getRepository(MessengerTarget);
const messengerChatRepository = AppDataSource.getRepository(MessengerChat);
const MessengerChatCheckedRepository = AppDataSource.getRepository(MessengerChatChecked);
const userActiveRepository = AppDataSource.getRepository(UserActive);

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
 * 채팅방 전체 리스트(
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
 * 방정보 조회
 * @param roomCode
 */
export const messengerRoomInfo = async ({ roomCode }: { roomCode: string }): Promise<MessengerMaster | null> => {
    return await messengerMasterRepository.findOne({
        select: ['id', 'user_id', 'room_code', 'updated_at', 'created_at'],
        where: { room_code: roomCode },
        relations: ['targets.user.profile.media', 'targets.user.active', 'chat'],
        order: { updated_at: 'DESC' },
    });
};

/**
 * 채팅방 리스트 내가 속한 방 리스트
 * @param userId
 */
export const messengerBaseTargetRoomList = async ({ userId }: { userId: number }): Promise<Array<MessengerTarget>> => {
    return await messengerTargetRepository.find({
        select: ['id', 'room_id', 'user_id'],
        where: { user_id: userId },
        relations: ['room.targets.user.profile.media', 'room.chat'],
    });
};

/**
 * 메신저 정보 조회 ( 사용자 아이디, 방 코드)
 * @param userId
 * @param roomCode
 */
export const messengerRoomInfoByUseridRoomCode = async ({
    userId,
    roomCode,
}: {
    userId: number;
    roomCode: string;
}): Promise<MessengerMaster | null> => {
    return await messengerMasterRepository.findOne({
        select: ['id', 'user_id', 'room_code', 'updated_at', 'created_at'],
        relations: ['targets.user.profile.media'],
        where: { user_id: userId, room_code: roomCode },
    });
};

/**
 * 메신저 정보 조회
 * @param roomCode
 */
export const messengerRoomInfoByRoomCode = async ({ roomCode }: { roomCode: string }): Promise<MessengerMaster | null> => {
    return await messengerMasterRepository.findOne({
        select: ['id', 'user_id', 'room_code', 'updated_at', 'created_at'],
        where: { room_code: roomCode },
        relations: ['targets.user.profile.media'],
    });
};

/**
 * 채팅방 정보 조회
 * @param roomCode
 */
export const messengerRoomTargetActiveInfoByRoomCode = async ({ roomCode }: { roomCode: string }): Promise<MessengerMaster | null> => {
    return await messengerMasterRepository.findOne({
        select: ['id', 'user_id', 'room_code', 'updated_at', 'created_at'],
        where: { room_code: roomCode },
        relations: ['targets.user.active'],
    });
};

/**
 * 메신저 채팅 리스트
 * @param userId
 */
export const messengerChartList = async ({ roomId }: { roomId: number }): Promise<Array<MessengerChat>> => {
    return await messengerChatRepository.find({
        select: ['id', 'user_id', 'target_id', 'chat_code', 'message_type', 'message', 'created_at'],
        where: { room_id: roomId },
        relations: ['user.profile.media', 'messageType', 'checked'],
        order: { created_at: 'ASC' },
    });
};

/**
 * 메신저 채팅 단건 조회
 * @param roomId
 * @param chatId
 */
export const messengerChartOne = async ({ roomId, chatId }: { roomId: number; chatId: number }): Promise<MessengerChat | null> => {
    return await messengerChatRepository.findOne({
        select: ['id', 'user_id', 'target_id', 'chat_code', 'message_type', 'message', 'created_at'],
        where: { room_id: roomId, id: chatId },
        relations: ['user.profile.media', 'messageType', 'checked'],
        order: { created_at: 'ASC' },
    });
};

/**
 * 채팅코드로 채팅 정보 조회
 * @param userId
 * @param chat_code
 */
export const messengerChartInfoByChatCode = async ({ userId, chat_code }: { userId: number; chat_code: string }): Promise<MessengerChat | null> => {
    return await messengerChatRepository.findOne({
        select: ['id', 'user_id', 'target_id', 'chat_code', 'message_type', 'message', 'created_at'],
        where: { chat_code: chat_code, user_id: userId },
    });
};

/**
 * 채팅 읽기 확인 존재 여부
 * @param userId
 * @param chatId
 */
export const messengerChartCheckedExists = async ({ userId, chatId }: { userId: number; chatId: number }): Promise<MessengerChatChecked | null> => {
    return await MessengerChatCheckedRepository.findOne({
        where: {
            chat_id: chatId,
            user_id: userId,
        },
    });
};

/**
 * 채팅 읽음 확인
 * @param userId
 * @param chatId
 */
export const messengerChartChecked = async ({ userId, chatId }: { userId: number; chatId: number }): Promise<MessengerChatChecked> => {
    return await MessengerChatCheckedRepository.save({
        chat_id: chatId,
        user_id: userId,
    });
};

/**
 * 채팅방 대화 상대 조회
 * @param roomId
 */
export const messengerChartTargets = async ({ roomId }: { roomId: number }): Promise<MessengerTarget[]> => {
    return await messengerTargetRepository.find({
        where: { room_id: roomId },
        relations: ['user.active'],
    });
};

/**
 * 메시지 등록
 * @param userId
 * @param targetId
 * @param chatCode
 * @param chatId
 * @param messageType
 * @param message
 */
export const messengerChartCreate = async ({
    userId,
    targetId,
    chatCode,
    chatId,
    messageType,
    message,
}: {
    userId: number;
    targetId: number;
    chatCode: string;
    chatId: number;
    messageType: string;
    message: string;
}): Promise<MessengerChat> => {
    return await messengerChatRepository.save(
        {
            room_id: chatId,
            chat_code: chatCode,
            user_id: userId,
            target_id: targetId,
            message_type: messageType,
            message: message,
        },
        {},
    );
};

/**
 * 액티브 상태 조회
 * @param userId
 */
export const userActiveInfo = async ({ userId }: { userId: number }): Promise<UserActive | null> => {
    return await userActiveRepository.findOne({
        where: { user_id: userId },
    });
};

/**
 * 액티브 상태 정보 등록
 * @param userId
 * @param sid
 */
export const userActiveCreate = async ({ userId, sid }: { userId: number; sid: string }): Promise<UserActive> => {
    return userActiveRepository.save(
        {
            active: 'Y',
            user_id: userId,
            sid: sid,
        },
        { transaction: false, data: false },
    );
};

/**
 * 액티브 상태 정보 업데이트
 * @param id
 * @param sid
 */
export const userActiveUpdate = async ({ id, sid }: { id: number; sid: string }): Promise<UpdateResult> => {
    return userActiveRepository.update({ id: id }, { active: `Y`, sid: sid, updated_at: toMySqlDatetime(new Date()) });
};

/**
 * 비활성 으로 업데이트
 * @param userId
 */
export const userinactiveUpdate = async ({ userId }: { userId: number }): Promise<UpdateResult> => {
    return userActiveRepository.update({ user_id: userId }, { active: `N`, updated_at: toMySqlDatetime(new Date()) });
};

/**
 * 채팅방 나가기 타겟 삭제
 * @param roomId
 * @param userId
 */
export const messengerTargetDelete = async ({ roomId, userId }: { roomId: number; userId: number }): Promise<DeleteResult> => {
    return await messengerTargetRepository.delete({
        room_id: roomId,
        user_id: userId,
    });
};

/**
 * 채팅방 주인 변경
 * @param roomCode
 * @param userId
 */
export const messengerMasterChange = async ({ roomCode, userId }: { roomCode: string; userId: number }): Promise<UpdateResult> => {
    return await messengerMasterRepository.update(
        {
            room_code: roomCode,
        },
        { user_id: userId, updated_at: toMySqlDatetime(new Date()) },
    );
};

/**
 * 채팅방 주인 삭제
 * @param roomCode
 */
export const messengerMasterDelete = async ({ roomCode }: { roomCode: string }): Promise<DeleteResult> => {
    return await messengerMasterRepository.delete({
        room_code: roomCode,
    });
};

/**
 * 채팅 삭제
 * @param roomId
 */
export const messengerChatDelete = async ({ roomId }: { roomId: number }): Promise<DeleteResult> => {
    return await messengerChatRepository.delete({
        room_id: roomId,
    });
};

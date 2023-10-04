import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider';
import { getUserInfoByUid } from '@Service/UserService';
import {
    messengerCreate,
    messengerTargetCreate,
    messengerExistsByGubunCode,
    messengerRoomList,
    messengerRoomInfoByRoomCode,
    messengerChartList,
} from '@Service/MessengerService';
import Messages from '@Messages';
import { generateUUID, generateShaHashString, changeMysqlDate, generateUserInfo } from '@Helper';
import lodash from 'lodash';

// 메신저 방 생성
export const MessengerCreate = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;
    const { target } = req.body;
    const roomCode = generateUUID();

    const targetIdList: Array<number> = []; // 방 타겟 리스트

    // 타겟 체크
    for await (const uid of target) {
        const user = await getUserInfoByUid({ uid: uid });
        if (!user) {
            return ClientErrorResponse(res, Messages.common.exitsUser);
        }
        targetIdList.push(user.id);
    }

    // 타겟에 자신 포함.
    const targetSortList: Array<number> = lodash.sortBy([...targetIdList, userId]);

    // gubun 코드를 이용해서 중복 체크
    const roomGugunCode = generateShaHashString(targetSortList.join(`,`));
    const roomExxists = await messengerExistsByGubunCode({ gubunCode: roomGugunCode });
    if (roomExxists > 0) {
        return ClientErrorResponse(res, Messages.common.exitsMessengerRoom);
    }

    // 룸 생성
    const createRoom = await messengerCreate({ userId: userId, roomCode: roomCode, gubunCode: roomGugunCode });

    // target 등록
    for await (const targetId of targetSortList) {
        await messengerTargetCreate({ roomId: createRoom.id, userId: targetId });
    }

    return SuccessResponse(res, {
        room_code: roomCode,
    });
};

// 채팅방 리스트
export const MessengerRoomList = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;

    const roomListTask = await messengerRoomList({ userId: userId });

    return SuccessResponse(
        res,
        lodash.map(roomListTask, (room) => {
            const lastChat = lodash.last(room.chat);

            return {
                room_code: room.room_code,
                target: lodash.map(room.targets, (target) => {
                    return target.user ? generateUserInfo({ depth: `simply`, user: target.user }) : null;
                }),
                chart: {
                    content: lastChat ? lastChat.message : '',
                    updated_at: lastChat ? changeMysqlDate(`simply`, lastChat.created_at) : null,
                },
                created_at: changeMysqlDate(`simply`, room.created_at),
                updated_at: changeMysqlDate(`simply`, room.updated_at),
            };
        }),
    );
};

// 채팅 리스트
export const MessengerChatList = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;
    const { roomCode } = req.params;

    const messenger = await messengerRoomInfoByRoomCode({ userId: userId, roomCode: roomCode });

    if (!messenger) {
        return ClientErrorResponse(res, Messages.common.exitsMessenger);
    }

    const chats = await messengerChartList({ roomId: messenger.id });

    // TODO: 리스트 조합

    // lodash.map(chats, (chat) => {
    //     return {
    //         location: chat.user_id === userId ? `right` : `left`,
    //         chat_code: chat.chat_code,
    //         message_type: {
    //             code: chat.messageType ? chat.messageType.code_id : null,
    //             name: chat.messageType ? chat.messageType.name : null,
    //         },
    //         message: chat.message,
    //         user: chat.user ? generateUserInfo({ depth: `simply`, user: chat.user }) : null,
    //         checked: chat.checked,
    //         created_at: changeMysqlDate(`simply`, chat.created_at),
    //     };
    // }),
    //     async (chat) => {
    //         const date: string = chat.created_at.format.step4 ? chat.created_at.format.step4 : dateKey;
    //
    //         if (dateKey !== date) {
    //             dateKey = date;
    //
    //             console.debug(dateKey);
    //         }
    //
    //         // lodash.merge(chatList, { [dateKey]: chat });
    //
    //         const state = lodash.mapKeys(chat, 'created_at.format.step4');
    //         // chatList = lodash.assign(chatList[date], chat);
    //
    //         if (!chatList[date]) {
    //             chatList[date] = [];
    //         }
    //         await chatList[date].push(chat);
    //     },
    //     console.debug(chatList);

    // console.debug(chatList);

    // const tempCharts = lodash.map(chats, (chat) => {
    //     return {
    //         location: chat.user_id === userId ? `right` : `left`,
    //         chat_code: chat.chat_code,
    //         message_type: {
    //             code: chat.messageType ? chat.messageType.code_id : null,
    //             name: chat.messageType ? chat.messageType.name : null,
    //         },
    //         message: chat.message,
    //         user: chat.user ? generateUserInfo({ depth: `simply`, user: chat.user }) : null,
    //         checked: chat.checked,
    //         created_at: changeMysqlDate(`simply`, chat.created_at),
    //     };
    // });

    let dateKey: string = '';
    // const chatList = [];

    for await (const chatLoop of lodash.map(chats, (chat) => {
        return {
            location: chat.user_id === userId ? `right` : `left`,
            chat_code: chat.chat_code,
            message_type: {
                code: chat.messageType ? chat.messageType.code_id : null,
                name: chat.messageType ? chat.messageType.name : null,
            },
            message: chat.message,
            user: chat.user ? generateUserInfo({ depth: `simply`, user: chat.user }) : null,
            checked: chat.checked,
            created_at: changeMysqlDate(`simply`, chat.created_at),
        };
    })) {
        const date: string = chatLoop.created_at.format.step4 ? chatLoop.created_at.format.step4 : dateKey;

        if (dateKey !== date) {
            dateKey = date;

            console.debug(dateKey);
        }

        // if (!chatList[date]) {
        // chatList[date] = [];
        // }
        // await chatList[date].push(chatLoop);
    }

    return SuccessResponse(res, {
        messenger: {
            room_code: messenger.room_code,
            target: lodash.map(messenger.targets, (target) => {
                return target.user ? generateUserInfo({ depth: `simply`, user: target.user }) : null;
            }),
        },
        chat: [],
    });
};

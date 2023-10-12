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
    messengerChartInfoByChatCode,
    messengerChartChecked,
    messengerRoomInfoByUseridRoomCode,
    messengerChartCheckedExists,
    messengerChartTargets,
    messengerChartCreate,
} from '@Service/MessengerService';
import Messages from '@Messages';
import { generateUUID, generateShaHashString, changeMysqlDate, generateUserInfo, generateHexRandString } from '@Helper';
import lodash from 'lodash';
import { ChatItemResponseInterface } from '@Types/CommonTypes';
import Codes from '@Codes';

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

    const messenger = await messengerRoomInfoByUseridRoomCode({ userId: userId, roomCode: roomCode });

    if (!messenger) {
        return ClientErrorResponse(res, Messages.common.exitsMessenger);
    }

    /**
     * 순서
     * 1. 디비에서 리스트를 뽑아와서 날짜별로 오브젝트 생성
     * 2. 날짜별로 조합한 데이트를 순서대로 다시 조합 이때 같은 사용자끼리 배열로 리스트 생성
     */
    const chats = lodash.map(await messengerChartList({ roomId: messenger.id }), (chat) => {
        const findChecked = lodash.find(chat.checked, { user_id: userId });

        const created_at = changeMysqlDate(`simply`, chat.created_at);
        return {
            date: `${created_at.format.step1}`,
            item: {
                location: chat.user_id === userId ? `right` : `left`,
                chat_code: chat.chat_code,
                message_type: {
                    code: chat.messageType ? chat.messageType.code_id : null,
                    name: chat.messageType ? chat.messageType.name : null,
                },
                message: chat.message,
                user: chat.user ? generateUserInfo({ depth: `simply`, user: chat.user }) : null,
                checked: findChecked ? 'Y' : 'N',
                checked_at: findChecked ? changeMysqlDate(`simply`, findChecked.created_at) : null,
                created_at: created_at,
            },
        };
    });

    return SuccessResponse(res, {
        messenger: {
            room_code: messenger.room_code,
            target: lodash.map(messenger.targets, (target) => {
                return target.user ? generateUserInfo({ depth: `simply`, user: target.user }) : null;
            }),
            last: (() => {
                const lastChat = lodash.last(chats);
                return {
                    last: !!lastChat,
                    message: lastChat ? lastChat.item.message : null,
                    profileImage: lastChat && lastChat.item.user ? lastChat.item.user.profile.image : null,
                    nickname: lastChat && lastChat.item.user ? lastChat.item.user.nickname : null,
                    time: lastChat && lastChat.item.user ? lastChat.item.created_at : null,
                };
            })(),
            created_at: changeMysqlDate(`simply`, messenger.created_at),
        },
        chat: lodash.map(lodash.union(lodash.map(chats, (e) => e.item.created_at.format.step1)), (date) => {
            return {
                date: date,
                list: (() => {
                    const returnData: ChatItemResponseInterface = {};
                    const list = lodash.forEach(
                        lodash.map(
                            lodash.filter(chats, (e) => e.date === `${date}`),
                            (e) => {
                                return e.item;
                            },
                        ),
                        (e) => {
                            if (e.user) {
                                if (!returnData[e.user.uid]) {
                                    returnData[e.user.uid] = {
                                        location: e.location,
                                        user: {
                                            uid: e.user.uid,
                                            nickname: e.user.nickname,
                                            profile: e.user.profile,
                                        },
                                        message: [],
                                    };
                                }

                                returnData[e.user.uid].message.push({
                                    type: e.message_type,
                                    chat_code: e.chat_code,
                                    contents: e.message,
                                    checked: e.checked,
                                    checked_at: (() => {
                                        if (e.checked_at === null) {
                                            return null;
                                        } else {
                                            return {
                                                format: {
                                                    step1: e.checked_at.format.step1,
                                                    step2: e.checked_at.format.step2,
                                                    step3: e.checked_at.format.step3,
                                                },
                                            };
                                        }
                                    })(),
                                    created_at: (() => {
                                        return {
                                            format: {
                                                step1: e.created_at.format.step1,
                                                step2: e.created_at.format.step2,
                                                step3: e.created_at.format.step3,
                                            },
                                            sinceString: e.created_at.sinceString,
                                        };
                                    })(),
                                });
                            }
                        },
                    );

                    Promise.allSettled(list);

                    return returnData;
                })(),
            };
        }),
    });
};

// 채팅 확인
export const MessengerChatChecked = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;
    const { chart: chartCodes } = req.body;

    const chatIdList: Array<number> = []; // 방 타겟 리스트

    // 채팅 체크
    for await (const chartCode of chartCodes) {
        const char = await messengerChartInfoByChatCode({ userId: userId, chat_code: chartCode });
        if (!char) {
            return ClientErrorResponse(res, Messages.common.exitsChat);
        }
        chatIdList.push(char.id);
    }

    for await (const chatId of chatIdList) {
        const ch = await messengerChartCheckedExists({ userId: userId, chatId: chatId });
        if (!ch) {
            await messengerChartChecked({ userId: userId, chatId: chatId });
        }
    }

    return SuccessResponse(res, {
        chart_code: chartCodes,
    });
};

// 신규 메시지
export const MessengerChatCreate = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;
    const { roomCode } = req.params;
    const { messageType, message } = req.body;
    const chatCode = generateHexRandString();

    // 메시지 타입 체크
    // FIXME: 고도화 필요.
    const findCode = lodash.find(Codes, { id: `040` });
    if (findCode) {
        if (
            !lodash.includes(
                lodash.map(findCode.list, (e) => `040${e.id}`),
                messageType,
            )
        ) {
            return ClientErrorResponse(res, Messages.error.defaultClientError);
        }
    } else {
        return ClientErrorResponse(res, Messages.error.serverError);
    }

    const messenger = await messengerRoomInfoByRoomCode({ roomCode: roomCode });

    if (!messenger) {
        return ClientErrorResponse(res, Messages.common.exitsMessenger);
    }

    // target 을 조회 해서 방에 상대가 복수이면 마지막사용자를 target으로( 임시: 복수일때 특정 대상에게 답장 할수 있게?? 고도화떄..... ) 해서 저장
    const targets = await messengerChartTargets({ roomId: messenger.id });

    if (targets.length > 1) {
        const lastTarget = lodash.last(targets);

        // 임시 대상이 있으면 등록 없으면 자신을 대상으로 등록
        if (lastTarget) {
            await messengerChartCreate({
                chatId: messenger.id,
                chatCode: chatCode,
                userId: userId,
                targetId: lastTarget.user_id,
                messageType: messageType,
                message: message,
            });
        } else {
            await messengerChartCreate({
                chatId: messenger.id,
                chatCode: chatCode,
                userId: userId,
                targetId: userId,
                messageType: messageType,
                message: message,
            });
        }
    } else {
        await messengerChartCreate({
            chatId: messenger.id,
            chatCode: chatCode,
            userId: userId,
            targetId: userId,
            messageType: messageType,
            message: message,
        });
    }

    return SuccessResponse(res, {
        userId: userId,
        roomcode: roomCode,
        message: message,
    });
};

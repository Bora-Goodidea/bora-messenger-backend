import { Server as SocketIOServer } from 'socket.io';
import { Server as ServerType } from 'http';
import { tokenInfo } from '@TokenManager';
import { Logger } from '@Logger';
import {
    userActiveInfo,
    userActiveCreate,
    userActiveUpdate,
    messengerRoomInfoByRoomCode,
    messengerChartTargets,
    messengerChartCreate,
    messengerChartOne,
    userinactiveUpdate,
    messengerRoomInfo,
    messengerChartCheckedCreate,
} from '@Service/MessengerService';
import lodash from 'lodash';
import Codes from '@Codes';
import Messages from '@Messages';
import { generateChatItem, generateHexRandString, generateRoomListItem, generateUserInfo } from '@Helper';
import { userDetailInfo } from '@Service/UserService';

const SocketsModule = {
    initSocketServer: (server: ServerType): SocketIOServer => {
        const socketServer = new SocketIOServer(server, {
            cors: {
                origin: '*',
            },
        });

        socketServer.use(async (socket, next) => {
            const Authorization = `${socket.handshake.headers['authorization']?.replace('Bearer ', '')}`;
            if (!Authorization) {
                // 토큰 체크
                Logger.error(`chat token check error:${Authorization} code(1)`);
                next(new Error('로그인이 필요한 서비스 입니다.'));
            } else {
                Logger.info(`chat try token Info : ${Authorization}`);
                const tokeninfo = await tokenInfo({ token: Authorization }); // 토큰 디코딩 정보
                if (!tokeninfo.status) {
                    // 토큰 디코딩 상태 체크
                    Logger.error(`chat token check error:${Authorization} code(2)`);
                    next(new Error('로그인이 필요한 서비스 입니다.'));
                } else {
                    if (!tokeninfo.token) {
                        Logger.error(`chat token check error:${Authorization} code(3)`);
                        next(new Error('로그인이 필요한 서비스 입니다.'));
                    } else {
                        if (tokeninfo.token.status === 'N') {
                            Logger.error(`chat token check error:${Authorization} code(4)`);
                            next(new Error('로그인이 필요한 서비스 입니다.'));
                        } else {
                            socket.userId = tokeninfo.token.user.user_id;
                            socket.userUid = tokeninfo.token.user.uid;
                            next();
                        }
                    }
                }
            }
        });

        socketServer.on('connection', async (socket) => {
            const userId = socket.userId;
            const userUid = socket.userUid;
            Logger.console(`SocketsModule connected --> userId: ${userId} socketId: ${socket.id}`);

            let userActive = null;
            if (userId) {
                userActive = await userActiveInfo({ userId: userId });
                if (userActive === null) {
                    await userActiveCreate({ userId: userId, sid: socket.id });
                } else {
                    await userActiveUpdate({ id: userActive.id, sid: socket.id });
                }

                const userInfo = await userDetailInfo({ user_id: userId });
                if (userInfo) {
                    const info = generateUserInfo({ depth: `detail`, user: userInfo });
                    delete info.id;
                    socket.broadcast.emit('active-user', info);
                }
            }

            socket.on('create-room', async (payload: { room_code: string }) => {
                Logger.console(`SocketsModule create-room -> userId: ${userId} room_code: ${payload.room_code}`);
                const room = await messengerRoomInfo({ roomCode: payload.room_code });

                if (room && userId) {
                    const targets = lodash.filter(
                        lodash.map(room.targets, (t) => {
                            return t.user && t.user.active && t.user.active.sid ? { user_id: t.user_id, sid: t.user.active.sid } : null;
                        }),
                        (e) => e,
                    );

                    for await (const t of JSON.parse(JSON.stringify(targets))) {
                        Logger.console(`SocketsModule invite-room -> userId: ${userId} tartget: ${t.user_id} sid: ${t.sid}`);
                        socket.to(t.sid).emit('invite-room', generateRoomListItem({ userId: userId, room: room }));
                    }
                }
            });

            socket.on('send-bubble-start', async (payload: { room_code: string }) => {
                Logger.console(`SocketsModule send-bubble-start --> userId: ${userId} sid: ${payload.room_code}`);
                const room = await messengerRoomInfo({ roomCode: payload.room_code });
                if (room && userId) {
                    const targets = lodash.filter(
                        lodash.map(room.targets, (t) => {
                            return t.user && t.user.active && t.user.active.sid ? { user_id: t.user_id, sid: t.user.active.sid } : null;
                        }),
                        (e) => e,
                    );

                    for await (const t of JSON.parse(JSON.stringify(targets))) {
                        Logger.console(`SocketsModule room-bubble-start -> userId: ${userId} tartget: ${t.user_id} sid: ${t.sid}`);
                        socket.to(t.sid).emit('room-bubble-start', { roomCode: payload.room_code, uid: userUid });
                    }
                }
            });

            socket.on('send-bubble-end', async (payload: { room_code: string }) => {
                Logger.console(`SocketsModule send-bubble-start --> userId: ${userId} sid: ${payload.room_code}`);
                const room = await messengerRoomInfo({ roomCode: payload.room_code });
                if (room && userId) {
                    const targets = lodash.filter(
                        lodash.map(room.targets, (t) => {
                            return t.user && t.user.active && t.user.active.sid ? { user_id: t.user_id, sid: t.user.active.sid } : null;
                        }),
                        (e) => e,
                    );

                    for await (const t of JSON.parse(JSON.stringify(targets))) {
                        Logger.console(`SocketsModule invite-room -> userId: ${userId} tartget: ${t.user_id} sid: ${t.sid}`);
                        socket.to(t.sid).emit('room-bubble-end', { roomCode: payload.room_code, uid: userUid });
                    }
                }
            });

            socket.on('send-bubble-end', async (payload: { room_code: string }) => {
                Logger.console(`SocketsModule send-bubble-end --> userId: ${userId} sid: ${payload.room_code}`);
            });

            socket.on('join-room', (payload) => {
                Logger.console(`SocketsModule join-room --> userId: ${userId} sid: ${payload.sid}`);
                socket.join(payload.sid);
            });

            socket.on('room-send-message', async (payload: { type: string; room_code: string; contents: string }) => {
                const { room_code, type, contents } = payload;
                const newChatCode = generateHexRandString();

                const findCode = lodash.find(Codes, { id: `040` });
                if (findCode) {
                    if (
                        !lodash.includes(
                            lodash.map(findCode.list, (e) => `040${e.id}`),
                            type,
                        )
                    ) {
                        socket.emit('client-error', { message: Messages.error.defaultClientError });
                        Logger.error(`SocketsModule client-error : ${userId} ${Messages.error.defaultClientError}`);
                        return;
                    }
                } else {
                    socket.emit('client-error', { message: Messages.error.serverError });
                    Logger.error(`SocketsModule client-error : ${userId} ${Messages.error.serverError}`);
                    return;
                }

                const messenger = await messengerRoomInfoByRoomCode({ roomCode: room_code });

                if (!messenger) {
                    socket.emit('client-error', { message: Messages.common.exitsMessenger });
                    Logger.error(`SocketsModule client-error : ${userId} ${Messages.common.exitsMessenger}`);
                    return;
                }

                const targets = await messengerChartTargets({ roomId: messenger.id });
                if (userId) {
                    let targetId: number = userId;
                    if (targets.length > 1) {
                        const lastTarget = lodash.last(targets);

                        targetId = lastTarget ? lastTarget.user_id : userId;
                    }

                    const newTask = await messengerChartCreate({
                        roomId: messenger.id,
                        chatCode: newChatCode,
                        userId: userId,
                        targetId: targetId,
                        messageType: type,
                        message: contents,
                    });

                    // 읽을 확인해 나 자신은 등록
                    await messengerChartCheckedCreate({ chatId: newTask.id, userId: userId });

                    const newChatInfo = await messengerChartOne({ roomId: messenger.id, chatId: newTask.id });
                    if (newChatInfo) {
                        const newChat = generateChatItem({ userId: userId, chatData: newChatInfo });

                        socketServer.sockets.in(room_code).emit(`new-message`, newChat);
                        Logger.console(`SocketsModule new-message : ${userId} ${JSON.stringify(newChat)}`);

                        for await (const t of lodash.filter(JSON.parse(JSON.stringify(targets)), (e) => e.user.active)) {
                            socket.to(t.user.active.sid).emit('room-new-message', {
                                roomCode: room_code,
                                content: newChat.item.message,
                                type: newChat.item.message_type,
                                updated_at: newChat.item.created_at,
                            });
                            Logger.console(
                                `SocketsModule room-new-message : ${userId} ${JSON.stringify({
                                    roomCode: room_code,
                                    checked: newChat.item.checked,
                                    content: newChat.item.message,
                                    type: newChat.item.message_type,
                                    updated_at: newChat.item.created_at,
                                })}`,
                            );
                        }
                    } else {
                        socket.emit('client-error', { message: Messages.error.serverError });
                        Logger.error(`SocketsModule client-error : ${userId} ${Messages.error.serverError}`);
                        return;
                    }
                }
            });

            socket.on('disconnect', async () => {
                if (userId) {
                    Logger.console(`SocketsModule disconnect -->  userId: ${userId}`);
                    await userinactiveUpdate({ userId: userId });
                    const userInfo = await userDetailInfo({ user_id: userId });
                    if (userInfo) {
                        const info = generateUserInfo({ depth: `detail`, user: userInfo });
                        delete info.id;
                        socket.broadcast.emit('active-user', info);
                    }
                }
            });
        });

        return socketServer;
    },
};

export default SocketsModule;

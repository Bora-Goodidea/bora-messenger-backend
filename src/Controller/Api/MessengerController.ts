import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider';
import { getUserInfoByUid } from '@Service/UserService';
import { messengerCreate, messengerTargetCreate, messengerExistsByGubunCode, messengerRoomList } from '@Service/MessengerService';
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
            return {
                room_code: room.room_code,
                target: lodash.map(room.targets, (target) => {
                    return target.user ? generateUserInfo({ depth: `simply`, user: target.user }) : null;
                }),
                chart: {
                    content: `태스트 채팅...................`,
                    updated_at: changeMysqlDate(`simply`, room.created_at),
                },
                created_at: changeMysqlDate(`simply`, room.created_at),
                updated_at: changeMysqlDate(`simply`, room.updated_at),
            };
        }),
    );
};

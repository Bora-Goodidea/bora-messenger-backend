import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessDefault, SuccessResponse } from '@Commons/ResponseProvider';
import {
    getUserProfile,
    getUserProfileByProfileUid,
    profileNickNameExits,
    updateProfile,
    updateProfileImage,
    userListExceptMe,
} from '@Service/UserService';
import Config from '@Commons/Config';
import lodash from 'lodash';
import Messages from '@Commons/Messages';
import { mediaExits } from '@Database/Service/MediaService';
import { Logger } from '@Commons/Logger';
import { generateUserInfo } from '@Helper';

// 내 프로필
export const MyProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;

    const infoTask = await getUserProfile({ user_id: userId });
    if (infoTask && infoTask.profile && infoTask.profile.media) {
        return SuccessResponse(res, {
            email: infoTask.email,
            nickname: infoTask.nickname,
            profile_image: {
                id: infoTask.profile.profile_image_id,
                url: `${Config.MEDIA_HOSTNAME}${infoTask.profile.media.path}/${infoTask.profile.media?.filename}`,
            },
        });
    } else {
        return ClientErrorResponse(res);
    }
};

// 프로필 변경
export const ProfileEdit = async (req: Request, res: Response): Promise<Response> => {
    const { profileImage: profileImageId, nickname } = req.body;
    const userId = req.app.locals.user.user_id;

    const profileImage = Number(profileImageId);

    if (lodash.isEmpty(nickname)) {
        return ClientErrorResponse(res, Messages.member.profile.emptyNickName);
    }

    // 닉네임 중복 체크
    const checkNickNameExits = await profileNickNameExits({ user_id: userId, nickname: nickname });
    if (checkNickNameExits > 0) {
        return ClientErrorResponse(res, Messages.member.profile.exitsNickName);
    }

    // 이미지 업데이트
    if (lodash.isNumber(profileImage)) {
        const checkMedia = await mediaExits({ user_id: userId, id: profileImage });
        if (checkMedia === 0) {
            Logger.error(`ProfileEdit: checkMedia error`);
            return ClientErrorResponse(res, Messages.member.profile.imageCheckError);
        }

        await updateProfileImage({ user_id: userId, media: profileImage });
    }

    await updateProfile({ user_id: userId, nickname: nickname });

    return SuccessDefault(res);
};

// 회원 목록
export const UserList = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;
    const task = await userListExceptMe({ user_id: userId });
    return SuccessResponse(
        res,
        lodash.map(task, (user) => {
            const info = generateUserInfo({ depth: `detail`, user: user });
            delete info.id;
            return info;
        }),
    );
};

// 니 프로필
export const YourProfile = async (req: Request, res: Response): Promise<Response> => {
    const { profileUid } = req.params;

    const infoTask = await getUserProfileByProfileUid({ uid: profileUid });

    if (infoTask && infoTask.profile && infoTask.profile.media) {
        return SuccessResponse(res, {
            email: infoTask.email,
            nickname: infoTask.nickname,
            profile_image: {
                id: infoTask.profile.profile_image_id,
                url: `${Config.MEDIA_HOSTNAME}${infoTask.profile.media.path}/${infoTask.profile.media?.filename}`,
            },
        });
    } else {
        return ClientErrorResponse(res);
    }
};

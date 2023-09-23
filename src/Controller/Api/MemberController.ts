import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider';
import { getUserProfile } from '@Service/UserService';
import Config from '@Commons/Config';
import { Logger } from '@Commons/Logger';

// 내 프로필
export const MyProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id;

    const infoTask = await getUserProfile({ user_id: userId });
    Logger.console(JSON.stringify(infoTask));
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

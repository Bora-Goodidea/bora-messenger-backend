import { Request, Response } from 'express';
import { ClientErrorResponse, SuccessDefault, SuccessResponse } from '@Commons/ResponseProvider';
import { getUserProfile, profileNickNameExits, updateProfile, updateProfileImage, userList } from '@Service/UserService';
import Config from '@Commons/Config';
import lodash from 'lodash';
import Messages from '@Commons/Messages';
import { mediaExits } from '@Database/Service/MediaService';
import { Logger } from '@Commons/Logger';
import { changeMysqlDate } from '@Helper';

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
    const { profileImage, nickname } = req.body;
    const userId = req.app.locals.user.user_id;

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

export const Members = async (req: Request, res: Response): Promise<Response> => {
    const task = await userList();
    return SuccessResponse(
        res,
        lodash.map(task, (user) => {
            const typeInfo = user.typeCode
                ? {
                      code: user.typeCode ? user.typeCode.code_id : ``,
                      name: user.typeCode ? user.typeCode.name : ``,
                  }
                : {
                      code: '',
                      name: '',
                  };

            const levelInfo = user.levelCode
                ? {
                      code: user.levelCode ? user.levelCode.code_id : ``,
                      name: user.levelCode ? user.levelCode.name : ``,
                  }
                : {
                      code: '',
                      name: '',
                  };

            const statusInfo = user.statusCode
                ? {
                      code: user.statusCode ? user.statusCode.code_id : ``,
                      name: user.statusCode ? user.statusCode.name : ``,
                  }
                : {
                      code: '',
                      name: '',
                  };

            const profileImage =
                user.profile && user.profile.media
                    ? {
                          id: user.profile ? user.profile.profile_image_id : '',
                          url: `${Config.MEDIA_HOSTNAME}${user.profile.media.path}/${user.profile.media.filename}`,
                      }
                    : {
                          id: 0,
                          url: ``,
                      };

            const createdAt = changeMysqlDate(`simply`, user.created_at);
            const updatedAt = changeMysqlDate(`simply`, user.updated_at);
            return {
                id: user.id,
                uid: user.uid,
                type: typeInfo,
                level: levelInfo,
                status: statusInfo,
                email: user.email,
                nickname: user.nickname,
                profile: {
                    image: profileImage,
                },
                active: user.active ? user.active.active : 'N',
                created_at: createdAt,
                updated_at: updatedAt,
            };
        }),
    );
};

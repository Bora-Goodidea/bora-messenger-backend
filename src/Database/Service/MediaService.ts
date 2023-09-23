import AppDataSource from '@Database/AppDataSource'
import { Media } from '@Entity/Media'

const mediaRepository = AppDataSource.getRepository(Media)

/**
 * 파일 등록
 * @param user_id
 * @param type
 * @param path
 * @param filename
 * @param origin_name
 * @param size
 */
export const mediaCreate = async ({
    user_id,
    type,
    path,
    filename,
    origin_name,
    size,
}: {
    user_id: number
    type: string
    path: string
    filename: string
    origin_name: string
    size: number
}): Promise<Media> => {
    return mediaRepository.save(
        {
            user_id: user_id,
            type: type,
            path: path,
            filename: filename,
            origin_name: origin_name,
            size: size,
        },
        { transaction: false, data: false },
    )
}

export const mediaExits = async ({ id, user_id }: { id: number; user_id: number }): Promise<number> => {
    const task = await mediaRepository.find({ select: ['id'], where: { id: id, user_id: user_id } })

    return task.length
}

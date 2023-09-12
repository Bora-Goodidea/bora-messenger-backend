import { Codes } from '@Entity/Codes'
import AppDataSource from '@Database/AppDataSource'

const codeRepository = AppDataSource.getRepository(Codes)

/**
 * 코드 전체 리스트
 */
export const findAll = async (): Promise<Array<Codes>> => {
    return await codeRepository.find({
        select: ['type', 'group_id', 'code_id', 'name'],
        order: {
            id: 'asc',
        },
    })
}

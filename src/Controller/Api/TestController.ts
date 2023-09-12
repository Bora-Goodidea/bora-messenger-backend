import { Request, Response } from 'express'
import { SuccessResponse } from '@Commons/ResponseProvider'

// 기본 테스트.
export const Default = async (req: Request, res: Response): Promise<Response> => {
    return SuccessResponse(res, { test: 'test' })
}

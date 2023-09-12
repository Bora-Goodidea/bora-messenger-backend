import { SuccessResponse } from '@Commons/ResponseProvider'
import { Request, Response } from 'express'

// 기본 테스트.
export const Default = async (req: Request, res: Response): Promise<Response> => {
    return SuccessResponse(res, { test: 'test' })
}

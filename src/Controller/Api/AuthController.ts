import { Request, Response } from 'express'
import { NoContentResponse } from '@Commons/ResponseProvider'

// 회원 가입
export const Register = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body

    console.debug({ email, password })

    return NoContentResponse(res)
}

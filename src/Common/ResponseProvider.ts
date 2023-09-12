import { Response } from 'express'
import Const from '@Const'
import Messages from '@Messages'

const { httpStatus } = Const

// 기본 내용없음.
export const NoCotentResponse = (response: Response): Response => {
    return response.status(httpStatus.noContent).json()
}

// 서버 에러.
export const ServerErrorResponse = (response: Response, error?: Error): Response => {
    const errorResponse: { message: string; error?: Error | null } = {
        message: Messages.error.serverError,
        error: error ? error : null,
    }

    if (!errorResponse.error) {
        delete errorResponse.error
    }

    return response.status(httpStatus.serverError).json(errorResponse)
}

// 클라이언트 에러.
export const ClientErrorResponse = (response: Response, errorMessage?: string, error?: Error): Response => {
    const errorResponse: { message: string; error?: Error | null } = {
        message: errorMessage ? errorMessage : Messages.error.defaultClientError,
        error: error ? error : null,
    }

    if (!errorResponse.error) {
        delete errorResponse.error
    }

    return response.status(httpStatus.badRequest).json(errorResponse).end()
}

// 기본 성공 - 데이터 있을때
export const SuccessResponse = <T>(response: Response, payload: T): Response => {
    return response.status(httpStatus.success).json({
        message: Messages.success.default,
        result: payload,
    })
}

// 기본 성공 - 데이터 없을때
export const SuccessDefault = (response: Response): Response => {
    return response.status(httpStatus.success).json({
        message: Messages.success.default,
    })
}

// 데이터만.
export const DataSuccessResponse = <T>(response: Response, payload: T): Response => {
    return response.status(httpStatus.success).json(payload)
}

// 인증 에러.
export const AuthenticateErrorResponse = (response: Response): Response => {
    return response.status(httpStatus.unAuthorized).json({
        message: Messages.error.authenticateError,
    })
}

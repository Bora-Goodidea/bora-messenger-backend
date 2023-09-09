import { Router } from 'express'
import { Default } from '@Controllers/Api/TestController'
import { BaseData, CheckStatus } from '@Controllers/Api/SystemController'

export const TestsRouter = Router()
export const AuthRouter = Router()
export const SystemRouter = Router()

// 기본 테스트.
TestsRouter.get('/default', Default)

// 시스템
SystemRouter.get('/check-status', CheckStatus)
SystemRouter.get('/base-data', BaseData)

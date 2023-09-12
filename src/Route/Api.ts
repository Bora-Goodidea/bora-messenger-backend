import { Router } from 'express'
import { Default } from '@Controllers/Api/TestController'
import { CheckStatus, BaseData, ErrorTest } from '@Controllers/Api/SystemController'

export const TestsRouter = Router()
export const SystemRouter = Router()

/* 테스트 Router */
TestsRouter.get('/default', Default)

/* System Router */
SystemRouter.get('/check-status', CheckStatus)
SystemRouter.get('/base-data', BaseData)
SystemRouter.get('/error-test', ErrorTest)

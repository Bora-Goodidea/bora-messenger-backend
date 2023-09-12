import { Router } from 'express'
import { Default } from '@Controllers/Web/DefaultController'

export const WebRouter = Router()

// 기본 테스트.
WebRouter.get('/', Default)

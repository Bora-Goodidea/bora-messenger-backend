import { Router } from 'express';
import { Default } from '@Controllers/Web/DefaultController';

export const DefaultRouter = Router();
export const AuthRouter = Router();

// 기본 테스트.
DefaultRouter.get('/', Default);

import { Request, Response } from 'express';
import { SuccessResponse } from '@Commons/ResponseProvider';
import { generateUUID, generateHexRandString } from '@Helper';

// 기본 테스트.
export const Default = async (req: Request, res: Response): Promise<Response> => {
    return SuccessResponse(res, { test: 'test' });
};

// 랜덤 스크링
export const RandomString = async (req: Request, res: Response): Promise<Response> => {
    return SuccessResponse(res, {
        string2: generateUUID(),
        string3: generateHexRandString(),
    });
};

import { Request, Response } from 'express'

// 기본 테스트.
export const Default = async (req: Request, res: Response): Promise<void> => {
    res.render('home', { title: 'Hey', message: 'Hello there!' })
}

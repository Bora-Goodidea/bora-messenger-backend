declare global {
    namespace Express {
        interface Locals {
            user: {
                auth: boolean
                user_id: number
                email: string
                level: string
                status: string
            }
        }
    }
}

import { Server as SocketIOServer } from 'socket.io';

declare global {
    namespace Express {
        interface Locals {
            user: {
                auth: boolean;
                user_id: number;
                uid: string;
                email: string;
                level: string;
                status: string;
            };
        }

        interface Request {
            io: SocketIOServer;
        }
    }
}

declare module 'socket.io' {
    interface Socket {
        userId?: number;
    }
}

export enum CodeTypeEnum {
    GROUP = 'group',
    CODE = 'code',
}

export interface ChatItemResponseInterface {
    [index: string]: {
        location: string | 'right' | 'left';
        user: {
            uid: string;
            nickname: string;
            profile: {
                image: string;
            };
        };
        message: Array<{
            type: {
                code: string | null;
                name: string | null;
            };
            checked: string | 'N' | `Y`;
            contents: string;
            chats: {
                origin: Date;
                format: {
                    step1: string;
                    step2: string;
                    step3: string | undefined;
                    step4: string | undefined;
                };
            };
        }>;
    };
}

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
            contents: string;
            checked: string | 'N' | `Y`;
            checked_at: {
                origin: Date;
                format: {
                    step1: string;
                    step2: string;
                    step3: string | undefined;
                    step4: string | undefined;
                };
            } | null;
            created_at: {
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

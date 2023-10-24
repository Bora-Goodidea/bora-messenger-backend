export enum CodeTypeEnum {
    GROUP = 'group',
    CODE = 'code',
}

export enum StatusTypeEnum {
    TRUE = 'Y',
    FALSE = 'N',
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
            chat_code: string;
            contents: string;
            checked: string | 'N' | `Y`;
            checked_at: {
                format: {
                    step1: string;
                    step2: string;
                    step3: string | undefined;
                };
            } | null;
            created_at: {
                format: {
                    step1: string;
                    step2: string;
                    step3: string | undefined;
                };
                sinceString: string;
            };
        }>;
    };
}

export interface CommonSocketClientRequestInterface {
    name: `create-room` | `join-room` | `join-room-send-message`;
    sid?: string;
    type?: string;
    contents?: string;
}

export interface CommonUserInfoInterface {
    id?: number;
    uid: string;
    email?: string;
    nickname: string;
    type?: {
        code: string;
        name: string;
    };
    level?: {
        code: string;
        name: string;
    };
    status?: {
        code: string;
        name: string;
    };
    active?: {
        state: `Y` | 'N';
        updated_at: CommonChangeMysqlDateInterface | null;
    };
    created_at?: CommonChangeMysqlDateInterface;
    updated_at?: CommonChangeMysqlDateInterface;
    profile: {
        image: string;
    };
}

export interface CommonChangeMysqlDateInterface {
    origin?: Date;
    number?: {
        year: number;
        month: number;
        date: number;
        day: number;
        hour: number;
        minutes: number;
        seconds: number;
    };
    string?: {
        year: string;
        month: string;
        date: string;
        day: string;
        hour: string;
        minutes: string;
        seconds: string;
    };
    format: {
        step1: string;
        step2: string;
        step3?: string;
        step4?: string;
        sinceString?: string;
    };
    sinceString: string;
}

export interface CommonGenerateChatListItemInterdface {
    date: string;
    item: {
        location: `right` | `left`;
        chat_code: string;
        message_type: {
            code: string | null;
            name: string | null;
        };
        message: string;
        user: CommonUserInfoInterface | null;
        checked: string | 'Y' | 'N';
        checked_at: CommonChangeMysqlDateInterface | null;
        created_at: CommonChangeMysqlDateInterface;
    };
}

export interface CommongenerateRoomListItemInterface {
    room_code: string;
    target: Array<CommonUserInfoInterface | null> | null;
    chart: {
        content: string;
        updated_at: CommonChangeMysqlDateInterface | null;
    };
    checked: string | 'Y' | 'N';
    created_at: CommonChangeMysqlDateInterface;
    updated_at: CommonChangeMysqlDateInterface;
}

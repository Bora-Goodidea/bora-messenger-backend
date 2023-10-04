export default [
    {
        id: `010`,
        name: `클라이언트 구분`,
        description: `클라이언트 종류 코드`,
        list: [
            { id: `010`, name: `iOS`, description: `아이폰 사용자` },
            { id: `020`, name: `android`, description: `안드로이드 사용자` },
            { id: `030`, name: `web`, description: `웹 사용자` },
        ],
    },
    {
        id: `020`,
        name: `회원 상태`,
        list: [
            { id: `010`, name: `회원가입(인증이전)` },
            { id: `020`, name: `인증완료` },
            { id: `030`, name: `block 상태` },
        ],
    },
    {
        id: `030`,
        name: `회원 레벨`,
        list: [
            { id: `010`, name: `일반 사용자` },
            { id: `020`, name: `관리자` },
            { id: `999`, name: `최고 관리자` },
        ],
    },
    {
        id: `040`,
        name: `메시지 타입`,
        list: [
            { id: `010`, name: `text` },
            { id: `020`, name: `image` },
        ],
    },
];

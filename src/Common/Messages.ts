export default {
    error: {
        defaultClientError: `잘못된 요청 입니다.`,
        clientTypeNotFound: `클라이언트 정보가 존재 하지 않습니다.`,
        serverError: `처리중 문제가 발생 했습니다.`,
        authenticateError: `로그인이 필요한 서비스 입니다.`,
        emptyImageFile: `이미지 파일을 등록해 주세요.`,
        emptyNoticeFile: '서버 공지사항 내용이 없습니다.',
    },
    success: {
        default: `정상 처리 하였습니다.`,
    },
    common: {
        emailValidate: `정확한 이메일 주소를 입력해 주세요.`,
        notFoundEmail: `존재 하지 않은 이메일 주소 입니다.`,
        emptyPassword: `패스워드를 입력해 주세요.`,
        checkPassword: `비밀번호는 4~15자 이내여야 합니다.`,
        exitsUser: `존재 하지 않은 사용자 입니다.`,
        exitsMessengerRoom: `이미 존재하는 메신저 입니다.`,
        exitsMessenger: `존재 하지 않는 메신저 입니다.`,
        exitsChat: `존재 하지 않는 채팅 입니다.`,
    },
    auth: {
        register: {
            emailEmpty: `이메일 정보가 존재 하지 않습니다.`,
            passwordEmpty: `비밀번호 정보가 존재 하지 않습니다.`,
            nicknameEmpty: '닉네임 정보가 존재 하지 않습니다.',
            emailValidate: `정확한 이메일 주소를 입력해 주세요.`,
            emailExits: `이미 사용중인 이메일 주소 입니다.`,
            nicknameExists: `이미 사용중인 닉네임 입니다.`,
        },
        login: {
            userExits: `존재 하지 않는 회원 입니다.`,
            checkPassword: `패스워드를 확인해 주세요.`,
            mustEmailAuth: `인증 되지 않은 회원 입니다.`,
        },
        emailAuth: {
            authCodeExits: `존재 하지 않은 인증 코드 입니다.`,
            alreadyCode: `이미 인증을 완료했습니다.`,
            emptyUser: `사용자 정보가 존재 하지 않습니다.`,
            successSubApp: `앱으로 로그인 해주세요.`,
            successSubWeb: `웹으로 로그인 해주세요.`,
        },
        changePassword: {
            resetCodeExits: `존재 하지 않은 변경 코드 입니다.`,
            alreadyCode: `이미 변경을 완료했습니다.`,
            emptyUser: `사용자 정보가 존재 하지 않습니다.`,
            notNormalUser: `변경 불가능한 유저 입니다.`,
        },
    },
    member: {
        profile: {
            emptyProfileImage: `프로필 이미지를 등록해 주세요.`,
            imageCheckError: `이미지 정보가 잘못 되었습니다`,
            emptyNickName: `닉네임을 등록해 주세요`,
            exitsNickName: `이미 사용중인 닉네임 입니다.`,
        },
    },
};

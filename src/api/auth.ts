import request from '../utils/request';
import { API_ROUTES } from '../constants/api';

// 请求参数接口
interface SendCodeParams {
    phone: string;
}

interface LoginParams {
    phone: string;
    code: string;
}

// 响应数据接口
interface SendCodeResponse {
    message: string;
}

interface User {
    id: number;
    phone: string;
    token: string;
    nickname?: string;
    grade?: string;
    major?: number;
    connection?: string;
    connection_type?: string;
    phone_number_with_mask: string;
}

interface LoginResponse {
    user: User;
}

export const authApi = {
    // 发送验证码
    sendCode: (params: SendCodeParams) => {
        return request.get<SendCodeResponse>(API_ROUTES.AUTH.SEND_CODE, { 
            params: { phone: params.phone }
        });
    },
    
    // 登录/注册
    loginOrRegister: (data: LoginParams) => {
        const urlParams = new URLSearchParams();
        urlParams.append('phone', data.phone);
        urlParams.append('code', data.code);
        
        return request.post<LoginResponse>(
            API_ROUTES.AUTH.LOGIN, 
            urlParams,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
    }
};

// 导出类型以供其他文件使用
export type { User, LoginResponse, SendCodeResponse }; 
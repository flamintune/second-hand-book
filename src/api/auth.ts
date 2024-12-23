import request from '../utils/request';
import { API_ROUTES } from '../constants/api';

interface SendCodeParams {
    phone: string;
}

interface LoginParams {
    phone: string;
    code: string;
}

interface LoginResponse {
    user: {
        id: number;
        // 其他用户信息字段...
    };
}

export const authApi = {
    // 发送验证码
    sendCode: (params: SendCodeParams) => {
        return request.get<{ message: string }>(API_ROUTES.AUTH.SEND_CODE, { 
            params: { phone: params.phone }
        });
    },
    
    // 登录/注册
    loginOrRegister: (data: LoginParams) => {
        const formData = new FormData();
        formData.append('phone', data.phone);
        formData.append('code', data.code);
        return request.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, formData);
    }
}; 
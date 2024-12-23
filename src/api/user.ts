import request from '../utils/request';

interface User {
    id: number;
    phone: string;
    nickname?: string;
    grade?: string;
    majorId?: number;
    connection?: string;
    connection_type?: number;
    phone_number_with_mask: string;
}

interface UpdateUserRequest {
    nickname?: string;
    grade?: string;
    majorId?: number;
    connection?: string;
    connection_type?: number;
}

export const userApi = {
    // 获取用户信息
    getUser: (userId: number) => {
        return request.get<{ user: User }>(`/users/${userId}`);
    },

    // 更新用户信息
    updateUser: (userId: number, data: UpdateUserRequest) => {
        return request.put<{ message: string }>(`/users/${userId}`, data);
    },

    // 获取专业列表
    getMajors: () => {
        return request.get<{ majors: Array<{ id: number; name: string }> }>('/users/majors');
    }
};

export type { User, UpdateUserRequest }; 
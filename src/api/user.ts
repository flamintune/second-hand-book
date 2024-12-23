import request from '../utils/request';

interface User {
    id: number;
    phone: string;
    nickname?: string;
    grade?: string;
    major_id?: number;
    connection?: string;
    connection_type?: number;
    phone_number_with_mask: string;
}

interface UpdateUserRequest {
    nickname?: string;
    grade?: string;
    major_id?: number;
    connection?: string;
    connection_type?: number;
}

interface Major {
    id: number;
    national_name: string;
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
    },

    // 根据专业名称查询专业
    getMajorByName: (name: string) => {
        return request.get<{ majors: Major[] }>(`/users/majors?national_name=${encodeURIComponent(name)}`);
    }
};

export type { User, UpdateUserRequest, Major }; 
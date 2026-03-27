import api from '../apiConnect';

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: {
        _id: string;
        name: string;
        email: string;
        systemRole: 'ADMIN' | 'ALUNO';
    };
};

export async function loginRequest(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data;
}

export async function registerRequest(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data;
}

export async function getMeRequest() {
    const res = await api.get('/auth/me');
    return res.data.data;
}

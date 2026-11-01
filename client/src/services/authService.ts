import apiClient from "./apiClient";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<any, { success: boolean; data: LoginResponse }>("/auth/login", {
      email,
      password,
    });
    if (res.data?.token) {
      localStorage.setItem("firstshift_token", res.data.token);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("firstshift_token");
    }
  },

  async getMe(): Promise<AdminUser> {
    const res = await apiClient.get<any, { success: boolean; data: AdminUser }>("/auth/me");
    return res.data;
  },
};

export default authService;

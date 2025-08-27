import api from "./api";

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

const AuthService = {
  async login(payload: LoginPayload) {
    try {
      const { data } = await api.post("auth/login", payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data || error.message,
      };
    }
  },

  async register(payload: RegisterPayload) {
    try {
      const { data } = await api.post("auth/register", payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data || error.message,
      };
    }
  },
};

export default AuthService;

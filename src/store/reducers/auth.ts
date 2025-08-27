export interface AuthState {
    authenticated: boolean;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }
  
  const initialState: AuthState = {
    authenticated: false,
    user: undefined,
  };
  
  type AuthAction =
    | { type: "LOGIN"; payload: AuthState["user"] }
    | { type: "LOGOUT" };
  
  export const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "LOGIN":
        return { ...state, authenticated: true, user: action.payload };
      case "LOGOUT":
        return { ...state, authenticated: false, user: undefined };
      default:
        return state;
    }
  };
// src/store/reducers/auth.ts

// 1. User interfeysi

import { type Action } from "@reduxjs/toolkit";
export interface User {
  id: string;
  name: string;
  email: string;
}

// 2. AuthState interfeysi
export interface AuthState {
  authenticated: boolean;
  user: User | null;
}

// 3. Dastlabki holat
const initialState: AuthState = {
  authenticated: false,
  user: null,
};

// 4. Action turlari
export enum AuthActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

// 5. Action interfeyslari
interface LoginAction {
  type: AuthActionTypes.LOGIN;
  payload: User; // faqat LOGIN uchun
}

interface LogoutAction {
  type: AuthActionTypes.LOGOUT; // bunda payload yo‘q
}

// 6. Umumiy Action tipi
export type AuthAction = LoginAction | LogoutAction;

// 7. Reducer
export const authReducer = (
  state: AuthState = initialState,
  action: AuthAction | Action // 👈 RTK ichki actionlarini ham qabul qiladi
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {
        ...state,
        authenticated: true,
        user: (action as LoginAction).payload, // 👈 faqat LOGIN actionda payload bor
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    default:
      return state;
  }
};


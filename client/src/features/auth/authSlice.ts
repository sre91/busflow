import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

const getInitialAuthState = (): AuthState => {
  try {
    const savedAuth = localStorage.getItem("busflow_auth");

    if (!savedAuth) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }

    const parsedAuth = JSON.parse(savedAuth);

    if (!parsedAuth?.user || !parsedAuth?.token) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }

    return {
      user: parsedAuth.user,
      token: parsedAuth.token,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Failed to load authentication data:", error);

    localStorage.removeItem("busflow_auth");

    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "busflow_auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        }),
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("busflow_auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

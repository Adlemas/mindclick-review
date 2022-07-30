import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import changePasswordAPI from "../api/authentication/changePassword";
import login from "../api/authentication/login";
import refreshToken from "../api/authentication/refreshToken";
import getAuthUser, { GetAuthUserResponse } from "../api/user/getAuthUser";
import uploadPortfolioFileAPI from "../api/user/uploadPortfolioFile";
import { AuthBody, AuthState, LoginResponse, User } from "../types/index";
import handleAxiosError from "../utils/handleAxiosError";
import { deleteAllFromLocal, getItemFromLocal, setItemInLocal } from "../utils/localStorage";
import { RootState } from "./index";


export const initialState: AuthState = {
    user: getItemFromLocal("user") || null,
    loading: false,
    isAuthenticated: false,
    next: "",
}

export const loginAction = createAsyncThunk<LoginResponse, AuthBody>(
    "auth/loginAction",
    async (body: AuthBody, { rejectWithValue }) => {
        try {
            const response = await login(body);
            return response
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Авторизация не удалась")
        }
    }
)

export type UploadFileBody = {
    files: File[]
}

export const uploadPortfolioFile = createAsyncThunk<any, UploadFileBody>(
    "auth/uploadPortfolioFile",
    async (body: UploadFileBody, { rejectWithValue }) => {
        try {
            console.log({ body })
            const response = await uploadPortfolioFileAPI(body.files)
            return response
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue('Не удалось загрузить файлы!')
        }
    }
)

interface ChangePasswordBody {
    oldPassword: string
    newPassword: string
}

export const changePassword = createAsyncThunk<any, ChangePasswordBody>(
    "auth/changePassword",
    async (body: ChangePasswordBody, { rejectWithValue }) => {
        try {
            await changePasswordAPI(body)

            message.success('Успешно!')

            return { status: true }
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue('Не удалось сменить пароль!')
        }
    }
)

export const refreshUserAction = createAsyncThunk<
    User,
    void,
    { state: RootState }
>(
    "auth/refreshUserAction",
    async (_, { rejectWithValue, getState, dispatch }) => {
        try {
            const user = getState().auth.user;
            if (user === null) {
                throw new Error("Пользователь не вошёл!");
            }

            await refreshToken();
            const newUser = await getAuthUser();

            return newUser.user;
        } catch (error: any) {
            dispatch(logoutAction());
            handleAxiosError(error);
            return rejectWithValue(error?.message || "Срок сессии истек!");
        }
    },
);

/**
 * AsyncThunk function for update the user's online/offline status
 */

export const getAuthUserAction = createAsyncThunk<GetAuthUserResponse, void>(
    "auth/getAuthUserAction",
    async (_, { rejectWithValue }) => {
        try {
            const newUsrSession = await getAuthUser();
            return newUsrSession;
        } catch (error: any) {
            handleAxiosError(error);
            return rejectWithValue(error.message);
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState: initialState as AuthState,
    reducers: {
        logoutAction(state: AuthState) {
            deleteAllFromLocal()

            return {
                isAuthenticated: false,
                loading: false,
                next: state.next || "",
                user: null
            }
        },
        refreshUser(state: AuthState) {
            return {
                ...state,
                isAuthenticated: false
            }
        },
        setNextPage(state: AuthState, { payload }) {
            return {
                ...state,
                next: payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Action
            .addCase(loginAction.pending, (state: AuthState) => {
                state.loading = true
            })
            .addCase(loginAction.fulfilled, (state: AuthState, { payload }) => {
                state.loading = false
                if (payload.user) {
                    state.user = payload.user
                    state.isAuthenticated = true

                    setItemInLocal("user", payload.user)
                    setItemInLocal("isAuthenticated", true)

                    message.success("Успешный вход!")
                }
            })
            .addCase(loginAction.rejected, state => {
                state.loading = false
            })
            // refreshUser Action
            .addCase(refreshUserAction.pending, state => {
                state.loading = true
            })
            .addCase(refreshUserAction.fulfilled, (state, { payload }) => {
                setItemInLocal("isAuthenticated", true);
                setItemInLocal("user", payload);

                return {
                    ...state,
                    isAuthenticated: true,
                    user: payload,
                    loading: false,
                }
            })
            .addCase(refreshUserAction.rejected, state => {
                return {
                    ...state,
                    loading: false,
                }
            })
            // get auth user action
            .addCase(getAuthUserAction.pending, state => {
                return {
                    ...state,
                    loading: true
                }
            })
            .addCase(getAuthUserAction.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    user: payload.user,
                    loading: false
                }
            })
            .addCase(getAuthUserAction.rejected, state => {
                return {
                    ...state,
                    loading: false
                }
            })
            // Upload Portfolio File
            .addCase(uploadPortfolioFile.pending, (state) => {
                state.loading = true
            })
            .addCase(uploadPortfolioFile.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(uploadPortfolioFile.rejected, (state) => {
                state.loading = false
            })
    }
})

export const { logoutAction, refreshUser, setNextPage } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer
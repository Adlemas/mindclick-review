import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"
import authSlice from "./auth"
import groupsSlice from "./groups"
import groupSlice from "./group"
import taskSlice from "./task"
import scheduleSlice from "./schedule"
import singleTaskSlice from "./singleTask"
import singleChatSlice from "./singleChat"
import chatsSlice from "./chats"
import callSlice from "./call"
import thunkMiddleware from "redux-thunk"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        groups: groupsSlice,
        group: groupSlice,
        tasks: taskSlice,
        singleTask: singleTaskSlice,
        schedule: scheduleSlice,
        singleChat: singleChatSlice,
        chats: chatsSlice,
        call: callSlice,
    },
    devTools: false,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunkMiddleware),
})

export const storeRef = store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

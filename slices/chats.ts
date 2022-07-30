import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Chat } from "types";
import handleAxiosError from "utils/handleAxiosError";

import createChat, { CreateChatBody, CreateChatResponse } from 'api/chat/createChat'
import getChatByGroupId, { GetChatByGroupIdResponse } from 'api/chat/getChatByGroupId'
import updateChat, { UpdateChatBody, UpdateChatResponse } from 'api/chat/updateChat'
import deleteChat from 'api/chat/deleteChat'
import { message } from "antd";
import { RootState } from "slices";


export interface ChatsState {
    chats: Chat[];
    loading: boolean;
}

/**
 * Async thunk to get all chats
 */
export const getChats = createAsyncThunk<Chat[], string[]>(
    "chats/getChats",
    async (groupIds: string[]): Promise<Chat[]> => {
        const chats = await Promise.all(groupIds.map(async (groupId) => {
            try {
                const chat = await getChatByGroupId(groupId);
                return chat;
            } catch (error) { }
        }));

        return chats.filter(chat => !!chat);
    }
);

/**
 * Async thunk to get chat by group id
 */
export const getChatByGroupIdAction = createAsyncThunk<GetChatByGroupIdResponse, string>(
    "chats/getChatByGroupId",
    async (groupId: string, { rejectWithValue }) => {
        try {
            const chat = await getChatByGroupId(groupId);

            return chat;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to delete chat
 */
export const deleteChatAction = createAsyncThunk<void, string>(
    "chats/deleteChat",
    async (chatId: string, { rejectWithValue }) => {
        try {
            await deleteChat(chatId);
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to update chat
 */
export const updateChatAction = createAsyncThunk<UpdateChatResponse, [string, UpdateChatBody]>(
    "chats/updateChat",
    async ([chatId, chat]: [string, UpdateChatBody], { rejectWithValue, dispatch, getState }) => {
        try {
            const store = (getState() as RootState);
            const { auth: { user } } = store;
            const updatedChat = await updateChat(chatId, chat);

            dispatch(getChats(user.groups || []))

            return updatedChat;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to create chat
 */
export const createChatAction = createAsyncThunk<CreateChatResponse, CreateChatBody>(
    'chats/createChat',
    async (chat: CreateChatBody, { rejectWithValue }) => {
        try {
            const newChat = await createChat(chat);

            return newChat;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || error);
        }
    }
)


/**
 * Initial State
 */
const initialState: ChatsState = {
    chats: [],
    loading: false
}

/**
 * Chats Slice
 */
const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        clearChats: (state) => {
            state.chats = [];
        },
    },
    extraReducers: builder => {
        builder.addCase(getChatByGroupIdAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(getChatByGroupIdAction.fulfilled, (state, action) => {
            state.chats = [...state.chats, action.payload];
            state.loading = false;
        });
        builder.addCase(getChatByGroupIdAction.rejected, (state, action) => {
            state.loading = false;
        });
        builder.addCase(deleteChatAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(deleteChatAction.fulfilled, (state, action) => {
            state.loading = false;
            message.success("Чат успешно удален");
        });
        builder.addCase(deleteChatAction.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateChatAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateChatAction.fulfilled, (state) => {
            state.loading = false;
            message.success("Чат обновлен");
        });
        builder.addCase(updateChatAction.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createChatAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createChatAction.fulfilled, (state, action) => {
            state.chats = [...state.chats, action.payload];
            message.success('Чат создан!');
            state.loading = false;
        });
        builder.addCase(createChatAction.rejected, (state, action) => {
            state.loading = false;
        });
        builder.addCase(getChats.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(getChats.fulfilled, (state, action) => {
            console.log({ chats: action.payload })
            state.chats = action.payload;
            state.loading = false;
        });
        builder.addCase(getChats.rejected, (state, action) => {
            state.loading = false;
        });
    }
});

export const { clearChats } = chatsSlice.actions;

export default chatsSlice.reducer;
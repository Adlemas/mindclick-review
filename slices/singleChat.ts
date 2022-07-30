
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Channel, Chat } from "types";


import getChatChannels, { GetChatChannelsResponse } from "api/chat/getChatChannels";

import getChat from "api/chat/getChat";
import getChatByGroupId, { GetChatByGroupIdResponse } from "api/chat/getChatByGroupId";
import createChannel, { CreateChannelBody, CreateChannelResponse } from "api/chat/channel/createChannel";
import updateChannel, { UpdateChannelBody, UpdateChannelResponse } from "api/chat/channel/updateChannel";
import deleteChannel, { DeleteChannelResponse } from "api/chat/channel/deleteChannel";
import getChannelMessages, { getChannelMessagesResponse } from "api/chat/channel/getChannelMessages";
import sendMessage, { SendMessageBody, SendMessageResponse } from "api/message/sendMessage";
import getChannel from "api/chat/channel/getChannel";

import handleAxiosError from "utils/handleAxiosError";
import { message } from "antd";
import { RootState } from "slices";
import { setItemInLocal } from "utils/localStorage";

/**
 * Async thunk to get chat by group id and set it to state
 */
export const getChatByGroupIdAction = createAsyncThunk(
    "chat/getChatByGroupId",
    async (groupId: string, { rejectWithValue }) => {
        try {
            const response = await getChatByGroupId(groupId);
            return response;
        } catch (error) {
            handleAxiosError(error);
            return rejectWithValue(error);
        }
    }
);

/**
 * Async thunk to get chat channels
 */
export const getChatChannelsAction = createAsyncThunk<GetChatChannelsResponse, void>(
    "chats/getChatChannels",
    async (_, { rejectWithValue, getState }) => {
        try {
            const singleChatState = (getState() as RootState).singleChat
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error("Выберите чат!");
                return
            }
            const channels = await getChatChannels(chatId);

            return channels;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to get single chat channel
 */
export const getSingleChatChannelAction = createAsyncThunk<Channel, string>(
    "chats/getSingleChatChannel",
    async (channelId: string, { rejectWithValue, getState }) => {
        try {
            const singleChatState = (getState() as RootState).singleChat
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error("Выберите чат!");
                return
            }
            const channel = await getChannel(chatId, channelId);

            return channel;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to create chat channel
 */
export const createChannelAction = createAsyncThunk<CreateChannelResponse, CreateChannelBody>(
    "chats/createChannel",
    async (channel: CreateChannelBody, { rejectWithValue, getState }) => {
        try {
            const singleChatState = (getState() as RootState).singleChat;
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error('Выберите чат!');
                return null;
            }
            const createdChannel = await createChannel(chatId, channel);

            console.log({ createChannel })

            return createdChannel;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to update chat channel
 */
export const updateChannelAction = createAsyncThunk<UpdateChannelResponse, [string, UpdateChannelBody]>(
    "chats/updateChannel",
    async ([channelId, channel], { rejectWithValue, getState, dispatch }) => {
        try {
            const singleChatState = (getState() as RootState).singleChat;
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error('Выберите чат!');
                return null;
            }

            const updatedChannel = await updateChannel(chatId, channelId, channel);

            dispatch(getChatChannelsAction());

            return updatedChannel;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to delete chat channel
 */
export const deleteChannelAction = createAsyncThunk<DeleteChannelResponse, string>(
    "chats/deleteChannel",
    async (channelId: string, { rejectWithValue, getState, dispatch }) => {
        try {
            const singleChatState = (getState() as RootState).singleChat;
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error('Выберите чат!');
                return null;
            }

            const response = await deleteChannel(chatId, channelId);

            dispatch(getChatChannelsAction());

            return response;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to get chat
 */
export const getChatAction = createAsyncThunk<Chat, string>(
    "chats/getChat",
    async (chatId: string, { rejectWithValue }) => {
        try {
            const chat = await getChat(chatId);

            return chat;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to get channel messages
 */
export const getChannelMessagesAction = createAsyncThunk<getChannelMessagesResponse, string>(
    "chats/getChannelMessages",
    async (channelId, { rejectWithValue, getState }) => {
        try {
            const singleChatState = (getState() as RootState).singleChat;
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error('Выберите чат!');
                return [];
            }

            const messages = await getChannelMessages(chatId, channelId);

            return messages;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);

/**
 * Async thunk to send message
 */
export const sendMessageAction = createAsyncThunk<SendMessageResponse, SendMessageBody>(
    "chats/sendMessage",
    async (body: SendMessageBody, { rejectWithValue, getState, dispatch }) => {
        try {
            const singleChatState: ISingleChatState = (getState() as RootState).singleChat;
            const chatId = singleChatState.chat ? singleChatState.chat._id : null;
            if (!chatId) {
                message.error('Выберите чат!');
                return null;
            }

            const channelId = singleChatState.channel ? singleChatState.channel._id : null;

            if (!channelId) {
                message.error('Выберите канал!');
                return null;
            }

            const sentMessage = await sendMessage(chatId, channelId, body);

            dispatch(getChannelMessagesAction(channelId))

            return sentMessage;
        } catch (error) {
            handleAxiosError(error)
            rejectWithValue(error.message || "Что-то пошло не так");
        }
    }
);


/**
 * Initial state interface for single chat
 */
export interface ISingleChatState {
    chat: Chat | null;
    channel: Channel | null;
    loading: boolean;
    sending: boolean;
}

/**
 * Initial state for single chat
 */
export const initialSingleChatState: ISingleChatState = {
    chat: null,
    channel: null,
    loading: false,
    sending: false,
}

/**
 * Create a slice for single chat
 */
export const singleChatSlice = createSlice({
    name: "singleChat",
    initialState: initialSingleChatState,
    reducers: {
        setChat: (state, action) => {
            state.chat = action.payload;
        },
        clearChat: (state) => {
            state.chat = null;
        },
        setChannel: (state, action) => {
            if (state.channel && state.channel._id === action.payload._id)
                return
            setItemInLocal("channelId", action.payload._id);
            return {
                ...state,
                channel: {
                    ...action.payload,
                },
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(getChatChannelsAction.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getChatChannelsAction.fulfilled, (state, action) => {
            state.loading = false
            state.chat.channels = action.payload
        });
        builder.addCase(getChatChannelsAction.rejected, (state) => {
            state.loading = false
        });

        builder.addCase(getSingleChatChannelAction.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getSingleChatChannelAction.fulfilled, (state, action) => {
            state.loading = false
            state.channel = action.payload
        })
        builder.addCase(getSingleChatChannelAction.rejected, (state) => {
            state.loading = false
        })

        builder.addCase(getChatAction.pending, (state) => {
            state.loading = true
        });
        builder.addCase(getChatAction.fulfilled, (state, action) => {
            state.loading = false
            state.chat = action.payload
        });
        builder.addCase(getChatAction.rejected, (state) => {
            state.loading = false
        });
        builder.addCase(createChannelAction.pending, (state) => {
            state.loading = true
        });
        builder.addCase(createChannelAction.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                message.success(`Канал ${action.payload.title} создан`)
                state.chat.channels.push(action.payload)
            }
        });
        builder.addCase(createChannelAction.rejected, (state) => {
            state.loading = false
        });
        builder.addCase(updateChannelAction.pending, (state) => {
            state.loading = true
        });
        builder.addCase(updateChannelAction.fulfilled, (state, action) => {
            state.loading = false
            message.success(action.payload.message)
        });
        builder.addCase(updateChannelAction.rejected, (state) => {
            state.loading = false
        });
        builder.addCase(deleteChannelAction.pending, (state) => {
            state.loading = true
        });
        builder.addCase(deleteChannelAction.fulfilled, (state, action) => {
            state.loading = false
            message.success(action.payload.message)
        });
        builder.addCase(deleteChannelAction.rejected, (state) => {
            state.loading = false
        });
        builder.addCase(getChannelMessagesAction.pending, (state) => {
            state.loading = true
        });
        builder.addCase(getChannelMessagesAction.fulfilled, (state, action) => {
            state.loading = false
            state.channel.messages = action.payload
        });
        builder.addCase(getChannelMessagesAction.rejected, (state) => {
            state.loading = false
        });
        builder.addCase(sendMessageAction.pending, (state) => {
            state.sending = true
        });
        builder.addCase(sendMessageAction.fulfilled, (state, action) => {
            state.sending = false
        });
        builder.addCase(sendMessageAction.rejected, (state) => {
            state.sending = false
        });

        builder.addCase(getChatByGroupIdAction.pending, (state) => {
            state.loading = true
        });
        builder.addCase(getChatByGroupIdAction.fulfilled, (state, action) => {
            state.loading = false
            state.chat = action.payload
        });
        builder.addCase(getChatByGroupIdAction.rejected, (state) => {
            state.loading = false
        });
    }
});

/**
 * Export the actions for single chat
 */
export const { setChat, clearChat, setChannel } = singleChatSlice.actions;

export default singleChatSlice.reducer;
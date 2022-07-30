

import axios from "api/axios";
import { Chat } from "types";

export interface CreateChatBody {
    title: string;
    groupId: string;
}

export interface CreateChatResponse extends Chat { }

const createChat = async (chat: CreateChatBody): Promise<CreateChatResponse> => {
    try {
        const { data } = await axios.post("chat", chat);

        return data;
    } catch (error) {
        throw error;
    }
}

export default createChat;
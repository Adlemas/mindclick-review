import axios from "api/axios";


export interface UpdateChatBody {
    title: string;
}

export interface UpdateChatResponse {
    message: string;
}

const updateChat = async (chatId: string, chat: UpdateChatBody): Promise<UpdateChatResponse> => {
    try {
        const { data } = await axios.put(`chat/${chatId}`, chat);

        return data;
    } catch (error) {
        throw error;
    }
}

export default updateChat;
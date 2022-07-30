import axios from "api/axios";
import { Message } from "types";


export type getChannelMessagesResponse = Message[]

const getChannelMessages = async (chatId: string, channelId: string): Promise<getChannelMessagesResponse> => {
    try {
        const { data } = await axios.get(`chat/${chatId}/channel/${channelId}/messages`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default getChannelMessages;

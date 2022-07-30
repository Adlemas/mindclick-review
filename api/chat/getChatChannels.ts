

import axios from "api/axios";
import { Channel } from "types";

export type GetChatChannelsResponse = Channel[];

const getChatChannels = async (chatId: string): Promise<Channel[]> => {
    try {
        const { data } = await axios.get(`chat/${chatId}/channels`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default getChatChannels;


import axios from "api/axios";
import { Channel } from "types";

const getChannel = async (chatId: string, channelId: string): Promise<Channel> => {
    try {
        const { data } = await axios.get(`chat/${chatId}/channel/${channelId}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default getChannel;


import axios from "api/axios";

export interface UpdateChannelBody {
    title: string;
}

export interface UpdateChannelResponse {
    message: string;
}

const updateChannel = async (chatId: string, channelId: string, channel: UpdateChannelBody): Promise<UpdateChannelResponse> => {
    try {
        const { data } = await axios.put(`chat/${chatId}/channel/${channelId}`, channel);

        return data;
    } catch (error) {
        throw error;
    }
}

export default updateChannel
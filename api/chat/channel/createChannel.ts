

import axios from "api/axios";
import { Channel, ChannelType } from "types";

export interface CreateChannelResponse extends Channel { }

export interface CreateChannelBody {
    title: string
    type: ChannelType
}

const createChannel = async (chatId: string, channel: CreateChannelBody): Promise<CreateChannelResponse> => {
    try {
        const { data } = await axios.post(`chat/${chatId}/channel`, channel);

        return data;
    } catch (error) {
        throw error;
    }
}

export default createChannel;

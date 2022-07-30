import axios from "api/axios";


export interface DeleteChannelResponse {
    message: string;
}

const deleteChannel = async (chatId: string, channelId: string): Promise<DeleteChannelResponse> => {
    try {
        const { data } = await axios.delete(`chat/${chatId}/channel/${channelId}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default deleteChannel;

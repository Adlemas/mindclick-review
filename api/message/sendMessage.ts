import axios from "api/axios";
import { Message, MessageType } from "types";


export interface SendMessageBody {
    content: string;
    type: MessageType;
    replyTo?: string;
}

export interface SendMessageResponse extends Message { }

const sendMessage = async (chatId: string, channelId: string, message: SendMessageBody): Promise<SendMessageResponse> => {
    try {
        const { data } = await axios.post(`chat/${chatId}/channel/${channelId}/message`, message);

        return data;
    } catch (error) {
        throw error;
    }
}

export default sendMessage;

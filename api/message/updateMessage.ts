import axios from "api/axios";

export interface UpdateMessageBody {
    content: string;
}

export interface UpdateMessageResponse {
    message: string;
}

const updateMessage = async (messageId: string, message: UpdateMessageBody): Promise<UpdateMessageResponse> => {
    try {
        const { data } = await axios.put(`message/${messageId}`, message);

        return data;
    } catch (error) {
        throw error;
    }
}

export default updateMessage;
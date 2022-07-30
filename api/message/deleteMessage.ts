import axios from "api/axios";


export interface DeleteMessageResponse {
    message: string;
}

const deleteMessage = async (messageId: string): Promise<DeleteMessageResponse> => {
    try {
        const { data } = await axios.delete(`message/${messageId}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default deleteMessage;
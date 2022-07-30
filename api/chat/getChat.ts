import axios from "api/axios";
import { Chat } from "types";



const getChat = async (chatId: string): Promise<Chat> => {
    try {
        const { data } = await axios.get(`chat/${chatId}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default getChat;
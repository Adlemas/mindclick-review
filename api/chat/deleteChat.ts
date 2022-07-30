
import axios from "api/axios";


const deleteChat = async (chatId: string): Promise<void> => {
    try {
        await axios.delete(`chat/${chatId}`);
    } catch (error) {
        throw error;
    }
}

export default deleteChat;
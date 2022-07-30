import axios from "api/axios";
import { Chat } from "types";


export interface GetChatByGroupIdResponse extends Chat { }

const getChatByGroupId = async (groupId: string): Promise<GetChatByGroupIdResponse> => {
    try {
        const { data } = await axios.get(`chat/group/${groupId}`);

        return data;
    } catch (error) {
        throw error;
    }
}

export default getChatByGroupId;
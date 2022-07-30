import axios from "api/axios";
import { Group } from "types";


export interface UpdateGroupBody {
    name: string
    maxMembers: number
}

export interface UpdateGroupResponse extends Group { }

const updateGroupAPI = async (groupId: string, body: UpdateGroupBody) => {
    const response = await axios.put(`/group/${groupId}`, body);
    return response.data;
}

export default updateGroupAPI;
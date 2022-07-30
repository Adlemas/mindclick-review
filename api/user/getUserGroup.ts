
// Import axios instance from "api/axios"
import axios from "api/axios";
import { Group, User } from "types";

/**
 * Function to get user group, with get request to "/group"
 */
export const getUserGroup = async (): Promise<{ group: Group, owner: User }> => {
    try {
        // get request to "/group" with Group Return Type
        const { data } = await axios.get<{ group: Group, users: User[], owner: User }>("/group");
        data.group.members = data.users
        return {
            group: data.group,
            owner: data.owner
        };
    } catch (error) {
        throw error
    }
}

// Export getUserGroup function
export default getUserGroup;
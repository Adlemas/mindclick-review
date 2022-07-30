import axios from "api/axios";
import { Schedule } from "types";


// Function to request for schedule with user id in members
const getScheduleWithMember = async (userId: string) => {
    try {
        const response = await axios.get<Schedule[]>(`/schedule/${userId}`);
        return response.data;
    } catch (error) {
        throw error
    }
}

export default getScheduleWithMember;
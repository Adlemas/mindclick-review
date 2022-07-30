import axios from "api/axios"
import { Schedule } from "types";

// Function to request for schedules for the current user
const getMySchedule = async () => {
    try {
        const response = await axios.get<Schedule[]>("/myschedule");
        return response.data;
    } catch (error) {
        throw error
    }
}

export default getMySchedule
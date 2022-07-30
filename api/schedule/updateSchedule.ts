import axios from "api/axios";
import { Schedule } from "types";


// Function to request schedule update
const updateSchedule = async (scheduleId: string, schedule: Schedule) => {
    try {
        const response = await axios.put(`/schedule/${scheduleId}`, schedule);
        return response.data;
    } catch (error) {
        throw error
    }
}

export default updateSchedule;
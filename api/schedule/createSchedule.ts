import axios from "api/axios";
import { Schedule } from "types";



// Function to request schedule creation
const createSchedule = async (schedule: Schedule) => {
    try {
        const response = await axios.post("/schedule", schedule);
        return response.data;
    } catch (error) {
        throw error
    }
}

export default createSchedule;
import axios from "api/axios";


// Function to request schedule deletion
const deleteSchedule = async (scheduleId: string) => {
    try {
        const response = await axios.delete(`/schedule/${scheduleId}`);
        return response.data;
    } catch (error) {
        throw error
    }
}

export default deleteSchedule;
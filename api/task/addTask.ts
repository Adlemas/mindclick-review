import { Task } from "types";
import axios from "api/axios";


const addTaskAPI = async (task: Task) => {
    try {
        const { data } = await axios.put(`tasks/${task.userId}`, {
            ...task
        })

        return data
    } catch (err) {
        throw err
    }
}

export default addTaskAPI
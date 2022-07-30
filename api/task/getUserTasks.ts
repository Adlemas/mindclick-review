

import axios from "api/axios";
import { Task } from "types";
import handleAxiosError from "utils/handleAxiosError";

// function getUserTasks which make axios request to "/tasks" and return task list
export const getUserTasks = async (): Promise<Task[]> => {
    try {
        const { data } = await axios.get<{ tasks: Task[] }>("/tasks");
        return data.tasks;
    } catch (error) {
        handleAxiosError(error);
        throw new Error(error.message || "Не удалось загрузить задания");
    }
}

export default getUserTasks;
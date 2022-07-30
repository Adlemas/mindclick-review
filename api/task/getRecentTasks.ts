import axios from "api/axios";
import { Task } from "types";

/**
 * Response for the Get Auth User API
 */

export interface GetRecentTasksResponse {
    tasks: Task[]
}

const getRecentTasks = async (): Promise<GetRecentTasksResponse> => {
    try {
        const { data } = await axios.get<GetRecentTasksResponse>(
            `tasks/recent/10`,
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export default getRecentTasks;

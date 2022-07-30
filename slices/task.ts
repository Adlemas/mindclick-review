import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import addTaskAPI from "../api/task/addTask";
import removeTask from "../api/task/removeTask";
import getRecentTasks from "../api/task/getRecentTasks";
import { Task, TaskState } from "../types";
import handleAxiosError from "../utils/handleAxiosError";
import { RootState } from "./index";
import getUserTasks from "api/task/getUserTasks";

export const initialState: TaskState = {
    tasks: [],
    loading: true
}

// Async thunk for getting my tasks with get request to "/tasks"
export const getUserTasksAction = createAsyncThunk(
    "task/getUserTasksAction",
    async (_, { rejectWithValue }): Promise<Task[]> => {
        try {
            const tasks = await getUserTasks()
            return tasks
        } catch (error) {
            handleAxiosError(error);
            rejectWithValue(error.message || "Не удалось загрузить задания");
        }
    }
);

export const fetchRecentTasks = createAsyncThunk(
    'tasks/getRecentTasks',
    async () => {
        try {
            const response = await getRecentTasks()
            console.log(response)
            return { tasks: response.tasks }
        } catch (err: any) {
            handleAxiosError(err)
        }
    }
)

export const addTask = createAsyncThunk<any, Task>(
    'tasks/addTask',
    async (task) => {
        try {
            const data = await addTaskAPI(task)

            console.log(data)

            return data
        } catch (err: any) {
            handleAxiosError(err)
        }
    }
)

export const deleteTask = createAsyncThunk<any, string>(
    'tasks/deleteTask',
    async (taskId, { rejectWithValue }) => {
        try {
            const isSuccess = await removeTask(taskId)
            return isSuccess
        } catch (err: any) {
            handleAxiosError(err)
            rejectWithValue('Не удалось удалить задание!')
        }
    }
)

const taskSlice = createSlice({
    name: "tasks",
    initialState: initialState as TaskState,
    reducers: {
        setTasks: (state: TaskState, action) => {
            state.tasks = action.payload
        },
        setTasksLoading: (state: TaskState, action) => {
            state.loading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentTasks.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchRecentTasks.fulfilled, (state, { payload }) => {
                if (payload) {
                    return {
                        loading: false,
                        tasks: payload.tasks,
                    }
                } else {
                    state.loading = false
                }
            })
            .addCase(fetchRecentTasks.rejected, (state) => {
                state.loading = false
            })

            .addCase(addTask.pending, (state) => {
                state.loading = true
            })
            .addCase(addTask.fulfilled, (state) => {
                state.loading = false
                message.success('Успешно!')
            })
            .addCase(addTask.rejected, (state) => {
                state.loading = false
            })

            .addCase(deleteTask.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteTask.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteTask.rejected, (state) => {
                state.loading = false
            })

            .addCase(getUserTasksAction.pending, (state) => {
                state.loading = true
            })
            .addCase(getUserTasksAction.fulfilled, (state, { payload }) => {
                return {
                    loading: false,
                    tasks: payload
                }
            })
            .addCase(getUserTasksAction.rejected, (state) => {
                state.loading = false
            })
    }
})

export const { setTasks, setTasksLoading } = taskSlice.actions

export const selectTasks = (state: RootState) => state.tasks

export default taskSlice.reducer
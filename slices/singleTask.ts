import { Task } from "types";

import { createSlice } from "@reduxjs/toolkit";

/**
 * Create initial state interface for the reducer
 * with task conditionally typed as null or single Task type and loading boolean
 */
export interface TaskState {
    task: Task | null;
}

/**
 * Create initial state with TaskState type
 */
export const initialState: TaskState = {
    task: null,
}

/**
 * Create reducer for the task slice
 */
export const taskSlice = createSlice({
    name: "singleTask",
    initialState,
    reducers: {
        setTask: (state, action) => {
            state.task = action.payload;
        },
        clearTask: (state) => {
            state.task = null;
        }
    }
});

export const { setTask, clearTask } = taskSlice.actions;

export default taskSlice.reducer;
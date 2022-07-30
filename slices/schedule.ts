import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import createSchedule from "api/schedule/createSchedule";
import deleteSchedule from "api/schedule/deleteSchedule";
import getMySchedule from "api/schedule/getMySchedule";
import getScheduleWithMember from "api/schedule/getScheduleWithMember";
import updateSchedule from "api/schedule/updateSchedule";
import { Schedule } from "types";
import handleAxiosError from "utils/handleAxiosError";

/**
 * Type Defination for the Schedule State
 */
export interface ScheduleState {
    schedules: Schedule[];
    loading: boolean;
    updating: boolean;
}

/**
 * Initial State for the Schedule State
 */
export const initialState: ScheduleState = {
    schedules: [],
    loading: false,
    updating: false,
};

/**
 * Type Defination for Schedule Creation
 */
export const createScheduleAction = createAsyncThunk(
    "schedule/createScheduleAction",
    async (schedule: Schedule, { rejectWithValue, dispatch }) => {
        try {
            const response = await createSchedule(schedule);
            dispatch(getAllSchedulesAction())
            return response.data;
        } catch (error) {
            // handle axios error with handleAxiosError
            handleAxiosError(error);
            return rejectWithValue(error);
        }
    }
);

/**
 * Async thunk to get all schedules for the current user
 */
export const getAllSchedulesAction = createAsyncThunk<Schedule[]>(
    "schedule/getAllSchedulesAction",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMySchedule();
            return response;
        } catch (error) {
            // handle axios error with handleAxiosError
            handleAxiosError(error);
            return rejectWithValue(error);
        }
    }
);

/**
 * Async thunk to get all schedules with current user in members
 */
export const getAllSchedulesWithMembersAction = createAsyncThunk<Schedule[], string>(
    "schedule/getAllSchedulesWithMembersAction",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await getScheduleWithMember(userId);
            return response;
        } catch (error) {
            // handle axios error with handleAxiosError
            handleAxiosError(error);
            return rejectWithValue(error);
        }
    }
);

/**
 * Async thunk to delete a schedule
 */
export const deleteScheduleAction = createAsyncThunk<void, string>(
    "schedule/deleteScheduleAction",
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteSchedule(id);
            dispatch(getAllSchedulesAction());
            return response;
        } catch (error) {
            // handle axios error with handleAxiosError
            handleAxiosError(error);
            return rejectWithValue(error);
        }
    }
);

/**
 * Async thunk to update a schedule 
 */
export const updateScheduleAction = createAsyncThunk<void, Schedule>(
    "schedule/updateScheduleAction",
    async (schedule: Schedule, { rejectWithValue, dispatch }) => {
        try {
            const response = await updateSchedule(schedule._id, schedule);
            dispatch(getAllSchedulesAction());
            return response;
        } catch (error) {
            // handle axios error with handleAxiosError
            handleAxiosError(error);
            return rejectWithValue(error);
        }
    }
);

/**
 * Schedule slice
 */
const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        clearSchedules: (state) => {
            state.schedules = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createScheduleAction.pending, (state) => {
            state.updating = true;
        });
        builder.addCase(createScheduleAction.fulfilled, (state, action) => {
            state.updating = false;
            message.success('Встреча запланирована!');
        });
        builder.addCase(createScheduleAction.rejected, (state) => {
            state.updating = false;
        });
        builder.addCase(getAllSchedulesAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllSchedulesAction.fulfilled, (state, action) => {
            state.schedules = action.payload;
            state.loading = false;
        });
        builder.addCase(getAllSchedulesAction.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getAllSchedulesWithMembersAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllSchedulesWithMembersAction.fulfilled, (state, action) => {
            state.schedules = action.payload;
            state.loading = false;
        });
        builder.addCase(getAllSchedulesWithMembersAction.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteScheduleAction.pending, (state) => {
            state.updating = true;
        });
        builder.addCase(deleteScheduleAction.fulfilled, (state, action) => {
            state.updating = false;
            message.success('Встреча удалена!');
        });
        builder.addCase(deleteScheduleAction.rejected, (state) => {
            state.updating = false;
        });
        builder.addCase(updateScheduleAction.pending, (state) => {
            state.updating = true
        });
        builder.addCase(updateScheduleAction.fulfilled, (state, action) => {
            state.updating = false;
            message.success('Встреча обновлена!');
        });
        builder.addCase(updateScheduleAction.rejected, (state) => {
            state.updating = false;
        });
    },
});

/**
 * Schedule actions
 */
export const { clearSchedules } = scheduleSlice.actions;

/**
 * Schedule reducer
 */
export default scheduleSlice.reducer;
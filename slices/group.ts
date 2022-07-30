// Import create slice method from redux toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import handleAxiosError method from "utils/handleAxiosError"
import handleAxiosError from "../utils/handleAxiosError";

import getUserGroup from "api/user/getUserGroup";

import { Group, User } from "types";


/**
 * Create initial state interface for the group reducer
 * with group instance and loading status
 */
interface GroupState {
    group: Group | null;
    owner: User | null;
    loading: boolean;
}

// Create initial state for the group reducer
const initialState: GroupState = {
    group: null,
    owner: null,
    loading: false
}

/**
 * Interface getGroupActionBody
 */
export interface getGroupActionBody {
    userId: string
}

/**
 * Thunk action to get single group with getUserGroup API method
 */
export const getGroupAction = createAsyncThunk<{ group: Group, owner: User }, void>(
    "groups/getGroupAction",
    async (_, { rejectWithValue }) => {
        try {
            const { group, owner } = await getUserGroup();
            console.log("ACTION", {
                group,
                owner
            })
            return {
                group,
                owner
            }
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Получение группы не удалось")
        }
    }
)

// Create group slice with redux toolkit
const groupSlice = createSlice({
    name: "group",
    initialState: initialState as GroupState,
    reducers: {
        // clear group
        clearGroup: (state) => {
            state.group = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGroupAction.pending, (state) => {
            state.loading = true
        }
        )
        builder.addCase(getGroupAction.fulfilled, (state, action) => {
            console.log({ owner: action.payload.owner })
            state.group = action.payload.group
            state.owner = action.payload.owner
            state.loading = false
        }
        )
        builder.addCase(getGroupAction.rejected, (state) => {
            state.loading = false
        }
        )
    }
})

// export groupSlice actions
export const { clearGroup } = groupSlice.actions;

// export groupSlice reducer
export default groupSlice.reducer;

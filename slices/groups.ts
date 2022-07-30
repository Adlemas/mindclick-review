import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import updateGroupAPI, { UpdateGroupBody, UpdateGroupResponse } from "api/user/updateGroup";
import { addGroup, addMember, deleteGroup, deleteMember } from "../api/user/manageGroups";
import updateUserProfile from "../api/user/updateUserProfile";
import { Group, GroupsState, User } from "../types";
import getAllGroupsMeta from "../utils/getAllGroupsMeta";
import handleAxiosError from "../utils/handleAxiosError";
import { RootState } from "./index";

export interface DeleteMemberBody {
    groupId: string;
    memberId: string;
}

export interface getAllGroupsBody {
    groupIds: string[];
}

export interface AllGroupsResponse {
    groups: Group[];
}

export const getAllGroupsAction = createAsyncThunk<AllGroupsResponse, getAllGroupsBody>(
    "groups/getAllGroupsAction",
    async (body: getAllGroupsBody, { rejectWithValue }) => {
        try {
            const groups = await getAllGroupsMeta(body.groupIds);
            return { groups: groups || [] }
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Получение групп не удалось")
        }
    }
)

interface addMemberBody {
    groupId: string;
    member: User;
}

export const addMemberAction = createAsyncThunk<null, addMemberBody>(
    "groups/addMemberAction",
    async (body: addMemberBody, { rejectWithValue }) => {
        try {
            await addMember(body.groupId, body.member);
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Не удалось добавить группу!")
        }
    }
)

export interface updateMemberBody {
    id: string
    user: User
}

export const updateMemberAction = createAsyncThunk<null, updateMemberBody>(
    "groups/updateMemberAction",
    async ({ id, user }, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const groupIds = state.groups.groups.map(group => group._id);
            await updateUserProfile(id, user)
            dispatch(getAllGroupsAction({ groupIds }))
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Не удалось обновить профиль участника!")
        }
    }
)

type AddGroupBody = Group

export const addGroupAction = createAsyncThunk<null, AddGroupBody>(
    "groups/addGroupAction",
    async (body: AddGroupBody, { rejectWithValue }) => {
        try {
            await addGroup(body);
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Не удалось добавить группу!")
        }
    }
)

export interface getGroupActionBody {
    groupId: string;
}

export interface RemoveMemberResponse {
    groupId: string;
    memberId: string;
}

export const removeMemberAction = createAsyncThunk<RemoveMemberResponse, DeleteMemberBody>(
    "groups/removeMemberAction",
    async (body: DeleteMemberBody, { rejectWithValue }) => {
        try {
            await deleteMember(body.groupId, body.memberId);
            return body
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Удаление не удалось")
        }
    }
)

export interface DeleteGroupBody {
    groupId: string;
}

export const removeGroupAction = createAsyncThunk<null, DeleteGroupBody>(
    "groups/removeGroupAction",
    async (body: DeleteGroupBody, { rejectWithValue }) => {
        try {
            await deleteGroup(body.groupId)
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Удаление не удалось")
        }
    }
)

export const updateGroupAction = createAsyncThunk<UpdateGroupResponse, [string, UpdateGroupBody]>(
    "groups/updateGroupAction",
    async ([groupId, body], { rejectWithValue }) => {
        try {
            const response = await updateGroupAPI(groupId, body);
            return response;
        } catch (error: any) {
            handleAxiosError(error)
            return rejectWithValue("Обновление не удалось")
        }
    }
)

export const initialState: GroupsState = {
    groups: [],
    loading: true,
}

const groupsSlice = createSlice({
    name: "groups",
    initialState: initialState as GroupsState,
    reducers: {
        setGroups: (state: GroupsState, action) => {
            state.groups = action.payload
        },
        setGroupsLoading: (state: GroupsState, action) => {
            state.loading = action.payload
        },
    },
    extraReducers: (builder) => {
        // removeMemberAction
        builder
            .addCase(removeMemberAction.pending, (state) => {
                state.loading = true
            })
            .addCase(removeMemberAction.fulfilled, (state, { payload }) => {
                if (payload) message.success('Успешное удаление!')
                state.loading = false

            })
            .addCase(removeMemberAction.rejected, (state) => {
                state.loading = false
            })

            // getAllGroupsAction
            .addCase(getAllGroupsAction.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllGroupsAction.fulfilled, (state, { payload }) => {
                return {
                    groups: payload.groups,
                    loading: false
                }
            })
            .addCase(getAllGroupsAction.rejected, (state) => {
                return {
                    groups: state.groups,
                    loading: false
                }
            })

            // RemoveGroup
            .addCase(removeGroupAction.pending, (state) => {
                return {
                    groups: [],
                    loading: true
                }
            })
            .addCase(removeGroupAction.fulfilled, (state) => {
                message.success('Успешное удаление!')

                return {
                    groups: state.groups,
                    loading: false
                }
            })
            .addCase(removeGroupAction.rejected, (state) => {
                return {
                    groups: state.groups,
                    loading: false
                }
            })

            // Add Member 
            .addCase(addMemberAction.pending, (state) => {
                return {
                    groups: [],
                    loading: true
                }
            })
            .addCase(addMemberAction.fulfilled, (state) => {

                return {
                    groups: state.groups,
                    loading: false
                }
            })
            .addCase(addMemberAction.rejected, (state) => {
                return {
                    groups: state.groups,
                    loading: false
                }
            })

            // Add Group
            .addCase(addGroupAction.pending, (state) => {
                return {
                    groups: [],
                    loading: true
                }
            })
            .addCase(addGroupAction.fulfilled, (state) => {

                return {
                    groups: state.groups,
                    loading: false
                }
            })
            .addCase(addGroupAction.rejected, (state) => {
                return {
                    groups: state.groups,
                    loading: false
                }
            })

            // updateMemberAction
            .addCase(updateMemberAction.pending, (state) => {
                state.loading = true
            })
            .addCase(updateMemberAction.fulfilled, (state) => {
                state.loading = true
            })
            .addCase(updateMemberAction.rejected, (state) => {
                state.loading = true
            })

            // updateGroupAction
            .addCase(updateGroupAction.pending, (state) => {
                state.loading = true
            })
            .addCase(updateGroupAction.fulfilled, (state) => {
                message.success("Успешное обновление!")
                state.loading = false
            })
            .addCase(updateGroupAction.rejected, (state) => {
                state.loading = false
            })
    }
})

export const { setGroups, setGroupsLoading } = groupsSlice.actions

export const selectGroups = (state: RootState) => state.groups

export default groupsSlice.reducer
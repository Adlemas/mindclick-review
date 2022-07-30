import { createSlice } from "@reduxjs/toolkit"
import { IAgoraRTCRemoteUser } from "agora-rtc-react"

interface ModifiedUser extends IAgoraRTCRemoteUser {
    pinned?: boolean
    mic?: boolean
}

interface CallState {
    inCall: boolean
    started: boolean
    users: ModifiedUser[]
}

const initialState: CallState = {
    inCall: false,
    started: false,
    users: [],
}

/**
 * Call slice
 */
export const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setStarted: (state, action) => {
            state.started = action.payload
        },
        setInCall: (state, action) => {
            state.inCall = action.payload
        }
    },
})

export const { setUsers, setInCall, setStarted } = callSlice.actions

export default callSlice.reducer
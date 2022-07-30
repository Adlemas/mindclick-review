import { Group, User } from "types"
import axios from "api/axios"

export const deleteMember = async (groupId: string, memberId: string) => {
    try {
        const { status } = await axios.delete(`/groups/${groupId}/${memberId}`, {
            data: {
                force: true
            }
        })

        return status === 200
    } catch (error) {
        throw error
    }
}

export const deleteGroup = async (groupId: string) => {
    try {
        const { status } = await axios.delete(`/groups/${groupId}`)

        return status === 200
    } catch (error) {
        throw error
    }
}

export const addMember = async (groupId: string, member: User) => {
    try {
        await axios.post(`/groups/${groupId}`, member)
    } catch (error) {
        throw error
    }
}

export const addGroup = async (group: Group) => {
    try {
        await axios.post('/groups', group)
    } catch (error) {
        throw error
    }
}
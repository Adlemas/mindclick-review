import { Group } from "types"
import axios from "api/axios"


const getGroupMeta = async (groupId: string) => {
    try {
        const { data } = await axios.get<Group>(`/groups/${groupId}`)

        return data
    } catch (error) {
        throw error
    }
}

export default getGroupMeta
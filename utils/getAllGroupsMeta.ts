import axios from "../api/axios"
import { Group, User } from "../types"


const getAllGroupsMeta = async (groupIds: string[]) => {
    const groups: Group[] = []

    try {
        for(let i = 0; i < groupIds.length; i += 1) {
            try {
                const { data: { group, members }, status } = await axios.get<{ group: Group, members: User[] }>(`/groups/${groupIds[i]}`)
    
                group.members = members
        
                groups.push(group)
            } catch (error) {
                throw error
            }
        }
    
        return groups
    } catch (error) {
        throw error
    }
}

export default getAllGroupsMeta
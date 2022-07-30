import { User } from "types"
import axios from "api/axios"

export type updateProfileBody = User

const updateUserProfile = async (id: string, body: updateProfileBody) => {
    try {
        const { data } = await axios.put(`profile/${id}`, body)
        return data
    } catch (err) {
        throw err
    }
}

export default updateUserProfile

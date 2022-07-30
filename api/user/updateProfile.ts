import { User } from "types"
import axios from "api/axios"

export type updateProfileBody = User

const updateProfile = async (body: updateProfileBody) => {
    try {
        const { data } = await axios.put('profile', body)
        return data
    } catch (err) {
        throw err
    }
}

export default updateProfile

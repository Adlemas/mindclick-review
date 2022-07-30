import { AuthBody, LoginResponse } from "types/index";
import { setItemInLocal } from "utils/localStorage";
import axios from "api/axios";


const login = async (body: AuthBody) => {
    try {
        const { data } = await axios.post<LoginResponse>("/login", body)
        if (data.token) {
            setItemInLocal("token", data.token)
        }
        if (data.refreshToken) {
            setItemInLocal("refreshToken", data.refreshToken)
        }
        return data
    } catch (error) {
        throw error
    }
}

export default login
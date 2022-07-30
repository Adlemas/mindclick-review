import { message } from "antd";
import { AxiosError } from "axios";


export interface serverError {
    message: string;
    statusCode: number;
}

const handleAxiosError = (error: AxiosError<serverError | undefined>) => {
    if(error.response?.data) {
        message.error(error.response.data.message)
    } else {
        message.error(error.message)
    }
}

export default handleAxiosError
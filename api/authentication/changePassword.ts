import axios from "../axios"

interface Props {
    newPassword: string
    oldPassword: string
}

const changePasswordAPI = async ({ newPassword, oldPassword }: Props) => {
    try {
        const { status } = await axios.patch('login', {
            newPassword, oldPassword
        })

        return status === 200
    } catch (err) {
        throw err
    }
}

export default changePasswordAPI
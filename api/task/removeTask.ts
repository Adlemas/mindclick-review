import axios from "../axios"


const removeTask = async (taskID: string) => {
    try {
        const { status } = await axios.delete(`tasks/${taskID}`)

        return status === 200
    } catch (err) {
        throw err
    }
}

export default removeTask
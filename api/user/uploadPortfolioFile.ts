import axios from "../axios"


const uploadPortfolioFileAPI = async (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
        const file = files[i]

        try {
            const formData = new FormData()

            console.log('FILENAME', file)
            formData.append('file', file)
            formData.append('name', file.name)

            await axios.post('portfolio', formData)
        } catch (err) {
            throw err
        }
    }
}

export default uploadPortfolioFileAPI
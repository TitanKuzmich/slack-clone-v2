import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://link'
})

export default instance
import axios from "axios"

const API_URL = "http://localhost:5000/api/users"

export const fetchUsers = async () => {
    const response = await axios.get(API_URL)
    return response.data.users || []   
}

export const addUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data.user   
}
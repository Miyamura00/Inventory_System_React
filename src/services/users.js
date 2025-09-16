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

export const updateUser = async ({id, updates}) => {
    const response = await axios.put(`${API_URL}/${id}`, updates)
    return response.data.user
}

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data.message    
}

export const disableUser = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/disable`)
    return response.data.user
}
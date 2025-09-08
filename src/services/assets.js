import axios from 'axios'

const API_URL = "http://localhost:5000/api/assets"

export const fetchAssets = async () => {
    const response = await axios.get(API_URL)
    return response.data.assets || []
    
}

export const addAsset = async (assetData) => {
    const response = await axios.post(API_URL, assetData)
    return response.data
    
}
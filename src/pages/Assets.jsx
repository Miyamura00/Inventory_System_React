import React, { useState } from 'react'
import axios from "axios";
import ButtonAsset from '../components/buttons/ButtonAsset'
import { useEffect } from 'react';




const Assets = () => {

    const [assets, setAssets] = useState([])
    const [formData, setFormData] = useState({
      modelName:"",
      brandName:"",
      purchaseDate:"",
      status:"In Stock",
      assignedTo:"",
      category:"",
      description:"",
      serialNumber:"",
      tag:""

    })
    const [open, setOpen] =useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({serialNumber:"", tag:""})


    useEffect(() => {
      const fetchAssets = async () => {
        try{
          const response = await axios.get("http://localhost:5000/api/assets")  
          if(response.data.success){
            setAssets(response.data.assets)
          }
        } catch (error){
          console.error("Error fetching assets:", error);
        }
      }
      fetchAssets()
    }, [])

  

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({...prev,[name]:value}))

      if(name === "serialNumber"){
        if(assets.some((asset) => asset.serialNumber === value)){
          setErrors((prev) => ({...prev, serialNumber:"Serial Number must be unique!"}))
        } else {
          setErrors((prev) => ({...prev, serialNumber:""}))
        }
    }
      if(name === "tag"){
        if(assets.some((asset) => asset.tag === value)){
          setErrors((prev) => ({...prev, tag:"Tag must be unique!"}))
        } else {
          setErrors((prev) => ({...prev, tag:""}))
        }
    }
  }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)

      try{
        const response = await axios.post("http://localhost:5000/api/assets", formData)

        if(response.data.success){
          setAssets((prev) => [ ...prev, {id: response.data.id, ...formData, status:"In Stock"}
          ])
          alert("Asset added successfully!")

          setFormData({
            modelName:"",
            brandName:"",
            purchaseDate:"",
            category:"",
            description:"",
            serialNumber:"",
            tag:"",
          })
          setOpen(false)
        }
      } catch (error){
        console.error("Error adding asset:", error)
        if(error.response?.data?.message){
          alert(error.response.data.message)
        } else {
          alert("Failed to add asset. Try again.")
        }
      } finally{
        setLoading(false)
      }

    }
    
  return (
      <div className='p-6'> 
      <ButtonAsset onClick={() => setOpen(true)}/>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}>
        <div className='w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 mb-6'
         onClick={(e) => e.stopPropagation()}
        >
        <h2 className='text-2xl font-bold mb-4 text-center'>Add Asset</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>

        <input 
          type="text"
          name="modelName"
          placeholder='Model Name'
          value={formData.modelName}
          onChange={handleChange}
          required
          className="border rounded-lg p-2 col-span-2"
          disabled={loading}
        />
        <input 
          type="text"
          name="brandName"
          placeholder='Brand Name'
          value={formData.brandName}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
          disabled={loading}
        />
        <input 
          type='date'
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
          disabled={loading}
        />

          <input
            type="text"
            name="category"
            placeholder="Category (Laptop, Monitor, etc.)"
            value={formData.category}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 col-span-2"
            disabled={loading}
          />

          <input
            type="text"
            name="serialNumber"
            placeholder="Serial Number (unique)"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            className={`border rounded-lg p-2 ${errors.serialNumber ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.serialNumber && (<p className="text-red-500 text-sm col-span-2">{errors.serialNumber}</p>
          )}

          <input
            type="text"
            name="tag"
            placeholder="Tag ID (unique)"
            value={formData.tag}
            onChange={handleChange}
            required
            className={`border rounded-lg p-2 ${errors.tag ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.tag && (<p className="text-red-500 text-sm col-span-2">{errors.tag}</p>
          )}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg p-2 col-span-2"
            disabled={loading}
          />

          <div className='flex justify-center gap-4 col-span-2 mt-4'>
             <button
            type="button"
            onClick={() => setOpen(false)}
            className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
            disabled={loading}
        >
        Cancel
        </button>
            <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading || errors.serialNumber || errors.tag}
          >
           {loading ? "Adding..." : "Add Asset"}
          </button>
          </div>
        </form>
        </div>
        </div>
        )}
        

         <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Assets List</h3>
        {assets.length === 0 ? (
          <p className="text-gray-500">No assets added yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Model</th>
                <th className="border px-4 py-2">Brand</th>
                <th className="border px-4 py-2">Serial No</th>
                <th className="border px-4 py-2">Tag</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{asset.modelName}</td>
                  <td className="border px-4 py-2">{asset.brandName}</td>
                  <td className="border px-4 py-2">{asset.serialNumber}</td>
                  <td className="border px-4 py-2">{asset.tag}</td>
                  <td className="border px-4 py-2">{asset.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      </div>
  )
}

export default Assets
import React, { useState } from 'react'
import { useAssetContext } from '../hooks/useAssetContext'

const Assets = () => {

    const {assets, setAssets} = useAssetContext()
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

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({...prev,[name]:value}))
    }
    

    const handleSubmit = (e) => {
      e.preventDefault();

      if (assets.some((asset) => asset.serialNumber === formData.serialNumber)){
        alert("Serial Number must be unique!")
        return
      }
      if (assets.some((asset) => asset.tag === formData.tag)){
        alert("Tag must be unique")
        return
      }

      setAssets((prev) => [...prev, formData])
      alert("Asset added successfully")

      setFormData({
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
    }
    
  return (
      <div className='p-6'>
        <div className='w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 mb-6'>
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
        />
        <input 
          type="text"
          name="brandName"
          placeholder='Brand Name'
          value={formData.brandName}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
        />
        <input 
          type='date'
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
        />
        <select 
          name="status"
          value={formData.status}
          onChange={handleChange}
          className='border rounded-lg p-2 col-span-2'  
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <input
              type="text"
              name="assignedTo"
              placeholder="Assigned To (Employee Name)"
              value={formData.assignedTo}
              onChange={handleChange}
              className="border rounded-lg p-2 col-span-2"
            />

          <input
            type="text"
            name="category"
            placeholder="Category (Laptop, Monitor, etc.)"
            value={formData.category}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 col-span-2"
          />

          <input
            type="text"
            name="serialNumber"
            placeholder="Serial Number (unique)"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="tag"
            placeholder="Tag ID (unique)"
            value={formData.tag}
            onChange={handleChange}
            required
            className="border rounded-lg p-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg p-2 col-span-2"
          />

            <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg col-span-2 hover:bg-blue-700 transition"
          >
            Add Asset
          </button>
        </form>
        </div>

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
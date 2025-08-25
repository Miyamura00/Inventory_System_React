import React, { useState } from 'react'

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
      alert("Asset added sucessfully")

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
    <div className="p-8"><h1 className="text-3xl font-bold">Assets</h1></div>
  )
}

export default Assets
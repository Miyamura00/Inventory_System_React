import React, { useState } from 'react'

const AddUser = () => {
const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmpassword:""
})

const handleChange = (e) => {
  const {name, value} = e.target;
  setFormData((prev) => ({...prev, [name]:value}))
}

const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmpassword){
    alert("Password do not match!")
    return
  }
  alert("Account Created Successfully")
}

  return (
    <div className="mt-6 ml-6 w-full max-w-md bg-white shadow-lg rounded-xl p-6 bg-cyan-500/50 shadow-lg shadow-cyan-500/50">
      <h2 className="font-bold">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      
        <input 
        type="text"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmpassword}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit"
        className='bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default AddUser
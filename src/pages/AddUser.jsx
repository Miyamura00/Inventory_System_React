import React, { useState } from 'react'
import axios from 'axios'
import CreateAccount from '../components/buttons/CreateAccount'
import { useEffect } from 'react'

const AddUser = () => {
const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmpassword:""
})

const [users, setUsers] = useState([])
const [open, setOpen] = useState(false)
const [emailError, setEmailError] = useState("")
const [loading, setLoading] = useState(false) 

const designations = ['Select','Super Admin', 'Admin', 'Staff']

useEffect(() => {
  const fetchUsers = async () => {
    try{
      const response = await axios.get('http://localhost:5000/api/users')
      if(response.data.success){
        setUsers(response.data.users)
      }
    } catch(error){
      console.error("Error fetching users:", error);
    }
  }
  fetchUsers()  
}, [])

const handleChange = (e) => {
  const {name, value} = e.target;
  setFormData((prev) => ({...prev, [name]:value}))

  if(name === "email"){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(value)){
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if(!emailRegex.test(formData.email)){
    alert("Please enter a valid email address!")
    setLoading(false)
    return
  }

  if (formData.password !== formData.confirmpassword){
    alert("Password do not match!")
    setLoading(false)
    return
  }

  if(formData.password.length < 6){
    alert("Password must be at least 6 characters long!")
    setLoading(false)
    return
  }

  try{
    const response = await axios.post('http://localhost:5000/api/users/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      designation: formData.designation
    })

      if (response.data.success) {
        setUsers((prev) => [...prev, response.data.user])
        alert("Account Created Successfully")
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
          designation: "Staff"
        })
        setOpen(false)
      }
    }catch(error){
      console.error("Registration Error:", error);
      if(error.response?.data?.message){
        alert(error.response.data.message);
      }else{
        alert("Failed to create account. Please try again")
      }
    }finally{
      setLoading(false)
    }
}


  return (
    <div className='p-6'>
    <CreateAccount onClick={() => setOpen(true)} />
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)}>
      <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-lg'
           onClick={(e) => e.stopPropagation()}
      >
      <h2 className="font-bold">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        disabled={loading}
        />
      
        <input 
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className= {`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400
          ${emailError ? "border-red-500 focus:ring-red-400 " : "border-gray-300 focus:ring-blue-400"}`}
        disabled={loading}
        />
        {emailError && ( <p className="text-red-500 text-sm">{emailError}</p>)}
         <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={loading}
              >
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>


        <input 
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
        />

        <input 
        type="password"
        name="confirmpassword"
        placeholder="Confirm Password"
        value={formData.confirmpassword}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
        />

        <div className='flex justify-end space-x-2'>
        <button
         type="button"
        onClick={() => setOpen(false)}
        className='rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100'
        disabled={loading}
        >
        Cancel
        </button>
        <button type="submit"
        className='rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-600'
        disabled={loading}
        >
        {loading ? 'Creating...' : 'Register'}
        </button>
        </div>
      </form>
    </div>
    </div>
    )}
    
      <div className='mt-10 bg-white shadow-lg rounded-xl p-6 bg-cyan-500/10'>
        <h3 className='text-xl font-semibold mb-4'>User Accounts</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No accounts added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left">Name</th>
                  <th className="border border-gray-200 px-4 py-3 text-left">Email</th>
                  <th className="border border-gray-200 px-4 py-3 text-left">Designation</th>
                  <th className="border border-gray-200 px-4 py-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id || i} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3">{user.name}</td>
                    <td className="border border-gray-200 px-4 py-3">{user.email}</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.designation === 'Super Admin' ? 'bg-red-100 text-red-800' :
                        user.designation === 'Admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.designation}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">{user.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div> 
  )
}

export default AddUser
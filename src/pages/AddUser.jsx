import React, { useState } from 'react'
import CreateAccount from '../components/buttons/CreateAccount'

const AddUser = () => {
const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmpassword:""
})

const [users, setUsers] = useState([])
const [open, setOpen] = useState(false)

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

  setUsers((prev) => [...prev, {name: formData.name, email: formData.email}])
  alert("Account Created Successfully")

  setFormData({
    name: "",
    email: "",
    password: "",
    confirmpassword: ""
  })
  setOpen(false)
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
        name="confirmpassword"
        placeholder="Confirm Password"
        value={formData.confirmpassword}
        onChange={handleChange}
        required
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className='flex justify-end space-x-2'>
        <button
         type="button"
        onClick={() => setOpen(false)}
        className='rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100'
        >
        Cancel
        </button>
        <button type="submit"
        className='rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-600'
        >
          Register
        </button>
        </div>
      </form>
    </div>
    </div>
    )}
    
     <div className='mt-10 bg-white shadow-lg rounded-xl p-6 bg-cyan-500/50 shadow-cyan-500/50'>
      <h3 className='text-xl font-semibold mb-4'>Accounts</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No Accounts added yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div> 
  )
}

export default AddUser
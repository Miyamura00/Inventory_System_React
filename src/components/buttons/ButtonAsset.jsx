import React from 'react'
import { IoAddCircle } from "react-icons/io5";

const CreateAccount = ({onClick}) => {
  return (
   <button
   onClick={onClick}
   className='group relative flex items-center gap-3 justify-start rounded-2xl bg-sky-500
   px-6 py-4 text-left shadow-md transition hover:bg-sky-600 focus:outline-none min-w-[200px]'>
    <IoAddCircle size={24} className='text-white group-hover:scale-110 transition-transform flex-shrink-0'/>
    <div className="text-left">
      <h3 className='text-lg font-semibold text-white'>Add Asset</h3>
      <p className='text-sm text-sky-100'>Add a new Asset Item</p>
    </div>
   </button>
  )
}

export default CreateAccount
import React from 'react'
import { useAssetContext } from '../hooks/useAssetContext'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ["#4F46E5", "#3B82F6", "#F59E0B", "#EF4444"]

const Dashboard = () => {
  const {assets} = useAssetContext()

  const statusCounts = assets.reduce(
    (acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1
    return acc
  }, {})

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }))
  
  const categoryData = assets.reduce((acc, asset) => {
    if (!acc[asset.category]){
      acc[asset.category] = {category: asset.category, inStock:0, outOfStock:0, maintenance:0}
    }
      if(asset.status === "In Stock") acc [asset.category].inStock ++
      if(asset.status === "Out of Stock") acc [asset.category].outOfStock ++
      if(asset.status === "Maintenance") acc [asset.category].maintenance ++
      return acc
  }, {})

  const categoryChartData = Object.values(categoryData)  

  return (

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
      <div className='bg-white shadow rounded-xl p-6'>
      <h3 className='text-lg font-semibold mb-4 '>Asset Status</h3>
      <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
        data={statusData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        innerRadius={60}
        label
        >
          {statusData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      </ResponsiveContainer>
      </div>
      <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-4'>Assets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="inStock" fill="#3B82F6" name="In Stock" />
            <Bar dataKey="outOfStock" fill="#EF4444" name="Out of Stock" />
            <Bar dataKey="maintenance" fill="#F59E0B" name="Maintenance" />
          </BarChart>
          </ResponsiveContainer>
      </div>
      </div>
    
  )
}

export default Dashboard
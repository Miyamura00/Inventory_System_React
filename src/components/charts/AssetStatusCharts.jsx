import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useAssetContext } from "../../hooks/useAssetContext";


const COLORS ={
     "In Stock": "#4F46E5",    
  "Available": "#3B82F6",   
  "Maintenance": "#F59E0B", 
  "Out of Stock": "#EF4444" 
}

const AssetStatusCharts = () => {
    const {assets} = useAssetContext()

    const statusCounts = assets.reduce((acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1
        return acc
    }, {})

    const data = Object.keys(statusCounts).map((status) => ({
        name: status,
        value: statusCounts[status]
    }))

    return(
        <div className="bg-white p-6 shadow-lg rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Asset Status</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx={150}
          cy={120}
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
    )
}

    export default AssetStatusCharts;
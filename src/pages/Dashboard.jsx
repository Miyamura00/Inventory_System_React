import AssetCategoryCharts from "../components/charts/AssetCategoryCharts"
import AssetStatusCharts from "../components/charts/AssetStatusCharts"

const Dashboard = () => {
  return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <AssetStatusCharts />
      <AssetCategoryCharts />
    </div>
  )
}

export default Dashboard
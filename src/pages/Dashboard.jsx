import AssetStatusCharts from "../components/charts/AssetStatusCharts";
import AssetCategoryCharts from "../components/charts/AssetCategoryCharts";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <AssetStatusCharts />
      <AssetCategoryCharts />
    </div>
  );
};

export default Dashboard;
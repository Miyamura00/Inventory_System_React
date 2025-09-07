import { useEffect, useState } from "react";
import axios from "axios"
import AssetStatusCharts from "../components/charts/AssetStatusCharts";
import AssetCategoryCharts from "../components/charts/AssetCategoryCharts";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);

 useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/assets");
        if (response.data.success) {
          setAssets(response.data.assets);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <AssetStatusCharts assets={assets} />
      <AssetCategoryCharts assets={assets} />
    </div>
  );
};

export default Dashboard;
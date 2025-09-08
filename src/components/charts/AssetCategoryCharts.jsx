import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "../../services/assets";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AssetCategoryCharts = () => {
  const { data: assets = [], isLoading, isError } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  if (isLoading) return <p>Loading category chart...</p>;
  if (isError) return <p>Error loading category chart</p>;

  const categoryCounts = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = { category: asset.category, inUse: 0, available: 0 };
    }
    if (asset.status === "In Stock") {
      acc[asset.category].available += 1;
    } else {
      acc[asset.category].inUse += 1;
    }
    return acc;
  }, {});

  const data = Object.values(categoryCounts);

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Assets by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap={40}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inUse" fill="#4F46E5" name="In Use" barSize={20} />
          <Bar dataKey="available" fill="#93C5FD" name="Available" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetCategoryCharts;
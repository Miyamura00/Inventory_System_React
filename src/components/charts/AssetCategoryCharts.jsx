import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AssetCategoryCharts = ({ assets }) => {
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
      <h3 className="text-lg font-semibold mb-4">Asset by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap={40}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="available" stackId="a" fill="#93C5FD" name="Available" barSize={60} />
          <Bar dataKey="inUse" stackId="a" fill="#4F46E5" name="In Use" barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetCategoryCharts;
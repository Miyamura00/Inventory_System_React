import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  "In Stock": "#4F46E5",     // blue
  "Available": "#3B82F6",    // lighter blue
  "Maintenance": "#F59E0B",  // yellow
  "Out of Stock": "#EF4444"  // red
};

const AssetStatusCharts = ({ assets }) => {
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status]
  }));

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Asset Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
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
      </ResponsiveContainer>
    </div>
  );
};

export default AssetStatusCharts;
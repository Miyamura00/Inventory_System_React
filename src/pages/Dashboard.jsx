import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // frontend firebase.js
import AssetStatusCharts from "../components/charts/AssetStatusCharts";
import AssetCategoryCharts from "../components/charts/AssetCategoryCharts";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(collection(db, "assets"), (snapshot) => {
      const assetData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssets(assetData);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <AssetStatusCharts assets={assets} />
      <AssetCategoryCharts assets={assets} />
    </div>
  );
};

export default Dashboard;
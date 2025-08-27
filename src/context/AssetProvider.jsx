import { useState } from "react";
import { AssetContext } from "./AssetContext";

export const AssetProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);

    return (
        <AssetContext.Provider value={{ assets, setAssets }}>
            {children}
        </AssetContext.Provider>
    )
}
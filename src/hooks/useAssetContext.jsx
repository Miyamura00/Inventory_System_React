import { useContext } from "react";
import { AssetContext } from "../context/AssetContext";

export const useAssetContext = () => {
    const context = useContext(AssetContext)
    if(!context){
        throw new Error("useAssetContext must be used within an AssetProvider")
    }
    return context
}
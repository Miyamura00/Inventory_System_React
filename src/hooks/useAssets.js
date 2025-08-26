import { useContext } from "react";
import { AssetContext } from "../context/AssetContext";


export const useAssets = () => {
  return useContext(AssetContext);
};
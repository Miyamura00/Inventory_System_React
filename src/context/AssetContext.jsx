import { createContext, useState } from "react";



export const AssetProvider = ({children}) => {

    const [assets, setAssets] = useState([])
    
    return(
        <AssetContext.Provider value={{assets, setAssets}}>
            {children}
        </AssetContext.Provider>

    )
}

export const AssetContext = createContext();
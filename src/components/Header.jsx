import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/assets": "Assets",
    "/reports": "Reports",
    "/add-user": "Add User",
    "/settings": "Settings",
  };


  const title = pageTitles[location.pathname] || "Page";

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">

      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
    
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        <button className="relative">
          <FaBell className="text-gray-700 text-xl" />
      
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <FaUserCircle className="text-gray-700 text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
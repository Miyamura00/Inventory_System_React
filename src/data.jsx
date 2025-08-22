import { path } from "framer-motion/client";
import { FaHome} from "react-icons/fa";
import { FaHardDrive } from "react-icons/fa6";
import { IoPersonAdd,IoSettingsSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";


export const menuItems = [
    {icon: <FaHome />, text: "Dashboard", path: "/" },
    {icon: <FaHardDrive />, text: "Assets",path: "/assets"},
     {icon: <TbReportSearch />, text: "Reports", path: "/reports"},
    {icon: <IoPersonAdd />, text: "Users", path: "/add-user"},
    {icon: <IoSettingsSharp />, text: "Settings", path: "/settings"},
];
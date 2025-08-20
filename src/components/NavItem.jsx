

const NavItem = ({icon, text, isOpen, setIsOpen}) => {
  return (
 <div className="flex items-center gap-4
 cursor-pointer w-full hover:text-lightblue"> 
    <span data-tooltip-id={!isOpen ? "sidebar-tooltip" : undefined} 
    data-tooltip-content={!isOpen ? text: undefined}
    className="text-xl">{icon}
    </span>
    {isOpen && <div>{text}</div>}
  </div>

  );
  
};

export default NavItem

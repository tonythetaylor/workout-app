import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaAlignJustify, FaAngleLeft } from 'react-icons/fa';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isSidebarOpen: boolean; // Add this prop
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse, onLogout }) => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUser /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 mt-4">
        {!isCollapsed && <h2 className="text-xl font-bold">Menu</h2>}
        <button
          onClick={toggleCollapse}
          className="text-gray-400 hover:text-white"
        >
          {isCollapsed ? <FaAlignJustify size={20} /> : <FaAngleLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul>
          {links.map((link) => (
            <li key={link.name} className="relative">
              <NavLink
                to={link.path}
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 transition ${
                    isActive ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
                  }`
                }
              >
                <div className="text-lg">{link.icon}</div>
                <div
                  className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {link.name}
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-0 w-full px-4">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
        >
          <FaSignOutAlt className="text-lg" />
          <div
            className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
            }`}
          >
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

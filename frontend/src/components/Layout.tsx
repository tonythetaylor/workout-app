import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleResize = () => {
    // Automatically collapse sidebar on smaller screens
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  };

  useEffect(() => {
    // Attach resize listener
    window.addEventListener('resize', handleResize);

    // Trigger initial resize logic
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar
      isCollapsed={isCollapsed}
      toggleCollapse={() => setIsCollapsed((prev) => !prev)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      onLogout={logout} // Pass the logout function

    />
       {/* Main Content */}
       <main
        className={`flex-1 bg-gray-100 dark:bg-gray-900 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
            <Outlet />
        </main>
        </div>
  );
};

export default Layout;

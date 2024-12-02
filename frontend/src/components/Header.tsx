import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-3 w-full">
  <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
    ☰
  </button>
  <h1 className="text-xl font-bold">Dashboard</h1>
</header>

  );
};

export default Header;

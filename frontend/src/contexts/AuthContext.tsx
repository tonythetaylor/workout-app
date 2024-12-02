import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirect to login page
  };


  return (
    <AuthContext.Provider value={{ user, token, setUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

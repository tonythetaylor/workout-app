import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ensure the correct path
import { refreshAccessToken } from '../services/api';

interface AuthHandlerProps {
  children: ReactNode;
}

const AuthHandler: React.FC<AuthHandlerProps> = ({ children }) => {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !token) {
      // Attempt to refresh the token
      refreshAccessToken()
        .then((newToken) => {
          console.log('Token refreshed:', newToken);
        })
        .catch((err) => {
          console.error('Failed to refresh token:', err);
          navigate('/login', { replace: true });
        });
    }
  }, [isLoading, token, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return <>{children}</>;
};

export default AuthHandler;

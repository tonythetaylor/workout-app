// src/contexts/AppProviders.tsx
import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>{children}</AuthProvider>
  </ThemeProvider>
);

export default AppProviders;

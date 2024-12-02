import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthHandler from './contexts/AuthHandler';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <AuthHandler>
                  <Layout />
                </AuthHandler>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

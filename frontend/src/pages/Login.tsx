import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth(); // Get login function from AuthContext
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user, refreshToken } = await loginUser(formData);
      login(user, token, refreshToken); // Update AuthContext with user and token
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <form
        className="bg-white dark:bg-gray-800 p-8 shadow-md rounded-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition"
        >
          Login
        </button>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

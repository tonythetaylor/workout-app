// src/services/api.ts
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost/api',
    headers: { 'Content-Type': 'application/json' },
});

export const registerUser = (data: { email: string; password: string; name?: string }) =>
    API.post('/users/register', data);

export const loginUser = async (formData: { email: string; password: string }) => {
    const response = await API.post('/users/login', formData);
    const { user, accessToken: token, refreshToken } = response.data; // Destructure refreshToken

    // Save token to localStorage
    localStorage.setItem('token', token);

    // Optionally, save user data to localStorage
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user, refreshToken };
};

// Get user metrics
export const getUserMetrics = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) throw new Error('No token found'); // Ensure the token exists

    return API.get('/metrics', {
        headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
        },
    });
};

export const addMetric = async (metricData: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error('No token found'); // Ensure the token exists

    return API.post("/metrics", metricData, {
        headers: {
            Authorization: `Bearer ${token}`, // Include token
        },
    });
};

export const updateMetric = (id: number, data: any) => API.put(`/metrics/${id}`, data);
export const deleteMetric = (id: number) => API.delete(`/metrics/${id}`);

export const updateUserProfile = (data: any) => API.put('/users/profile', data);

export const updateUser = async (updateData: any) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
        console.error('Token not found');
        return;
    }

    try {
        const response = await API.put(
            '/settings/update-info',
            updateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Update successful:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating info:', error.response || error);
        throw error;
    }
};

export const deleteUser = async () => {
    return await API.delete('/settings/delete-account');
};

export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token from localStorage
    if (!refreshToken) throw new Error('No refresh token found');

    const { data } = await API.post('/users/refresh-token', { refreshToken });

    // Update the access token and refresh token in localStorage
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
        localStorage.setItem('token', data.accessToken);
        return data.accessToken
    } else {
        throw new Error('Failed to refresh token');
    }

    return data.token; // Return the new access token
};


// Add an interceptor to handle token expiration and refresh logic
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh the token
                const { data } = await API.post('/refresh-token', {
                    refreshToken: localStorage.getItem('refreshToken'), // Retrieve refresh token
                });

                // Save the new access token
                localStorage.setItem('token', data.accessToken);

                // Update the Authorization header and retry the original request
                API.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                return API(originalRequest);
            } catch (refreshError) {
                // Logout if refresh fails
                console.error('Refresh token expired or invalid');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


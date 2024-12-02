import axios from 'axios';


const API = axios.create({
    baseURL: 'http://localhost/api',
});

export const getSettings = async () => {
  const token = localStorage.getItem('token'); // Retrieve the token from local storage
  if (!token) throw new Error('No token found'); // Ensure token exists
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await API.get('/settings/get-info', { headers });
  return response.data;
};

export const updateSettings = async (updateData: any) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) throw new Error('No token found'); // Ensure token exists

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
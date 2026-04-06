import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

const STORAGE_KEY = 'task_mgmt_auth';

const setToken = (token) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

client.interceptors.request.use((config) => {
  if (!config.headers?.Authorization) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  return config;
});

const getErrorMessage = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((item) => item.msg).join(', ');
  }

  return (
    error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
  );
};

const api = {
  setToken,

  registerEmployee: async (payload) => {
    const response = await client.post('/auth/register', payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await client.post('/auth/login', payload);
    return response.data;
  },

  getEmployees: async () => {
    const response = await client.get('/admin/employees');
    return response.data;
  },

  updateEmployeeStatus: async (employeeId, status) => {
    const response = await client.patch(`/admin/employees/${employeeId}/status`, { status });
    return response.data;
  },

  assignTask: async (payload) => {
    const response = await client.post('/admin/tasks', payload);
    return response.data;
  },

  getAdminTasks: async () => {
    const response = await client.get('/admin/tasks');
    return response.data;
  },

  getMyTasks: async () => {
    const response = await client.get('/employee/tasks');
    return response.data;
  },

  updateMyTaskStatus: async (taskId, status) => {
    const response = await client.patch(`/employee/tasks/${taskId}/status`, { status });
    return response.data;
  },

  getErrorMessage
};

export default api;

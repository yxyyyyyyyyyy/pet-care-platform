'use client';

import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'https://yxyyy.pythonanywhere.com/api';

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  email: string | null;
  created_at: string;
}

export interface Pet {
  id: number;
  user_id: number;
  name: string;
  species: string;
  breed: string | null;
  age: number;
  weight: number;
  gender: string;
  color: string | null;
  birthday: string | null;
  avatar: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareRecord {
  id: number;
  pet_id: number;
  record_type: string;
  description: string | null;
  date: string;
  veterinarian: string | null;
  cost: number | null;
  created_at: string;
  updated_at: string;
}

export interface CareAdvice {
  pet: Pet;
  age_stage: string;
  weight_advice: string;
  feeding: string;
  exercise: string;
  health: string;
  grooming: string;
}

export interface PetFormData {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  color: string;
  birthday: string;
  notes: string;
}

export interface CareRecordFormData {
  pet_id: string;
  record_type: string;
  description: string;
  date: string;
  veterinarian: string;
  cost: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
  
  getMe: () => api.get('/auth/me'),
};

export const petsApi = {
  getAll: () => api.get('/pets'),
  
  getById: (id: number) => api.get(`/pets/${id}`),
  
  create: (data: PetFormData) =>
    api.post('/pets', {
      ...data,
      age: parseFloat(data.age),
      weight: parseFloat(data.weight),
    }),
  
  update: (id: number, data: PetFormData) =>
    api.put(`/pets/${id}`, {
      ...data,
      age: parseFloat(data.age),
      weight: parseFloat(data.weight),
    }),
  
  delete: (id: number) => api.delete(`/pets/${id}`),
};

export const careApi = {
  getRecords: (petId?: number) =>
    api.get('/care/records', { params: petId ? { pet_id: petId } : {} }),
  
  getRecordById: (id: number) => api.get(`/care/records/${id}`),
  
  createRecord: (data: {
    pet_id: number;
    record_type: string;
    description?: string;
    date: string;
    veterinarian?: string;
    cost?: number | null;
  }) => api.post('/care/records', data),
  
  updateRecord: (id: number, data: Partial<CareRecord>) =>
    api.put(`/care/records/${id}`, data),
  
  deleteRecord: (id: number) => api.delete(`/care/records/${id}`),
  
  getAdvice: (petId: number) => api.get(`/care/advice/${petId}`),
};

export default api;

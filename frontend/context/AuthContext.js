'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      toast.success('Login sukses');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    }
  };

  const register = async (username, fullName, password) => {
    try {
      await axios.post('/auth/register', { username, fullName, password });
      toast.success('Pendaftaran berhasil, silakan login');
      router.push('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal daftar');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

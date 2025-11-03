import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import API_BASE from '../config';

export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('@media_token');
        if (t) {
          setToken(t);
          try {
            const decoded = jwtDecode(t);
            setUser({ id: decoded.sub, username: decoded.username || decoded.sub });
          } catch(e) {
            setUser(null);
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar token', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveToken = async (t) => {
    setToken(t);
    await AsyncStorage.setItem('@media_token', t);
    try {
      const decoded = jwtDecode(t);
      console.log('[AUTH] Token decodificado:', decoded);
      setUser({ id: decoded.sub, username: decoded.username || decoded.sub });
    } catch(e) {
      console.error('[AUTH] Erro ao decodificar token:', e);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    console.log('Tentando login em:', `${API_BASE}/auth/login`);
    // usa OAuth2PasswordRequestForm no backend (username,password)
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);

    const res = await axios.post(`${API_BASE}/auth/login`, form.toString(), {
      timeout: 10000, // 10 segundos
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Login bem-sucedido');
    await saveToken(res.data.access_token);
    return res;
  };

  const register = async (email, username, password) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { email, username, password });
    // não faz auto-login automaticamente (por segurança), mas podes:
    if (res.status === 200 || res.status === 201) {
      // opcional: chamar login automaticamente
      await login(email, password);
    }
    return res;
  };

  const guest = async () => {
    console.log('Tentando conectar em:', `${API_BASE}/auth/guest`);
    const res = await axios.post(`${API_BASE}/auth/guest`, {}, {
      timeout: 10000, // 10 segundos
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Resposta recebida:', res.data);
    await saveToken(res.data.access_token);
    return res;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('@media_token');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, guest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

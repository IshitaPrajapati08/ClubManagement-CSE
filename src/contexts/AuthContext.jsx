import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    // restore session if token exists
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // login against backend
  const login = async (email, password, role) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        const userData = { ...data.user };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err) {
      // fallback to local storage auth (offline/dev)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(
        u => u.email === email && u.password === password && u.role === role
      );
      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
        localStorage.setItem('token', `token-${Date.now()}`);
        return { success: true };
      }
      return { success: false, error: 'Unable to contact server and no offline match' };
    }
  };

  // signup via backend
  const signup = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        const u = data.user;
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        localStorage.setItem('role', u.role);
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Could not create account' };
    } catch (err) {
      // fallback to local signup (offline/dev)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already exists' };
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('role', userWithoutPassword.role);
      localStorage.setItem('token', `token-${Date.now()}`);

      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

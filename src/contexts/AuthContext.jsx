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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      // store user and minimal auth token for compatibility with other guards
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role);
      localStorage.setItem('token', `token-${Date.now()}`);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (userData) => {
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
    // persist for session and interoperability with other route guards
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('role', userWithoutPassword.role);
    localStorage.setItem('token', `token-${Date.now()}`);

    return { success: true };
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

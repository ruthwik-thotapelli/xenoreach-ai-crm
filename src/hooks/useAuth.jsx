import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('xeno_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    // Mock auth — accept any credentials
    await new Promise(r => setTimeout(r, 800));
    const mockUser = {
      id: 'user_1',
      name: 'Priya Sharma',
      email,
      role: 'Marketing Manager',
      brand: 'Lumière Fashion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    };
    setUser(mockUser);
    localStorage.setItem('xeno_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 800));
    const mockUser = {
      id: 'user_new',
      name,
      email,
      role: 'Marketing Manager',
      brand: 'My Brand',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };
    setUser(mockUser);
    localStorage.setItem('xeno_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xeno_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

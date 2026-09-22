import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  tenant: any;
  role: 'admin' | 'tenant' | null;
  login: (data: any, type: 'admin' | 'tenant') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'tenant' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const tenantToken = localStorage.getItem('tenant_token');
    const storedUser = localStorage.getItem('user');
    const storedTenant = localStorage.getItem('tenant');

    if (adminToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setRole('admin');
    } else if (tenantToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setTenant(storedTenant ? JSON.parse(storedTenant) : null);
      setRole('tenant');
    }
    setLoading(false);
  }, []);

  const login = (data: any, type: 'admin' | 'tenant') => {
    const tokenKey = type === 'admin' ? 'admin_token' : 'tenant_token';
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.tenant) localStorage.setItem('tenant', JSON.stringify(data.tenant));
    
    setUser(data.user);
    setTenant(data.tenant || null);
    setRole(type);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setTenant(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

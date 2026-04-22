import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { electorateService } from '../services/electorateService';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [electorateId, setElectorateId] = useState(
    () => localStorage.getItem('electorateId') ?? null
  );
  const navigate = useNavigate();

  async function login(id) {
    console.log(id);
    await electorateService.loginElectorate(id);
    localStorage.setItem('electorateId', id);
    setElectorateId(id);
    navigate('/admin');
  }

  function logout() {
    localStorage.removeItem('electorateId');
    setElectorateId(null);
    navigate('/admin/login');
  }

  return (
    <AdminContext.Provider value={{ electorateId, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

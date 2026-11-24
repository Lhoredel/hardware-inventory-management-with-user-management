import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }
  return <div className="app-shell">
    <Header username={user} onMenu={() => setMenuOpen(v => !v)}/>
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={handleLogout}/>
    <main className="main-content"><Outlet/></main>
  </div>;
}

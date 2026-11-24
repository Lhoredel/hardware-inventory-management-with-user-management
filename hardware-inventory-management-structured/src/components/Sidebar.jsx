import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ArrowDownUp, FileText, LogOut, X, Settings, Sparkles, Users } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/stock', label: 'Stock In/Out', icon: ArrowDownUp },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/users', label: 'Users', icon: Users, adminOnly: true },
  { to: '/settings', label: 'Settings', icon: Settings }
];
export default function Sidebar({ open, onClose, onLogout }) {
  const { isAdmin } = useAuth();
  const visibleLinks = links.filter(link => !link.adminOnly || isAdmin);
  return <>
    <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose}/>
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-emblem"><span className="emblem-icon"><Sparkles size={19}/></span><div><strong>OBSIDIAN</strong><small>HARDWARE ARCHIVE</small></div></div>
      <div className="sidebar-mobile-title"><span>MENU</span><button onClick={onClose}><X size={18}/></button></div>
      <nav>{visibleLinks.map(({to,label,icon:Icon,end}) =>
        <NavLink key={to} to={to} end={end} onClick={onClose} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Icon size={17}/>{label}
        </NavLink>
      )}</nav>
      <div className="sidebar-caption">SYSTEM</div><button className="nav-link logout-link" onClick={onLogout}><LogOut size={17}/>Logout</button>
    </aside>
  </>;
}

import { Box, Menu, UserCircle, Bell } from 'lucide-react';
export default function Header({ username, onMenu }) {
  return <header className="topbar">
    <button className="mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={22}/></button>
    <div className="topbar-kicker"><span className="topbar-mark"><Box size={19}/></span><span>INVENTORY CONTROL <i> / </i> OVERVIEW</span></div>
    <div className="top-user"><button className="header-icon" aria-label="Notifications"><Bell size={17}/><b/></button><span className="user-name">{username || 'Administrator'}</span><span className="user-avatar"><UserCircle size={21}/></span></div>
  </header>;
}

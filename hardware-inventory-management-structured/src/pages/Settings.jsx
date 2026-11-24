import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Settings(){
  const {user, currentUser, isAdmin}=useAuth();
  return <section className="content-card">
    <div className="section-heading"><div><p className="eyebrow">PREFERENCES & ACCESS</p><h1>System <em>Settings</em></h1><p className="muted">Application information and signed-in account details.</p></div></div>
    <div className="settings-panel"><h2>Signed-in Account</h2><p><strong>Name:</strong> {currentUser?.fullName || user}</p><p><strong>Username:</strong> {user}</p><p><strong>Email:</strong> {currentUser?.email || '—'}</p><p><strong>Access level:</strong> {currentUser?.role || 'User'}</p></div>
    {isAdmin && <div className="settings-panel"><h2>User Accounts</h2><p>Create staff and administrator accounts, change roles, or deactivate accounts.</p><Link className="primary-button" to="/users">Open User Management</Link></div>}
    <div className="settings-panel"><h2>System Information</h2><p>Hardware Inventory Management System</p><p>Frontend: React + Vite + CSS</p><p>Storage: Browser localStorage</p></div>
    <p className="warning-note">Demo mode only: account records and passwords are stored in this browser. This is not secure for real deployment. A backend with hashed passwords and server-side role permissions is required before public use.</p>
  </section>;
}

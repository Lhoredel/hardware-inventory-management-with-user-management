import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'him_users';
const CURRENT_USER_KEY = 'him_user';

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Restore the demo administrator if browser storage is invalid.
  }
  const initial = [{
    id: 1,
    fullName: 'System Administrator',
    username: 'admin',
    email: 'admin@hardware.local',
    password: 'admin123',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date().toISOString().slice(0, 10)
  }];
  localStorage.setItem(USERS_KEY, JSON.stringify(initial));
  return initial;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [user, setUser] = useState(() => localStorage.getItem(CURRENT_USER_KEY) || '');

  function login(username, password) {
    const account = users.find(item =>
      item.username.toLowerCase() === username.trim().toLowerCase() &&
      item.password === password &&
      item.status === 'Active'
    );
    if (!account) return false;
    localStorage.setItem(CURRENT_USER_KEY, account.username);
    setUser(account.username);
    return true;
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser('');
  }

  function addUser(data) {
    const duplicate = users.some(item =>
      item.username.toLowerCase() === data.username.trim().toLowerCase() ||
      item.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (duplicate) throw new Error('Username or email already exists.');
    const next = [{
      ...data,
      id: Date.now(),
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    }, ...users];
    saveUsers(next);
    setUsers(next);
  }

  function updateUser(id, data) {
    const duplicate = users.some(item => item.id !== id && (
      item.username.toLowerCase() === data.username.trim().toLowerCase() ||
      item.email.toLowerCase() === data.email.trim().toLowerCase()
    ));
    if (duplicate) throw new Error('Username or email already exists.');
    const next = users.map(item => item.id === id ? {
      ...item, ...data,
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password ? data.password : item.password
    } : item);
    saveUsers(next);
    setUsers(next);
    const current = next.find(item => item.username === user);
    if (current && current.username !== user) {
      localStorage.setItem(CURRENT_USER_KEY, current.username);
      setUser(current.username);
    }
  }

  function deleteUser(id) {
    const target = users.find(item => item.id === id);
    if (!target) return;
    if (target.username === user) throw new Error('You cannot delete the account currently signed in.');
    if (target.role === 'Admin' && target.status === 'Active' &&
        users.filter(item => item.role === 'Admin' && item.status === 'Active').length <= 1) {
      throw new Error('At least one active administrator must remain.');
    }
    const next = users.filter(item => item.id !== id);
    saveUsers(next);
    setUsers(next);
  }

  function toggleUserStatus(id) {
    const target = users.find(item => item.id === id);
    if (!target) return;
    if (target.username === user && target.status === 'Active') {
      throw new Error('You cannot deactivate the account currently signed in.');
    }
    if (target.role === 'Admin' && target.status === 'Active' &&
        users.filter(item => item.role === 'Admin' && item.status === 'Active').length <= 1) {
      throw new Error('At least one active administrator must remain.');
    }
    const next = users.map(item => item.id === id
      ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
      : item);
    saveUsers(next);
    setUsers(next);
  }

  const currentUser = users.find(item => item.username === user);
  const value = useMemo(() => ({
    user, currentUser, users, isAuthenticated: Boolean(user), isAdmin: currentUser?.role === 'Admin',
    login, logout, addUser, updateUser, deleteUser, toggleUserStatus
  }), [user, users, currentUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

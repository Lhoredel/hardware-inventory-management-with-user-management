import { useMemo, useState } from 'react';
import { UserPlus, Search, Pencil, Trash2, ShieldCheck, UserRound, Power, Users as UsersIcon } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

const blankForm = { fullName: '', username: '', email: '', password: '', role: 'Staff', status: 'Active' };

export default function Users() {
  const { users, user: signedInUser, addUser, updateUser, deleteUser, toggleUserStatus } = useAuth();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState('');
  const pageSize = 7;

  const filtered = useMemo(() => users.filter(item => {
    const searchMatch = `${item.fullName} ${item.username} ${item.email}`.toLowerCase().includes(query.toLowerCase());
    return searchMatch &&
      (roleFilter === 'All roles' || item.role === roleFilter) &&
      (statusFilter === 'All statuses' || item.status === statusFilter);
  }), [users, query, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = users.filter(item => item.status === 'Active').length;
  const adminCount = users.filter(item => item.role === 'Admin').length;

  function openAdd() {
    setEditing(null);
    setForm(blankForm);
    setError('');
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setForm({ ...item, password: '' });
    setError('');
    setModalOpen(true);
  }
  function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim()) {
      setError('Please complete the name, username, and email fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!editing && form.password.length < 6) {
      setError('New user passwords must contain at least 6 characters.');
      return;
    }
    if (editing && form.password && form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    try {
      if (editing) updateUser(editing.id, form);
      else addUser(form);
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Unable to save this user.');
    }
  }
  function remove(item) {
    try {
      deleteUser(item.id);
      setConfirm(null);
    } catch (err) {
      setConfirm({ message: err.message, informational: true });
    }
  }
  function changeStatus(item) {
    try {
      toggleUserStatus(item.id);
    } catch (err) {
      setConfirm({ message: err.message, informational: true });
    }
  }

  return <section className="content-card">
    <div className="section-heading">
      <div><p className="eyebrow">ACCESS & PERMISSIONS</p><h1>User <em>Management</em></h1><p className="muted">Create accounts and manage who can access the inventory archive.</p></div>
      <button className="primary-button" onClick={openAdd}><UserPlus size={15}/> Add New User</button>
    </div>

    <div className="stats-grid user-stats">
      <div className="stat-card stat-blue"><span>Total Users</span><strong>{users.length}</strong><small>Registered accounts</small></div>
      <div className="stat-card stat-green"><span>Active Users</span><strong>{activeCount}</strong><small>Can sign in to the system</small></div>
      <div className="stat-card stat-orange"><span>Administrators</span><strong>{adminCount}</strong><small>Accounts with full access</small></div>
    </div>

    <div className="table-heading"><div><p className="eyebrow">ACCOUNT DIRECTORY</p><h2>All Users</h2></div><span className="date-chip"><UsersIcon size={14}/>{filtered.length} account(s)</span></div>
    <div className="toolbar users-toolbar">
      <div className="search-box"><Search size={16}/><input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Search name, username, or email..."/></div>
      <div className="select-wrap"><select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}><option>All roles</option><option>Admin</option><option>Staff</option></select></div>
      <div className="select-wrap"><select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}><option>All statuses</option><option>Active</option><option>Inactive</option></select></div>
    </div>
    <div className="table-wrap"><table>
      <thead><tr><th>USER</th><th>USERNAME</th><th>EMAIL</th><th>ROLE</th><th>STATUS</th><th>JOINED</th><th>ACTIONS</th></tr></thead>
      <tbody>
        {visible.map(item => <tr key={item.id}>
          <td><div className="user-cell"><span className="user-cell-avatar">{item.role === 'Admin' ? <ShieldCheck size={16}/> : <UserRound size={16}/>}</span><strong>{item.fullName}</strong></div></td>
          <td>@{item.username}{item.username === signedInUser && <span className="you-tag">YOU</span>}</td>
          <td>{item.email}</td>
          <td><span className={`role-pill ${item.role === 'Admin' ? 'role-admin' : 'role-staff'}`}>{item.role}</span></td>
          <td><span className={`status ${item.status === 'Active' ? 'status-good' : 'status-low'}`}>{item.status}</span></td>
          <td>{item.createdAt || '—'}</td>
          <td><div className="action-buttons">
            <button className="icon-button edit" title="Edit user" onClick={() => openEdit(item)}><Pencil size={15}/></button>
            <button className="icon-button" title={item.status === 'Active' ? 'Deactivate user' : 'Activate user'} onClick={() => changeStatus(item)}><Power size={15}/></button>
            <button className="icon-button delete" title="Delete user" onClick={() => setConfirm({ item, message: `Delete the account for ${item.fullName}? This cannot be undone.` })}><Trash2 size={15}/></button>
          </div></td>
        </tr>)}
        {visible.length === 0 && <tr><td colSpan="7" className="empty-cell">No user accounts match your search.</td></tr>}
      </tbody>
    </table></div>
    <Pagination page={page} pageCount={pageCount} onPageChange={setPage}/>
    <p className="table-footnote">Demo mode: accounts are saved in this browser only. Add a secure backend before deploying for real users.</p>

    {modalOpen && <Modal title={editing ? 'Edit User Account' : 'Create New User'} onClose={() => setModalOpen(false)}>
      <form className="modal-form" onSubmit={submit}>
        <label>Full Name<input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Enter full name" autoFocus/></label>
        <div className="form-row">
          <label>Username<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="e.g. j.santos"/></label>
          <label>Email Address<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com"/></label>
        </div>
        <label>{editing ? 'New Password (leave blank to keep current)' : 'Temporary Password'}
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editing ? 'Leave blank to keep current password' : 'At least 6 characters'} autoComplete="new-password"/>
        </label>
        <div className="form-row">
          <label>Role<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="Staff">Staff</option><option value="Admin">Admin</option></select></label>
          <label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" type="submit">{editing ? 'Save Changes' : 'Create Account'}</button></div>
      </form>
    </Modal>}

    {confirm && <ConfirmDialog
      title={confirm.informational ? 'Account Notice' : 'Delete User'}
      message={confirm.message}
      onCancel={() => setConfirm(null)}
      onConfirm={confirm.informational ? () => setConfirm(null) : () => remove(confirm.item)}
    />}
  </section>;
}

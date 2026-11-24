import { useState } from 'react';
import { Box, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [username,setUsername] = useState('admin');
  const [password,setPassword] = useState('admin123');
  const [show,setShow] = useState(false);
  const [error,setError] = useState('');
  const [forgot,setForgot] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    if (login(username,password)) navigate('/');
    else setError('Incorrect username or password. Please try again.');
  }
  return <main className="login-screen">
    <section className="login-brand">
      <div className="login-orbit orbit-one"/><div className="login-orbit orbit-two"/>
      <div className="login-brand-content">
        <span className="login-brand-mark"><Box size={54}/></span>
        <p className="eyebrow">THE RESOURCE KEEPERS</p>
        <div className="brand-large"><div><strong>HARDWARE</strong><strong>INVENTORY</strong><strong>ARCHIVE</strong></div></div>
        <p className="brand-description">Every tool has its place.<br/>Every detail, accounted for.</p>
        <span className="brand-rule"/>
        <small>INVENTORY MANAGEMENT SYSTEM · EST. 2026</small>
      </div>
    </section>
    <section className="login-side"><form className="login-card" onSubmit={submit}>
      <p className="eyebrow">MEMBER ACCESS</p><h1>{forgot ? 'Password Help' : 'Welcome Back'}</h1>
      <p className="muted">{forgot ? 'Contact your system administrator to reset your password.' : 'Login to your account'}</p>
      {!forgot && <>
        <label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)} required/>
        <label>Password</label><div className="password-wrap"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="eye-button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>
        {error && <p className="error-text">{error}</p>}
        <button className="primary-button login-button">Enter the Archive <span>↗</span></button>
        <button type="button" className="text-button forgot" onClick={()=>{setForgot(true);setError('');}}>Forgot password?</button>
      </>}
      {forgot && <button type="button" className="primary-button login-button" onClick={()=>setForgot(false)}>Back to Login</button>}
      <p className="login-hint"><LockKeyhole size={13}/> Demo login: admin / admin123</p>
    </form></section>
  </main>;
}

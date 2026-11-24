import { CheckCircle2, AlertCircle } from 'lucide-react';
export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  const Icon = type === 'error' ? AlertCircle : CheckCircle2;
  return <div className={`toast toast-${type}`}><Icon size={17}/>{message}</div>;
}

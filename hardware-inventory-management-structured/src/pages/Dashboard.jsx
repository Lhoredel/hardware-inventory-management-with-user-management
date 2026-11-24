import { useMemo } from 'react';
import { CalendarDays, Plus, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { formatMoney } from '../services/api';
export default function Dashboard({ products, onAdd }) {
  const navigate = useNavigate();
  const lowStock = products.filter(p => Number(p.quantity) <= Number(p.minStock));
  const value = useMemo(() => products.reduce((sum,p)=>sum + Number(p.quantity)*Number(p.price),0),[products]);
  const columns = [
    {key:'name',label:'Name'}, {key:'category',label:'Category'},
    {key:'quantity',label:'Qty'}, {key:'price',label:'Price',render:r=>formatMoney(r.price)}
  ];
  return <section className="content-card">
    <div className="section-heading"><div><p className="eyebrow">YOUR COLLECTION AT A GLANCE</p><h1>Inventory <em>Dashboard</em></h1><p className="muted">A clear view of every item in your hardware archive.</p></div><span className="date-chip"><CalendarDays size={14}/>{new Date().toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</span></div>
    <div className="stats-grid">
      <StatCard label="Total Products" value={products.length} note="Products in catalog" tone="blue"/>
      <StatCard label="Low Stock Items" value={lowStock.length} note="At or below minimum stock" tone="orange"/>
      <StatCard label="Inventory Value" value={formatMoney(value)} note="Current stock × unit price" tone="green"/>
    </div>
    <div className="table-heading"><div><p className="eyebrow">LATEST ENTRIES</p><h2>Recent Products</h2></div><button className="subtle-link" onClick={()=>navigate('/products')}>View all products</button></div>
    <DataTable columns={columns} rows={products.slice(0,5)} emptyText="No products yet. Add your first product."/>
    <button className="primary-button add-wide" onClick={onAdd}><Plus size={16}/> Add Product</button>
    {lowStock.length>0 && <div className="notice"><AlertTriangle size={17}/><span><strong>{lowStock.length} item(s) need restocking.</strong> Review the Products or Reports page.</span><button onClick={()=>navigate('/products')}>Review</button></div>}
  </section>;
}

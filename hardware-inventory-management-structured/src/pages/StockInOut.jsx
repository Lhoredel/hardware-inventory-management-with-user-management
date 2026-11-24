import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { today } from '../services/api';
export default function StockInOut({products,transactions,onRecord,notify}){
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({productId:products[0]?.id||'',type:'Stock In',quantity:1,date:today(),remarks:''});
  const [error,setError]=useState('');
  function submit(e){e.preventDefault();try{onRecord(form);setOpen(false);setForm({...form,quantity:1,remarks:''});setError('');notify(`${form.type} recorded successfully.`);}catch(err){setError(err.message);}}
  const columns=[
    {key:'date',label:'Date'},{key:'productName',label:'Product'},
    {key:'type',label:'Type',render:r=><span className={`status ${r.type==='Stock In'?'status-good':'status-low'}`}>{r.type}</span>},
    {key:'quantity',label:'Quantity'},{key:'remarks',label:'Remarks',render:r=>r.remarks||'—'},
    {key:'createdBy',label:'Recorded By'}
  ];
  return <section className="content-card">
    <div className="section-heading"><div><h1>Stock In/Out</h1><p className="muted">Record deliveries and released stock.</p></div><button className="primary-button" onClick={()=>{setError('');setOpen(true);}} disabled={!products.length}><Plus size={16}/> Record Stock</button></div>
    <div className="stats-grid stock-stats">
      <StatCard label="Stock In Records" value={transactions.filter(t=>t.type==='Stock In').length} tone="blue"/>
      <StatCard label="Stock Out Records" value={transactions.filter(t=>t.type==='Stock Out').length} tone="orange"/>
      <StatCard label="Products Tracked" value={products.length} tone="green"/>
    </div>
    <h2 className="subsection-title">Transaction History</h2>
    <DataTable columns={columns} rows={transactions}/>
    {open&&<Modal title="Record Stock In/Out" onClose={()=>setOpen(false)}>
      <form className="modal-form" onSubmit={submit}>
        <label>Product *</label><select value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})}>{products.map(p=><option key={p.id} value={p.id}>{p.name} — {p.quantity} available</option>)}</select>
        <label>Transaction Type *</label><div className="segmented"><button type="button" className={form.type==='Stock In'?'selected':''} onClick={()=>setForm({...form,type:'Stock In'})}>Stock In</button><button type="button" className={form.type==='Stock Out'?'selected':''} onClick={()=>setForm({...form,type:'Stock Out'})}>Stock Out</button></div>
        <div className="form-row"><div><label>Quantity *</label><input type="number" min="1" step="1" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required/></div><div><label>Date *</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></div></div>
        <label>Remarks</label><textarea rows="3" value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})} placeholder="Optional notes..."/>
        {error&&<p className="error-text">{error}</p>}
        <div className="modal-actions"><button type="button" className="outline-button" onClick={()=>setOpen(false)}>Cancel</button><button className="primary-button">Save Transaction</button></div>
      </form>
    </Modal>}
  </section>;
}

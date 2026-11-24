import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable, { EditAction, DeleteAction } from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatMoney, today } from '../services/api';

const blank = {name:'',category:'Pipes',quantity:0,price:0,minStock:5,supplier:''};
export default function Products({ products, setProducts, notify }) {
  const [query,setQuery] = useState('');
  const [category,setCategory] = useState('All');
  const [page,setPage] = useState(1);
  const [editing,setEditing] = useState(null);
  const [modalOpen,setModalOpen] = useState(false);
  const [deleting,setDeleting] = useState(null);
  const [form,setForm] = useState(blank);
  const [error,setError] = useState('');
  const perPage = 7;
  const categories = ['All',...new Set(products.map(p=>p.category).filter(Boolean))];
  const filtered = useMemo(()=>products.filter(p=>
    `${p.name} ${p.category} ${p.supplier}`.toLowerCase().includes(query.toLowerCase()) &&
    (category==='All'||p.category===category)
  ),[products,query,category]);
  const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
  const rows = filtered.slice((page-1)*perPage,page*perPage);
  function openAdd(){setEditing(null);setForm({...blank});setError('');setModalOpen(true);}
  function openEdit(p){setEditing(p);setForm({...p});setError('');setModalOpen(true);}
  function save(e){
    e.preventDefault();
    if(!form.name.trim()||!form.category.trim()){setError('Product name and category are required.');return;}
    if([form.quantity,form.price,form.minStock].some(v=>v===''||!Number.isFinite(Number(v))||Number(v)<0)){setError('Quantity, price, and minimum stock must be zero or greater.');return;}
    const data={...form,name:form.name.trim(),category:form.category.trim(),supplier:form.supplier.trim(),quantity:Number(form.quantity),price:Number(form.price),minStock:Number(form.minStock),updatedAt:today()};
    if(editing){setProducts(prev=>prev.map(p=>p.id===editing.id?{...data,id:editing.id}:p));notify('Product updated successfully.');}
    else{setProducts(prev=>[{...data,id:Date.now()},...prev]);notify('Product added successfully.');}
    setEditing(null);setModalOpen(false);
  }
  function remove(){setProducts(prev=>prev.filter(p=>p.id!==deleting.id));setDeleting(null);notify('Product deleted.');}
  const columns=[
    {key:'name',label:'Product Name'}, {key:'category',label:'Category'},
    {key:'quantity',label:'Qty'}, {key:'price',label:'Price',render:r=>formatMoney(r.price)},
    {key:'minStock',label:'Min. Stock'},
    {key:'status',label:'Status',render:r=><span className={`status ${r.quantity<=r.minStock?'status-low':'status-good'}`}>{r.quantity<=r.minStock?'Low Stock':'In Stock'}</span>}
  ];
  return <section className="content-card">
    <div className="section-heading"><div><h1>Products</h1><p className="muted">Manage hardware products and stock levels.</p></div><button className="primary-button" onClick={openAdd}><Plus size={16}/> Add Product</button></div>
    <SearchBar query={query} onQueryChange={v=>{setQuery(v);setPage(1);}} categories={categories} category={category} onCategoryChange={v=>{setCategory(v);setPage(1);}} placeholder="Search product, category, supplier..."/>
    <DataTable columns={columns} rows={rows} renderActions={p=><><EditAction onClick={()=>openEdit(p)}/><DeleteAction onClick={()=>setDeleting(p)}/></>}/>
    <div className="table-footnote">Showing {rows.length} of {filtered.length} product(s)</div>
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage}/>
    {modalOpen && <Modal title={editing?'Edit Product':'Add Product'} onClose={()=>setModalOpen(false)}>
      <form className="modal-form" onSubmit={save}>
        <label>Product Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="e.g. PVC Pipe 1/2&quot;"/>
        <div className="form-row"><div><label>Category *</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required/></div><div><label>Supplier</label><input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/></div></div>
        <div className="form-row three"><div><label>Quantity *</label><input type="number" min="0" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required/></div><div><label>Unit Price (₱) *</label><input type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/></div><div><label>Minimum Stock *</label><input type="number" min="0" value={form.minStock} onChange={e=>setForm({...form,minStock:e.target.value})} required/></div></div>
        {error&&<p className="error-text">{error}</p>}
        <div className="modal-actions"><button type="button" className="outline-button" onClick={()=>setModalOpen(false)}>Cancel</button><button className="primary-button">Save Product</button></div>
      </form>
    </Modal>}
    {deleting&&<ConfirmDialog message={`Are you sure you want to delete "${deleting.name}"? This cannot be undone.`} onCancel={()=>setDeleting(null)} onConfirm={remove}/>}
  </section>;
}

import { Download } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import { downloadCSV, formatMoney } from '../services/api';
export default function Reports({products,transactions}){
  const low=products.filter(p=>p.quantity<=p.minStock);
  const units=products.reduce((s,p)=>s+p.quantity,0);
  const value=products.reduce((s,p)=>s+p.quantity*p.price,0);
  const lowColumns=[{key:'name',label:'Product'},{key:'category',label:'Category'},{key:'quantity',label:'Qty'},{key:'minStock',label:'Minimum Stock'}];
  const valueColumns=[{key:'name',label:'Product'},{key:'quantity',label:'Quantity'},{key:'price',label:'Unit Price',render:r=>formatMoney(r.price)},{key:'total',label:'Stock Value',render:r=>formatMoney(r.quantity*r.price)}];
  function exportInventory(){downloadCSV([['Product','Category','Quantity','Unit Price','Minimum Stock','Supplier','Stock Value'],...products.map(p=>[p.name,p.category,p.quantity,p.price,p.minStock,p.supplier,p.quantity*p.price])],'hardware-inventory-report.csv');}
  function exportTransactions(){downloadCSV([['Date','Product','Type','Quantity','Remarks','Recorded By'],...transactions.map(t=>[t.date,t.productName,t.type,t.quantity,t.remarks,t.createdBy])],'stock-transactions.csv');}
  return <section className="content-card">
    <div className="section-heading"><div><h1>Reports</h1><p className="muted">Inventory summary and downloadable records.</p></div><button className="outline-button" onClick={exportInventory}><Download size={16}/> Export Inventory CSV</button></div>
    <div className="stats-grid report-stats"><StatCard label="Total Units on Hand" value={units} tone="blue"/><StatCard label="Total Stock In" value={transactions.filter(t=>t.type==='Stock In').reduce((s,t)=>s+t.quantity,0)} tone="green"/><StatCard label="Total Stock Out" value={transactions.filter(t=>t.type==='Stock Out').reduce((s,t)=>s+t.quantity,0)} tone="orange"/></div>
    <div className="report-block"><div className="table-heading"><h2>Low Stock Report</h2><span className="status status-low">{low.length} item(s)</span></div><DataTable columns={lowColumns} rows={low}/></div>
    <div className="report-block"><div className="table-heading"><h2>Inventory Valuation</h2><strong>{formatMoney(value)}</strong></div><DataTable columns={valueColumns} rows={products}/></div>
    <div className="report-block"><div className="table-heading"><h2>Transaction Report</h2><button className="subtle-link" onClick={exportTransactions}>Export transactions</button></div><p className="muted small">Download a CSV file containing all recorded stock movements.</p></div>
  </section>;
}

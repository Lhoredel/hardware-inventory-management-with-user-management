import { Pencil, Trash2 } from 'lucide-react';
export default function DataTable({ columns, rows, emptyText = 'No records found.', renderActions }) {
  return <div className="table-wrap"><table><thead><tr>
    {columns.map(col => <th key={col.key}>{col.label}</th>)}
    {renderActions && <th>Actions</th>}
  </tr></thead><tbody>
    {rows.length === 0 ? <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="empty-cell">{emptyText}</td></tr> :
      rows.map(row => <tr key={row.id}>
        {columns.map(col => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
        {renderActions && <td><div className="action-buttons">{renderActions(row)}</div></td>}
      </tr>)}
  </tbody></table></div>;
}
export function EditAction({ onClick }) { return <button className="icon-button edit" title="Edit" onClick={onClick}><Pencil size={16}/></button>; }
export function DeleteAction({ onClick }) { return <button className="icon-button delete" title="Delete" onClick={onClick}><Trash2 size={16}/></button>; }

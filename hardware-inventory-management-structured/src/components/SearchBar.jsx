import { Filter, Search } from 'lucide-react';
export default function SearchBar({ query, onQueryChange, categories = [], category, onCategoryChange, placeholder = 'Search...' }) {
  return <div className="toolbar">
    <div className="search-box"><Search size={17}/><input value={query} onChange={e => onQueryChange(e.target.value)} placeholder={placeholder}/></div>
    {categories.length > 0 && <div className="select-wrap"><Filter size={16}/><select value={category} onChange={e => onCategoryChange(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>}
  </div>;
}

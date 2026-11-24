const PRODUCTS_KEY = 'him_products';
const TRANSACTIONS_KEY = 'him_transactions';

const starterProducts = [
  { id: 1, name: 'PVC Pipe 1/2"', category: 'Pipes', quantity: 50, price: 85, minStock: 10, supplier: 'ABC Hardware', updatedAt: '2026-11-24' },
  { id: 2, name: 'GI Pipe 1"', category: 'Pipes', quantity: 25, price: 250, minStock: 8, supplier: 'Metro Supply', updatedAt: '2026-11-24' },
  { id: 3, name: 'Elbow Fitting', category: 'Fittings', quantity: 100, price: 12, minStock: 20, supplier: 'ABC Hardware', updatedAt: '2026-11-23' },
  { id: 4, name: 'Flexible Hose', category: 'Hoses', quantity: 15, price: 95, minStock: 10, supplier: 'BuildRight', updatedAt: '2026-11-22' },
  { id: 5, name: 'PVC Cement 500ml', category: 'Adhesives', quantity: 6, price: 145, minStock: 10, supplier: 'BuildRight', updatedAt: '2026-11-21' },
  { id: 6, name: 'Ball Valve 1/2"', category: 'Valves', quantity: 8, price: 180, minStock: 10, supplier: 'Metro Supply', updatedAt: '2026-11-20' }
];

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
export const today = () => new Date().toISOString().slice(0, 10);
export const formatMoney = value => new Intl.NumberFormat('en-PH', {
  style: 'currency', currency: 'PHP', maximumFractionDigits: 2
}).format(Number(value || 0));

export const api = {
  getProducts() { return read(PRODUCTS_KEY, starterProducts); },
  saveProducts(products) { write(PRODUCTS_KEY, products); },
  getTransactions() { return read(TRANSACTIONS_KEY, []); },
  saveTransactions(transactions) { write(TRANSACTIONS_KEY, transactions); },
  addProduct(data) {
    const products = this.getProducts();
    const product = { ...data, id: Date.now(), updatedAt: today() };
    this.saveProducts([product, ...products]);
    return product;
  },
  updateProduct(id, data) {
    const products = this.getProducts().map(p => p.id === id ? { ...p, ...data, updatedAt: today() } : p);
    this.saveProducts(products);
    return products;
  },
  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
    return products;
  },
  recordStock(data, username) {
    const products = this.getProducts();
    const product = products.find(p => p.id === Number(data.productId));
    if (!product) throw new Error('Please select a valid product.');
    const quantity = Number(data.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Quantity must be a whole number greater than zero.');
    if (data.type === 'Stock Out' && quantity > product.quantity) throw new Error(`Only ${product.quantity} unit(s) are currently available.`);
    const updated = products.map(p => p.id === product.id ? {
      ...p, quantity: p.quantity + (data.type === 'Stock In' ? quantity : -quantity), updatedAt: today()
    } : p);
    const transaction = {
      ...data, id: Date.now(), quantity, date: data.date || today(),
      productName: product.name, createdBy: username
    };
    this.saveProducts(updated);
    this.saveTransactions([transaction, ...this.getTransactions()]);
    return transaction;
  }
};

export function downloadCSV(rows, filename) {
  const csv = rows.map(row => row.map(value =>
    `"${String(value ?? '').replaceAll('"', '""')}"`
  ).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  URL.revokeObjectURL(url);
}

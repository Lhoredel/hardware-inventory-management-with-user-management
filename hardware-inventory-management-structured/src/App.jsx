import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockInOut from './pages/StockInOut';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

function ProtectedRoute({children}) {
  const {isAuthenticated}=useAuth();
  return isAuthenticated?children:<Navigate to="/login" replace/>;
}
export default function App(){
  const {isAuthenticated,user}=useAuth();
  const navigate=useNavigate();
  const [products,setProducts]=useState(()=>api.getProducts());
  const [transactions,setTransactions]=useState(()=>api.getTransactions());
  const [toast,setToast]=useState({message:'',type:'success'});
  useEffect(()=>api.saveProducts(products),[products]);
  useEffect(()=>api.saveTransactions(transactions),[transactions]);
  function notify(message,type='success'){
    setToast({message,type});
    window.setTimeout(()=>setToast({message:'',type:'success'}),2800);
  }
  function recordStock(data){
    try{
      const transaction=api.recordStock(data,user);
      setProducts(api.getProducts());
      setTransactions(api.getTransactions());
      return transaction;
    }catch(error){throw error;}
  }
  return <>
    <Routes>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" replace/>:<Login/>}/>
      <Route path="/" element={<ProtectedRoute><MainLayout/></ProtectedRoute>}>
        <Route index element={<Dashboard products={products} onAdd={()=>navigate('/products')}/>}/>
        <Route path="products" element={<Products products={products} setProducts={setProducts} notify={notify}/>}/>
        <Route path="stock" element={<StockInOut products={products} transactions={transactions} onRecord={recordStock} notify={notify}/>}/>
        <Route path="reports" element={<Reports products={products} transactions={transactions}/>}/>
        <Route path="settings" element={<Settings/>}/>
        <Route path="users" element={<AdminRoute><Users/></AdminRoute>}/>
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated?'/':'/login'} replace/>}/>
    </Routes>
    <Toast message={toast.message} type={toast.type}/>
  </>;
}

import React, { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { CustomersPage } from './pages/CustomersPage.jsx';
import { CustomerDetailPage } from './pages/CustomerDetailPage.jsx';
import { CardsPage } from './pages/CardsPage.jsx';
import { TransactionsPage } from './pages/TransactionsPage.jsx';
import { TransactionDetailPage } from './pages/TransactionDetailPage.jsx';
import { NewPaymentPage } from './pages/NewPaymentPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

function getStoredUser() { try { return JSON.parse(localStorage.getItem('shieldpay_user') || 'null'); } catch { return null; } }

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const auth = useMemo(() => ({
    user,
    setAuth: (token, u) => { localStorage.setItem('shieldpay_token', token); localStorage.setItem('shieldpay_user', JSON.stringify(u)); setUser(u); },
    logout: () => { localStorage.removeItem('shieldpay_token'); localStorage.removeItem('shieldpay_user'); setUser(null); }
  }), [user]);

  if (!user) {
    return <Routes><Route path="/login" element={<LoginPage auth={auth} />} /><Route path="/register" element={<RegisterPage auth={auth} />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes>;
  }

  return (
    <Layout auth={auth}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="/payments/new" element={<NewPaymentPage />} />
        <Route path="/admin" element={auth.user.role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
const links = [['/','Dashboard'],['/customers','Customers'],['/cards','Cards'],['/transactions','Transactions'],['/payments/new','New Payment'],['/admin','Admin'],['/settings','Settings']];

export function Layout({ children, auth }) {
  const location = useLocation();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>ShieldPay</h1>
        <p className="muted">{auth.user.email}</p>
        <nav>
          {links.filter((x) => (x[0] === '/admin' ? auth.user.role === 'admin' : true)).map(([to, label]) => (
            <Link key={to} to={to} className={location.pathname === to ? 'active' : ''}>{label}</Link>
          ))}
        </nav>
        <button className="btn danger" type="button" onClick={auth.logout}>Logout</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

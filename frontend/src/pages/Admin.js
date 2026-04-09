import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      if (!isAuthenticated || user?.role !== 'ADMIN') {
        return;
      }
      try {
        const [orderRes, userRes] = await Promise.all([api.adminGetOrders(), api.adminGetUsers()]);
        if (mounted) {
          setOrders(orderRes.data || []);
          setUsers(userRes.data || []);
        }
      } catch {
        if (mounted) {
          setOrders([]);
          setUsers([]);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <AppShell>
      <section className="section-block-v2">
        <h1>Admin dashboard</h1>
        <p>Quan ly nhanh user va order.</p>
      </section>

      <section className="section-block-v2">
        <h2>Users ({users.length})</h2>
        <div className="order-list">
          {users.map((u) => (
            <article className="order-item" key={u.id}>
              <strong>{u.name}</strong>
              <p>{u.email}</p>
              <span>{u.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block-v2">
        <h2>Orders ({orders.length})</h2>
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-item" key={order.orderId}>
              <strong>#{order.orderId}</strong>
              <p>{order.status}</p>
              <span>{order.paymentStatus}</span>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default Admin;

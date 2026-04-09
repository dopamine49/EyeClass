import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';
import { mockOrderHistory } from '../data/mockProducts';
import { priceToVnd } from '../utils/productMapper';

function Account() {
  const { isAuthenticated, user } = useAuth();
  const { items, clearWishlist } = useWishlist();
  const { upsertItem } = useCart();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadOrders() {
      try {
        const response = await api.getMyOrders();
        const next = response?.data || [];
        if (mounted) {
          setOrders(next.length ? next : mockOrderHistory);
        }
      } catch {
        if (mounted) {
          setOrders(mockOrderHistory);
        }
      }
    }
    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <section className="section-block-v2">
        <div className="section-heading">
          <h1>Xin chào, {user?.name || user?.email}</h1>
          <p>Quản lý đơn hàng, wishlist và referral tại đây.</p>
        </div>

        <div className="account-grid">
          <article className="account-card">
            <h3>Referral program</h3>
            <p>Mời bạn bè đặt đơn đầu, bạn nhận voucher 50k.</p>
            <code>EYE-{user?.id || 'NEW'}-GENZ</code>
            <button className="btn btn-lite" type="button">Sao chép mã</button>
          </article>
          <article className="account-card">
            <h3>Student perks</h3>
            <p>Nâng cấp student badge để mở khóa flash deal riêng.</p>
            <button className="btn btn-ghost" type="button">Verify student</button>
          </article>
        </div>
      </section>

      <section className="section-block-v2">
        <div className="section-heading">
          <h2>Lịch sử đơn hàng</h2>
        </div>
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.id || order.orderId} className="order-item">
              <div>
                <strong>#{order.id || order.orderId}</strong>
                <p>{order.date || order.createdAt}</p>
              </div>
              <p>{order.status}</p>
              <p>{priceToVnd(order.total || order.totalPrice || 0)}d</p>
              <button type="button" className="btn btn-lite">Reorder</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block-v2">
        <div className="section-heading">
          <h2>Sản phẩm đã lưu ({items.length})</h2>
          <button type="button" className="btn btn-lite" onClick={clearWishlist}>Clear</button>
        </div>
        <div className="saved-grid">
          {items.map((item) => (
            <article key={item.id} className="saved-card">
              <img src={item.imageUrl} alt={item.name} loading="lazy" />
              <h3>{item.name}</h3>
              <p>{priceToVnd(item.price)}d</p>
              <button type="button" className="btn btn-primary" onClick={() => upsertItem(item, 1)}>
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default Account;

import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ShippingProgress from '../components/ShippingProgress';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { priceToVnd } from '../utils/productMapper';

function Checkout() {
  const { isAuthenticated } = useAuth();
  const { cart, checkout } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    referralCode: '',
    studentEmail: '',
    paymentMethod: 'COD',
  });
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!cart.items.length) {
    return <Navigate to="/cart" replace />;
  }

  const onChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const verifyStudent = () => {
    if (form.studentEmail.endsWith('.edu.vn') || form.studentEmail.endsWith('.edu')) {
      setVerified(true);
      setMessage('Đã xác thực student discount 15%');
      return;
    }
    setVerified(false);
    setMessage('Email sinh viên chưa hợp lệ');
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const order = await checkout({
        shippingAddress: form.address,
        note: form.note || `Ref: ${form.referralCode || 'none'}`,
        paymentMethod: form.paymentMethod,
        shippingFee: 0,
      });
      setMessage(`Đặt hàng thành công. Mã đơn #${order.orderId}`);
      setTimeout(() => navigate('/account'), 1200);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Không thể checkout. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder}>
          <h1>One-page checkout</h1>
          <p>Tối ưu 1-2 click để hoàn tất đơn.</p>

          <input className="input" placeholder="Họ tên" value={form.name} onChange={onChange('name')} required />
          <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={onChange('phone')} required />
          <input className="input" placeholder="Địa chỉ giao hàng" value={form.address} onChange={onChange('address')} required />
          <textarea className="input" rows="3" placeholder="Ghi chú cho shop" value={form.note} onChange={onChange('note')} />

          <div className="inline-field">
            <input
              className="input"
              placeholder="Email sinh viên (.edu)"
              value={form.studentEmail}
              onChange={onChange('studentEmail')}
            />
            <button type="button" className="btn btn-lite" onClick={verifyStudent}>
              Verify
            </button>
          </div>

          <div className="inline-field">
            <input
              className="input"
              placeholder="Referral code"
              value={form.referralCode}
              onChange={onChange('referralCode')}
            />
            <button type="button" className="btn btn-lite">Apply</button>
          </div>

          <select className="input" value={form.paymentMethod} onChange={onChange('paymentMethod')}>
            <option value="COD">COD - Thanh toán khi nhận hàng</option>
            <option value="FAKE_PAY">Online payment</option>
          </select>

          {message ? <p className="feedback-text">{message}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
          </button>
        </form>

        <aside className="checkout-side">
          <h3>Đơn hàng của bạn</h3>
          <ShippingProgress total={cart.payableTotal || cart.subtotal || 0} />
          <div className="checkout-items">
            {cart.items.map((item) => (
              <article key={item.productId}>
                <span>{item.productName}</span>
                <strong>x{item.quantity}</strong>
              </article>
            ))}
          </div>

          <p>Tạm tính: {priceToVnd(cart.subtotal || 0)}d</p>
          <p>Giảm giá: {verified ? '15% student discount applied' : '0d'}</p>
          <h2>Tổng: {priceToVnd(cart.payableTotal || 0)}d</h2>

          <Link className="btn btn-ghost" to="/cart">Quay lại giỏ hàng</Link>
        </aside>
      </section>
    </AppShell>
  );
}

export default Checkout;

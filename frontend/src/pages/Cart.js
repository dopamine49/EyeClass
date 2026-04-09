import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ShippingProgress from '../components/ShippingProgress';
import { useCart } from '../context/CartContext';
import { accessoryUpsell } from '../data/mockProducts';
import { priceToVnd } from '../utils/productMapper';

function Cart() {
  const { cart, upsertItem, removeItem } = useCart();
  const navigate = useNavigate();

  const addUpsell = async () => {
    await upsertItem({ ...accessoryUpsell, productId: accessoryUpsell.id, productName: accessoryUpsell.name }, 1);
  };

  return (
    <AppShell>
      <section className="section-block-v2">
        <div className="section-heading">
          <h1>Giỏ hàng của bạn</h1>
          <p>{cart.totalItems || 0} sản phẩm</p>
        </div>
        <ShippingProgress total={cart.payableTotal || cart.subtotal || 0} />

        {cart.items.length ? (
          <div className="cart-list-v2">
            {cart.items.map((item) => (
              <article className="cart-row" key={item.productId}>
                <img src={item.imageUrl} alt={item.productName} loading="lazy" />
                <div>
                  <h3>{item.productName}</h3>
                  <p>{priceToVnd(item.price)}d</p>
                </div>
                <input
                  type="number"
                  min="1"
                  className="qty-input"
                  value={item.quantity}
                  onChange={(e) => upsertItem(item, Number(e.target.value || 1))}
                />
                <strong>{priceToVnd(item.lineTotal || item.price * item.quantity)}d</strong>
                <button type="button" className="btn btn-lite" onClick={() => removeItem(item.productId)}>
                  Xóa
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="feedback-text">Giỏ hàng đang trống. <Link to="/shop">Mua ngay</Link></p>
        )}
      </section>

      <section className="upsell-box">
        <img src={accessoryUpsell.imageUrl} alt={accessoryUpsell.name} loading="lazy" />
        <div>
          <p>Upsell gợi ý</p>
          <h3>{accessoryUpsell.name}</h3>
          <p>{accessoryUpsell.description}</p>
          <strong>{priceToVnd(accessoryUpsell.price)}d</strong>
        </div>
        <button type="button" className="btn btn-ghost" onClick={addUpsell}>Thêm phụ kiện</button>
      </section>

      <section className="checkout-summary">
        <p>Tạm tính: {priceToVnd(cart.subtotal || 0)}d</p>
        <p>Tiết kiệm: {priceToVnd(cart.discountTotal || 0)}d</p>
        <h2>Thanh toán: {priceToVnd(cart.payableTotal || 0)}d</h2>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/checkout')}>
          Tiếp tục checkout
        </button>
      </section>
    </AppShell>
  );
}

export default Cart;

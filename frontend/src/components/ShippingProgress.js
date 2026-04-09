import React from 'react';
import { priceToVnd } from '../utils/productMapper';

function ShippingProgress({ total }) {
  const threshold = 700000;
  const percent = Math.min(100, Math.round((Number(total || 0) / threshold) * 100));
  const remain = Math.max(0, threshold - Number(total || 0));

  return (
    <div className="shipping-progress">
      <div className="shipping-progress-top">
        <p>{remain > 0 ? `Mua thêm ${priceToVnd(remain)}đ để được freeship` : 'Bạn đã được freeship'}</p>
        <strong>{percent}%</strong>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default ShippingProgress;

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    if (responseCode === '00') {
      setStatus('success');
      setTimeout(() => navigate('/account'), 3000);
    } else {
      setStatus('fail');
    }
  }, [searchParams, navigate]);

  return (
    <AppShell>
      <section style={{ textAlign: 'center', padding: '60px 20px' }}>
        {status === 'loading' && <p>Đang xử lý kết quả thanh toán...</p>}
        {status === 'success' && (
          <>
            <h2>✅ Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng. Đang chuyển về trang tài khoản...</p>
          </>
        )}
        {status === 'fail' && (
          <>
            <h2>❌ Thanh toán thất bại</h2>
            <p>Mã lỗi: {searchParams.get('vnp_ResponseCode')}</p>
            <button className="btn btn-primary" onClick={() => navigate('/cart')}>
              Quay lại giỏ hàng
            </button>
          </>
        )}
      </section>
    </AppShell>
  );
}

export default PaymentReturn;
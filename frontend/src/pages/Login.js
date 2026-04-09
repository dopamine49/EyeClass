import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const onChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login(form.email, form.password);
      }
      navigate('/account');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="auth-wrap">
        <article className="auth-visual">
          <h1>{isRegister ? 'Join EYEClass' : 'Welcome back'}</h1>
          <p>Đăng nhập để lưu giỏ hàng, theo dõi đơn và nhận ưu đãi student.</p>
        </article>

        <form className="auth-form-v2" onSubmit={onSubmit}>
          <h2>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</h2>
          {isRegister ? <input className="input" placeholder="Họ tên" value={form.name} onChange={onChange('name')} required /> : null}
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={onChange('email')} required />
          <input className="input" placeholder="Mật khẩu" type="password" value={form.password} onChange={onChange('password')} required />
          {isRegister ? (
            <>
              <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={onChange('phone')} />
              <input className="input" placeholder="Địa chỉ" value={form.address} onChange={onChange('address')} />
            </>
          ) : null}

          {message ? <p className="feedback-text">{message}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
          <button type="button" className="btn btn-lite" onClick={() => setIsRegister((prev) => !prev)}>
            {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </form>
      </section>
    </AppShell>
  );
}

export default Login;

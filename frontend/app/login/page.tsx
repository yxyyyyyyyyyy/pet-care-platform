'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '../../components/Alert';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://yxyyy.pythonanywhere.com/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username: username.trim(), password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || '注册失败');
        }

        setSuccess('注册成功，请登录');
        setIsRegister(false);
        setPassword('');
      } else {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username: username.trim(), password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || '登录失败');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/pets');
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🐾 宠物健康养护平台</h1>
          <p>{isRegister ? '创建新账户' : '登录您的账户'}</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            disabled={loading}
          >
            {loading ? '处理中...' : (isRegister ? '注册' : '登录')}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? (
            <>
              已有账户？{' '}
              <button onClick={() => setIsRegister(false)}>
                立即登录
              </button>
            </>
          ) : (
            <>
              还没有账户？{' '}
              <button onClick={() => setIsRegister(true)}>
                立即注册
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

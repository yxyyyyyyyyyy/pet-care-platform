import { useState } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '@/lib/api';
import Alert from '@/components/Alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
        const response = await authApi.register(username.trim(), password);
        setSuccess('注册成功，请登录');
        setIsRegister(false);
        setPassword('');
      } else {
        const response = await authApi.login(username.trim(), password);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/pets');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🐾 宠物健康养护平台</h1>
          <p className="text-gray-500">{isRegister ? '创建新账户' : '登录您的账户'}</p>
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

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? (
            <>
              已有账户？{' '}
              <button
                onClick={() => setIsRegister(false)}
                className="text-indigo-600 hover:underline"
              >
                立即登录
              </button>
            </>
          ) : (
            <>
              还没有账户？{' '}
              <button
                onClick={() => setIsRegister(true)}
                className="text-indigo-600 hover:underline"
              >
                立即注册
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

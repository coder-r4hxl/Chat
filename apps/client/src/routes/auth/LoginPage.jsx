import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore.js';
import { useToast } from '../../components/Toast.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const isLoggingIn = useAuthStore(s => s.isLoggingIn);
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Login failed';
      setError(msg);
      toast({ type: 'error', title: 'Login failed', message: msg });
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="form-control">
              <div className="label">Email</div>
              <input
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </label>
            <label className="form-control">
              <div className="label">Password</div>
              <input
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </label>

            {error ? <div className="text-error text-sm">{error}</div> : null}

            <button className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



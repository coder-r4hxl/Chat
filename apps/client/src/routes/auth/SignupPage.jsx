import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore.js';
import { useToast } from '../../components/Toast.jsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore(s => s.signup);
  const isSigningUp = useAuthStore(s => s.isSigningUp);
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await signup({ username, email, password });
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Signup failed';
      setError(msg);
      toast({ type: 'error', title: 'Signup failed', message: msg });
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title">Sign up</h1>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="form-control">
              <div className="label">Username</div>
              <input
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                required
              />
            </label>
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

            <button className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div className="text-sm text-center mt-2">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

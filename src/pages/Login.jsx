import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__bg" />
      <div className="login__card">
        <div className="login__logo">
          <div className="login__logo-icon">
            <Zap size={28} />
          </div>
        </div>
        <h1 className="login__title">Welcome back</h1>
        <p className="login__subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="login__form">
          {error && (
            <div className="login__error">
              <p>{error}</p>
            </div>
          )}

          <div className="login__field">
            <label htmlFor="login-username" className="login__label">Username</label>
            <input
              id="login-username"
              type="text"
              className="login__input"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login__field">
            <label htmlFor="login-password" className="login__label">Password</label>
            <div className="login__password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login__input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button variant="primary" type="submit" fullWidth loading={loading} className="login__submit">
            Sign In
          </Button>
        </form>

        <p className="login__hint">
          Try: <strong>admin</strong> / any password, or <strong>agent_ravi</strong>, <strong>tl_alpha</strong>, <strong>rm_north</strong>, <strong>auditor_priya</strong>
        </p>

        <p className="login__footer">Field Force Management System</p>
      </div>
    </div>
  );
}

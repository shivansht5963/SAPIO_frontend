import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Copy, Check, AlertCircle, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const TEST_CREDENTIALS = [
  { role: 'Admin', username: 'admin_user', password: 'admin123' },
  { role: 'Agent', username: 'agent_ravi', password: 'pass123' },
  { role: 'Team Lead', username: 'tl_alpha', password: 'pass123' },
  { role: 'Regional Manager', username: 'rm_north', password: 'pass123' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showCreds, setShowCreds] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 401 || status === 400) {
        setError(detail || 'Invalid username or password. Please try again.');
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        setError('Unable to reach server. Please check your connection and try again.');
      } else {
        setError(detail || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  }

  return (
    <div className="login">
      <div className="login__bg" />
      
      {/* Floating Button to open credentials */}
      {!showCreds && (
        <button className="login__creds-toggle" onClick={() => setShowCreds(true)}>
          <AlertCircle size={18} />
          Test Credentials
        </button>
      )}

      {/* Side Panel for Test Credentials */}
      <div className={`login__creds-panel ${showCreds ? 'login__creds-panel--open' : ''}`}>
        <div className="login__creds-header">
          <h3>Test Credentials</h3>
          <button onClick={() => setShowCreds(false)} className="login__creds-close">
            <X size={20} />
          </button>
        </div>
        <div className="login__creds-content">
          <p className="login__creds-desc">Use these demo credentials to test different roles.</p>
          
          {TEST_CREDENTIALS.map((cred) => (
            <div key={cred.role} className="login__cred-card">
              <h4 className="login__cred-role">{cred.role}</h4>
              
              <div className="login__cred-field">
                <span className="login__cred-label">Username</span>
                <div className="login__cred-value-wrapper">
                  <code className="login__cred-value">{cred.username}</code>
                  <button 
                    className="login__cred-copy" 
                    onClick={() => handleCopy(cred.username)}
                    title="Copy username"
                  >
                    {copiedText === cred.username ? <Check size={14} color="var(--success, #10b981)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              
              <div className="login__cred-field">
                <span className="login__cred-label">Password</span>
                <div className="login__cred-value-wrapper">
                  <code className="login__cred-value">{cred.password}</code>
                  <button 
                    className="login__cred-copy" 
                    onClick={() => handleCopy(cred.password)}
                    title="Copy password"
                  >
                    {copiedText === cred.password ? <Check size={14} color="var(--success, #10b981)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="login__card">
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

        <p className="login__footer">Field Force Management System</p>
      </div>
    </div>
  );
}

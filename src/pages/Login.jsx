import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 120 170" width="80" height="113">
            <circle cx="60" cy="36" r="22" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2.5" />
            <circle cx="52" cy="34" r="2.5" fill="#e8907a" />
            <circle cx="68" cy="34" r="2.5" fill="#e8907a" />
            <circle cx="46" cy="40" r="4" fill="#f4a89a" opacity="0.35" />
            <circle cx="74" cy="40" r="4" fill="#f4a89a" opacity="0.35" />
            <path d="M 53,44 Q 60,52 67,44" fill="none" stroke="#e8907a" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="58" x2="60" y2="65" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 42,68 L 60,65 L 78,68 L 82,105 Q 60,112 38,105 Z" fill="#e8907a" opacity="0.15" stroke="#e8907a" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 42,72 Q 28,62 22,50" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 20,44 Q 16,38 20,35 Q 24,32 28,35 L 20,44 L 12,35 Q 16,32 20,35" fill="#e8907a" opacity="0.5" stroke="#e8907a" strokeWidth="1.5" />
            <path d="M 78,72 Q 92,82 96,95" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="97" cy="97" r="4" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2" />
            <path d="M 48,105 L 45,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="43" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2" />
            <path d="M 72,105 L 75,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="77" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="auth-title">גן דגנית</h1>
        <p className="auth-subtitle">חשרכה לניהול צוות</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'רגע...' : 'התחברות'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">שכחתי סיסמה</Link>
          <p className="auth-signup-prompt">
            עדיין אין לך חשבון?{' '}
            <Link to="/signup" className="auth-link auth-link-primary">הרשם כאן</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ChevronRight, LogIn } from 'lucide-react';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: '100vh', background: '#ecdcc8', display: 'flex', alignItems: 'stretch', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

        .lg-inp:focus { border-color: #8b5e3c !important; box-shadow: 0 0 0 3px rgba(139,94,60,0.12) !important; }
        .lg-btn { transition: all 0.2s; }
        .lg-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,94,60,0.4) !important; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: 'linear-gradient(150deg,#3d1f0a 0%,#2c1506 55%,#3d1f0a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(196,148,90,0.07)', animation: 'floatOrb 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(139,94,60,0.09)', animation: 'floatOrb 10s ease-in-out infinite 2s', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(196,148,90,0.05)', animation: 'floatOrb 12s ease-in-out infinite 4s', pointerEvents: 'none' }} />

        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 40%, rgba(196,148,90,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{ position: 'relative', textAlign: 'center', animation: 'fadeUp 0.8s ease both' }}>
          {/* Logo mark */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 700, color: '#f5ece0', letterSpacing: '-0.01em', lineHeight: 1.1, margin: 0 }}>The Event Utsava</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600, color: '#c4945a', letterSpacing: '0.06em', fontStyle: 'italic', margin: '4px 0 0' }}>by Planexa</p>
          </div>

          {/* Headline */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, color: '#f5ece0', lineHeight: 1.15, marginBottom: 18, letterSpacing: '-0.01em' }}>
            Welcome<br />
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#e8c98a,#c4945a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Back
            </em>
          </h2>

          <p style={{ color: 'rgba(245,236,224,0.62)', fontSize: '0.92rem', fontWeight: 300, lineHeight: 1.75, maxWidth: 300, margin: '0 auto 40px' }}>
            Sign in to discover and book extraordinary events crafted just for you.
          </p>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
            <div style={{ width: 40, height: 1, background: 'rgba(196,148,90,0.4)' }} />
            <span style={{ color: '#c4945a', fontSize: '1rem' }}>✦</span>
            <div style={{ width: 40, height: 1, background: 'rgba(196,148,90,0.4)' }} />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
            {[
              { num: '50K+', label: 'Events' },
              { num: '1M+',  label: 'Attendees' },
              { num: '200+', label: 'Cities' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: '#e8c98a', lineHeight: 1, marginBottom: 4 }}>{s.num}</p>
                <p style={{ fontSize: '0.66rem', color: 'rgba(245,236,224,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom  */}
        <p style={{ position: 'absolute', bottom: 28, color: 'rgba(245,236,224,0.3)', fontSize: '0.72rem', fontStyle: 'italic', textAlign: 'center', letterSpacing: '0.04em' }}>
          "Craft moments that last forever"
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: '100%', maxWidth: 480, background: '#faf4ec', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', position: 'relative', animation: 'fadeUp 0.6s ease 0.15s both' }}>

        {/* Top decorative line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8b5e3c,#c4945a,#8b5e3c)' }} />

        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Form header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', marginBottom: 8 }}>SIGN IN</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, color: '#2c1a0e', marginBottom: 6, lineHeight: 1.15 }}>
              Login to Your Account
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#a88972', fontWeight: 400 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#8b5e3c', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fdecea', border: '1px solid rgba(139,60,60,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: '0.84rem', color: '#8b2020', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem' }}>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b4c35', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8, display: 'block' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a88972', pointerEvents: 'none' }} />
                <input
                  className="lg-inp"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 11, border: '1px solid rgba(139,94,60,0.22)', fontSize: '0.9rem', color: '#2c1a0e', background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b4c35', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8, display: 'block' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a88972', pointerEvents: 'none' }} />
                <input
                  className="lg-inp"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ width: '100%', padding: '12px 44px 12px 42px', borderRadius: 11, border: '1px solid rgba(139,94,60,0.22)', fontSize: '0.9rem', color: '#2c1a0e', background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a88972', padding: 4, display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="lg-btn"
              disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? '#dfc9af' : 'linear-gradient(135deg,#c4945a,#8b5e3c)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: loading ? 'none' : '0 4px 18px rgba(139,94,60,0.32)', transition: 'all 0.2s', fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(139,94,60,0.15)' }} />
            <span style={{ fontSize: '0.72rem', color: '#a88972', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(139,94,60,0.15)' }} />
          </div>

          {/* Browse events link */}
          <Link to="/events"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', padding: '12px', borderRadius: 12, background: 'rgba(139,94,60,0.07)', border: '1px solid rgba(139,94,60,0.18)', color: '#8b5e3c', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', transition: 'background 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,94,60,0.13)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,94,60,0.07)'}>
            Browse Events Without Login <ChevronRight size={15} />
          </Link>

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#a88972', marginTop: 28, lineHeight: 1.6 }}>
            By signing in you agree to our{' '}
            <span style={{ color: '#8b5e3c', fontWeight: 600, cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#8b5e3c', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Key, Eye, EyeOff, ChevronRight } from 'lucide-react';

const Register = () => {
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [adminKey,  setAdminKey]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [showKey,   setShowKey]   = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Pass adminKey to AuthContext register function
    const result = await register(name, email, password, adminKey || undefined);

    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  const inp = {
    width: '100%', padding: '11px 14px 11px 40px',
    borderRadius: 10, border: '1px solid rgba(139,94,60,0.22)',
    fontSize: '0.9rem', color: '#2c1a0e', background: '#faf4ec',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: '80vh', background: '#ecdcc8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500;600;700&display=swap');
        .rg-inp:focus { border-color: #8b5e3c !important; box-shadow: 0 0 0 3px rgba(139,94,60,0.1); }
        .rg-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ width: '100%', maxWidth: 440, background: '#faf4ec', borderRadius: 20, border: '1px solid rgba(139,94,60,0.15)', boxShadow: '0 12px 40px rgba(139,94,60,0.12)', overflow: 'hidden', animation: 'fadeUp 0.5s ease both' }}>

        {/* Card header */}
        <div style={{ background: 'linear-gradient(135deg,#3d1f0a,#2c1506)', padding: '28px 32px' }}>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: '#c4945a', textTransform: 'uppercase', marginBottom: 6 }}>JOIN US</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 700, color: '#f5ece0', margin: 0 }}>
            Create Account
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(245,236,224,0.6)', marginTop: 4 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c4945a', fontWeight: 600, textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {error && (
            <div style={{ background: '#fdecea', border: '1px solid rgba(139,60,60,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.84rem', color: '#8b2020', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b4c35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7, display: 'block' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#a88972' }} />
              <input className="rg-inp" type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Priya Sharma" required style={inp} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b4c35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7, display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#a88972' }} />
              <input className="rg-inp" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com" required style={inp} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b4c35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#a88972' }} />
              <input className="rg-inp" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Create a password" required style={{ ...inp, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a88972', padding: 0, display: 'flex' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Admin Key — optional */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b4c35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7, display: 'block' }}>
              Admin Key <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#a88972' }}>(optional — leave blank for regular account)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#a88972' }} />
              <input className="rg-inp" type={showKey ? 'text' : 'password'} value={adminKey} onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter admin key if you have one" style={{ ...inp, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowKey(!showKey)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a88972', padding: 0, display: 'flex' }}>
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="rg-btn" disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? '#dfc9af' : 'linear-gradient(135deg,#c4945a,#8b5e3c)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 4px 16px rgba(139,94,60,0.3)', transition: 'all 0.18s', fontFamily: 'inherit', marginTop: 4 }}>
            {loading ? 'Creating account...' : <> Create Account <ChevronRight size={16} /></>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;
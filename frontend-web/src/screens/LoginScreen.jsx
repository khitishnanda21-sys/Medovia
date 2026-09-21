import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import logo from '../assets/medovia-icon.png';

function LoginScreen() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    let valid = true;
    if (!id.trim()) {
      setIdError('Email is required');
      valid = false;
    } else {
      setIdError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, id, password);
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #F5F3DF 0%, #E8E4C9 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative 3D-style off-white circles in the background */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-80px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #e9e9e2)',
          boxShadow: '20px 20px 60px rgba(0,0,0,0.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #e9e9e2)',
          boxShadow: '20px 20px 60px rgba(0,0,0,0.05)',
        }}
      />

      {/* White login card */}
      <form
        onSubmit={handleLogin}
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '32px 24px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="Medovia" style={{ width: '100px', marginBottom: '16px' }} />
        <h2 style={{ color: '#0F3D3E', marginBottom: '4px' }}>Welcome back</h2>
        <p style={{ color: '#5f5e5a', fontSize: '0.9rem', marginBottom: '24px' }}>
          Login to continue
        </p>

        {/* Email field */}
        <div style={{ width: '100%', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Email address"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: idError ? '1px solid #D85A30' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          {idError && (
            <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{idError}</p>
          )}
        </div>

        {/* Password field */}
        <div style={{ width: '100%', marginBottom: '8px', position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '48px',
              borderRadius: '10px',
              border: passwordError ? '1px solid #D85A30' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: '#0F3D3E',
              userSelect: 'none',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {passwordError && (
            <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{passwordError}</p>
          )}
        </div>

        {loginError && (
          <p style={{ color: '#D85A30', fontSize: '0.85rem', marginBottom: '8px' }}>{loginError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#0F3D3E',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            marginTop: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0F3D3E',
            marginTop: '16px',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Don't have an account? Register
        </button>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          style={{
            background: 'none',
            border: 'none',
            color: '#5f5e5a',
            fontSize: '0.9rem',
            marginTop: '10px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}

export default LoginScreen;
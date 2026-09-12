import { useNavigate } from 'react-router-dom';
import logo from '../assets/medovia-icon.png';

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #F5F3DF 0%, #E8E4C9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={logo}
        alt="Medovia"
        style={{ width: '200px', maxWidth: '60vw', marginBottom: '24px' }}
      />

      <h1 style={{ color: '#0F3D3E', fontSize: '1.6rem', marginBottom: '8px', textAlign: 'center' }}>
        Welcome to Medovia
      </h1>
      <p style={{ color: '#5f5e5a', fontSize: '0.95rem', textAlign: 'center', marginBottom: '40px' }}>
        Your trusted connection between patients and doctors.
      </p>

      <button
        onClick={() => navigate('/login')}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '14px',
          backgroundColor: '#1b898a',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          marginBottom: '12px',
          cursor: 'pointer',
        }}
      >
        Login
      </button>

      <button
        onClick={() => navigate('/register')}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '14px',
          backgroundColor: 'transparent',
          color: '#0F3D3E',
          border: '2px solid #0F3D3E',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Register
      </button>
            <button
        onClick={() => navigate('/forgot-password')}
        style={{
          background: 'none',
          border: 'none',
          color: '#5f5e5a',
          fontSize: '0.9rem',
          marginTop: '16px',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Forgot password?
      </button>
    </div>
  );
}

export default WelcomeScreen;
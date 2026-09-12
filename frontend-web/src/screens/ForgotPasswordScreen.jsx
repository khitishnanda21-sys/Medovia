import { useNavigate } from 'react-router-dom';

function ForgotPasswordScreen() {
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
      <h1 style={{ color: '#0F3D3E', fontSize: '1.4rem', marginBottom: '12px' }}>
        Reset your password
      </h1>
      <p style={{ color: '#5f5e5a', marginBottom: '24px', textAlign: 'center' }}>
        Enter your registered email and we'll send you a reset link.
      </p>

      <input
        type="email"
        placeholder="Email address"
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          marginBottom: '16px',
        }}
      />

      <button
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '14px',
          backgroundColor: '#0F3D3E',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        Send reset link
      </button>

      <button
        onClick={() => navigate('/welcome')}
        style={{
          background: 'none',
          border: 'none',
          color: '#5f5e5a',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        Back to login
      </button>
    </div>
  );
}

export default ForgotPasswordScreen;
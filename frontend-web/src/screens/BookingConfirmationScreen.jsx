import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { doctors, getNextToken } from '../data/doctors';
import dashboardBg from '../assets/medovia-dashboard-bg.png';

function BookingConfirmationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'Online';

  const doctor = doctors.find((d) => d.id === Number(id));

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '36px 28px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e7f8f2',
            color: '#19765f',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          ✓
        </div>
        <h2 style={{ color: '#0F3D3E', marginBottom: '6px' }}>Appointment booked!</h2>
        <p style={{ color: '#5f5e5a', fontSize: '0.9rem', marginBottom: '20px' }}>
          Your payment was successful and your consultation is confirmed.
        </p>

        {doctor && (
          <div
            style={{
              textAlign: 'left',
              backgroundColor: '#f9f8ee',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>{doctor.name}</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>{doctor.dept}</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>{mode} consultation</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>{doctor.timing}</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>
              🎫 Your token: <strong>#{getNextToken(doctor)}</strong>
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#0F3D3E',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => navigate('/appointments')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'transparent',
            color: '#0F3D3E',
            border: '2px solid #0F3D3E',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          View My Appointments
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmationScreen;
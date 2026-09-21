import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import dashboardBg from '../assets/medovia-dashboard-bg.png';

function DoctorDashboardScreen() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const displayName = currentUser?.email ? currentUser.email.split('@')[0] : 'Doctor';

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#0F3D3E', color: '#fff' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Doctor Dashboard</p>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#D85A30', fontWeight: 'bold', cursor: 'pointer' }}>
          🚪 Logout
        </button>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ color: '#0F3D3E', fontSize: '1.6rem', marginBottom: '4px' }}>Welcome, Dr. {displayName}</h1>
        <p style={{ color: '#5f5e5a', marginBottom: '24px' }}>Your patient queue and case sheets will appear here.</p>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ color: '#5f5e5a', fontSize: '0.9rem' }}>
            🚧 Doctor Copilot (patient queue, AI-generated case summaries, and priority flags) is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboardScreen;
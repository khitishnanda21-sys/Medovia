import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/medovia-icon.png';

const navItems = [
  { key: 'dashboard', title: 'Dashboard', icon: '🏠' },
  { key: 'find-doctors', title: 'Find doctors', icon: '🩺' },
  { key: 'appointments', title: 'Appointments', icon: '📅' },
  { key: 'prescriptions', title: 'Prescriptions', icon: '📄' },
  { key: 'payments', title: 'Payments', icon: '💳' },
  { key: 'dr-matrix', title: 'Dr. Matrix', icon: '🤖' },
  { key: 'reviews', title: 'Reviews', icon: '⭐' },
];

const stats = [
  { label: 'Upcoming appointments', value: '2', icon: '📅' },
  { label: 'Active prescriptions', value: '3', icon: '📄' },
  { label: 'Pending payments', value: '₹0', icon: '💳' },
];

const recentCases = [
  { doctor: 'Dr. Riya Mehta', dept: 'Oncology', status: 'Confirmed', date: 'Today, 4:00 PM' },
  { doctor: 'Dr. Aman Verma', dept: 'Cardiology', status: 'Pending', date: 'Tomorrow, 10:30 AM' },
];

function DashboardScreen() {
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');

  const handleNav = (key) => {
    setActive(key);
    if (key !== 'dashboard') navigate(`/${key}`);
  };

  const handleLogout = () => navigate('/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F3DF' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '230px',
          background: '#ffffff',
          borderRight: '1px solid #e6e3d3',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px 26px' }}>
          <img src={logo} alt="Medovia" style={{ width: '34px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F3D3E' }}>MEDOVIA</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left',
                width: '100%',
                padding: '11px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backgroundColor: active === item.key ? '#0F3D3E' : 'transparent',
                color: active === item.key ? '#fff' : '#4a4a45',
              }}
            >
              <span>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'left',
            padding: '11px 12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            background: 'none',
            color: '#D85A30',
            fontWeight: 'bold',
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Top bar */}
        <div
          style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e6e3d3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', color: '#0F3D3E', margin: 0 }}>Dashboard</h2>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e7f2ef',
              color: '#0F3D3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            P
          </div>
        </div>

        <div style={{ maxWidth: '1000px', padding: '30px' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#0F3D3E', marginBottom: '4px' }}>Welcome back</h1>
          <p style={{ color: '#5f5e5a', marginBottom: '24px' }}>Here's what's happening with your care today.</p>

          {/* Stat cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid #e6e3d3',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#5f5e5a' }}>{s.label}</p>
                  <h3 style={{ margin: '6px 0 0', fontSize: '1.5rem', color: '#0F3D3E' }}>{s.value}</h3>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#e7f2ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Recent cases */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e6e3d3',
              borderRadius: '16px',
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: '1rem', color: '#0F3D3E', marginBottom: '14px' }}>Upcoming appointments</h3>
            {recentCases.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < recentCases.length - 1 ? '1px solid #eee' : 'none',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>{c.doctor}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#5f5e5a' }}>{c.dept} • {c.date}</p>
                </div>
                <span
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: c.status === 'Confirmed' ? '#e7f8f2' : '#fdf3e6',
                    color: c.status === 'Confirmed' ? '#19765f' : '#a5690c',
                  }}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
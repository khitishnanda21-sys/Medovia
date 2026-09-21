import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';
import dashboardBg from '../assets/medovia-dashboard-bg.png';

const mockAppointments = [
  { id: 1, doctorId: 1, date: 'Today', time: '4:00 PM', mode: 'Online', status: 'Confirmed', tab: 'upcoming' },
  { id: 2, doctorId: 2, date: 'Tomorrow', time: '10:30 AM', mode: 'Offline', status: 'Pending', tab: 'upcoming' },
  { id: 3, doctorId: 3, date: '2 Sep 2026', time: '9:15 AM', mode: 'Offline', status: 'Completed', tab: 'past' },
  { id: 4, doctorId: 4, date: '18 Aug 2026', time: '3:00 PM', mode: 'Online', status: 'Completed', tab: 'past' },
  { id: 5, doctorId: 6, date: '5 Aug 2026', time: '1:30 PM', mode: 'Online', status: 'Cancelled', tab: 'past' },
];

const statusColors = {
  Confirmed: { bg: '#e7f8f2', color: '#19765f' },
  Pending: { bg: '#fdf3e6', color: '#a5690c' },
  Completed: { bg: '#eef1fd', color: '#3a4fb0' },
  Cancelled: { bg: '#fdecea', color: '#c0392b' },
};

function AppointmentsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');

  const filtered = mockAppointments.filter((a) => a.tab === tab);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          background: '#0F3D3E',
          color: '#fff',
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
          aria-label="Back to dashboard"
        >
          ←
        </button>
        <p style={{ margin: 0, fontWeight: 'bold' }}>My Appointments</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '700px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f0f0e8',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px',
            maxWidth: '280px',
          }}
        >
          {['upcoming', 'past'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                backgroundColor: tab === t ? '#0F3D3E' : 'transparent',
                color: tab === t ? '#fff' : '#0F3D3E',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: '#5f5e5a', textAlign: 'center', marginTop: '40px' }}>
            No {tab} appointments.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((appt) => {
            const doctor = doctors.find((d) => d.id === appt.doctorId);
            if (!doctor) return null;
            const colors = statusColors[appt.status];

            return (
              <div
                key={appt.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#e7f2ef',
                        color: '#0F3D3E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}
                    >
                      {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>{doctor.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>{doctor.dept}</p>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: colors.bg,
                      color: colors.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {appt.status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginTop: '14px',
                    paddingTop: '14px',
                    borderTop: '1px solid #eee',
                    fontSize: '0.85rem',
                    color: '#5f5e5a',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>📅 {appt.date}</span>
                  <span>🕐 {appt.time}</span>
                  <span>💻 {appt.mode}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  {tab === 'upcoming' && appt.mode === 'Online' && appt.status === 'Confirmed' && (
                    <button
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#0F3D3E',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Join call
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #0F3D3E',
                      backgroundColor: 'transparent',
                      color: '#0F3D3E',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    View doctor
                  </button>
                  {tab === 'past' && appt.status === 'Completed' && (
                    <button
                      onClick={() => navigate(`/reviews?doctorId=${doctor.id}`)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        color: '#333',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Rate doctor
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AppointmentsScreen;
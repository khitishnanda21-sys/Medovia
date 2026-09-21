import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doctors, getWaitMinutes } from '../data/doctors';

function DoctorProfileScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === Number(id));

  const [urgency, setUrgency] = useState(null); // null | 'yes' | 'no'
  const [mode, setMode] = useState('Online');
  const [suggestion, setSuggestion] = useState(null);

  if (!doctor) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Doctor not found.</p>
        <button onClick={() => navigate('/find-doctors')}>Back to search</button>
      </div>
    );
  }

  const handleUrgency = (answer) => {
    setUrgency(answer);
    setSuggestion(null);

    if (answer === 'yes') {
      const sameDept = doctors.filter((d) => d.dept === doctor.dept && d.id !== doctor.id);
      if (sameDept.length === 0) return;

      const fastest = sameDept.reduce((best, d) =>
        getWaitMinutes(d) < getWaitMinutes(best) ? d : best
      , sameDept[0]);

      if (getWaitMinutes(fastest) < getWaitMinutes(doctor)) {
        setSuggestion(fastest);
      }
    }
  };

  const handleBook = () => {
    navigate(`/payment/${doctor.id}?mode=${mode}`);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#F5F3DF' }}>
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
          onClick={() => navigate('/find-doctors')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          ←
        </button>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Doctor Profile</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Doctor card */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                backgroundColor: '#e7f2ef',
                color: '#0F3D3E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.3rem',
              }}
            >
              {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#0F3D3E' }}>{doctor.name}</p>
              <p style={{ margin: '2px 0 0', color: '#5f5e5a', fontSize: '0.9rem' }}>{doctor.dept} • ⭐ {doctor.rating}</p>
            </div>
          </div>

          <p style={{ margin: '4px 0', color: '#5f5e5a', fontSize: '0.9rem' }}>📍 {doctor.address}</p>
          <p style={{ margin: '4px 0', color: '#5f5e5a', fontSize: '0.9rem' }}>🕐 {doctor.timing}</p>
          <p style={{ margin: '4px 0', color: '#5f5e5a', fontSize: '0.9rem' }}>💻 {doctor.mode}</p>
          <p style={{ margin: '4px 0', color: '#0F3D3E', fontSize: '0.9rem', fontWeight: 'bold' }}>
            Estimated wait: {getWaitMinutes(doctor)} min
          </p>
          <p style={{ margin: '10px 0 0', fontWeight: 'bold', color: '#0F3D3E', fontSize: '1.2rem' }}>
            ₹{doctor.fee} consultation fee
          </p>
        </div>

        {/* Urgency question */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#0F3D3E' }}>
            Is your condition serious or do you need immediate treatment?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleUrgency('yes')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: urgency === 'yes' ? '#D85A30' : '#f0f0e8',
                color: urgency === 'yes' ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Yes, urgent
            </button>
            <button
              onClick={() => handleUrgency('no')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: urgency === 'no' ? '#0F3D3E' : '#f0f0e8',
                color: urgency === 'no' ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              No, it can wait
            </button>
          </div>

          {urgency === 'yes' && suggestion && (
            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#fdf3e6',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#a5690c' }}>
                <strong>{suggestion.name}</strong> in the same department can see you sooner — estimated wait{' '}
                <strong>{getWaitMinutes(suggestion)} min</strong> vs {getWaitMinutes(doctor)} min with {doctor.name}.
              </p>
              <button
                onClick={() => navigate(`/doctor/${suggestion.id}`)}
                style={{
                  marginTop: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#0F3D3E',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                View {suggestion.name}'s profile instead
              </button>
            </div>
          )}

          {urgency === 'yes' && !suggestion && (
            <p style={{ marginTop: '14px', fontSize: '0.85rem', color: '#19765f' }}>
              {doctor.name} already has the shortest wait time in {doctor.dept}. Proceed with booking below.
            </p>
          )}

          {urgency === 'no' && (
            <p style={{ marginTop: '14px', fontSize: '0.85rem', color: '#5f5e5a' }}>
              No problem — you can continue booking {doctor.name}, or go back and browse other doctors.
            </p>
          )}
        </div>

        {/* Mode + booking */}
        {urgency && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#0F3D3E' }}>Consultation mode</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
              {['Online', 'Offline'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: mode === m ? 'none' : '1px solid #ccc',
                    backgroundColor: mode === m ? '#0F3D3E' : '#fff',
                    color: mode === m ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={handleBook}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#0F3D3E',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Book appointment • ₹{doctor.fee}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfileScreen;
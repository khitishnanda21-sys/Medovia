import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctors as mockDoctors, getWaitMinutes } from '../data/doctors';

const departments = ['All', ...new Set(mockDoctors.map((d) => d.dept))];

function FindDoctorsScreen() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredDoctors =
    selectedDept === 'All' ? mockDoctors : mockDoctors.filter((d) => d.dept === selectedDept);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#F5F3DF' }}>
      {/* Top bar */}
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
        <p style={{ margin: 0, fontWeight: 'bold' }}>Find Doctors</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Department filter chips */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: selectedDept === dept ? 'none' : '1px solid #ccc',
                backgroundColor: selectedDept === dept ? '#0F3D3E' : '#fff',
                color: selectedDept === dept ? '#fff' : '#4a4a45',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {dept}
              {dept !== 'All' && (
                <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                  ({mockDoctors.filter((d) => d.dept === dept).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <p style={{ color: '#5f5e5a', marginBottom: '16px', fontSize: '0.9rem' }}>
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </p>

        {/* Doctor cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/doctor/${doc.id}`)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '18px 20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: '#e7f2ef',
                    color: '#0F3D3E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}
                >
                  {doc.name.split(' ')[1]?.[0] || doc.name[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>{doc.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>
                    {doc.dept} • ⭐ {doc.rating}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#5f5e5a' }}>
                    🕐 {doc.timing} • {doc.mode}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#0F3D3E' }}>
                    Estimated wait: {getWaitMinutes(doc)} min
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E', fontSize: '1.1rem' }}>
                  ₹{doc.fee}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#5f5e5a' }}>consultation fee</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindDoctorsScreen;
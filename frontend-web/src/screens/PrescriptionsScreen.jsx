import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';

const mockPrescriptions = [
  {
    id: 1,
    doctorId: 3,
    date: '2 Sep 2026',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet, twice daily', duration: '5 days' },
      { name: 'Cetirizine 10mg', dosage: '1 tablet, at night', duration: '3 days' },
    ],
    notes: 'Take medicines after food. Follow up if fever persists beyond 3 days.',
  },
  {
    id: 2,
    doctorId: 4,
    date: '18 Aug 2026',
    medicines: [
      { name: 'Amoxicillin 250mg', dosage: '1 capsule, thrice daily', duration: '7 days' },
    ],
    notes: 'Complete the full course even if symptoms improve earlier.',
  },
  {
    id: 3,
    doctorId: 6,
    date: '5 Aug 2026',
    medicines: [
      { name: 'Atorvastatin 10mg', dosage: '1 tablet, at night', duration: '30 days' },
      { name: 'Aspirin 75mg', dosage: '1 tablet, morning', duration: '30 days' },
    ],
    notes: 'Recheck lipid profile after 1 month.',
  },
];

function PrescriptionsScreen() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownload = (rx) => {
    alert(
      `Downloading prescription PDF...\n\nThis will generate a real PDF once the backend (Java Spring Boot) is connected.`
    );
  };

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
        <p style={{ margin: 0, fontWeight: 'bold' }}>Prescriptions</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '700px', margin: '0 auto' }}>
        {mockPrescriptions.length === 0 && (
          <p style={{ color: '#5f5e5a', textAlign: 'center', marginTop: '40px' }}>
            No prescriptions yet.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mockPrescriptions.map((rx) => {
            const doctor = doctors.find((d) => d.id === rx.doctorId);
            const isExpanded = expandedId === rx.id;

            return (
              <div
                key={rx.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  onClick={() => toggleExpand(rx.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#e7f2ef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                      }}
                    >
                      📄
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>
                        {doctor ? doctor.name : 'Unknown doctor'}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>
                        {doctor?.dept} • {rx.date}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: '#0F3D3E', fontSize: '1rem' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <p style={{ margin: '0 0 10px', fontWeight: 'bold', fontSize: '0.85rem', color: '#0F3D3E' }}>
                      Medicines
                    </p>
                    {rx.medicines.map((med, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '10px 0',
                          borderBottom: i < rx.medicines.length - 1 ? '1px solid #f2f2f2' : 'none',
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
                          {med.name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#5f5e5a' }}>
                          {med.dosage} • {med.duration}
                        </p>
                      </div>
                    ))}

                    {rx.notes && (
                      <div style={{ marginTop: '12px' }}>
                        <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '0.85rem', color: '#0F3D3E' }}>
                          Doctor's notes
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#5f5e5a' }}>{rx.notes}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleDownload(rx)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '16px',
                        backgroundColor: '#0F3D3E',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      ⬇ Download PDF
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PrescriptionsScreen;
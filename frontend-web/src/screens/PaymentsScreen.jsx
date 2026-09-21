import { useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';
import dashboardBg from '../assets/medovia-dashboard-bg.png';

const mockTransactions = [
  { id: 'TXN10231', doctorId: 1, amount: 500, method: 'UPI - Google Pay', date: 'Today, 3:52 PM', status: 'Success' },
  { id: 'TXN10198', doctorId: 2, amount: 700, method: 'Card', date: 'Tomorrow (scheduled)', status: 'Pending' },
  { id: 'TXN10122', doctorId: 3, amount: 600, method: 'Net Banking - SBI', date: '2 Sep 2026', status: 'Success' },
  { id: 'TXN10054', doctorId: 4, amount: 400, method: 'UPI - PhonePe', date: '18 Aug 2026', status: 'Success' },
  { id: 'TXN09987', doctorId: 6, amount: 650, method: 'Card', date: '5 Aug 2026', status: 'Refunded' },
];

const statusColors = {
  Success: { bg: '#e7f8f2', color: '#19765f' },
  Pending: { bg: '#fdf3e6', color: '#a5690c' },
  Refunded: { bg: '#eef1fd', color: '#3a4fb0' },
};

function PaymentsScreen() {
  const navigate = useNavigate();

  const totalSpent = mockTransactions
    .filter((t) => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

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
        <p style={{ margin: 0, fontWeight: 'bold' }}>Payments</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '700px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#0F3D3E',
            borderRadius: '16px',
            padding: '22px 24px',
            marginBottom: '24px',
            color: '#fff',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Total spent</p>
          <h2 style={{ margin: '6px 0 0', fontSize: '2rem' }}>₹{totalSpent}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.75 }}>
            Across {mockTransactions.filter((t) => t.status === 'Success').length} successful consultations
          </p>
        </div>

        <p style={{ fontWeight: 'bold', color: '#0F3D3E', marginBottom: '12px' }}>Transaction history</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockTransactions.map((t) => {
            const doctor = doctors.find((d) => d.id === t.doctorId);
            const colors = statusColors[t.status];

            return (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>
                    {doctor ? doctor.name : 'Unknown doctor'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#5f5e5a' }}>
                    {t.method} • {t.date}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#aaa' }}>{t.id}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>₹{t.amount}</p>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      backgroundColor: colors.bg,
                      color: colors.color,
                    }}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PaymentsScreen;
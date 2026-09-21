import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { doctors } from '../data/doctors';
import dashboardBg from '../assets/medovia-dashboard-bg.png';

const upiApps = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'];

function PaymentScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'Online';

  const doctor = doctors.find((d) => d.id === Number(id));

  const [method, setMethod] = useState('card');
  const [selectedUpiApp, setSelectedUpiApp] = useState(upiApps[0]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('State Bank of India');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  if (!doctor) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Doctor not found.</p>
        <button onClick={() => navigate('/find-doctors')}>Back to search</button>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (method === 'card') {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Enter a valid 16-digit card number';
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) newErrors.cardExpiry = 'Use MM/YY format';
      if (!/^\d{3}$/.test(cardCvv)) newErrors.cardCvv = 'Enter a valid 3-digit CVV';
    } else if (method === 'upi') {
      if (!upiId.trim()) newErrors.upiId = 'Enter your UPI ID';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate(`/booking-confirmation/${doctor.id}?mode=${mode}`);
    }, 1500);
  };

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
          onClick={() => navigate(`/doctor/${doctor.id}`)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          ←
        </button>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Payment</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '18px 20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>{doctor.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>
            {doctor.dept} • {mode} consultation
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: '1px solid #eee',
            }}
          >
            <span style={{ color: '#5f5e5a' }}>Consultation fee</span>
            <span style={{ fontWeight: 'bold', color: '#0F3D3E' }}>₹{doctor.fee}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: '#f0f0e8',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px',
          }}
        >
          {[
            { key: 'card', label: 'Card' },
            { key: 'upi', label: 'UPI' },
            { key: 'netbanking', label: 'Net Banking' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMethod(m.key)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                backgroundColor: method === m.key ? '#0F3D3E' : 'transparent',
                color: method === m.key ? '#fff' : '#0F3D3E',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handlePay}
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          {method === 'card' && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: errors.cardNumber ? '1px solid #D85A30' : '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.cardNumber && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.cardNumber}</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: errors.cardExpiry ? '1px solid #D85A30' : '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                  />
                  {errors.cardExpiry && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.cardExpiry}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: errors.cardCvv ? '1px solid #D85A30' : '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                  />
                  {errors.cardCvv && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.cardCvv}</p>}
                </div>
              </div>
            </>
          )}

          {method === 'upi' && (
            <>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {upiApps.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '999px',
                      border: selectedUpiApp === app ? 'none' : '1px solid #ccc',
                      backgroundColor: selectedUpiApp === app ? '#0F3D3E' : '#fff',
                      color: selectedUpiApp === app ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    {app}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.upiId ? '1px solid #D85A30' : '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
              {errors.upiId && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.upiId}</p>}
            </>
          )}

          {method === 'netbanking' && (
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            >
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Punjab National Bank</option>
            </select>
          )}

          <button
            type="submit"
            disabled={processing}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#0F3D3E',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              marginTop: '20px',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1,
            }}
          >
            {processing ? 'Processing payment...' : `Pay ₹${doctor.fee}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentScreen;
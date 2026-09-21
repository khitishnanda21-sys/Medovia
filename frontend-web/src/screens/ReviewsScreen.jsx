import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doctors } from '../data/doctors';

// Helper: days between two dates
function daysAgo(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

const initialReviews = [
  { id: 1, doctorId: 1, patient: 'Anita S.', rating: 5, comment: 'Very thorough and patient. Explained everything clearly.', date: daysISO(2) },
  { id: 2, doctorId: 1, patient: 'Rahul K.', rating: 4, comment: 'Good consultation, slightly long wait time.', date: daysISO(5) },
  { id: 3, doctorId: 1, patient: 'Meena P.', rating: 5, comment: 'Excellent doctor, highly recommend.', date: daysISO(10) }, // expired (>7 days)
  { id: 4, doctorId: 3, patient: 'Vikas T.', rating: 4, comment: 'Professional and quick.', date: daysISO(1) },
];

function daysISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function ReviewsScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = Number(searchParams.get('doctorId')) || doctors[0].id;
  const doctor = doctors.find((d) => d.id === doctorId);

  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const doctorReviews = reviews.filter((r) => r.doctorId === doctorId);
  const activeReviews = doctorReviews.filter((r) => daysAgo(r.date) <= 7);
  const expiredReviews = doctorReviews.filter((r) => daysAgo(r.date) > 7);

  const avgRating =
    activeReviews.length > 0
      ? (activeReviews.reduce((sum, r) => sum + r.rating, 0) / activeReviews.length).toFixed(1)
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      id: Date.now(),
      doctorId,
      patient: 'You',
      rating,
      comment,
      date: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setRating(0);
    setComment('');
  };

  if (!doctor) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Doctor not found.</p>
        <button onClick={() => navigate('/dashboard')}>Back to dashboard</button>
      </div>
    );
  }

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
        >
          ←
        </button>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Reviews</p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Doctor summary */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E', fontSize: '1.1rem' }}>{doctor.name}</p>
          <p style={{ margin: '2px 0 10px', fontSize: '0.85rem', color: '#5f5e5a' }}>{doctor.dept}</p>
          <p style={{ margin: 0, fontSize: '1.3rem', color: '#0F3D3E' }}>
            ⭐ {avgRating ?? '—'}{' '}
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a', fontWeight: 'normal' }}>
              ({activeReviews.length} rating{activeReviews.length !== 1 ? 's' : ''} this week)
            </span>
          </p>
        </div>

        {/* Rating form */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: '0 0 12px', fontWeight: 'bold', color: '#0F3D3E' }}>Rate your consultation</p>

          {submitted ? (
            <p style={{ color: '#19765f', fontSize: '0.9rem' }}>
              Thanks for your feedback! Your review is valid for 7 days and will count toward this doctor's rating.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: star <= (hoverRating || rating) ? '#f5b301' : '#e0e0d5',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '14px',
                }}
              />

              <button
                type="submit"
                disabled={rating === 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0F3D3E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: rating === 0 ? 'not-allowed' : 'pointer',
                  opacity: rating === 0 ? 0.5 : 1,
                }}
              >
                Submit review
              </button>
            </form>
          )}
        </div>

        {/* Active reviews */}
        {activeReviews.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', color: '#0F3D3E', marginBottom: '10px' }}>Recent reviews</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeReviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>{r.patient}</p>
                    <span style={{ color: '#f5b301', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && (
                    <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#5f5e5a' }}>{r.comment}</p>
                  )}
                  <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#aaa' }}>
                    {daysAgo(r.date) === 0 ? 'Today' : `${daysAgo(r.date)} day${daysAgo(r.date) > 1 ? 's' : ''} ago`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expired reviews note */}
        {expiredReviews.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
            {expiredReviews.length} older review{expiredReviews.length > 1 ? 's' : ''} expired after 7 days and no longer count toward the rating.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReviewsScreen;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import dashboardBg from '../assets/medovia-dashboard-bg.png';

const avatarOptions = ['🧑', '👩', '👨', '🧑‍⚕️', '👩‍⚕️', '👨‍⚕️', '🧕', '👳', '👴', '👵'];

function ProfileScreen() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const displayName = currentUser?.email ? currentUser.email.split('@')[0] : 'User';
  const avatarLetter = displayName[0]?.toUpperCase() || 'U';
  const createdAt = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      const docRef = doc(db, 'profiles', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setGender(data.gender || '');
        setAvatarEmoji(data.avatarEmoji || null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleAvatarSelect = async (emoji) => {
    setAvatarEmoji(emoji);
    setShowAvatarPicker(false);
    try {
      await setDoc(
        doc(db, 'profiles', currentUser.uid),
        { avatarEmoji: emoji, email: currentUser.email, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(
        doc(db, 'profiles', currentUser.uid),
        {
          phone,
          address,
          gender,
          email: currentUser.email,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSaved(true);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: '#0F3D3E',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
            aria-label="Back to dashboard"
          >
            ←
          </button>
          <p style={{ margin: 0, fontWeight: 'bold' }}>My Profile</p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '32px 24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#e7f2ef',
                color: '#0F3D3E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: avatarEmoji ? '2.4rem' : '2rem',
                fontWeight: 'bold',
                margin: '0 auto 16px',
                cursor: 'pointer',
              }}
            >
              {avatarEmoji || avatarLetter}
            </div>
            <div
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              style={{
                position: 'absolute',
                bottom: '28px',
                right: '-4px',
                backgroundColor: '#0F3D3E',
                color: '#fff',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                border: '2px solid #fff',
                cursor: 'pointer',
              }}
            >
              ✏️
            </div>
          </div>

          {showAvatarPicker && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f9f8ee',
                borderRadius: '12px',
              }}
            >
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAvatarSelect(emoji)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: avatarEmoji === emoji ? '2px solid #0F3D3E' : '1px solid #ddd',
                    backgroundColor: '#fff',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <h2 style={{ margin: 0, color: '#0F3D3E' }}>{displayName}</h2>
          <p style={{ margin: '4px 0 0', color: '#5f5e5a', fontSize: '0.9rem' }}>
            {currentUser?.email || 'No email'}
          </p>
          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: '0.75rem' }}>
            Member since {createdAt}
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#0F3D3E' }}>Personal details</p>
            {!editing && !loading && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0F3D3E',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Edit
              </button>
            )}
          </div>

          {loading ? (
            <p style={{ color: '#5f5e5a', fontSize: '0.85rem' }}>Loading...</p>
          ) : editing ? (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: '#5f5e5a', display: 'block', marginBottom: '4px' }}>
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: '#5f5e5a', display: 'block', marginBottom: '4px' }}>
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: '#5f5e5a', display: 'block', marginBottom: '4px' }}>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '11px',
                    backgroundColor: '#0F3D3E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    backgroundColor: '#f0f0e8',
                    color: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {saved && (
                <p style={{ color: '#19765f', fontSize: '0.8rem', marginBottom: '10px' }}>
                  Profile updated successfully.
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f2f2f2' }}>
                <span style={{ color: '#5f5e5a', fontSize: '0.85rem' }}>Phone</span>
                <span style={{ color: '#333', fontSize: '0.85rem', fontWeight: 'bold' }}>{phone || 'Not added'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f2f2f2' }}>
                <span style={{ color: '#5f5e5a', fontSize: '0.85rem' }}>Address</span>
                <span style={{ color: '#333', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'right', maxWidth: '65%' }}>
                  {address || 'Not added'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0' }}>
                <span style={{ color: '#5f5e5a', fontSize: '0.85rem' }}>Gender</span>
                <span style={{ color: '#333', fontSize: '0.85rem', fontWeight: 'bold' }}>{gender || 'Not added'}</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => navigate('/forgot-password')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'transparent',
            color: '#0F3D3E',
            border: '2px solid #0F3D3E',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
        >
          Change password
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#D85A30',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen;
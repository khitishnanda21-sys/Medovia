import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import logo from '../assets/medovia-icon.png';

function RegisterScreen() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [consultationFee, setConsultationFee] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'doctor') {
      if (!department.trim()) newErrors.department = 'Department is required';
      if (!specialization.trim()) newErrors.specialization = 'Specialization is required';
      if (!clinicAddress.trim()) newErrors.clinicAddress = 'Clinic address is required';
      if (!consultationFee.trim()) newErrors.consultationFee = 'Consultation fee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered.' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak.' });
      } else {
        setErrors({ email: 'Something went wrong. Please try again.' });
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #F5F3DF 0%, #E8E4C9 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '32px 24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="Medovia" style={{ width: '80px', marginBottom: '12px' }} />
        <h2 style={{ color: '#0F3D3E', marginBottom: '4px' }}>Create your account</h2>
        <p style={{ color: '#5f5e5a', fontSize: '0.9rem', marginBottom: '20px' }}>
          Join Medovia to get started
        </p>

        {/* Role toggle */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            backgroundColor: '#f0f0e8',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('patient')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'patient' ? '#0F3D3E' : 'transparent',
              color: role === 'patient' ? '#fff' : '#0F3D3E',
            }}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'doctor' ? '#0F3D3E' : 'transparent',
              color: role === 'doctor' ? '#fff' : '#0F3D3E',
            }}
          >
            Doctor
          </button>
        </div>

        {/* Profile photo upload */}
        <label htmlFor="photo-upload" style={{ cursor: 'pointer', marginBottom: '16px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#f0f0e8',
              border: '2px dashed #0F3D3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontSize: '0.75rem',
              color: '#0F3D3E',
              textAlign: 'center',
            }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              'Add photo'
            )}
          </div>
        </label>
        <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />

        {/* Name */}
        <div style={{ width: '100%', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: errors.name ? '1px solid #D85A30' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          {errors.name && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div style={{ width: '100%', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: errors.email ? '1px solid #D85A30' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          {errors.email && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ width: '100%', marginBottom: '12px', position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '48px',
              borderRadius: '10px',
              border: errors.password ? '1px solid #D85A30' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: '#0F3D3E',
              userSelect: 'none',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {errors.password && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div style={{ width: '100%', marginBottom: '12px', position: 'relative' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '48px',
              borderRadius: '10px',
              border: errors.confirmPassword ? '1px solid #D85A30' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: '#0F3D3E',
              userSelect: 'none',
            }}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </span>
          {errors.confirmPassword && (
            <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.confirmPassword}</p>
          )}
        </div>

        {role === 'doctor' && (
          <>
            <div style={{ width: '100%', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Department (e.g. Oncology, Pediatrics)"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.department ? '1px solid #D85A30' : '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
              {errors.department && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.department}</p>}
            </div>

            <div style={{ width: '100%', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.specialization ? '1px solid #D85A30' : '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
              {errors.specialization && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.specialization}</p>}
            </div>

            <div style={{ width: '100%', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Clinic address"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.clinicAddress ? '1px solid #D85A30' : '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
              {errors.clinicAddress && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.clinicAddress}</p>}
            </div>

            <div style={{ width: '100%', marginBottom: '12px' }}>
              <input
                type="number"
                placeholder="Consultation fee (₹)"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.consultationFee ? '1px solid #D85A30' : '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
              {errors.consultationFee && <p style={{ color: '#D85A30', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.consultationFee}</p>}
            </div>
          </>
        )}

        {success && (
          <p style={{ color: '#3B6D11', fontSize: '0.85rem', marginBottom: '8px', textAlign: 'center' }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#0F3D3E',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            marginTop: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
          <span style={{ padding: '0 12px', color: '#999', fontSize: '0.8rem' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '16px' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#333',
            }}
          >
            <FcGoogle size={18} /> Google
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#1877F2',
            }}
          >
            <FaFacebook size={18} /> Facebook
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#000',
            }}
          >
            <FaApple size={18} /> Apple
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0F3D3E',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default RegisterScreen;
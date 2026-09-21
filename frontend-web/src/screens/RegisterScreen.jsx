import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import logo from '../assets/medovia-icon.png';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5.mp4';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

function RegisterScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [consultationFee, setConsultationFee] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

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
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'profiles', userCred.user.uid), {
        name,
        email,
        role,
        ...(role === 'doctor' && { department, specialization, clinicAddress, consultationFee }),
        createdAt: new Date().toISOString(),
      });
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
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center lg:justify-end px-6 lg:pr-20 py-10">
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-10 rounded-full flex items-center justify-center overflow-hidden"
        style={{ width: 'clamp(60px, 8vw, 84px)', height: 'clamp(60px, 8vw, 84px)', background: '#ffffff', boxShadow: '0 12px 24px rgba(0,0,0,0.25)' }}
      >
        <img src={logo} alt="Medovia" style={{ width: '82%', height: '82%', objectFit: 'contain' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-6 left-6 lg:top-10 lg:left-10 z-10 max-w-xs"
      >
        <span className="inline-flex items-center h-8 px-4 rounded-full text-white text-xs mb-3" style={{ background: 'rgba(15,61,62,0.55)', backdropFilter: 'blur(6px)' }}>
          Patient-Doctor Connect
        </span>
        <h2 className="text-white font-bold leading-[1.05] tracking-tight text-2xl lg:text-3xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.35)', fontFamily: "'Playfair Display', serif" }}>
          Join Medovia,<br />Today
        </h2>
      </motion.div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center my-10 lg:my-0">
        <motion.form
          onSubmit={handleSubmit}
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full rounded-3xl p-8 flex flex-col items-center max-h-[85vh] overflow-y-auto scrollbar-hide"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', boxShadow: '1px 10px 30px rgba(10,14,20,0.14)' }}
        >
          <motion.p variants={item} className="text-gray-500 text-sm mb-5 text-center">
            <b className="text-[#0F3D3E]">Create an account</b> to get started.
          </motion.p>

          <motion.div variants={item} className="flex w-full bg-[#f0f0e8] rounded-xl p-1 mb-5">
            <button type="button" onClick={() => setRole('patient')} className={`flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer ${role === 'patient' ? 'bg-[#0F3D3E] text-white' : 'text-[#0F3D3E]'}`}>
              Patient
            </button>
            <button type="button" onClick={() => setRole('doctor')} className={`flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer ${role === 'doctor' ? 'bg-[#0F3D3E] text-white' : 'text-[#0F3D3E]'}`}>
              Doctor
            </button>
          </motion.div>

          <motion.div variants={item} className="mb-4">
            <label htmlFor="photo-upload" className="cursor-pointer relative block">
              <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-[#0F3D3E]/40 bg-[#f5f3ec]">
                {photoPreview ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" /> : <FiCamera size={22} className="text-[#0F3D3E]/60" />}
              </div>
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </motion.div>

          <motion.div variants={item} className="w-full mb-3">
            <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${errors.name ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </motion.div>

          <motion.div variants={item} className="w-full mb-3">
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${errors.email ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </motion.div>

          <motion.div variants={item} className="w-full mb-3 relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full p-3 pr-12 rounded-xl border-2 text-sm outline-none bg-white ${errors.password ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F3D3E] cursor-pointer select-none">
              {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </span>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </motion.div>

          <motion.div variants={item} className="w-full mb-2 relative">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full p-3 pr-12 rounded-xl border-2 text-sm outline-none bg-white ${errors.confirmPassword ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F3D3E] cursor-pointer select-none">
              {showConfirmPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </span>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </motion.div>

          {role === 'doctor' && (
            <>
              <motion.div variants={item} className="w-full mb-3">
                <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${errors.department ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </motion.div>
              <motion.div variants={item} className="w-full mb-3">
                <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${errors.specialization ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
                {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
              </motion.div>
              <motion.div variants={item} className="w-full mb-3">
                <input type="text" placeholder="Clinic address" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${errors.clinicAddress ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
                {errors.clinicAddress && <p className="text-red-500 text-xs mt-1">{errors.clinicAddress}</p>}
              </motion.div>
              <motion.div variants={item} className="w-full mb-2">
                <input type="number" placeholder="Consultation fee (₹)" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${errors.consultationFee ? 'border-red-400' : 'border-[#0F3D3E]/25'}`} />
                {errors.consultationFee && <p className="text-red-500 text-xs mt-1">{errors.consultationFee}</p>}
              </motion.div>
            </>
          )}

          {success && <motion.p variants={item} className="text-green-600 text-xs mb-2 text-center">{success}</motion.p>}

          <motion.button
            variants={item}
            type="submit"
            disabled={loading}
            whileHover={{ filter: loading ? 'none' : 'brightness(1.12)' }}
            whileTap={{ y: loading ? 0 : 1 }}
            className="w-full py-3.5 mt-2 rounded-full font-medium text-white text-sm cursor-pointer"
            style={{ background: loading ? 'linear-gradient(180deg,#0F3D3Eaa 0%,#175B5Caa 100%)' : 'linear-gradient(180deg,#0F3D3E 0%,#175B5C 100%)', boxShadow: '0 8px 20px rgba(15,61,62,0.25)' }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </motion.button>

          <motion.div variants={item} className="flex items-center w-full my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </motion.div>

          <motion.div variants={item} className="flex gap-2.5 w-full mb-4">
            <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs cursor-pointer">
              <FcGoogle size={16} /> Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs cursor-pointer" style={{ color: '#1877F2' }}>
              <FaFacebook size={16} /> Facebook
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs cursor-pointer text-black">
              <FaApple size={16} /> Apple
            </button>
          </motion.div>

          <motion.p variants={item} className="text-gray-500 text-xs text-center">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-[#0F3D3E] font-semibold underline underline-offset-2 cursor-pointer">
              Login
            </span>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}

export default RegisterScreen;
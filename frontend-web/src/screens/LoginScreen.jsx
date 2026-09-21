import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import logo from '../assets/medovia-icon.png';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5.mp4';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } };

function LoginScreen() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const languages = ['English', 'Hindi', 'Spanish', 'French'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    let valid = true;
    if (!id.trim()) { setIdError('Email is required'); valid = false; } else setIdError('');
    if (!password.trim()) { setPasswordError('Password is required'); valid = false; } else setPasswordError('');
    if (!valid) return;

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, id, password);
      const profileSnap = await getDoc(doc(db, 'profiles', userCred.user.uid));
      const role = profileSnap.exists() ? profileSnap.data().role : 'patient';
      setLoading(false);
      navigate(role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    } catch (error) {
      setLoading(false);
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center lg:justify-end px-6 lg:pr-20 py-10">
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs cursor-pointer"
          style={{ background: 'rgba(15,61,62,0.55)', backdropFilter: 'blur(8px)' }}
        >
          <FiGlobe size={13} />
          {language}
          <FiChevronDown size={11} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
        </button>

        {langOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-28 rounded-lg overflow-hidden"
            style={{ background: 'rgba(15,61,62,0.9)', backdropFilter: 'blur(10px)' }}
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setLangOpen(false); }}
                className="w-full text-left px-3 py-2 text-white text-xs hover:bg-white/10 cursor-pointer"
              >
                {lang}
              </button>
            ))}
          </motion.div>
        )}
      </div>

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
          Care That<br />Comes to You
        </h2>
      </motion.div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <motion.form
          onSubmit={handleLogin}
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full rounded-3xl p-8 flex flex-col items-center"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', boxShadow: '1px 10px 30px rgba(10,14,20,0.14)' }}
        >
          <motion.p variants={item} className="text-gray-500 text-sm mb-6 text-center mt-1">
            <b className="text-[#0F3D3E]">Log in</b> to continue your care journey.
          </motion.p>

          <motion.div variants={item} className="w-full mb-3">
            <input
              type="email"
              placeholder="Email address"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={`w-full p-3 rounded-xl border-2 text-sm outline-none bg-white ${idError ? 'border-red-400' : 'border-[#0F3D3E]/25'}`}
            />
            {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
          </motion.div>

          <motion.div variants={item} className="w-full mb-2 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pr-12 rounded-xl border-2 text-sm outline-none bg-white ${passwordError ? 'border-red-400' : 'border-[#0F3D3E]/25'}`}
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F3D3E] cursor-pointer select-none">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </motion.div>

          {loginError && <motion.p variants={item} className="text-red-500 text-xs mb-2 text-center">{loginError}</motion.p>}

          <motion.button
            variants={item}
            type="submit"
            disabled={loading}
            whileHover={{ filter: loading ? 'none' : 'brightness(1.12)' }}
            whileTap={{ y: loading ? 0 : 1 }}
            className="w-full py-3.5 mt-2 rounded-full font-medium text-white text-sm cursor-pointer"
            style={{ background: loading ? 'linear-gradient(180deg,#0F3D3Eaa 0%,#175B5Caa 100%)' : 'linear-gradient(180deg,#0F3D3E 0%,#175B5C 100%)', boxShadow: '0 8px 20px rgba(15,61,62,0.25)' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          <motion.button variants={item} type="button" onClick={() => navigate('/forgot-password')} className="text-gray-500 text-xs underline mt-3 cursor-pointer hover:opacity-70">
            Forgot password?
          </motion.button>

          <motion.p variants={item} className="text-gray-500 text-xs mt-5 text-center">
            Don't have an account?{' '}
            <span onClick={() => navigate('/register')} className="text-[#0F3D3E] font-semibold underline underline-offset-2 cursor-pointer">
              Register
            </span>
          </motion.p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-4 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          <p className="text-white text-xs text-center" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
            Your Health, Our Priority
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginScreen;
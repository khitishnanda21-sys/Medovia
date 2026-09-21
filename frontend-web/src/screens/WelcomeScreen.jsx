import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import logo from '../assets/medovia-icon.png';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_030633_1712fc71-4979-4e14-98f9-9f95702ab3da.mp4';

function useTypewriter(text, speed = 42, startDelay = 400) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useState(() => {
    let index = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(startTimeout);
  }, []);

  return { displayed, done };
}

function WelcomeScreen() {
  const navigate = useNavigate();
  const { displayed, done } = useTypewriter('Welcome to Medovia');

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center px-6">
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/25" />

      {/* Logo badge */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 lg:top-8 lg:left-8 z-10 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: 'clamp(56px, 8vw, 76px)',
          height: 'clamp(56px, 8vw, 76px)',
          background: '#ffffff00',
          boxShadow: '0 12px 24px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.15)',
        }}
      >
        <img src={logo} alt="Medovia" style={{ width: '150%', height: '150%', objectFit: 'contain' }} />
      </motion.div>

      {/* Glass circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center text-center rounded-full"
        style={{
          width: 'min(340px, 82vw)',
          height: 'min(340px, 82vw)',
          background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.12) 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.35), inset 0 6px 18px rgba(255,255,255,0.5), inset 0 -14px 30px rgba(0,0,0,0.1)',
          padding: 'min(28px, 6vw)',
        }}
      >
        <h1 className="font-semibold tracking-tight mb-1 text-white" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', minHeight: '1.6rem' }}>
          {displayed}
          {!done && <span className="animate-blink inline-block w-[2px] h-[1em] bg-white align-middle ml-[2px]" />}
        </h1>
        <p className="text-white/85 mb-5 text-sm">"Your health, connected."</p>

        <motion.button
          onClick={() => navigate('/login')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-4/5 max-w-[240px] py-3 rounded-full font-semibold mb-3 cursor-pointer text-white text-base shadow-md"
          style={{ background: 'linear-gradient(180deg,#0F3D3E 0%,#175B5C 100%)' }}
        >
          Login
        </motion.button>

        <motion.button
          onClick={() => navigate('/register')}
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.12)' }}
          whileTap={{ scale: 0.97 }}
          className="w-4/5 max-w-[240px] py-3 rounded-full font-semibold cursor-pointer text-white border-2 border-white text-base"
        >
          Register
        </motion.button>

        <button
          onClick={() => navigate('/forgot-password')}
          className="mt-3 text-white/80 text-xs underline cursor-pointer hover:opacity-70 transition-opacity"
        >
          Forgot password?
        </button>
      </motion.div>
    </div>
  );
}

export default WelcomeScreen;
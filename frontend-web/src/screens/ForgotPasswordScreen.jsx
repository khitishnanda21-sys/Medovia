import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_030633_1712fc71-4979-4e14-98f9-9f95702ab3da.mp4';

function ForgotPasswordScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center px-6">
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xs rounded-2xl p-6 flex flex-col items-center"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          boxShadow: '1px 10px 30px rgba(10,14,20,0.14)',
        }}
      >
        <h1 className="text-[#0F3D3E] text-base font-semibold mb-2 text-center">
          Reset your password
        </h1>
        <p className="text-gray-500 text-xs mb-4 text-center">
          Enter your registered email and we'll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-2.5 text-sm rounded-lg border border-[#0F3D3E]/25 bg-white mb-3 text-[#0F3D3E] outline-none"
        />

        <button
          className="w-full py-2.5 text-sm rounded-lg font-semibold text-white mb-3 cursor-pointer"
          style={{ background: 'linear-gradient(180deg,#0F3D3E 0%,#175B5C 100%)' }}
        >
          Send reset link
        </button>

        <button
          onClick={() => navigate('/welcome')}
          className="text-gray-500 text-xs underline cursor-pointer hover:opacity-70 transition-opacity"
        >
          Back to login
        </button>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordScreen;
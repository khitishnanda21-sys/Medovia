import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/medovia-icon.png';
import wordmark from '../assets/medovia-wordmark.png';

import activity from '../assets/animations/activity.gif';
import ambulance from '../assets/animations/ambulance.gif';
import handbag from '../assets/animations/handbag.gif';
import handpill from '../assets/animations/handpill.gif';
import heartpulse from '../assets/animations/heartpulse.gif';
import pill from '../assets/animations/pill.gif';
import stethoscope from '../assets/animations/stethoscope.gif';
import supplement from '../assets/animations/supplement.gif';
import syringe from '../assets/animations/syringe.gif';
import treatment from '../assets/animations/treatment.gif';

const icons = [
  { src: stethoscope, top: '6%', left: '8%', size: 60 },
  { src: syringe, top: '10%', left: '78%', size: 55 },
  { src: heartpulse, top: '4%', left: '45%', size: 50 },
  { src: pill, top: '30%', left: '5%', size: 45 },
  { src: ambulance, top: '35%', left: '85%', size: 55 },
  { src: handpill, top: '65%', left: '10%', size: 50 },
  { src: treatment, top: '70%', left: '80%', size: 55 },
  { src: supplement, top: '85%', left: '30%', size: 45 },
  { src: activity, top: '88%', left: '65%', size: 50 },
  { src: handbag, top: '50%', left: '92%', size: 45 },
];

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #F5F3DF 0%, #E8E4C9 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icons.map((icon, i) => (
        <img
          key={i}
          src={icon.src}
          alt=""
          style={{
            position: 'absolute',
            top: icon.top,
            left: icon.left,
            width: `${icon.size}px`,
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
      ))}

            <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.img
          src={logo}
          alt="Medovia icon"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            width: '220px',
            maxWidth: '60vw',
          }}
        />
        <motion.img
          src={wordmark}
          alt="Medovia"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          style={{
            width: '200px',
            maxWidth: '55vw',
            marginTop: '-10px',
          }}
        />
      </div>
    </div>
  );
}

export default SplashScreen;
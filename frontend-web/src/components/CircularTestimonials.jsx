import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 40;
  const maxGap = 64;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  const colorName = colors.name ?? '#0F3D3E';
  const colorDesignation = colors.designation ?? '#6b7280';
  const colorTestimony = colors.testimony ?? '#374151';
  const colorArrowBg = colors.arrowBackground ?? '#0F3D3E';
  const colorArrowFg = colors.arrowForeground ?? '#ffffff';
  const colorArrowHoverBg = colors.arrowHoverBackground ?? '#2EC4B6';
  const fontSizeName = fontSizes.name ?? '1.15rem';
  const fontSizeDesignation = fontSizes.designation ?? '0.8rem';
  const fontSizeQuote = fontSizes.quote ?? '0.95rem';

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);

  const imageContainerRef = useRef(null);
  const autoplayRef = useRef(null);

  const len = useMemo(() => testimonials.length, [testimonials]);
  const active = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (autoplay && len > 1) {
      autoplayRef.current = setInterval(() => setActiveIndex((p) => (p + 1) % len), 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, len]);

  const handleNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % len);
    clearInterval(autoplayRef.current);
  }, [len]);
  const handlePrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + len) % len);
    clearInterval(autoplayRef.current);
  }, [len]);

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const stickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + len) % len === index;
    const isRight = (activeIndex + 1) % len === index;

    if (isActive) {
      return { zIndex: 3, opacity: 1, pointerEvents: 'auto', transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    }
    if (isLeft) {
      return { zIndex: 2, opacity: 1, pointerEvents: 'auto', transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.82) rotateY(15deg)`, transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    }
    if (isRight) {
      return { zIndex: 2, opacity: 1, pointerEvents: 'auto', transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.82) rotateY(-15deg)`, transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    }
    return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
  }

  if (!testimonials.length) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        {/* Images */}
        <div className="relative w-full h-56 md:h-72" ref={imageContainerRef} style={{ perspective: '1000px' }}>
          {testimonials.map((t, index) => (
            <img
              key={t.src}
              src={t.src}
              alt={t.name}
              className="absolute w-full h-full object-cover rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.18)', ...getImageStyle(index) }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className="font-bold mb-1" style={{ color: colorName, fontSize: fontSizeName }}>
                {active.name}
              </h3>
              <p className="mb-4" style={{ color: colorDesignation, fontSize: fontSizeDesignation }}>
                {active.designation}
              </p>
              <p className="leading-relaxed" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                {active.quote.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 5 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut', delay: 0.02 * i }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 pt-6 md:pt-0">
            <button
              onClick={handlePrev}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
            >
              <FaArrowLeft size={14} color={colorArrowFg} />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next review"
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
            >
              <FaArrowRight size={14} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
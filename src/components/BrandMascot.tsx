import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles, RefreshCw, Lightbulb, Check } from 'lucide-react';

export default function BrandMascot() {
  const [mood, setMood] = useState<'confused' | 'thinking' | 'eureka'>('confused');
  const [bubbleText, setBubbleText] = useState<string>('Wait... how do I manage 20 different vendors?!');

  const triggerAnimationSequence = () => {
    // Phase 1: Confused
    setMood('confused');
    setBubbleText('Hmm... managing HR, IT support, facilities, legal, and rentals separately is costing a fortune... 😵');
    
    // Phase 2: Thinking (after 3.5 seconds)
    const thinkingTimer = setTimeout(() => {
      setMood('thinking');
      setBubbleText('There must be a single partner that aggregates and audits them all... 🧐');
    }, 4000);

    // Phase 3: Eureka! BusinessBridge! (after another 3.5 seconds)
    const eurekaTimer = setTimeout(() => {
      setMood('eureka');
      setBubbleText('Aha! BusinessBridge! One consolidated point of contact & SLA! 🎯💡');
    }, 7500);

    return { thinkingTimer, eurekaTimer };
  };

  useEffect(() => {
    const timers = triggerAnimationSequence();
    return () => {
      clearTimeout(timers.thinkingTimer);
      clearTimeout(timers.eurekaTimer);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[450px] mx-auto aspect-square flex flex-col items-center justify-center select-none pointer-events-auto">
      {/* Dynamic Ambient Background Aura */}
      <div className={`absolute w-72 h-72 rounded-full blur-[80px] transition-all duration-1000 -z-10 ${
        mood === 'confused' ? 'bg-amber-950/20' :
        mood === 'thinking' ? 'bg-blue-950/25' :
        'bg-[#c9a84c]/15 shadow-[0_0_100px_rgba(201,168,76,0.1)]'
      }`} />

      {/* Mascot Comic Speech Bubble */}
      <motion.div 
        key={bubbleText}
        initial={{ opacity: 0, y: 15, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.9 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`relative mb-6 px-5 py-3.5 rounded-2xl text-center text-xs leading-relaxed max-w-[280px] border font-sans font-light shadow-xl ${
          mood === 'confused' ? 'bg-amber-950/30 border-amber-500/20 text-amber-100' :
          mood === 'thinking' ? 'bg-blue-950/30 border-blue-400/20 text-blue-100' :
          'bg-gradient-to-r from-[#0d0a05] to-[#1a140a] border-[#e2c06a]/30 text-[#fcfbf9] font-medium shadow-[0_5px_20px_rgba(201,168,76,0.1)]'
        }`}
      >
        <span className="relative z-10">{bubbleText}</span>
        {/* Bubble Tail */}
        <div className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b ${
          mood === 'confused' ? 'bg-[#1a130f] border-amber-500/20' :
          mood === 'thinking' ? 'bg-[#101524] border-blue-400/20' :
          'bg-[#120f0a] border-[#e2c06a]/30'
        }`} />
      </motion.div>

      {/* Eureka Starburst Orbiting Ray */}
      <AnimatePresence>
        {mood === 'eureka' && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-8 w-44 h-44 -z-10 pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#c9a84c]/20 animate-spin-slow">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 40 * Math.cos((i * Math.PI) / 4)}
                  y2={50 + 40 * Math.sin((i * Math.PI) / 4)}
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Idea / Status Indicator Above Head */}
      <div className="h-16 flex items-center justify-center relative w-full">
        <AnimatePresence mode="wait">
          {mood === 'confused' && (
            <motion.div
              key="confused-indicators"
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.5 }}
              className="flex gap-2 text-amber-500"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              >
                <HelpCircle className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </motion.div>
              <motion.div
                animate={{ y: [-4, 2, -4] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                <HelpCircle className="w-4 h-4 text-amber-600 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
              </motion.div>
            </motion.div>
          )}

          {mood === 'thinking' && (
            <motion.div
              key="thinking-indicators"
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.5 }}
              className="flex gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                />
              ))}
            </motion.div>
          )}

          {mood === 'eureka' && (
            <motion.div
              key="eureka-indicators"
              initial={{ opacity: 0, y: 15, scale: 0.2 }}
              animate={{ opacity: 1, y: 0, scale: 1.15 }}
              exit={{ opacity: 0, y: -15, scale: 0.2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-gradient-to-b from-[#e2c06a] to-[#c9a84c] p-2.5 rounded-full shadow-[0_0_30px_rgba(201,168,76,0.7)] border border-yellow-300 flex items-center justify-center relative z-20"
                >
                  <Lightbulb className="w-7 h-7 text-[#030305]" />
                </motion.div>
                {/* Visual Glow rings */}
                <div className="absolute inset-x-0 top-0 w-12 h-12 rounded-full border border-[#c9a84c]/50 animate-ping opacity-75 -z-10" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-1 flex items-center gap-1 font-mono text-[9px] text-[#e2c06a] tracking-[0.15em] uppercase font-bold bg-[#141419]/90 px-2 py-0.5 rounded border border-[#c9a84c]/20 shadow"
              >
                <Sparkles className="w-2.5 h-2.5" />
                BusinessBridge !
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expressive 3D Mascot Character (Spherical Futuristic Bot) */}
      <motion.div
        animate={{
          y: mood === 'confused' ? [0, 4, 0] : mood === 'thinking' ? [0, 2, 0] : [0, -8, 0],
          rotate: mood === 'confused' ? [-1.5, 1.5, -1.5] : 0,
        }}
        transition={{
          repeat: Infinity,
          duration: mood === 'confused' ? 2 : mood === 'thinking' ? 3 : 1.5,
          ease: 'easeInOut',
        }}
        className="w-48 h-48 relative cursor-pointer group"
        onClick={() => triggerAnimationSequence()}
        title="Click to replay the mascot story sequence!"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
          <defs>
            {/* 3D Bodymetallic Spherical Shading Gradients */}
            <radialGradient id="bodyGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#2e2e38" />
              <stop offset="60%" stopColor="#141417" />
              <stop offset="100%" stopColor="#08080a" />
            </radialGradient>
            
            <radialGradient id="goldGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff3d1" />
              <stop offset="35%" stopColor="#e2c06a" />
              <stop offset="75%" stopColor="#c9a84c" />
              <stop offset="100%" stopColor="#544318" />
            </radialGradient>

            <radialGradient id="eyeShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="85%" stopColor="rgba(0,0,0,0.6)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
            </radialGradient>

            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121217" />
              <stop offset="100%" stopColor="#1f1f29" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Character Shadow Underneath */}
          <ellipse cx="100" cy="188" rx="55" ry="8" fill="rgba(0,0,0,0.5)" className="animate-pulse" />

          {/* Ears/Side Receivers */}
          <g>
            {/* Left Ear */}
            <rect x="34" y="85" width="12" height="30" rx="6" fill="#c9a84c" />
            <circle cx="40" cy="100" r="3" fill="#030305" />
            {/* Right Ear */}
            <rect x="154" y="85" width="12" height="30" rx="6" fill="#c9a84c" />
            <circle cx="160" cy="100" r="3" fill="#030305" />
          </g>

          {/* Golden Collar with "BB" Logo Crest */}
          <path d="M 60 148 Q 100 170 140 148 L 132 165 Q 100 185 68 165 Z" fill="url(#goldGrad)" stroke="#1a140a" strokeWidth="1" />
          <circle cx="100" cy="165" r="8" fill="#141419" stroke="#e2c06a" strokeWidth="0.75" />
          {/* Glowing dot in collar badge */}
          <circle cx="100" cy="165" r="2.5" fill={mood === 'eureka' ? '#e2c06a' : '#555'} />

          {/* Main Head Base Sphere */}
          <circle cx="100" cy="100" r="60" fill="url(#bodyGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Visor Screen Layer */}
          <rect x="52" y="70" width="96" height="46" rx="14" fill="url(#visorGrad)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <rect x="52" y="70" width="96" height="46" rx="14" fill="url(#eyeShadow)" opacity="0.8" />

          {/* --- EXPRESSIVE EYES (STATE-DRIVEN) --- */}
          <g>
            {mood === 'confused' && (
              <g id="eyes-confused">
                {/* Left Eye: Downward slanted, confused dial */}
                <ellipse cx="78" cy="92" rx="11" ry="5" fill="#f59e0b" transform="rotate(15 78 92)" />
                <path d="M 68 85 Q 78 80 88 84" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                
                {/* Right Eye: Curious circular/oval shape looking sideways */}
                <circle cx="122" cy="92" r="7" fill="#f59e0b" />
                <path d="M 112 82 Q 122 84 132 86" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                
                {/* Confused/Squiggly Mouth */}
                <path d="M 90 124 Q 100 114 110 124" stroke="#8a8278" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            )}

            {mood === 'thinking' && (
              <g id="eyes-thinking">
                {/* Left Eye: Narrowed, thinking slice */}
                <rect x="67" y="89" width="22" height="6" rx="3" fill="#3b82f6" transform="rotate(-10 78 92)" />
                <path d="M 67 82 L 87 85" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                
                {/* Right Eye: Narrowed thinking slice */}
                <rect x="111" y="89" width="22" height="6" rx="3" fill="#3b82f6" transform="rotate(10 122 92)" />
                <path d="M 111 85 L 131 82" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                {/* Flat, straight line pensive mouth */}
                <line x1="92" y1="122" x2="108" y2="122" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
              </g>
            )}

            {mood === 'eureka' && (
              <g id="eyes-eureka">
                {/* Left Eye: Excited star/sparkle or glowing rounded arch */}
                <ellipse cx="78" cy="91" rx="12" ry="12" fill="url(#goldGrad)" />
                <circle cx="78" cy="91" r="5" fill="#030305" />
                <path d="M 66 79 Q 78 72 90 79" stroke="#e2c06a" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                {/* Right Eye: Matching joyful circular sparkle */}
                <ellipse cx="122" cy="91" rx="12" ry="12" fill="url(#goldGrad)" />
                <circle cx="122" cy="91" r="5" fill="#030305" />
                <path d="M 110 79 Q 122 72 134 79" stroke="#e2c06a" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                {/* Joyful open smile mouth with white teeth and pink tongue */}
                <path d="M 88 118 Q 100 138 112 118 Z" fill="#b91c1c" stroke="#e2c06a" strokeWidth="1" />
                <path d="M 92 119 Q 100 127 108 119" fill="#fca5a5" />
              </g>
            )}
          </g>

          {/* Sparkle highlights on head */}
          <path d="M 144 65 Q 152 61 146 54 Q 156 59 164 57 Q 155 64 158 72 Q 150 67 144 65 Z" fill="rgba(255,255,255,0.08)" />
          <circle cx="65" cy="55" r="1.5" fill="rgba(255,255,255,0.15)" />
          <circle cx="135" cy="140" r="2.5" fill="rgba(255,255,255,0.05)" />
        </svg>

        {/* Mascot Glossy Highlights (Simulating high-end glassmorphism) */}
        <div className="absolute inset-0 rounded-full border border-white/[0.04] pointer-events-none" />
      </motion.div>

      {/* Manual Action Replay trigger action line */}
      <button
        onClick={() => triggerAnimationSequence()}
        className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] text-[#8a8278] hover:text-[#e2c06a] hover:bg-white/[0.06] hover:border-[#c9a84c]/30 uppercase font-mono tracking-wider transition-all duration-300"
      >
        <RefreshCw className="w-3 h-3" />
        Simulate Corporate Epiphany
      </button>
    </div>
  );
}

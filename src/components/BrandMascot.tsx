import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles, Lightbulb, Briefcase, FileText, CheckCircle2, ShieldCheck, TrendingDown } from 'lucide-react';

export default function BrandMascot() {
  const [mood, setMood] = useState<'walking' | 'confused' | 'thinking' | 'eureka'>('walking');
  const [bubbleText, setBubbleText] = useState<string>('Carrying 15 different bills... 🤖💼💦');
  const [isWalking, setIsWalking] = useState(true);

  // Ref to hold and clear timing routines
  const timersRef = useRef<{ 
    walkTimer?: NodeJS.Timeout; 
    thinkingTimer?: NodeJS.Timeout; 
    eurekaTimer?: NodeJS.Timeout;
    loopTimer?: NodeJS.Timeout;
  }>({});

  const startSequence = () => {
    // Clear active routines
    if (timersRef.current.walkTimer) clearTimeout(timersRef.current.walkTimer);
    if (timersRef.current.thinkingTimer) clearTimeout(timersRef.current.thinkingTimer);
    if (timersRef.current.eurekaTimer) clearTimeout(timersRef.current.eurekaTimer);
    if (timersRef.current.loopTimer) clearTimeout(timersRef.current.loopTimer);

    // Phase 0: Walking/Hauling
    setIsWalking(true);
    setMood('walking');
    setBubbleText('Carrying 15 different bills... 🤖💼💦');

    // Phase 1: Overwhelmed & Confused
    timersRef.current.walkTimer = setTimeout(() => {
      setIsWalking(false);
      setMood('confused');
      setBubbleText('15 invoices? 15 separate contracts? Overload! 😵🔌');

      // Phase 2: Thinking & Analyzing
      timersRef.current.thinkingTimer = setTimeout(() => {
        setMood('thinking');
        setBubbleText('Comparing national rates... 🧐⚙️');

        // Phase 3: Eureka! Optimized Solution
        timersRef.current.eurekaTimer = setTimeout(() => {
          setMood('eureka');
          setBubbleText('BusinessBridge active! 1 unified contract! 🎯✨');

          // Schedule automatic sequence replay (stays in Eureka mode for 30s)
          timersRef.current.loopTimer = setTimeout(() => {
            startSequence();
          }, 30000);
        }, 3200);
      }, 3200);
    }, 3200);
  };

  useEffect(() => {
    startSequence();
    return () => {
      if (timersRef.current.walkTimer) clearTimeout(timersRef.current.walkTimer);
      if (timersRef.current.thinkingTimer) clearTimeout(timersRef.current.thinkingTimer);
      if (timersRef.current.eurekaTimer) clearTimeout(timersRef.current.eurekaTimer);
      if (timersRef.current.loopTimer) clearTimeout(timersRef.current.loopTimer);
    };
  }, []);

  const handleMascotClick = () => {
    startSequence();
  };

  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col items-center justify-center relative select-none">
      
      {/* Mascot Dialog Comic Bubble */}
      <motion.div 
        key={bubbleText}
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ type: 'spring', damping: 18 }}
        className={`relative mb-4 px-5 py-3 rounded-2xl text-center text-xs leading-relaxed max-w-[280px] border font-sans shadow-2xl cursor-default select-none ${
          mood === 'walking' ? 'bg-[#141416]/95 border-zinc-700/40 text-zinc-200' :
          mood === 'confused' ? 'bg-[#1b120c]/95 border-amber-500/25 text-amber-100' :
          mood === 'thinking' ? 'bg-[#0f192b]/95 border-blue-500/25 text-blue-100' :
          'bg-gradient-to-r from-[#0d0a06] to-[#16120b] border-[#e2c06a]/40 text-[#fcfbf9] font-medium shadow-[0_6px_25px_rgba(201,168,76,0.25)]'
        }`}
      >
        <span className="relative z-10 font-bold tracking-wide">{bubbleText}</span>
        {/* Tail pointing down */}
        <div className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b ${
          mood === 'walking' ? 'bg-[#141416] border-zinc-700/40' :
          mood === 'confused' ? 'bg-[#1b120c] border-amber-500/25' :
          mood === 'thinking' ? 'bg-[#0f192b] border-blue-500/25' :
          'bg-[#120f0a] border-[#e2c06a]/40'
        }`} />
      </motion.div>

      {/* Floating Indicator Title Bubble */}
      <div className="h-10 flex items-center justify-center relative w-full mb-1">
        <AnimatePresence mode="wait">
          {mood === 'walking' && (
            <motion.div
              key="walking-ind"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950/80 border border-zinc-800/80 rounded-md text-[10px] sm:text-xs text-[#e2c06a] font-mono uppercase tracking-widest font-semibold"
            >
              <Briefcase className="w-3.5 h-3.5 animate-bounce text-[#e2c06a]" />
              <span>Hauling Partner Costs...</span>
            </motion.div>
          )}

          {mood === 'confused' && (
            <motion.div
              key="confused-ind"
              initial={{ opacity: 0, y: 6, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.7 }}
              className="flex gap-2 text-amber-400 items-center justify-center bg-zinc-950/80 border border-amber-500/20 px-3 py-1 rounded-md"
            >
              <HelpCircle className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span className="text-[10px] sm:text-xs font-mono uppercase text-amber-400 tracking-wider font-semibold">Vendor Chaos!</span>
            </motion.div>
          )}

          {mood === 'thinking' && (
            <motion.div
              key="thinking-ind"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 justify-center bg-zinc-950/80 border border-[#e2c06a]/25 px-3 py-1 rounded-md"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], backgroundColor: ['#e2c06a', '#ffd700', '#e2c06a'] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-mono uppercase text-[#e2c06a] tracking-wider font-semibold">Comparing National Rates...</span>
            </motion.div>
          )}

          {mood === 'eureka' && (
            <motion.div
              key="eureka-ind"
              initial={{ opacity: 0, y: 10, scale: 0.4 }}
              animate={{ opacity: 1, y: 0, scale: 1.05 }}
              exit={{ opacity: 0, y: -10, scale: 0.4 }}
              className="flex items-center gap-1.5 border border-[#e2c06a]/45 bg-zinc-950/95 px-3 py-1 rounded shadow-lg text-[#e2c06a]"
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest font-bold">BUSINESSBRIDGE ACTIVE</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/* WALKING MOTION WRAPPER: Makes the cute chubby bot bounce and float */}
        <motion.div
          animate={{
            x: isWalking ? [200, 0] : 0,
          }}
          transition={{
            duration: 3.2,
            ease: 'linear',
          }}
          onClick={handleMascotClick}
          className="w-52 h-52 relative cursor-pointer select-none active:scale-95 transition-transform"
          title="Tap the chubby bot to replay B2B Consolidation journey!"
        >
          {/* Dynamic cute waddling gait and body bobbing */}
          <motion.div
            animate={{
              y: mood === 'walking' ? [0, -12, 0, -12, 0, -12, 0, -12, 0] : [0, -4, 0],
              rotate: mood === 'walking' ? [-6, 6, -6, 6, -6, 6, -6, 6, -6] : [0, 1, -1, 0],
            }}
            transition={{
              repeat: mood === 'walking' ? 0 : Infinity,
              duration: mood === 'walking' ? 3.2 : 2.5,
              ease: 'easeInOut',
            }}
            className="w-full h-full relative"
          >
            {/* SPHERICAL CHUBBY "BRIDGEE" ROBOT */}
            <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]">
              <defs>
                {/* Sleek Polished Charcoal Dark Steel Spherical Gradient which blends seamlessly to site theme */}
                <radialGradient id="bodyGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#3d3d4b" />
                  <stop offset="30%" stopColor="#22222a" />
                  <stop offset="75%" stopColor="#101014" />
                  <stop offset="100%" stopColor="#050507" />
                </radialGradient>

                {/* Visor Screen Obsidian glass */}
                <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#08080d" />
                  <stop offset="100%" stopColor="#14141d" />
                </linearGradient>

                {/* Rosy blush cheeks */}
                <radialGradient id="blurBlush" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(226,192,106,0.35)" />
                  <stop offset="100%" stopColor="rgba(226,192,106,0)" />
                </radialGradient>

                {/* Shiny Gold details */}
                <linearGradient id="goldPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff6d9" />
                  <stop offset="40%" stopColor="#e2c06a" />
                  <stop offset="80%" stopColor="#bfa150" />
                  <stop offset="100%" stopColor="#876b29" />
                </linearGradient>

                {/* Simple floor drop shadow */}
                <radialGradient id="floorShad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.75)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>

              {/* Flat soft floor boundary shadow under tiny feet */}
              <ellipse cx="120" cy="225" rx="36" ry="6" fill="url(#floorShad)" />

              {/* --- SHORT WADLEY SHORT FEET (Dark gold outline contrast) --- */}
              <g id="short-waddling-feet">
                {/* Left foot */}
                <motion.ellipse
                  cx="95"
                  cy="210"
                  rx="15"
                  ry="8"
                  fill="#0c0c0e"
                  stroke="url(#goldPlateGrad)"
                  strokeWidth="1.5"
                  animate={mood === 'walking' ? {
                    y: [0, -6, 0, 0, 0],
                    cx: [95, 93, 95, 95, 95]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                />
                {/* Right foot */}
                <motion.ellipse
                  cx="145"
                  cy="210"
                  rx="15"
                  ry="8"
                  fill="#0c0c0e"
                  stroke="url(#goldPlateGrad)"
                  strokeWidth="1.5"
                  animate={mood === 'walking' ? {
                    y: [0, 0, 0, -6, 0],
                    cx: [145, 145, 145, 147, 145]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                />
              </g>

              {/* --- CHUBBY Main Body in dark metallic carbon --- */}
              <circle cx="120" cy="130" r="66" fill="url(#bodyGrad)" stroke="url(#goldPlateGrad)" strokeWidth="2.5" />

              {/* High-Gloss Highlight on upper curvature of body */}
              <path d="M 70 85 Q 120 62 170 85 Q 120 72 70 85 Z" fill="rgba(255, 255, 255, 0.12)" opacity="0.4" />

              {/* --- TOP ANTENNA WITH GLOWING LED BULB --- */}
              <line x1="120" y1="64" x2="120" y2="40" stroke="url(#goldPlateGrad)" strokeWidth="3" />
              <circle cx="120" cy="40" r="6.5" fill="url(#goldPlateGrad)" />
              <circle cx="120" cy="40" r="10" fill="#ffd700" opacity="0.25" className="animate-ping" style={{ transformOrigin: '120px 40px' }} />

              {/* Gold side terminal bolts */}
              <rect x="50" y="118" width="5" height="15" rx="2" fill="url(#goldPlateGrad)" />
              <rect x="185" y="118" width="5" height="15" rx="2" fill="url(#goldPlateGrad)" />

              {/* --- GLASSFACE VISOR --- */}
              <rect x="74" y="90" width="92" height="56" rx="28" fill="url(#visorGrad)" stroke="url(#goldPlateGrad)" strokeWidth="1.75" />
              
              {/* Glossy Visor Highlight Line */}
              <path d="M 82 104 Q 120 92 158 104" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* --- GLOWING NEON GOLDEN-YELLOW EXPRESSIONS FOR ABSOLUTE BEST VISIBILITY --- */}
              {mood === 'walking' && (
                <g id="visor-walk-eyes">
                  {/* Sweat droplet of cute effort */}
                  <path d="M 152 74 C 152 74, 155 80, 152 82 C 150 82, 150 78, 152 74 Z" fill="#3b82f6" />
                  
                  {/* High-contrast determined gold squint eyes */}
                  <path d="M 90 114 Q 97 109 104 114" stroke="#ffd700" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M 136 114 Q 143 109 150 114" stroke="#ffd700" strokeWidth="4" fill="none" strokeLinecap="round" />

                  {/* Cute micro gold dot mouth */}
                  <circle cx="120" cy="122" r="3.5" fill="#ffd700" />
                </g>
              )}

              {mood === 'confused' && (
                <g id="visor-confuse-eyes">
                  {/* Spiral dizzy neon gold LED eyes */}
                  <path d="M 91 114 Q 97 108 97 114 Q 97 118 93 118 Q 90 116 93 112" stroke="#ffd700" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 139 114 Q 145 108 145 114 Q 145 118 141 118 Q 138 116 141 112" stroke="#ffd700" strokeWidth="3" fill="none" strokeLinecap="round" />

                  {/* Shocked squiggly pixel gold mouth */}
                  <path d="M 112 126 L 116 123 L 120 126 L 124 123 L 128 126" stroke="#ffd700" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                </g>
              )}

              {mood === 'thinking' && (
                <g id="visor-think-eyes">
                  {/* Scanning bright gold visor state */}
                  <rect x="88" y="112" width="16" height="4.5" rx="2" fill="#ffd700" className="animate-pulse" />
                  <rect x="136" y="112" width="16" height="4.5" rx="2" fill="#ffd700" className="animate-pulse" />

                  {/* Processing sleek tech wave mouth coordinate */}
                  <path d="M 110 124 H 114 L 117 121 L 121 127 L 123 124 H 130" stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                </g>
              )}

              {mood === 'eureka' && (
                <g id="visor-eureka-eyes">
                  {/* Blushing warm cheeks */}
                  <circle cx="86" cy="128" r="8" fill="url(#blurBlush)" />
                  <circle cx="154" cy="128" r="8" fill="url(#blurBlush)" />

                  {/* Glittering bright golden star wink eyes */}
                  <path d="M 97 104 L 99 110 L 105 110 L 101 113 L 103 119 L 97 115 L 91 119 L 93 113 L 89 110 L 95 110 Z" fill="#ffd700" />
                  <path d="M 143 104 L 145 110 L 151 110 L 147 113 L 149 119 L 143 115 L 137 119 L 139 113 L 135 110 L 141 110 Z" fill="#ffd700" />

                  {/* Huge happy smiley face */}
                  <path d="M 112 121 Q 120 133 128 121 Z" fill="#f43f5e" stroke="#ffd700" strokeWidth="1.5" />
                  {/* Bright white baby tooth inside mouth */}
                  <rect x="117" y="121" width="6" height="2.5" fill="#fff" rx="0.5" />
                </g>
              )}

              {/* --- EXQUISITE GOLDEN COLLAR & BOW-TIE --- */}
              <path d="M 96 142 Q 120 154 144 142" stroke="url(#goldPlateGrad)" strokeWidth="3" fill="none" />
              <polygon points="112,142 120,148 128,142 124,152 116,152" fill="url(#goldPlateGrad)" stroke="#876b29" strokeWidth="0.75" />
              <circle cx="120" cy="148" r="2.5" fill="#ffffff" />

              {/* --- PREMIUM B2B GOLD BRIDGE TUMMY CREST --- */}
              <g id="bridge-tummy-crest">
                {/* Golden arched bridge path */}
                <path d="M 106 172 Q 120 160 134 172" stroke="url(#goldPlateGrad)" strokeWidth="3.25" fill="none" strokeLinecap="round" />
                <path d="M 101 181 Q 120 173 139 181" stroke="url(#goldPlateGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* Bridge columns */}
                <line x1="113" y1="171" x2="113" y2="179" stroke="url(#goldPlateGrad)" strokeWidth="1" />
                <line x1="120" y1="168" x2="120" y2="177" stroke="url(#goldPlateGrad)" strokeWidth="1" />
                <line x1="127" y1="171" x2="127" y2="179" stroke="url(#goldPlateGrad)" strokeWidth="1" />
              </g>

              {/* --- CHUBBY ARMS & STICK ACTIONS --- */}
              {/* Left little chubby arm holding small cute briefcase */}
              <g id="chubby-arm-left">
                <motion.ellipse
                  cx="50"
                  cy="142"
                  rx="10"
                  ry="10"
                  fill="#0c0c0e"
                  stroke="url(#goldPlateGrad)"
                  strokeWidth="1.25"
                  animate={mood === 'walking' ? {
                    y: [0, 4, -3, 0],
                    cx: [48, 52, 48, 48]
                  } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />

                {/* Little portfolio briefcase */}
                <motion.g
                  animate={mood === 'walking' ? {
                    y: [0, 3, -1, 0],
                    rotate: [1, -5, 3, 1]
                  } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {/* Poking files showing chaos */}
                  {(mood === 'walking' || mood === 'confused') && (
                    <g id="poking-paper-tabs" opacity="0.95">
                      <rect x="36" y="132" width="7" height="11" rx="0.5" fill="#f43f5e" transform="rotate(-15 36 132)" />
                      <rect x="42" y="130" width="8" height="12" rx="0.5" fill="#e2c06a" transform="rotate(8 42 130)" />
                    </g>
                  )}
                  {/* Leather portfolio envelope */}
                  <rect x="28" y="142" width="22" height="16" rx="2.5" fill="#2d1d13" stroke="#0c0704" strokeWidth="1" />
                  {/* Handle */}
                  <path d="M 35 142 V 138 H 43 V 142" fill="none" stroke="url(#goldPlateGrad)" strokeWidth="1.5" />
                  {/* Gold buckle lock */}
                  <rect x="38" y="148" width="4" height="4" rx="0.5" fill="url(#goldPlateGrad)" />
                </motion.g>
              </g>

              {/* Right little hand (Dynamic poses) */}
              <g id="chubby-arm-right">
                {mood === 'walking' && (
                  <motion.circle
                    cx="190"
                    cy="142"
                    r="10"
                    fill="#0c0c0e"
                    stroke="url(#goldPlateGrad)"
                    strokeWidth="1.25"
                    animate={{
                      y: [0, -4, 0],
                      cx: [190, 192, 190]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  />
                )}

                {mood === 'confused' && (
                  <path d="M 174 130 Q 186 112 168 100 Q 164 105 174 116" fill="#0c0c0e" stroke="url(#goldPlateGrad)" strokeWidth="1.25" />
                )}

                {mood === 'thinking' && (
                  <ellipse cx="178" cy="144" rx="9" ry="9" fill="#0c0c0e" stroke="url(#goldPlateGrad)" strokeWidth="1.25" />
                )}

                {mood === 'eureka' && (
                  <g>
                    <path d="M 174 125 Q 192 110 196 90 Q 188 88 178 112" fill="#0c0c0e" stroke="url(#goldPlateGrad)" strokeWidth="1.25" />
                    <path d="M 191 76 Q 196 72 201 76 Q 196 80 191 76" fill="#ffd700" className="animate-pulse" />
                    <circle cx="196" cy="76" r="4.5" fill="url(#goldPlateGrad)" />
                  </g>
                )}
              </g>

            </svg>

            {/* Spark bursts celebrate Eureka state */}
            <AnimatePresence>
              {mood === 'eureka' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <motion.div 
                    animate={{ y: [-15, -60], x: [-15, -35], opacity: [0, 1, 0], scale: [0.5, 1, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute top-10 left-12 w-3.5 h-3.5 text-[#e2c06a]"
                  >
                    <svg viewBox="0 0 100 100" fill="currentColor">
                      <path d="M 50 0 C 50 35, 35 50, 0 50 C 35 50, 50 65, 50 100 C 50 65, 65 50, 100 50 C 65 50, 50 35, 50 0 Z" />
                    </svg>
                  </motion.div>
                  <motion.div 
                    animate={{ y: [-8, -65], x: [15, 35], opacity: [0, 1, 0], scale: [0.4, 0.9, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                    className="absolute top-14 right-12 w-4 h-4 text-amber-400"
                  >
                    <svg viewBox="0 0 100 100" fill="currentColor">
                      <path d="M 50 0 C 50 35, 35 50, 0 50 C 35 50, 50 65, 50 100 C 50 65, 65 50, 100 50 C 65 50, 50 35, 50 0 Z" />
                    </svg>
                  </motion.div>
                  <motion.div 
                    animate={{ y: [-20, -55], x: [5, -5], opacity: [0, 1, 0], scale: [0.3, 0.8, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                    className="absolute top-8 left-24 w-3 h-3 text-[#fff2cb]"
                  >
                    <svg viewBox="0 0 100 100" fill="currentColor">
                      <path d="M 50 0 C 50 35, 35 50, 0 50 C 35 50, 50 65, 50 100 C 50 65, 65 50, 100 50 C 65 50, 50 35, 50 0 Z" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
    </div>
  );
}

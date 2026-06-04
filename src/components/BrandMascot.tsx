import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles, Lightbulb, Briefcase, FileText, CheckCircle2, ShieldCheck, TrendingDown } from 'lucide-react';

export default function BrandMascot() {
  const [mood, setMood] = useState<'walking' | 'confused' | 'thinking' | 'eureka'>('walking');
  const [bubbleText, setBubbleText] = useState<string>('Uff! Carrying 15 different bills is heavy! 🤖💼💦');
  const [isWalking, setIsWalking] = useState(true);

  // Ref to hold and clear timing routines
  const timersRef = useRef<{ walkTimer?: NodeJS.Timeout; thinkingTimer?: NodeJS.Timeout; eurekaTimer?: NodeJS.Timeout }>({});

  const startSequence = () => {
    // Clear active routines
    if (timersRef.current.walkTimer) clearTimeout(timersRef.current.walkTimer);
    if (timersRef.current.thinkingTimer) clearTimeout(timersRef.current.thinkingTimer);
    if (timersRef.current.eurekaTimer) clearTimeout(timersRef.current.eurekaTimer);

    // Phase 0: Walking/Hauling
    setIsWalking(true);
    setMood('walking');
    setBubbleText('Waddling with 15 different bills. This is heavy! 🤖💼💦');

    // Phase 1: Overwhelmed & Confused
    timersRef.current.walkTimer = setTimeout(() => {
      setIsWalking(false);
      setMood('confused');
      setBubbleText('Wait! 15 invoices with 15 SLAs overload! 😵🔌');

      // Phase 2: Thinking & Analyzing
      timersRef.current.thinkingTimer = setTimeout(() => {
        setMood('thinking');
        setBubbleText('Scanning Pune... Is there a single B2B bridge? 🧐⚙️');

        // Phase 3: Eureka! Optimized Solution
        timersRef.current.eurekaTimer = setTimeout(() => {
          setMood('eureka');
          setBubbleText('Eureka! BusinessBridge merges all to 1 smart SLA! 🎯✨');
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
    };
  }, []);

  const handleMascotClick = () => {
    startSequence();
  };

  const getMetrics = () => {
    switch (mood) {
      case 'walking':
        return [
          { label: 'Sourcing Status', value: '15 Loose Partners', state: 'warning', icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" /> },
          { label: 'SLA Coverage', value: '🚨 No Guarantee', state: 'warning', icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
          { label: 'Supplier Audit', value: 'Highly Unverified', state: 'danger', icon: <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> },
          { label: 'Price Index', value: '3x Redundant Cost', state: 'danger', icon: <TrendingDown className="w-3.5 h-3.5 text-red-400" /> },
        ];
      case 'confused':
        return [
          { label: 'Sourcing Status', value: '⚠️ System Overload', state: 'danger', icon: <HelpCircle className="w-3.5 h-3.5 text-red-400 animate-pulse" /> },
          { label: 'SLA Coverage', value: 'Discrepancies Found', state: 'danger', icon: <FileText className="w-3.5 h-3.5 text-red-400" /> },
          { label: 'Supplier Audit', value: '🚨 Fatal SLA Gaps', state: 'danger', icon: <ShieldCheck className="w-3.5 h-3.5 text-red-500 animate-flash" /> },
          { label: 'Price Index', value: 'Leaking Resources', state: 'danger', icon: <TrendingDown className="w-3.5 h-3.5 text-red-400" /> },
        ];
      case 'thinking':
        return [
          { label: 'Sourcing Status', value: 'Auditing Roster...', state: 'info', icon: <Briefcase className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> },
          { label: 'SLA Coverage', value: 'Drafting Master SLA', state: 'info', icon: <FileText className="w-3.5 h-3.5 text-blue-300" /> },
          { label: 'Supplier Audit', value: 'Pune Rate Evaluation', state: 'info', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> },
          { label: 'Price Index', value: 'Computing Savings', state: 'info', icon: <TrendingDown className="w-3.5 h-3.5 text-blue-300" /> },
        ];
      case 'eureka':
        return [
          { label: 'Sourcing Status', value: '1 Unified Partner', state: 'success', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
          { label: 'SLA Coverage', value: '1 Master SLA', state: 'success', icon: <FileText className="w-3.5 h-3.5 text-[#e2c06a]" /> },
          { label: 'Supplier Audit', value: '100% Verified SLAs', state: 'success', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> },
          { label: 'Price Index', value: '30% Cost Slashed! 🏆', state: 'success', icon: <TrendingDown className="w-3.5 h-3.5 text-emerald-300" /> },
        ];
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 pl-0 lg:pl-12">
      
      {/* Dynamic Cockpit Diagnostics Panel using left space of Mascot */}
      <div className="w-full md:w-[200px] shrink-0 bg-[#0d0d12]/80 border border-white/[0.05] p-4 rounded-2xl space-y-3.5 shadow-2xl select-none pointer-events-auto">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e2c06a] animate-ping" />
          <h5 className="text-[9px] font-mono font-bold tracking-widest text-[#e2c06a] uppercase">
            B2B Console Stats
          </h5>
        </div>

        <div className="space-y-3">
          {getMetrics().map((m, index) => (
            <div key={index} className="space-y-0.5">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-wider">
                {m.label}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                {m.icon}
                <span className={`text-[11px] font-medium truncate ${
                  m.state === 'success' ? 'text-emerald-400 font-bold' :
                  m.state === 'danger' ? 'text-red-400' :
                  m.state === 'warning' ? 'text-amber-400' :
                  'text-blue-300'
                }`}>
                  {m.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[8px] font-mono text-zinc-600 pt-2 border-t border-white/[0.04] flex justify-between">
          <span>CONSOLE PHASE:</span>
          <span className="text-zinc-400 uppercase font-bold tracking-wider">{mood}</span>
        </div>
      </div>

      {/* Main Mascot Visual Right-side Block */}
      <div className="flex flex-col items-center justify-center relative w-full max-w-[340px]">
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
          <span className="relative z-10 font-medium">{bubbleText}</span>
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
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950/80 border border-zinc-800/80 rounded-md text-[9px] text-[#e2c06a] font-mono uppercase tracking-widest"
              >
                <Briefcase className="w-3 h-3 animate-bounce text-[#e2c06a]" />
                <span>Hauling Partner Costs...</span>
              </motion.div>
            )}

            {mood === 'confused' && (
              <motion.div
                key="confused-ind"
                initial={{ opacity: 0, y: 6, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.7 }}
                className="flex gap-1.5 text-amber-500 items-center justify-center"
              >
                <HelpCircle className="w-4 h-4 animate-spin text-amber-400" />
                <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Vendor Chaos!</span>
              </motion.div>
            )}

            {mood === 'thinking' && (
              <motion.div
                key="thinking-ind"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 justify-center"
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
                <span className="text-[9px] font-mono uppercase text-[#e2c06a] tracking-wider">Analyzing Pune Rates...</span>
              </motion.div>
            )}

            {mood === 'eureka' && (
              <motion.div
                key="eureka-ind"
                initial={{ opacity: 0, y: 10, scale: 0.4 }}
                animate={{ opacity: 1, y: 0, scale: 1.05 }}
                exit={{ opacity: 0, y: -10, scale: 0.4 }}
                className="flex items-center gap-1.5 border border-[#e2c06a]/40 bg-zinc-950/90 px-3 py-1 rounded shadow text-[#e2c06a]"
              >
                <Lightbulb className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">100% SMART INTEGRATION</span>
                <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
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
            {/* HIGH-FIDELITY SPHERICAL CHUBBY "BRIDGEE" ROBOT */}
            <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]">
              <defs>
                {/* Stunning High-Contrast Platinum Chrome Spherical Gradient */}
                <radialGradient id="bodyGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#f4f4f5" />
                  <stop offset="75%" stopColor="#d1d5db" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </radialGradient>

                {/* Visor Screen Obsidian glass */}
                <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#08080c" />
                  <stop offset="100%" stopColor="#12131a" />
                </linearGradient>

                {/* Rosy blush cheeks */}
                <radialGradient id="blurBlush" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(226,192,106,0.35)" />
                  <stop offset="100%" stopColor="rgba(226,192,106,0)" />
                </radialGradient>

                {/* Shiny Gold details */}
                <linearGradient id="goldPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff2cb" />
                  <stop offset="50%" stopColor="#e2c06a" />
                  <stop offset="100%" stopColor="#b4933a" />
                </linearGradient>

                {/* Simple floor drop shadow */}
                <radialGradient id="floorShad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.75)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>

              {/* Flat soft floor boundary shadow under tiny feet */}
              <ellipse cx="120" cy="225" rx="36" ry="6" fill="url(#floorShad)" />

              {/* --- ADORABLE WADLEY SHORT FEET (Obsidian contrast against silver body) --- */}
              <g id="short-waddling-feet">
                {/* Left foot */}
                <motion.ellipse
                  cx="95"
                  cy="210"
                  rx="15"
                  ry="8"
                  fill="#18181b"
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
                  fill="#18181b"
                  stroke="url(#goldPlateGrad)"
                  strokeWidth="1.5"
                  animate={mood === 'walking' ? {
                    y: [0, 0, 0, -6, 0],
                    cx: [145, 145, 145, 147, 145]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                />
              </g>

              {/* --- CHUBBY SPHERE MAIN BODY --- */}
              <circle cx="120" cy="130" r="66" fill="url(#bodyGrad)" stroke="url(#goldPlateGrad)" strokeWidth="2.25" />

              {/* Gloss Highlight on Metallic Obsidian Body */}
              <path d="M 70 85 Q 120 62 170 85 Q 120 72 70 85 Z" fill="rgba(255, 255, 255, 0.4)" opacity="0.6" />

              {/* --- TOP ANTENNA WITH GLOWING LED BULB --- */}
              <line x1="120" y1="64" x2="120" y2="40" stroke="url(#goldPlateGrad)" strokeWidth="3" />
              <circle cx="120" cy="40" r="6.5" fill="url(#goldPlateGrad)" />
              <circle cx="120" cy="40" r="10" fill="#ffd700" opacity="0.25" className="animate-ping" style={{ transformOrigin: '120px 40px' }} />

              {/* Cute gold side bolts */}
              <rect x="50" y="118" width="5" height="15" rx="2" fill="url(#goldPlateGrad)" />
              <rect x="185" y="118" width="5" height="15" rx="2" fill="url(#goldPlateGrad)" />

              {/* --- SPHERICAL GLASS FACE VISOR FOR EXPRESSION --- */}
              <rect x="74" y="90" width="92" height="56" rx="28" fill="url(#visorGrad)" stroke="url(#goldPlateGrad)" strokeWidth="1.75" />
              
              {/* Glossy Visor Highlight Line */}
              <path d="M 82 104 Q 120 92 158 104" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* --- DELIGHTFUL DYNAMIC VISOR EMOTIONS (Vibrant Yellow/Amber contrasts obsidian visor perfectly) --- */}
              {mood === 'walking' && (
                <g id="visor-walk-eyes">
                  {/* Sweat droplet of cute effort */}
                  <path d="M 152 74 C 152 74, 155 80, 152 82 C 150 82, 150 78, 152 74 Z" fill="#60a5fa" />
                  
                  {/* Squinted determined gold eyes */}
                  <path d="M 90 114 Q 97 109 104 114" stroke="#ffd700" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 136 114 Q 143 109 150 114" stroke="#ffd700" strokeWidth="3" fill="none" strokeLinecap="round" />

                  {/* Cute micro dot mouth */}
                  <circle cx="120" cy="122" r="3.5" fill="#ffd700" />
                </g>
              )}

              {mood === 'confused' && (
                <g id="visor-confuse-eyes">
                  {/* Spiral dizzy LED eyes */}
                  <path d="M 91 114 Q 97 108 97 114 Q 97 118 93 118 Q 90 116 93 112" stroke="#e2c06a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 139 114 Q 145 108 145 114 Q 145 118 141 118 Q 138 116 141 112" stroke="#e2c06a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                  {/* Shocked squiggly pixel mouth */}
                  <path d="M 112 126 L 116 123 L 120 126 L 124 123 L 128 126" stroke="#e2c06a" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                </g>
              )}

              {mood === 'thinking' && (
                <g id="visor-think-eyes">
                  {/* Scanning bright gold visor state */}
                  <rect x="88" y="112" width="16" height="3" rx="1.5" fill="#ffd700" className="animate-pulse" />
                  <rect x="136" y="112" width="16" height="3" rx="1.5" fill="#ffd700" className="animate-pulse" />

                  {/* Processing sleek tech wave mouth coordinate */}
                  <path d="M 110 124 H 114 L 117 121 L 121 127 L 123 124 H 130" stroke="#ffd700" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                </g>
              )}

              {mood === 'eureka' && (
                <g id="visor-eureka-eyes">
                  {/* Blushing warm cheeks */}
                  <circle cx="86" cy="128" r="8" fill="url(#blurBlush)" />
                  <circle cx="154" cy="128" r="8" fill="url(#blurBlush)" />

                  {/* Glittering bright golden star wink eyes */}
                  <path d="M 97 106 L 99 111 L 104 111 L 100 114 L 102 119 L 97 116 L 92 119 L 94 114 L 90 111 L 95 111 Z" fill="#ffd700" />
                  <path d="M 143 106 L 145 111 L 150 111 L 146 114 L 148 119 L 143 116 L 138 119 L 140 114 L 136 111 L 141 111 Z" fill="#ffd700" />

                  {/* Huge happy smiley face */}
                  <path d="M 113 122 Q 120 132 127 122 Z" fill="#ef4444" stroke="#ffd700" strokeWidth="1" />
                  {/* Bright white baby tooth inside mouth */}
                  <rect x="117" y="122" width="6" height="2.5" fill="#fff" rx="0.5" />
                </g>
              )}

              {/* --- EXQUISITE GOLDEN COLLAR & BOW-TIE --- */}
              <path d="M 96 142 Q 120 154 144 142" stroke="url(#goldPlateGrad)" strokeWidth="3" fill="none" />
              <polygon points="112,142 120,148 128,142 124,152 116,152" fill="url(#goldPlateGrad)" stroke="#b4933a" strokeWidth="0.75" />
              <circle cx="120" cy="148" r="2.5" fill="#ffffff" />

              {/* --- PREMIUM B2B GOLD BRIDGE TUMMY CREST --- */}
              <g id="bridge-tummy-crest">
                {/* Golden arched bridge path */}
                <path d="M 106 172 Q 120 160 134 172" stroke="url(#goldPlateGrad)" strokeWidth="3.25" fill="none" strokeLinecap="round" />
                <path d="M 101 181 Q 120 173 139 181" stroke="url(#goldPlateGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* SLA columns */}
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
                  fill="#18181b"
                  stroke="url(#goldPlateGrad)"
                  strokeWidth="1.25"
                  animate={mood === 'walking' ? {
                    y: [0, 4, -3, 0],
                    cx: [48, 52, 48, 48]
                  } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />

                {/* Little custom portfolio/briefcase with files poking out in walking */}
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
                      <rect x="36" y="132" width="7" height="11" rx="0.5" fill="#ef4444" transform="rotate(-15 36 132)" />
                      <rect x="42" y="130" width="8" height="12" rx="0.5" fill="#e2c06a" transform="rotate(8 42 130)" />
                    </g>
                  )}
                  {/* Adorable tiny leather folder suitcase briefcase */}
                  <rect x="28" y="142" width="22" height="16" rx="2.5" fill="#322216" stroke="#120c08" strokeWidth="1" />
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
                    fill="#18181b"
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
                  <path d="M 174 130 Q 186 112 168 100 Q 164 105 174 116" fill="#18181b" stroke="url(#goldPlateGrad)" strokeWidth="1.25" />
                )}

                {mood === 'thinking' && (
                  <ellipse cx="178" cy="144" rx="9" ry="9" fill="#18181b" stroke="url(#goldPlateGrad)" strokeWidth="1.25" />
                )}

                {mood === 'eureka' && (
                  <g>
                    <path d="M 174 125 Q 192 110 196 90 Q 188 88 178 112" fill="#18181b" stroke="url(#goldPlateGrad)" strokeWidth="1.25" />
                    <path d="M 191 76 Q 196 72 201 76 Q 196 80 191 76" fill="#ffd700" className="animate-pulse" />
                    <circle cx="196" cy="76" r="4.5" fill="url(#goldPlateGrad)" />
                  </g>
                )}
              </g>

            </svg>

            {/* Floating Pure Golden Spark particles bursting celebrating Eureka state */}
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

        {/* Replay action text instructions */}
        <span className="mt-4 text-[9px] font-mono uppercase tracking-[0.160em] text-zinc-500 hover:text-[#e2c06a] transition-colors duration-300 pointer-events-none">
          ✦ CLICK BOT TO REPLAY EPIPHANY ✦
        </span>
      </div>

    </div>
  );
}

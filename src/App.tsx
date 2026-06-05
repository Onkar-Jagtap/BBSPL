/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, 
  Monitor,
  Users, 
  Scale, 
  Building, 
  ShieldCheck, 
  Megaphone, 
  ArrowRight, 
  ArrowUpRight,
  Plus, 
  CheckCircle, 
  Sparkles, 
  Phone, 
  MapPin, 
  Mail, 
  Compass, 
  Grid,
  LayoutGrid,
  Truck,
  Heart,
  Wrench
} from 'lucide-react';
import { SERVICES_LIST, GENERAL_QUESTIONS, ServiceCategory } from './types';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import ServiceModal from './components/ServiceModal';
import ChatbotWidget from './components/ChatbotWidget';
import AnimatedCounter from './components/AnimatedCounter';
import BrandMascot from './components/BrandMascot';

export default function App() {
  // Navigation & Panel overlays state
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('quote');
  
  // Custom cursor hover tracking
  const [isHovered, setIsHovered] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // State for cursor trailing sparkles
  const [sparkles, setSparkles] = useState<{ id: string; x: number; y: number; scale: number; color: string }[]>([]);
  const lastSparklePosRef = useRef({ x: 0, y: 0 });

  // Garbage collect old sparkles that have completed their lifespan to maintain low memory
  useEffect(() => {
    if (sparkles.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setSparkles(prev => prev.filter(spark => {
        const timestamp = parseFloat(spark.id.split('-')[0]);
        return now - timestamp < 900;
      }));
    }, 150);
    return () => clearInterval(interval);
  }, [sparkles.length]);

  // Setup cursor coordinate tracking listeners and DOM animation loop
  useEffect(() => {
    const cdot = document.getElementById('cdot');

    let mx = -100;
    let my = -100;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (cdot) {
        cdot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }

      // Spacing-gate sparkle creation to produce discrete premium stars
      const dx = e.clientX - lastSparklePosRef.current.x;
      const dy = e.clientY - lastSparklePosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 20) {
        lastSparklePosRef.current = { x: e.clientX, y: e.clientY };
        
        const colors = ['#e2c06a', '#c9a84c', '#ffd700', '#fff5df', '#ffe8a3'];
        const id = `${Date.now()}-${Math.random()}`;
        const newSparkle = {
          id,
          x: e.clientX,
          y: e.clientY,
          scale: Math.random() * 0.5 + 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        setSparkles(prev => [...prev.slice(-25), newSparkle]);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    // Bind custom hover listeners to interactive classes dynamically
    const handleHoverTargetsEnter = () => setIsHovered(true);
    const handleHoverTargetsLeave = () => setIsHovered(false);

    const updateInteractiveTriggers = () => {
      const elements = document.querySelectorAll('button, a, .glass-card, [role="button"], .faq-q');
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverTargetsEnter);
        el.removeEventListener('mouseleave', handleHoverTargetsLeave);
        el.addEventListener('mouseenter', handleHoverTargetsEnter);
        el.addEventListener('mouseleave', handleHoverTargetsLeave);
      });
    };

    updateInteractiveTriggers();
    const timer = setTimeout(updateInteractiveTriggers, 800);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      clearTimeout(timer);
    };
  }, []);


  // Handle category inquiry sheet launch requests
  const openCategoryInquiry = (categoryName: string) => {
    setActiveCategory(categoryName);
    setPanelOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIdx(openFaqIdx === index ? null : index);
  };

  // Maps category icons dynamically to React lucide layouts
  const getCategoryIconComponent = (cat: ServiceCategory) => {
    switch (cat) {
      case 'Technology & Digital Solutions':
        return <Laptop className="w-6 h-6 text-[#e2c06a]" />;
      case 'IT Hardware & Equipment Rentals':
        return <Monitor className="w-6 h-6 text-[#e2c06a]" />;
      case 'Workforce & Admin Solutions':
        return <Users className="w-6 h-6 text-[#e2c06a]" />;
      case 'Finance, Legal & Consulting':
        return <Scale className="w-6 h-6 text-[#e2c06a]" />;
      case 'Marketing & Brand Solutions':
        return <Megaphone className="w-6 h-6 text-[#e2c06a]" />;
      case 'Office Interiors & Space Setup':
        return <LayoutGrid className="w-6 h-6 text-[#e2c06a]" />;
      case 'Facility, Housekeeping & Security':
        return <Building className="w-6 h-6 text-[#e2c06a]" />;
      case 'Logistics & Freight Services':
        return <Truck className="w-6 h-6 text-[#e2c06a]" />;
      case 'Food, Pantry & Wellness':
        return <Heart className="w-6 h-6 text-[#e2c06a]" />;
      case 'Manufacturing & Industrial Services':
        return <Wrench className="w-6 h-6 text-[#e2c06a]" />;
    }
  };

  return (
    <div className="relative min-h-screen text-[#fcfbf9] overflow-x-hidden selection:bg-[#c9a84c] selection:text-[#030305]">
      {/* Background WebGL / Gradient Fallback Canvas */}
      <BackgroundCanvas />

      {/* High-Contrast Golden Spark Cursor */}
      <div id="cdot" className="pointer-events-none fixed z-[9999] rounded-full hidden md:block" style={{
        position: 'fixed',
        width: '4px',
        height: '4px',
        background: '#ffd700',
        borderRadius: '50%',
        pointerEvents: 'none',
        boxShadow: '0 0 10px #c9a84c, 0 0 20px #c9a84c, 0 0 35px #e2c06a',
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        willChange: 'transform',
      }} />

      {/* Elegant Golden Star Trails (Sparkles) following cursor */}
      <div className="pointer-events-none fixed inset-0 z-[9996] overflow-hidden hidden md:block">
        <AnimatePresence>
          {sparkles.map(spark => (
            <motion.div
              key={spark.id}
              style={{
                position: 'fixed',
                left: spark.x,
                top: spark.y,
              }}
              initial={{ scale: spark.scale, opacity: 0.9, rotate: 0 }}
              animate={{ 
                scale: 0, 
                opacity: 0, 
                y: Math.random() * 40 + 20, // Gorgeous physical gravity drift downwards
                x: Math.random() * 24 - 12,  // Gentle side sway
                rotate: Math.random() < 0.5 ? 180 : -180 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="pointer-events-none w-3.5 h-3.5 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_5px_rgba(226,192,106,0.7)]" style={{ fill: spark.color }}>
                <path d="M 50 0 C 50 35, 35 50, 0 50 C 35 50, 50 65, 50 100 C 50 65, 65 50, 100 50 C 65 50, 50 35, 50 0 Z" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* UI Interface Overlay Wrapper */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        
        {/* Navigation Bar */}
        <Navbar onOpenPanel={openCategoryInquiry} />

        {/* --- MAIN BODY SECTIONS --- */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-[88px] sm:pt-[92px] lg:pt-[96px] pb-16">
          
          {/* SECTION 1: HERO OUTLINE */}
          <section className="pt-4 sm:pt-8 pb-3 sm:pb-4 pointer-events-auto">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column (Hero Content) */}
              <motion.div
                initial={{ opacity: 0, x: -45 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 lg:col-span-7"
              >
                <div className="inline-flex items-center gap-3.5 bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-1.5 text-xs text-[#e2c06a] font-semibold uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5 stroke-[2] text-[#e2c06a]" />
                  B2B Service Concierge
                </div>

                <h1 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }} 
                  className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.1] tracking-tight text-white"
                >
                  One Partner for <br />
                  <span className="italic bg-gradient-to-r from-[#c9a84c] via-[#e2c06a] to-white bg-clip-text text-transparent">
                    Every Business
                  </span> <br />
                  Service.
                </h1>

                <p className="text-[1.15rem] text-[#f5f3ef] leading-[1.8] max-w-lg font-light">
                  Connecting growing Indian enterprises with 100% verified B2B service providers across technology, IT hardware rentals, recruitment, compliance, and facilities management under a single master Quality Agreement.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 flex-wrap">
                  <button
                    onClick={() => openCategoryInquiry('quote')}
                    className="px-6 py-4 bg-[#c9a84c] rounded-lg text-[#030305] font-bold text-xs uppercase tracking-wider hover:bg-[#e2c06a] hover:shadow-[0_0_25px_rgba(201,168,76,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Request a Free Quote
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('services');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#c9a84c]/20 text-white rounded-lg font-semibold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Explore Capabilities
                  </button>
                </div>
              </motion.div>

              {/* Right Column (Confused/Eureka Mascot Visual) */}
              <motion.div
                initial={{ opacity: 0, x: 45 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 flex justify-center items-center relative"
              >
                <BrandMascot />
              </motion.div>
            </div>
          </section>

          {/* CONTINUOUS INFINITE TICKER DIVISION - FULL SCREEN-WIDE & IDEALLY POSITIONED */}
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-3 bg-[#0a0a0d]/90 border-y border-[#c9a84c]/15 select-none pointer-events-auto shadow-[0_4px_35px_rgba(0,0,0,0.6)] z-20 mt-4 mb-20">
            {/* Elegant glass-gilded side fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#030305] via-[#030305]/75 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#030305] via-[#030305]/75 to-transparent z-10 pointer-events-none" />
            
            <div className="animate-ticker whitespace-nowrap flex items-center gap-10 text-[9px] sm:text-[10px] font-mono font-bold text-[#e2c06a] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-10">
                <span>✨ Verified Partners</span>
                <span className="text-white/15 select-none">|</span>
                <span>🤝 All-India Coverage</span>
                <span className="text-white/15 select-none">|</span>
                <span>⚡ 24/7 Dedicated Support</span>
                <span className="text-white/15 select-none">|</span>
                <span>💎 Transparent Quotes</span>
                <span className="text-white/15 select-none">|</span>
                <span>🎯 Trusted Specialists</span>
                <span className="text-white/15 select-none">|</span>
                <span>🌟 Zero Markups</span>
                <span className="text-white/15 select-none">|</span>
                <span>💼 Nationwide Delivery</span>
                <span className="text-white/15 select-none">|</span>
              </div>
              <div className="flex items-center gap-10" aria-hidden="true">
                <span>✨ Verified Partners</span>
                <span className="text-white/15 select-none">|</span>
                <span>🤝 All-India Coverage</span>
                <span className="text-white/15 select-none">|</span>
                <span>⚡ 24/7 Dedicated Support</span>
                <span className="text-white/15 select-none">|</span>
                <span>💎 Transparent Quotes</span>
                <span className="text-white/15 select-none">|</span>
                <span>🎯 Trusted Specialists</span>
                <span className="text-white/15 select-none">|</span>
                <span>🌟 Zero Markups</span>
                <span className="text-white/15 select-none">|</span>
                <span>💼 Nationwide Delivery</span>
                <span className="text-white/15 select-none">|</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: BENTO SERVICES GRID */}
          <section id="services" className="space-y-12 scroll-mt-24 pointer-events-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
              <div>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#e1b439] tracking-[0.25em] h-5 block uppercase">
                  Our Verified Capabilities
                </span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl sm:text-5xl md:text-6xl text-white font-light mt-1 leading-tight">
                  10 Service Categories. <br />
                  <span className="italic text-[#e2c06a]">100+ Premium Services.</span>
                </h2>
              </div>
              <p className="text-[1.15rem] text-[#f5f3ef] max-w-md leading-[1.8] md:pb-2 font-light">
                We manage service levels meticulously. Select any sector below to specify targets, download contracts, or view certified operational vendors ready for your nationwide operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES_LIST.map((svc, idx) => (
                <motion.div
                  key={svc.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  onClick={() => openCategoryInquiry(svc.category)}
                  className="glass-card flex flex-col p-6 rounded-2xl bg-[#141419]/35 border border-white/[0.04] hover:border-[#c9a84c]/40 transition-all duration-500 group select-none pointer-events-auto cursor-pointer relative overflow-hidden"
                >
                  {/* Subtle hover background radial glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-center justify-between mb-6 relative">
                    <div className="w-11 h-11 bg-white/[0.03] border border-white/[0.08] group-hover:border-[#c9a84c]/20 group-hover:bg-[#c9a84c]/5 rounded-xl flex items-center justify-center transition-colors duration-500">
                      {getCategoryIconComponent(svc.category)}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/[0.05] group-hover:bg-[#c9a84c] group-hover:border-[#c9a84c] group-hover:-rotate-45 transition-all duration-400">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-[#030305] transition-colors" />
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-[#fcfbf9] text-base font-bold mb-2 group-hover:text-[#e2c06a] transition-colors">
                    {svc.category}
                  </h3>
                  
                  <p className="text-xs text-[#f9f8f6] leading-[1.7] mb-6 flex-1 font-light">
                    {svc.shortDesc}
                  </p>

                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#c9a84c] group-hover:text-[#e2c06a] transition-colors font-bold mt-auto pt-2 flex items-center gap-1.5 border-t border-white/[0.03]">
                    <Grid className="w-3 h-3" />
                    See {svc.options.length} Specific Services →
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SECTION 3: HOW WE WORK */}
          <section id="why" className="space-y-16 scroll-mt-24 pointer-events-auto mt-24 sm:mt-32">
            <div className="max-w-xl space-y-3">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#e1b439] tracking-[0.25em] uppercase">
                Managed Partnership
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl sm:text-5xl text-white font-light leading-[1.1]">
                We Don't Just Sell Services. <br />
                <span className="italic text-[#e2c06a]">We Simplify Solutions.</span>
              </h2>
              <p className="text-[1.15rem] text-[#f5f3ef] leading-[1.8] font-light">
                We find elite solutions at direct-contractor rates. When you request any corporate service, we source side-by-side quotations from our pre-approved national network. You select your preferred bid, and we earn a referral commission directly from the supplier. Absolutely zero markup or fees passed on to your business.
              </p>
            </div>            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Submit Request', desc: 'Submit specifications for your required service—whether technology development, IT rentals, facility setup, or security staff.' },
                { step: '02', title: 'Direct Partner Quotes', desc: 'We deliver clear, side-by-side quotations directly from our accredited local partners at their authentic, standard industry pricing.' },
                { step: '03', title: 'Select Your Match', desc: 'Review the bids and pick the partner that fits your operational budget, delivery targets, or rating preference perfectly.' },
                { step: '04', title: 'Free Quality Guarantee', desc: "We oversee the contract and enforce active service quality agreements. Our fee is covered entirely via the vendor's commission percentage." }
              ].map((step, idx) => (
                <div 
                  key={idx}
                  className="glass-card p-6 rounded-2xl group select-none relative overflow-hidden"
                >
                  <div className="font-serif text-4xl font-light text-[#c9a84c]/20 group-hover:text-[#c9a84c]/50 transition-colors duration-300 mb-5">
                    {step.step}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-2 font-head">
                    {step.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#f9f8f6] leading-[1.7] font-light">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
  
          {/* SECTION 4: COUNTER STATS COHORT */}
          <section className="pointer-events-auto glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden mt-24 sm:mt-32">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/[0.02] via-transparent to-transparent opacity-50" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-center">
              {[
                { target: 10, suffix: '', lbl: 'Service Categories' },
                { target: 100, suffix: '+', lbl: 'Verified Services' },
                { target: 1, suffix: '', lbl: 'Unified Invoice' },
                { target: 24, suffix: '/7', lbl: 'Active Customer Support' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="font-serif font-light text-3xl sm:text-4xl lg:text-4xl text-[#e2c06a] leading-none">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] font-bold uppercase text-[#bcbab4] tracking-[0.15em] font-head">
                    {stat.lbl}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: CLIENT TESTIMONIALS */}
          <section className="space-y-12 pointer-events-auto select-none mt-24 sm:mt-32">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#e1b439] tracking-[0.25em] uppercase">
                Accredited Testimonials
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl md:text-5xl text-white font-light">
                What Indian Businesses <br />
                <span className="italic text-[#e2c06a]">Say About Us</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-2xl">
                <p className="text-[1.15rem] text-[#f5f3ef] leading-[1.8] italic font-light">
                  "BusinessBridge saved us weeks of redundant tender documentation and supplier sourcing. IT software infrastructure, Facility operations, and physical building security — all aggregated transparently under one managed agreement."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/25 flex items-center justify-center text-xs font-bold text-[#e2c06a]">
                    RK
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold font-head uppercase tracking-wider text-white">Rajesh Kumar</h4>
                    <p className="text-[10px] text-zinc-300 font-light">Director of Operations, TechCorp India</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl">
                <p className="text-[1.15rem] text-[#f5f3ef] leading-[1.8] italic font-light">
                  "Our legal audits and ISO standard certification targets through BusinessBridge was exceptionally prompt. Their verified attorney network handled trademark applications, internal controls documentation, and compliance filings within timeline limits."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/25 flex items-center justify-center text-xs font-bold text-[#e2c06a]">
                    PM
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold font-head uppercase tracking-wider text-white">Priya Mehta</h4>
                    <p className="text-[10px] text-zinc-300 font-light">Managing Director, Precision Engineering Ltd.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: FAQ ACCORDION */}
          <section id="faq" className="space-y-12 scroll-mt-24 pointer-events-auto mt-24 sm:mt-32">
            <div className="max-w-xl mx-auto text-center space-y-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#e1b439] tracking-[0.25em] uppercase">
                Information Board
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-white font-light">
                Frequently Asked <br />
                <span className="italic text-[#e2c06a]">Questions</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-start">
              {/* Column 1 (Even index FAQs) */}
              <div className="space-y-4">
                {GENERAL_QUESTIONS.map((q, idx) => {
                  if (idx % 2 !== 0) return null;
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`glass-card rounded-xl overflow-hidden transition-all duration-500 ${isOpen ? 'border-[#c9a84c]/25 shadow-[0_10px_30px_rgba(201,168,76,0.04)] bg-white/[0.04]' : 'bg-transparent'}`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <span className="text-[11px] sm:text-xs sm:font-bold font-head uppercase tracking-wider text-[#fcfbf9] transition-colors group-hover:text-[#e2c06a]">
                          {q.question}
                        </span>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.06] text-[#c9a84c] transition-colors group-hover:border-[#c9a84c]/40">
                          {isOpen ? (
                            <span className="text-xs font-semibold select-none leading-none">-</span>
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                          >
                            <div className="px-5 pb-5 pt-1.5 border-t border-white/[0.02]">
                              <p className="text-[1.15rem] text-[#f5f3ef] leading-[1.8] font-light">
                                {q.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Column 2 (Odd index FAQs) */}
              <div className="space-y-4">
                {GENERAL_QUESTIONS.map((q, idx) => {
                  if (idx % 2 === 0) return null;
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`glass-card rounded-xl overflow-hidden transition-all duration-500 ${isOpen ? 'border-[#c9a84c]/25 shadow-[0_10px_30px_rgba(201,168,76,0.04)] bg-white/[0.04]' : 'bg-transparent'}`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <span className="text-[11px] sm:text-xs sm:font-bold font-head uppercase tracking-wider text-[#fcfbf9] transition-colors group-hover:text-[#e2c06a]">
                          {q.question}
                        </span>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.06] text-[#c9a84c] transition-colors group-hover:border-[#c9a84c]/40">
                          {isOpen ? (
                            <span className="text-xs font-semibold select-none leading-none">-</span>
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                          >
                            <div className="px-5 pb-5 pt-1.5 border-t border-white/[0.02]">
                              <p className="text-[1.15rem] text-[#f5f3ef] leading-[1.8] font-light">
                                {q.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </main>

        {/* --- FOOTER REGISTRY outline --- */}
        <footer className="bg-[#030305]/85 border-t border-white/[0.04] mt-16 py-12 px-6 sm:px-10 lg:px-16 pointer-events-auto">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div style={{ fontFamily: "'Syne', sans-serif" }} className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#c9a84c] rounded-lg flex items-center justify-center text-[#030305] font-extrabold text-xs">
                  BB
                </div>
                <span className="text-white font-bold text-base tracking-tight">
                  Business<span className="text-[#e2c06a] font-normal italic">Bridge</span>
                </span>
              </div>
              <p className="text-[10px] text-[#bcbab4] leading-relaxed font-light max-w-xs">
                BusinessBridge is the single consolidated billing, vetting, and management partner for cross-category B2B service integration serving enterprise partners nationwide.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold uppercase text-[#e2c06a] tracking-wider">
                Services Directory
              </h4>
              <ul className="space-y-1.5 text-[10px] text-[#e5e2dd] font-light">
                <li><button onClick={() => openCategoryInquiry('Technology & Digital Solutions')} className="hover:text-[#e2c06a] transition-colors cursor-pointer text-left">Technology & Digital Solutions</button></li>
                <li><button onClick={() => openCategoryInquiry('IT Hardware & Equipment Rentals')} className="hover:text-[#e2c06a] transition-colors cursor-pointer text-left">IT Hardware & Equipment Rentals</button></li>
                <li><button onClick={() => openCategoryInquiry('Workforce & Admin Solutions')} className="hover:text-[#e2c06a] transition-colors cursor-pointer text-left">Workforce & Admin Solutions</button></li>
                <li><button onClick={() => openCategoryInquiry('Finance, Legal & Consulting')} className="hover:text-[#e2c06a] transition-colors cursor-pointer text-left">Finance, Legal & Consulting</button></li>
                <li><button onClick={() => openCategoryInquiry('Facility, Housekeeping & Security')} className="hover:text-[#e2c06a] transition-colors cursor-pointer text-left">Facility, Housekeeping & Security</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold uppercase text-[#e2c06a] tracking-wider">
                Enterprise
              </h4>
              <ul className="space-y-1.5 text-[10px] text-[#e5e2dd] font-light">
                <li><a href="#services" className="hover:text-[#e2c06a] transition-colors">Our Services</a></li>
                <li><a href="#why" className="hover:text-[#e2c06a] transition-colors">Quality Guarantee</a></li>
                <li><a href="#faq" className="hover:text-[#e2c06a] transition-colors">Support FAQ</a></li>
                <li><button onClick={() => openCategoryInquiry('partner')} className="hover:text-[#e2c06a] transition-colors cursor-pointer">Become a Partner</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold uppercase text-[#e2c06a] tracking-wider">
                 Pune HQ & National Hub
              </h4>
              <ul className="space-y-2 text-[10px] text-[#bcbab4] font-light">
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#e2c06a] flex-shrink-0" /> Shivaji Nagar Core, Pune, MH (Serving All-India)</li>
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#e2c06a] flex-shrink-0" /> +91 20 4919 XXXXX</li>
                <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#e2c06a] flex-shrink-0" /> info@businessbridge.in</li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1440px] mx-auto mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-[#bcbab4] font-light font-mono">
            <span>© 2026 BusinessBridge Solutions Private Limited. All corporate rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <span>CIN: U74999MH2026PTC000000</span>
              <span>GSTIN: 27AABCB2026P1ZX</span>
            </div>
          </div>
        </footer>

        {/* --- DYNAMIC FLOATING INTERACTIVE WIDGET CHATBOT --- */}
        <ChatbotWidget onOpenCategory={openCategoryInquiry} />

        {/* --- DYNAMIC FORM PANELS MODAL --- */}
        <ServiceModal
          isOpen={panelOpen}
          categoryName={activeCategory}
          onClose={() => setPanelOpen(false)}
        />

      </div>
    </div>
  );
}

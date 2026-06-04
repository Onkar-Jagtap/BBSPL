/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Layers, HelpCircle, PhoneCall, Briefcase, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenPanel: (categoryName: string) => void;
}

export default function Navbar({ onOpenPanel }: NavbarProps) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setStuck(true);
      } else {
        setStuck(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        zIndex: 100,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`${
        stuck
          ? 'bg-[#030305]/60 backdrop-blur-xl border-b border-white/[0.04] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      {/* Brand Logo */}
      <div 
        style={{ fontFamily: "'Syne', sans-serif" }} 
        className="flex items-center gap-3 cursor-default select-none pointer-events-auto group"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-[#7a5e1e] to-[#e2c06a] rounded-lg flex items-center justify-center text-[#030305] font-extrabold text-sm transition-transform duration-500 group-hover:rotate-12">
          BB
        </div>
        <span className="text-white font-bold tracking-tight text-lg sm:text-xl">
          Business<span className="text-[#e2c06a] font-normal italic">Bridge</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] text-[#c4beb4] pointer-events-auto">
        <a
          href="#services"
          onClick={(e) => handleSmoothScroll(e, 'services')}
          className="flex items-center gap-1.5 hover:text-[#e2c06a] transition-colors duration-300"
        >
          <Layers className="w-3.5 h-3.5" />
          Services
        </a>
        <a
          href="#why"
          onClick={(e) => handleSmoothScroll(e, 'why')}
          className="flex items-center gap-1.5 hover:text-[#e2c06a] transition-colors duration-300"
        >
          <Briefcase className="w-3.5 h-3.5" />
          How We Work
        </a>
        <a
          href="#faq"
          onClick={(e) => handleSmoothScroll(e, 'faq')}
          className="flex items-center gap-1.5 hover:text-[#e2c06a] transition-colors duration-300"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          FAQ
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => onOpenPanel('partner')}
          className="px-4 py-2 border border-white/10 rounded backdrop-blur-md text-white font-semibold text-[10px] sm:text-xs uppercase tracking-wider hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 hover:text-[#e2c06a] transition-all duration-300"
        >
          Partnership
        </button>
        <button
          onClick={() => onOpenPanel('quote')}
          className="px-4 py-2 bg-[#c9a84c] rounded text-[#030305] font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-[#e2c06a] hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Free Quote
        </button>
      </div>
    </nav>
  );
}

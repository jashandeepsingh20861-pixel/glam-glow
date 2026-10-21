import React from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { salonConfig, language, setLanguage } = useSalon();
  const t = (key: string) => getTranslation(language, key);

  return (
    <footer id="about" className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-24 lg:pb-16 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] text-[#1C1917] flex items-center justify-center font-serif text-lg font-bold">
                G
              </div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                Glow & Glam
              </span>
            </div>
            <p className="text-xs text-[#A8A29E] leading-relaxed font-light">
              India's premier luxury salon, haute bridal atelier, and clinical aesthetic lounge. Celebrating bespoke craftsmanship, purity, and personalized indulgence.
            </p>
            <div className="text-[11px] text-[#C5A059] font-medium font-mono">
              GST Registered · SAC 999722
            </div>
          </div>

          {/* Salon Hours & Timings */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Visiting Hours
            </h4>
            <div className="space-y-2 text-xs text-[#A8A29E]">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Monday — Sunday</span>
                  <span className="font-mono tabular-nums">09:00 AM — 08:00 PM IST</span>
                </div>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Valet parking available at both Mumbai and Delhi flagship locations.
              </p>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Flagship Ateliers
            </h4>
            <div className="space-y-2.5 text-xs text-[#A8A29E]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{salonConfig.address}, {salonConfig.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-mono">{salonConfig.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{salonConfig.email}</span>
              </div>
            </div>
          </div>

          {/* Hygiene & Pure Beauty Guarantee */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Our Safety Standard
            </h4>
            <div className="p-4 bg-[#292524] rounded-xl border border-[#3C3632] space-y-2 text-xs text-[#D6CEBF]">
              <div className="flex items-center gap-2 text-[#059669] font-medium text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Hospital-Grade Sterilization</span>
              </div>
              <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                Autoclaved instruments, single-use biodegradable towels, and organic ammonia-free products for complete client peace of mind.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Subtle Language Switcher */}
        <div className="pt-8 border-t border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© 2026 {salonConfig.name}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">Preferred Language:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`hover:text-white transition-colors ${language === 'en' ? 'text-[#C5A059] font-bold' : ''}`}
              >
                English
              </button>
              <span>·</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`hover:text-white transition-colors ${language === 'hi' ? 'text-[#C5A059] font-bold' : ''}`}
              >
                हिन्दी
              </button>
              <span>·</span>
              <button
                onClick={() => setLanguage('pb')}
                className={`hover:text-white transition-colors ${language === 'pb' ? 'text-[#C5A059] font-bold' : ''}`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

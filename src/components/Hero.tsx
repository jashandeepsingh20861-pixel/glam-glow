import React from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { Calendar, Bot, Star, ShieldCheck, Award, Clock } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, openBookingModal, openAiAssistant } = useSalon();
  const t = (key: string) => getTranslation(language, key);

  return (
    <section id="home" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Split: Editorial Copy Left + Showcase Photography Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Kicker Metadata with subtle dot separator */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B38838] font-semibold">
              <span>Haute Beauty & Bridal</span>
              <span aria-hidden="true" className="text-[#D6CEBF]">·</span>
              <span>Gurdaspur, Punjab</span>
              <span aria-hidden="true" className="text-[#D6CEBF]">·</span>
              <span>Est. 2008</span>
            </div>

            {/* Display Headline: Cormorant Garamond Serif, Balanced, No Orphans */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] leading-[1.1] tracking-tight text-balance">
              {t('heroTitle')}
            </h1>

            {/* Body Copy */}
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl font-light">
              {t('heroSubtitle')}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openBookingModal()}
                className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] active:scale-[0.98] px-6 py-3.5 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>{t('heroCtaBook')}</span>
              </button>

              <button
                onClick={openAiAssistant}
                className="bg-white hover:bg-[#F7F4EE] text-[#1C1917] border border-[#D7D2C7] active:scale-[0.98] px-5 py-3.5 rounded-lg text-sm font-medium tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Bot className="w-4 h-4 text-[#B38838]" />
                <span>{t('heroCtaAi')}</span>
              </button>
            </div>

            {/* Adjacent Proof Strip (Claim-to-Proof Adjacency) */}
            <div className="pt-6 border-t border-[#E7E2DA] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">4.95 ★</div>
                <div className="text-xs text-[#78716C] mt-0.5">{t('statRating')}</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">12,500+</div>
                <div className="text-xs text-[#78716C] mt-0.5">{t('statClients')}</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">100%</div>
                <div className="text-xs text-[#78716C] mt-0.5">Certified Artists</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">18 Yrs</div>
                <div className="text-xs text-[#78716C] mt-0.5">{t('statYears')}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E7E2DA] bg-[#EFECE6] aspect-[4/3] lg:aspect-[3/4]">
              <img
                src="/src/assets/images/hero_luxury_salon_1791975871694.jpg"
                alt="Glow & Glam Luxury Salon Interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              
              {/* Subtle Luxury Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Quiet Floating Inset Note */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif text-sm font-semibold text-[#1C1917] block">
                      The Flagship Atelier
                    </span>
                    <span className="text-[#78716C] font-medium">Civil Lines, Gurdaspur</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-medium text-[#1C1917] block tabular-nums">09:00 - 20:00</span>
                    <span className="text-[11px] text-[#059669] font-medium">Open Daily</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

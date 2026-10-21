import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { BEFORE_AFTER_GALLERY } from '../data/salonData';
import { Sparkles, ArrowRight, UserCheck, Clock } from 'lucide-react';

export const BeforeAfterGallery: React.FC = () => {
  const { language, openBookingModal } = useSalon();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [revealMode, setRevealMode] = useState<'split' | 'before' | 'after'>('split');

  const t = (key: string) => getTranslation(language, key);
  const activeItem = BEFORE_AFTER_GALLERY[activeItemIndex];

  return (
    <section id="before-after" className="py-16 lg:py-24 bg-[#FAF8F5] border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <div className="text-xs uppercase tracking-widest text-[#B38838] font-semibold">
            {t('beforeAfterHeading')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
            Visible Transformations
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] font-light">
            {t('beforeAfterSubheading')}
          </p>
        </div>

        {/* Gallery Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {BEFORE_AFTER_GALLERY.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveItemIndex(idx)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeItemIndex === idx
                  ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm'
                  : 'bg-white text-[#57534E] border border-[#E7E2DA] hover:bg-[#F5F2EB]'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Card */}
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 lg:p-8 shadow-sm max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Comparison Area (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              
              {/* Reveal Mode Controls */}
              <div className="flex items-center justify-end gap-1 text-xs">
                <span className="text-[#78716C] mr-2">View mode:</span>
                <button
                  onClick={() => setRevealMode('before')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    revealMode === 'before' ? 'bg-[#1C1917] text-white' : 'bg-[#EFECE6] text-[#57534E]'
                  }`}
                >
                  {t('before')}
                </button>
                <button
                  onClick={() => setRevealMode('split')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    revealMode === 'split' ? 'bg-[#1C1917] text-white' : 'bg-[#EFECE6] text-[#57534E]'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setRevealMode('after')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    revealMode === 'after' ? 'bg-[#1C1917] text-white' : 'bg-[#EFECE6] text-[#57534E]'
                  }`}
                >
                  {t('after')}
                </button>
              </div>

              {/* Photos container */}
              {revealMode === 'split' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#EFECE6] border border-[#E7E2DA]">
                    <img
                      src={activeItem.beforeImg}
                      alt={`${activeItem.title} Before`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                      {t('before')}
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#EFECE6] border border-[#E7E2DA]">
                    <img
                      src={activeItem.afterImg}
                      alt={`${activeItem.title} After`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#C5A059] text-[#1C1917] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                      {t('after')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFECE6] border border-[#E7E2DA]">
                  <img
                    src={revealMode === 'before' ? activeItem.beforeImg : activeItem.afterImg}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded ${
                    revealMode === 'before' ? 'bg-black/70 text-white' : 'bg-[#C5A059] text-[#1C1917]'
                  }`}>
                    {revealMode === 'before' ? t('before') : t('after')}
                  </div>
                </div>
              )}

            </div>

            {/* Case Details (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B38838] font-semibold">
                <span>{activeItem.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {activeItem.duration}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
                {activeItem.title}
              </h3>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA]">
                  <span className="font-semibold text-[#78716C] block uppercase text-[10px] mb-1">
                    Initial Consultation & Challenge
                  </span>
                  <p className="text-[#57534E]">{activeItem.beforeDesc}</p>
                </div>

                <div className="p-3 bg-[#FAF6F0] rounded-lg border border-[#E7DECE]">
                  <span className="font-semibold text-[#B38838] block uppercase text-[10px] mb-1">
                    Artistic Formulation & Result
                  </span>
                  <p className="text-[#1C1917] font-medium">{activeItem.afterDesc}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#F5F2EB]">
                <div className="text-xs">
                  <span className="text-[#78716C] block text-[11px]">Crafted by</span>
                  <span className="font-medium text-[#1C1917]">{activeItem.stylist}</span>
                </div>

                <button
                  onClick={() => openBookingModal()}
                  className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Book Similar Look</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

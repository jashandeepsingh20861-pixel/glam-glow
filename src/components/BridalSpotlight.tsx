import React from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { Sparkles, Calendar, CheckCircle2, HeartHandshake } from 'lucide-react';

export const BridalSpotlight: React.FC = () => {
  const { language, openBookingModal } = useSalon();
  const t = (key: string) => getTranslation(language, key);

  const bridalFeatures = [
    {
      title: 'Waterproof HD Airbrush Artistry',
      desc: 'Formulated to withstand emotional wedding vows, warm lighting, and 16+ hours of festivities.',
    },
    {
      title: 'Couture Dupatta Draping & Pinning',
      desc: 'Master draping styles for Sabyasachi, Manish Malhotra, and traditional silk Banarasi sarees.',
    },
    {
      title: 'Bespoke Fresh Floral Hair Sculpting',
      desc: 'Intricate traditional jada, jasmine mogra buns, or romantic modern cascading waves.',
    },
    {
      title: 'Kundan & Polki Jewelry Positioning',
      desc: 'Flawless placement of maang tikka, matha patti, passas, and bridal naths.',
    },
  ];

  return (
    <section id="bridal" className="py-16 lg:py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Showcase Banner Box */}
        <div className="bg-[#FAF6F0] rounded-2xl border border-[#E7DECE] p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visual Column Left (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-xl border border-[#DFD5C5] bg-[#EFECE6] relative group">
                <img
                  src="/src/assets/images/bridal_beauty_makeover_1791975874195.jpg"
                  alt="Royal Indian Bride Makeover"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-white/50 text-xs">
                  <span className="font-serif text-sm font-semibold text-[#1C1917] block">
                    Royal Maharani Signature Look
                  </span>
                  <span className="text-[#B38838] font-medium font-mono tabular-nums">
                    Lead Artist: Ananya Sharma
                  </span>
                </div>
              </div>
            </div>

            {/* Content Column Right (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B38838] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Haute Bridal Lounge</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight leading-snug">
                {t('bridalHeading')}
              </h2>

              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-light">
                {t('bridalSubheading')}
              </p>

              {/* Inclusions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {bridalFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-[#E7DECE]">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#1C1917]">{feat.title}</h4>
                      <p className="text-[11px] text-[#78716C] mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consultation Note & CTA */}
              <div className="pt-4 border-t border-[#E7DECE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#78716C]">
                  <HeartHandshake className="w-4 h-4 text-[#B38838]" />
                  <span>{t('bridalConsultationNote')}</span>
                </div>

                <button
                  onClick={() => openBookingModal('srv-bridal-royal-maharani')}
                  className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>Reserve Bridal Suite</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

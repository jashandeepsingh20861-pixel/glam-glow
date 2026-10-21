import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { ServiceCategory, SalonService } from '../types/salon';
import { 
  Search, 
  Clock, 
  Check, 
  Heart, 
  ArrowRight, 
  Sparkles,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export const ServiceCatalog: React.FC = () => {
  const { 
    services, 
    language, 
    openBookingModal, 
    favorites, 
    toggleFavorite,
    currentRole 
  } = useSalon();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'duration'>('featured');

  const t = (key: string) => getTranslation(language, key);

  const categories: { id: ServiceCategory | 'all'; label: string }[] = [
    { id: 'all', label: t('allCategories') },
    { id: 'haircut', label: t('cat_haircut') },
    { id: 'hair-color-spa', label: t('cat_hair_color_spa') },
    { id: 'facial-skincare', label: t('cat_facial_skincare') },
    { id: 'makeup', label: t('cat_makeup') },
    { id: 'bridal', label: t('cat_bridal') },
    { id: 'manicure-pedicure', label: t('cat_manicure_pedicure') },
    { id: 'waxing-threading', label: t('cat_waxing_threading') },
    { id: 'spa-treatments', label: t('cat_spa_treatments') },
  ];

  // Filtered & sorted services
  const filteredServices = useMemo(() => {
    return services
      .filter(s => s.isActive)
      .filter(s => selectedCategory === 'all' || s.category === selectedCategory)
      .filter(s => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.inclusions.some(inc => inc.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
        // 'featured'
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      });
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="services" className="py-16 lg:py-24 bg-[#F5F2EB]/50 border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <div className="text-xs uppercase tracking-widest text-[#B38838] font-semibold">
            Bespoke Treatments & Rituals
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
            Our Treatment Collection
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] font-light">
            Each service is customized with clinical precision, organic botanical elixirs, and bespoke attention.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-10">
          
          {/* Top row: Search Input + Sorting */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-white border border-[#D7D2C7] focus:border-[#1C1917] focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#1C1917]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#57534E]">
              <span className="text-[#78716C]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort services by"
                className="bg-white border border-[#D7D2C7] rounded-lg px-3 py-2 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                <option value="featured">Featured & Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Treatment Duration</option>
              </select>
            </div>

          </div>

          {/* Interactive Category Tabs: Segmented clean controls (zero-pill discipline) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1C1917] text-[#FAF8F5] shadow-sm font-semibold'
                    : 'bg-white text-[#57534E] border border-[#E7E2DA] hover:bg-[#FAF8F5] hover:text-[#1C1917]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Services Grid: 3-column desktop layout with generous whitespace */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map((service) => {
              const isFav = favorites.includes(service.id);

              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-xl border border-[#E7E2DA] overflow-hidden flex flex-col justify-between hover:border-[#D7D2C7] hover:shadow-lg transition-all duration-200"
                >
                  <div>
                    {/* Image Slot with Fallback Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#EFECE6]">
                      <img
                        src={service.image}
                        alt={service.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Quiet heart favorite button */}
                      <button
                        onClick={() => toggleFavorite(service.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#78716C] hover:text-[#E11D48] transition-colors shadow-sm"
                        aria-label="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-[#E11D48] text-[#E11D48]' : ''}`} />
                      </button>

                      {/* Quiet single text tag (no badge spam) */}
                      {service.isPopular && (
                        <div className="absolute top-3 left-3 bg-[#1C1917]/90 backdrop-blur-sm text-[#FAF8F5] text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                          {t('popularChoice')}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      
                      {/* Metadata: Unboxed Text with typographic separator */}
                      <div className="flex items-center gap-2 text-xs text-[#78716C]">
                        <span className="uppercase tracking-wider font-medium text-[#B38838]">
                          {service.category.replace('-', ' ')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3 h-3 text-[#A8A29E]" />
                          {service.durationMinutes} {t('mins')}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-serif text-lg font-semibold text-[#1C1917] leading-snug group-hover:text-[#B38838] transition-colors">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      {/* Key Inclusions (quiet bullet list) */}
                      <div className="pt-2 border-t border-[#F5F2EB] space-y-1">
                        {service.inclusions.slice(0, 3).map((inc, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#78716C]">
                            <Check className="w-3 h-3 text-[#C5A059] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{inc}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom: Price in tabular numbers + Book CTA */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#F5F2EB] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-lg font-bold text-[#1C1917] tabular-nums">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                        {service.originalPrice && (
                          <span className="font-mono text-xs text-[#A8A29E] line-through tabular-nums">
                            ₹{service.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#A8A29E] block">Exclusive of 18% GST</span>
                    </div>

                    <button
                      onClick={() => openBookingModal(service.id)}
                      className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] active:scale-[0.98] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>{t('bookThisService')}</span>
                      <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E7E2DA] p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-[#A8A29E] mx-auto" />
            <h3 className="font-serif text-lg font-medium text-[#1C1917]">
              {t('noServicesFound')}
            </h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              Try adjusting your search terms or select another treatment category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#B38838] underline underline-offset-4 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

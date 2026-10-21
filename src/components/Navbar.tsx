import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { Language, UserRole } from '../types/salon';
import { 
  Sparkles, 
  Calendar, 
  User, 
  Shield, 
  Globe, 
  Scissors, 
  Bot, 
  Menu, 
  X,
  Heart
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    currentRole, 
    setCurrentRole, 
    openBookingModal, 
    openAiAssistant,
    favorites,
    appointments 
  } = useSalon();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  const roles: { id: UserRole; label: string }[] = [
    { id: 'customer', label: t('roleCustomer') },
    { id: 'owner', label: t('roleOwner') },
    { id: 'manager', label: t('roleManager') },
    { id: 'receptionist', label: t('roleReceptionist') },
    { id: 'stylist', label: t('roleStylist') },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'pb', label: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <>
      {/* Strict Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark in luxury display face */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="#home" 
              className="group flex items-center gap-2.5 transition-transform"
            >
              <div className="w-9 h-9 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center font-serif text-lg font-semibold tracking-wider shadow-sm group-hover:bg-[#C5A059] transition-colors">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap">
                  Glow & Glam
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#78716C] -mt-1 font-sans">
                  Haute Salon · Gurdaspur
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: 4-5 single-line clean text links with hover underline */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide uppercase font-medium text-[#57534E]">
            <a 
              href="#services" 
              className="hover:text-[#1C1917] transition-colors hover:underline underline-offset-8 decoration-[#C5A059] whitespace-nowrap shrink-0"
            >
              {t('navServices')}
            </a>
            <a 
              href="#bridal" 
              className="hover:text-[#1C1917] transition-colors hover:underline underline-offset-8 decoration-[#C5A059] whitespace-nowrap shrink-0"
            >
              {t('navBridal')}
            </a>
            <button 
              onClick={openAiAssistant}
              className="flex items-center gap-1.5 text-[#B38838] font-semibold hover:text-[#916A23] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t('navAiStylist')}</span>
            </button>
            <a 
              href="#before-after" 
              className="hover:text-[#1C1917] transition-colors hover:underline underline-offset-8 decoration-[#C5A059] whitespace-nowrap shrink-0"
            >
              {t('beforeAfterHeading')}
            </a>
            <a 
              href="#account" 
              className="hover:text-[#1C1917] transition-colors hover:underline underline-offset-8 decoration-[#C5A059] whitespace-nowrap shrink-0"
            >
              {t('navMyAppointments')}
            </a>
            {currentRole !== 'customer' && (
              <a 
                href="#admin-desk" 
                className="text-[#991B1B] font-semibold hover:text-[#7F1D1D] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('navAdminPortal')}</span>
              </a>
            )}
          </nav>

          {/* Zone 3: 1 primary action + Language Switcher + Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Language Selector Dropdown */}
            <div className="flex items-center bg-[#EFECE6] p-1 rounded-lg border border-[#E2DDD5]">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
                    language === l.code
                      ? 'bg-white text-[#1C1917] shadow-sm font-semibold'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                  title={l.label}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentRole !== 'customer' 
                    ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]' 
                    : 'bg-[#FAF8F5] border-[#E7E2DA] text-[#57534E] hover:border-[#D7D2C7]'
                }`}
                title="Switch demo view role"
              >
                {currentRole !== 'customer' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{roles.find(r => r.id === currentRole)?.label}</span>
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E7E2DA] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E]">
                    Switch Perspective
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        currentRole === r.id 
                          ? 'bg-[#FAF8F5] text-[#1C1917] font-semibold' 
                          : 'text-[#57534E] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      <span>{r.label}</span>
                      {currentRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => openBookingModal()}
              className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] active:scale-[0.98] px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">{t('bookAppointmentBtn')}</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#57534E] hover:text-[#1C1917]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E7E2DA] px-4 pt-3 pb-6 space-y-3">
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#1C1917] border-b border-[#E7E2DA]"
            >
              {t('navServices')}
            </a>
            <a 
              href="#bridal" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#1C1917] border-b border-[#E7E2DA]"
            >
              {t('navBridal')}
            </a>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                openAiAssistant();
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#B38838] flex items-center gap-2 border-b border-[#E7E2DA]"
            >
              <Bot className="w-4 h-4" />
              <span>{t('navAiStylist')}</span>
            </button>
            <a 
              href="#before-after" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#1C1917] border-b border-[#E7E2DA]"
            >
              {t('beforeAfterHeading')}
            </a>
            <a 
              href="#account" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#1C1917] border-b border-[#E7E2DA]"
            >
              {t('navMyAppointments')}
            </a>
            {currentRole !== 'customer' && (
              <a 
                href="#admin-desk" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#991B1B]"
              >
                {t('navAdminPortal')}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Sticky Mobile Thumb Bar (≤ 15% viewport height compliance) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E7E2DA] py-2 px-3 flex items-center justify-around shadow-lg">
        <a 
          href="#home" 
          className="flex flex-col items-center gap-1 text-[11px] text-[#78716C] hover:text-[#1C1917]"
        >
          <Scissors className="w-4 h-4" />
          <span>Home</span>
        </a>
        <a 
          href="#services" 
          className="flex flex-col items-center gap-1 text-[11px] text-[#78716C] hover:text-[#1C1917]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Services</span>
        </a>
        <button 
          onClick={() => openBookingModal()}
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-[#1C1917] text-[#FAF8F5] shadow-lg border-2 border-[#FAF8F5]"
        >
          <Calendar className="w-5 h-5 text-[#C5A059]" />
        </button>
        <button 
          onClick={openAiAssistant}
          className="flex flex-col items-center gap-1 text-[11px] text-[#B38838] font-medium"
        >
          <Bot className="w-4 h-4" />
          <span>AI Stylist</span>
        </button>
        <a 
          href="#account" 
          className="flex flex-col items-center gap-1 text-[11px] text-[#78716C] hover:text-[#1C1917]"
        >
          <User className="w-4 h-4" />
          <span>My Visits</span>
        </a>
      </div>
    </>
  );
};

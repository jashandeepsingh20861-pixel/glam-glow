import React from 'react';
import { SalonProvider } from './context/SalonContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { BridalSpotlight } from './components/BridalSpotlight';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { CustomerAccount } from './components/CustomerAccount';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AiBeautyAssistant } from './components/AiBeautyAssistant';
import { InvoiceModal } from './components/InvoiceModal';

export default function App() {
  return (
    <SalonProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-sans-clean selection:bg-[#EBDDC8] selection:text-[#1C1917]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <ServiceCatalog />
          <BridalSpotlight />
          <BeforeAfterGallery />
          <CustomerAccount />
          <AdminDashboard />
        </main>

        {/* Salon Footer */}
        <Footer />

        {/* Interactive Modals & Concierge Drawers */}
        <BookingModal />
        <AiBeautyAssistant />
        <InvoiceModal />
      </div>
    </SalonProvider>
  );
}

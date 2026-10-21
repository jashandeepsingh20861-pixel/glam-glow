import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { Appointment } from '../types/salon';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Heart,
  Award,
  RefreshCw,
  Printer
} from 'lucide-react';

export const CustomerAccount: React.FC = () => {
  const { 
    appointments, 
    customerUser, 
    loyaltyPoints, 
    favorites, 
    services, 
    language,
    rescheduleAppointment,
    cancelAppointment,
    openBookingModal,
    setActiveInvoiceAppointment,
    salonConfig,
    getAvailableTimeSlots
  } = useSalon();

  const t = (key: string) => getTranslation(language, key);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'loyalty' | 'favorites'>('upcoming');
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newSlot, setNewSlot] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // User appointments
  const userAppointments = appointments.filter(apt => 
    apt.customerPhone === customerUser.phone || apt.customerId === customerUser.id
  );

  const upcomingVisits = userAppointments.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'rescheduled' || apt.status === 'in-service'
  );

  const pastVisits = userAppointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled' || apt.status === 'no-show'
  );

  // Reschedule slots calculation
  const availableSlotsForReschedule = reschedulingApt && newDate 
    ? getAvailableTimeSlots(newDate, reschedulingApt.durationMinutes, reschedulingApt.staffId)
    : [];

  const handleOpenReschedule = (apt: Appointment) => {
    setReschedulingApt(apt);
    setNewDate(apt.date);
    setNewSlot(apt.timeSlot);
    setRescheduleError(null);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newDate || !newSlot) {
      setRescheduleError('Please select both a valid date and available time slot.');
      return;
    }
    const success = rescheduleAppointment(reschedulingApt.id, newDate, newSlot);
    if (success) {
      setReschedulingApt(null);
    } else {
      setRescheduleError('Failed to reschedule. Please try another slot.');
    }
  };

  const handleCancelClick = (id: string) => {
    if (window.confirm(`${t('cancelConfirmMessage')}\n\n${t('cancellationPolicyNotice')}`)) {
      cancelAppointment(id);
    }
  };

  const favoriteServices = services.filter(s => favorites.includes(s.id));

  return (
    <section id="account" className="py-16 lg:py-24 bg-[#FAF8F5] border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Customer Header Strip */}
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 lg:p-8 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#E7DECE] flex items-center justify-center font-serif text-2xl font-bold text-[#1C1917]">
              {customerUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
                  {customerUser.name}
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FAF6F0] border border-[#E7DECE] text-[#B38838] px-2 py-0.5 rounded">
                  VIP Club Member
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#78716C] mt-1 font-mono">
                <span>{customerUser.phone}</span>
                <span aria-hidden="true">·</span>
                <span>{customerUser.email}</span>
              </div>
            </div>
          </div>

          {/* Loyalty Points Capsule */}
          <div className="bg-[#FAF6F0] border border-[#E7DECE] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#78716C] block">
                {t('loyaltyPoints')}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-[#1C1917] tabular-nums">
                  {loyaltyPoints}
                </span>
                <span className="text-xs text-[#059669] font-medium">(= ₹{loyaltyPoints} Credit)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E7E2DA] pb-3 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm'
                : 'text-[#57534E] hover:bg-[#F5F2EB]'
            }`}
          >
            {t('upcomingBookings')} ({upcomingVisits.length})
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'past'
                ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm'
                : 'text-[#57534E] hover:bg-[#F5F2EB]'
            }`}
          >
            {t('pastBookings')} ({pastVisits.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm'
                : 'text-[#57534E] hover:bg-[#F5F2EB]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>Saved Rituals ({favoriteServices.length})</span>
          </button>
        </div>

        {/* TAB 1: Upcoming Visits */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingVisits.length > 0 ? (
              upcomingVisits.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-xl border border-[#E7E2DA] p-5 shadow-sm hover:border-[#D7D2C7] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#B38838]">
                          {apt.referenceNumber}
                        </span>
                        <span aria-hidden="true" className="text-[#D6CEBF]">·</span>
                        <span className="text-[10px] uppercase font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
                          {t(`status_${apt.status}`)}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-[#1C1917] mt-1">
                        {apt.serviceName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#78716C] mt-2 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B38838]" />
                          {apt.date} at {apt.timeSlot}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#B38838]" />
                          {apt.staffName}
                        </span>
                        <span>·</span>
                        <span className="font-bold text-[#1C1917] tabular-nums">
                          ₹{apt.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setActiveInvoiceAppointment(apt)}
                        className="px-3 py-1.5 border border-[#D7D2C7] hover:bg-[#F5F2EB] text-[#1C1917] rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#B38838]" />
                        <span>{t('viewInvoiceBtn')}</span>
                      </button>

                      <button
                        onClick={() => handleOpenReschedule(apt)}
                        className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F3ECE0] text-[#B38838] border border-[#E7DECE] rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t('rescheduleBtn')}</span>
                      </button>

                      <button
                        onClick={() => handleCancelClick(apt.id)}
                        className="px-3 py-1.5 bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      >
                        {t('cancelBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-[#E7E2DA] p-12 text-center space-y-3">
                <Calendar className="w-8 h-8 text-[#A8A29E] mx-auto" />
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                  {t('noUpcomingBookings')}
                </h3>
                <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                  Treat yourself to a signature facial, precision hair styling, or relaxing spa therapy.
                </p>
                <button
                  onClick={() => openBookingModal()}
                  className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-block cursor-pointer"
                >
                  {t('bookAppointmentBtn')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Past Visits */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastVisits.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-[#E7E2DA] p-5 shadow-sm opacity-90"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#78716C]">
                        {apt.referenceNumber}
                      </span>
                      <span aria-hidden="true" className="text-[#D6CEBF]">·</span>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        apt.status === 'completed'
                          ? 'bg-[#F0FDF4] text-[#166534]'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {t(`status_${apt.status}`)}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-[#1C1917] mt-1">
                      {apt.serviceName}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-[#78716C] mt-1 font-mono">
                      <span>{apt.date}</span>
                      <span>·</span>
                      <span>{apt.staffName}</span>
                      <span>·</span>
                      <span className="font-bold text-[#1C1917]">₹{apt.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveInvoiceAppointment(apt)}
                      className="px-3 py-1.5 border border-[#D7D2C7] hover:bg-[#F5F2EB] text-[#1C1917] rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#B38838]" />
                      <span>{t('viewInvoiceBtn')}</span>
                    </button>

                    <button
                      onClick={() => openBookingModal(apt.serviceId)}
                      className="px-3 py-1.5 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Book Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Saved Favorites */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-xl border border-[#E7E2DA] p-4 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#1C1917]">{srv.name}</h4>
                  <p className="text-xs text-[#78716C] mt-1 line-clamp-2">{srv.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F5F2EB] flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#1C1917]">
                    ₹{srv.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => openBookingModal(srv.id)}
                    className="bg-[#1C1917] text-white hover:bg-[#292524] px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Modal */}
        {reschedulingApt && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-3">
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Reschedule Appointment
                </h3>
                <button
                  onClick={() => setReschedulingApt(null)}
                  className="p-1 text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {rescheduleError && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs text-[#991B1B]">
                  {rescheduleError}
                </div>
              )}

              <div className="text-xs text-[#78716C]">
                Treatment: <strong className="text-[#1C1917]">{reschedulingApt.serviceName}</strong> with {reschedulingApt.staffName}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Choose New Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Available Slots for {newDate}
                </label>
                {availableSlotsForReschedule.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlotsForReschedule.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setNewSlot(slot)}
                        className={`p-2 text-xs font-mono rounded border text-center transition-all ${
                          newSlot === slot
                            ? 'bg-[#1C1917] text-white border-[#1C1917]'
                            : 'bg-white border-[#E7E2DA] hover:border-[#1C1917]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#78716C]">
                    No available slots for this date. Please pick another date.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-end gap-2">
                <button
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 border border-[#D7D2C7] rounded-lg text-xs text-[#57534E]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  className="px-5 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold"
                >
                  Confirm New Slot
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

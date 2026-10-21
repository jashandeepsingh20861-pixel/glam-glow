import React, { useState, useEffect, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { SalonService, StaffMember, PaymentMethod } from '../types/salon';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  Printer,
  Download,
  Share2
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    preselectedServiceId,
    services, 
    staff, 
    language,
    salonConfig,
    customerUser,
    getAvailableTimeSlots,
    validateCoupon,
    createAppointment,
    setActiveInvoiceAppointment
  } = useSalon();

  const t = (key: string) => getTranslation(language, key);

  // Flow step management (1: Service, 2: Professional, 3: Date & Slot, 4: Customer Details, 5: Payment, 6: Success Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Booking Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Coupon State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_at_salon');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState<boolean>(false);
  const [upiVerified, setUpiVerified] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      const initialService = preselectedServiceId || services[0]?.id || '';
      setSelectedServiceId(initialService);
      setSelectedStaffId('any');
      
      // Default to tomorrow or today
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const formattedDate = tomorrow.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
      
      setSelectedTimeSlot('');
      setName(customerUser.name || '');
      setPhone(customerUser.phone || '');
      setEmail(customerUser.email || '');
      setNotes('');
      setCouponInput('');
      setAppliedDiscount(0);
      setCouponMessage(null);
      setAppliedCouponCode('');
      setPaymentMethod('pay_at_salon');
      setUpiVerified(false);
      setConfirmedBooking(null);
      setErrorMessage(null);
      setCurrentStep(preselectedServiceId ? 2 : 1);
    }
  }, [isBookingModalOpen, preselectedServiceId, services, customerUser]);

  // Active Service
  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  // Dynamic Available Slots based on staff schedule, existing bookings, and 15m cleaning buffer
  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedService) return [];
    return getAvailableTimeSlots(selectedDate, selectedService.durationMinutes, selectedStaffId);
  }, [selectedDate, selectedService, selectedStaffId, getAvailableTimeSlots]);

  // Keep selected slot valid
  useEffect(() => {
    if (selectedTimeSlot && !availableSlots.includes(selectedTimeSlot)) {
      setSelectedTimeSlot('');
    }
  }, [availableSlots, selectedTimeSlot]);

  // Financial calculations with 18% GST (9% CGST + 9% SGST)
  const financialSummary = useMemo(() => {
    const serviceRate = selectedService?.price || 0;
    const discount = appliedDiscount;
    const taxableSubtotal = Math.max(0, serviceRate - discount);
    const taxAmount = Math.round(taxableSubtotal * salonConfig.gstRate);
    const totalAmount = taxableSubtotal + taxAmount;

    return {
      serviceRate,
      discount,
      taxableSubtotal,
      taxAmount,
      totalAmount,
    };
  }, [selectedService, appliedDiscount, salonConfig.gstRate]);

  if (!isBookingModalOpen) return null;

  // Coupon handle
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = validateCoupon(couponInput, selectedService?.price || 0, selectedService?.category || '');
    if (result.valid) {
      setAppliedDiscount(result.discount);
      setAppliedCouponCode(result.coupon?.code || couponInput.toUpperCase());
      setCouponMessage({ text: result.message, isError: false });
    } else {
      setAppliedDiscount(0);
      setAppliedCouponCode('');
      setCouponMessage({ text: result.message, isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput('');
    setAppliedDiscount(0);
    setAppliedCouponCode('');
    setCouponMessage(null);
  };

  // UPI verification simulation
  const handleSimulateUpiPayment = () => {
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setUpiVerified(true);
    }, 1200);
  };

  // Submit and confirm booking with immediate slot re-validation
  const handleConfirmBooking = () => {
    setErrorMessage(null);

    // Form validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number for appointment confirmations.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please select an available time slot.');
      return;
    }

    setIsSubmitting(true);

    // Revalidate slot availability immediately before locking to prevent collision
    const freshlyAvailable = getAvailableTimeSlots(selectedDate, selectedService.durationMinutes, selectedStaffId);
    if (!freshlyAvailable.includes(selectedTimeSlot)) {
      setIsSubmitting(false);
      setErrorMessage('This slot was just reserved or is no longer available. Please select another time.');
      return;
    }

    // Determine staff assignment (if "any", pick first free eligible staff)
    let assignedStaffId = selectedStaffId;
    let assignedStaffName = 'Dedicated Senior Specialist';

    if (selectedStaffId === 'any') {
      const matchStaff = staff.find(s => !s.isOnLeave && s.specialties.includes(selectedService.category)) || staff[0];
      assignedStaffId = matchStaff.id;
      assignedStaffName = matchStaff.name;
    } else {
      const s = staff.find(st => st.id === selectedStaffId);
      if (s) assignedStaffName = s.name;
    }

    setTimeout(() => {
      const paymentStatus = paymentMethod === 'pay_at_salon' ? 'pending' : 'paid';
      const paymentReference = paymentMethod === 'upi' 
        ? `UPI-${Date.now().toString().slice(-8)}` 
        : paymentMethod === 'card_online' 
        ? `RZP-PAY-${Date.now().toString().slice(-6)}` 
        : undefined;

      const created = createAppointment({
        customerId: customerUser.id,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.category,
        staffId: assignedStaffId,
        staffName: assignedStaffName,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        durationMinutes: selectedService.durationMinutes,
        price: financialSummary.serviceRate,
        discountAmount: financialSummary.discount,
        taxAmount: financialSummary.taxAmount,
        totalAmount: financialSummary.totalAmount,
        paymentMethod,
        paymentStatus,
        paymentReference,
        status: 'confirmed',
        notes: notes.trim() || undefined,
      });

      setIsSubmitting(false);
      setConfirmedBooking(created);
      setCurrentStep(6);
    }, 600);
  };

  // Add to Calendar .ics file helper
  const handleDownloadCalendarInvite = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Glow & Glam Salon//Appointment System//EN
BEGIN:VEVENT
SUMMARY:${confirmedBooking.serviceName} - Glow & Glam Salon
DESCRIPTION:Reservation #${confirmedBooking.referenceNumber} with ${confirmedBooking.staffName}. Address: ${salonConfig.address}, ${salonConfig.city}.
LOCATION:${salonConfig.address}, ${salonConfig.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GlowGlam-${confirmedBooking.referenceNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E7E2DA] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B38838]">
              Glow & Glam Concierge
            </span>
            <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
              {currentStep === 6 ? t('bookingSuccessTitle') : t('bookingTitle')}
            </h3>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-lg text-[#78716C] hover:bg-[#F5F2EB] hover:text-[#1C1917] transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Only visible before confirmation) */}
        {currentStep < 6 && (
          <div className="px-6 py-3 bg-[#FAF6F0] border-b border-[#E7DECE] overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-3 text-xs font-medium min-w-max">
              {[
                { step: 1, label: t('stepService') },
                { step: 2, label: t('stepStaff') },
                { step: 3, label: t('stepDateTime') },
                { step: 4, label: t('stepDetails') },
                { step: 5, label: t('stepPayment') },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    // Only allow backward navigation or forward if service is selected
                    if (s.step < currentStep || (s.step === 2 && selectedServiceId)) {
                      setCurrentStep(s.step);
                    }
                  }}
                  disabled={s.step > currentStep}
                  className={`flex items-center gap-1.5 transition-colors ${
                    currentStep === s.step
                      ? 'text-[#1C1917] font-bold'
                      : s.step < currentStep
                      ? 'text-[#059669] cursor-pointer'
                      : 'text-[#A8A29E] cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep === s.step
                      ? 'bg-[#1C1917] text-white'
                      : s.step < currentStep
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#E7E2DA] text-[#78716C]'
                  }`}>
                    {s.step < currentStep ? '✓' : s.step}
                  </span>
                  <span>{s.label}</span>
                  {s.step < 5 && <ChevronRight className="w-3 h-3 text-[#D6CEBF]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2.5 text-xs text-[#991B1B]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-xs text-[#78716C]">
                Select the luxury ritual you wish to book:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {services.filter(s => s.isActive).map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      selectedServiceId === srv.id
                        ? 'bg-white border-[#1C1917] shadow-md ring-1 ring-[#1C1917]'
                        : 'bg-white/80 border-[#E7E2DA] hover:border-[#C5A059]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-sm font-semibold text-[#1C1917] leading-snug">
                          {srv.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#1C1917] tabular-nums shrink-0">
                          ₹{srv.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-1 line-clamp-2">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-[10px] text-[#A8A29E]">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {srv.durationMinutes} mins
                      </span>
                      <span className="uppercase text-[#B38838] font-medium">{srv.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Specialist Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-[#78716C]">
                Choose your specialist for {selectedService?.name}:
              </div>

              {/* Any Available Option */}
              <div
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedStaffId === 'any'
                    ? 'bg-white border-[#1C1917] shadow-md ring-1 ring-[#1C1917]'
                    : 'bg-white/80 border-[#E7E2DA] hover:border-[#C5A059]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E7DECE] flex items-center justify-center text-[#B38838]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1C1917]">{t('anyStaff')}</h4>
                      <p className="text-[11px] text-[#78716C]">{t('anyStaffDesc')}</p>
                    </div>
                  </div>
                  {selectedStaffId === 'any' && <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />}
                </div>
              </div>

              {/* Specific Staff Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staff
                  .filter(st => !st.isOnLeave && st.specialties.includes(selectedService.category))
                  .map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedStaffId === st.id
                          ? 'bg-white border-[#1C1917] shadow-md ring-1 ring-[#1C1917]'
                          : 'bg-white/80 border-[#E7E2DA] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#E7E2DA]"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-[#1C1917]">{st.name}</h4>
                          <p className="text-[10px] text-[#B38838] font-medium">{st.role}</p>
                          <div className="flex items-center gap-2 text-[10px] text-[#78716C] mt-0.5">
                            <span className="font-mono tabular-nums">{st.rating} ★</span>
                            <span>·</span>
                            <span>{st.experienceYears} {t('experience')}</span>
                          </div>
                        </div>
                      </div>
                      {selectedStaffId === st.id && <CheckCircle2 className="w-4 h-4 text-[#1C1917] shrink-0" />}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3: Date & Live Available Slots */}
          {currentStep === 3 && (
            <div className="space-y-5">
              
              {/* Date Input */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  {t('selectDateTitle')}
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white border border-[#D7D2C7] rounded-lg px-4 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none focus:border-[#1C1917] w-full sm:w-64"
                />
              </div>

              {/* Time Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#1C1917]">
                    {t('selectTimeSlotTitle')}
                  </label>
                  <span className="text-[11px] text-[#78716C] font-mono">
                    Treatment Duration: {selectedService?.durationMinutes} mins
                  </span>
                </div>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-2 text-xs font-mono font-medium rounded-lg border transition-all text-center cursor-pointer tabular-nums ${
                          selectedTimeSlot === slot
                            ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm font-semibold'
                            : 'bg-white text-[#57534E] border-[#E7E2DA] hover:border-[#1C1917]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-xl border border-[#E7E2DA] text-center space-y-1">
                    <p className="text-xs font-medium text-[#1C1917]">
                      {t('noSlotsAvailable')}
                    </p>
                    <p className="text-[11px] text-[#78716C]">
                      Please choose another date or change the selected staff member.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 4: Customer Details Form */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {t('customerName')} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meera Kapoor"
                    className="w-full bg-white border border-[#D7D2C7] rounded-lg px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {t('customerPhone')} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-white border border-[#D7D2C7] rounded-lg px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  {t('customerEmail')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="meera@example.com (for digital receipt)"
                  className="w-full bg-white border border-[#D7D2C7] rounded-lg px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  {t('bookingNotes')}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any allergies, styling preferences, or occasion details..."
                  className="w-full bg-white border border-[#D7D2C7] rounded-lg p-3 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="pt-2 border-t border-[#E7E2DA]">
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  {t('couponCode')}
                </label>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="FIRSTGLOW / BRIDAL1500 / FESTIVE500"
                    disabled={appliedDiscount > 0}
                    className="bg-white border border-[#D7D2C7] rounded-lg px-3.5 py-2 text-xs uppercase font-mono text-[#1C1917] focus:outline-none focus:border-[#1C1917] w-full sm:w-64"
                  />
                  {appliedDiscount > 0 ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-3 py-2 bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA] rounded-lg text-xs font-semibold transition-colors"
                    >
                      {t('removeCoupon')}
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      {t('applyCoupon')}
                    </button>
                  )}
                </div>

                {couponMessage && (
                  <p className={`text-xs mt-1.5 font-medium ${couponMessage.isError ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Payment Method & Transparent Tax Breakdown */}
          {currentStep === 5 && (
            <div className="space-y-6">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-2.5">
                  {t('selectPaymentMethod')}
                </label>

                <div className="space-y-2.5">
                  
                  {/* Pay at Salon */}
                  <div
                    onClick={() => setPaymentMethod('pay_at_salon')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'pay_at_salon'
                        ? 'bg-white border-[#1C1917] ring-1 ring-[#1C1917]'
                        : 'bg-white/80 border-[#E7E2DA] hover:border-[#C5A059]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'pay_at_salon'}
                      onChange={() => setPaymentMethod('pay_at_salon')}
                      className="mt-1"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#1C1917] block">
                        {t('payAtSalon')}
                      </span>
                      <span className="text-[11px] text-[#78716C]">
                        Reserve your slot now without immediate deduction. Pay via Cash, UPI, or Card at the salon reception.
                      </span>
                    </div>
                  </div>

                  {/* Instant UPI Simulator */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'upi'
                        ? 'bg-white border-[#1C1917] ring-1 ring-[#1C1917]'
                        : 'bg-white/80 border-[#E7E2DA] hover:border-[#C5A059]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-[#B38838]" />
                          {t('payUpi')}
                        </span>
                        <span className="text-[10px] text-[#059669] font-medium bg-[#ECFDF5] px-2 py-0.5 rounded">
                          Zero Convenience Fee
                        </span>
                      </div>
                      <span className="text-[11px] text-[#78716C] block mt-0.5">
                        Scan the salon merchant QR code or pay via VPA: <strong className="font-mono text-[#1C1917]">{salonConfig.upiId}</strong>
                      </span>

                      {paymentMethod === 'upi' && (
                        <div className="mt-3 p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-white rounded border border-[#D7D2C7] p-1 flex items-center justify-center">
                              <QrCode className="w-10 h-10 text-[#1C1917]" />
                            </div>
                            <div className="text-[11px]">
                              <span className="font-semibold block text-[#1C1917]">{salonConfig.upiMerchantName}</span>
                              <span className="text-[#78716C] font-mono text-[10px]">{salonConfig.upiId}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSimulateUpiPayment();
                            }}
                            disabled={isVerifyingUpi || upiVerified}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              upiVerified 
                                ? 'bg-[#059669] text-white' 
                                : 'bg-[#1C1917] text-white hover:bg-[#292524]'
                            }`}
                          >
                            {isVerifyingUpi ? 'Verifying...' : upiVerified ? '✓ Verified' : 'Simulate UPI App Scan'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NetBanking / Card */}
                  <div
                    onClick={() => setPaymentMethod('card_online')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'card_online'
                        ? 'bg-white border-[#1C1917] ring-1 ring-[#1C1917]'
                        : 'bg-white/80 border-[#E7E2DA] hover:border-[#C5A059]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card_online'}
                      onChange={() => setPaymentMethod('card_online')}
                      className="mt-1"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#B38838]" />
                        {t('payCardOnline')}
                      </span>
                      <span className="text-[11px] text-[#78716C]">
                        Visa, Mastercard, RuPay, HDFC, ICICI, SBI NetBanking via encrypted gateway.
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-white rounded-xl border border-[#E7E2DA] space-y-2 text-xs">
                <div className="font-semibold text-[#1C1917] border-b border-[#F5F2EB] pb-1.5">
                  {t('priceSummary')}
                </div>

                <div className="flex justify-between text-[#57534E]">
                  <span>{selectedService?.name}</span>
                  <span className="font-mono tabular-nums">₹{financialSummary.serviceRate.toLocaleString('en-IN')}</span>
                </div>

                {financialSummary.discount > 0 && (
                  <div className="flex justify-between text-[#059669] font-medium">
                    <span>Discount ({appliedCouponCode})</span>
                    <span className="font-mono tabular-nums">-₹{financialSummary.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#78716C] text-[11px]">
                  <span>Taxes (9% CGST + 9% SGST)</span>
                  <span className="font-mono tabular-nums">+₹{financialSummary.taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-[#E7E2DA] flex justify-between items-baseline font-bold text-sm text-[#1C1917]">
                  <span>{t('grandTotal')}</span>
                  <span className="font-mono text-base text-[#1C1917] tabular-nums">
                    ₹{financialSummary.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 6: Confirmation Screen & Digital Receipt */}
          {currentStep === 6 && confirmedBooking && (
            <div className="text-center space-y-6 py-2">
              <div className="w-14 h-14 bg-[#ECFDF5] text-[#059669] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  {t('bookingSuccessTitle')}
                </h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-md mx-auto">
                  {t('bookingSuccessSubtitle')} A WhatsApp confirmation and SMS reminder have been initiated.
                </p>
              </div>

              {/* Formatted Receipt Card */}
              <div className="bg-white rounded-xl border border-[#E7E2DA] p-5 max-w-md mx-auto text-left space-y-3 shadow-sm text-xs">
                <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-2.5">
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase font-semibold">
                      {t('referenceNumber')}
                    </span>
                    <div className="font-mono text-sm font-bold text-[#1C1917]">
                      {confirmedBooking.referenceNumber}
                    </div>
                  </div>
                  <span className="bg-[#ECFDF5] text-[#059669] font-medium text-[10px] px-2 py-0.5 rounded">
                    {confirmedBooking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#A8A29E] block">Service</span>
                    <span className="font-medium text-[#1C1917]">{confirmedBooking.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block">Specialist</span>
                    <span className="font-medium text-[#1C1917]">{confirmedBooking.staffName}</span>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block">Date & Time</span>
                    <span className="font-mono font-medium text-[#1C1917]">
                      {confirmedBooking.date} at {confirmedBooking.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block">Total Amount</span>
                    <span className="font-mono font-bold text-[#1C1917]">
                      ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F5F2EB] text-[11px] text-[#78716C]">
                  <span className="block font-medium text-[#1C1917]">Salon Location:</span>
                  <span>{salonConfig.address}, {salonConfig.city}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadCalendarInvite}
                  className="px-4 py-2 bg-white border border-[#D7D2C7] hover:bg-[#F5F2EB] text-[#1C1917] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-[#B38838]" />
                  <span>{t('addToCalendar')}</span>
                </button>

                <button
                  onClick={() => {
                    closeBookingModal();
                    setActiveInvoiceAppointment(confirmedBooking);
                  }}
                  className="px-4 py-2 bg-white border border-[#D7D2C7] hover:bg-[#F5F2EB] text-[#1C1917] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B38838]" />
                  <span>{t('downloadReceipt')}</span>
                </button>

                <button
                  onClick={closeBookingModal}
                  className="px-6 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  {t('closeModal')}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls (Steps 1 to 5) */}
        {currentStep < 6 && (
          <div className="px-6 py-4 border-t border-[#E7E2DA] bg-white flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 border border-[#D7D2C7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                onClick={() => {
                  setErrorMessage(null);
                  if (currentStep === 1 && !selectedServiceId) {
                    setErrorMessage('Please select a service.');
                    return;
                  }
                  if (currentStep === 3 && !selectedTimeSlot) {
                    setErrorMessage('Please pick an available time slot.');
                    return;
                  }
                  if (currentStep === 4 && (!name.trim() || !phone.trim())) {
                    setErrorMessage('Please enter your name and phone number.');
                    return;
                  }
                  setCurrentStep(prev => prev + 1);
                }}
                className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] disabled:opacity-50 px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('processingBooking')}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                    <span>{t('confirmBookingBtn')} (₹{financialSummary.totalAmount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { SalonService, StaffMember, Appointment, BookingStatus, UserRole } from '../types/salon';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Plus, 
  Edit3, 
  ShieldAlert, 
  Settings,
  Scissors
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    appointments, 
    updateAppointmentStatus, 
    services, 
    addService, 
    updateService, 
    toggleServiceActive, 
    staff, 
    toggleStaffLeave, 
    inventory, 
    restockInventory, 
    salonConfig, 
    updateSalonConfig,
    language 
  } = useSalon();

  const t = (key: string) => getTranslation(language, key);

  const [activeTab, setActiveTab] = useState<'calendar' | 'services' | 'staff' | 'inventory' | 'settings'>('calendar');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // New service modal state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<any>('haircut');
  const [newServicePrice, setNewServicePrice] = useState<number>(1500);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(45);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Salon Settings state
  const [configForm, setConfigForm] = useState(salonConfig);

  // If role is customer, show a helpful access bridge to switch roles
  if (currentRole === 'customer') {
    return (
      <section id="admin-desk" className="py-16 bg-[#F5F2EB]/40 border-t border-[#E7E2DA]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#E7E2DA] text-[#991B1B]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
            Salon Operations Desk
          </h3>
          <p className="text-xs text-[#78716C] max-w-md mx-auto">
            You are currently browsing as a <strong>Client</strong>. To preview the real-time salon operations desk, staff rosters, inventory alerts, and revenue reporting, switch to an administrative role below:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {(['owner', 'manager', 'receptionist', 'stylist'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setCurrentRole(r)}
                className="px-4 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer shadow-sm"
              >
                Access as {r}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Business KPIs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === todayStr);
  const totalRevenue = appointments
    .filter(apt => apt.paymentStatus === 'paid')
    .reduce((acc, apt) => acc + apt.totalAmount, 0);
  const pendingRevenue = appointments
    .filter(apt => apt.paymentStatus === 'pending')
    .reduce((acc, apt) => acc + apt.totalAmount, 0);
  const staffOnDuty = staff.filter(s => !s.isOnLeave).length;

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    if (selectedDateFilter !== 'all' && apt.date !== selectedDateFilter) return false;
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    return true;
  });

  // Export Appointments to CSV
  const handleExportCsv = () => {
    const headers = [
      'Reference Number',
      'Date',
      'Time Slot',
      'Customer Name',
      'Customer Phone',
      'Treatment',
      'Specialist',
      'Subtotal (INR)',
      'Tax (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Booking Status',
    ];

    const rows = appointments.map(apt => [
      apt.referenceNumber,
      apt.date,
      apt.timeSlot,
      `"${apt.customerName}"`,
      apt.customerPhone,
      `"${apt.serviceName}"`,
      `"${apt.staffName}"`,
      apt.price,
      apt.taxAmount,
      apt.totalAmount,
      apt.paymentMethod,
      apt.paymentStatus,
      apt.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GlowGlam_Appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    addService({
      name: newServiceName.trim(),
      category: newServiceCategory,
      price: Number(newServicePrice),
      durationMinutes: Number(newServiceDuration),
      description: newServiceDesc.trim() || 'Custom salon ritual created by salon manager.',
      image: '/src/assets/images/hero_luxury_salon_1791975871694.jpg',
      inclusions: ['Personalized Consultation', 'Treatment Application', 'Finishing Style'],
      isActive: true,
    });

    setNewServiceName('');
    setNewServiceDesc('');
    setIsAddServiceOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonConfig(configForm);
    alert('Salon settings saved successfully!');
  };

  return (
    <section id="admin-desk" className="py-12 lg:py-16 bg-[#F5F2EB]/50 border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Desk Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2DA] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#991B1B]">
                Management Console
              </span>
              <span className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                Role: {currentRole}
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
              {t('adminDashboardTitle')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-white border border-[#D7D2C7] hover:bg-[#F5F2EB] text-[#1C1917] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B38838]" />
              <span>{t('exportCsv')}</span>
            </button>

            <button
              onClick={() => setCurrentRole('customer')}
              className="px-3.5 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
            >
              Exit to Customer View
            </button>
          </div>
        </div>

        {/* 4-KPI Overview Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">{t('todayBookings')}</span>
              <Calendar className="w-4 h-4 text-[#B38838]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums">
              {todayAppointments.length}
            </div>
            <span className="text-[11px] text-[#059669] mt-1 block">Active on salon schedule</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">{t('totalRevenue')}</span>
              <DollarSign className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[#78716C] mt-1 block">Verified & Collected</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">{t('pendingPayments')}</span>
              <Clock className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums">
              ₹{pendingRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[#B45309] mt-1 block">Pay at Salon arrivals</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">{t('staffOnDuty')}</span>
              <Users className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums">
              {staffOnDuty} / {staff.length}
            </div>
            <span className="text-[11px] text-[#2563EB] mt-1 block">Specialists active</span>
          </div>

        </div>

        {/* Admin Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E7E2DA] pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'calendar', label: t('tabCalendar'), icon: Calendar },
            { id: 'services', label: t('tabServices'), icon: Scissors },
            { id: 'staff', label: t('tabStaff'), icon: Users },
            { id: 'inventory', label: t('tabInventory'), icon: Package },
            { id: 'settings', label: t('tabSettings'), icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1C1917] text-[#FAF8F5] shadow-sm'
                    : 'text-[#57534E] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Appointment Desk Matrix */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            
            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E7E2DA]">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#78716C] font-semibold">Filter Date:</span>
                <input
                  type="date"
                  value={selectedDateFilter === 'all' ? '' : selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value || 'all')}
                  className="bg-[#FAF8F5] border border-[#D7D2C7] rounded px-3 py-1.5 text-xs text-[#1C1917]"
                />
                {selectedDateFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedDateFilter('all')}
                    className="text-xs text-[#B38838] underline"
                  >
                    All Dates
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#78716C] font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#D7D2C7] rounded px-3 py-1.5 text-xs text-[#1C1917]"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-service">In-Service</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>
            </div>

            {/* Appointment Table */}
            <div className="bg-white rounded-xl border border-[#E7E2DA] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-[#78716C] uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Treatment</th>
                      <th className="py-3 px-4">Specialist</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2EB]">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#1C1917]">
                          {apt.referenceNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#1C1917]">{apt.customerName}</div>
                          <div className="text-[10px] text-[#78716C] font-mono">{apt.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#1C1917]">
                          {apt.serviceName}
                        </td>
                        <td className="py-3 px-4 text-[#57534E]">
                          {apt.staffName}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#57534E]">
                          {apt.date} · {apt.timeSlot}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#1C1917] tabular-nums">
                          ₹{apt.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                            apt.status === 'completed'
                              ? 'bg-[#ECFDF5] text-[#059669]'
                              : apt.status === 'confirmed'
                              ? 'bg-[#EFF6FF] text-[#2563EB]'
                              : apt.status === 'in-service'
                              ? 'bg-[#FFFBEB] text-[#B45309]'
                              : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'in-service')}
                                className="px-2 py-1 bg-[#FEF3C7] text-[#92400E] rounded text-[10px] font-semibold hover:bg-[#FDE68A]"
                              >
                                {t('markCheckIn')}
                              </button>
                            )}
                            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                className="px-2 py-1 bg-[#ECFDF5] text-[#065F46] rounded text-[10px] font-semibold hover:bg-[#D1FAE5]"
                              >
                                {t('markComplete')}
                              </button>
                            )}
                            {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'no-show')}
                                className="px-2 py-1 bg-white border border-[#E2E8F0] text-[#64748B] rounded text-[10px] hover:bg-[#F8FAFC]"
                              >
                                {t('markNoShow')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Services Management */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Service Catalog & Pricing
                </h3>
                <p className="text-xs text-[#78716C]">
                  Configure salon services, prices, durations, and active statuses.
                </p>
              </div>

              <button
                onClick={() => setIsAddServiceOpen(true)}
                className="px-4 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-between ${
                    srv.isActive ? 'border-[#E7E2DA]' : 'border-[#FECACA] bg-[#FEF2F2]/30 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-[#B38838]">
                        {srv.category}
                      </span>
                      <button
                        onClick={() => toggleServiceActive(srv.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          srv.isActive 
                            ? 'bg-[#ECFDF5] text-[#059669]' 
                            : 'bg-[#FEE2E2] text-[#991B1B]'
                        }`}
                      >
                        {srv.isActive ? 'Active' : 'Deactivated'}
                      </button>
                    </div>

                    <h4 className="font-serif text-base font-semibold text-[#1C1917] mt-1">
                      {srv.name}
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 line-clamp-2">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs">
                    <span className="font-mono tabular-nums text-[#78716C]">
                      {srv.durationMinutes} mins
                    </span>
                    <span className="font-mono text-base font-bold text-[#1C1917] tabular-nums">
                      ₹{srv.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service Modal */}
            {isAddServiceOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <form
                  onSubmit={handleCreateService}
                  className="bg-white rounded-2xl border border-[#E7E2DA] shadow-2xl p-6 w-full max-w-md space-y-4"
                >
                  <h3 className="font-serif text-lg font-semibold text-[#1C1917] border-b border-[#F5F2EB] pb-2">
                    Create New Salon Service
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Moroccan Oil Caviar Hair Spa"
                      className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                        Category
                      </label>
                      <select
                        value={newServiceCategory}
                        onChange={(e) => setNewServiceCategory(e.target.value as any)}
                        className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2 text-xs text-[#1C1917]"
                      >
                        <option value="haircut">Haircut & Styling</option>
                        <option value="hair-color-spa">Hair Color & Spa</option>
                        <option value="facial-skincare">Facial & Skincare</option>
                        <option value="makeup">Party Makeup</option>
                        <option value="bridal">Bridal Package</option>
                        <option value="manicure-pedicure">Manicure & Pedicure</option>
                        <option value="waxing-threading">Waxing & Threading</option>
                        <option value="spa-treatments">Spa & Treatments</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                        Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        min="100"
                        required
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(Number(e.target.value))}
                        className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2 text-xs text-[#1C1917]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      step="15"
                      min="15"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2 text-xs text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder="Service details and client benefits..."
                      className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddServiceOpen(false)}
                      className="px-4 py-2 border border-[#D7D2C7] rounded-lg text-xs text-[#57534E]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold"
                    >
                      Save Service
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Staff Roster */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                Salon Professional Specialists
              </h3>
              <p className="text-xs text-[#78716C]">
                Manage staff working hours, assigned specialties, and on-leave statuses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((st) => (
                <div
                  key={st.id}
                  className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E7E2DA]"
                    />
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#1C1917]">
                        {st.name}
                      </h4>
                      <p className="text-[11px] text-[#B38838] font-medium">{st.role}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#78716C] mt-1 font-mono">
                        <span>{st.workingHours.start} - {st.workingHours.end}</span>
                        <span>·</span>
                        <span>Rating: {st.rating} ★</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5F2EB] flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      st.isOnLeave 
                        ? 'bg-[#FEE2E2] text-[#991B1B]' 
                        : 'bg-[#ECFDF5] text-[#059669]'
                    }`}>
                      {st.isOnLeave ? 'On Leave' : 'Active On Duty'}
                    </span>

                    <button
                      onClick={() => toggleStaffLeave(st.id)}
                      className="text-xs font-medium text-[#1C1917] hover:underline cursor-pointer"
                    >
                      {st.isOnLeave ? 'Mark Available' : 'Mark On Leave'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Inventory & Stock */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                Product Inventory & Backbar Stock
              </h3>
              <p className="text-xs text-[#78716C]">
                Track professional shampoos, chemical colors, serums, and depilatory waxes.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E7E2DA] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-[#78716C] uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4">Cost Price</th>
                    <th className="py-3 px-4 text-right">Reorder Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB]">
                  {inventory.map((item) => {
                    const isLow = item.quantity <= item.minStockAlert;

                    return (
                      <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#1C1917]">{item.name}</div>
                          {isLow && (
                            <span className="text-[10px] text-[#DC2626] font-medium flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              {t('lowStockWarning')} (min {item.minStockAlert})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#57534E]">{item.brand}</td>
                        <td className="py-3 px-4 text-[#78716C]">{item.category}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span className={isLow ? 'text-[#DC2626]' : 'text-[#1C1917]'}>
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-[#57534E]">
                          ₹{item.costPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => restockInventory(item.id, 10)}
                            className="px-3 py-1 bg-[#FAF6F0] hover:bg-[#F3ECE0] text-[#B38838] border border-[#E7DECE] rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {t('reorderStock')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Salon Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-[#E7E2DA] max-w-2xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#1C1917] border-b border-[#F5F2EB] pb-2">
              Business Details & Billing Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Salon Name</label>
                <input
                  type="text"
                  value={configForm.name}
                  onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Official GSTIN</label>
                <input
                  type="text"
                  value={configForm.gstin}
                  onChange={(e) => setConfigForm({ ...configForm, gstin: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">Full Address</label>
              <input
                type="text"
                value={configForm.address}
                onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Phone</label>
                <input
                  type="text"
                  value={configForm.phone}
                  onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">UPI VPA</label>
                <input
                  type="text"
                  value={configForm.upiId}
                  onChange={(e) => setConfigForm({ ...configForm, upiId: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D7D2C7] rounded-lg p-2.5 text-xs text-[#1C1917]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
              >
                {t('saveSettings')}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};

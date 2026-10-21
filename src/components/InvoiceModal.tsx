import React from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { X, Printer, Download, CheckCircle2, QrCode } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceAppointment, setActiveInvoiceAppointment, salonConfig, language } = useSalon();

  if (!activeInvoiceAppointment) return null;

  const apt = activeInvoiceAppointment;
  const t = (key: string) => getTranslation(language, key);

  const handlePrint = () => {
    window.print();
  };

  const halfTax = (apt.taxAmount / 2).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-2xl w-full max-w-2xl overflow-hidden print:p-0 print:border-none print:shadow-none">
        
        {/* Action Header (Hidden in print) */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-b border-[#E7E2DA] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            <span>Official Tax Invoice</span>
            <span>·</span>
            <span className="font-mono text-[#1C1917]">{apt.referenceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setActiveInvoiceAppointment(null)}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917]"
              aria-label="Close invoice modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 space-y-6 text-xs text-[#1C1917]">
          
          {/* Salon Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E7E2DA] pb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                {salonConfig.name}
              </h2>
              <p className="text-[11px] text-[#78716C] mt-0.5">{salonConfig.tagline}</p>
              <div className="text-[11px] text-[#78716C] mt-2 space-y-0.5">
                <p>{salonConfig.address}</p>
                <p>{salonConfig.city}</p>
                <p>Phone: {salonConfig.phone} | Email: {salonConfig.email}</p>
                <p className="font-mono font-medium text-[#1C1917]">GSTIN: {salonConfig.gstin}</p>
              </div>
            </div>

            <div className="text-right sm:self-start">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38838] block">
                TAX INVOICE
              </span>
              <div className="font-mono text-base font-bold text-[#1C1917] mt-0.5">
                {apt.referenceNumber}
              </div>
              <p className="text-[11px] text-[#78716C] mt-1 font-mono">
                Date: {apt.date}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#ECFDF5] text-[#059669]">
                Status: {apt.status}
              </span>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 border-b border-[#E7E2DA] pb-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#A8A29E] block mb-1">
                Billed To:
              </span>
              <p className="font-semibold text-sm">{apt.customerName}</p>
              <p className="text-[#78716C] font-mono">{apt.customerPhone}</p>
              {apt.customerEmail && <p className="text-[#78716C]">{apt.customerEmail}</p>}
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#A8A29E] block mb-1">
                Appointment Schedule:
              </span>
              <p className="font-medium">{apt.date} at {apt.timeSlot}</p>
              <p className="text-[#78716C]">Artist: {apt.staffName}</p>
              <p className="text-[#78716C]">Payment: {apt.paymentMethod.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>

          {/* Table of Services */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1C1917] text-[10px] uppercase tracking-wider font-semibold text-[#78716C]">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Duration</th>
                <th className="py-2 text-right">Taxable Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              <tr>
                <td className="py-3">
                  <div className="font-semibold">{apt.serviceName}</div>
                  <div className="text-[11px] text-[#78716C]">{apt.notes || 'Luxury salon ritual treatment'}</div>
                </td>
                <td className="py-3 text-center font-mono">{apt.durationMinutes} mins</td>
                <td className="py-3 text-right font-mono tabular-nums font-medium">₹{apt.price.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* Summary Math */}
          <div className="flex flex-col items-end space-y-1.5 pt-4 border-t border-[#E7E2DA]">
            <div className="flex justify-between w-64 text-[#57534E]">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums">₹{apt.price.toLocaleString('en-IN')}</span>
            </div>

            {apt.discountAmount > 0 && (
              <div className="flex justify-between w-64 text-[#059669]">
                <span>Promotional Discount:</span>
                <span className="font-mono tabular-nums">-₹{apt.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between w-64 text-[#78716C] text-[11px]">
              <span>Central GST (9%):</span>
              <span className="font-mono tabular-nums">₹{halfTax}</span>
            </div>

            <div className="flex justify-between w-64 text-[#78716C] text-[11px]">
              <span>State GST (9%):</span>
              <span className="font-mono tabular-nums">₹{halfTax}</span>
            </div>

            <div className="flex justify-between w-64 pt-2 border-t border-[#1C1917] font-bold text-sm text-[#1C1917]">
              <span>Total Paid / Payable:</span>
              <span className="font-mono text-base tabular-nums">₹{apt.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Footer Notice & QR Verification */}
          <div className="pt-6 border-t border-[#E7E2DA] flex items-center justify-between text-[11px] text-[#78716C]">
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-[#1C1917]">Terms & Salon Policy:</p>
              <p>Appointments can be rescheduled up to 4 hours prior. All cosmetic services subject to GST under SAC 999722.</p>
              <p className="italic">Thank you for letting Glow & Glam Salon enhance your beauty.</p>
            </div>

            <div className="text-center shrink-0">
              <div className="w-16 h-16 bg-[#FAF8F5] border border-[#D7D2C7] p-1 rounded flex items-center justify-center mx-auto">
                <QrCode className="w-14 h-14 text-[#1C1917]" />
              </div>
              <span className="text-[9px] font-mono text-[#A8A29E] mt-1 block">Scan to Verify</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

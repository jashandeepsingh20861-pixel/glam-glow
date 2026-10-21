export type ServiceCategory = 
  | 'haircut'
  | 'hair-color-spa'
  | 'facial-skincare'
  | 'makeup'
  | 'bridal'
  | 'manicure-pedicure'
  | 'waxing-threading'
  | 'spa-treatments';

export type Language = 'en' | 'hi' | 'pb';

export type UserRole = 'customer' | 'owner' | 'manager' | 'receptionist' | 'stylist';

export type BookingStatus = 'confirmed' | 'in-service' | 'completed' | 'rescheduled' | 'cancelled' | 'no-show';

export type PaymentMethod = 'pay_at_salon' | 'upi' | 'card_online';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface SalonService {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number; // in INR
  originalPrice?: number;
  durationMinutes: number;
  description: string;
  image: string;
  inclusions: string[];
  isPopular?: boolean;
  isBridal?: boolean;
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  rating: number;
  avatar: string;
  specialties: ServiceCategory[];
  workingHours: {
    start: string; // '09:00'
    end: string;   // '19:00'
  };
  breakTimes: {
    start: string; // '13:00'
    end: string;   // '14:00'
  };
  offDays: number[]; // 0=Sunday, 1=Monday, etc.
  isOnLeave?: boolean;
}

export interface Appointment {
  id: string;
  referenceNumber: string; // e.g. GG-2026-8941
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // '10:00 AM'
  durationMinutes: number;
  price: number;
  discountAmount: number;
  taxAmount: number; // 18% GST
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number;
  applicableCategory?: ServiceCategory | 'all';
  expiryDate: string;
  usageCount: number;
  usageLimit?: number;
  isFirstVisitOnly?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  quantity: number;
  minStockAlert: number;
  unit: string;
  costPrice: number;
  lastRestocked: string;
}

export interface CustomerReview {
  id: string;
  clientName: string;
  city: string;
  rating: number;
  serviceName: string;
  comment: string;
  date: string;
  avatar: string;
}

export interface SalonConfiguration {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  gstin: string;
  currency: string;
  currencySymbol: string;
  openingHour: number; // 9
  closingHour: number; // 20
  slotIntervalMinutes: number; // 30
  cleaningBufferMinutes: number; // 15
  cancellationBufferHours: number; // 4
  gstRate: number; // 0.18
  upiId: string;
  upiMerchantName: string;
}

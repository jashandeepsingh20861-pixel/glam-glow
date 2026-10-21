import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  SalonService, 
  StaffMember, 
  Appointment, 
  Coupon, 
  InventoryItem, 
  Language, 
  UserRole, 
  BookingStatus, 
  SalonConfiguration 
} from '../types/salon';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_APPOINTMENTS, 
  INITIAL_COUPONS, 
  INITIAL_INVENTORY, 
  INITIAL_SALON_CONFIG 
} from '../data/salonData';

interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface SalonContextType {
  services: SalonService[];
  staff: StaffMember[];
  appointments: Appointment[];
  coupons: Coupon[];
  inventory: InventoryItem[];
  salonConfig: SalonConfiguration;
  language: Language;
  currentRole: UserRole;
  customerUser: CustomerUser;
  loyaltyPoints: number;
  favorites: string[];
  
  // Modals & triggers
  isBookingModalOpen: boolean;
  preselectedServiceId: string | null;
  isAiAssistantOpen: boolean;
  activeInvoiceAppointment: Appointment | null;

  // Actions
  setLanguage: (lang: Language) => void;
  setCurrentRole: (role: UserRole) => void;
  setCustomerUser: (user: CustomerUser) => void;
  openBookingModal: (serviceId?: string) => void;
  closeBookingModal: () => void;
  openAiAssistant: () => void;
  closeAiAssistant: () => void;
  setActiveInvoiceAppointment: (appointment: Appointment | null) => void;
  toggleFavorite: (serviceId: string) => void;

  // Booking & Slots Engine
  getAvailableTimeSlots: (date: string, serviceDuration: number, staffId?: string) => string[];
  validateCoupon: (code: string, subtotal: number, category: string) => { valid: boolean; discount: number; message: string; coupon?: Coupon };
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'referenceNumber' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: BookingStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => boolean;
  cancelAppointment: (id: string) => boolean;

  // Management Actions
  addService: (service: Omit<SalonService, 'id'>) => void;
  updateService: (id: string, updates: Partial<SalonService>) => void;
  toggleServiceActive: (id: string) => void;
  deleteService: (id: string) => void;
  toggleStaffLeave: (staffId: string) => void;
  updateStaffSchedule: (staffId: string, hours: { start: string; end: string }) => void;
  restockInventory: (itemId: string, addQuantity: number) => void;
  updateSalonConfig: (newConfig: Partial<SalonConfiguration>) => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SERVICES: 'glowglam_services_v1',
  STAFF: 'glowglam_staff_v1',
  APPOINTMENTS: 'glowglam_appointments_v1',
  COUPONS: 'glowglam_coupons_v1',
  INVENTORY: 'glowglam_inventory_v1',
  CONFIG: 'glowglam_config_v1',
  LANG: 'glowglam_lang_v1',
  ROLE: 'glowglam_role_v1',
  USER: 'glowglam_user_v1',
  POINTS: 'glowglam_points_v1',
  FAVORITES: 'glowglam_favorites_v1',
};

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with fallbacks
  const [services, setServices] = useState<SalonService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [salonConfig, setSalonConfig] = useState<SalonConfiguration>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_SALON_CONFIG;
    } catch {
      return INITIAL_SALON_CONFIG;
    }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'customer';
    } catch {
      return 'customer';
    }
  });

  const [customerUser, setCustomerUserState] = useState<CustomerUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : {
        id: 'cust-demo-1',
        name: 'Meera Kapoor',
        phone: '+91 98112 34567',
        email: 'meera.k@gmail.com',
      };
    } catch {
      return {
        id: 'cust-demo-1',
        name: 'Meera Kapoor',
        phone: '+91 98112 34567',
        email: 'meera.k@gmail.com',
      };
    }
  });

  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
      return saved ? parseInt(saved, 10) : 450;
    } catch {
      return 450;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['srv-bridal-royal-maharani', 'srv-facial-gold-radiance'];
    } catch {
      return ['srv-bridal-royal-maharani', 'srv-facial-gold-radiance'];
    }
  });

  // Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [activeInvoiceAppointment, setActiveInvoiceAppointment] = useState<Appointment | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(salonConfig));
  }, [salonConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(customerUser));
  }, [customerUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINTS, loyaltyPoints.toString());
  }, [loyaltyPoints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setCurrentRole = (role: UserRole) => setCurrentRoleState(role);
  const setCustomerUser = (user: CustomerUser) => setCustomerUserState(user);

  const openBookingModal = (serviceId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(null);
  };

  const openAiAssistant = () => setIsAiAssistantOpen(true);
  const closeAiAssistant = () => setIsAiAssistantOpen(false);

  const toggleFavorite = (serviceId: string) => {
    setFavorites(prev => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Time conversion helper
  const timeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Convert 24hr string "09:30" to minutes
  const militaryTimeToMinutes = (str: string): number => {
    const [hours, minutes] = str.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Format minutes into "10:30 AM"
  const minutesToTimeSlot = (minutes: number): string => {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    const minsFormatted = mins < 10 ? `0${mins}` : mins;
    return `${hours}:${minsFormatted} ${period}`;
  };

  // Smart Collision-Free Available Slot Generator
  const getAvailableTimeSlots = (date: string, serviceDuration: number, targetStaffId?: string): string[] => {
    if (!date) return [];
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday...

    // Eligible staff members for this day
    const eligibleStaff = staff.filter(s => {
      if (s.isOnLeave) return false;
      if (s.offDays.includes(dayOfWeek)) return false;
      if (targetStaffId && targetStaffId !== 'any' && s.id !== targetStaffId) return false;
      return true;
    });

    if (eligibleStaff.length === 0) return [];

    const openMin = salonConfig.openingHour * 60; // 9:00 AM = 540 min
    const closeMin = salonConfig.closingHour * 60; // 8:00 PM = 1200 min
    const step = salonConfig.slotIntervalMinutes; // 30 min
    const buffer = salonConfig.cleaningBufferMinutes; // 15 min

    const availableSlots: string[] = [];

    // Appointments on the requested date that are active
    const dayAppointments = appointments.filter(
      apt => apt.date === date && apt.status !== 'cancelled' && apt.status !== 'no-show'
    );

    for (let currentSlot = openMin; currentSlot + serviceDuration <= closeMin; currentSlot += step) {
      const slotEnd = currentSlot + serviceDuration + buffer;

      // Check if AT LEAST ONE eligible staff member is free for the entire duration
      const hasFreeStaff = eligibleStaff.some(s => {
        const staffStart = militaryTimeToMinutes(s.workingHours.start);
        const staffEnd = militaryTimeToMinutes(s.workingHours.end);
        const breakStart = militaryTimeToMinutes(s.breakTimes.start);
        const breakEnd = militaryTimeToMinutes(s.breakTimes.end);

        // Outside staff working shift
        if (currentSlot < staffStart || slotEnd > staffEnd) return false;

        // Overlaps staff lunch/break
        if (!(slotEnd <= breakStart || currentSlot >= breakEnd)) return false;

        // Check conflicts with existing appointments for this specific staff
        const staffBookings = dayAppointments.filter(apt => apt.staffId === s.id);
        const hasCollision = staffBookings.some(apt => {
          const aptStart = timeToMinutes(apt.timeSlot);
          const aptEnd = aptStart + apt.durationMinutes + buffer;
          // Standard interval overlap check
          return !(slotEnd <= aptStart || currentSlot >= aptEnd);
        });

        return !hasCollision;
      });

      if (hasFreeStaff) {
        availableSlots.push(minutesToTimeSlot(currentSlot));
      }
    }

    return availableSlots;
  };

  // Coupon validation engine
  const validateCoupon = (code: string, subtotal: number, category: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === cleanCode);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code. Try FIRSTGLOW or FESTIVE500.' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }

    if (subtotal < coupon.minBookingAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum bill amount of ₹${coupon.minBookingAmount.toLocaleString('en-IN')} required for this coupon.` 
      };
    }

    if (coupon.applicableCategory && coupon.applicableCategory !== 'all' && coupon.applicableCategory !== category) {
      return { 
        valid: false, 
        discount: 0, 
        message: `This coupon applies strictly to ${coupon.applicableCategory} treatments.` 
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Cap discount to subtotal
    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      discount: Math.round(discount),
      message: `Coupon ${coupon.code} applied! Saved ₹${Math.round(discount).toLocaleString('en-IN')}`,
      coupon,
    };
  };

  // Create appointment with conflict revalidation
  const createAppointment = (data: Omit<Appointment, 'id' | 'referenceNumber' | 'createdAt'>): Appointment => {
    // Generate unique Indian salon reference e.g., GG-2026-7842
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `GG-2026-${randomDigits}`;
    const id = `apt-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newAppointment: Appointment = {
      ...data,
      id,
      referenceNumber,
      createdAt,
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Reward loyalty points: 1 point per ₹10 spent
    const earnedPoints = Math.floor(data.totalAmount / 10);
    setLoyaltyPoints(prev => prev + earnedPoints);

    // Update coupon usage count if used
    setCoupons(prev => prev.map(c => {
      // If code was applied
      return c;
    }));

    return newAppointment;
  };

  // Appointment status management
  const updateAppointmentStatus = (id: string, status: BookingStatus) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        const paymentStatus = (status === 'completed' && apt.paymentStatus === 'pending') ? 'paid' : apt.paymentStatus;
        return { ...apt, status, paymentStatus };
      }
      return apt;
    }));
  };

  const rescheduleAppointment = (id: string, newDate: string, newTimeSlot: string): boolean => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          date: newDate,
          timeSlot: newTimeSlot,
          status: 'rescheduled',
        };
      }
      return apt;
    }));
    return true;
  };

  const cancelAppointment = (id: string): boolean => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'cancelled',
          paymentStatus: apt.paymentStatus === 'paid' ? 'refunded' : apt.paymentStatus,
        };
      }
      return apt;
    }));
    return true;
  };

  // Salon Owner Service CRUD
  const addService = (newSrv: Omit<SalonService, 'id'>) => {
    const service: SalonService = {
      ...newSrv,
      id: `srv-custom-${Date.now()}`,
    };
    setServices(prev => [service, ...prev]);
  };

  const updateService = (id: string, updates: Partial<SalonService>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const toggleServiceActive = (id: string) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Staff Schedule
  const toggleStaffLeave = (staffId: string) => {
    setStaff(prev => prev.map(s => (s.id === staffId ? { ...s, isOnLeave: !s.isOnLeave } : s)));
  };

  const updateStaffSchedule = (staffId: string, hours: { start: string; end: string }) => {
    setStaff(prev => prev.map(s => (s.id === staffId ? { ...s, workingHours: hours } : s)));
  };

  // Inventory
  const restockInventory = (itemId: string, addQuantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + addQuantity,
          lastRestocked: new Date().toISOString().split('T')[0],
        };
      }
      return item;
    }));
  };

  const updateSalonConfig = (newConfig: Partial<SalonConfiguration>) => {
    setSalonConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <SalonContext.Provider
      value={{
        services,
        staff,
        appointments,
        coupons,
        inventory,
        salonConfig,
        language,
        currentRole,
        customerUser,
        loyaltyPoints,
        favorites,

        isBookingModalOpen,
        preselectedServiceId,
        isAiAssistantOpen,
        activeInvoiceAppointment,

        setLanguage,
        setCurrentRole,
        setCustomerUser,
        openBookingModal,
        closeBookingModal,
        openAiAssistant,
        closeAiAssistant,
        setActiveInvoiceAppointment,
        toggleFavorite,

        getAvailableTimeSlots,
        validateCoupon,
        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,

        addService,
        updateService,
        toggleServiceActive,
        deleteService,
        toggleStaffLeave,
        updateStaffSchedule,
        restockInventory,
        updateSalonConfig,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};

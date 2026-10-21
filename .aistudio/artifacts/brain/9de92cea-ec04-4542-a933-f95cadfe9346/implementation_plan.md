# Glow & Glam Salon — Professional Salon Booking & Management Web App

A modern, responsive, luxury beauty salon booking, business operations, and customer relationship management application tailored for high-end salons, bridal studios, and wellness centers in India.

> [!IMPORTANT]
> **User Review & Critical Decisions**:
> - **Brand & Aesthetic**: "Glow & Glam Salon" with warm ivory (`#FAF8F5`), champagne gold (`#D4AF37`), soft rose/blush (`#FDF2F4`), and deep charcoal typography (`#1C1917`).
> - **Full Multilingual Capabilities**: Native 3-language switch (English, हिन्दी, ਪੰਜਾਬੀ) with full Unicode support and persistent language state.
> - **Hybrid Booking & Payments Engine**: Flexible payment options (Pay at Salon, UPI QR / VPA instant simulation, and Card/NetBanking demo gateway) with verifiable reference codes (`GG-2026-XXXX`), conflict-free slot collision prevention, and automatic invoice generation.
> - **AI Beauty Assistant**: Server-side Gemini 3.8 Flash API integration (`/api/assistant`) with intelligent service matchmaker, event styling suggestions, prep/aftercare guidance, and fallback demo mode.
> - **Enterprise-Grade Admin & Staff Dashboard**: Multi-role support (Owner, Manager, Receptionist, Staff Specialist) with visual appointment calendar, staff rosters, service catalog manager, inventory alerts, and CSV analytics export.

---

## 1. Overview & Core Concept

**Glow & Glam Salon** provides an end-to-end digital salon experience for both clients and salon staff. 

- **For Customers**: Seamless mobile-first booking in 10 clear steps, AI-guided beauty consultations, loyalty rewards, appointment tracking, rescheduling, and digital invoices.
- **For Salon Owners & Staff**: Real-time appointment desk, multi-staff calendar, inventory tracking, role-protected admin controls, service pricing adjustments, and business revenue reporting.
- **Target Audience**: Discerning salon clients in India seeking hair styling, skincare, bridal makeovers, and spa treatments, alongside salon professionals requiring efficient salon operations.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[Customer Journey]
Home Page ───> Browse Services ───> Select Staff & Slot ───> Apply Coupon ───> Pay / Confirm ───> Digital Receipt
     │                                                                                                    ▲
     ├───> AI Beauty Assistant ───> Recommended Package ──────────────────────────────────────────────────┤
     └───> Customer Account ───> My Appointments ───> Reschedule / Cancel / Download Invoice

[Salon Management Journey]
Admin Switcher ───> Dashboard Overview (KPIs) ───> Appointment Calendar ───> Service / Staff / Inventory
                       │
                       └───> Check-in / Complete Appointment ───> Revenue & CSV Export
```

### Visual Identity & Theme
- **Dominant Neutral (60%)**: Warm ivory canvas (`#FAF8F5`) and pure white cards with soft borders (`#E7E2DA`).
- **Structural Surfaces (30%)**: Soft blush (`#FBF3F4`) and warm champagne-tinted grays with deep charcoal text (`#1C1917`, `#44403C`).
- **Accent Budget (10%)**: Champagne gold (`#C5A059` / `#B38838`) and rose petal crimson (`#C2415A`) for active states, CTAs, and badges.
- **Typography**: Editorial serif headings (`Cormorant Garamond` / `Playfair Display`) paired with crisp geometric sans body (`Plus Jakarta Sans`). Tabular figures (`tabular-nums`) for all prices and timestamps.
- **Responsive Sticky Top Bar Contract**: 
  - Zone 1: Clean wordmark **Glow & Glam**
  - Zone 2: Navigation (Services, Bridal, AI Stylist, Offers, About)
  - Zone 3: Language Selector (EN / HI / PB) + Role Switcher (Client / Staff) + "Book Now" CTA
- **Mobile Thumb Bar**: Quick 5-tab sticky bottom navigation (Home, Services, Book, AI Concierge, Profile) adhering to the $\le 15\%$ height cap.

---

## 3. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Vite + React 19 Frontend                      │
│                                                                        │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐ │
│ │  Customer Experience │  │  Admin & Operations  │  │  AI Concierge  │ │
│ │  - Hero & Categories │  │  - Dashboard & KPIs  │  │  - Skin/Hair Q │ │
│ │  - Services Catalog  │  │  - Calendar Matrix   │  │  - Bridal Pack │ │
│ │  - 10-Step Booking   │  │  - Staff Rostering   │  │  - Deep Link   │ │
│ │  - Account & History │  │  - Inventory & Stock │  │  - Offline Fall│ │
│ └──────────┬───────────┘  └──────────┬───────────┘  └───────┬────────┘ │
│            │                         │                      │          │
│            ▼                         ▼                      ▼          │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │              Reactive Salon State Engine & Persistence             │ │
│ │  - Services & Packages Store (Categories, Add-ons, Rates)          │ │
│ │  - Real-time Slot Calculator (Collision Detection, Buffers)        │ │
│ │  - Appointments & Customer History (Status, Payments, Invoices)   │ │
│ │  - Staff Schedules & Leaves                                        │ │
│ │  - Coupon & Loyalty Engine (Validation, Expiry, Discount math)     │ │
│ │  - Multilingual Dictionary (EN, HI, PB)                            │ │
│ └────────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Server API Proxy (Express on Port 3000)              │
│                                                                        │
│  POST /api/assistant  ───>  @google/genai (gemini-3.8-flash)           │
│  GET  /api/health     ───>  Status check & Config                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Modules & Functional Specifications

### A. Dynamic Booking & Collision-Free Slot Engine
1. **Service Selection**: Hair, Skincare, Makeup, Bridal, Nails, Spa with durations (15m to 240m).
2. **Staff Matching**: Select a specific professional (e.g., Master Colorist, Senior Esthetician) or "Any Available Professional".
3. **Smart Slot Availability**:
   - Computes open slots based on salon operating hours (9:00 AM – 8:00 PM), staff working shift, existing confirmed/in-progress bookings, and 15-minute cleaning buffer.
   - Immediate revalidation before booking confirmation to prevent race conditions.
4. **Transparent Pricing & Coupons**:
   - Real-time tax breakdown (9% CGST + 9% SGST = 18% standard India salon GST).
   - Validates coupon conditions (e.g. `FIRSTGLOW` 20% off for new clients, `BRIDAL1000` on bridal packages).
5. **Flexible Payment**:
   - Pay at Salon (confirmed with reference ID).
   - Instant UPI simulator with QR code and VPA verification (`glowglam@okhdfcbank`).
   - Mock Razorpay / Card gateway with test success/failure flows.
6. **Digital Receipt**: Generates formatted printable invoice with QR code, service details, stylist name, date/time, and cancellation guidelines.

### B. AI Beauty Assistant (Gemini 3.8 Flash)
- Direct integration via server proxy `/api/assistant` using `@google/genai`.
- Pre-configured context with salon services catalog, price range, skin/hair care guidelines, and Indian bridal traditions.
- Contextual actions: Recommends specific treatments and provides 1-click "Book This Service" action buttons.
- Clear medical disclaimer and automatic offline intelligent fallback responses if API credentials are not set.

### C. Multilingual Support (English, हिन्दी, ਪੰਜਾਬੀ)
- Complete dictionary mapping over 120 key UI terms and labels.
- Native script typography rendering for Hindi (Devanagari) and Punjabi (Gurmukhi).
- Instant switcher in navigation header that remembers user choice in local storage.

### D. Admin & Salon Management Portal
- **Role-Based Controls**: Easily switch between Customer view and Admin roles (Owner, Manager, Receptionist, Senior Stylist).
- **Interactive Calendar**: View appointments by Day, Week, or Status filter. Update statuses (Check-In, In-Service, Completed, Cancelled, No-Show).
- **Service Catalog CRUD**: Add new services, edit pricing, toggle availability, add discounts.
- **Staff Roster**: Manage working hours, assign specialties, toggle active leave status.
- **Inventory Monitor**: Track salon products (L'Oréal, Olaplex, Dermalogica, MAC), set low stock thresholds, and view reorder alerts.
- **Reporting & CSV Export**: Export appointment logs and daily revenue reports to CSV.

---

## 5. Implementation Steps

1. **Server Setup**: Implement Express server with proxy route `POST /api/assistant` using `@google/genai` (`gemini-3.8-flash`) and fallback handler. Update `metadata.json` and `index.html`.
2. **Design System & Theme**: Setup Google fonts (`Cormorant Garamond` & `Plus Jakarta Sans`), luxury Tailwind color tokens, and smooth motion transitions.
3. **Data Layer & Sample Data**: Create comprehensive initial datasets (8 categories, 24 luxury services, 6 professional staff members, active coupons, realistic bookings, inventory items, and reviews).
4. **Multilingual Localization**: Build complete translation maps for English, Hindi, and Punjabi.
5. **Customer Experience**: Build Homepage, Hero, Category Filter, Service Details Modal, Before-After comparisons, Testimonials, and Salon Details.
6. **10-Step Interactive Booking Modal**: Build the complete booking flow with calendar, slot generator, collision check, customer form, coupon validator, payment selector, and confirmation receipt.
7. **AI Beauty Assistant Widget**: Build conversational floating drawer with quick prompt chips, deep-link booking triggers, and markdown formatting.
8. **Customer Account Portal**: Appointments list, reschedule/cancel modals, digital invoice viewer, loyalty points, and profile settings.
9. **Admin Dashboard**: KPIs, Calendar matrix, Appointment management, Service catalog editor, Staff roster, Inventory monitor, and CSV exporter.
10. **Build Verification**: Run `compile_applet` and test all edge cases.

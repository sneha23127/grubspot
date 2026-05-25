# 🍱 GrubSpot

**GrubSpot** is a state-of-the-art Mess Management & Discovery Platform designed to streamline the connection between student/professional diners and local mess services. Built with a focus on visual excellence and operational transparency, GrubSpot provides a premium experience for managing daily meal subscriptions.

---

## 🚀 Key Features

### 👨‍🎓 For Students
*   **Live Distance Tracking**: Real-time proximity calculation using the Haversine formula and OpenStreetMap geocoding. Find exactly how far your meal is!
*   **Smart Filtering**: Advanced filtering system for North Indian, South Indian, Veg, and Non-Veg preferences with case-insensitive data matching.
*   **Dynamic Subscriptions**: Full lifecycle management of meal plans (Trial, 1 Month, 3 Month) with real-time sync to mess owner settings.
*   **Visual Dietary Cues**: Standardized color-coding (🟢 Green for Veg, 🔴 Red for Non-Veg) across the entire platform for instant recognition.
*   **Interactive Comparison**: Side-by-side comparison matrix of up to 3 messes, comparing pricing, distance, menu, and live ratings.
*   **Payment Flexibility**: Integrated support for both **Online UPI** and **Cash** payments, dynamically controlled by mess owners.

### 👨‍🍳 For Mess Owners
*   **Operational Dashboard**: Real-time tracking of today's revenue, active subscribers, and performance metrics.
*   **Advanced Menu Management**: Day-wise recurring weekly menu control with item-level availability toggles.
*   *Pricing & Plans**: Granular control over Veg/Non-Veg pricing and delivery charges.
*   **Subscriber Insights**: Detailed list of active student subscribers with contact details and plan metadata.
*   **Service Configuration**: Toggle Home Delivery and Payment Options (UPI/Cash) with instant reflection on student-facing pages.

### 🛡️ For Administrators
*   **Unified Support System**: Centralized ticket management system for resolving user complaints and mess owner queries.
*   **User Management**: Full oversight of student and owner accounts with status controls.
*   **Revenue Analytics**: High-level platform metrics monitoring.

---

## 🛠️ Technical Excellence

### Tech Stack
*   **Frontend**: React 19 (Vite), React Router 7, Axios, Vanilla CSS (Premium Custom Design System).
*   **Backend**: Node.js, Express.js (RESTful API), JWT Authentication, Bcryptjs.
*   **Database**: PostgreSQL (Relational Database with complex joins for live data integrity).
*   **Location Services**: Haversine Formula + Nominatim API (OpenStreetMap) for geocoding and distance calculation.

### Database Architecture
GrubSpot utilizes a robust relational schema:
*   `users`: Core authentication and role management.
*   `messes`: Detailed mess configuration (stored as normalized columns and complex JSONB for flexibility).
*   `subscriptions`: Live link between users and messes with active plan tracking.
*   `reviews`: SQL-calculated live average ratings and counts.
*   `tickets`: Standardized support ticket tracking.

---

## ⚙️ Installation & Setup

### Prerequisites
*   **Node.js** (v18+)
*   **PostgreSQL** (Running instance)
*   **Git**

### Step-by-Step Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/sneha23127/grubspot.git
   cd grubspot
   npm install
   ```

2. **Backend Configuration**
   *   Navigate to `/backend`
   *   Create a `.env` file:
     ```env
     PORT=5000
     DB_USER=your_user
     DB_PASSWORD=your_password
     DB_HOST=localhost
     DB_NAME=grubspot
     DB_PORT=5432
     JWT_SECRET=your_jwt_secret
     ```
   *   Run `npm install`
   *   Initialize your PostgreSQL tables using the scripts provided in `/backend/scratch` if available.

3. **Frontend Configuration**
   *   Navigate to `/frontend`
   *   Run `npm install`

4. **Run Development Servers**
   ```bash
   # From root directory
   # In terminal 1 (Backend)
   cd backend && npm run dev

   # In terminal 2 (Frontend)
   cd frontend && npm run dev
   ```

---

## 🎨 Design Philosophy
GrubSpot prioritizes **Rich Aesthetics** and **Dynamic Interaction**:
*   **Vibrant Palettes**: Deep orange and peach accents for appetizing visuals.
*   **Modern Typography**: Clean, readable sans-serif hierarchy (Outfit/Inter).
*   **Micro-Animations**: Smooth hover transitions and interactive pill filters.
*   **Glassmorphism**: Elegant card layouts with subtle shadows and borders.

---

## 📜 License
This project is licensed under the **ISC License**.

Built with ❤️ by the GrubSpot Team.

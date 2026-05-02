# Challan Maker Enterprise

A professional multi-tenant SaaS for computer repair stores to manage service challans, customers, and staff. Replace paper-based workflows with a modern, digital solution.

## Features

### Admin Dashboard
- **Tenant Management:** Create and manage repair store accounts.
- **Subscription Overview:** (Coming Soon) Track tenant subscriptions and usage.
- **Activity Logs:** (Coming Soon) Monitor system-wide actions.

### Tenant (Store Owner) Dashboard
- **Challan Management:** Create, view, and manage repair service challans.
- **QR-Code Tracking:** Each challan includes a unique QR code for customers to track repair status.
- **Professional PDF Generation:** Generate and download professional service receipts.
- **OTP-Verified Delivery:** Secure the delivery process with customer OTP verification.
- **Status Management:** Track repair progress through 'Pending', 'Delivered', and 'Cancelled' statuses.
- **Staff Management:** (Coming Soon) Manage technicians and store staff.
- **Customization:** Configure store details, terms and conditions, and email settings.

### Security & Architecture
- **Multi-tenant Isolation:** Each store's data is kept separate and secure.
- **JWT Authentication:** Secure access for both admins and tenants.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile use.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS v4, Lucide React (Icons), Motion (Animations).
- **Backend:** Node.js, Express.
- **Database:** SQLite (via `better-sqlite3`).
- **Utilities:** `jspdf` (PDF generation), `qrcode` (QR codes), `axios` (API requests).

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd challan-maker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

### Running the App

- **Full Stack (Client + Server):**
  ```bash
  npm run dev
  ```

- **Backend Only:**
  ```bash
  npm run server
  ```

- **Frontend Only:**
  ```bash
  npm run client
  ```

### Build

To create a production build of the frontend:
```bash
npm run build
```

## Directory Structure

- `client/`: Frontend React application.
- `server/`: (Note: Backend code is currently managed in the root via `package.json` scripts targeting `server/server.ts`).
- `challan_maker.db`: SQLite database file.

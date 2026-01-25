# GSM-102 USDA Export Credit Guarantee Tracker

## Overview
A comprehensive tracking system for USDA GSM-102 Export Credit Guarantee transactions for Zapp Marketing and Manufacturing. This application helps manage international agricultural trade transactions from application through payment completion.

## Key Features
- **Transaction Tracking**: Create and track export transactions through 5 stages (Application → Approval → Shipment → Payment → Completed)
- **Document Management**: Upload and verify trade documents (Letter of Credit, Commodity Certificates, Shipping Documents, USDA Forms)
- **Compliance Checklist**: Track required certifications and regulatory paperwork
- **Country Verification**: List of USDA-approved importing countries with authorized banks
- **Status Dashboard**: Visual pipeline overview with transaction statistics
- **Notifications**: Alerts for missing documents, approaching deadlines, and status changes
- **User Roles**: Support for Exporter, Importer, and Admin roles

## Technical Stack
- **Frontend**: React with TypeScript, TanStack Query, Wouter routing
- **Backend**: Express.js with in-memory storage
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Dark mode with cyan/teal accents (Zapp branding)

## Project Structure
```
├── client/src/
│   ├── components/          # Reusable UI components
│   │   ├── app-sidebar.tsx  # Main navigation sidebar
│   │   ├── stage-badge.tsx  # Transaction stage badges
│   │   ├── stage-progress.tsx # Visual stage progress indicator
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── dashboard.tsx    # Main dashboard
│   │   ├── transactions.tsx # Transaction list
│   │   ├── transaction-new.tsx # Create transaction form
│   │   ├── transaction-detail.tsx # Transaction details
│   │   ├── documents.tsx    # Document management
│   │   ├── compliance.tsx   # Compliance tracking
│   │   ├── countries.tsx    # Approved countries list
│   │   ├── notifications.tsx # Notifications center
│   │   └── settings.tsx     # Settings page
│   └── lib/
│       ├── queryClient.ts   # TanStack Query configuration
│       └── user-context.tsx # User role context
├── server/
│   ├── routes.ts            # API endpoints
│   └── storage.ts           # In-memory data storage
└── shared/
    └── schema.ts            # Data models and types
```

## API Endpoints
- `GET/POST /api/transactions` - List/create transactions
- `GET /api/transactions/:id` - Get transaction details
- `PATCH /api/transactions/:id/stage` - Update transaction stage
- `GET/POST /api/documents` - List/upload documents
- `PATCH /api/documents/:id/verify` - Verify document
- `GET/POST /api/compliance` - List/add compliance items
- `PATCH /api/compliance/:id/status` - Update compliance status
- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

## USDA-Approved Countries
The system includes 15 pre-configured countries approved for GSM-102 transactions:
- **Africa**: Nigeria, Ghana, Senegal, Kenya, Egypt
- **Caribbean**: Dominican Republic, Jamaica
- **Latin America**: Mexico, Colombia, Peru, Guatemala, Costa Rica
- **Asia**: Philippines, Vietnam, Indonesia

Each country includes approved banks that can issue Letters of Credit.

## Transaction Stages
1. **Application** - Initial deal setup, LC issuance
2. **Approval** - GSM-102 guarantee application, documentation
3. **Shipment** - Goods shipped, shipping documents prepared
4. **Payment** - Payment processing, USDA form submission
5. **Completed** - Transaction successfully closed

## Required Documents by Stage
- **Application**: Letter of Credit
- **Approval**: Commercial Invoice, Packing List
- **Shipment**: Bill of Lading, Certificate of Origin, Health Certificate, Insurance Certificate
- **Payment**: USDA Form, Commodity Certificate

## Security
- Documents are simulated with AES-256 encryption indication
- Secure session management
- Role-based access control (Exporter/Importer/Admin)

## Development
The application runs with `npm run dev` which starts both the Express backend and Vite frontend on port 5000.

## User Preferences
- Dark theme by default with cyan/teal accent colors (Zapp branding)
- Professional, clean interface suitable for international trade
- Responsive design for desktop and tablet use

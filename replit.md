# GSM-102 USDA Export Credit Guarantee Tracker

## Overview
A comprehensive tracking system for USDA GSM-102 Export Credit Guarantee transactions for Zapp Marketing and Manufacturing. This application helps manage international agricultural trade transactions from application through payment completion.

## Key Features
- **Transaction Tracking**: Create and track export transactions through 5 stages (Application → Approval → Shipment → Payment → Completed)
- **Transaction Templates**: 9 country-specific quick-start templates (Ghana, Nigeria, Senegal) including:
  - Single-product templates for rice, frozen chicken, edible oils, and tomato paste
  - Multi-product bundle templates for consolidated shipments (Protein Bundle, Staples Bundle, Food Bundle)
  - Pre-filled LC language and compliance requirements per template
- **90-Day Guided Workflow**: 6-phase wizard (Foundation → Compliance → Financing → Execution → Shipping → Scale) with task tracking and phase advancement
- **Document Management**: Upload and verify trade documents with AES-256 encryption indication, auto-complete functionality, and mobile document scanning via camera capture
- **Deal Room**: Organized folder structure (7 main folders) for professional deal organization matching trade industry standards
- **Master Compliance Checklist**: Comprehensive phase-based checklists for both exporters (8 phases) and importers (6 phases) with stop gates and blocking items
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
- `POST /api/documents/auto-complete` - Auto-complete checklist items based on document upload
- `GET /api/documents/:id/download` - Download individual document as formatted text
- `GET /api/transactions/:id/download-all` - Download complete document package for officials
- `POST /api/transactions/:id/email` - Email document package to officials via Resend
- `GET/POST /api/compliance` - List/add compliance items
- `PATCH /api/compliance/:id/status` - Update compliance status
- `GET /api/checklists/:transactionId` - Get transaction compliance checklist
- `PATCH /api/checklists/:transactionId/item` - Update checklist item status
- `GET /api/templates` - Get available transaction templates
- `GET/POST /api/workflows/:transactionId` - Get/create 90-day workflow for transaction
- `PATCH /api/workflows/:transactionId/task` - Update workflow task status
- `PATCH /api/workflows/:transactionId/phase` - Advance workflow to next phase
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

## Master Compliance Checklists

### Exporter Checklist (U.S. Side) - 8 Phases
1. **Pre-Deal Eligibility** - Exporter registration, GSM-102 qualification, product eligibility
2. **Commercial Setup** - Sales contract, incoterms, pricing, delivery schedule
3. **Financing & LC** - Bank confirmation, LC review, GSM-102 clauses (*STOP GATE: LC must be issued*)
4. **GSM-102 Guarantee** - Application submitted, fee paid, CCC guarantee issued
5. **Production & Shipping** - Goods inspected, permits verified, shipment booked
6. **Document Control** - Invoice, packing list, B/L, certificates prepared
7. **Presentation & Payment** - Docs pre-checked, presented, exporter paid
8. **Post-Shipment** - Arrival confirmed, customs cleared, deal archived

### Importer Checklist (Destination Side) - 6 Phases
1. **Corporate & Banking** - Company registration, tax ID, import license, bank relationship
2. **Regulatory** - Food authority approval, meat authorization, labeling (*STOP GATE: Permits required*)
3. **Financing** - LC application, terms approved, LC issued
4. **Shipping & Clearance** - Pre-arrival notice, customs broker, duties ready
5. **Receipt & Sale** - Goods cleared, warehoused, distribution commenced
6. **Repayment** - Bank repayment scheduled, executed, deal closed

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

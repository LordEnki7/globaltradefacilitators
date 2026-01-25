import { z } from "zod";

export const userRoleEnum = z.enum(["exporter", "importer", "admin"]);
export type UserRole = z.infer<typeof userRoleEnum>;

export const transactionStageEnum = z.enum(["application", "approval", "shipment", "payment", "completed"]);
export type TransactionStage = z.infer<typeof transactionStageEnum>;

export const documentTypeEnum = z.enum([
  "letter_of_credit",
  "commodity_certificate",
  "commercial_invoice",
  "packing_list",
  "bill_of_lading",
  "certificate_of_origin",
  "health_certificate",
  "insurance_certificate",
  "usda_form"
]);
export type DocumentType = z.infer<typeof documentTypeEnum>;

export const documentStatusEnum = z.enum(["pending", "uploaded", "verified", "rejected"]);
export type DocumentStatus = z.infer<typeof documentStatusEnum>;

export const complianceStatusEnum = z.enum(["pending", "in_progress", "completed", "overdue"]);
export type ComplianceStatus = z.infer<typeof complianceStatusEnum>;

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  company: string;
  country: string;
  email: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: userRoleEnum,
  company: z.string().min(2),
  country: z.string().min(2),
  email: z.string().email()
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface Transaction {
  id: string;
  dealId: string;
  exporterId: string;
  importerId: string;
  stage: TransactionStage;
  product: string;
  quantity: string;
  valueUsd: number;
  destinationCountry: string;
  exporterBank: string;
  importerBank: string;
  lcNumber: string;
  lcTenor: string;
  incoterms: string;
  createdAt: string;
  updatedAt: string;
  etd: string | null;
  eta: string | null;
  notes: string;
}

export const insertTransactionSchema = z.object({
  dealId: z.string().min(1),
  exporterId: z.string(),
  importerId: z.string(),
  product: z.string().min(2),
  quantity: z.string().min(1),
  valueUsd: z.number().positive(),
  destinationCountry: z.string().min(2),
  exporterBank: z.string().min(2),
  importerBank: z.string().min(2),
  lcNumber: z.string().optional().default(""),
  lcTenor: z.string().optional().default("180 days"),
  incoterms: z.string().optional().default("FOB"),
  etd: z.string().nullable().optional(),
  eta: z.string().nullable().optional(),
  notes: z.string().optional().default("")
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export interface Document {
  id: string;
  transactionId: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  notes: string;
}

export const insertDocumentSchema = z.object({
  transactionId: z.string(),
  type: documentTypeEnum,
  fileName: z.string().min(1),
  uploadedBy: z.string(),
  notes: z.string().optional().default("")
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export interface ComplianceItem {
  id: string;
  transactionId: string;
  name: string;
  description: string;
  status: ComplianceStatus;
  dueDate: string | null;
  completedAt: string | null;
  assignedTo: string | null;
}

export const insertComplianceItemSchema = z.object({
  transactionId: z.string(),
  name: z.string().min(2),
  description: z.string().optional().default(""),
  dueDate: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional()
});

export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;

export interface ApprovedCountry {
  code: string;
  name: string;
  region: string;
  approvedBanks: string[];
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "document_missing" | "deadline_approaching" | "stage_change" | "document_verified" | "action_required";
  title: string;
  message: string;
  transactionId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const insertNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(["document_missing", "deadline_approaching", "stage_change", "document_verified", "action_required"]),
  title: z.string().min(1),
  message: z.string().min(1),
  transactionId: z.string().nullable().optional()
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export const USDA_APPROVED_COUNTRIES: ApprovedCountry[] = [
  { code: "NG", name: "Nigeria", region: "Africa", approvedBanks: ["Access Bank", "Zenith Bank", "GTBank", "UBA", "FirstBank"], isActive: true },
  { code: "GH", name: "Ghana", region: "Africa", approvedBanks: ["Ecobank", "Stanbic", "GCB", "Standard Chartered"], isActive: true },
  { code: "SN", name: "Senegal", region: "Africa", approvedBanks: ["CBAO", "Société Générale Sénégal", "Ecobank"], isActive: true },
  { code: "DO", name: "Dominican Republic", region: "Caribbean", approvedBanks: ["Banco Multiple BHD León", "Banreservas"], isActive: true },
  { code: "MX", name: "Mexico", region: "North America", approvedBanks: ["BBVA Mexico", "Banorte", "Santander Mexico"], isActive: true },
  { code: "CO", name: "Colombia", region: "South America", approvedBanks: ["Bancolombia", "Banco de Bogotá", "Davivienda"], isActive: true },
  { code: "PE", name: "Peru", region: "South America", approvedBanks: ["BCP", "BBVA Peru", "Interbank"], isActive: true },
  { code: "PH", name: "Philippines", region: "Asia", approvedBanks: ["BDO Unibank", "Bank of the Philippine Islands", "Metrobank"], isActive: true },
  { code: "VN", name: "Vietnam", region: "Asia", approvedBanks: ["Vietcombank", "BIDV", "VietinBank"], isActive: true },
  { code: "ID", name: "Indonesia", region: "Asia", approvedBanks: ["Bank Mandiri", "BCA", "BNI"], isActive: true },
  { code: "EG", name: "Egypt", region: "Middle East & Africa", approvedBanks: ["National Bank of Egypt", "CIB", "Banque Misr"], isActive: true },
  { code: "KE", name: "Kenya", region: "Africa", approvedBanks: ["Equity Bank", "KCB", "Cooperative Bank"], isActive: true },
  { code: "JM", name: "Jamaica", region: "Caribbean", approvedBanks: ["National Commercial Bank", "Scotiabank Jamaica"], isActive: true },
  { code: "GT", name: "Guatemala", region: "Central America", approvedBanks: ["Banco Industrial", "BAC Guatemala"], isActive: true },
  { code: "CR", name: "Costa Rica", region: "Central America", approvedBanks: ["BAC San José", "Banco Nacional"], isActive: true }
];

export const REQUIRED_DOCUMENTS_BY_STAGE: Record<TransactionStage, DocumentType[]> = {
  application: ["letter_of_credit"],
  approval: ["letter_of_credit", "commercial_invoice", "packing_list"],
  shipment: ["bill_of_lading", "certificate_of_origin", "health_certificate", "insurance_certificate"],
  payment: ["usda_form", "commodity_certificate"],
  completed: []
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  letter_of_credit: "Letter of Credit",
  commodity_certificate: "Commodity Certificate",
  commercial_invoice: "Commercial Invoice",
  packing_list: "Packing List",
  bill_of_lading: "Bill of Lading",
  certificate_of_origin: "Certificate of Origin (U.S.)",
  health_certificate: "Health/Veterinary Certificate",
  insurance_certificate: "Insurance Certificate",
  usda_form: "USDA Form"
};

export const STAGE_LABELS: Record<TransactionStage, string> = {
  application: "Application",
  approval: "Approval",
  shipment: "Shipment",
  payment: "Payment",
  completed: "Completed"
};

export interface ChecklistItem {
  id: string;
  label: string;
  isBlocking?: boolean;
}

export interface ChecklistPhase {
  id: string;
  name: string;
  items: ChecklistItem[];
  hasStopGate?: boolean;
  stopGateMessage?: string;
}

export interface TransactionChecklist {
  transactionId: string;
  exporterChecklist: Record<string, boolean>;
  importerChecklist: Record<string, boolean>;
  updatedAt: string;
}

export const insertTransactionChecklistSchema = z.object({
  transactionId: z.string(),
  exporterChecklist: z.record(z.boolean()).optional().default({}),
  importerChecklist: z.record(z.boolean()).optional().default({})
});

export type InsertTransactionChecklist = z.infer<typeof insertTransactionChecklistSchema>;

export const EXPORTER_CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: "phase1",
    name: "Pre-Deal Eligibility",
    items: [
      { id: "exp_1_1", label: "Exporter is registered & active" },
      { id: "exp_1_2", label: "Exporter is GSM-102 qualified" },
      { id: "exp_1_3", label: "Product is GSM-102 eligible" },
      { id: "exp_1_4", label: "Production facility approved (USDA/FSIS if meat)" },
      { id: "exp_1_5", label: "No sanctions / restricted party issues" }
    ]
  },
  {
    id: "phase2",
    name: "Commercial Setup",
    items: [
      { id: "exp_2_1", label: "Sales contract executed" },
      { id: "exp_2_2", label: "Incoterms confirmed" },
      { id: "exp_2_3", label: "Pricing finalized (GSM fee embedded)" },
      { id: "exp_2_4", label: "Broker/facilitator fee acknowledged" },
      { id: "exp_2_5", label: "Delivery schedule agreed" }
    ]
  },
  {
    id: "phase3",
    name: "Financing & LC",
    hasStopGate: true,
    stopGateMessage: "STOP HERE IF LC NOT ISSUED",
    items: [
      { id: "exp_3_1", label: "Importer bank confirmed USDA-approved" },
      { id: "exp_3_2", label: "LC draft reviewed internally" },
      { id: "exp_3_3", label: "GSM-102 clause included in LC" },
      { id: "exp_3_4", label: "Assignment language included" },
      { id: "exp_3_5", label: "LC issued (irrevocable, USD)", isBlocking: true }
    ]
  },
  {
    id: "phase4",
    name: "GSM-102 Guarantee",
    items: [
      { id: "exp_4_1", label: "GSM-102 application submitted" },
      { id: "exp_4_2", label: "Guarantee fee paid" },
      { id: "exp_4_3", label: "CCC guarantee issued" },
      { id: "exp_4_4", label: "Guarantee assigned to U.S. bank" },
      { id: "exp_4_5", label: "U.S. bank confirmation received" }
    ]
  },
  {
    id: "phase5",
    name: "Production & Shipping",
    items: [
      { id: "exp_5_1", label: "Goods produced & inspected" },
      { id: "exp_5_2", label: "Import permits verified (copy on file)" },
      { id: "exp_5_3", label: "Health / veterinary certificates issued" },
      { id: "exp_5_4", label: "Labels verified (language + content)" },
      { id: "exp_5_5", label: "Shipment booked" }
    ]
  },
  {
    id: "phase6",
    name: "Document Control",
    items: [
      { id: "exp_6_1", label: "Commercial invoice prepared" },
      { id: "exp_6_2", label: "Packing list prepared" },
      { id: "exp_6_3", label: "Clean on-board B/L issued" },
      { id: "exp_6_4", label: "Certificate of origin issued" },
      { id: "exp_6_5", label: "Insurance certificate (if CIF)" }
    ]
  },
  {
    id: "phase7",
    name: "Presentation & Payment",
    items: [
      { id: "exp_7_1", label: "Docs pre-checked internally" },
      { id: "exp_7_2", label: "Docs presented within LC timeline" },
      { id: "exp_7_3", label: "No discrepancies OR waived" },
      { id: "exp_7_4", label: "Exporter paid at sight" }
    ]
  },
  {
    id: "phase8",
    name: "Post-Shipment",
    items: [
      { id: "exp_8_1", label: "Shipment arrival confirmed" },
      { id: "exp_8_2", label: "Customs clearance confirmed" },
      { id: "exp_8_3", label: "Repayment schedule logged" },
      { id: "exp_8_4", label: "Deal archived" }
    ]
  }
];

// Transaction Templates based on deal room documents
export interface ProductItem {
  name: string;
  quantity: string;
  valueUsd: number;
}

export interface TransactionTemplate {
  id: string;
  name: string;
  description: string;
  country: string;
  countryCode: string;
  productType: "dry_goods" | "frozen_meats" | "edible_oils" | "packaged_foods" | "multi_product";
  product: string;
  suggestedQuantity: string;
  suggestedValueUsd: number;
  lcTenor: string;
  incoterms: string;
  approvedBanks: string[];
  lcSpecialConditions: string;
  requiredDocuments: string[];
  countrySpecificRequirements: string[];
  products?: ProductItem[];
}

export const TRANSACTION_TEMPLATES: TransactionTemplate[] = [
  {
    id: "ng-rice",
    name: "Nigeria - Rice Export",
    description: "Standard rice export to Nigeria via USDA GSM-102",
    country: "Nigeria",
    countryCode: "NG",
    productType: "dry_goods",
    product: "Rice (Long Grain)",
    suggestedQuantity: "500 MT",
    suggestedValueUsd: 425000,
    lcTenor: "180 days",
    incoterms: "FOB",
    approvedBanks: ["Access Bank", "Zenith Bank", "GTBank", "UBA", "FirstBank"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. Discrepancies, if any, shall be waived within three (3) banking days.",
    requiredDocuments: ["Signed commercial invoice", "Packing list", "Clean on-board ocean bill of lading consigned to issuing bank", "Certificate of origin (United States)", "Insurance certificate (if CIF)"],
    countrySpecificRequirements: ["NAFDAC product approval letters", "NAFDAC import permit", "Port Health clearance", "FX capability confirmation (bank letter)"]
  },
  {
    id: "ng-chicken",
    name: "Nigeria - Frozen Chicken Export",
    description: "Frozen poultry export to Nigeria with cold chain requirements",
    country: "Nigeria",
    countryCode: "NG",
    productType: "frozen_meats",
    product: "Frozen Chicken",
    suggestedQuantity: "200 MT",
    suggestedValueUsd: 380000,
    lcTenor: "180 days",
    incoterms: "CIF",
    approvedBanks: ["Access Bank", "Zenith Bank", "GTBank", "UBA", "FirstBank"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. Discrepancies, if any, shall be waived within three (3) banking days.",
    requiredDocuments: ["Signed commercial invoice", "Packing list", "Clean on-board ocean bill of lading consigned to issuing bank", "Certificate of origin (United States)", "USDA veterinary/health certificate", "Insurance certificate"],
    countrySpecificRequirements: ["NAFDAC product approval letters", "NAFDAC import permit", "Cold-chain declaration (meats)", "Port Health clearance", "FX capability confirmation (bank letter)"]
  },
  {
    id: "gh-chicken",
    name: "Ghana - Frozen Chicken Export",
    description: "Ghana is fastest and cleanest for frozen products",
    country: "Ghana",
    countryCode: "GH",
    productType: "frozen_meats",
    product: "Frozen Chicken",
    suggestedQuantity: "200 MT",
    suggestedValueUsd: 350000,
    lcTenor: "180 days",
    incoterms: "CIF",
    approvedBanks: ["Ecobank", "Stanbic", "GCB", "Standard Chartered"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. Partial shipments allowed. Transshipment allowed.",
    requiredDocuments: ["Signed commercial invoice", "Packing list", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "USDA veterinary/health certificate", "Insurance certificate"],
    countrySpecificRequirements: ["FDA Ghana import permit", "Ghana Standards Authority compliance", "Product registration (if retail)", "Customs classification confirmation"]
  },
  {
    id: "gh-rice",
    name: "Ghana - Rice Export",
    description: "Ghana is fastest and cleanest market - recommended for first deals",
    country: "Ghana",
    countryCode: "GH",
    productType: "dry_goods",
    product: "Rice (Parboiled)",
    suggestedQuantity: "500 MT",
    suggestedValueUsd: 400000,
    lcTenor: "180 days",
    incoterms: "FOB",
    approvedBanks: ["Ecobank", "Stanbic", "GCB", "Standard Chartered"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. Partial shipments allowed. Transshipment allowed.",
    requiredDocuments: ["Signed commercial invoice", "Packing list", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "Insurance certificate (if CIF)"],
    countrySpecificRequirements: ["FDA Ghana import permit", "Ghana Standards Authority compliance", "Customs classification confirmation"]
  },
  {
    id: "sn-tomato",
    name: "Senegal - Tomato Paste Export",
    description: "Francophone market - French labeling required",
    country: "Senegal",
    countryCode: "SN",
    productType: "packaged_foods",
    product: "Tomato Paste",
    suggestedQuantity: "150 MT",
    suggestedValueUsd: 185000,
    lcTenor: "360 days",
    incoterms: "CIF",
    approvedBanks: ["CBAO", "Société Générale Sénégal", "Ecobank"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. All documents may be presented in English. Labels and regulatory documents may be bilingual (French/English).",
    requiredDocuments: ["Signed commercial invoice", "Packing list", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "Insurance certificate"],
    countrySpecificRequirements: ["Import license (Ministry of Commerce)", "Ministry of Health food authorization", "French labeling proof", "Customs valuation approval"]
  },
  {
    id: "sn-oils",
    name: "Senegal - Edible Oils Export",
    description: "Edible oils to Senegal with French labeling",
    country: "Senegal",
    countryCode: "SN",
    productType: "edible_oils",
    product: "Edible Oils",
    suggestedQuantity: "300 MT",
    suggestedValueUsd: 290000,
    lcTenor: "360 days",
    incoterms: "CIF",
    approvedBanks: ["CBAO", "Société Générale Sénégal", "Ecobank"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. All documents may be presented in English. Labels and regulatory documents may be bilingual (French/English).",
    requiredDocuments: ["Signed commercial invoice", "Packing list", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "Insurance certificate"],
    countrySpecificRequirements: ["Import license (Ministry of Commerce)", "Ministry of Health food authorization", "French labeling proof", "Customs valuation approval"]
  },
  {
    id: "gh-multi-protein",
    name: "Ghana - Multi-Product (Protein Bundle)",
    description: "Consolidated shipment of frozen chicken + rice to Ghana - ideal for mixed containers",
    country: "Ghana",
    countryCode: "GH",
    productType: "multi_product",
    product: "Frozen Chicken + Rice",
    suggestedQuantity: "Mixed Container",
    suggestedValueUsd: 650000,
    lcTenor: "180 days",
    incoterms: "CIF",
    approvedBanks: ["Ecobank", "Stanbic", "GCB", "Standard Chartered"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. Partial shipments allowed. Transshipment allowed. Multiple commodities covered under single LC.",
    requiredDocuments: ["Signed commercial invoice (itemized by product)", "Packing list (itemized by product)", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "USDA veterinary/health certificate (for meats)", "Insurance certificate"],
    countrySpecificRequirements: ["FDA Ghana import permit (per product category)", "Ghana Standards Authority compliance", "Cold-chain declaration (for frozen items)", "Product registration (if retail)"],
    products: [
      { name: "Frozen Chicken (leg quarters)", quantity: "150 MT", valueUsd: 285000 },
      { name: "Rice (Parboiled)", quantity: "400 MT", valueUsd: 365000 }
    ]
  },
  {
    id: "ng-multi-staples",
    name: "Nigeria - Multi-Product (Staples Bundle)",
    description: "Consolidated rice + edible oils shipment to Nigeria - common commodity pairing",
    country: "Nigeria",
    countryCode: "NG",
    productType: "multi_product",
    product: "Rice + Edible Oils",
    suggestedQuantity: "Mixed Container",
    suggestedValueUsd: 580000,
    lcTenor: "180 days",
    incoterms: "FOB",
    approvedBanks: ["Access Bank", "Zenith Bank", "GTBank", "UBA", "FirstBank"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. Discrepancies, if any, shall be waived within three (3) banking days. Multiple commodities covered under single LC. Partial shipments permitted.",
    requiredDocuments: ["Signed commercial invoice (itemized by product)", "Packing list (itemized by product)", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "Insurance certificate (if CIF)"],
    countrySpecificRequirements: ["NAFDAC product approval letters (per product)", "NAFDAC import permit (per product category)", "Port Health clearance", "FX capability confirmation (bank letter)"],
    products: [
      { name: "Rice (Long Grain)", quantity: "400 MT", valueUsd: 340000 },
      { name: "Soybean Oil", quantity: "200 MT", valueUsd: 240000 }
    ]
  },
  {
    id: "sn-multi-food",
    name: "Senegal - Multi-Product (Food Bundle)",
    description: "Consolidated tomato paste + edible oils to Senegal - French labeling required",
    country: "Senegal",
    countryCode: "SN",
    productType: "multi_product",
    product: "Tomato Paste + Edible Oils",
    suggestedQuantity: "Mixed Container",
    suggestedValueUsd: 420000,
    lcTenor: "360 days",
    incoterms: "CIF",
    approvedBanks: ["CBAO", "Société Générale Sénégal", "Ecobank"],
    lcSpecialConditions: "This Letter of Credit is issued in connection with a transaction supported by the USDA GSM-102 Export Credit Guarantee Program and may be assigned to a U.S. financial institution. All documents may be presented in English. Labels and regulatory documents may be bilingual (French/English). Multiple commodities covered under single LC.",
    requiredDocuments: ["Signed commercial invoice (itemized by product)", "Packing list (itemized by product)", "Clean on-board ocean bill of lading", "Certificate of origin (United States)", "Insurance certificate"],
    countrySpecificRequirements: ["Import license (Ministry of Commerce) - per product", "Ministry of Health food authorization - per product", "French labeling proof - per product", "Customs valuation approval"],
    products: [
      { name: "Tomato Paste", quantity: "120 MT", valueUsd: 145000 },
      { name: "Soybean Oil", quantity: "230 MT", valueUsd: 275000 }
    ]
  }
];

// 90-Day Workflow Phases based on deal execution timeline
export interface WorkflowPhase {
  id: string;
  name: string;
  dayRange: string;
  description: string;
  tasks: string[];
  requiredToAdvance: string[];
}

export const WORKFLOW_PHASES: WorkflowPhase[] = [
  {
    id: "foundation",
    name: "Foundation",
    dayRange: "Days 1-15",
    description: "Set up master contract, select target country, shortlist importers, confirm bank LC capability",
    tasks: [
      "Finalize master contract & LC template",
      "Select target country (start with Ghana)",
      "Shortlist 2 importers",
      "Confirm bank LC capability"
    ],
    requiredToAdvance: ["Sales contract ready", "Target country selected", "Importer identified"]
  },
  {
    id: "compliance",
    name: "Compliance",
    dayRange: "Days 16-30",
    description: "Complete importer onboarding, product approvals, labeling, logistics setup",
    tasks: [
      "Importer onboarding complete",
      "Product approvals submitted",
      "Labeling finalized",
      "Logistics partners confirmed"
    ],
    requiredToAdvance: ["Importer documentation verified", "Product registration in progress"]
  },
  {
    id: "financing",
    name: "Financing",
    dayRange: "Days 31-45",
    description: "Sign sales contract, issue LC, submit GSM-102 application, line up U.S. bank",
    tasks: [
      "Sales contract signed",
      "LC issued",
      "GSM-102 application submitted",
      "U.S. bank lined up"
    ],
    requiredToAdvance: ["LC issued and verified", "GSM-102 application filed"]
  },
  {
    id: "execution",
    name: "Execution",
    dayRange: "Days 46-60",
    description: "Guarantee issued, goods produced & staged, shipment booked, documents pre-checked",
    tasks: [
      "Guarantee issued",
      "Goods produced & staged",
      "Shipment booked",
      "Docs pre-checked"
    ],
    requiredToAdvance: ["CCC guarantee issued", "Shipment confirmed"]
  },
  {
    id: "shipping",
    name: "Shipping",
    dayRange: "Days 61-75",
    description: "Ship goods, present documents, receive payment",
    tasks: [
      "Goods shipped",
      "Docs presented",
      "Exporter paid"
    ],
    requiredToAdvance: ["Bill of lading issued", "Payment received"]
  },
  {
    id: "scale",
    name: "Scale",
    dayRange: "Days 76-90",
    description: "Import clearance, market sale, repayment tracking, queue next shipment",
    tasks: [
      "Import clearance",
      "Market sale",
      "Repayment tracking",
      "Next shipment queued"
    ],
    requiredToAdvance: ["Customs cleared", "Deal archived"]
  }
];

// Transaction workflow tracking
export interface TransactionWorkflow {
  transactionId: string;
  templateId: string | null;
  currentPhase: string;
  phaseStartDate: string;
  completedTasks: Record<string, boolean>;
  autoAdvanceEnabled: boolean;
  updatedAt: string;
}

export const insertTransactionWorkflowSchema = z.object({
  transactionId: z.string(),
  templateId: z.string().nullable().optional(),
  currentPhase: z.string().optional().default("foundation"),
  autoAdvanceEnabled: z.boolean().optional().default(true)
});

export type InsertTransactionWorkflow = z.infer<typeof insertTransactionWorkflowSchema>;

// Document to checklist item mapping for auto-complete
export const DOCUMENT_TO_CHECKLIST_MAPPING: Record<DocumentType, string[]> = {
  letter_of_credit: ["exp_3_5", "imp_3_3"],
  commercial_invoice: ["exp_6_1"],
  packing_list: ["exp_6_2"],
  bill_of_lading: ["exp_6_3"],
  certificate_of_origin: ["exp_6_4"],
  health_certificate: ["exp_5_3"],
  insurance_certificate: ["exp_6_5"],
  usda_form: ["exp_4_1"],
  commodity_certificate: ["exp_4_3"]
};

export const IMPORTER_CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: "phase1",
    name: "Corporate & Banking",
    items: [
      { id: "imp_1_1", label: "Company legally registered" },
      { id: "imp_1_2", label: "Tax ID active" },
      { id: "imp_1_3", label: "Import license valid" },
      { id: "imp_1_4", label: "Authorized signatories verified" },
      { id: "imp_1_5", label: "Bank relationship confirmed" }
    ]
  },
  {
    id: "phase2",
    name: "Regulatory",
    hasStopGate: true,
    stopGateMessage: "STOP HERE IF PERMITS NOT ISSUED",
    items: [
      { id: "imp_2_1", label: "Product approved by food authority" },
      { id: "imp_2_2", label: "Meat authorization obtained (if applicable)" },
      { id: "imp_2_3", label: "Cold storage confirmed (meats)" },
      { id: "imp_2_4", label: "Labeling compliant" },
      { id: "imp_2_5", label: "Import permit issued", isBlocking: true }
    ]
  },
  {
    id: "phase3",
    name: "Financing",
    items: [
      { id: "imp_3_1", label: "LC application submitted" },
      { id: "imp_3_2", label: "LC terms approved" },
      { id: "imp_3_3", label: "LC issued (USD, irrevocable)" },
      { id: "imp_3_4", label: "GSM-102 structure acknowledged" }
    ]
  },
  {
    id: "phase4",
    name: "Shipping & Clearance",
    items: [
      { id: "imp_4_1", label: "Pre-arrival notice filed" },
      { id: "imp_4_2", label: "Customs broker engaged" },
      { id: "imp_4_3", label: "Duties / VAT funds ready" },
      { id: "imp_4_4", label: "Port inspection coordinated" }
    ]
  },
  {
    id: "phase5",
    name: "Receipt & Sale",
    items: [
      { id: "imp_5_1", label: "Goods cleared" },
      { id: "imp_5_2", label: "Warehousing completed" },
      { id: "imp_5_3", label: "Distribution commenced" },
      { id: "imp_5_4", label: "Sales proceeds tracked" }
    ]
  },
  {
    id: "phase6",
    name: "Repayment",
    items: [
      { id: "imp_6_1", label: "Bank repayment scheduled" },
      { id: "imp_6_2", label: "Repayment executed on time" },
      { id: "imp_6_3", label: "Deal closed successfully" }
    ]
  }
];

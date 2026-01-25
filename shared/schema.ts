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

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

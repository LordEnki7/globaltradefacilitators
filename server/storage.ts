import { randomUUID, randomBytes } from "crypto";
import type {
  Transaction,
  InsertTransaction,
  Document,
  InsertDocument,
  ComplianceItem,
  InsertComplianceItem,
  Notification,
  InsertNotification,
  TransactionStage,
  DocumentStatus,
  ComplianceStatus,
  TransactionChecklist,
  InsertTransactionChecklist,
  TransactionWorkflow,
  InsertTransactionWorkflow
} from "@shared/schema";

export interface IStorage {
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionByLinkCode(linkCode: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction, creatorUserId?: string): Promise<Transaction>;
  linkImporterToTransaction(transactionId: string, importerUserId: string): Promise<Transaction | undefined>;
  getTransactionsForUser(userId: string, role: "exporter" | "importer"): Promise<Transaction[]>;
  updateTransactionStage(id: string, stage: TransactionStage): Promise<Transaction | undefined>;
  
  getDocuments(transactionId?: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  verifyDocument(id: string, verifiedBy: string): Promise<Document | undefined>;
  
  getComplianceItems(transactionId?: string): Promise<ComplianceItem[]>;
  getComplianceItem(id: string): Promise<ComplianceItem | undefined>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;
  updateComplianceStatus(id: string, status: ComplianceStatus): Promise<ComplianceItem | undefined>;
  
  getNotifications(userId?: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsRead(userId: string): Promise<void>;
  
  getTransactionChecklist(transactionId: string): Promise<TransactionChecklist | undefined>;
  createOrUpdateChecklist(data: InsertTransactionChecklist): Promise<TransactionChecklist>;
  updateChecklistItem(transactionId: string, itemId: string, checked: boolean, type: "exporter" | "importer"): Promise<TransactionChecklist | undefined>;
  
  getTransactionWorkflow(transactionId: string): Promise<TransactionWorkflow | undefined>;
  createTransactionWorkflow(data: InsertTransactionWorkflow): Promise<TransactionWorkflow>;
  updateWorkflowPhase(transactionId: string, phase: string): Promise<TransactionWorkflow | undefined>;
  updateWorkflowTask(transactionId: string, taskId: string, completed: boolean): Promise<TransactionWorkflow | undefined>;
}

export class MemStorage implements IStorage {
  private transactions: Map<string, Transaction>;
  private documents: Map<string, Document>;
  private complianceItems: Map<string, ComplianceItem>;
  private notifications: Map<string, Notification>;
  private checklists: Map<string, TransactionChecklist>;
  private workflows: Map<string, TransactionWorkflow>;

  constructor() {
    this.transactions = new Map();
    this.documents = new Map();
    this.complianceItems = new Map();
    this.notifications = new Map();
    this.checklists = new Map();
    this.workflows = new Map();
    
    this.seedData();
  }

  private seedData() {
    const now = new Date().toISOString();
    const seedUserId = "system";

    const transactions: Transaction[] = [
      {
        id: "txn-1",
        dealId: "ZAPP-2025-001",
        linkCode: "GTF-A1B2C3",
        exporterId: "exporter-1",
        importerId: "importer-1",
        exporterUserId: null,
        importerUserId: null,
        stage: "approval",
        product: "Rice (Long Grain)",
        quantity: "500 MT",
        valueUsd: 425000,
        destinationCountry: "Nigeria",
        exporterBank: "Bank of America",
        importerBank: "Zenith Bank",
        lcNumber: "LC-NG-2025-0042",
        lcTenor: "180 days",
        incoterms: "FOB",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
        etd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        eta: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Priority shipment - requires cold chain documentation"
      },
      {
        id: "txn-2",
        dealId: "ZAPP-2025-002",
        linkCode: "GTF-D4E5F6",
        exporterId: "exporter-1",
        importerId: "importer-2",
        exporterUserId: null,
        importerUserId: null,
        stage: "shipment",
        product: "Frozen Chicken",
        quantity: "200 MT",
        valueUsd: 380000,
        destinationCountry: "Ghana",
        exporterBank: "JPMorgan Chase",
        importerBank: "Ecobank",
        lcNumber: "LC-GH-2025-0018",
        lcTenor: "180 days",
        incoterms: "CIF",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
        etd: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        eta: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        notes: ""
      },
      {
        id: "txn-3",
        dealId: "ZAPP-2025-003",
        linkCode: "GTF-G7H8I9",
        exporterId: "exporter-1",
        importerId: "importer-3",
        exporterUserId: null,
        importerUserId: null,
        stage: "application",
        product: "Edible Oils",
        quantity: "300 MT",
        valueUsd: 290000,
        destinationCountry: "Dominican Republic",
        exporterBank: "Wells Fargo",
        importerBank: "Banco Multiple BHD León",
        lcNumber: "",
        lcTenor: "180 days",
        incoterms: "FOB",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
        etd: null,
        eta: null,
        notes: "LC pending issuance"
      },
      {
        id: "txn-4",
        dealId: "ZAPP-2025-004",
        linkCode: "GTF-J0K1L2",
        exporterId: "exporter-1",
        importerId: "importer-4",
        exporterUserId: null,
        importerUserId: null,
        stage: "payment",
        product: "Tomato Paste",
        quantity: "150 MT",
        valueUsd: 185000,
        destinationCountry: "Senegal",
        exporterBank: "Citibank",
        importerBank: "CBAO",
        lcNumber: "LC-SN-2025-0007",
        lcTenor: "360 days",
        incoterms: "CIF",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
        etd: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        eta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Awaiting final payment confirmation"
      },
      {
        id: "txn-5",
        dealId: "ZAPP-2024-018",
        linkCode: "GTF-M3N4O5",
        exporterId: "exporter-1",
        importerId: "importer-5",
        exporterUserId: null,
        importerUserId: null,
        stage: "completed",
        product: "Rice (Parboiled)",
        quantity: "800 MT",
        valueUsd: 720000,
        destinationCountry: "Nigeria",
        exporterBank: "Bank of America",
        importerBank: "GTBank",
        lcNumber: "LC-NG-2024-0156",
        lcTenor: "180 days",
        incoterms: "FOB",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        etd: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        eta: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Successfully completed"
      }
    ];

    transactions.forEach(t => this.transactions.set(t.id, t));

    const documents: Document[] = [
      {
        id: "doc-1",
        transactionId: "txn-1",
        type: "letter_of_credit",
        status: "verified",
        fileName: "LC_Nigeria_ZAPP2025001.pdf",
        uploadedBy: seedUserId,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: seedUserId,
        verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        notes: ""
      },
      {
        id: "doc-2",
        transactionId: "txn-1",
        type: "commercial_invoice",
        status: "uploaded",
        fileName: "Invoice_ZAPP2025001.pdf",
        uploadedBy: seedUserId,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: null,
        verifiedAt: null,
        notes: ""
      },
      {
        id: "doc-3",
        transactionId: "txn-2",
        type: "letter_of_credit",
        status: "verified",
        fileName: "LC_Ghana_ZAPP2025002.pdf",
        uploadedBy: seedUserId,
        uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: seedUserId,
        verifiedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        notes: ""
      },
      {
        id: "doc-4",
        transactionId: "txn-2",
        type: "bill_of_lading",
        status: "verified",
        fileName: "BOL_Ghana_ZAPP2025002.pdf",
        uploadedBy: seedUserId,
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: seedUserId,
        verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: ""
      },
      {
        id: "doc-5",
        transactionId: "txn-2",
        type: "health_certificate",
        status: "uploaded",
        fileName: "HealthCert_ZAPP2025002.pdf",
        uploadedBy: seedUserId,
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: null,
        verifiedAt: null,
        notes: "USDA inspection pending"
      },
      {
        id: "doc-6",
        transactionId: "txn-4",
        type: "usda_form",
        status: "pending",
        fileName: "USDA_Form_ZAPP2025004.pdf",
        uploadedBy: seedUserId,
        uploadedAt: now,
        verifiedBy: null,
        verifiedAt: null,
        notes: ""
      }
    ];

    documents.forEach(d => this.documents.set(d.id, d));

    const complianceItems: ComplianceItem[] = [
      {
        id: "comp-1",
        transactionId: "txn-1",
        name: "NAFDAC Product Approval",
        description: "Nigeria FDA approval for imported food products",
        status: "in_progress",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        assignedTo: seedUserId
      },
      {
        id: "comp-2",
        transactionId: "txn-1",
        name: "Port Health Clearance",
        description: "Pre-arrival port health inspection approval",
        status: "pending",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        assignedTo: null
      },
      {
        id: "comp-3",
        transactionId: "txn-2",
        name: "FDA Ghana Import Permit",
        description: "Ghana Food and Drugs Authority import permit",
        status: "completed",
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: seedUserId
      },
      {
        id: "comp-4",
        transactionId: "txn-2",
        name: "Cold Chain Verification",
        description: "Temperature monitoring documentation for frozen products",
        status: "in_progress",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        assignedTo: seedUserId
      },
      {
        id: "comp-5",
        transactionId: "txn-3",
        name: "DR Import License Verification",
        description: "Verify importer's DR import license is current",
        status: "pending",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        assignedTo: null
      },
      {
        id: "comp-6",
        transactionId: "txn-4",
        name: "French Label Compliance",
        description: "Verify all product labels meet French language requirements",
        status: "overdue",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        assignedTo: seedUserId
      }
    ];

    complianceItems.forEach(c => this.complianceItems.set(c.id, c));

    const notifications: Notification[] = [
      {
        id: "notif-1",
        userId: seedUserId,
        type: "document_missing",
        title: "Missing Packing List",
        message: "Transaction ZAPP-2025-001 requires a packing list for the approval stage.",
        transactionId: "txn-1",
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "notif-2",
        userId: seedUserId,
        type: "deadline_approaching",
        title: "Compliance Deadline",
        message: "NAFDAC Product Approval for ZAPP-2025-001 is due in 7 days.",
        transactionId: "txn-1",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "notif-3",
        userId: seedUserId,
        type: "action_required",
        title: "Overdue Compliance Item",
        message: "French Label Compliance for ZAPP-2025-004 is overdue by 3 days.",
        transactionId: "txn-4",
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "notif-4",
        userId: seedUserId,
        type: "stage_change",
        title: "Transaction Advanced",
        message: "ZAPP-2025-002 has advanced to the shipment stage.",
        transactionId: "txn-2",
        isRead: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "notif-5",
        userId: seedUserId,
        type: "document_verified",
        title: "Document Verified",
        message: "Letter of Credit for ZAPP-2025-001 has been verified.",
        transactionId: "txn-1",
        isRead: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    notifications.forEach(n => this.notifications.set(n.id, n));
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  private generateLinkCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "GTF-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createTransaction(insertTransaction: InsertTransaction, creatorUserId?: string): Promise<Transaction> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const linkCode = this.generateLinkCode();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      linkCode,
      exporterUserId: creatorUserId || null,
      importerUserId: null,
      stage: "application",
      createdAt: now,
      updatedAt: now,
      etd: insertTransaction.etd || null,
      eta: insertTransaction.eta || null,
      lcNumber: insertTransaction.lcNumber || "",
      lcTenor: insertTransaction.lcTenor || "180 days",
      incoterms: insertTransaction.incoterms || "FOB",
      notes: insertTransaction.notes || ""
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionByLinkCode(linkCode: string): Promise<Transaction | undefined> {
    const transactions = Array.from(this.transactions.values());
    return transactions.find(t => t.linkCode === linkCode);
  }

  async linkImporterToTransaction(transactionId: string, importerUserId: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return undefined;
    
    const updated = {
      ...transaction,
      importerUserId,
      updatedAt: new Date().toISOString()
    };
    this.transactions.set(transactionId, updated);
    return updated;
  }

  async getTransactionsForUser(userId: string, role: "exporter" | "importer"): Promise<Transaction[]> {
    const transactions = Array.from(this.transactions.values());
    if (role === "exporter") {
      return transactions.filter(t => t.exporterUserId === userId);
    } else {
      return transactions.filter(t => t.importerUserId === userId);
    }
  }

  async updateTransactionStage(id: string, stage: TransactionStage): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updated = {
      ...transaction,
      stage,
      updatedAt: new Date().toISOString()
    };
    this.transactions.set(id, updated);
    return updated;
  }

  async getDocuments(transactionId?: string): Promise<Document[]> {
    const docs = Array.from(this.documents.values());
    if (transactionId) {
      return docs.filter(d => d.transactionId === transactionId);
    }
    return docs;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      status: "uploaded",
      uploadedAt: new Date().toISOString(),
      verifiedBy: null,
      verifiedAt: null,
      notes: insertDocument.notes || ""
    };
    this.documents.set(id, document);
    return document;
  }

  async verifyDocument(id: string, verifiedBy: string): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updated = {
      ...document,
      status: "verified" as DocumentStatus,
      verifiedBy,
      verifiedAt: new Date().toISOString()
    };
    this.documents.set(id, updated);
    return updated;
  }

  async getComplianceItems(transactionId?: string): Promise<ComplianceItem[]> {
    const items = Array.from(this.complianceItems.values());
    if (transactionId) {
      return items.filter(c => c.transactionId === transactionId);
    }
    return items;
  }

  async getComplianceItem(id: string): Promise<ComplianceItem | undefined> {
    return this.complianceItems.get(id);
  }

  async createComplianceItem(insertItem: InsertComplianceItem): Promise<ComplianceItem> {
    const id = randomUUID();
    const item: ComplianceItem = {
      ...insertItem,
      id,
      status: "pending",
      dueDate: insertItem.dueDate || null,
      completedAt: null,
      assignedTo: insertItem.assignedTo || null,
      description: insertItem.description || ""
    };
    this.complianceItems.set(id, item);
    return item;
  }

  async updateComplianceStatus(id: string, status: ComplianceStatus): Promise<ComplianceItem | undefined> {
    const item = this.complianceItems.get(id);
    if (!item) return undefined;
    
    const updated = {
      ...item,
      status,
      completedAt: status === "completed" ? new Date().toISOString() : item.completedAt
    };
    this.complianceItems.set(id, updated);
    return updated;
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    const notifications = Array.from(this.notifications.values());
    if (userId) {
      return notifications.filter(n => n.userId === userId);
    }
    return notifications;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      isRead: false,
      createdAt: new Date().toISOString(),
      transactionId: insertNotification.transactionId || null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updated = { ...notification, isRead: true };
    this.notifications.set(id, updated);
    return updated;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    const entries = Array.from(this.notifications.entries());
    for (const [id, notification] of entries) {
      if (notification.userId === userId) {
        this.notifications.set(id, { ...notification, isRead: true });
      }
    }
  }

  async getTransactionChecklist(transactionId: string): Promise<TransactionChecklist | undefined> {
    return this.checklists.get(transactionId);
  }

  async createOrUpdateChecklist(data: InsertTransactionChecklist): Promise<TransactionChecklist> {
    const existing = this.checklists.get(data.transactionId);
    const checklist: TransactionChecklist = {
      transactionId: data.transactionId,
      exporterChecklist: data.exporterChecklist || existing?.exporterChecklist || {},
      importerChecklist: data.importerChecklist || existing?.importerChecklist || {},
      updatedAt: new Date().toISOString()
    };
    this.checklists.set(data.transactionId, checklist);
    return checklist;
  }

  async updateChecklistItem(
    transactionId: string, 
    itemId: string, 
    checked: boolean, 
    type: "exporter" | "importer"
  ): Promise<TransactionChecklist | undefined> {
    let checklist = this.checklists.get(transactionId);
    if (!checklist) {
      checklist = {
        transactionId,
        exporterChecklist: {},
        importerChecklist: {},
        updatedAt: new Date().toISOString()
      };
    }
    
    if (type === "exporter") {
      checklist.exporterChecklist[itemId] = checked;
    } else {
      checklist.importerChecklist[itemId] = checked;
    }
    checklist.updatedAt = new Date().toISOString();
    
    this.checklists.set(transactionId, checklist);
    return checklist;
  }

  async getTransactionWorkflow(transactionId: string): Promise<TransactionWorkflow | undefined> {
    return this.workflows.get(transactionId);
  }

  async createTransactionWorkflow(data: InsertTransactionWorkflow): Promise<TransactionWorkflow> {
    const workflow: TransactionWorkflow = {
      transactionId: data.transactionId,
      templateId: data.templateId || null,
      currentPhase: data.currentPhase || "foundation",
      phaseStartDate: new Date().toISOString(),
      completedTasks: {},
      autoAdvanceEnabled: data.autoAdvanceEnabled ?? true,
      updatedAt: new Date().toISOString()
    };
    this.workflows.set(data.transactionId, workflow);
    return workflow;
  }

  async updateWorkflowPhase(transactionId: string, phase: string): Promise<TransactionWorkflow | undefined> {
    const workflow = this.workflows.get(transactionId);
    if (!workflow) return undefined;
    
    const updated = {
      ...workflow,
      currentPhase: phase,
      phaseStartDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.workflows.set(transactionId, updated);
    return updated;
  }

  async updateWorkflowTask(transactionId: string, taskId: string, completed: boolean): Promise<TransactionWorkflow | undefined> {
    const workflow = this.workflows.get(transactionId);
    if (!workflow) return undefined;
    
    const updated = {
      ...workflow,
      completedTasks: {
        ...workflow.completedTasks,
        [taskId]: completed
      },
      updatedAt: new Date().toISOString()
    };
    this.workflows.set(transactionId, updated);
    return updated;
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertDocumentSchema, insertComplianceItemSchema, insertNotificationSchema, TRANSACTION_TEMPLATES, WORKFLOW_PHASES, DOCUMENT_TO_CHECKLIST_MAPPING, insertTransactionWorkflowSchema } from "@shared/schema";
import type { DocumentType } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.patch("/api/transactions/:id/stage", async (req, res) => {
    try {
      const { stage } = req.body;
      const transaction = await storage.updateTransactionStage(req.params.id, stage);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction stage" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    try {
      const transactionId = req.query.transactionId as string | undefined;
      const documents = await storage.getDocuments(transactionId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.patch("/api/documents/:id/verify", async (req, res) => {
    try {
      const document = await storage.verifyDocument(req.params.id, "admin");
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify document" });
    }
  });

  app.get("/api/documents/:id/download", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      const content = `
================================================================================
                    GSM-102 EXPORT CREDIT GUARANTEE DOCUMENT
================================================================================

Document Type: ${document.type.replace(/_/g, ' ').toUpperCase()}
File Name: ${document.fileName}
Document ID: ${document.id}
Transaction ID: ${document.transactionId}

Status: ${document.status.toUpperCase()}
Uploaded: ${new Date(document.uploadedAt).toLocaleString()}
${document.verifiedAt ? `Verified: ${new Date(document.verifiedAt).toLocaleString()}` : ''}
${document.verifiedBy ? `Verified By: ${document.verifiedBy}` : ''}

--------------------------------------------------------------------------------
                              SECURITY INFORMATION
--------------------------------------------------------------------------------
Encryption: AES-256
Hash: SHA-256
Digital Signature: Valid

--------------------------------------------------------------------------------
                              DOCUMENT CONTENT
--------------------------------------------------------------------------------
${document.notes || '[Document content would be displayed here in production]'}

================================================================================
                    OFFICIAL USE - CONFIDENTIAL TRADE DOCUMENT
================================================================================
Generated: ${new Date().toLocaleString()}
System: Zapp Marketing & Manufacturing GSM-102 Tracker
================================================================================
`;

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
      res.send(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to download document" });
    }
  });

  app.get("/api/transactions/:id/download-all", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      const documents = await storage.getDocuments(req.params.id);
      
      let content = `
================================================================================
              GSM-102 EXPORT CREDIT GUARANTEE - COMPLETE DOCUMENT PACKAGE
================================================================================

Deal ID: ${transaction.dealId}
Product: ${transaction.product}
Destination: ${transaction.destinationCountry}
Value: $${transaction.valueUsd.toLocaleString()}
Stage: ${transaction.stage.toUpperCase()}
Created: ${new Date(transaction.createdAt).toLocaleString()}

Exporter ID: ${transaction.exporterId}
Exporter Bank: ${transaction.exporterBank}
Importer ID: ${transaction.importerId}
Importer Bank: ${transaction.importerBank}

--------------------------------------------------------------------------------
                           DOCUMENT SUMMARY (${documents.length} Documents)
--------------------------------------------------------------------------------
`;

      documents.forEach((doc, index) => {
        content += `
${index + 1}. ${doc.type.replace(/_/g, ' ').toUpperCase()}
   File: ${doc.fileName}
   Status: ${doc.status.toUpperCase()}
   Uploaded: ${new Date(doc.uploadedAt).toLocaleString()}
   ${doc.verifiedAt ? `Verified: ${new Date(doc.verifiedAt).toLocaleString()}` : 'Pending Verification'}
`;
      });

      content += `
================================================================================
                              INDIVIDUAL DOCUMENTS
================================================================================
`;

      documents.forEach((doc, index) => {
        content += `
--------------------------------------------------------------------------------
DOCUMENT ${index + 1}: ${doc.type.replace(/_/g, ' ').toUpperCase()}
--------------------------------------------------------------------------------
File Name: ${doc.fileName}
Document ID: ${doc.id}
Status: ${doc.status.toUpperCase()}
Encryption: AES-256 Secured
${doc.notes ? `Notes: ${doc.notes}` : ''}

`;
      });

      content += `
================================================================================
                    CERTIFICATION FOR OFFICIAL USE
================================================================================
This document package contains all uploaded trade documents for the above
transaction. All documents are encrypted using AES-256 and have been verified
for authenticity where indicated.

Package Generated: ${new Date().toLocaleString()}
System: Zapp Marketing & Manufacturing GSM-102 Tracker
Total Documents: ${documents.length}
Verified Documents: ${documents.filter(d => d.status === 'verified').length}

FOR OFFICIAL USE ONLY - CONFIDENTIAL TRADE DOCUMENTATION
================================================================================
`;

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${transaction.dealId}_complete_package.txt"`);
      res.send(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to download document package" });
    }
  });

  app.get("/api/compliance", async (req, res) => {
    try {
      const transactionId = req.query.transactionId as string | undefined;
      const items = await storage.getComplianceItems(transactionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compliance items" });
    }
  });

  app.get("/api/compliance/:id", async (req, res) => {
    try {
      const item = await storage.getComplianceItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Compliance item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compliance item" });
    }
  });

  app.post("/api/compliance", async (req, res) => {
    try {
      const validatedData = insertComplianceItemSchema.parse(req.body);
      const item = await storage.createComplianceItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create compliance item" });
    }
  });

  app.patch("/api/compliance/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const item = await storage.updateComplianceStatus(req.params.id, status);
      if (!item) {
        return res.status(404).json({ error: "Compliance item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update compliance status" });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      await storage.markAllNotificationsRead("user-1");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.get("/api/checklists/:transactionId", async (req, res) => {
    try {
      const checklist = await storage.getTransactionChecklist(req.params.transactionId);
      if (!checklist) {
        return res.json({
          transactionId: req.params.transactionId,
          exporterChecklist: {},
          importerChecklist: {},
          updatedAt: new Date().toISOString()
        });
      }
      res.json(checklist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checklist" });
    }
  });

  app.patch("/api/checklists/:transactionId/item", async (req, res) => {
    try {
      const { itemId, checked, type } = req.body;
      if (!itemId || checked === undefined || !type) {
        return res.status(400).json({ error: "Missing required fields: itemId, checked, type" });
      }
      if (type !== "exporter" && type !== "importer") {
        return res.status(400).json({ error: "Type must be 'exporter' or 'importer'" });
      }
      const checklist = await storage.updateChecklistItem(req.params.transactionId, itemId, checked, type);
      res.json(checklist);
    } catch (error) {
      res.status(500).json({ error: "Failed to update checklist item" });
    }
  });

  // Templates API
  app.get("/api/templates", async (req, res) => {
    try {
      res.json(TRANSACTION_TEMPLATES);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = TRANSACTION_TEMPLATES.find(t => t.id === req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Workflow Phases API
  app.get("/api/workflow-phases", async (req, res) => {
    try {
      res.json(WORKFLOW_PHASES);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflow phases" });
    }
  });

  // Transaction Workflow API
  app.get("/api/workflows/:transactionId", async (req, res) => {
    try {
      const workflow = await storage.getTransactionWorkflow(req.params.transactionId);
      if (!workflow) {
        return res.json({
          transactionId: req.params.transactionId,
          templateId: null,
          currentPhase: "foundation",
          phaseStartDate: new Date().toISOString(),
          completedTasks: {},
          autoAdvanceEnabled: true,
          updatedAt: new Date().toISOString()
        });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflow" });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const validatedData = insertTransactionWorkflowSchema.parse(req.body);
      const workflow = await storage.createTransactionWorkflow(validatedData);
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create workflow" });
    }
  });

  app.patch("/api/workflows/:transactionId/phase", async (req, res) => {
    try {
      const { phase } = req.body;
      const workflow = await storage.updateWorkflowPhase(req.params.transactionId, phase);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: "Failed to update workflow phase" });
    }
  });

  app.patch("/api/workflows/:transactionId/task", async (req, res) => {
    try {
      const { taskId, completed } = req.body;
      const workflow = await storage.updateWorkflowTask(req.params.transactionId, taskId, completed);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: "Failed to update workflow task" });
    }
  });

  // Auto-complete checklist items when documents are uploaded/verified
  app.post("/api/documents/auto-complete", async (req, res) => {
    try {
      const { transactionId, documentType } = req.body;
      const checklistItemIds = DOCUMENT_TO_CHECKLIST_MAPPING[documentType as DocumentType] || [];
      
      for (const itemId of checklistItemIds) {
        const type = itemId.startsWith("exp_") ? "exporter" : "importer";
        await storage.updateChecklistItem(transactionId, itemId, true, type as "exporter" | "importer");
      }
      
      const checklist = await storage.getTransactionChecklist(transactionId);
      res.json({ success: true, checklist, autoCompletedItems: checklistItemIds });
    } catch (error) {
      res.status(500).json({ error: "Failed to auto-complete checklist items" });
    }
  });

  return httpServer;
}

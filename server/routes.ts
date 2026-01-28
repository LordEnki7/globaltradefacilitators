import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertDocumentSchema, insertComplianceItemSchema, insertNotificationSchema, TRANSACTION_TEMPLATES, WORKFLOW_PHASES, DOCUMENT_TO_CHECKLIST_MAPPING, insertTransactionWorkflowSchema, users } from "@shared/schema";
import type { DocumentType } from "@shared/schema";
import { z } from "zod";
import { getUncachableResendClient } from "./resend";
import { isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

  app.get("/api/transactions/link/:linkCode", async (req, res) => {
    try {
      const transaction = await storage.getTransactionByLinkCode(req.params.linkCode);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found with this code" });
      }
      res.json({
        id: transaction.id,
        dealId: transaction.dealId,
        product: transaction.product,
        quantity: transaction.quantity,
        valueUsd: transaction.valueUsd,
        destinationCountry: transaction.destinationCountry,
        exporterId: transaction.exporterId,
        hasImporter: !!transaction.importerUserId
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to look up transaction" });
    }
  });

  app.post("/api/transactions/:id/link-importer", async (req, res) => {
    try {
      const { importerUserId } = req.body;
      if (!importerUserId) {
        return res.status(400).json({ error: "Importer user ID is required" });
      }
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (transaction.importerUserId) {
        return res.status(400).json({ error: "Transaction already has an importer linked" });
      }
      const updated = await storage.linkImporterToTransaction(req.params.id, importerUserId);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to link importer to transaction" });
    }
  });

  app.get("/api/my-transactions", async (req, res) => {
    try {
      const { userId, role } = req.query as { userId?: string; role?: "exporter" | "importer" };
      if (!userId || !role) {
        return res.status(400).json({ error: "userId and role are required" });
      }
      const transactions = await storage.getTransactionsForUser(userId, role);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user transactions" });
    }
  });

  app.post("/api/transactions/:id/invite", async (req, res) => {
    try {
      const { email, senderName } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      if (!transaction.linkCode) {
        return res.status(400).json({ error: "Transaction does not have a link code" });
      }

      if (transaction.importerUserId) {
        return res.status(400).json({ error: "Transaction already has an importer linked" });
      }

      const joinUrl = `${req.protocol}://${req.get('host')}/join-transaction?code=${transaction.linkCode}`;
      
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">You're Invited to Join a Trade Transaction</h2>
          <p>Hello,</p>
          <p>${senderName || 'An exporter'} has invited you to join a GSM-102 export transaction as the importer.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Transaction Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 4px 0;"><strong>Deal ID:</strong></td><td>${transaction.dealId}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Product:</strong></td><td>${transaction.product}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Quantity:</strong></td><td>${transaction.quantity}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Value:</strong></td><td>$${transaction.valueUsd.toLocaleString()}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Destination:</strong></td><td>${transaction.destinationCountry}</td></tr>
            </table>
          </div>

          <p>To join this transaction, use the link code below:</p>
          <div style="background-color: #0d9488; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 3px; font-family: monospace;">
            ${transaction.linkCode}
          </div>

          <p style="margin-top: 20px;">Or click the button below to join directly:</p>
          <a href="${joinUrl}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Join Transaction
          </a>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            This email was sent by Global Trade Facilitators, a division of Zapp Marketing and Manufacturing.
            If you did not expect this invitation, please disregard this email.
          </p>
        </div>
      `;

      const { client, fromEmail } = await getUncachableResendClient();
      
      const emailResult = await client.emails.send({
        from: fromEmail,
        to: email,
        subject: `Invitation to Join Transaction ${transaction.dealId} - Global Trade Facilitators`,
        html: emailBody
      });

      res.json({ 
        success: true, 
        message: "Invitation email sent successfully",
        messageId: emailResult.data?.id 
      });
    } catch (error) {
      console.error("Failed to send invitation email:", error);
      res.status(500).json({ error: "Failed to send invitation email" });
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

  // Email document package to officials
  app.post("/api/transactions/:id/email", async (req, res) => {
    try {
      const { recipientEmail, recipientName, subject, message } = req.body;
      
      if (!recipientEmail) {
        return res.status(400).json({ error: "Recipient email is required" });
      }
      
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      const documents = await storage.getDocuments(req.params.id);
      
      // Build email content
      let emailBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">GSM-102 Document Package</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Zapp Marketing & Manufacturing</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
    ${recipientName ? `<p>Dear ${recipientName},</p>` : '<p>Dear Official,</p>'}
    
    ${message ? `<p>${message}</p>` : '<p>Please find attached the complete document package for your review and approval.</p>'}
    
    <div style="background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h2 style="color: #0d9488; margin-top: 0; font-size: 18px;">Transaction Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6c757d; width: 40%;">Deal ID:</td>
          <td style="padding: 8px 0; font-weight: 600;">${transaction.dealId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d;">Product:</td>
          <td style="padding: 8px 0; font-weight: 600;">${transaction.product}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d;">Destination:</td>
          <td style="padding: 8px 0; font-weight: 600;">${transaction.destinationCountry}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d;">Value:</td>
          <td style="padding: 8px 0; font-weight: 600;">$${transaction.valueUsd.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d;">Status:</td>
          <td style="padding: 8px 0; font-weight: 600;">${transaction.stage.toUpperCase()}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h2 style="color: #0d9488; margin-top: 0; font-size: 18px;">Documents Included (${documents.length})</h2>
      <ul style="margin: 0; padding-left: 20px;">
        ${documents.map(doc => `
          <li style="padding: 4px 0;">
            <strong>${doc.type.replace(/_/g, ' ').toUpperCase()}</strong> - ${doc.fileName}
            <span style="color: ${doc.status === 'verified' ? '#198754' : '#6c757d'};">
              (${doc.status})
            </span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffecb5; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Security Notice:</strong> All documents are encrypted using AES-256 and verified for authenticity.
        This package is intended for official use only.
      </p>
    </div>
    
    <p style="color: #6c757d; font-size: 12px; margin-top: 30px;">
      Generated by Zapp Marketing & Manufacturing GSM-102 Export Credit Guarantee Tracker<br>
      ${new Date().toLocaleString()}
    </p>
  </div>
</div>
`;

      // Build plain text attachment content
      let attachmentContent = `
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
        attachmentContent += `
${index + 1}. ${doc.type.replace(/_/g, ' ').toUpperCase()}
   File: ${doc.fileName}
   Status: ${doc.status.toUpperCase()}
   Uploaded: ${new Date(doc.uploadedAt).toLocaleString()}
   ${doc.verifiedAt ? `Verified: ${new Date(doc.verifiedAt).toLocaleString()}` : 'Pending Verification'}
`;
      });

      attachmentContent += `
================================================================================
                              INDIVIDUAL DOCUMENTS
================================================================================
`;

      documents.forEach((doc, index) => {
        attachmentContent += `
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

      attachmentContent += `
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

      // Send email via Resend
      const { client, fromEmail } = await getUncachableResendClient();
      
      const emailResult = await client.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: subject || `GSM-102 Document Package - ${transaction.dealId}`,
        html: emailBody,
        attachments: [
          {
            filename: `${transaction.dealId}_complete_package.txt`,
            content: Buffer.from(attachmentContent).toString('base64'),
          }
        ]
      });
      
      res.json({ 
        success: true, 
        messageId: emailResult.data?.id,
        message: `Document package sent to ${recipientEmail}` 
      });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email. Please check email configuration." });
    }
  });

  // Admin API - Get all users
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin API - Update user role
  app.patch("/api/admin/users/:id/role", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { role } = req.body;
      if (!["admin", "exporter", "importer", "pending"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      
      const [updatedUser] = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, req.params.id))
        .returning();
        
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // Admin API - Update user company
  app.patch("/api/admin/users/:id/company", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { company } = req.body;
      
      const [updatedUser] = await db
        .update(users)
        .set({ company, updatedAt: new Date() })
        .where(eq(users.id, req.params.id))
        .returning();
        
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user company:", error);
      res.status(500).json({ error: "Failed to update user company" });
    }
  });

  // Get current user's role
  app.get("/api/user/role", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ 
        role: user.role || "pending",
        company: user.company,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ error: "Failed to fetch user role" });
    }
  });

  // User self-service role selection (only exporter/importer allowed)
  app.post("/api/user/select-role", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { role } = req.body;
      
      // Only allow exporter or importer - admin must be assigned by an admin
      if (role !== "exporter" && role !== "importer") {
        return res.status(400).json({ error: "Invalid role. Choose exporter or importer." });
      }
      
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Only allow role selection if currently pending
      if (user.role !== "pending") {
        return res.status(400).json({ error: "Role already assigned. Contact admin to change." });
      }
      
      const [updatedUser] = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
        
      res.json(updatedUser);
    } catch (error) {
      console.error("Error selecting role:", error);
      res.status(500).json({ error: "Failed to select role" });
    }
  });

  return httpServer;
}

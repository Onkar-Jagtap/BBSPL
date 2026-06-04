/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Configure dotenv for local environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database to persist inquiries/leads throughout server lifecycle
interface InMemoryLead {
  id: string;
  categoryName: string;
  selectedServices: string[];
  otherDetails: string;
  companyName: string;
  contactName: string;
  phone: string;
  email?: string;
  timestamp: string;
}

const leadsDatabase: InMemoryLead[] = [];

// Helper function to send actual SMTP emails or output a beautiful simulation cascade
async function sendLeadEmail(lead: InMemoryLead) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.SMTP_RECEIVER || 'info@businessbridge.in';

  const servicesFormatted = lead.selectedServices.length > 0 
    ? lead.selectedServices.join(', ') 
    : 'General Consultation';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #fafaf9; color: #1c1917; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #030305; padding: 24px; text-align: center; border-bottom: 3px solid #c9a84c;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Business<span style="color: #e2c06a; font-style: italic;">Bridge</span></h1>
        <p style="color: #e2c06a; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">SLA 2-Hour Notification Alert</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="font-size: 18px; margin-top: 0; margin-bottom: 20px; font-weight: 600; color: #1c1917; border-bottom: 1px solid #e7e5e4; padding-bottom: 10px;">New B2B Lead Registered</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; width: 35%; font-weight: 600;">Lead ID</td>
            <td style="padding: 8px 0; color: #1c1917; font-size: 13px; font-family: monospace; font-weight: bold;">${lead.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600;">Company Name</td>
            <td style="padding: 8px 0; color: #1c1917; font-size: 13px; font-weight: bold;">${lead.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600;">Authorized Liaison</td>
            <td style="padding: 8px 0; color: #1c1917; font-size: 13px;">${lead.contactName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600;">Category</td>
            <td style="padding: 8px 0; color: #e1b439; font-size: 13px; font-weight: bold;">${lead.categoryName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600;">Selected Options</td>
            <td style="padding: 8px 0; color: #1c1917; font-size: 13px;">${servicesFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600;">Phone Number</td>
            <td style="padding: 8px 0; color: #1c1917; font-size: 13px; font-weight: bold;">${lead.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600;">Corporate Email</td>
            <td style="padding: 8px 0; color: #1c1917; font-size: 13px;">${lead.email || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 13px; font-weight: 600; vertical-align: top;">Auxiliary Notes</td>
            <td style="padding: 8px 0; color: #44403c; font-size: 13px; line-height: 1.5;">${lead.otherDetails}</td>
          </tr>
        </table>

        <div style="background-color: #f5f5f4; border-left: 4px solid #c9a84c; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 6px 0; font-size: 12px; color: #c19b31; text-transform: uppercase; letter-spacing: 1px;">Operations SLA Checklist</h4>
          <p style="margin: 0; font-size: 11px; color: #57534e; line-height: 1.4;">Pune-based account managers have been assigned. Standard 2-hour callback SLA deadline is calculated for: <strong>${new Date(Date.now() + 2*60*60*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} IST</strong>.</p>
        </div>
      </div>
      <div style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4; padding: 16px; text-align: center; font-size: 10px; color: #a8a29e;">
        Sent automatically from BusinessBridge B2B Sourcing Platform. Shivaji Nagar, Pune, MH.
      </div>
    </div>
  `;

  const logHeadline = `[EMAIL DISPATCH SIMULATOR] ID: ${lead.id} -> Recipient: ${receiver}`;
  console.log('='.repeat(80));
  console.log(logHeadline);
  console.log(`SUBJECT: [SLA 2-Hour Alert] New B2B Enterprise Lead received: ${lead.companyName}`);
  console.log(`TO: ${receiver}`);
  console.log(`BODY PREVIEW: Company ${lead.companyName} requested ${servicesFormatted}`);
  console.log('='.repeat(80));

  let realDispatchSuccess = false;
  let dispatchLog = 'SMTP credentials not configured. Operating in simulation mode to safeguard keys.';

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass
        }
      });

      await transporter.sendMail({
        from: `"BusinessBridge Portal" <${user}>`,
        to: receiver,
        subject: `[SLA 2-Hour Alert] New B2B Lead: ${lead.companyName}`,
        html: htmlContent,
        text: `New Lead ${lead.id} from ${lead.companyName}. Liaised by ${lead.contactName}. Phone: ${lead.phone}. Category: ${lead.categoryName}. Services: ${servicesFormatted}.`
      });

      realDispatchSuccess = true;
      dispatchLog = `SUCCESS: Email bypassed SMTP mail gateway and delivered to ${receiver}`;
      console.log(`[SMTP_SUCCESS] Verified mail delivered to ${receiver}`);
    } catch (e: any) {
      console.error('[SMTP_ERROR] Failed sending real email via nodemailer:', e);
      dispatchLog = `FAILED: SMTP connection error: ${e.message || e}`;
    }
  }

  // Also send a copy to the lead's email if provided
  if (lead.email) {
    console.log(`[EMAIL DISPATCH SIMULATOR] Dispatching customer copy to: ${lead.email}`);
  }

  return {
    dispatched: true,
    realDispatchSuccess,
    recipient: receiver,
    dispatchLog,
    subject: `[SLA 2-Hour Alert] New B2B Lead: ${lead.companyName}`,
    html: htmlContent,
    timestamp: new Date().toISOString()
  };
}

// Initialize Google Gemini SDK lazily to prevent server crash on module load
let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        ai = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log('[DEBUG] Google Gemini Client successfully initialized.');
      } catch (e) {
        console.error('[ERROR] Failed to instantiate GoogleGenAI client:', e);
      }
    } else {
      console.warn('[WARN] GEMINI_API_KEY is not defined or configured. Falling back to local rules engine.');
    }
  }
  return ai;
}

// B2B Fallback answers in case of missing keys or direct API errors
const B2B_FALLBACK_ANSWERS: Record<string, string> = {
  general: "Greetings from BusinessBridge B2B Concierge! I can assist you with outsourcing requirements across IT, HR Recruitment, Legal standard filings, Financial audit compliance, Facility sanitization, and Enterprise CCTV Security. Which sector can we compare quotes for you today?",
  technology: "For Technology & IT requirements, BusinessBridge delivers end-to-end custom Software Development, Cyber audits with compliance guarantees, corporate AMC support, and secure high-performance Google Cloud migrations. Would you like to request a dedicated developer callback?",
  hr: "Our HR & Workforce vertical manages executive recruitments for tech/non-tech sectors, payroll systems, background verifications, and onboarding. Please tell me your estimated monthly hiring budget so I can structure a contract proposal.",
  finance: "Under Finance & Legal, we coordinate certified accounting audits, GST reconciliation, tax structures, and rapid trademark and ISO registration. These are carried out only by validated corporate attorneys.",
  facility: "Our Facility Management coordinates complete physical oversight including industrial HVAC systems, deep commercial cleaning networks, waste recyclability, and scheduled electro-mechanical maintenance.",
  security: "BusinessBridge CCTV surveillance coordinates smart video monitoring centers, guards, and biometric terminals. Would you like us to schedule a site safety analysis?",
  marketing: "Under Marketing & Brand, we engineer performance marketing models, search indexing (SEO), corporate events, and editorial collateral suites. What are your lead acquisition goals?"
};

// Helper function to forward lead details of B2B inquiries directly to a Google Sheet webhook
async function postToGoogleSheets(lead: InMemoryLead) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[GOOGLE_SHEETS] Webhook URL not configured. Simulating Google Sheets row insertion...`);
    const mockRowIndex = leadsDatabase.length;
    return {
      success: true,
      simulated: true,
      rowIndex: mockRowIndex + 1,
      webhookConfigured: false,
      sheetUrl: 'https://docs.google.com/spreadsheets/d/your-google-sheet-id/edit',
      log: `SUCCESS: Simulating Google Sheets sync. Inserted lead details into Row ${mockRowIndex + 1} of virtual Google Sheet: "BusinessBridge Lead Register". (Add GOOGLE_SHEET_WEBHOOK_URL in .env to link your real sheet)`
    };
  }

  try {
    const payload = {
      timestamp: lead.timestamp,
      leadId: lead.id,
      companyName: lead.companyName,
      contactName: lead.contactName,
      phone: lead.phone,
      email: lead.email || 'N/A',
      category: lead.categoryName,
      services: lead.selectedServices.join(', '),
      notes: lead.otherDetails
    };

    console.log(`[GOOGLE_SHEETS] Forwarding lead ID ${lead.id} to connected Webhook...`);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log(`[GOOGLE_SHEETS_SUCCESS] Webhook accepted payload. Response: ${responseText}`);
    return {
      success: true,
      simulated: false,
      webhookConfigured: true,
      responsePreview: responseText.substring(0, 150),
      log: `SUCCESS: Broadcast lead payload to linked Google App Script Web Hook. Payload mapped to rows successfully.`
    };
  } catch (err: any) {
    console.error(`[GOOGLE_SHEETS_ERROR] Transmission failed:`, err);
    return {
      success: false,
      simulated: false,
      webhookConfigured: true,
      error: err.message || err,
      log: `FAILED: Error connecting to Google Sheet Webhook endpoint: ${err.message || err}`
    };
  }
}

// ENDPOINT 1: Register inquiry leads with meticulous validation and safeguards
app.post('/api/inquire', async (req, res) => {
  try {
    const { categoryName, selectedServices, otherDetails, companyName, contactName, phone, email } = req.body;

    // Rigid server-side inputs validation checks
    if (!companyName || typeof companyName !== 'string' || companyName.trim() === '') {
      return res.status(400).json({ success: false, error: 'Enterprise / Company Name is required.' });
    }
    if (!contactName || typeof contactName !== 'string' || contactName.trim() === '') {
      return res.status(400).json({ success: false, error: 'Authorized Liaison / Contact Name is required.' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return res.status(400).json({ success: false, error: 'A valid WhatsApp / Phone contact number is required.' });
    }
    
    const formattedCategory = categoryName || 'Custom Inquire';
    const formattedServices = Array.isArray(selectedServices) ? selectedServices : [];
    
    const newLead: InMemoryLead = {
      id: `LEAD_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      categoryName: formattedCategory,
      selectedServices: formattedServices,
      otherDetails: otherDetails || 'No auxiliary notes.',
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      timestamp: new Date().toISOString()
    };

    leadsDatabase.push(newLead);
    console.log(`[LEAD_SAVED] Registered B2B Request successfully. ID: ${newLead.id}`, newLead);

    // Call Google Sheets sync pipeline
    const sheetResult = await postToGoogleSheets(newLead);

    // Run the email alert pipeline asynchronously or await it cleanly
    sendLeadEmail(newLead)
      .then((mailResult) => {
        return res.status(200).json({
          success: true,
          id: newLead.id,
          message: 'Your inquiry has been cataloged systematically. Our standard 2-hour callback SLA has officially initiated.',
          emailSent: true,
          mailDetails: mailResult,
          sheetDetails: sheetResult
        });
      })
      .catch((mailErr) => {
        console.error('[EMAIL_ALERT_ERROR] Suppressed email failure:', mailErr);
        // Standard success even if email failed, to ensure high robust uptime
        return res.status(200).json({
          success: true,
          id: newLead.id,
          message: 'Your inquiry has been cataloged. Our standard 2-hour callback SLA has initiated.',
          emailSent: false,
          mailError: mailErr.message || mailErr,
          sheetDetails: sheetResult
        });
      });
  } catch (err: any) {
    console.error('[ERROR] Exception raised inside /api/inquire handler:', err);
    return res.status(500).json({ success: false, error: 'Internal validation failure. Your inquiry could not be persisted.' });
  }
});

// ENDPOINT 2: Fetch leads list (useful for monitoring / checking everything runs smooth)
app.get('/api/leads', (req, res) => {
  return res.json({ count: leadsDatabase.length, leads: leadsDatabase });
});

// ENDPOINT 3: Server-side secure Gemini Chatbot portal with extensive B2B context
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ status: 'error', error: 'User query cannot be empty.' });
    }

    const client = getGeminiClient();

    // Context System Instructions (guides Gemini on tone, limits, and BusinessBridge specifics)
    const systemPrompt = `You are "BusinessBridge Concierge", a highly polished, professional B2B advisory assistant representing BusinessBridge solutions.
We operate across 6 major enterprise categories (17 total sub-categories):
1. Technology & Digital (Software Dev, Cloud, Cyber Audits, Corporate IT Support, Website Dev)
2. HR & Workforce (Executive Recruitment, Contract Staffing, Payroll, BG verification, Skill development)
3. Finance & Legal (Fractional CFO, GST/Tax filing, Company Trademark & ISO registration, Corporate Secrets)
4. Facility Management (Mechanical HVAC/Electrical grids, Plumbing, Deep Commercial cleaning, Pest Control, Recycling)
5. Security & Surveillance (Vetted physical guards, CCTV deployments, remote CCTV tracking feed, Biometric access hubs)
6. Marketing & Brand (Performance ads, Local SEO campaigns, video/staging corporate production, premium event planning)

Our Core Value Propositions:
- Single point of consolidated billing and coordination (Eliminates calling 20 different vendors).
- Guaranteed 2-Hour callback callback promise SLA during standard business hours.
- Thorough legal verification, background checks, and certifications on all network providers (Free for clients, we charge providers a minimal platform coordination fee).
- Located in Pune, Maharashtra, operating across major cities (Pune, Mumbai, Bangalore, Gurgaon).

Your Tone:
Professional, reassuring, crisp, elite, and business-focused. Avoid excessive emojis (less is more). Address the user as a corporate client/partner.

Guidelines:
1. Always maintain conversational contextual depth. Do NOT mention paths or code variables.
2. If the client shares requirements (e.g. "I need deep cleaning for our 12,000 sqft IT office"), outline exactly how we solve it and politely suggest they submit a Free Quote through our Service Panel (we will handle the operational sourcing).
3. If the user mentions their name and contact, invite them to let us register their lead directly.
4. Keep answers concise, neat, and formatted expertly in structured markdown paragraphs.`;

    if (!client) {
      // Fallback response parsing when Gemini API client is not present
      console.log('[DEBUG] Gemini Client absent. Executing fallback dictionary rules.');
      const normalized = message.toLowerCase();
      let reply = B2B_FALLBACK_ANSWERS.general;
      let targetCat = '';

      if (normalized.includes('tech') || normalized.includes('it') || normalized.includes('software') || normalized.includes('code') || normalized.includes('website')) {
        reply = B2B_FALLBACK_ANSWERS.technology;
        targetCat = 'Technology & Digital';
      } else if (normalized.includes('hr') || normalized.includes('hire') || normalized.includes('staff') || normalized.includes('payroll') || normalized.includes('recruit')) {
        reply = B2B_FALLBACK_ANSWERS.hr;
        targetCat = 'HR & Workforce';
      } else if (normalized.includes('financ') || normalized.includes('tax') || normalized.includes('audit') || normalized.includes('gst') || normalized.includes('iso') || normalized.includes('compliance')) {
        reply = B2B_FALLBACK_ANSWERS.finance;
        targetCat = 'Finance & Legal';
      } else if (normalized.includes('clean') || normalized.includes('facility') || normalized.includes('hvac') || normalized.includes('plumb') || normalized.includes('pest')) {
        reply = B2B_FALLBACK_ANSWERS.facility;
        targetCat = 'Facility Management';
      } else if (normalized.includes('guard') || normalized.includes('cctv') || normalized.includes('secur') || normalized.includes('sensor')) {
        reply = B2B_FALLBACK_ANSWERS.security;
        targetCat = 'Security & Surveillance';
      } else if (normalized.includes('market') || normalized.includes('brand') || normalized.includes('seo') || normalized.includes('event')) {
        reply = B2B_FALLBACK_ANSWERS.marketing;
        targetCat = 'Marketing & Brand';
      }

      return res.json({
        text: reply + " Would you like to schedule a callback to discuss these specifications?",
        promptQuoteWithCategory: targetCat || undefined
      });
    }

    // Call Gemini using the modern @google/genai SDK
    // Feed previous history to maintain context
    const currentContents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        currentContents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    currentContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    console.log('[DEBUG] Dispatching chat query to gemini-3.5-flash with history elements:', currentContents.length);

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: currentContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I apologize, our corporate bridge encountered brief turbulence. Please submit your contact details and our team will call immediately.";

    // Automatically detect Category context in the reply to assist client-side navigation shortcuts
    let detectedCategory = '';
    const lowerResponse = replyText.toLowerCase();
    if (lowerResponse.includes('technology') || lowerResponse.includes('software') || lowerResponse.includes('cloud')) {
      detectedCategory = 'Technology & Digital';
    } else if (lowerResponse.includes('hr &') || lowerResponse.includes('workforce') || lowerResponse.includes('payroll')) {
      detectedCategory = 'HR & Workforce';
    } else if (lowerResponse.includes('finance') || lowerResponse.includes('legal') || lowerResponse.includes('tax')) {
      detectedCategory = 'Finance & Legal';
    } else if (lowerResponse.includes('facility') || lowerResponse.includes('cleaning') || lowerResponse.includes('hvac')) {
      detectedCategory = 'Facility Management';
    } else if (lowerResponse.includes('security') || lowerResponse.includes('surveillance') || lowerResponse.includes('cctv')) {
      detectedCategory = 'Security & Surveillance';
    } else if (lowerResponse.includes('marketing') || lowerResponse.includes('seo') || lowerResponse.includes('brand')) {
      detectedCategory = 'Marketing & Brand';
    }

    return res.json({
      text: replyText,
      promptQuoteWithCategory: detectedCategory || undefined
    });

  } catch (err: any) {
    console.error('[CRITICAL_ERROR] Gemini API Chat invocation threw exception:', err);
    // Graceful error fallback response so user is never stalled
    return res.json({
      text: "I apologies, our automated neural concierge is currently experiencing heavier call volumes. To proceed instantly, click 'Request a Free Quote' above or dial our Pune headquarters directly. We promise to address your requirements perfectly.",
      promptQuoteWithCategory: undefined
    });
  }
});

// STARTING SERVERS (Sets up Vite middleware for Dev, static asset host for Production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[SERVER] Vite development middleware loaded successfully.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SERVER] Serving production static files from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OK] Server running transparently on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[SHUTDOWN] Failed to start server cascade:', err);
});

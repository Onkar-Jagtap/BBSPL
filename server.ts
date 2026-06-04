/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

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
  general: "Greetings from BusinessBridge B2B Concierge! I can assist you with outsourcing requirements across Technology, IT Hardware Rentals, Workforce & Admin Solutions, Finance, Legal & Consulting, Marketing, Office Interiors, Facilities, Security, Logistics, food service and Industrial operations. Which sector can we compare quotes for you today?",
  technology: "For Technology & Digital Solutions, BusinessBridge delivers end-to-end custom Software Development, custom AI pipelines, cloud architecture services, and corporate IT support helpdesks. Would you like to request an expedited callback?",
  rentals: "Our IT Hardware & Equipment Rentals division manages premium enterprise laptop leases, desktops, servers, and printer fleets with rapid on-site replacement guarantees. What is your estimated hardware requirement scope?",
  workforce: "Our Workforce & Admin Solutions division manages executive recruitment, contract staffing, receptionist provisions, data entry operations, paper records digitization, and office consumables supply. Please tell me your staffing scope so I can structure a contract proposal.",
  finance: "Under Finance, Legal & Consulting, we coordinate certified accounting, fractional CFO advisory, GST filings, trademark application, ISO certification audits, and process improvement consulting.",
  marketing: "Under Marketing & Brand Solutions, we engineer performance marketing models, search indexing (SEO), graphic branding guidelines, video/photo editing, printing, and custom corporate gifts. What are your client acquisition targets?",
  office: "For Office Interiors & Space Setup, we design layout visual blueprints, perform fit-out constructions, and supply ergonomic workstations & media room audio-video equipment.",
  facility: "Our Facility, Housekeeping & Security division manages physical premises integrity, AC/electrical/plumbing engineering audits, deep workspace cleaning, remote AI-assisted CCTV video hubs, and certified security guard units under a single consolidated quality guarantee.",
  logistics: "Our Logistics & Freight Services division manages secure warehouse storage operations, multi-modal container truck cargo freight, last-mile delivery lanes, and secure courier legal envelope dispatches.",
  food: "Our Food, Pantry & Wellness division manages daily corporate employee breakfast/lunch catering, coffee machine programs, snacks delivery, routine water RO maintenance, and preventative employee medical checkups.",
  manufacturing: "Under Manufacturing & Industrial Services, we coordinate CNC contract machining, specialized metal welding/fabrication fabrication, large cargo packaging solutions, and accredited quality controllers."
};

// ENDPOINT 1: Register inquiry leads with meticulous validation and safeguards
app.post('/api/inquire', (req, res) => {
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

    return res.status(200).json({
      success: true,
      id: newLead.id,
      message: 'Your inquiry has been cataloged systematically. Our standard 24/7 support active priority response has officially initiated.'
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
We operate across 10 major consolidated enterprise categories representing all enterprise support sectors:
1. Technology & Digital Solutions (custom software development, custom AI automated pipelines, website/mobile engineering, cloud architecture, cybersecurity)
2. IT Hardware & Equipment Rentals (premium enterprise laptop fleet rentals, workstations, server setups, printer fleet leasing)
3. Workforce & Admin Solutions (placement, contract staffing, payroll processing, bg check, admin reception, documentation, office procurement, uniforms)
4. Finance, Legal & Consulting (bookkeeping, CA tax/GST, company/trademark registration, regulatory audit standards, fractional CFO, business consulting, research reviews)
5. Marketing & Brand Solutions (performance marketing PPC/SEO, branding guides, graphic content, photos, corporate gifting, signage printing)
6. Office Interiors & Space Setup (designer floor plans, corporate fit-outs, workstation ergonomics, media conference rooms)
7. Facility, Housekeeping & Security (mechanical-electrical HVAC contracts, AC, water RO, deep sanitizing, pest control, security guards, CCTV setup, access cards)
8. Logistics & Freight Services (transportation cargo, warehousing space, last-mile delivery runs, executive courier documents)
9. Food, Pantry & Wellness (corporate catering, healthy worker meals, coffee machines, routine gym contracts, on-site medics groups, counselors)
10. Manufacturing & Industrial Services (precise CNC machining, structural fabrication, industrial packing boxes, manual tech workers)

Our Core Value Propositions:
- Single point of consolidated communication (Eliminates calling 20 different vendors).
- Guaranteed 24/7 support setup & round-the-clock callback promise.
- Our Revenue Model: Absolutely zero markups on quotations! We deliver authentic partner price quotes directly to the user to choose from. Our business generates revenue entirely through a match commission percentage paid directly by the selected supplier / vendor.
- Located in Pune, Maharashtra, serving enterprise operations nationwide across major Indian cities (Pune, Mumbai, Bangalore, Gurgaon, NCR).

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

      if (normalized.includes('rental') || normalized.includes('lease') || normalized.includes('laptop') || normalized.includes('desktop') || normalized.includes('hardware')) {
        reply = B2B_FALLBACK_ANSWERS.rentals;
        targetCat = 'IT Hardware & Equipment Rentals';
      } else if (normalized.includes('tech') || normalized.includes('it') || normalized.includes('software') || normalized.includes('code') || normalized.includes('website') || normalized.includes('dev') || normalized.includes('ai ')) {
        reply = B2B_FALLBACK_ANSWERS.technology;
        targetCat = 'Technology & Digital Solutions';
      } else if (normalized.includes('hr') || normalized.includes('hire') || normalized.includes('staff') || normalized.includes('payroll') || normalized.includes('recruit') || normalized.includes('admin') || normalized.includes('procure') || normalized.includes('reception') || normalized.includes('unif')) {
        reply = B2B_FALLBACK_ANSWERS.workforce;
        targetCat = 'Workforce & Admin Solutions';
      } else if (normalized.includes('financ') || normalized.includes('tax') || normalized.includes('audit') || normalized.includes('gst') || normalized.includes('iso') || normalized.includes('compliance') || normalized.includes('consult') || normalized.includes('legal') || normalized.includes('law')) {
        reply = B2B_FALLBACK_ANSWERS.finance;
        targetCat = 'Finance, Legal & Consulting';
      } else if (normalized.includes('clean') || normalized.includes('facility') || normalized.includes('hvac') || normalized.includes('plumb') || normalized.includes('pest') || normalized.includes('secur') || normalized.includes('guard') || normalized.includes('cctv') || normalized.includes('camera')) {
        reply = B2B_FALLBACK_ANSWERS.facility;
        targetCat = 'Facility, Housekeeping & Security';
      } else if (normalized.includes('market') || normalized.includes('brand') || normalized.includes('seo') || normalized.includes('event') || normalized.includes('ppc') || normalized.includes('video') || normalized.includes('gift')) {
        reply = B2B_FALLBACK_ANSWERS.marketing;
        targetCat = 'Marketing & Brand Solutions';
      } else if (normalized.includes('interior') || normalized.includes('furniture') || normalized.includes('workstation') || normalized.includes('fit-out') || normalized.includes('renov')) {
        reply = B2B_FALLBACK_ANSWERS.office;
        targetCat = 'Office Interiors & Space Setup';
      } else if (normalized.includes('logist') || normalized.includes('freight') || normalized.includes('warehouse') || normalized.includes('transport') || normalized.includes('courier')) {
        reply = B2B_FALLBACK_ANSWERS.logistics;
        targetCat = 'Logistics & Freight Services';
      } else if (normalized.includes('food') || normalized.includes('catering') || normalized.includes('meal') || normalized.includes('pantry') || normalized.includes('wellness') || normalized.includes('gym') || normalized.includes('water') || normalized.includes('ro ')) {
        reply = B2B_FALLBACK_ANSWERS.food;
        targetCat = 'Food, Pantry & Wellness';
      } else if (normalized.includes('machin') || normalized.includes('fabric') || normalized.includes('weld') || normalized.includes('pack') || normalized.includes('industr')) {
        reply = B2B_FALLBACK_ANSWERS.manufacturing;
        targetCat = 'Manufacturing & Industrial Services';
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
    if (lowerResponse.includes('rental') || lowerResponse.includes('lease') || lowerResponse.includes('laptop')) {
      detectedCategory = 'IT Hardware & Equipment Rentals';
    } else if (lowerResponse.includes('technology') || lowerResponse.includes('software') || lowerResponse.includes('cloud') || lowerResponse.includes('digital') || lowerResponse.includes('dev')) {
      detectedCategory = 'Technology & Digital Solutions';
    } else if (lowerResponse.includes('workforce') || lowerResponse.includes('staffing') || lowerResponse.includes('payroll') || lowerResponse.includes('admin') || lowerResponse.includes('recruitment')) {
      detectedCategory = 'Workforce & Admin Solutions';
    } else if (lowerResponse.includes('finance') || lowerResponse.includes('legal') || lowerResponse.includes('tax') || lowerResponse.includes('compliance') || lowerResponse.includes('consulting')) {
      detectedCategory = 'Finance, Legal & Consulting';
    } else if (lowerResponse.includes('marketing') || lowerResponse.includes('seo') || lowerResponse.includes('brand') || lowerResponse.includes('ppc')) {
      detectedCategory = 'Marketing & Brand Solutions';
    } else if (lowerResponse.includes('interior') || lowerResponse.includes('furniture') || lowerResponse.includes('layout')) {
      detectedCategory = 'Office Interiors & Space Setup';
    } else if (lowerResponse.includes('facility') || lowerResponse.includes('cleaning') || lowerResponse.includes('security') || lowerResponse.includes('cctv') || lowerResponse.includes('housekeeping')) {
      detectedCategory = 'Facility, Housekeeping & Security';
    } else if (lowerResponse.includes('logistic') || lowerResponse.includes('freight') || lowerResponse.includes('warehouse') || lowerResponse.includes('delivery')) {
      detectedCategory = 'Logistics & Freight Services';
    } else if (lowerResponse.includes('food') || lowerResponse.includes('catering') || lowerResponse.includes('pantry') || lowerResponse.includes('wellness') || lowerResponse.includes('meal')) {
      detectedCategory = 'Food, Pantry & Wellness';
    } else if (lowerResponse.includes('manufactur') || lowerResponse.includes('machin') || lowerResponse.includes('fabrication') || lowerResponse.includes('industrial')) {
      detectedCategory = 'Manufacturing & Industrial Services';
    }

    return res.json({
      text: replyText,
      promptQuoteWithCategory: detectedCategory || undefined
    });

  } catch (err: any) {
    console.error('[CRITICAL_ERROR] Gemini API Chat invocation threw exception:', err);
    // Graceful error fallback response so user is never stalled
    return res.json({
      text: "I apologize, our automated neural concierge is currently experiencing heavier call volumes. To proceed instantly, click 'Request a Free Quote' above or dial our headquarters directly. We promise to address your requirements perfectly.",
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

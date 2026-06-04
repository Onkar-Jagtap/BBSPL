/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceCategory =
  | 'Technology & Digital Solutions'
  | 'IT Hardware & Equipment Rentals'
  | 'Workforce & Admin Solutions'
  | 'Finance, Legal & Consulting'
  | 'Marketing & Brand Solutions'
  | 'Office Interiors & Space Setup'
  | 'Facility, Housekeeping & Security'
  | 'Logistics & Freight Services'
  | 'Food, Pantry & Wellness'
  | 'Manufacturing & Industrial Services';

export interface B2BServiceData {
  category: ServiceCategory;
  icon: string;
  shortDesc: string;
  detailedDesc: string;
  options: string[];
}

export interface InquiryPayload {
  categoryName: string;
  selectedServices: string[];
  otherDetails: string;
  companyName: string;
  contactName: string;
  phone: string;
  email?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedAnswers?: string[];
  promptQuoteWithCategory?: string;
}

export const CATEGORY_SERVICES: Record<ServiceCategory, string[]> = {
  'Technology & Digital Solutions': [
    'AI Automation',
    'Software Development',
    'Mobile App Development',
    'Website Development',
    'ERP Implementation',
    'CRM Solutions',
    'Cloud Services',
    'Cybersecurity',
    'Network Infrastructure',
    'IT Support Services'
  ],
  'IT Hardware & Equipment Rentals': [
    'Laptop Rentals',
    'Desktop Rentals',
    'Printer Rentals'
  ],
  'Workforce & Admin Solutions': [
    'Recruitment & Executive Search',
    'Contract Staffing',
    'Temporary Manpower',
    'Payroll Processing',
    'Background Verification',
    'Employee Training',
    'Employee Engagement Programs',
    'Reception Staffing',
    'Virtual Assistants',
    'Call Center Services',
    'Data Entry Services',
    'Document Digitization',
    'Records Management',
    'Office Supplies',
    'Electronics Procurement',
    'Safety Equipment',
    'Uniforms',
    'Stationery',
    'Printer Consumables'
  ],
  'Finance, Legal & Consulting': [
    'Accounting & Bookkeeping',
    'CFO-as-a-Service',
    'Tax & GST Filing',
    'Company Registration',
    'Trademark Registration',
    'Legal Services',
    'Contract Management',
    'ISO Certifications',
    'Compliance Audits',
    'Business Consulting',
    'Market Research',
    'Survey Services',
    'Mystery Shopping',
    'Process Improvement Consulting'
  ],
  'Marketing & Brand Solutions': [
    'Digital Marketing',
    'SEO',
    'PPC Advertising',
    'Social Media Management',
    'Branding',
    'Content Writing',
    'Video Editing',
    'Photography & Videography',
    'Corporate Gifts',
    'Printing & Signage'
  ],
  'Office Interiors & Space Setup': [
    'Office Interior Design',
    'Fit-Out Projects',
    'Renovation Services',
    'Workstations',
    'Office Furniture',
    'Conference Room Setup'
  ],
  'Facility, Housekeeping & Security': [
    'Facility Management Contracts',
    'Electrical Services',
    'Plumbing Services',
    'AC Maintenance',
    'Generator Maintenance',
    'Lift Maintenance',
    'Fire Safety Compliance',
    'Gardening & Landscaping',
    'Waste Management',
    'Office Cleaning',
    'Deep Cleaning',
    'Washroom Cleaning',
    'Carpet Cleaning',
    'Furniture Cleaning',
    'Pest Control',
    'Security Guard Services',
    'CCTV Installation',
    'CCTV Monitoring',
    'Access Control Systems',
    'Visitor Management Systems'
  ],
  'Logistics & Freight Services': [
    'Freight Services',
    'Warehousing',
    'Transportation',
    'Last-Mile Delivery',
    'Courier Services',
    'Document Delivery'
  ],
  'Food, Pantry & Wellness': [
    'Corporate Catering',
    'Event Catering',
    'Daily Corporate Meals',
    'Pantry Management',
    'Refreshment Programs',
    'Tea & Coffee Vending',
    'Drinking Water Solutions',
    'RO Maintenance',
    'Pantry Supplies',
    'Snacks & Refreshments',
    'Health Checkups',
    'Corporate Gym Partnerships',
    'On-Site Medical Support',
    'Mental Wellness Programs'
  ],
  'Manufacturing & Industrial Services': [
    'CNC Machining',
    'Fabrication',
    'Welding',
    'Packaging Solutions',
    'Quality Inspection',
    'Industrial Manpower'
  ]
};

export const SERVICES_LIST: B2BServiceData[] = [
  {
    category: 'Technology & Digital Solutions',
    icon: '💻',
    shortDesc: 'End-to-end software engineering, custom AI automated pipelines, high-security cloud architecture, and corporate IT support.',
    detailedDesc: 'Unify your development lifecycle and scale smoothly with certified senior programmers. We manage custom software, mobile apps, website engineering, enterprise ERP/CRM installations, cybersecurity audit parameters, and 24/7 dedicated system helpdesks.',
    options: CATEGORY_SERVICES['Technology & Digital Solutions']
  },
  {
    category: 'IT Hardware & Equipment Rentals',
    icon: '🖥️',
    shortDesc: 'Flexible workstation leasing contracts, laptop fleet rentals, high-performance desktops, and printer equipment leasing.',
    detailedDesc: 'Avoid large capital expend and scale your team size up or down dynamically with zero upfront hardware overhead. We supply and manage premium enterprise laptops, high-performance desktops, and industrial printers with prompt on-premise replacement SLAs and full-service repair support included.',
    options: CATEGORY_SERVICES['IT Hardware & Equipment Rentals']
  },
  {
    category: 'Workforce & Admin Solutions',
    icon: '👥',
    shortDesc: 'Executive talent hiring, temporary staffing, automated payroll, virtual assistants, and office consumable management.',
    detailedDesc: 'Streamline your HR pipeline and day-to-day administrative support overhead with audited recruitment protocols, rapid temp-staffing provisioning, automated payroll execution, records digitization, and prompt deskside office supplies.',
    options: CATEGORY_SERVICES['Workforce & Admin Solutions']
  },
  {
    category: 'Finance, Legal & Consulting',
    icon: '⚖️',
    shortDesc: 'Bookkeeping, CFO advisory, tax filings, corporate registration, standard legal contracts, and process optimization consulting.',
    detailedDesc: 'Maintain pristine corporate records and strategic direction using our network of seasoned corporate attorneys and CPA/CA practitioners. We manage tax reconciliations, intellectual property filings, ISO audits, business growth plans, and corporate secretarial tasks.',
    options: CATEGORY_SERVICES['Finance, Legal & Consulting']
  },
  {
    category: 'Marketing & Brand Solutions',
    icon: '📢',
    shortDesc: 'Multi-channel digital marketing, visual graphic branding, editorial content design, and custom corporate giftware.',
    detailedDesc: 'Target premium market share and build strong corporate identity. We orchestrate performant digital advertising channels (PPC, SEO), cohesive brand guides, multimedia video editing, on-site photography, high-end corporate hampers, and sign boards.',
    options: CATEGORY_SERVICES['Marketing & Brand Solutions']
  },
  {
    category: 'Office Interiors & Space Setup',
    icon: '🏢',
    shortDesc: 'Modern commercial office layouts, ergonomic workstations, interior design, and meeting room media setups.',
    detailedDesc: 'Transform white-shell commercial floors into high-efficiency office assets. Designing smart spatial floor plans, executing fit-out projects, supply-assembly of ergonomic desks/chairs, and premium acoustic integration for video conferencing rooms.',
    options: CATEGORY_SERVICES['Office Interiors & Space Setup']
  },
  {
    category: 'Facility, Housekeeping & Security',
    icon: '🔒',
    shortDesc: 'Comprehensive facilities operations, certified electro-mechanical engineers, sanitization, and enterprise security guard forces with CCTV.',
    detailedDesc: 'Guarantee seamless day-to-day physical premises integrity. We unify mechanical-electrical maintenance (HVAC, fire panels, water ROs), executive security details, AI-assisted video surveillance centers, and premium cleaning contracts under one rigid Service Level Agreement (SLA).',
    options: CATEGORY_SERVICES['Facility, Housekeeping & Security']
  },
  {
    category: 'Logistics & Freight Services',
    icon: '🚚',
    shortDesc: 'National freight logistics, secure cold-chain/dry warehousing, last-mile delivery, and rapid document couriers.',
    detailedDesc: 'Align your supply chain pipelines. We coordinate multi-modal cargo transit, temperature/security-controlled inventory warehousing, last-mile fulfillment hubs, and extremely responsive legal/contractual courier dispatches.',
    options: CATEGORY_SERVICES['Logistics & Freight Services']
  },
  {
    category: 'Food, Pantry & Wellness',
    icon: '❤️',
    shortDesc: 'Standard employee meal provisions, managed high-volume kitchen setups, coffee vending, and preventative corporate health programs.',
    detailedDesc: 'Enhance employee satisfaction and retention. We provide daily corporate buffet arrangements, snack bar provisions, certified water RO systems, tea/coffee automated machines, medical checkups, on-site physical support rooms, and employee counseling.',
    options: CATEGORY_SERVICES['Food, Pantry & Wellness']
  },
  {
    category: 'Manufacturing & Industrial Services',
    icon: '🔧',
    shortDesc: 'High-precision CNC milling, custom raw material fabrication, bulk standard packaging, and qualified technical labor.',
    detailedDesc: 'Augment your physical production lines. Scale industrial activities smoothly with certified machinists, heavy welding solutions, precise visual quality inspections, and fully biodegradable industrial shipping solutions.',
    options: CATEGORY_SERVICES['Manufacturing & Industrial Services']
  }
];

export const GENERAL_QUESTIONS = [
  {
    question: 'Is there a cost to use BusinessBridge?',
    answer: 'Enquiring and receiving compared, vetted quotes through BusinessBridge is completely free. We earn a small coordination fee directly from our service partners upon successful project initiation — meaning there are absolutely zero extra costs, markups, or hidden service fees billed to your enterprise.'
  },
  {
    question: 'How quickly do you respond to inquiries?',
    answer: 'We guarantee a professional callback to define terms and answer queries within 2 business hours of receiving a quote or registration form. Our dedicated account executives coordinate everything immediately to provide initial comparative outlines within 24 hours.'
  },
  {
    question: 'How are your partner businesses and services vetted?',
    answer: 'Every vendor undergoes a comprehensive certification check including legal registrations (GST, CIN, ISO where applicable), creditworthiness checks, physical site visits, reviews of past corporate performance, and continuous operational checks on every active contract.'
  },
  {
    question: 'Can you handle multi-city or national outsourcing deployments?',
    answer: 'Yes! BusinessBridge acts as a single point of consolidation. If you operate offices in Mumbai, Pune, Bangalore, or Gurgaon, we can unify physical facility management, workforce provisions, and network oversight under a single, simplified master agreement.'
  },
  {
    question: 'Can we transition an existing vendor contract over to your managed system?',
    answer: 'Absolutely. We will conduct a thorough transition audit, standardize service level agreements (SLAs), verify performance bounds, and onboarding the team smoothly without a single hour of business interruption.'
  }
];

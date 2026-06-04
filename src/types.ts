/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceCategory =
  | 'Technology & Digital'
  | 'HR & Workforce'
  | 'Finance & Legal'
  | 'Facility Management'
  | 'Security & Surveillance'
  | 'Marketing & Brand'
  | 'Logistics & Fleet Commute'
  | 'Legal Consults & Corporate Secretarial'
  | 'Catering & Corporate F&B'
  | 'Sanitization & Pest Hygiene'
  | 'Corporate Travel & Stays'
  | 'Bulk Stationery & Custom Printing'
  | 'Workspace Leasing & Fit-Outs'
  | 'Gifting & Merchandising'
  | 'Wellness & Corporate Insurance'
  | 'ESG, Carbon & Energy Audits'
  | 'Custom Signage & Branding Displays';

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
  'Technology & Digital': [
    'Software Development',
    'Cloud Architecture & Migration',
    'Cybersecurity & Auditing',
    'Corporate IT Support & AMC',
    'Website & Mobile App Design'
  ],
  'HR & Workforce': [
    'Executive & Leadership Hiring',
    'Contractual General Staffing',
    'Automated Payroll Processing',
    'Background & Credential Verification',
    'Corporate Skill Reinforcement'
  ],
  'Finance & Legal': [
    'Fractional CFO & Advisory',
    'Company, GST & Trademark Registration',
    'Indirect Tax Compliance & Filing',
    'ISO & Quality Standard Certifications',
    'Corporate Secretarial Audits'
  ],
  'Facility Management': [
    'HVAC & Electro-Mechanical Maintenance',
    'Plumbing & Plumbing Networks',
    'Routine & Deep Commercial Cleaning',
    'Comprehensive Industrial Pest Control',
    'Eco-conscious Waste Recyclability'
  ],
  'Security & Surveillance': [
    'Vetted Physical Guard services',
    'CCTV Infrastructure Deployment',
    'Active Remote CCTV feeds monitor',
    'Bio-metric Access Control Setup',
    'Executive Protection & Concierge security'
  ],
  'Marketing & Brand': [
    'Dynamic Social & SEO Campaigns',
    'Brand Identity & Collateral Design',
    'Targeted Pay-per-Click Campaigns',
    'Corporate Video & Staging production',
    'Premium Corporate Event Planning & Execution'
  ],
  'Logistics & Fleet Commute': [
    'Employee Pick-up & Shuttles',
    'Enterprise Freight & Road Transport',
    'Inter-State Warehousing Transfer',
    'Real-time GPS Fleet Monitoring',
    'Corporate Courier & Consignment Management'
  ],
  'Legal Consults & Corporate Secretarial': [
    'SLA & Business Contract Drafting',
    'Patent & IP Portfolio Management',
    'Corporate Arbitration & Disputes Resolutions',
    'Regulatory Licensing Compliance filings',
    'Due Diligence Audits'
  ],
  'Catering & Corporate F&B': [
    'In-House Corporate Kitchen Engineering',
    'Daily Exec/Staff Buffet Meals',
    'Pre-packaged Boardroom Lunch boxes',
    'Automatic Vending Units setup',
    'Pantry Consumables Supply management'
  ],
  'Sanitization & Pest Hygiene': [
    'Deep Structural Termite termination',
    'Medical-grade Ward Disinfection',
    'Chemical & Bio-Waste disposal audits',
    'HEPA Air Filtration deployment',
    'Commercial Odor-Control systems'
  ],
  'Corporate Travel & Stays': [
    'Bulk Flight & Train Reservations',
    'Dynamic Luxury Hotel contracts',
    'Corporate Forex Support concierge',
    'Expedited Corporate Visa approvals',
    'Unified Employee Cab Booking platform'
  ],
  'Bulk Stationery & Custom Printing': [
    'High-volume Corporate Printing schedules',
    'Tailored Files & Ledger Storage supplies',
    'Paper & Tech Accessories bulk storage',
    'Bespoke Bound Manuals & notebooks',
    'Direct-Desk Stationery replenish scheme'
  ],
  'Workspace Leasing & Fit-Outs': [
    'Commercial Office Space Sourcing',
    'Virtual Corporate Address allocations',
    'Acoustic-Insulated Drywall layouts',
    'Ergonomic Modular Desk installations',
    'Secure Packaging & Logistics Relocations'
  ],
  'Gifting & Merchandising': [
    'Branded Apparel & Promotional materials',
    'Corporate Executive Leather hampers',
    'Curated Smart Electronic kits',
    'Employee IDs & Branded Accessories',
    'Trophy & Appreciation Plaque carvings'
  ],
  'Wellness & Corporate Insurance': [
    'Group Health Insurance policy grids',
    'On-site paramedic & Emergency suites',
    'Daily Mindful & Stress-reflux camps',
    'Annual Master Health Checkup setups',
    'Corporate Gym & Club tier affiliations'
  ],
  'ESG, Carbon & Energy Audits': [
    'Greenhouse gas Carbon Accounting audits',
    'Rooftop Grid Solar Installation plans',
    'LEED Sustainability Engineering consult',
    'Certified Electronic Waste destruction',
    'Smart Energy Consumption monitors'
  ],
  'Custom Signage & Branding Displays': [
    'Lobby 3D Acrylic & Metallic signage',
    'LED Outdoor light-box banners',
    'Warehouse Warning & Hazard posters',
    'Exhibition Retractable standees',
    'Corporate Signboard Repair & AMC'
  ]
};

export const SERVICES_LIST: B2BServiceData[] = [
  {
    category: 'Technology & Digital',
    icon: '💻',
    shortDesc: 'Software engineering development, cloud computing orchestration, and zero-trust cybersecurity audits.',
    detailedDesc: 'Empower your enterprise with certified software engineers, rigorous zero-trust compliance standards, and highly resilient cloud orchestration managed on AWS and Google Cloud Platform.',
    options: CATEGORY_SERVICES['Technology & Digital']
  },
  {
    category: 'HR & Workforce',
    icon: '👥',
    shortDesc: 'Executive leadership recruitment, contract staffing provisions, and automated payroll operations.',
    detailedDesc: 'Streamline human resource cycles with premium talent sourcing matching your niche requirements, contractual general staffing solutions, and fully audited, cloud-accessible payroll schedules.',
    options: CATEGORY_SERVICES['HR & Workforce']
  },
  {
    category: 'Finance & Legal',
    icon: '⚖️',
    shortDesc: 'Fractional CFO consulting, professional GST filings, corporate trademark registry, and ISO audit protocols.',
    detailedDesc: 'Establish rigid financial oversight with seasoned fractional CFO professionals, rapid corporate and intellectual registry filings, tax reconciliation schemes, and standardized audit credentials.',
    options: CATEGORY_SERVICES['Finance & Legal']
  },
  {
    category: 'Facility Management',
    icon: '🏢',
    shortDesc: 'Complete mechanical maintenance (HVAC & Electrical), commercial plumbing, and deep sanitation.',
    detailedDesc: 'Preserve commercial asset value via premium mechanical maintenance schedules, expert electrical assessments, deep cleaning sanitization routines, and eco-certified pest controls.',
    options: CATEGORY_SERVICES['Facility Management']
  },
  {
    category: 'Security & Surveillance',
    icon: '🔒',
    shortDesc: 'Vetted guards recruitment, modern HD CCTV surveillance, and biometric access networks.',
    detailedDesc: 'Defend organizational assets with elite physical security presence, remote AI-enhanced operational camera centers, smart facial-reading hubs, and continuous hazard reporting.',
    options: CATEGORY_SERVICES['Security & Surveillance']
  },
  {
    category: 'Marketing & Brand',
    icon: '📢',
    shortDesc: 'Performance digital advertising, localized SEO architectures, collateral suites, and launch events.',
    detailedDesc: 'Accelerate client acquisition and brand authority. We engineer custom performance marketing models, targeted local indexing, corporate launch events, and editorial collateral suites.',
    options: CATEGORY_SERVICES['Marketing & Brand']
  },
  {
    category: 'Logistics & Fleet Commute',
    icon: '🚚',
    shortDesc: 'Employee transit shuttles, cross-border shipping, inter-state warehousing logistics, and GPS monitoring.',
    detailedDesc: 'Ensure on-time material transfer and workforce commute. We implement enterprise cab fleets, real-time tracking dashboard access, and audited inter-state logistics structures.',
    options: CATEGORY_SERVICES['Logistics & Fleet Commute']
  },
  {
    category: 'Legal Consults & Corporate Secretarial',
    icon: '💼',
    shortDesc: 'SLA contracts drafting, IP & Patents filings, litigation audits, and professional due diligence audits.',
    detailedDesc: 'Solidify your business legal frameworks. Our accredited attorneys structure tight service level agreements, clear trademark filings, corporate secretarial audits, and arbitration representation.',
    options: CATEGORY_SERVICES['Legal Consults & Corporate Secretarial']
  },
  {
    category: 'Catering & Corporate F&B',
    icon: '🍽️',
    shortDesc: 'Canteen kitchen engineering, daily buffet arrangements, executive boardroom catering, and pantries.',
    detailedDesc: 'Delight employee cohorts with certified hygiene canteens, nutritious daily rotating meal setups, cafeteria automated vending configurations, and boardroom refreshment logistics.',
    options: CATEGORY_SERVICES['Catering & Corporate F&B']
  },
  {
    category: 'Sanitization & Pest Hygiene',
    icon: '🧼',
    shortDesc: 'Industrial pest extermination, chemical waste elimination audits, air filtration, and workspace disinfection.',
    detailedDesc: 'Ensure safe, odor-controlled, and sterile office layouts. We deploy medical-grade sanitization treatments, deep structural termite barriers, and certified bio-waste disposal chains.',
    options: CATEGORY_SERVICES['Sanitization & Pest Hygiene']
  },
  {
    category: 'Corporate Travel & Stays',
    icon: '✈️',
    shortDesc: 'Bulk flights reservations, corporate luxury hotels contract tiering, Forex concierge, and visa assist.',
    detailedDesc: 'Simplify multi-city business itineraries. We orchestrate bulk flight reservations, exclusive hotel corporate rates, visa support checklists, and unified travel expense billing panels.',
    options: CATEGORY_SERVICES['Corporate Travel & Stays']
  },
  {
    category: 'Bulk Stationery & Custom Printing',
    icon: '🖨️',
    shortDesc: 'High-volume print schedules, modular furniture, desks, and direct-to-desk replenishments.',
    detailedDesc: 'Equip your offices effortlessly. We coordinate contract-based stationers, unified printing schedules, premium desk accessories, customized manuals, and bulk consumables storage.',
    options: CATEGORY_SERVICES['Bulk Stationery & Custom Printing']
  },
  {
    category: 'Workspace Leasing & Fit-Outs',
    icon: '📐',
    shortDesc: 'Premium corporate lease sourcing, virtual addresses, acoustic partitions, and modular office fit-outs.',
    detailedDesc: 'Transition into custom office sites. We source high-potential properties, allocate legal virtual office addresses, construct acoustic-insulated walls, and install ergonomic workspaces.',
    options: CATEGORY_SERVICES['Workspace Leasing & Fit-Outs']
  },
  {
    category: 'Gifting & Merchandising',
    icon: '🎁',
    shortDesc: 'Custom merchandised kits, executive gift hampers, gadget kits, and trophy carvings.',
    detailedDesc: 'Reinforce brand allegiance and milestones. We design bespoke employee welcome hampers, branded premium apparel, leather executive boxes, electronic assets, and custom plaques.',
    options: CATEGORY_SERVICES['Gifting & Merchandising']
  },
  {
    category: 'Wellness & Corporate Insurance',
    icon: '🩺',
    shortDesc: 'Comprehensive group medical coverage policies, paramedic clinics, stress-relief camps, and health checks.',
    detailedDesc: 'Bolster personnel health indices. We negotiate group health insurance deals, configure on-site basic medical clinics, and run periodic mindfulness camps for employee stress optimization.',
    options: CATEGORY_SERVICES['Wellness & Corporate Insurance']
  },
  {
    category: 'ESG, Carbon & Energy Audits',
    icon: '🌱',
    shortDesc: 'Carbon emission audit reporting, grid solar installs, LEED certification advice, and e-waste certificates.',
    detailedDesc: 'Reach environmental sustainability mandates. We conduct independent greenhouse gas carbon accounting audits, set up solar grids, and issue formal e-waste destruction standard certifications.',
    options: CATEGORY_SERVICES['ESG, Carbon & Energy Audits']
  },
  {
    category: 'Custom Signage & Branding Displays',
    icon: '🖼️',
    shortDesc: 'Lobby 3D acrylic lettering, outdoor LED banners, hazard indicator signage, and standees prints.',
    detailedDesc: 'Command maximum brand visibility indoors and outdoors. We fabricate 3D acrylic signs, secure light-box banners, warehouse hazard alerts plates, and trade-show retractable displays.',
    options: CATEGORY_SERVICES['Custom Signage & Branding Displays']
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

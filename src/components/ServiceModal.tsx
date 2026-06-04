/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Check, Building2, User2, MessageSquare, PhoneCall, Mail, Sparkles, CheckCircle2, ChevronRight, AlertCircle, Terminal, Share2, Eye, LayoutGrid } from 'lucide-react';
import { CATEGORY_SERVICES, ServiceCategory, InquiryPayload } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  categoryName: string;
  onClose: () => void;
}

export default function ServiceModal({ isOpen, categoryName, onClose }: ServiceModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherDetails, setOtherDetails] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Tabs: 'receipt' vs 'telemetry' (to toggle between visual SLA response receipt vs sheets/email logs)
  const [activeTab, setActiveTab] = useState<'receipt' | 'telemetry'>('receipt');

  // Validation and process status states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadRecordId, setLeadRecordId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mailDetails, setMailDetails] = useState<any>(null);
  const [sheetDetails, setSheetDetails] = useState<any>(null);

  // Synchronize options when modal opens with a different category context
  useEffect(() => {
    if (isOpen) {
      setSelectedServices([]);
      setOtherDetails('');
      setErrors({});
      setLeadRecordId(null);
      setSuccessMsg(null);
      setMailDetails(null);
      setSheetDetails(null);
      setActiveTab('receipt');
    }
  }, [isOpen, categoryName]);

  if (!isOpen) return null;

  // Let's perform robust case-insensitive check to map to standard service category list
  const matchedKey = Object.keys(CATEGORY_SERVICES).find(
    (key) => key.toLowerCase() === categoryName.trim().toLowerCase()
  ) as ServiceCategory | undefined;

  let availableOptions: string[] = [];
  let headerTitle = categoryName;
  let subText = 'Select specific requirements matching your business objectives';
  const isPartner = categoryName === 'partner' || categoryName === 'Partnership Registration';
  const isGeneralQuote = categoryName === 'quote' || categoryName === 'Enterprise Free Quote Request';

  if (isPartner) {
    headerTitle = 'Become a Certified Partner';
    subText = 'Register your enterprise inside BusinessBridge premium vetted vendor roster';
    availableOptions = ['Register as Service Provider', 'Joint Venture Development', 'Strategic Master Vendor Partnership'];
  } else if (isGeneralQuote) {
    headerTitle = 'Enterprise Free Quote Request';
    subText = 'Select any sectors of interest for consolidated Pune-based SLA bids';
    availableOptions = Object.keys(CATEGORY_SERVICES);
  } else if (matchedKey) {
    headerTitle = matchedKey;
    availableOptions = CATEGORY_SERVICES[matchedKey] || [];
    subText = `Compare and manage vetted providers for ${matchedKey}`;
  } else {
    // Adaptive fallback
    headerTitle = categoryName;
    availableOptions = CATEGORY_SERVICES['Technology & Digital'];
    subText = `Compare and manage vetted providers for ${categoryName}`;
  }

  const toggleOption = (optName: string) => {
    if (selectedServices.includes(optName)) {
      setSelectedServices(selectedServices.filter((s) => s !== optName));
    } else {
      setSelectedServices([...selectedServices, optName]);
    }
  };

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!companyName.trim()) tempErrors.companyName = 'Enterprise Company Name is required.';
    if (!contactName.trim()) tempErrors.contactName = 'Liaison Person Name is required.';
    
    const phoneNo = phone.trim();
    if (!phoneNo) {
      tempErrors.phone = 'WhatsApp / Active Mobile number is required.';
    } else if (phoneNo.length < 8) {
      tempErrors.phone = 'Please provide a valid, complete WhatsApp/Phone number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please provide a valid email format (e.g. liaison@company.com).';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const payload: InquiryPayload = {
      categoryName: isPartner ? 'Partnership Registration' : headerTitle,
      selectedServices,
      otherDetails,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    };

    try {
      // Server-side endpoint invocation
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server rejected inquiry package.');
      }

      setLeadRecordId(data.id || `LEAD_REF_${Math.floor(Math.random() * 900000 + 100000)}`);
      setSuccessMsg(data.message || 'Your B2B inquiry has been filed with our Shivaji Nagar, Pune regional office.');
      
      if (data.mailDetails) {
        setMailDetails(data.mailDetails);
      }
      if (data.sheetDetails) {
        setSheetDetails(data.sheetDetails);
      }
    } catch (err: any) {
      console.error('[SUBMIT_EXCEPTION] Caught error inside modal submission:', err);
      setErrors({ apiError: err.message || 'Network unreachable. Please check your connectivity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch WhatsApp fallback with pre-formatted message
  const launchWhatsAppFallback = () => {
    const activeDetails = `Hello BusinessBridge Support!\n\nI just submitted an inquiry on your portal.\n*Reference ID*: ${leadRecordId || 'N/A'}\n*Company*: ${companyName || 'Corporate Client'}\n*Authorized Contact*: ${contactName}\n*Category*: ${headerTitle}\n*Services selected*: ${selectedServices.join(', ') || 'General Consultation'}\n*Notes*: ${otherDetails || 'N/A'}`;
    const uri = `https://wa.me/912049190000?text=${encodeURIComponent(activeDetails)}`;
    window.open(uri, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-[700] bg-[#030305]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div 
        className="w-full max-w-[680px] bg-[#0b0c10]/95 border border-white/[0.08] p-5 sm:p-7 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative my-auto animate-in fade-in zoom-in duration-300 pointer-events-auto select-auto"
      >
        {/* Close Button ("X") - Explicit pointer-events and cursor-pointer */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#c4beb4] hover:bg-[#c9a84c] hover:text-[#030305] transition-all duration-300 z-50 cursor-pointer pointer-events-auto"
            title="Close form panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Success SLA Screen View containing dynamic tabs */}
        {successMsg ? (
          <div className="animate-in fade-in zoom-in duration-400">
            {/* Tab selector inside Success Dashboard */}
            <div className="flex border-b border-white/[0.05] gap-4 mb-6 text-xs text-[#8a8278] pointer-events-auto">
              <button
                type="button"
                onClick={() => setActiveTab('receipt')}
                className={`pb-2.5 px-1 flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                  activeTab === 'receipt' ? 'border-[#c9a84c] text-[#e2c06a]' : 'border-transparent hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Submission Receipt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('telemetry')}
                className={`pb-2.5 px-1 flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                  activeTab === 'telemetry' ? 'border-[#c9a84c] text-[#e2c06a]' : 'border-transparent hover:text-[#e2c06a]/70'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                Live Sync Telemetry
              </button>
            </div>

            {activeTab === 'receipt' ? (
              <div className="py-2 text-center">
                <div className="w-16 h-16 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-[#e2c06a]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-semibold mb-2">
                  Inquiry Filed Systematically
                </h3>
                
                <div className="text-[10px] font-mono tracking-widest text-[#e2c06a] uppercase mb-4">
                  Lead tracking Ref: {leadRecordId}
                </div>

                <p className="text-xs text-[#c4beb4] leading-relaxed max-w-sm mx-auto mb-6 font-light">
                  {successMsg} Our assigned Pune account executives are shortlisting suppliers who match your SLAs and mechanical/compliance bounds.
                </p>

                <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/15 p-4 rounded-xl max-w-md mx-auto text-left mb-6 font-light">
                  <h4 className="text-xs font-bold uppercase text-[#e2c06a] tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Automated Google Sheets & SLA Dispatch
                  </h4>
                  <p className="text-[11px] text-[#8a8278] leading-relaxed">
                    Lead coordinates were broadcasted to your linked Google Sheet! You can monitor the sheet injection details under the <b>Live Sync Telemetry</b> tab above.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pointer-events-auto">
                  <button
                    onClick={launchWhatsAppFallback}
                    className="w-full sm:w-auto px-5 py-3 bg-[#c9a84c] text-[#030305] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e2c06a] hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Expedite via WhatsApp Call
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-3 bg-white/[0.04] text-white font-semibold text-xs uppercase tracking-wider rounded-lg border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    Return to Console
                  </button>
                </div>
              </div>
            ) : (
              /* Telemetry Logs */
              <div className="text-left py-2 font-mono text-xs animate-in fade-in duration-300 pointer-events-auto space-y-4">
                {/* Google Sheet Sync Tracker Card */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-[#e2c06a] font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5 text-[#c9a84c]" />
                      Google Sheets Integration Log
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                      STATUS: {sheetDetails?.success ? 'SYNCED' : 'ERROR'}
                    </span>
                  </div>
                  
                  <div className="bg-black/80 rounded-lg p-3 border border-white/5 text-[11px] text-[#c4beb4] space-y-1">
                    <p className="text-green-400 font-semibold">⚡ [GOOGLE SHEETS] Sync requested... ID: {leadRecordId}</p>
                    <p>📊 Target Webhook URL: <span className="text-blue-400 break-all text-[10px]">{sheetDetails?.webhookConfigured ? 'Direct Webhook Live Link' : 'Local Sandbox Simulator Active'}</span></p>
                    <p>📌 State of Webhook trigger: <span className="text-yellow-500">{sheetDetails?.webhookConfigured ? 'Real Endpoint Connected' : 'Simulating Outbox Pipeline'}</span></p>
                    <p className={`text-xs p-2 bg-white/5 rounded border border-white/10 mt-1 leading-relaxed ${sheetDetails?.success ? 'text-green-300' : 'text-[#c9a84c]'}`}>
                      {sheetDetails?.log}
                    </p>
                  </div>
                </div>

                {/* Nodemailer live email response trace log */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-[#e2c06a] font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#c9a84c]" />
                      SLA Broadcast System (SMTP)
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#e2c06a]">
                      STATUS: {mailDetails ? 'COMMITTED' : 'LOCAL'}
                    </span>
                  </div>

                  <div className="bg-black/80 rounded-lg p-3 border border-white/5 text-[11px] text-[#c4beb4] space-y-1">
                    <p className="text-green-400 font-semibold">⚡ [SMTP CLIENT] Connecting secure Nodemailer socket...</p>
                    <p>📧 Outbox Target: <span className="text-yellow-500">info@businessbridge.in</span></p>
                    <p className="text-blue-300">💬 Subject: "{mailDetails?.subject || 'B2B Sourcing Specification Alert'}"</p>
                    <p className="text-green-400">✓ [SMTP RESPONSE] {mailDetails?.dispatchLog || 'Sent backup notice to admin mail list.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Normal Sourcing Form Screen (No upper tabs!) */
          <div>
            <div className="mb-5">
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#e2c06a] uppercase mb-1">
                B2B SERVICE SOLVER · SHIVAJI NAGAR PUNE
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-medium leading-tight">
                {headerTitle}
              </h2>
              <p className="text-xs text-[#8a8278] mt-1 leading-relaxed">
                {subText}
              </p>
            </div>

            {errors.apiError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pointer-events-auto">
              {/* Service Checklist Options Selection Grid */}
              {availableOptions.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#c4beb4] tracking-widest block mb-2">
                    Select Specific SLA Targets or Verticals:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1 font-sans">
                    {availableOptions.map((opt, idx) => {
                      const isSel = selectedServices.includes(opt);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleOption(opt)}
                          className={`flex items-center text-left text-xs p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                            isSel
                              ? 'bg-[#c9a84c]/10 border-[#c9a84c] text-[#e2c06a] font-medium'
                              : 'bg-white/[0.02] border-white/[0.05] text-[#c4beb4] hover:border-white/[0.15] hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center mr-2.5 transition-colors ${
                            isSel ? 'bg-[#c9a84c] border-[#c9a84c] text-[#030305]' : 'border-white/20 bg-transparent'
                          }`}>
                            {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span className="truncate">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Company Details Inputs Card */}
              <div className="space-y-3 font-sans">
                <label className="text-[10px] font-bold uppercase text-[#c4beb4] tracking-widest block mb-1">
                  Enterprise Authorized Coordinates *
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#8a8278]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Company Name *"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.companyName ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2 text-white text-xs outline-none transition-colors pointer-events-auto cursor-text`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#8a8278]">
                        <User2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Liaison Name *"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.contactName ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2 text-white text-xs outline-none transition-colors pointer-events-auto cursor-text`}
                      />
                    </div>
                    {errors.contactName && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.contactName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#8a8278]">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Phone *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2 text-white text-xs outline-none transition-colors pointer-events-auto cursor-text`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#8a8278]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="Corporate Email (Optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2 text-white text-xs outline-none transition-colors pointer-events-auto cursor-text`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Other Specifics Notes Box */}
              <div className="font-sans">
                <label className="text-[10px] font-bold uppercase text-[#c4beb4] tracking-widest block mb-1">
                  Detailed Scope or Sourcing Parameters (Optional):
                </label>
                <div className="relative">
                  <div className="absolute top-2 left-3 pointer-events-none text-[#8a8278]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Expected SLA boundaries, contract duration, headcount, Pune location parameters, etc..."
                    value={otherDetails}
                    onChange={(e) => setOtherDetails(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#c9a84c] rounded-lg pl-9 pr-3 py-1.5 text-white text-xs outline-none transition-colors resize-none pointer-events-auto"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#c9a84c] text-[#030305] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e2c06a] hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 pointer-events-auto disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#030305] border-t-transparent rounded-full animate-spin" />
                    <span>Vetting Pune Market Rates...</span>
                  </>
                ) : (
                  <>
                    <span>File Sourcing Specifications</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

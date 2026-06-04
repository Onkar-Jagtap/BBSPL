/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Check, Building2, User2, MessageSquare, PhoneCall, Mail, Sparkles, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
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
  
  // Validation and process status states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadRecordId, setLeadRecordId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Synchronize options when modal opens with a different category context
  useEffect(() => {
    if (isOpen) {
      setSelectedServices([]);
      setOtherDetails('');
      setErrors({});
      setLeadRecordId(null);
      setSuccessMsg(null);
    }
  }, [isOpen, categoryName]);

  if (!isOpen) return null;

  // Retrieve option arrays matching the active category request
  let availableOptions: string[] = [];
  let headerTitle = categoryName;
  let subText = 'Select specific requirements matching your business objectives';
  let isPartner = categoryName === 'partner';
  let isGeneralQuote = categoryName === 'quote';

  if (isPartner) {
    headerTitle = 'Become a Certified Partner';
    subText = 'Register your enterprise inside BusinessBridge premium registered service network';
    availableOptions = ['Register as Service Provider', 'Joint Venture Development', 'Strategic Master Vendor Inquiry'];
  } else if (isGeneralQuote) {
    headerTitle = 'Enterprise Free Quote Request';
    subText = 'Select any sectors of interest for consolidated service bids';
    availableOptions = Object.keys(CATEGORY_SERVICES);
  } else {
    availableOptions = CATEGORY_SERVICES[categoryName as ServiceCategory] || [];
    subText = `Compare and manage approved providers for ${categoryName}`;
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
    
    // Basic phone validation (at least 8 characters)
    const phoneNo = phone.trim();
    if (!phoneNo) {
      tempErrors.phone = 'WhatsApp / Active Mobile number is required.';
    } else if (phoneNo.length < 8) {
      tempErrors.phone = 'Please provide a valid, complete contract number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please provide a valid email format (e.g. user@domain.com).';
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
        throw new Error(data.error || 'Server rejected inquiry package. Please examine inputs.');
      }

      setLeadRecordId(data.id || `LEAD_REF_${Math.floor(Math.random() * 900000 + 100000)}`);
      setSuccessMsg(data.message || 'Your inquiry registered successfully with our Central operations center.');
      
      // Cleanup inputs on success
      setOtherDetails('');
      setCompanyName('');
      setContactName('');
      setPhone('');
      setEmail('');
    } catch (err: any) {
      console.error('[SUBMIT_EXCEPTION] Caught error inside modal submission:', err);
      setErrors({ apiError: err.message || 'Network unreachable. Please check your connectivity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute standard pre-formatted WhatsApp content for secure and reliable action bypasses inside iframes
  const whatsappMsgText = `Hello BusinessBridge Support!\n\nI just submitted an inquiry on your portal.\n*Reference ID*: ${leadRecordId || 'N/A'}\n*Category*: ${headerTitle}\n*Services selected*: ${selectedServices.join(', ') || 'General Consultation'}`;
  const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(whatsappMsgText)}`;

  return (
    <div 
      className="fixed inset-0 z-[700] bg-[#030305]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div 
        className="w-full max-w-[640px] glass-modal p-5 sm:p-7 rounded-2xl relative my-auto animate-in fade-in zoom-in duration-300"
      >
        {/* Close Button */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/20 text-[#c4beb4] hover:text-[#e2c06a] flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest transition-all duration-300 z-10 group cursor-pointer"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        )}

        {/* Success Confirmation Screen View */}
        {successMsg ? (
          <div className="py-6 text-center animate-in fade-in zoom-in duration-400">
            <div className="w-16 h-16 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full flex items-center justify-center mx-auto mb-5 text-[#e2c06a]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-semibold mb-2">
              Inquiry Registered Successfully
            </h3>
            
            <div className="text-xs font-mono tracking-widest text-[#e2c06a] uppercase mb-4">
              ID: {leadRecordId}
            </div>

            <p className="text-sm text-[#c4beb4] leading-relaxed max-w-md mx-auto mb-6">
              {successMsg} Our team is shortlisting verified B2B specialists nationwide right now.
            </p>

            <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/15 p-4 rounded-xl max-w-md mx-auto text-left mb-6">
              <h4 className="text-xs font-bold uppercase text-[#e2c06a] tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                24/7 National Support Active
              </h4>
              <p className="text-xs text-[#bcbab4] leading-relaxed font-light">
                Our support team is active round-the-clock nationwide. We guarantee connection with prime service partners immediately.
              </p>
            </div>

            {/* Expended Callback Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-[#c9a84c] text-[#030305] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e2c06a] hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Expedite via WhatsApp
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-white/[0.04] text-white font-semibold text-xs uppercase tracking-wider rounded-lg border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
              >
                Return to Site
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Form Screen View */
          <div>
            <div className="mb-6">
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#e2c06a] uppercase mb-1">
                B2B SERVICE SOLVER
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-medium leading-tight">
                {headerTitle}
              </h2>
              <p className="text-xs text-[#e8e6e2] mt-1 leading-relaxed">
                {subText}
              </p>
            </div>

            {errors.apiError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Checklist Options Selection Grid */}
              {availableOptions.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#c4beb4] tracking-widest block mb-2.5">
                    Select Specific Requirements:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {availableOptions.map((opt, idx) => {
                      const isSel = selectedServices.includes(opt);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleOption(opt)}
                          className={`flex items-center text-left text-xs p-2.5 rounded-lg border transition-all duration-300 ${
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
              <div className="space-y-3.5">
                <label className="text-[11px] font-bold uppercase text-[#c4beb4] tracking-widest block mb-1">
                  Enterprise Contact Specifications:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Company Name *"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.companyName ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2.5 text-white text-xs outline-none transition-colors`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                        <User2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.contactName ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2.5 text-white text-xs outline-none transition-colors`}
                      />
                    </div>
                    {errors.contactName && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.contactName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Phone Number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2.5 text-white text-xs outline-none transition-colors`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="Corporate Email (Optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-white/[0.02] border ${
                          errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-[#c9a84c]'
                        } rounded-lg pl-9 pr-3 py-2.5 text-white text-xs outline-none transition-colors`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Other Specifics Notes Box */}
              <div>
                <label className="text-[11px] font-bold uppercase text-[#c4beb4] tracking-widest block mb-1.5">
                  Detailed Scope or Intent (Optional):
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none text-zinc-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Describe specific timelines, quantities, service level expectations, location scope, etc..."
                    value={otherDetails}
                    onChange={(e) => setOtherDetails(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#c9a84c] rounded-lg pl-9 pr-3 py-2 text-white text-xs outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#c9a84c] text-[#030305] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e2c06a] hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 pointer-events-auto disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#030305] border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing specifications...</span>
                  </>
                ) : (
                  <>
                    <span>Submit for 24/7 Support Callback</span>
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

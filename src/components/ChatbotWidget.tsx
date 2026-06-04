/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Sparkles, Phone, FileText, ChevronRight, AlertCircle, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatbotWidgetProps {
  onOpenCategory: (categoryName: string) => void;
}

export default function ChatbotWidget({ onOpenCategory }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-initial-welcome',
      sender: 'bot',
      text: "👋 Welcome to BusinessBridge! I am your **B2B Service Concierge**. We consolidate technology, compliance, facility management, and workforce needs with vetted Pune providers into a single point of billing.\n\nWhat requirement can we solve for your enterprise today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAnswers: [
        '💻 Tech & AI Solutions',
        '🖥️ IT Hardware Rentals',
        '👥 Workforce & Admin',
        '⚖️ Finance & Compliance'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessageAlert(false);
  };

  const addMessage = (sender: 'user' | 'bot', text: string, promptQuoteWithCategory?: string) => {
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      promptQuoteWithCategory
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Guard user query
    setInputValue('');
    addMessage('user', queryText);
    setIsTyping(true);

    try {
      // Package query along with the conversation history list
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: messages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Neural concierge link experienced transient static. Please retry.');
      }

      const data = await response.json();
      setIsTyping(false);

      if (data && data.text) {
        addMessage('bot', data.text, data.promptQuoteWithCategory);
      } else {
        addMessage('bot', 'I managed to file your request, but the connection response payload was empty. Our physical representatives will contact you directly.');
      }
    } catch (err: any) {
      console.error('[CHAT_EXCEPTION] Caught error in chat interface:', err);
      setIsTyping(false);
      addMessage(
        'bot',
        'I apologize! Our Pune servers encountered a brief compliance validation check. You can request a callback directly using the **Free Quote** button at the top header, and our SLA is fully operational.'
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(inputValue);
  };

  const handleShortcutClick = (shortcut: string) => {
    // Trim emoji icons
    const cleanPrompt = shortcut.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
    submitQuery(`I would like to inquire about ${cleanPrompt} services.`);
  };

  // Safe internal utility compiling simplistic markdown segments (bolds, bullet layouts) into styled React tags.
  const renderMarkdownMessage = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((par, pIdx) => {
      // Split by bold patterns **text**
      const boldParts = par.split(/\*\*([^*]+)\*\*/g);
      const isListItem = par.trim().startsWith('-') || par.trim().startsWith('*');

      const contentElements = boldParts.map((part, bIdx) => {
        if (bIdx % 2 === 1) {
          // Bold matches
          return <strong key={bIdx} className="text-[#e2c06a] font-semibold">{part}</strong>;
        }
        
        // Handle links or clean strings
        return part;
      });

      if (isListItem) {
        const cleanLines = par.split('\n').map((line, lIdx) => {
          const processed = line.replace(/^[-*]\s+/, '');
          
          // Apply bold replacement to line item as well
          const lineBolds = processed.split(/\*\*([^*]+)\*\*/g).map((bPart, lbIdx) => {
            if (lbIdx % 2 === 1) return <strong key={lbIdx} className="text-[#e2c06a] font-semibold">{bPart}</strong>;
            return bPart;
          });

          return (
            <li key={lIdx} className="list-disc list-inside mt-1 text-[11px] sm:text-xs leading-relaxed text-[#c4beb4] pl-2">
              {lineBolds}
            </li>
          );
        });
        return <ul key={pIdx} className="space-y-0.5 my-1.5">{cleanLines}</ul>;
      }

      return (
        <p key={pIdx} className="text-[11px] sm:text-xs leading-relaxed text-[#c4beb4] mb-1.5 last:mb-0">
          {contentElements}
        </p>
      );
    });
  };

  return (
    <div id="chat-widget-wrapper" className="fixed bottom-6 right-6 z-[600] flex flex-col items-end pointer-events-auto">
      {/* Floating Action Trigger Button */}
      <button
        onClick={handleToggle}
        className="w-14 h-14 bg-[#c9a84c] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(201,168,76,0.35)] hover:-translate-y-1 active:translate-y-0 hover:bg-[#e2c06a] hover:shadow-[0_12px_40px_rgba(201,168,76,0.5)] transition-all duration-400 relative group cursor-pointer"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#030305]" />
        ) : (
          <MessageSquare className="w-6 h-6 text-[#030305] animate-wiggle" />
        )}

        {/* Dynamic New Message Alert Dot Indicator */}
        {hasNewMessageAlert && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#030305] rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        )}
      </button>

      {/* Main Chat Dialog Box Frame */}
      {isOpen && (
        <div 
          className="w-[320px] sm:w-[360px] h-[480px] bg-[#141419]/90 border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] mt-3 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* Header Bar */}
          <div className="bg-[#c9a84c]/5 border-b border-white/[0.06] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7a5e1e] to-[#e2c06a] flex items-center justify-center font-bold text-[#030305] text-xs">
                🤝
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1">
                  BusinessBridge Concierge
                  <Sparkles className="w-3 h-3 text-[#e2c06a] animate-pulse" />
                </h4>
                <p className="text-[9px] text-[#e2c06a] tracking-normal font-mono">
                  Online B2B Advisor · Pune
                </p>
              </div>
            </div>
            
            {/* Intuitive Header Close button for Chat Panel */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-1 px-2.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-[#c4beb4] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer group"
            >
              <span>Close</span>
              <X className="w-3 h-3 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 Scrollbar-thin max-h-[380px]">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[90%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`p-3 rounded-xl text-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#c9a84c] text-[#030305] font-medium rounded-br-sm'
                      : 'bg-white/[0.04] border border-white/[0.06] rounded-bl-sm text-[#c4beb4]'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    renderMarkdownMessage(msg.text)
                  )}

                  {/* Smart Category Shortcut Chip Injection */}
                  {msg.promptQuoteWithCategory && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex justify-start">
                      <button
                        onClick={() => {
                          onOpenCategory(msg.promptQuoteWithCategory!);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#e2c06a] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2.5 py-1.5 rounded-md hover:bg-[#c9a84c] hover:text-[#030305] transition-all duration-300"
                      >
                        <FileText className="w-3 h-3" />
                        Inquire {msg.promptQuoteWithCategory}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Message Timestamp */}
                <span className="text-[8px] text-[#8a8278] mt-1 pr-1 font-mono">
                  {msg.timestamp}
                </span>

                {/* Suggested Shortcut selection blocks */}
                {msg.suggestedAnswers && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {msg.suggestedAnswers.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleShortcutClick(s)}
                        className="text-[10px] bg-white/[0.02] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/30 text-[#c4beb4] hover:text-[#e2c06a] px-2.5 py-1.5 rounded-full border border-white/[0.06] transition-all duration-200 text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Simulated AI Typing bubble */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#8a8278] text-xs pl-2 bg-white/[0.02] py-2 px-3 rounded-xl max-w-max border border-white/[0.04]">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#e2c06a] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#e2c06a] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#e2c06a] rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] font-mono tracking-wider">Analyzing outsourcing scope...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Form Bar */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-white/[0.06] bg-black/30 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about enterprise services..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-[#c9a84c] rounded-xl px-3 py-2 text-white placeholder-[#8a8278] text-xs outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 bg-[#c9a84c] rounded-xl flex items-center justify-center text-[#030305] hover:bg-[#e2c06a] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

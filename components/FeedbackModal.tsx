'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'query'>('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        style={{ borderRadius: '0px' }}
        className="bg-white max-w-md w-full border-3 border-black shadow-[8px_8px_0px_#000000] overflow-hidden"
      >
        {/* Y2K Window Title Bar */}
        <div className="bg-[#ffd60a] border-b-3 border-black px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
            <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black" />
            <span>★ USER DISPATCH &amp; FEEDBACK ✦</span>
          </div>

          <button
            onClick={onClose}
            style={{ borderRadius: '0px' }}
            className="bg-[#ff2e93] text-white hover:bg-[#e11d48] px-2 py-0.5 border-2 border-black text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000]"
            type="button"
          >
            [✕]
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4 font-mono">
              <div 
                style={{ borderRadius: '0px' }}
                className="w-14 h-14 bg-[#ccff00] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-base font-black uppercase text-black">
                ★ DISPATCH LOGGED IN REPO! ★
              </h3>
              <p className="text-xs font-medium text-neutral-600">
                Our platform engineers will review your transmission to calibrate drops, server response, and catalog listings.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                  onClose();
                }}
                style={{ borderRadius: '0px' }}
                className="mt-3 px-6 py-2.5 bg-[#ff2e93] text-white text-xs font-black uppercase tracking-wider cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#e11d48]"
                type="button"
              >
                [RETURN TO FANDOM TERMINAL]
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs font-mono font-bold text-neutral-700 mb-4 bg-[#fdfbf7] p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                Help us elevate Fan Hub Plus. Report bugs, suggest artist merchandise drops, or dispatch feature ideas.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 font-mono">
                <div>
                  <label className="text-xs font-black uppercase text-black block mb-2">
                    DISPATCH CATEGORY:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCategory('bug')}
                      style={{ borderRadius: '0px' }}
                      className={`p-2 border-2 border-black text-center font-black uppercase transition-all cursor-pointer ${
                        category === 'bug'
                          ? 'bg-[#ef4444] text-white shadow-[2px_2px_0px_#000] -translate-y-0.5'
                          : 'bg-white text-black hover:bg-[#fee2e2]'
                      }`}
                    >
                      BUG REPORT
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('suggestion')}
                      style={{ borderRadius: '0px' }}
                      className={`p-2 border-2 border-black text-center font-black uppercase transition-all cursor-pointer ${
                        category === 'suggestion'
                          ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                          : 'bg-white text-black hover:bg-[#ecfeff]'
                      }`}
                    >
                      FEATURE IDEA
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('query')}
                      style={{ borderRadius: '0px' }}
                      className={`p-2 border-2 border-black text-center font-black uppercase transition-all cursor-pointer ${
                        category === 'query'
                          ? 'bg-[#ffd60a] text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                          : 'bg-white text-black hover:bg-[#fff9db]'
                      }`}
                    >
                      GENERAL Q&amp;A
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-black block mb-1.5">
                    TRANSMISSION LOG:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter details, links, or specific fandom drop requests..."
                    style={{ borderRadius: '0px' }}
                    className="w-full text-xs font-mono p-3 bg-[#fdfbf7] border-2 border-black focus:outline-none focus:bg-white focus:border-[#ff2e93] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  style={{ borderRadius: '0px' }}
                  className="w-full text-white text-xs py-3 flex items-center justify-center gap-2 cursor-pointer font-black uppercase tracking-wider bg-[#ff2e93] hover:bg-[#e11d48] border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>[SUBMIT DISPATCH →]</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'franchise'>('general');
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [investmentBudget, setInvestmentBudget] = useState('$150,000 - $300,000');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-950 dark:text-white mt-1">
          Contact & Franchise
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Connect with our roastery concierge or explore opening a Cafex micro-roastery franchise in your city.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Contact Cards & Hours */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-md space-y-6">
            <h3 className="font-serif font-bold text-xl text-espresso-950 dark:text-white">
              Roastery Headquarters
            </h3>

            <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-espresso-950 dark:text-white">Flagship Roastery</span>
                  <span>742 Evergreen Terrace, Downtown Tech District, San Francisco, CA 94107</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="block font-semibold text-espresso-950 dark:text-white">Phone Inquiries</span>
                  <span>+1 (555) 749-2831</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="block font-semibold text-espresso-950 dark:text-white">Direct Email</span>
                  <span>hello@cafex.com</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-espresso-100 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-2">
                Roastery & Bistro Hours
              </span>
              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-espresso-950 dark:text-white">06:30 AM - 09:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday & Sunday</span>
                  <span className="font-semibold text-espresso-950 dark:text-white">07:30 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Mockup */}
          <div className="rounded-3xl overflow-hidden border border-espresso-100 dark:border-neutral-800 aspect-[16/9] relative bg-neutral-900 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80"
              alt="Map Preview"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white max-w-xs">
                <MapPin className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-bounce" />
                <h4 className="font-serif font-bold text-sm">Downtown San Francisco</h4>
                <p className="text-[11px] text-neutral-300">Valet parking available at 8th & Mission St.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Contact & Franchise Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-xl">
            
            {/* Form Mode Selector */}
            <div className="flex border-b border-espresso-100 dark:border-neutral-800 pb-4 mb-6 gap-3">
              <button
                type="button"
                onClick={() => { setActiveTab('general'); setSubmitted(false); }}
                className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'general'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-espresso-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-white'
                }`}
              >
                Customer Support & Feedback
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('franchise'); setSubmitted(false); }}
                className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'franchise'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-espresso-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Franchise Partnership
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-espresso-950 dark:text-white">
                  Message Transmitted!
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for reaching out. A dedicated Cafex representative will review your message and respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {activeTab === 'franchise' ? (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                        Target City & Country *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Austin, Texas"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                        Inquiry Topic
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500">
                        <option>General Customer Question</option>
                        <option>Online Order Assistance</option>
                        <option>Private Event Booking</option>
                        <option>Wholesale Coffee Bean Sourcing</option>
                      </select>
                    </div>
                  )}
                </div>

                {activeTab === 'franchise' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Estimated Investment Capacity
                    </label>
                    <select
                      value={investmentBudget}
                      onChange={(e) => setInvestmentBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option>$150,000 - $300,000 (Single Bistro Kiosk)</option>
                      <option>$300,000 - $600,000 (Full Roastery Flagship)</option>
                      <option>$600,000+ (Multi-Unit Regional Franchise)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={activeTab === 'franchise' ? 'Tell us about your business background, location site, and timeline...' : 'How can our barista team help you?'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-espresso-200 dark:border-neutral-700 bg-espresso-50 dark:bg-neutral-900 text-xs text-espresso-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {activeTab === 'franchise' ? 'Submit Franchise Application' : 'Send Message'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

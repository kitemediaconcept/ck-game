import React, { useState } from 'react';
import { CorekraftLogo } from './CorekraftLogo';
import { CorporateEnquiry } from '../types/campaign';
import { X, Gift, Send, CheckCircle2, FileText, Phone, Mail, MapPin } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (enquiry: CorporateEnquiry) => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '25-50',
    budgetPerHamper: '$75 - $125',
    deliveryDate: 'Early December 2026',
    notes: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newEnquiry: CorporateEnquiry = {
        id: `ENQ-${Date.now().toString().slice(-6)}`,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        teamSize: formData.teamSize,
        budgetPerHamper: formData.budgetPerHamper,
        deliveryDate: formData.deliveryDate,
        notes: formData.notes,
        submittedAt: new Date().toISOString(),
      };

      onSubmitSuccess(newEnquiry);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <CorekraftLogo className="h-7 mx-auto mb-3" theme="dark" />

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Holiday Enquiry Received!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Thank you, <span className="text-[#FF4A68] font-bold">{formData.name}</span>! Our corporate gifting concierge from <strong className="text-slate-800">mycorekraft.com</strong> will prepare custom catalog proposals for <span className="text-slate-900 font-medium">{formData.company}</span>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 max-w-md mx-auto text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Team Size:</span>
                <span className="font-semibold text-slate-900">{formData.teamSize} hampers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Budget:</span>
                <span className="font-semibold text-[#FF4A68]">{formData.budgetPerHamper} / hamper</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Target:</span>
                <span className="font-semibold text-slate-900">{formData.deliveryDate}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  alert('Corekraft 2026 Holiday Lookbook catalog generated for your company session.');
                }}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Lookbook (PDF)</span>
              </button>

              <button
                onClick={handleResetAndClose}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs tracking-wider transition-colors cursor-pointer"
              >
                Return to Game
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-[#FF4A68]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4A68]">
                Corekraft Corporate Gifting · mycorekraft.com
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
              Plan My Corporate Gifts
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Bespoke luxury hampers, executive diaries, drinkware, and customized corporate gifts delivered across India & worldwide.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Menon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#FF4A68] focus:ring-1 focus:ring-[#FF4A68] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#FF4A68] focus:ring-1 focus:ring-[#FF4A68] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Kozhikode Tech Ventures"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#FF4A68] focus:ring-1 focus:ring-[#FF4A68] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#FF4A68]"
                  >
                    <option value="10-25">10 – 25 Hampers</option>
                    <option value="25-50">25 – 50 Hampers</option>
                    <option value="50-100">50 – 100 Hampers</option>
                    <option value="100-250">100 – 250 Hampers</option>
                    <option value="250+">250+ Hampers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Budget / Hamper
                  </label>
                  <select
                    value={formData.budgetPerHamper}
                    onChange={(e) => setFormData({ ...formData, budgetPerHamper: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#FF4A68]"
                  >
                    <option value="$50 - $75">₹1,500 – ₹2,500 ($50–$75)</option>
                    <option value="$75 - $125">₹2,500 – ₹4,500 ($75–$125)</option>
                    <option value="$125 - $200">₹4,500 – ₹7,500 (Executive)</option>
                    <option value="$200+">₹7,500+ (Luxury VIP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Date
                  </label>
                  <select
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#FF4A68]"
                  >
                    <option value="Late November 2026">Late Nov 2026</option>
                    <option value="Early December 2026">Early Dec 2026</option>
                    <option value="Mid December 2026">Mid Dec 2026</option>
                    <option value="New Year / Jan 2027">Jan 2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Branding Notes or Special Items
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Include laser engraved company logo on bottles and notebooks..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#FF4A68] focus:ring-1 focus:ring-[#FF4A68] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF4A68] hover:bg-[#E11D48] text-white font-extrabold text-sm uppercase tracking-wider shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Corporate Gifting Request'}</span>
                </button>
              </div>

              {/* Direct Corekraft contact badges */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4A68]" />
                  <span>Kozhikode, Kerala</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>+91 89219 32320</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>corekraft360@gmail.com</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

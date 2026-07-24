import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickLeadModal({
  isOpen,
  onClose,
  quickLeadForm,
  setQuickLeadForm,
  counselorsList,
  onAdd
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
        <motion.div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-blue-600">person_add</span>
                Add Quick Lead
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Quickly inject a new lead into your local CRM database.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 text-left font-sans">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Watson"
                value={quickLeadForm.name}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, name: e.target.value })}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Work Email Address</label>
              <input
                type="email"
                placeholder="e.g. watson@baker.co.uk"
                value={quickLeadForm.email}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, email: e.target.value })}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +44 7890 12345"
                value={quickLeadForm.phone}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, phone: e.target.value })}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Assign to Counselor</label>
              <select
                value={quickLeadForm.assignedTo}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, assignedTo: e.target.value })}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="" disabled>Select Counselor</option>
                {counselorsList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Type</label>
                <select
                  value={quickLeadForm.leadType || 'Online'}
                  onChange={(e) => {
                    const newType = e.target.value;
                    const defaultSource = newType === 'Online' ? 'Website Organic' : 'Direct Mail';
                    setQuickLeadForm({ ...quickLeadForm, leadType: newType, source: defaultSource });
                  }}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Source</label>
                <select
                  value={quickLeadForm.source || 'Website Organic'}
                  onChange={(e) => setQuickLeadForm({ ...quickLeadForm, source: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {(quickLeadForm.leadType || 'Online') === 'Online' ? (
                    <>
                      <option value="Website Organic">Website Organic</option>
                      <option value="Paid Search">Paid Search</option>
                      <option value="Referral">Referral</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Quick Add Form">Quick Add Form</option>
                    </>
                  ) : (
                    <>
                      <option value="Direct Mail">Direct Mail</option>
                      <option value="Cold Outreach">Cold Outreach</option>
                      <option value="Bulk Offline CSV">Bulk Offline CSV</option>
                      <option value="Field Event">Field Event</option>
                      <option value="Partner Referral">Partner Referral</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Query</label>
              <input
                type="text"
                placeholder="e.g. BCA"
                value={quickLeadForm.query}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, query: e.target.value })}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 select-none">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer bg-transparent"
            >
              Cancel
            </button>
            <button
              onClick={() => onAdd(quickLeadForm)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-sm border-none"
            >
              Add Lead
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

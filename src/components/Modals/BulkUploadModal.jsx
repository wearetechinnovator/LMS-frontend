import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BulkUploadModal({
  isOpen,
  onClose,
  uploadingBulk,
  onUpload
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
                <span className="material-symbols-outlined text-[20px] text-blue-600">upload_file</span>
                Bulk Offline Upload
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Ingest new leads dynamically from a CSV file.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 text-left">
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-8 text-center bg-slate-50/50 cursor-pointer transition-colors select-none">
              <span className="material-symbols-outlined text-[40px] text-slate-400 block mb-2">cloud_upload</span>
              <span className="text-[12.5px] font-bold text-slate-700 block">Drag & Drop CSV file here</span>
              <span className="text-[11px] text-slate-400 block mt-1">or click to browse local files</span>
            </div>

            {uploadingBulk ? (
              <div className="space-y-2 select-none">
                <div className="flex justify-between items-center text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  <span>Ingesting leads...</span>
                  <span>85%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-3.5 select-none text-[11.5px] text-slate-600 leading-relaxed font-sans">
                <strong>Simulate Ingestion:</strong> Click "Process CSV Upload" to simulate loading and importing 2 sample leads offline.
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 select-none">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer bg-transparent"
              disabled={uploadingBulk}
            >
              Cancel
            </button>
            <button
              onClick={onUpload}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm border-none"
              disabled={uploadingBulk}
            >
              {uploadingBulk ? 'Processing...' : 'Process CSV Upload'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

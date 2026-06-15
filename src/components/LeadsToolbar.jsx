import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCustomStatuses } from '../helpers/statusHelper';
import './LeadsToolbar.css';

import excelIcon from '../assets/excel.png';
import pdfIcon from '../assets/pdf.png';
import jsonIcon from '../assets/json.png';
import csvIcon from '../assets/csv.png';


export default function LeadsToolbar({
  searchQuery,
  setSearchQuery,
  dateRangeFilter,
  setDateRangeFilter,
  leadOwnerFilter,
  setLeadOwnerFilter,
  sourceFilter,
  setSourceFilter,
  filterStatus,
  setFilterStatus,
  verificationFilter,
  setVerificationFilter,
  queryFilter,
  setQueryFilter,
  uniqueQueries,
  visibleColumns,
  setVisibleColumns,
  activeSavedTab,
  setActiveSavedTab,
  activeBlockFilter,
  setActiveBlockFilter,
  setSortConfig,
  // Actions
  setShowBulkUploadModal,
  setShowQuickLeadModal,
  setQuickLeadForm,
  handleDownloadLeads,
  handleChangeLeadStageGlobal,
  counselors = [],
  sources = []
}) {
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showGlobalActionsDropdown, setShowGlobalActionsDropdown] = useState(false);
  const [showDownloadFormats, setShowDownloadFormats] = useState(false);

  const [statusesList, setStatusesList] = useState(() => getCustomStatuses());

  useEffect(() => {
    const handleUpdate = () => {
      setStatusesList(getCustomStatuses());
    };
    window.addEventListener('lms-statuses-updated', handleUpdate);
    return () => window.removeEventListener('lms-statuses-updated', handleUpdate);
  }, []);

  const isFilterActive =
    searchQuery !== '' ||
    filterStatus !== 'all' ||
    dateRangeFilter !== 'all' ||
    leadOwnerFilter !== 'all' ||
    sourceFilter !== 'all' ||
    verificationFilter !== 'all' ||
    queryFilter !== 'all' ||
    activeSavedTab !== 'all' ||
    activeBlockFilter !== 'all';

  const handleClearAll = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setDateRangeFilter('all');
    setLeadOwnerFilter('all');
    setSourceFilter('all');
    setVerificationFilter('all');
    setQueryFilter('all');
    setActiveSavedTab('all');
    setActiveBlockFilter('all');
    if (setSortConfig) {
      setSortConfig({ key: 'name', direction: 'asc' });
    }
  };

  return (
    <div className="leads-toolbar">
      <div className="leads-toolbar-left">
        {/* Search Bar */}
        <div className="leads-search-wrapper">
          <span className="material-symbols-outlined leads-search-icon select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, owner..."
            className="leads-search-input"
          />
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="leads-filter-select"
          >
            <option value="all">Date Range: All Time</option>
            <option value="today">Created: Today</option>
            <option value="7days">Created: Last 7 Days</option>
            <option value="30days">Created: Last 30 Days</option>
          </select>
        </div>

        {/* Lead Owner Selector */}
        <div className="relative">
          <select
            value={leadOwnerFilter}
            onChange={(e) => setLeadOwnerFilter(e.target.value)}
            className="leads-filter-select"
          >
            <option value="all">Counselor: All</option>
            {counselors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Source Selector */}
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="leads-filter-select"
          >
            <option value="all">Source: All</option>
            {sources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="leads-filter-select"
          >
            <option value="all">Status: All Active</option>
            {statusesList.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Verification Selector */}
        <div className="relative">
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="leads-filter-select"
          >
            <option value="all">Verification: All</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>

        {/* Query Selector */}
        <div className="relative">
          <select
            value={queryFilter}
            onChange={(e) => setQueryFilter(e.target.value)}
            className="leads-filter-select"
          >
            <option value="all">Query: All</option>
            {uniqueQueries.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* Clear All Option */}
        {isFilterActive && (
          <button
            onClick={handleClearAll}
            className="text-primary hover:text-primary-dark transition-colors text-[11.5px] font-bold cursor-pointer underline underline-offset-2 decoration-dotted ml-2"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="leads-toolbar-right">
        {/* Column Customizer Button */}
        <div className="relative">
          <button
            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
            className="leads-action-btn"
          >
            <span className="material-symbols-outlined text-[15px] text-slate-400">table_chart</span>
            Columns
          </button>
          <AnimatePresence>
            {showColumnDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColumnDropdown(false)} />
                <motion.div
                  className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 z-20 text-left font-sans"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 select-none">Toggle Columns</div>
                  <div className="space-y-1.5 text-[11.5px] font-semibold text-slate-700">
                    {Object.keys(visibleColumns).map((col) => (
                      <label key={col} className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg cursor-pointer capitalize">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col]}
                          onChange={() => setVisibleColumns({
                            ...visibleColumns,
                            [col]: !visibleColumns[col]
                          })}
                          className="w-4 h-4 cursor-pointer accent-primary rounded border-slate-350 text-primary"
                        />
                        {col === 'assignedTo' ? 'Assigned' : col === 'email' ? 'Email' : col}
                      </label>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Actions Dropdown */}
        {setShowBulkUploadModal && (
          <div className="relative">
            <button
              onClick={() => setShowGlobalActionsDropdown(!showGlobalActionsDropdown)}
              className="leads-action-btn primary"
            >
              Actions
              <span className="material-symbols-outlined text-[15px] text-white leading-none">expand_more</span>
            </button>

            <AnimatePresence>
              {showGlobalActionsDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowGlobalActionsDropdown(false)} />
                  <motion.div
                    className="absolute right-0 mt-1.5 w-52 bg-white border border-outline-variant rounded-xl shadow-xl p-1 z-40 text-left font-sans"
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Group 1: Lead Ingestions */}
                    <div className="p-1.5 pb-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Lead Ingestions</div>
                    <button
                      onClick={() => {
                        setShowBulkUploadModal(true);
                        setShowGlobalActionsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">upload_file</span>
                      Bulk Offline Upload
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickLeadModal(true);
                        setQuickLeadForm({ name: '', email: '', phone: '', assignedTo: 'Sarah Jenkins', leadType: 'Online', source: 'Website Organic', query: '' });
                        setShowGlobalActionsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">add_circle</span>
                      Add Quick Lead
                    </button>

                    <hr className="border-slate-100 my-1" />

                    {/* Group 2: Data Operations */}
                    <div className="p-1.5 pb-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Data Operations</div>
                    {/* Download Leads with Format Submenu on Hover */}
                    <div
                      className="relative"
                      onMouseEnter={() => setShowDownloadFormats(true)}
                      onMouseLeave={() => setShowDownloadFormats(false)}
                    >
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">download</span>
                          Download Leads
                        </div>
                        <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_left</span>
                      </button>

                      <AnimatePresence>
                        {showDownloadFormats && (
                          <motion.div
                            className="absolute right-full top-0 w-36 bg-white border border-outline-variant rounded-xl shadow-xl p-1 z-50 text-left font-sans"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.15 }}
                          >
                            <button
                              onClick={() => {
                                handleDownloadLeads('CSV');
                                setShowGlobalActionsDropdown(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                            >
                              <img src={csvIcon} alt="csv" className="w-4 h-4" />
                              CSV Format
                            </button>
                            <button
                              onClick={() => {
                                handleDownloadLeads('Excel (XLSX)');
                                setShowGlobalActionsDropdown(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                            >
                              <img src={excelIcon} alt="csv" className="w-4 h-4" />
                              Excel (XLSX)
                            </button>
                            <button
                              onClick={() => {
                                handleDownloadLeads('PDF');
                                setShowGlobalActionsDropdown(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                            >
                              <img src={pdfIcon} alt="csv" className="w-4 h-4" />
                              PDF Document
                            </button>
                            <button
                              onClick={() => {
                                handleDownloadLeads('JSON');
                                setShowGlobalActionsDropdown(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                            >
                              <img src={jsonIcon} alt="csv" className="w-4 h-4" />
                              JSON Data
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      onClick={() => {
                        handleChangeLeadStageGlobal();
                        setShowGlobalActionsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">swap_horiz</span>
                      Change Lead Stage
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

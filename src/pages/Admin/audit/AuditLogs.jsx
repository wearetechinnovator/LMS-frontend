import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ExportButton from '../../../components/ExportButton'
import Toast from '../../../components/Toast'
import { AuditLogsSkeleton } from '../../../components/Skeletons'

// Static mockup of original records from the screenshot + a few extra for robust filtering

export default function AuditLogs() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedActionFilter, setSelectedActionFilter] = useState('All')
    const [selectedDateFilter, setSelectedDateFilter] = useState('Last 7 Days')
    const [searchTerm, setSearchTerm] = useState('')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const entriesPerPage = 10

    // Export animation/feedback state
    const [isExporting, setIsExporting] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const triggerToast = (msg) => {
        setToastMessage(msg)
    }

    // Available activity actions for filtering
    const dateFilters = ['Last 7 Days', 'Yesterday', 'Last 30 Days', 'Custom Range']

    // Fetch logs from DB
    React.useEffect(() => {
        const fetchLogs = async () => {
            const startTime = Date.now()
            try {
                const token = localStorage.getItem('authToken');
                if (!token || token === 'mock-jwt-token') {
                    setLogs(originalLogs);
                    const elapsed = Date.now() - startTime
                    const delay = Math.max(0, 500 - elapsed)
                    setTimeout(() => setLoading(false), delay)
                    return;
                }
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/audit/get-audit-logs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setLogs(data.length > 0 ? data : originalLogs);
                    } else {
                        setLogs(originalLogs);
                    }
                } else {
                    setLogs(originalLogs);
                }
            } catch (err) {
                console.error("Failed to fetch audit logs:", err);
                setLogs(originalLogs);
            } finally {
                const elapsed = Date.now() - startTime
                const delay = Math.max(0, 500 - elapsed)
                setTimeout(() => {
                    setLoading(false);
                }, delay)
            }
        };
        fetchLogs();
    }, []);

    // Listen for custom updates
    React.useEffect(() => {
        const handleLogsUpdated = () => {
            const token = localStorage.getItem('authToken');
            if (token && token !== 'mock-jwt-token') {
                fetch(`${import.meta.env.VITE_BASE_URL}/audit/get-audit-logs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data) && data.length > 0) {
                            setLogs(data);
                        }
                    })
                    .catch(err => console.error("Error updates:", err));
            }
        };
        window.addEventListener('lms-leads-updated', handleLogsUpdated);
        return () => window.removeEventListener('lms-leads-updated', handleLogsUpdated);
    }, []);

    const actionFilters = React.useMemo(() => {
        const labels = new Set(['All']);
        logs.forEach(log => {
            if (log.action?.label) {
                labels.add(log.action.label);
            }
        });
        return Array.from(labels);
    }, [logs]);

    // Filtering logic
    const filteredLogs = React.useMemo(() => {
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        return logs.filter(log => {
            const matchAction = selectedActionFilter === 'All' || log.action.label === selectedActionFilter

            let matchDate = true;
            if (log.timestamp) {
                const logDate = new Date(log.timestamp);
                switch (selectedDateFilter) {
                    case 'Yesterday': {
                        const yesterdayStart = new Date(startOfDay);
                        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
                        matchDate = logDate >= yesterdayStart && logDate < startOfDay;
                        break;
                    }
                    case 'Last 7 Days': {
                        const sevenDaysAgo = new Date(startOfDay);
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        matchDate = logDate >= sevenDaysAgo;
                        break;
                    }
                    case 'Last 30 Days': {
                        const thirtyDaysAgo = new Date(startOfDay);
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        matchDate = logDate >= thirtyDaysAgo;
                        break;
                    }
                    default:
                        break;
                }
            }

            const matchSearch = log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.targetEntity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase())

            return matchAction && matchDate && matchSearch
        })
    }, [logs, selectedActionFilter, selectedDateFilter, searchTerm])

    // Paginated subset
    const indexOfLastEntry = currentPage * entriesPerPage
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
    const currentEntries = filteredLogs.slice(indexOfFirstEntry, indexOfLastEntry)
    const totalPages = Math.ceil(filteredLogs.length / entriesPerPage) || 1

    const getPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages, currentPage + 1);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const handleClearAllFilters = () => {
        setSelectedActionFilter('All')
        setSelectedDateFilter('Last 7 Days')
        setSearchTerm('')
        setCurrentPage(1)
    }

    if (loading) {
        return <AuditLogsSkeleton />
    }

    return (
        <div className="w-full h-full flex flex-col bg-linear-to-br from-background via-background to-surface-container-lowest p-4 space-y-4 overflow-hidden relative">

            {/* 
            Toast Banner */}
            <Toast
                message={toastMessage}
                isVisible={!!toastMessage}
                onClose={() => setToastMessage('')}
            />

            {/* Header Block */}
            <div className="flex justify-between items-start border-b border-outline-variant pb-3">
                <div>
                    <h1 className="font-headline-lg text-on-background text-[22px] font-bold">Audit Logs</h1>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">Chronological record of system and user activities.</p>
                </div>

                {/* Top Action Bars */}
                <div className="flex items-center gap-2">
                    {/* Date select wrapper */}
                    <div className="flex items-center border border-outline-variant rounded bg-surface-container-lowest overflow-hidden h-8">
                        <div className="flex items-center px-2 text-on-surface-variant border-r border-outline-variant gap-1.5 h-full">
                            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                            <select
                                value={selectedDateFilter}
                                onChange={(e) => setSelectedDateFilter(e.target.value)}
                                className="bg-transparent text-[11px] font-semibold text-on-surface focus:outline-none border-none pr-1 cursor-pointer appearance-none"
                            >
                                {dateFilters.map(df => <option key={df} value={df}>{df}</option>)}
                            </select>
                            <span className="material-symbols-outlined text-[13px] pointer-events-none">expand_more</span>
                        </div>
                        <button
                            onClick={() => setSelectedDateFilter('Custom Range')}
                            className={`px-3 text-[11px] font-semibold hover:bg-surface-container transition-colors h-full ${selectedDateFilter === 'Custom Range' ? 'bg-primary/10 text-primary' : 'text-on-surface'
                                }`}
                        >
                            Custom Range
                        </button>
                    </div>

                    {/* Filter Icon button */}
                    <button
                        onClick={handleClearAllFilters}
                        title="Reset Filters"
                        className="p-1.5 border border-outline-variant rounded hover:bg-surface-container text-on-surface-variant transition-colors flex items-center justify-center h-8 w-8 bg-surface-container-lowest"
                    >
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    </button>

                    {/* Export CSV Button */}
                    <ExportButton triggerToast={triggerToast} />
                </div>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-col md:flex-row gap-3 items-center">
                {/* Search Inputs */}
                <div className="flex-1 relative w-full">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-headline-md">search</span>
                    <input
                        type="text"
                        placeholder="Search logs by user, entity, IP or change details..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full h-8 pl-9 pr-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md  text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                    />
                </div>

                {/* Filter Selector */}
                <div className="w-full md:w-48 relative">
                    <select
                        value={selectedActionFilter}
                        onChange={(e) => {
                            setSelectedActionFilter(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full h-8 pl-2.5 pr-8 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px] appearance-none cursor-pointer"
                    >
                        <option value="All">Filter by Action (All)</option>
                        {actionFilters.filter(f => f !== 'All').map(filter => (
                            <option key={filter} value={filter}>{filter}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-headline-md">expand_more</span>
                </div>
            </div>

            {/* Active Filters tags bar */}
            <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-on-surface-variant">Active Filters: <span>{selectedActionFilter}</span></span>

                {/* Date tag if modified */}
                {selectedDateFilter !== 'Last 7 Days' && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded px-2 py-0.5 font-semibold">
                        <span>Range: {selectedDateFilter}</span>
                        <button
                            onClick={() => setSelectedDateFilter('Last 7 Days')}
                            className="hover:bg-primary/25 rounded-full flex items-center justify-center w-3 h-3 text-label-capstransition-colors"
                            title="Reset date range"
                        >
                            <span className="material-symbols-outlined text-label-caps">close</span>
                        </button>
                    </div>
                )}

                {/* Search tag if active */}
                {searchTerm && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded px-2 py-0.5 font-semibold">
                        <span>Search: "{searchTerm}"</span>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="hover:bg-primary/25 rounded-full flex items-center justify-center w-3 h-3 text-label-caps transition-colors"
                        >
                            <span className="material-symbols-outlined text-label-caps">close</span>
                        </button>
                    </div>
                )}

                {(selectedActionFilter !== 'All' || selectedDateFilter !== 'Last 7 Days' || searchTerm) && (
                    <button
                        onClick={handleClearAllFilters}
                        className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Audit Logs Table Container */}
            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-[11px] border-collapse">
                        <thead className="bg-surface-container border-b border-outline-variant sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-2.5 text-left font-label-caps  text-on-surface-variant text-[9px] w-35">TIMESTAMP</th>
                                <th className="px-4 py-2.5 text-left font-label-caps  text-on-surface-variant text-[9px] w-37.5">USER</th>
                                <th className="px-4 py-2.5 text-left font-label-caps  text-on-surface-variant text-[9px] w-45">ACTION</th>
                                <th className="px-4 py-2.5 text-left font-label-caps  text-on-surface-variant text-[9px] w-45">TARGET ENTITY</th>
                                <th className="px-4 py-2.5 text-left font-label-caps  text-on-surface-variant text-[9px] w-30">IP ADDRESS</th>
                                <th className="px-4 py-2.5 text-left font-label-caps  text-on-surface-variant text-[9px]">CHANGE DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {currentEntries.length > 0 ? (
                                currentEntries.map((log) => (
                                    <tr key={log.id} className="hover:bg-surface-container/30 transition-colors">

                                        {/* Timestamp */}
                                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap align-middle">
                                            {log.timestamp}
                                        </td>

                                        {/* User avatar + name */}
                                        <td className="px-4 py-3 align-middle">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold shrink-0 ${log.user.color}`}>
                                                    {log.user.avatar}
                                                </div>
                                                <span className={`font-semibold align-middle ${log.user.isSystemAdmin ? 'text-red-600 font-bold' : 'text-on-background'
                                                    }`}>
                                                    {log.user.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Action Badge */}
                                        <td className="px-4 py-3 align-middle">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[9px] font-semibold bg-blue-50/50 text-blue-700 border-blue-200">
                                                <span className="material-symbols-outlined text-[13px]!">{log.action.icon || 'info'}</span>
                                                {log.action.label}
                                            </span>
                                        </td>

                                        {/* Target Entity */}
                                        <td className="px-4 py-3 align-middle font-medium">
                                            {log.targetEntity.isLink ? (
                                                <button
                                                    onClick={() => setSearchTerm(log.targetEntity.name)}
                                                    className="text-primary hover:underline hover:text-primary/95 text-left transition-colors font-semibold"
                                                >
                                                    {log.targetEntity.name}
                                                </button>
                                            ) : (
                                                <span className="text-on-surface">{log.targetEntity.name}</span>
                                            )}
                                        </td>

                                        {/* IP Address */}
                                        <td className="px-4 py-3 text-on-surface-variant align-middle font-mono text-label-caps">
                                            {log.ipAddress}
                                        </td>

                                        {/* Change Details */}
                                        <td className="px-4 py-3 text-on-surface align-middle font-normal leading-relaxed max-w-75">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-on-surface-variant font-medium">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <span className="material-symbols-outlined text-[32px]">info</span>
                                            <p>No audit logs matching your current filters were found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="px-4 py-2 border-t border-outline-variant flex items-center justify-between bg-surface-container select-none">
                    <p className="text-[9px] text-on-surface-variant font-semibold">
                        Showing {filteredLogs.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredLogs.length)} of {filteredLogs.length.toLocaleString()} entries
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            title="Previous Page"
                        >
                            <span className="material-symbols-outlined text-headline-md">chevron_left</span>
                        </button>

                        <div className="flex gap-0.5">
                            {getPageNumbers().map((page, pIdx) => {
                                if (page === '...') {
                                    return <span key={`dots-${pIdx}`} className="px-1.5 text-on-surface-variant self-end text-label-caps leading-tight select-none">...</span>;
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-6 h-6 rounded text-label-caps font-semibold transition-all ${currentPage === page
                                            ? 'bg-primary text-on-primary shadow-xs font-bold scale-105'
                                            : 'hover:bg-surface-container-lowest text-on-surface'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            title="Next Page"
                        >
                            <span className="material-symbols-outlined text-headline-md">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

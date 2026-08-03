import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'

const SEARCH_ITEMS = [
  // Pages
  { id: 'dashboard', title: 'Dashboard', category: 'Pages', description: 'Overview of key metrics, stats and analytics', path: '/admin/dashboard', icon: 'dashboard', tags: ['home', 'overview', 'stats', 'analytics'] },
  { id: 'leads', title: 'All Leads', category: 'Pages', description: 'Manage, filter and edit leads database', path: '/admin/leads', icon: 'handshake', tags: ['clients', 'contacts', 'customers', 'profiles'] },
  { id: 'form-builder', title: 'Form Builder', category: 'Pages', description: 'Create and customize lead capture forms', path: '/admin/form-builder', icon: 'build', tags: ['create', 'design', 'inputs'] },
  { id: 'form-embed', title: 'Form Embed', category: 'Pages', description: 'Generate and copy embed codes for forms', path: '/admin/form-embed', icon: 'paperclip', tags: ['share', 'iframe', 'code'] },
  { id: 'meta-ads', title: 'Campaign (Meta Ads)', category: 'Pages', description: 'Manage Meta ads integration and campaigns', path: '/admin/meta-ads', icon: 'campaign', tags: ['facebook', 'instagram', 'ads', 'marketing'] },
  { id: 'teams', title: 'Teams', category: 'Pages', description: 'Manage team structures, members and assignments', path: '/admin/teams', icon: 'group', tags: ['members', 'users', 'groups'] },
  { id: 'audit-logs', title: 'Audit Logs', category: 'Pages', description: 'View system audit trails and user activities', path: '/admin/audit-logs', icon: 'clipboard_clock', tags: ['security', 'history', 'actions'] },
  { id: 'roles', title: 'Roles & Permissions', category: 'Pages', description: 'Configure role-based access control and user gates', path: '/admin/roles', icon: 'user_shield', tags: ['permissions', 'access', 'security'] },
  { id: 'settings', title: 'LMS Settings', category: 'Pages', description: 'Global application settings and status flow configurations', path: '/admin/settings', icon: 'settings', tags: ['config', 'setup', 'system'] },
  { id: 'profile', title: 'User Profile', category: 'Pages', description: 'View and update your profile settings', path: '/admin/profile', icon: 'person', tags: ['account', 'me', 'avatar'] },

  // Analytics
  { id: 'analytics-stage', title: 'Analytics: Stage Wise', category: 'Analytics', description: 'Lead progression and conversion across stages', path: '/admin/analytics/stage', icon: 'analytics', tags: ['reports', 'charts', 'stages'] },
  { id: 'analytics-reg', title: 'Analytics: Registration Wise', category: 'Analytics', description: 'Reports grouped by lead registration data', path: '/admin/analytics/registration', icon: 'analytics', tags: ['reports', 'charts', 'registered'] },
  { id: 'analytics-demo', title: 'Analytics: Demographics', category: 'Analytics', description: 'Analyze leads based on demographic attributes', path: '/admin/analytics/demographics', icon: 'analytics', tags: ['reports', 'charts', 'regions', 'cities'] },
  { id: 'analytics-source', title: 'Analytics: Source Channel', category: 'Analytics', description: 'Lead generation performance by source channels', path: '/admin/analytics/source', icon: 'analytics', tags: ['reports', 'charts', 'channels', 'traffic'] },
  { id: 'analytics-vendor', title: 'Analytics: Vendors & Counselors', category: 'Analytics', description: 'Performance report of vendors and counselors', path: '/admin/analytics/vendor-counselor', icon: 'analytics', tags: ['reports', 'charts', 'performance', 'staff'] },

  // Actions
  { id: 'toggle-sidebar', title: 'Toggle Sidebar', category: 'Actions', description: 'Collapse or expand the navigation sidebar', action: 'toggle-sidebar', icon: 'menu_open', tags: ['sidebar', 'layout', 'collapse', 'expand'] },
  { id: 'logout', title: 'Logout', category: 'Actions', description: 'Sign out of your account securely', action: 'logout', icon: 'logout', tags: ['signout', 'exit', 'leave'] },
]

export default function SpotlightSearch({ onLogout, navigationItems = [], sidebarCollapsed, setSidebarCollapsed }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  // Listen for the custom event and the global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.userAgent.indexOf('Mac') !== -1
      // Alt + Space (Mac) or Ctrl + Space (Windows)
      const triggerPressed = isMac 
        ? (e.altKey && e.code === 'Space') 
        : (e.ctrlKey && e.code === 'Space')

      if (triggerPressed) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleOpenEvent = () => {
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('lms-open-spotlight', handleOpenEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('lms-open-spotlight', handleOpenEvent)
    }
  }, [])

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Filter items based on navigation permissions and search query
  const filteredItems = useMemo(() => {
    const allowedIds = new Set(navigationItems.map(item => item.id))
    
    // Step 1: Filter by role permissions
    const permittedItems = SEARCH_ITEMS.filter(item => {
      if (item.category === 'Analytics') {
        return allowedIds.has('analytics')
      }
      if (item.category === 'Pages') {
        if (item.id === 'profile' || item.id === 'settings') {
          return true
        }
        return allowedIds.has(item.id)
      }
      return true
    })

    // Step 2: Filter by search query
    if (!searchQuery.trim()) {
      // Default / Quick Suggestions when search query is empty
      return permittedItems.slice(0, 6)
    }

    const query = searchQuery.toLowerCase().trim()
    return permittedItems.filter(item => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    })
  }, [navigationItems, searchQuery])

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Handle keyboard navigation inside search overlay
  useEffect(() => {
    const handleNav = (e) => {
      if (!isOpen || filteredItems.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleItemClick(filteredItems[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleNav)
    return () => window.removeEventListener('keydown', handleNav)
  }, [isOpen, filteredItems, selectedIndex])

  // Auto-scroll active item into view
  useEffect(() => {
    if (resultsRef.current && isOpen) {
      const activeEl = resultsRef.current.children[selectedIndex]
      if (activeEl) {
        activeEl.scrollIntoView({
          block: 'nearest',
        })
      }
    }
  }, [selectedIndex, isOpen])

  const handleItemClick = (item) => {
    if (!item) return
    setIsOpen(false)

    if (item.path) {
      navigate(item.path)
    } else if (item.action) {
      if (item.action === 'logout' && onLogout) {
        onLogout()
      } else if (item.action === 'toggle-sidebar' && setSidebarCollapsed) {
        setSidebarCollapsed(!sidebarCollapsed)
      }
    }
  }

  const isMac = navigator.userAgent.indexOf('Mac') !== -1

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 h-14" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <span className="text-slate-400 select-none flex items-center justify-center shrink-0">
                <Icon name="search" size={20} />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu, reports, actions..."
                className="w-full h-full bg-transparent border-none text-[15px] font-semibold placeholder-slate-400 focus:outline-none focus:ring-0 text-slate-800"
                style={{ color: '#0f172a', caretColor: '#2563eb' }}
              />
              <div className="flex items-center gap-1.5 shrink-0 select-none">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
                  ESC
                </span>
              </div>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto max-h-[380px] p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent" style={{ backgroundColor: '#ffffff' }}>
              {filteredItems.length > 0 ? (
                <div ref={resultsRef} className="space-y-0.5">
                  {/* Category Group rendering */}
                  {filteredItems.map((item, index) => {
                    const isSelected = selectedIndex === index
                    const showCategoryLabel = index === 0 || filteredItems[index - 1].category !== item.category

                    return (
                      <React.Fragment key={item.id}>
                        {showCategoryLabel && (
                          <div
                            className="text-[9.5px] font-black uppercase tracking-wider px-3.5 pt-3 pb-1 select-none"
                            style={{ color: '#64748b', opacity: 0.8 }}
                          >
                            {item.category}
                          </div>
                        )}
                        <div
                          onClick={() => handleItemClick(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all select-none border-l-3 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/70'
                              : 'border-transparent hover:bg-slate-50'
                          }`}
                          style={{
                            color: isSelected ? '#1d4ed8' : '#334155'
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`shrink-0 flex items-center justify-center ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                              <Icon name={item.icon} size={18} />
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span
                                className={`text-[13.5px] font-bold leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}
                              >
                                {item.title}
                              </span>
                              <span
                                className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-blue-600/80' : 'text-slate-400'}`}
                              >
                                {item.description}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded flex items-center gap-1 select-none shrink-0 animate-fade-in">
                              <span>Enter</span>
                              <span className="text-[11px]">↵</span>
                            </span>
                          )}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center select-none" style={{ backgroundColor: '#ffffff' }}>
                  <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">
                    search_off
                  </span>
                  <p className="text-[13px] font-bold text-slate-800">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Double-check spelling, try search synonyms, or look for pages using general terms.
                  </p>
                </div>
              )}
            </div>

            {/* Premium Footer */}
            <div
              className="px-4 py-2 flex items-center justify-between text-[10px] select-none"
              style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', color: '#64748b' }}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="font-mono px-1 py-0.2 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#475569' }}>↑↓</span> Move
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-mono px-1.5 py-0.2 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#475569' }}>↵</span> Navigate
                </span>
              </div>
              <div>
                Shortcut: <span className="font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#475569' }}>{isMac ? '⌥ Space' : 'Ctrl + Space'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

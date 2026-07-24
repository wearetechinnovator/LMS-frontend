import React, { use, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'


export default function Navbar({ username, onLogout, roleName = 'Admin Account' }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showFormsDropdown, setShowFormsDropdown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasUnread, setHasUnread] = useState(false)
  const [profileImg, setProfileImg] = useState(() => localStorage.getItem('userImg') || '')

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileImg(localStorage.getItem('userImg') || '');
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || token === 'mock-jwt-token') return;

    let isMounted = true;
    let initialLoaded = false;
    let currentSeenIds = new Set();
    let lastFetched = '';

    const fetchLeads = async () => {
      try {
        const url = lastFetched 
          ? `${import.meta.env.VITE_BASE_URL}/lead/get-lead?since=${encodeURIComponent(lastFetched)}`
          : `${import.meta.env.VITE_BASE_URL}/lead/get-lead`;
        
        const nextFetchedTimestamp = new Date().toISOString();

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) return;
        const data = await response.json();
        
        if (!isMounted) return;

        const newLeads = [];
        data.forEach(lead => {
          if (!currentSeenIds.has(lead.id)) {
            currentSeenIds.add(lead.id);
            if (initialLoaded) {
              newLeads.push(lead);
            }
          }
        });

        if (newLeads.length > 0) {
          const newNotifs = newLeads.map(lead => ({
            id: lead.id,
            title: "New Lead Received",
            body: `${lead.name} from ${lead.source || 'Online Form'}`,
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            icon: 'person_add'
          }));
          setNotifications(prev => [...newNotifs, ...prev]);
          setHasUnread(true);

          window.dispatchEvent(new CustomEvent('lms-new-lead-received', { detail: newLeads }));
        }

        lastFetched = nextFetchedTimestamp;
        initialLoaded = true;
      } catch (err) {
        console.error("Error polling leads:", err);
      }
    };

    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  const [formsList, setFormsList] = useState([
    { name: 'ALL', displayName: 'All Leads', count: 0 }
  ])
  const [activeFormName, setActiveFormName] = useState('ALL')

  React.useEffect(() => {
    const handleDataUpdate = (e) => {
      if (e.detail) {
        if (e.detail.formsList) setFormsList(e.detail.formsList)
        if (e.detail.activeForm) setActiveFormName(e.detail.activeForm)
      }
    }
    window.addEventListener('lms-forms-data-updated', handleDataUpdate)
    return () => window.removeEventListener('lms-forms-data-updated', handleDataUpdate)
  }, [])

  const handleFormSelect = (formName) => {
    setActiveFormName(formName)
    window.dispatchEvent(new CustomEvent('lms-form-filter-changed', { detail: formName }))
  }

  // Page titles map
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/overview': 'Overview',
    '/leads': 'All Leads',
    '/departments': 'Campaigns',
    '/campaigns': 'Campaigns',
    '/teams': 'Teams',
    '/form-builder': 'Form Builder',
    '/form-embed': 'Form Embed',
    '/roles': 'Role Management',
    '/audit-logs': 'Audit Logs',
    '/settings': 'Settings',
    '/analytics': 'Analytics',
    '/profile': 'Profile Settings'
  }

  const getPageTitle = () => {
    // Strip layout prefix /admin, /counselor, /vendor
    const path = location.pathname.replace(/^\/(admin|counselor|vendor)/, '')
    for (const [key, title] of Object.entries(pageTitles)) {
      if (path === key || path.startsWith(key + '/')) {
        return title
      }
    }
    return 'Dashboard'
  }

  const activeUsername = username || localStorage.getItem('username') || 'ADMIN'
  const roleText = (roleName || 'Admin').split(' ')[0].toUpperCase()

  return (
    <motion.nav
      className="layout-navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section - Title / Dropdown */}
      <div className="navbar-left">
        {location.pathname.includes('/leads') ? (
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setShowFormsDropdown(!showFormsDropdown)}
              className="flex items-center gap-1.5 text-[15px] font-bold text-[#0b1c30] hover:opacity-85 transition-opacity bg-transparent border-none p-0 cursor-pointer select-none"
            >
              <span>
                {activeFormName === 'ALL'
                  ? `All Leads - (${formsList.find(f => f.name === 'ALL')?.count || 0})`
                  : `${activeFormName} - (${formsList.find(f => f.name === activeFormName)?.count || 0})`}
              </span>
              <span className="material-symbols-outlined text-headline-lg text-slate-500 transition-transform duration-200" style={{ transform: showFormsDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                keyboard_arrow_down
              </span>
            </button>

            {showFormsDropdown && (
              <>
                {/* Backdrop overlay to close */}
                <div className="fixed inset-0 z-45" onClick={() => setShowFormsDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-full mt-2.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-left select-none"
                >
                  {formsList.map((form) => (
                    <button
                      key={form.name}
                      onClick={() => {
                        handleFormSelect(form.name)
                        setShowFormsDropdown(false)
                      }}
                      className={`w-full px-3.5 py-2 text-left text-[12px] font-semibold hover:bg-slate-50 flex items-center justify-between transition-colors border-none bg-transparent cursor-pointer ${activeFormName === form.name ? 'text-blue-600 bg-blue-50/40' : 'text-slate-700 hover:text-slate-900'
                        }`}
                    >
                      <span>{form.displayName === 'ALL' ? 'All Leads' : form.displayName}</span>
                      <span className={`text-label-caps font-bold px-1.5 py-0.5 rounded-full ${activeFormName === form.name ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {form.count}
                      </span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        ) : (
          <h2 className="navbar-title">
            {getPageTitle()}
          </h2>
        )}
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="navbar-right">
        {/* Notifications Icon */}
        <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) {
                setHasUnread(false)
              }
            }}
            className="navbar-btn"
          >
            <span
              className="material-symbols-outlined icon"
              aria-hidden="true"
            >
              notifications
            </span>
            {/* Notification Dot */}
            {hasUnread && <span className="navbar-badge"></span>}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <motion.div
                className="navbar-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="dropdown-title">Notifications</div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="dropdown-empty">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex gap-2.5 items-start">
                        <span className="material-symbols-outlined text-[16px] text-blue-600 mt-0.5" style={{ fontSize: '16px' }}>{n.icon || 'person_add'}</span>
                        <div className="flex-1 min-w-0" style={{ textAlign: 'left' }}>
                          <p className="text-xs font-bold text-slate-800 leading-snug" style={{ margin: 0 }}>{n.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5" style={{ margin: '2px 0 0 0' }}>{n.body}</p>
                          <p className="text-[9px] text-slate-400 mt-1" style={{ margin: '4px 0 0 0' }}>{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>

        

        {/* Divider */}
        <div className="navbar-divider"></div>

        {/* User Profile */}
        <div className="navbar-user" data-tour="navbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
          <div className="user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '8px' }}>
            <span className="user-name" style={{ fontSize: '12.5px', fontWeight: '700', color: '#0b1c30', lineHeight: '1.2' }}>
              {activeUsername}
            </span>
            <span className="user-role" style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', lineHeight: '1.2', marginTop: '2px' }}>
              {roleName || 'Admin Account'}
            </span>
          </div>
          <div className="user-avatar overflow-hidden flex items-center justify-center">
            {profileImg ? (
              <img src={profileImg} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              activeUsername.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

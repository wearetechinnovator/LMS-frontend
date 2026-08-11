import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { hasPermission } from './ProtectRoute'

export default function GlobalKeyboardShortcuts() {
  const navigate = useNavigate()
  const location = useLocation()
  const sequenceBufferRef = useRef('')
  const timerRef = useRef(null)

  useEffect(() => {
    const clearPendingTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const executeShortcut = (shortcutKey) => {
      clearPendingTimer()
      sequenceBufferRef.current = ''

      const role = localStorage.getItem('userRole')

      switch (shortcutKey) {
        case 'd': // alt+d -> dashboard
          if (hasPermission('dashboard')) {
            navigate('/admin/dashboard')
          }
          break
        case 'f': // alt+f -> form builder create mode
          if (hasPermission('forms_view')) {
            if (location.pathname === '/admin/form-builder') {
              window.dispatchEvent(new Event('lms_shortcut_create_form'))
            } else {
              navigate('/admin/form-builder?mode=create', { state: { createMode: true } })
            }
          }
          break
        case 'al': // alt+al -> analytics
          if (hasPermission('dashboard')) {
            navigate('/admin/analytics')
          }
          break
        case 't': // alt+t -> team
          if (hasPermission('settings')) {
            navigate('/admin/teams')
          }
          break
        case 'a': // alt+a -> audit log
          if (hasPermission('auditLogs')) {
            navigate('/admin/audit-logs')
          }
          break
        case 'r': // alt+r -> role
          if (role === 'Admin' || role === 'System Admin' || role === 'admin') {
            navigate('/admin/roles')
          }
          break
        case 'fe': // alt+fe -> form embed
          if (hasPermission('forms_view')) {
            navigate('/admin/form-embed')
          }
          break
        case 'c': // alt+c -> campaign
          if (hasPermission('campaigns_view')) {
            navigate('/admin/meta-ads')
          }
          break
        default:
          break
      }
    }

    const handleKeyDown = (e) => {
      // Ignore shortcut when active focus is inside input elements or contenteditable containers
      const activeElement = document.activeElement
      const tagName = activeElement ? activeElement.tagName.toUpperCase() : ''
      if (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        activeElement?.isContentEditable
      ) {
        return
      }

      // Resolve key character from e.code or e.key
      let char = ''
      if (e.code && e.code.startsWith('Key')) {
        char = e.code.replace('Key', '').toLowerCase()
      } else if (e.key && e.key.length === 1) {
        char = e.key.toLowerCase()
      }

      if (!char) return

      const isAltPressed = e.altKey

      // Process if Alt/Option key is held down or if sequence buffer is active
      if (isAltPressed || sequenceBufferRef.current.length > 0) {
        // Immediate single-key shortcuts: 'd', 't', 'r', 'c'
        if (isAltPressed && (char === 'd' || char === 't' || char === 'r' || char === 'c')) {
          e.preventDefault()
          executeShortcut(char)
          return
        }

        // Multi-key prefix handling for 'a' (audit-log vs analytics 'al') and 'f' (form-builder vs form-embed 'fe')
        if (isAltPressed && sequenceBufferRef.current === '' && (char === 'a' || char === 'f')) {
          e.preventDefault()
          const prefix = char
          sequenceBufferRef.current = prefix

          clearPendingTimer()
          timerRef.current = setTimeout(() => {
            if (sequenceBufferRef.current === prefix) {
              executeShortcut(prefix)
            }
          }, 350)
          return
        }

        // Second key sequence 'a' -> 'l' => 'al' (Analytics)
        if (sequenceBufferRef.current === 'a' && char === 'l') {
          e.preventDefault()
          clearPendingTimer()
          executeShortcut('al')
          return
        }

        // Second key sequence 'f' -> 'e' => 'fe' (Form Embed)
        if (sequenceBufferRef.current === 'f' && char === 'e') {
          e.preventDefault()
          clearPendingTimer()
          executeShortcut('fe')
          return
        }

        // If another key is pressed while buffer is active, handle reset
        if (sequenceBufferRef.current.length > 0 && isAltPressed) {
          clearPendingTimer()
          sequenceBufferRef.current = ''
          if (['d', 't', 'r', 'c', 'a', 'f'].includes(char)) {
            e.preventDefault()
            if (['d', 't', 'r', 'c'].includes(char)) {
              executeShortcut(char)
            } else {
              sequenceBufferRef.current = char
              timerRef.current = setTimeout(() => {
                if (sequenceBufferRef.current === char) {
                  executeShortcut(char)
                }
              }, 350)
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearPendingTimer()
    }
  }, [navigate, location])

  return null
}

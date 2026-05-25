import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ message, isVisible, onClose }) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-6 left-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-800 flex items-center gap-2 text-xs font-bold font-sans"
        >
          <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}


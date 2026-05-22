import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ViewTeamModal({ isOpen, team, onClose, onManageTeam }) {
  if (!team) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-surface border border-outline-variant rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface z-10">
                <div className="flex items-center gap-4">
                  <div className={`${team.color} text-white p-3 rounded-lg`}>
                    <span className="material-symbols-outlined text-[28px]">{team.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-headline-lg font-headline-lg text-on-background text-[20px]">{team.name}</h2>
                    <p className="text-body-md text-on-surface-variant text-[13px] mt-1">{team.description}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-container rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface text-[24px]">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container rounded-lg p-4">
                    <p className="text-label-caps text-label-caps text-on-surface-variant text-[11px] mb-2">{team.stat.label}</p>
                    <div className="flex items-end justify-between">
                      <h3 className="text-headline-md text-headline-md text-on-background text-[28px] font-bold">{team.stat.value}</h3>
                      <p className="text-body-md text-on-surface-variant text-[12px]">{team.stat.change}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container rounded-lg p-4">
                    <p className="text-label-caps text-label-caps text-on-surface-variant text-[11px] mb-2">DEPARTMENT HEAD</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold">
                        {team.head.avatar}
                      </div>
                      <div>
                        <p className="text-body-md text-on-background text-[12px] font-semibold">{team.head.name}</p>
                        <p className="text-label-caps text-on-surface-variant text-[9px]">{team.head.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-background text-[14px] font-bold mb-3">Team Members</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {team.members.map((member, idx) => (
                      <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-outline-variant/20 border border-outline-variant flex items-center justify-center text-[12px] font-bold text-on-surface-variant">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-body-md text-on-background text-[12px] font-semibold">{member.name}</p>
                          <p className="text-label-caps text-on-surface-variant text-[10px]">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-background text-[14px] font-bold mb-2">About</h3>
                  <p className="text-body-md text-on-surface-variant text-[13px] leading-relaxed">{team.description}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-outline-variant bg-surface-container-lowest sticky bottom-0">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-semibold text-[13px] hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onManageTeam(team)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-[13px] hover:bg-primary/90 transition-colors"
                >
                  Manage Team
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

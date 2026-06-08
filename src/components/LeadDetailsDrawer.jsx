import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LeadDetailsDrawer({
  activeLeadDetails,
  setActiveLeadDetails,
  triggerToast,
  playingRecording,
  setPlayingRecording,
  audioPlaying,
  setAudioPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  playbackProgress,
  setPlaybackProgress,
  mergeSelectedProps,
  handlePropSelection,
  handleMergeProfiles,
  handleLeadStatusChange,
  handleLeadCounselorChange,
  handleLeadScoreChange,
  editingScore,
  setEditingScore,
  newComment,
  setNewComment,
  interactionType,
  setInteractionType,
  handleLogInteraction,
  handleTogglePinEvent,
  handleSendQueryResponse,
  timelineFilter,
  setTimelineFilter,
  timelineSearchQuery,
  setTimelineSearchQuery,
  filteredTimeline,
  detailsActiveTab,
  setDetailsActiveTab,
  getInitials,
  getStatusColor,
  getDuplicateRecord,
  setShowEmailModal
}) {
  if (!activeLeadDetails) return null

  const dupe = getDuplicateRecord(activeLeadDetails)
  const role = localStorage.getItem('userRole')
  const isMasked = role === 'counselor' || role === 'vendor'
  const maskEmail = (email) => {
    if (!email) return ''
    const atIdx = email.indexOf('@')
    if (atIdx <= 0) return email
    const local = email.substring(0, atIdx)
    const domain = email.substring(atIdx)
    return local.charAt(0) + '***' + domain
  }
  const maskPhone = (phone) => {
    if (!phone) return ''
    const str = String(phone).trim()
    if (str.length <= 4) return '******'
    return str.slice(0, 2) + '******' + str.slice(-2)
  }
  const getDisplayValue = (key, val) => {
    if (!val) return '--'
    if (isMasked) {
      if (key === 'email') return maskEmail(val)
      if (key === 'phone') return maskPhone(val)
    }
    return val
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-[#f8fafc] h-full font-sans select-text">
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col h-full overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveLeadDetails(null)
                setPlayingRecording(false)
                setAudioPlaying(false)
              }}
              className="p-1 hover:bg-slate-250 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-550"
              title="Back to Leads list"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-slate-800 leading-none">{activeLeadDetails.name}</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Lead ID: {activeLeadDetails.id.replace('LS-', 'L-')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeLeadDetails.score >= 76 ? (
              <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 select-none">
                <span className="material-symbols-outlined text-[12px]">local_fire_department</span> Hot
              </span>
            ) : activeLeadDetails.score >= 41 ? (
              <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full select-none">Warm</span>
            ) : (
              <span className="bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full select-none">Cold</span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border select-none ${getStatusColor(activeLeadDetails.status)}`}>
              {activeLeadDetails.status}
            </span>
          </div>
        </div>

        {/* Journey & Tabs Navigation */}
        <div className="px-4 py-3 border-b border-slate-150 bg-white space-y-3 select-none">
          {/* Journey tracker */}
          {(() => {
            const JOURNEY_STAGES = [
              { key: 'NEW', label: 'New' },
              { key: 'ASSIGNED', label: 'Assigned' },
              { key: 'CONTACTED', label: 'Contacted' },
              { key: 'QUALIFIED', label: 'Qualified' },
              { key: 'WON', label: 'Won' }
            ]
            const currentStatus = activeLeadDetails.status || 'NEW'
            let currentIdx = JOURNEY_STAGES.findIndex(s => s.key === currentStatus)
            if (currentIdx === -1) {
              if (currentStatus === 'DRAFT' || currentStatus === 'NEW') currentIdx = 0
              else currentIdx = 3
            }

            return (
              <div className="flex flex-col gap-1 text-left">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lead Journey</div>
                <div className="flex items-center justify-between w-full gap-1 pt-1 overflow-x-auto">
                  {JOURNEY_STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentIdx
                    const isActive = idx === currentIdx
                    return (
                      <React.Fragment key={stage.key}>
                        {idx > 0 && (
                          <div className={`h-[2px] flex-grow min-w-[5px] transition-colors duration-200 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-slate-200'}`} />
                        )}
                        <button
                          onClick={() => handleLeadStatusChange(activeLeadDetails.id, stage.key)}
                          className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border text-[9px] font-bold transition-all whitespace-nowrap cursor-pointer ${isCompleted
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : isActive
                              ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350 hover:bg-slate-100'
                            }`}
                        >
                          {isCompleted ? (
                            <span className="material-symbols-outlined text-[11px] text-green-600 font-bold">check</span>
                          ) : isActive ? (
                            <span className="material-symbols-outlined text-[11px] text-primary animate-pulse">arrow_forward</span>
                          ) : null}
                          {stage.label}
                        </button>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Tab Switcher */}
          <div className="flex gap-4 border-b border-slate-100 pt-1">
            {[
              { id: 'overview', label: 'Overview', icon: 'info' },
              { id: 'timeline', label: 'Activity Timeline', icon: 'history' },
              { id: 'duplicates', label: 'Duplicates', icon: 'merge_type' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDetailsActiveTab(tab.id)}
                className={`pb-2 font-bold text-[12px] border-b-2 transition-all flex items-center gap-1 cursor-pointer ${detailsActiveTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-5xl mx-auto w-full space-y-4">
            {detailsActiveTab === 'overview' && (
              <div className="space-y-4">
                {/* Card 1: Contact Details */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-2xs text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Contact Information</h4>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[12px] font-bold">
                      {getInitials(activeLeadDetails.name)}
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-800 leading-tight">{activeLeadDetails.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Lead ID: {activeLeadDetails.id.replace('LS-', 'L-')}</p>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-2.5 text-[11.5px] font-semibold text-slate-655">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">mail</span>
                      {isMasked ? (
                        <span>{maskEmail(activeLeadDetails.email)}</span>
                      ) : (
                        <a href={`mailto:${activeLeadDetails.email}`} className="hover:underline hover:text-primary transition-colors">{activeLeadDetails.email}</a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">phone</span>
                      {isMasked ? (
                        <span>{maskPhone(activeLeadDetails.phone)}</span>
                      ) : (
                        <a href={`tel:${activeLeadDetails.phone}`} className="hover:underline hover:text-primary transition-colors">{activeLeadDetails.phone}</a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
                      <span>{activeLeadDetails.location || 'London, UK'}</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Counselor</label>
                    <select
                      value={activeLeadDetails.assignedTo}
                      onChange={(e) => handleLeadCounselorChange(activeLeadDetails.id, e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white text-[12px] font-semibold outline-none cursor-pointer hover:bg-slate-50 focus:border-primary transition-colors"
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins</option>
                      <option value="Marcus Chan">Marcus Chan</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                </div>

                {/* Card 2: CRM Metrics & Lead Score */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-2xs text-left">
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Health & Score</span>
                    <div className="flex items-center gap-1" onClick={() => setEditingScore(true)}>
                      {editingScore ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={activeLeadDetails.score}
                          onChange={(e) => handleLeadScoreChange(activeLeadDetails.id, parseInt(e.target.value) || 0)}
                          onBlur={() => setEditingScore(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingScore(false)}
                          autoFocus
                          className="w-12 h-6 text-[12px] font-extrabold text-slate-800 text-center bg-white border border-primary rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-center gap-0.5 cursor-pointer">
                          <span className="text-[13px] font-extrabold text-slate-800">{activeLeadDetails.score}</span>
                          <span className="text-[10px] text-slate-400 font-bold">/100</span>
                          <span className="material-symbols-outlined text-[14px] text-slate-400 ml-0.5">edit</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2 select-none">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${activeLeadDetails.score >= 76 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        activeLeadDetails.score >= 41 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-650 border-slate-200'
                      }`}>
                      {activeLeadDetails.score >= 76 ? '🔥 HOT LEAD' : activeLeadDetails.score >= 41 ? '⚡ WARM LEAD' : '❄️ COLD LEAD'}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Probability: {activeLeadDetails.conversionProb}%
                    </span>
                  </div>

                  {/* Score breakdown list */}
                  <div className="space-y-1.5 pt-1 select-none">
                    <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Score Breakdown</div>
                    {[
                      { label: 'Email Opens', points: '+20' },
                      { label: 'Meeting Attended', points: '+25' },
                      { label: 'Website Activity', points: '+15' },
                      { label: 'Positive Call Outcome', points: '+35' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-medium text-slate-650">
                        <span>{item.label}</span>
                        <span className="text-emerald-600 font-bold font-mono">{item.points}</span>
                      </div>
                    ))}
                  </div>

                  {/* Health parameter grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 select-none">
                    {[
                      { label: 'Last Response', val: '2 Hours Ago' },
                      { label: 'Website Visits', val: '12 Visits' },
                      { label: 'Email Opens', val: '7 Opens' },
                      { label: 'Response Rate', val: '90%' }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col justify-between">
                        <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-1">{stat.label}</span>
                        <span className="font-extrabold text-slate-700">{stat.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Lead Metadata Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Lead Metadata</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11.5px] font-semibold text-slate-650">
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Source Channel</span>
                      <span className="text-slate-800 font-bold">{activeLeadDetails.source || 'Organic Search'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Lead Type</span>
                      <span className="text-slate-800 font-bold">{activeLeadDetails.leadType || (['Direct Mail', 'Cold Outreach', 'Bulk Offline CSV'].includes(activeLeadDetails.source) ? 'Offline' : 'Online')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Campaign Name</span>
                      <span className="text-slate-850 font-bold truncate block">{activeLeadDetails.campaign || 'Direct_Ingest'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Priority</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5 border ${activeLeadDetails.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          activeLeadDetails.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-655 border-slate-200'
                        }`}>{activeLeadDetails.priority}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Last Contacted</span>
                      <span className="text-slate-800 font-bold">{activeLeadDetails.lastContacted}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Next Follow-Up</span>
                      <span className="text-slate-800 font-bold">{activeLeadDetails.nextFollowUp}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Lead Query</span>
                      <span className="text-slate-800 font-bold truncate block" title={activeLeadDetails.query || '--'}>{activeLeadDetails.query || '--'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider mb-1">Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeLeadDetails.tags && activeLeadDetails.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-650 text-[10px] font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Inline Application Profile */}
                {activeLeadDetails.application && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-2xs text-left">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-blue-500">assignment</span>
                      Lead Application Profile
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-[11.5px] font-semibold text-slate-655">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Applied Program</span>
                        <span className="text-slate-850 font-bold">{activeLeadDetails.application.appliedProgram}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Submission Date</span>
                        <span className="text-slate-850 font-bold">{activeLeadDetails.application.submissionDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Company Name</span>
                        <span className="text-slate-850 font-bold">{activeLeadDetails.application.companyName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Company Size</span>
                        <span className="text-slate-855 font-bold">{activeLeadDetails.application.companySize}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-[11.5px] font-semibold pt-1 border-t border-slate-100">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Annual Revenue</span>
                      <span className="text-slate-850 font-bold">{activeLeadDetails.application.annualRevenue}</span>
                    </div>
                    <div className="space-y-1 text-[11.5px] font-semibold pt-1 border-t border-slate-100">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Target Objectives</span>
                      <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed font-sans">{activeLeadDetails.application.useCase}</p>
                    </div>
                    <div className="space-y-1 text-[11.5px] font-semibold pt-1 border-t border-slate-100">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Vetting Notes</span>
                      <p className="text-[11.5px] text-slate-500 italic font-medium leading-relaxed font-sans">{activeLeadDetails.application.notes}</p>
                    </div>
                  </div>
                )}

                {/* Card 5: Inline Support Queries */}
                {activeLeadDetails.queries && activeLeadDetails.queries.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-2xs text-left">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-blue-500">question_answer</span>
                      Support Tickets
                    </h4>
                    <div className="space-y-3">
                      {activeLeadDetails.queries.map((query) => (
                        <div key={query.id} className="border border-slate-150 rounded-xl overflow-hidden shadow-2xs bg-slate-50/40">
                          <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                            <span>Ticket #Q-98{query.id} • {query.date}</span>
                            <span className={`px-1.5 py-0.5 rounded-full border ${query.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                              }`}>{query.status}</span>
                          </div>
                          <div className="p-3 space-y-2.5">
                            <div>
                              <span className="text-[8.5px] font-bold text-slate-400 uppercase block mb-0.5">Question</span>
                              <p className="text-[11.5px] font-semibold text-slate-800 font-sans">{query.question}</p>
                            </div>
                            {query.response ? (
                              <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-lg p-2">
                                <span className="text-[8.5px] font-bold text-emerald-700 uppercase block mb-0.5">Response</span>
                                <p className="text-[11.5px] text-slate-705 font-medium font-sans">{query.response}</p>
                              </div>
                            ) : (
                              <div className="pt-2 border-t border-slate-150">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Type response and reply..."
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleSendQueryResponse(activeLeadDetails.id, query.id, e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                    className="flex-1 h-7 px-2.5 border border-slate-200 rounded-lg text-[11.5px] outline-none focus:border-blue-500"
                                  />
                                  <button
                                    onClick={(e) => {
                                      const inputElem = e.currentTarget.previousSibling;
                                      if (inputElem.value.trim()) {
                                        handleSendQueryResponse(activeLeadDetails.id, query.id, inputElem.value);
                                        inputElem.value = '';
                                      }
                                    }}
                                    className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {detailsActiveTab === 'timeline' && (
              <div className="space-y-4">
                {/* Log Interaction shortcuts */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs text-left">
                  <h3 className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1 select-none">
                    <span className="material-symbols-outlined text-[15px] text-primary">add_circle</span>
                    Log Interaction
                  </h3>
                  <div className="flex flex-wrap gap-1.5 select-none">
                    {[
                      { label: 'Log Call', type: 'CALL', text: 'Log phone call notes...' },
                      { label: 'Log Meeting', type: 'MEETING', text: 'Log meeting notes...' },
                      { label: 'Add Note', type: 'COMMENT', text: 'Add internal comment/note...' },
                      { label: 'Send Email', type: 'COMMENT', text: 'Notes on email conversation...' },
                      { label: 'Schedule Follow-up', type: 'TASK', text: 'Follow-up scheduled: ' },
                      { label: 'Create Task', type: 'TASK', text: 'New task: ' }
                    ].map(qBtn => (
                      <button
                        key={qBtn.label}
                        onClick={() => {
                          setInteractionType(qBtn.type)
                          setNewComment(qBtn.text)
                        }}
                        className="px-2 py-0.5 border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-[9.5px] font-bold text-slate-600 hover:text-primary rounded-md cursor-pointer"
                      >
                        {qBtn.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type comments, task assignments, phone notes..."
                    rows="2"
                    className="w-full text-[11.5px] p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-sans"
                  />
                  <div className="flex items-center justify-between gap-4 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Type:</span>
                      <select
                        value={interactionType}
                        onChange={(e) => setInteractionType(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] outline-none text-slate-700 cursor-pointer font-bold shadow-2xs"
                      >
                        <option value="COMMENT">Note / Comment</option>
                        <option value="TASK">Task / Reminder</option>
                        <option value="CALL">Call Summary</option>
                        <option value="MEETING">Meeting</option>
                      </select>
                    </div>
                    <button
                      onClick={handleLogInteraction}
                      className="px-3 py-1 bg-primary text-white rounded-lg text-[10.5px] font-bold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
                    >
                      Add to Timeline
                    </button>
                  </div>
                </div>

                {/* Timeline list container */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs text-left space-y-3">
                  <div className="flex flex-col gap-2 select-none">
                    <div className="flex flex-wrap gap-1">
                      {[
                        { key: 'ALL', label: 'All', icon: 'list' },
                        { key: 'CALLS', label: 'Calls', icon: 'call' },
                        { key: 'EMAILS', label: 'Emails', icon: 'mail' },
                        { key: 'MEETINGS', label: 'Meetings', icon: 'video_call' },
                        { key: 'TASKS', label: 'Tasks', icon: 'task_alt' }
                      ].map(chip => (
                        <button
                          key={chip.key}
                          onClick={() => setTimelineFilter(chip.key)}
                          className={`h-5.5 px-2 rounded-full text-[9px] font-extrabold flex items-center gap-0.5 transition-all border cursor-pointer ${timelineFilter === chip.key
                            ? 'bg-primary border-primary text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                          <span className="material-symbols-outlined text-[10px]">{chip.icon}</span>
                          {chip.label}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full">
                      <span className="material-symbols-outlined text-[13px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                        search
                      </span>
                      <input
                        type="text"
                        value={timelineSearchQuery}
                        onChange={(e) => setTimelineSearchQuery(e.target.value)}
                        placeholder="Search keywords..."
                        className="w-full h-7 pl-7 pr-2 border border-slate-200 rounded bg-white text-[10.5px] focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Vertical timeline trail */}
                  <div className="relative border-l border-slate-150 ml-2.5 pl-3.5 space-y-3.5 pb-2 max-h-[400px] overflow-y-auto">
                    {filteredTimeline.length === 0 ? (
                      <div className="py-8 text-center text-slate-405 italic text-[11px]">
                        No activities match.
                      </div>
                    ) : (
                      filteredTimeline.map((event) => {
                        const isPlayingRec = playingRecording && event.recording;
                        return (
                          <div key={event.id} className="relative">
                            <div
                              className={`absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full outline outline-3 ${event.color === 'blue-600' ? 'bg-blue-600 outline-blue-100' :
                                  event.color === 'green-600' ? 'bg-green-600 outline-green-100' :
                                    event.color === 'red-600' ? 'bg-red-600 outline-red-100' :
                                      event.color === 'amber-800' ? 'bg-amber-800 outline-amber-100' :
                                        event.color.startsWith('#') ? '' : 'bg-slate-400 outline-slate-100'
                                }`}
                              style={event.color.startsWith('#') ? { backgroundColor: event.color, outlineColor: '#ffedd5' } : {}}
                            />
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[11.5px] font-extrabold text-slate-800 flex items-center gap-1">
                                {event.title}
                                {event.pinned && (
                                  <span className="material-symbols-outlined text-[11px] text-amber-500 font-bold" title="Pinned">push_pin</span>
                                )}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9.5px] text-slate-450 font-medium">{event.date}</span>
                                <button
                                  onClick={() => handleTogglePinEvent(event.id)}
                                  className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-650 transition-colors flex items-center justify-center cursor-pointer"
                                  title={event.pinned ? 'Unpin' : 'Pin'}
                                >
                                  <span className={`material-symbols-outlined text-[12px] ${event.pinned ? 'text-amber-500 fill-amber-500' : ''}`}>push_pin</span>
                                </button>
                              </div>
                            </div>
                            {event.body && typeof event.body === 'string' && (
                              <p className="text-[11px] text-slate-650 font-medium leading-relaxed font-sans">{event.body}</p>
                            )}
                            {event.type === 'COMMENT' && event.body && (
                              <div className="my-1.5 p-2 bg-slate-50 border-l-3 border-slate-305 rounded-r text-[11px] italic text-slate-600 leading-relaxed font-sans">
                                {event.body}
                              </div>
                            )}
                            {event.type === 'CALL' && (
                              <div className="my-1.5 text-[11px] text-slate-600 font-sans space-y-1">
                                <div className="flex justify-between items-center max-w-sm">
                                  <p>{event.body}</p>
                                  {event.recording && (
                                    <button
                                      onClick={() => {
                                        setPlayingRecording(!playingRecording)
                                        if (!playingRecording) setAudioPlaying(true)
                                      }}
                                      className="px-2 py-0.5 border border-blue-200 rounded bg-blue-50/50 hover:bg-blue-50 text-[9px] font-bold text-blue-700 transition-colors cursor-pointer"
                                    >
                                      {playingRecording ? 'Close Player' : 'Listen Recording'}
                                    </button>
                                  )}
                                </div>
                                <AnimatePresence>
                                  {isPlayingRec && (
                                    <motion.div
                                      className="mt-2 p-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-lg max-w-sm shadow-2xs"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                    >
                                      <div className="flex items-center justify-between gap-2.5">
                                        <button
                                          onClick={() => setAudioPlaying(!audioPlaying)}
                                          className="w-6.5 h-6.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-[14px] text-white">
                                            {audioPlaying ? 'pause' : 'play_arrow'}
                                          </span>
                                        </button>
                                        <div className="flex-1 flex items-end h-5 gap-0.5 overflow-hidden">
                                          {[10, 24, 18, 30, 10, 16, 26, 38, 20, 14, 28, 8, 20, 36, 12, 18, 26, 32, 8, 14, 22].map((h, i, arr) => {
                                            const percent = (i / arr.length) * 100
                                            const isPlayed = percent <= playbackProgress
                                            return (
                                              <div
                                                key={i}
                                                className={`flex-grow rounded-t-sm ${isPlayed ? 'bg-blue-600' : 'bg-blue-200'}`}
                                                style={{ height: `${h}%` }}
                                              />
                                            )
                                          })}
                                        </div>
                                        <span className="text-[9.5px] font-bold text-blue-700 font-mono">01:18 / 04:22</span>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                              User: <span className="font-bold">{event.user}</span> • IP: <span>{event.ip}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {detailsActiveTab === 'duplicates' && (
              <div className="space-y-4">
                {(() => {
                  if (!dupe) {
                    return (
                      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-2xs">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                          <span className="material-symbols-outlined text-[24px]">check</span>
                        </div>
                        <h4 className="text-[13px] font-extrabold text-slate-800">No Duplicates Found</h4>
                        <p className="text-[11.5px] text-slate-505 mt-1 max-w-xs mx-auto leading-normal">
                          This lead's email (<span className="font-mono text-slate-700 font-bold">{isMasked ? maskEmail(activeLeadDetails.email) : activeLeadDetails.email}</span>) is unique.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-4 text-left">
                      <div className="p-3 bg-amber-50 border border-amber-250 rounded-xl flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">info</span>
                        <div className="text-[11.5px] text-amber-800 leading-normal">
                          <strong>Duplicate Profile Detected:</strong> A matching profile was found under ID <span className="font-mono bg-amber-100 px-1 rounded font-bold">{dupe.id}</span>.
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider p-2.5">
                          <div className="col-span-4">Attribute</div>
                          <div className="col-span-4 border-l border-slate-200 pl-2 bg-blue-50/20">Primary</div>
                          <div className="col-span-4 border-l border-slate-200 pl-2 bg-purple-50/20">Duplicate</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {[
                            { key: 'name', label: 'Full Name', icon: 'person' },
                            { key: 'email', label: 'Work Email', icon: 'mail' },
                            { key: 'phone', label: 'Phone Number', icon: 'phone' },
                            { key: 'score', label: 'Lead Score', icon: 'grade' },
                            { key: 'status', label: 'Status', icon: 'swap_horiz' },
                            { key: 'assignedTo', label: 'Counselor', icon: 'person_add' },
                            { key: 'source', label: 'Source', icon: 'source' },
                            { key: 'location', label: 'Location', icon: 'location_on' },
                            { key: 'campaign', label: 'Campaign', icon: 'sell' },
                            { key: 'query', label: 'Query', icon: 'question_mark' }
                          ].map(({ key, label, icon }) => {
                            const valPrimary = activeLeadDetails[key]
                            const valDuplicate = dupe[key]
                            const isSelectedPrimary = mergeSelectedProps[key] === valPrimary

                            return (
                              <div key={key} className="grid grid-cols-12 text-[11px] items-center hover:bg-slate-50/30 transition-colors py-2 px-2.5">
                                <div className="col-span-4 text-slate-500 font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-slate-400">{icon}</span>
                                  {label}
                                </div>
                                <div
                                  onClick={() => handlePropSelection(key, valPrimary)}
                                  className={`col-span-4 border-l border-slate-200 pl-2 cursor-pointer transition-all flex items-center gap-1.5 select-none ${isSelectedPrimary ? 'font-bold text-blue-700 bg-blue-50/10' : 'text-slate-600'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    checked={isSelectedPrimary}
                                    onChange={() => handlePropSelection(key, valPrimary)}
                                    className="w-3.5 h-3.5 cursor-pointer accent-blue-600"
                                  />
                                  <span className="truncate">{key === 'email' || key === 'phone' ? getDisplayValue(key, valPrimary) : (valPrimary || '--')}</span>
                                </div>
                                <div
                                  onClick={() => handlePropSelection(key, valDuplicate)}
                                  className={`col-span-4 border-l border-slate-200 pl-2 cursor-pointer transition-all flex items-center gap-1.5 select-none ${!isSelectedPrimary ? 'font-bold text-purple-700 bg-purple-50/10' : 'text-slate-650'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    checked={!isSelectedPrimary}
                                    onChange={() => handlePropSelection(key, valDuplicate)}
                                    className="w-3.5 h-3.5 cursor-pointer accent-purple-600"
                                  />
                                  <span className="truncate">{key === 'email' || key === 'phone' ? getDisplayValue(key, valDuplicate) : (valDuplicate || '--')}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                        <h4 className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none">
                          <span className="material-symbols-outlined text-[13px] text-slate-400">preview</span>
                          Outcome Profile Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-slate-650 font-semibold">
                          <div><span className="text-slate-400 block text-[9px]">Merged Name</span><span className="text-slate-800 font-bold">{mergeSelectedProps.name}</span></div>
                          <div><span className="text-slate-400 block text-[9px]">Work Email</span><span className="text-slate-800 font-bold">{mergeSelectedProps.email}</span></div>
                          <div><span className="text-slate-400 block text-[9px]">Score / Counselor</span><span className="text-slate-800 font-bold">{mergeSelectedProps.score} • {mergeSelectedProps.assignedTo}</span></div>
                          <div><span className="text-slate-400 block text-[9px]">Status</span><span className="text-slate-800 font-bold">{mergeSelectedProps.status}</span></div>
                        </div>
                      </div>

                      <button
                        onClick={handleMergeProfiles}
                        className="w-full py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm select-none"
                      >
                        <span className="material-symbols-outlined text-[16px] text-white">done</span>
                        Confirm & Merge Profiles
                      </button>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

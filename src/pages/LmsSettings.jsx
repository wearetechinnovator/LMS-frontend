import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LmsSettings() {
  const [activeTab, setActiveTab] = useState('routing')
  const [toastMsg, setToastMsg] = useState(null)

  // -- TAB 1: ROUTING RULES STATE --
  const [routingMode, setRoutingMode] = useState('RULE_BASED') // ROUND_ROBIN, WEIGHTED, RULE_BASED
  const [counselorWeights, setCounselorWeights] = useState([
    { name: 'Sarah Jenkins', weight: 40, activeLeads: 12 },
    { name: 'Marcus Chan', weight: 40, activeLeads: 9 },
    { name: 'Michael Chen', weight: 20, activeLeads: 15 }
  ])
  const [routingRules, setRoutingRules] = useState([
    { id: 1, parameter: 'Lead Source', operator: 'equals', value: 'Paid Search', assignee: 'Marcus Chan', active: true },
    { id: 2, parameter: 'Score', operator: 'greater_than', value: '80', assignee: 'Sarah Jenkins', active: true },
    { id: 3, parameter: 'Location', operator: 'equals', value: 'London, UK', assignee: 'Sarah Jenkins', active: true },
    { id: 4, parameter: 'Campaign', operator: 'equals', value: 'Q3_Tech_Promo', assignee: 'Michael Chen', active: false }
  ])

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    parameter: 'Lead Source',
    operator: 'equals',
    value: '',
    assignee: 'Sarah Jenkins'
  })
  const [showAddRuleForm, setShowAddRuleForm] = useState(false)

  // -- TAB 2: SCORING ENGINE STATE --
  const [scoringRules, setScoringRules] = useState([
    { id: '1', event: 'Web Form Submission', points: 25, active: true, category: 'Conversion' },
    { id: '2', event: 'Email Link Click', points: 10, active: true, category: 'Engagement' },
    { id: '3', event: 'Email Opened', points: 5, active: true, category: 'Engagement' },
    { id: '4', event: 'Phone Call Connected', points: 20, active: true, category: 'Call' },
    { id: '5', event: 'Phone Call No Answer', points: -5, active: true, category: 'Call' },
    { id: '6', event: 'Meeting Attended', points: 40, active: true, category: 'Meeting' }
  ])
  const [newScoringEvent, setNewScoringEvent] = useState({ event: '', points: 10, category: 'Engagement' })
  const [showAddScoringForm, setShowAddScoringForm] = useState(false)

  // -- TAB 3: INTEGRATIONS & WEBHOOKS STATE --
  const [webhookToken, setWebhookToken] = useState('tis_lms_prod_9021a3b8cd2b17f8a')
  const [webhookCopied, setWebhookCopied] = useState(false)
  const [testingPayload, setTestingPayload] = useState(false)
  const [webhookPayload, setWebhookPayload] = useState(JSON.stringify({
    name: "Alex Mercer",
    email: "alex.m@biotech.com",
    phone: "+1 (555) 789-0122",
    source: "Webhook Ingest API",
    score: 85,
    location: "Austin, TX",
    campaign: "Q3_Tech_Promo"
  }, null, 2))

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3500)
  }

  // Handle Weight Slider adjustments
  const handleWeightChange = (index, value) => {
    const updated = [...counselorWeights]
    updated[index].weight = parseInt(value) || 0
    setCounselorWeights(updated)
  }

  const totalWeight = counselorWeights.reduce((sum, item) => sum + item.weight, 0)

  // Add Routing Rule
  const handleAddRoutingRule = (e) => {
    e.preventDefault()
    if (!newRule.value.trim()) {
      triggerToast('Please provide a condition value for the routing rule')
      return
    }
    const rule = {
      id: Date.now(),
      parameter: newRule.parameter,
      operator: newRule.operator,
      value: newRule.value,
      assignee: newRule.assignee,
      active: true
    }
    setRoutingRules([...routingRules, rule])
    setNewRule({ parameter: 'Lead Source', operator: 'equals', value: '', assignee: 'Sarah Jenkins' })
    setShowAddRuleForm(false)
    triggerToast('New conditional routing rule successfully registered')
  }

  // Toggle Rule Status
  const toggleRuleActive = (id) => {
    setRoutingRules(routingRules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  // Delete Routing Rule
  const deleteRoutingRule = (id) => {
    setRoutingRules(routingRules.filter(r => r.id !== id))
    triggerToast('Routing rule deleted')
  }

  // Scoring Rule adjustments
  const adjustScorePoints = (id, amount) => {
    setScoringRules(scoringRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, points: rule.points + amount }
      }
      return rule
    }))
  }

  const toggleScoringActive = (id) => {
    setScoringRules(scoringRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, active: !rule.active }
      }
      return rule
    }))
  }

  const handleAddScoringRule = (e) => {
    e.preventDefault()
    if (!newScoringEvent.event.trim()) {
      triggerToast('Please provide a custom event name')
      return
    }
    const newRule = {
      id: String(Date.now()),
      event: newScoringEvent.event,
      points: parseInt(newScoringEvent.points) || 10,
      active: true,
      category: newScoringEvent.category
    }
    setScoringRules([...scoringRules, newRule])
    setNewScoringEvent({ event: '', points: 10, category: 'Engagement' })
    setShowAddScoringForm(false)
    triggerToast(`Scoring rule added for ${newRule.event}`)
  }

  const handleCopyWebhook = () => {
    const url = `https://api.tisindia.lms.com/v1/inbound?token=${webhookToken}`
    navigator.clipboard.writeText(url)
    setWebhookCopied(true)
    triggerToast('Webhook Endpoint URL copied to clipboard!')
    setTimeout(() => setWebhookCopied(false), 2000)
  }

  const handleRegenerateToken = () => {
    const rand = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10)
    setWebhookToken(`tis_lms_prod_${rand}`)
    triggerToast('Generated a secure new endpoint key token')
  }

  const handleTriggerWebhookTest = () => {
    let parsed
    try {
      parsed = JSON.parse(webhookPayload)
    } catch (err) {
      triggerToast('Error: Webhook payload is not valid JSON')
      return
    }
    setTestingPayload(true)
    setTimeout(() => {
      setTestingPayload(false)
      triggerToast(`Webhook Ingested successfully! Lead ID: LS-${Math.floor(1000 + Math.random() * 9000)} (${parsed.name || 'Anonymous'}) routed to ${parsed.assignedTo || 'Sarah Jenkins'} via routing rules`)
    }, 1500)
  }

  return (
    <div className="w-full relative h-full flex flex-col font-sans select-none p-6 text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-800"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
            <span className="text-[12px] font-semibold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block */}
      <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">LMS Settings & Automation</h1>
          <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">Configure automated routing engines, lead scoring setups, and developer webhook ingestions.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LMS Engine v2.4 (Active)
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-outline-variant gap-4 mb-6 select-none">
        <button
          onClick={() => setActiveTab('routing')}
          className={`pb-3 font-semibold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'routing' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          Lead Distribution & Routing
        </button>
        <button
          onClick={() => setActiveTab('scoring')}
          className={`pb-3 font-semibold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'scoring' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">grade</span>
          Lead Scoring Engine
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 font-semibold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'integrations' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">webhook</span>
          Integrations & Inbound Webhooks
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: LEAD ROUTING */}
          {activeTab === 'routing' && (
            <motion.div
              key="routing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Distribution Mode Block */}
                <div className="lg:col-span-1 bg-surface border border-outline-variant rounded-xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Routing Engines</h3>
                    <p className="text-[11.5px] text-slate-500 mt-0.5">Determine how incoming leads are distributed among counselors.</p>
                  </div>

                  <div className="space-y-3">
                    {/* Mode 1: Round Robin */}
                    <div
                      onClick={() => setRoutingMode('ROUND_ROBIN')}
                      className={`p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                        routingMode === 'ROUND_ROBIN' ? 'border-primary bg-blue-50/20' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={routingMode === 'ROUND_ROBIN'}
                        onChange={() => setRoutingMode('ROUND_ROBIN')}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-[12px] font-bold text-slate-800">Round Robin</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Distributes leads equally and sequentially to all online counselors.</p>
                      </div>
                    </div>

                    {/* Mode 2: Weighted */}
                    <div
                      onClick={() => setRoutingMode('WEIGHTED')}
                      className={`p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                        routingMode === 'WEIGHTED' ? 'border-primary bg-blue-50/20' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={routingMode === 'WEIGHTED'}
                        onChange={() => setRoutingMode('WEIGHTED')}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-[12px] font-bold text-slate-800">Weighted Allocation</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Allocates leads dynamically based on adjustable assignee weight percentage variables.</p>
                      </div>
                    </div>

                    {/* Mode 3: Conditional Rules */}
                    <div
                      onClick={() => setRoutingMode('RULE_BASED')}
                      className={`p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                        routingMode === 'RULE_BASED' ? 'border-primary bg-blue-50/20' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={routingMode === 'RULE_BASED'}
                        onChange={() => setRoutingMode('RULE_BASED')}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-[12px] font-bold text-slate-800">Advanced Rule-Based</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Triggers route assignments based on complex fields logic rules (Campaign, Source, Location, etc.)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Controls Dashboard (Col span 2) */}
                <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-5 space-y-4">
                  {routingMode === 'ROUND_ROBIN' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Round Robin Allocation Queue</h3>
                        <p className="text-[11px] text-slate-500">Online assignees will receive leads in the order listed below.</p>
                      </div>
                      
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse text-[12px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                              <th className="px-4 py-2.5">Position</th>
                              <th className="px-4 py-2.5">Counselor</th>
                              <th className="px-4 py-2.5">Current Cap</th>
                              <th className="px-4 py-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="px-4 py-3 font-mono font-bold">1st</td>
                              <td className="px-4 py-3 font-bold text-slate-800">Sarah Jenkins</td>
                              <td className="px-4 py-3 text-slate-600">12 / 20 leads</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">Online</span></td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-mono font-bold">2nd</td>
                              <td className="px-4 py-3 font-bold text-slate-800">Marcus Chan</td>
                              <td className="px-4 py-3 text-slate-600">9 / 20 leads</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">Online</span></td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-mono font-bold">3rd</td>
                              <td className="px-4 py-3 font-bold text-slate-800">Michael Chen</td>
                              <td className="px-4 py-3 text-slate-600">15 / 30 leads</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">Online</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-lg flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">info</span>
                        <p className="text-[10.5px] text-blue-800 leading-relaxed">
                          Incoming leads trigger sequential assignments automatically. Under-capacity or idle counselors are dynamically weighted to receive primary assignments first.
                        </p>
                      </div>
                    </div>
                  )}

                  {routingMode === 'WEIGHTED' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">Counselor Weight Allocations</h3>
                          <p className="text-[11px] text-slate-500">Drag sliders to adjust lead distribution ratio priorities.</p>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                          totalWeight === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                        }`}>
                          Total Weight: {totalWeight}%
                        </span>
                      </div>

                      <div className="space-y-4">
                        {counselorWeights.map((counselor, idx) => (
                          <div key={counselor.name} className="space-y-1.5">
                            <div className="flex justify-between text-[11.5px] font-bold text-slate-700">
                              <span>{counselor.name}</span>
                              <span className="font-mono text-primary">{counselor.weight}% allocation</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={counselor.weight}
                                onChange={(e) => handleWeightChange(idx, e.target.value)}
                                className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalWeight !== 100 && (
                        <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-lg flex items-start gap-2 text-red-800 text-[10.5px]">
                          <span className="material-symbols-outlined text-[16px] mt-0.5">warning</span>
                          <p>
                            <strong>Validation Error:</strong> Cumulative weight ratios must sum exactly to 100%. Adjust sliders to distribute remaining {100 - totalWeight}% variables.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {routingMode === 'RULE_BASED' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">Advanced Rule Assignments</h3>
                          <p className="text-[11px] text-slate-500 font-medium">Leads are matched sequentially top-to-bottom. If no rules match, leads fall back to Unassigned.</p>
                        </div>
                        <button
                          onClick={() => setShowAddRuleForm(true)}
                          className="h-7 px-3 bg-primary hover:bg-primary/95 text-white rounded text-[11px] font-bold shadow-xs flex items-center gap-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">add</span>
                          Add Rule
                        </button>
                      </div>

                      {/* Add rule inline form modal */}
                      <AnimatePresence>
                        {showAddRuleForm && (
                          <motion.form
                            onSubmit={handleAddRoutingRule}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="flex justify-between items-center pb-1 border-b border-slate-200 mb-2">
                              <h4 className="text-[11.5px] font-bold text-slate-700">Create New Route Rule</h4>
                              <button
                                type="button"
                                onClick={() => setShowAddRuleForm(false)}
                                className="p-0.5 hover:bg-slate-200 rounded text-slate-400"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Parameter</label>
                                <select
                                  value={newRule.parameter}
                                  onChange={(e) => setNewRule({ ...newRule, parameter: e.target.value })}
                                  className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                                >
                                  <option value="Lead Source">Lead Source</option>
                                  <option value="Score">Score</option>
                                  <option value="Location">Location</option>
                                  <option value="Campaign">Campaign</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Operator</label>
                                <select
                                  value={newRule.operator}
                                  onChange={(e) => setNewRule({ ...newRule, operator: e.target.value })}
                                  className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                                >
                                  <option value="equals">equals</option>
                                  <option value="contains">contains</option>
                                  <option value="greater_than">greater than</option>
                                  <option value="less_than">less than</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Target Value</label>
                                <input
                                  type="text"
                                  required
                                  value={newRule.value}
                                  onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                                  placeholder="e.g. Website Organic"
                                  className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Assign Lead To</label>
                                <select
                                  value={newRule.assignee}
                                  onChange={(e) => setNewRule({ ...newRule, assignee: e.target.value })}
                                  className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                                >
                                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                                  <option value="Marcus Chan">Marcus Chan</option>
                                  <option value="Michael Chen">Michael Chen</option>
                                  <option value="Unassigned">Unassigned</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() => setShowAddRuleForm(false)}
                                className="px-3 h-6 border border-slate-300 hover:bg-slate-100 rounded text-[10px] font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3 h-6 bg-primary hover:bg-primary/95 text-white rounded text-[10px] font-bold"
                              >
                                Add Rule
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* Rules Listing Grid */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse text-[12px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold select-none">
                              <th className="px-4 py-2.5">Priority</th>
                              <th className="px-4 py-2.5">Condition Expression</th>
                              <th className="px-4 py-2.5">Assignee Destination</th>
                              <th className="px-4 py-2.5">State</th>
                              <th className="px-4 py-2.5 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {routingRules.map((rule, idx) => (
                              <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-mono font-semibold">#{idx + 1}</td>
                                <td className="px-4 py-3 font-semibold text-slate-800">
                                  {rule.parameter} <span className="text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-1 rounded mx-0.5">{rule.operator.replace('_', ' ')}</span> "{rule.value}"
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                                      {rule.assignee.charAt(0)}
                                    </div>
                                    <span className="font-bold">{rule.assignee}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 select-none">
                                  <button
                                    onClick={() => toggleRuleActive(rule.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                      rule.active
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                    }`}
                                  >
                                    {rule.active ? 'ACTIVE' : 'INACTIVE'}
                                  </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => deleteRoutingRule(rule.id)}
                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: LEAD SCORING */}
          {activeTab === 'scoring' && (
            <motion.div
              key="scoring"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-4">
                
                {/* Scoring Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Lead Scoring Engine Config</h3>
                    <p className="text-[11.5px] text-slate-500 mt-0.5">Define points added or deducted automatically from a lead score on system events.</p>
                  </div>
                  <button
                    onClick={() => setShowAddScoringForm(true)}
                    className="h-7 px-3 bg-primary hover:bg-primary/95 text-white rounded text-[11px] font-bold shadow-xs flex items-center gap-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    Create Scoring Rule
                  </button>
                </div>

                {/* Add Custom Scoring Trigger inline */}
                <AnimatePresence>
                  {showAddScoringForm && (
                    <motion.form
                      onSubmit={handleAddScoringRule}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 max-w-2xl"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="flex justify-between items-center pb-1 border-b border-slate-200 mb-2">
                        <h4 className="text-[11.5px] font-bold text-slate-700">Add Scoring Rule Action</h4>
                        <button
                          type="button"
                          onClick={() => setShowAddScoringForm(false)}
                          className="p-0.5 hover:bg-slate-200 rounded text-slate-400"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Event Trigger</label>
                          <input
                            type="text"
                            required
                            value={newScoringEvent.event}
                            onChange={(e) => setNewScoringEvent({ ...newScoringEvent, event: e.target.value })}
                            placeholder="e.g. WhatsApp Reply, Video Opened"
                            className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Score Value (Points)</label>
                          <input
                            type="number"
                            required
                            value={newScoringEvent.points}
                            onChange={(e) => setNewScoringEvent({ ...newScoringEvent, points: parseInt(e.target.value) || 0 })}
                            className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5 uppercase">Category</label>
                          <select
                            value={newScoringEvent.category}
                            onChange={(e) => setNewScoringEvent({ ...newScoringEvent, category: e.target.value })}
                            className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-[11px] outline-none"
                          >
                            <option value="Engagement">Engagement</option>
                            <option value="Conversion">Conversion</option>
                            <option value="Call">Call</option>
                            <option value="Meeting">Meeting</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setShowAddScoringForm(false)}
                          className="px-3 h-6 border border-slate-300 hover:bg-slate-100 rounded text-[10px] font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 h-6 bg-primary hover:bg-primary/95 text-white rounded text-[10px] font-bold"
                        >
                          Save Scoring Event
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Score Rules Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-[12px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold select-none">
                        <th className="px-4 py-2.5">Trigger Event</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5 text-center w-36">Points Adjustment</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scoringRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-800">{rule.event}</td>
                          <td className="px-4 py-3 text-slate-500">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] border border-slate-200/60 font-semibold">{rule.category}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => adjustScorePoints(rule.id, -5)}
                                className="w-5 h-5 rounded bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors cursor-pointer select-none text-[12px]"
                              >
                                -
                              </button>
                              <span className={`w-10 font-bold font-mono text-[13px] text-center ${
                                rule.points > 0 ? 'text-green-600' : rule.points < 0 ? 'text-red-500' : 'text-slate-500'
                              }`}>
                                {rule.points > 0 ? `+${rule.points}` : rule.points}
                              </span>
                              <button
                                onClick={() => adjustScorePoints(rule.id, 5)}
                                className="w-5 h-5 rounded bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors cursor-pointer select-none text-[12px]"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 select-none">
                            <button
                              onClick={() => toggleScoringActive(rule.id)}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                rule.active
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                            >
                              {rule.active ? 'ACTIVE' : 'DISABLED'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: INTEGRATIONS & WEBHOOKS */}
          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left side integrations list */}
                <div className="space-y-6">
                  
                  {/* Webhook Endpoint URLs */}
                  <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-4 text-left">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Developer Inbound Webhook</h3>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">Submit HTTP POST requests directly to capture and route external leads instantly.</p>
                    </div>

                    <div className="space-y-3 font-sans">
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-bold text-slate-400 block tracking-wider uppercase">Ingest Endpoint URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`https://api.tisindia.lms.com/v1/inbound?token=${webhookToken}`}
                            className="flex-1 h-8 px-2.5 border border-slate-200 rounded-lg bg-slate-50 text-[11px] font-mono text-slate-600 outline-none select-all truncate"
                          />
                          <button
                            onClick={handleCopyWebhook}
                            className="h-8 px-3 border border-slate-350 hover:bg-slate-50 rounded-lg flex items-center justify-center text-[11.5px] font-bold text-slate-700 bg-white transition-colors cursor-pointer select-none"
                          >
                            <span className="material-symbols-outlined text-[16px] mr-0.5">
                              {webhookCopied ? 'check' : 'content_copy'}
                            </span>
                            {webhookCopied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end select-none">
                        <button
                          onClick={handleRegenerateToken}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
                        >
                          <span className="material-symbols-outlined text-[13px]">refresh</span>
                          Regenerate Secure Key Token
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Connect Ecosystem Integrations */}
                  <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Ecosystem Integrations</h3>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">Integrate third-party advertising platforms and lead capture pipelines.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Facebook */}
                      <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col justify-between h-[90px] text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-800">Facebook Integration</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Connected" />
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Ingests leads generated from Facebook Lead Ads campaigns.</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Status: CONNECTED</span>
                      </div>

                      {/* Instagram */}
                      <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col justify-between h-[90px] text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-800">Instagram Integration</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Connected" />
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Pulls prospective student profiles from IG Story/Reels forms.</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Status: CONNECTED</span>
                      </div>

                      {/* Google Ads */}
                      <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col justify-between h-[90px] text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-800">Google Ads Sync</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Connected" />
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Synchronizes Google conversion metrics and keyword search leads.</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Status: SYNC ACTIVE</span>
                      </div>

                      {/* LinkedIn */}
                      <div className="p-3 border border-slate-200 rounded-lg bg-white flex flex-col justify-between h-[90px] text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-800">LinkedIn Lead Gen</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-350" title="Disconnected" />
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Import professional B2B profiles from corporate ads.</p>
                        <button className="text-[9.5px] text-left font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer self-start">
                          Connect Now →
                        </button>
                      </div>

                      {/* WhatsApp */}
                      <div className="p-3 border border-slate-200 rounded-lg bg-white flex flex-col justify-between h-[90px] text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-800">WhatsApp Business</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-350" title="Disconnected" />
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Integrate direct chat widget automation and alerts.</p>
                        <button className="text-[9.5px] text-left font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer self-start">
                          Connect Now →
                        </button>
                      </div>

                      {/* Webhooks/API */}
                      <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col justify-between h-[90px] text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-800">Webhooks / API</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Active" />
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Allows capturing external payloads dynamically via secure tokens.</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Status: ACTIVE</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right side JSON Sandbox Tester */}
                <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-4 flex flex-col text-left">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Inbound HTTP Webhook Tester</h3>
                    <p className="text-[11.5px] text-slate-500 mt-0.5">Trigger mock HTTP requests to debug rule executions, active scoring, and team reassignments.</p>
                  </div>

                  <div className="flex-1 flex flex-col space-y-2">
                    <label className="text-[9.5px] font-bold text-slate-400 block tracking-wider uppercase">HTTP POST Request Payload (JSON)</label>
                    <textarea
                      value={webhookPayload}
                      onChange={(e) => setWebhookPayload(e.target.value)}
                      rows="8"
                      className="w-full flex-1 p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11.5px] text-green-400 leading-relaxed outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    onClick={handleTriggerWebhookTest}
                    disabled={testingPayload}
                    className="w-full h-8.5 bg-primary hover:bg-primary/95 disabled:bg-primary/80 text-white rounded-lg font-bold text-[12px] shadow-sm flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
                  >
                    {testingPayload ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Simulating POST Payload...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        Test Payload Ingest
                      </>
                    )}
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  )
}

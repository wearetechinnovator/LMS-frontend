import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InitialConfig() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [stages, setStages] = useState([
    { id: 1, name: 'New', color: '#2563eb' },
    { id: 2, name: 'Contacted', color: '#bc4800' },
    { id: 3, name: 'Callback', color: '#565e74' },
    { id: 4, name: 'Interested', color: '#eab308' },
    { id: 5, name: 'Converted', color: '#22c55e', locked: true }
  ])
  const [sources, setSources] = useState({
    website: true,
    api: true,
    manual: true,
    referral: false
  })
  const [showModal, setShowModal] = useState(false)
  const [newStage, setNewStage] = useState({ name: '', color: '#2563eb' })
  const [draggedItem, setDraggedItem] = useState(null)

  const handleRemoveStage = (id) => {
    if (!stages.find(s => s.id === id)?.locked) {
      setStages(stages.filter(s => s.id !== id))
    }
  }

  const handleDragStart = (e, stage) => {
    setDraggedItem(stage)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetStage.id) return

    const draggedIndex = stages.findIndex(s => s.id === draggedItem.id)
    const targetIndex = stages.findIndex(s => s.id === targetStage.id)
    
    const newStages = [...stages]
    newStages.splice(draggedIndex, 1)
    newStages.splice(targetIndex, 0, draggedItem)
    
    setStages(newStages)
    setDraggedItem(null)
  }

  const handleAddStage = () => {
    if (newStage.name.trim()) {
      const newId = Math.max(...stages.map(s => s.id), 0) + 1
      setStages([...stages, { id: newId, name: newStage.name, color: newStage.color }])
      setNewStage({ name: '', color: '#2563eb' })
      setShowModal(false)
    }
  }

  const colors = [
    '#2563eb', '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
    '#0891b2', '#7c3aed', '#db2777', '#000000', '#64748b'
  ]

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 flex-1 content-start">
        {/* Industry Selection */}
        <motion.div 
          className="lg:col-span-12 bg-surface border border-outline-variant rounded p-6 shadow-sm"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center">
            <span className="material-symbols-outlined mr-2 text-primary text-[20px]">domain</span>
            Industry Alignment
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Select your primary industry to load optimized default templates.</p>
          <div className="w-full md:w-1/2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">PRIMARY INDUSTRY</label>
            <select 
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded h-10 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
            >
              <option value="">Select an industry...</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="realestate">Real Estate</option>
              <option value="generalsales">General Sales</option>
            </select>
          </div>
        </motion.div>

        {/* Pipeline Stages */}
        <motion.div 
          className="lg:col-span-7 bg-surface border border-outline-variant rounded p-6 shadow-sm flex flex-col"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary text-[20px]">view_timeline</span>
                Pipeline Stages
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Define the lifecycle of a lead.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="text-primary font-label-caps text-label-caps flex items-center hover:bg-surface-container p-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] mr-1">add</span> ADD STAGE
            </button>
          </div>
          <div className="flex-1 border border-outline-variant/50 rounded bg-surface-container-lowest p-2 space-y-2">
            {stages.map((stage, idx) => (
              <motion.div 
                key={stage.id}
                draggable={!stage.locked}
                onDragStart={(e) => handleDragStart(e, stage)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className={`flex items-center bg-surface border border-outline-variant p-2 rounded transition-colors group ${
                  !stage.locked ? 'cursor-grab hover:bg-surface-container-low' : 'cursor-not-allowed opacity-75'
                }`}
              >
                <span className={`material-symbols-outlined text-outline mr-3 text-[18px] ${!stage.locked ? 'group-hover:text-on-surface-variant' : 'opacity-50'}`}>
                  {stage.locked ? 'lock' : 'drag_indicator'}
                </span>
                <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: stage.color}}></div>
                <span className="font-body-md text-body-md text-on-surface flex-1">{stage.name}</span>
                <button 
                  onClick={() => handleRemoveStage(stage.id)}
                  disabled={stage.locked}
                  className="material-symbols-outlined text-outline-variant text-[16px] cursor-pointer hover:text-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stage.locked ? 'lock' : 'close'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Primary Lead Sources */}
        <motion.div 
          className="lg:col-span-5 bg-surface border border-outline-variant rounded p-6 shadow-sm"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center">
            <span className="material-symbols-outlined mr-2 text-primary text-[20px]">input</span>
            Ingestion Sources
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Select active channels.</p>
          <div className="space-y-3">
            {[
              { key: 'website', label: 'Website Forms', desc: 'Direct integration via snippet.' },
              { key: 'api', label: 'API Endpoint', desc: 'RESTful ingestion for third-parties.' },
              { key: 'manual', label: 'Manual Entry', desc: 'Staff input via dashboard.' },
              { key: 'referral', label: 'Referral Network', desc: 'Partner portal submissions.' }
            ].map(source => (
              <motion.label 
                key={source.key}
                className="flex items-start cursor-pointer group"
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center h-5">
                  <input 
                    checked={sources[source.key]}
                    onChange={(e) => setSources({...sources, [source.key]: e.target.checked})}
                    className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary focus:ring-1" 
                    type="checkbox"
                  />
                </div>
                <div className="ml-3">
                  <span className="block font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">{source.label}</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">{source.desc}</span>
                </div>
              </motion.label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Stage Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-surface border border-outline-variant rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Add New Stage</h3>
              
              <div className="space-y-4">
                {/* Stage Name Input */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">STAGE NAME</label>
                  <input
                    type="text"
                    value={newStage.name}
                    onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                    placeholder="e.g., Proposal"
                    className="w-full px-3 h-8 border border-outline-variant rounded font-body-md text-body-md focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">STAGE COLOR</label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewStage({...newStage, color})}
                        className={`w-full h-8 rounded border-2 transition-all ${
                          newStage.color === color ? 'border-on-surface scale-110' : 'border-outline-variant'
                        }`}
                        style={{backgroundColor: color}}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: newStage.color}}></div>
                    <span className="font-body-md text-body-md text-on-surface">{newStage.name || 'New Stage'}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-8 border border-outline-variant rounded bg-surface hover:bg-surface-container-low font-body-md text-body-md text-on-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStage}
                    disabled={!newStage.name.trim()}
                    className="flex-1 h-8 rounded bg-primary hover:bg-primary/90 font-body-md text-body-md text-on-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Stage
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

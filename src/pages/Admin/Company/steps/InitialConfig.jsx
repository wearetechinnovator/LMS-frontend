import React, { useState, useEffect } from 'react'
export default function InitialConfig({ stages, setStages }) {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [industries, setIndustries] = useState([
    { id: 'healthcare', name: 'Healthcare', icon: 'local_hospital', color: '#10b981' },
    { id: 'education', name: 'Education', icon: 'school', color: '#6366f1' },
    { id: 'realestate', name: 'Real Estate', icon: 'home', color: '#f97316' },
    { id: 'generalsales', name: 'General Sales', icon: 'shopping_bag', color: '#ec4899' }
  ])
  const [isAddingIndustry, setIsAddingIndustry] = useState(false)
  const [newIndustryName, setNewIndustryName] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [newStage, setNewStage] = useState({ name: '', color: '#2563eb' })
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    if (selectedIndustry) {
      localStorage.setItem('companyIndustry', selectedIndustry)
    }
  }, [selectedIndustry])

  useEffect(() => {
    // Map stages to custom statuses list
    const mappedStatuses = stages.map(s => {
      const upperName = s.name.toUpperCase().trim();
      return {
        value: upperName,
        label: s.name.trim(),
        color: s.color,
        isSystem: s.locked || false,
        description: `${s.name} stage`
      };
    });

    // Always ensure a LOST status exists for fallback/rejected deals
    if (!mappedStatuses.some(s => s.value === 'LOST')) {
      mappedStatuses.push({
        value: 'LOST',
        label: 'LOST',
        color: '#ef4444',
        isSystem: true,
        description: 'Lead lost / deal closed'
      });
    }

    // Save statuses to localStorage
    localStorage.setItem('lms_custom_statuses', JSON.stringify(mappedStatuses));

    // Save journey to localStorage
    // The journey is the list of active step values (excluding LOST)
    const journeySteps = stages.map(s => s.name.toUpperCase().trim());
    const customJourneys = [
      {
        id: 'default',
        name: 'Standard CRM Pipeline',
        steps: journeySteps,
        isDefault: true
      }
    ];
    localStorage.setItem('lms_custom_journeys', JSON.stringify(customJourneys));
    localStorage.setItem('lms_lead_journey', JSON.stringify(journeySteps));

    // Dispatch update events to synchronize lead statuses and journeys
    window.dispatchEvent(new CustomEvent('lms-statuses-updated'));
    window.dispatchEvent(new CustomEvent('lms-journeys-updated'));
    window.dispatchEvent(new CustomEvent('lms-journey-updated'));
  }, [stages]);

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
    if (!draggedItem || draggedItem.id === targetStage.id || targetStage.locked) return

    const draggedIndex = stages.findIndex(s => s.id === draggedItem.id)
    const targetIndex = stages.findIndex(s => s.id === targetStage.id)

    const newStages = [...stages]
    newStages.splice(draggedIndex, 1)
    newStages.splice(targetIndex, 0, draggedItem)

    // Keep locked stages at the end
    const lockedStages = newStages.filter(s => s.locked)
    const activeStages = newStages.filter(s => !s.locked)

    setStages([...activeStages, ...lockedStages])
    setDraggedItem(null)
  }

  const handleAddCustomIndustry = (e) => {
    e.preventDefault()
    const trimmed = newIndustryName.trim()
    if (trimmed) {
      const newId = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '')
      // Check if it already exists
      const exists = industries.find(ind => ind.id === newId)
      if (!exists) {
        const newInd = { id: newId, name: trimmed, icon: 'business', color: '#06b6d4' }
        setIndustries([...industries, newInd])
        setSelectedIndustry(trimmed)
      } else {
        setSelectedIndustry(exists.name)
      }
      setNewIndustryName('')
      setIsAddingIndustry(false)
    }
  }

  const handleAddStage = () => {
    if (newStage.name.trim()) {
      const newId = Math.max(...stages.map(s => s.id), 0) + 1
      const newStages = [...stages]
      const convertedIndex = newStages.findIndex(s => s.locked)
      if (convertedIndex !== -1) {
        newStages.splice(convertedIndex, 0, { id: newId, name: newStage.name, color: newStage.color })
      } else {
        newStages.push({ id: newId, name: newStage.name, color: newStage.color })
      }
      setStages(newStages)
      setNewStage({ name: '', color: '#2563eb' })
      setShowModal(false)
    }
  }

  const colors = [
    '#2563eb', '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
    '#0891b2', '#7c3aed', '#db2777', '#000000', '#64748b'
  ]

  return (
    <div className="initial-config-scope w-full">
      <div className="config-container">
        {/* Industry Selection */}
        <div className="config-section-card">
          <h2 className="config-section-title">
            <span className="material-symbols-outlined mr-2.5 text-primary text-[20px] font-bold">domain</span>
            Industry Alignment
          </h2>
          <p className="config-section-desc">Select your primary industry or define a custom one to load optimized default templates.</p>

          <div className="industry-grid">
            {industries.map((ind) => {
              const isSelected = selectedIndustry === ind.name
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustry(ind.name)}
                  className={isSelected ? 'industry-btn-selected' : 'industry-btn-inactive'}
                >
                  <div
                    className="industry-icon-wrapper"
                    style={{
                      backgroundColor: isSelected ? ind.color : `${ind.color}12`,
                      boxShadow: isSelected ? `0 0 8px ${ind.color}35` : 'none'
                    }}
                  >
                    <span
                      className="material-symbols-outlined industry-icon"
                      style={{
                        color: isSelected ? '#ffffff' : ind.color
                      }}
                    >
                      {ind.icon}
                    </span>
                  </div>
                  <span className="industry-label">
                    {ind.name}
                  </span>

                  {isSelected && (
                    <span className="pulse-dot" />
                  )}
                </button>
              )
            })}

            {/* Inline Custom Industry Input Card */}
            {isAddingIndustry ? (
              <form
                onSubmit={handleAddCustomIndustry}
                className="custom-industry-form"
              >
                <input
                  type="text"
                  autoFocus
                  value={newIndustryName}
                  onChange={(e) => setNewIndustryName(e.target.value)}
                  placeholder="Enter industry..."
                  className="custom-industry-input"
                />
                <div className="action-btn-group">
                  <button
                    type="submit"
                    className="custom-btn-submit"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold leading-none">check</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingIndustry(false)
                      setNewIndustryName('')
                    }}
                    className="custom-btn-cancel"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold leading-none">close</span>
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingIndustry(true)}
                className="btn-add-custom-industry"
              >
                <div className="custom-icon-container">
                  <span className="material-symbols-outlined custom-icon-add">
                    add
                  </span>
                </div>
                <span className="industry-label">
                  Custom
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="pipeline-card-container">
          <div className="pipeline-header">
            <div>
              <h2 className="config-section-title">
                <span className="material-symbols-outlined mr-2.5 text-primary text-[20px] font-bold">view_timeline</span>
                Pipeline Stages
              </h2>
              <p className="pipeline-desc">Define the lifecycle of a lead. Drag and drop stages horizontally to customize the flow.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-pipeline-add"
            >
              <span className="material-symbols-outlined text-[14px] mr-1.5 font-bold">add</span> ADD STAGE
            </button>
          </div>

          <div className="pipeline-track">
            <div className="pipeline-track-inner">
              {stages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  <div
                    draggable={!stage.locked}
                    onDragStart={(e) => handleDragStart(e, stage)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                    className={stage.locked ? 'pipeline-stage-card-locked' : 'pipeline-stage-card'}
                  >
                    {/* Colored absolute left stripe */}
                    <div
                      className="stage-stripe"
                      style={{ backgroundColor: stage.color }}
                    />

                    {/* Top Row: Handle/Lock + Stage Index and Close button */}
                    <div className="stage-header-row">
                      <div className="stage-header-left">
                        {!stage.locked ? (
                          <span className="material-symbols-outlined drag-icon">
                            drag_indicator
                          </span>
                        ) : (
                          <span className="material-symbols-outlined lock-icon">
                            lock
                          </span>
                        )}
                        <span className="stage-number-label">
                          STAGE {idx + 1}
                        </span>
                      </div>

                      {!stage.locked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStage(stage.id);
                          }}
                          className="material-symbols-outlined stage-btn-remove"
                        >
                          close
                        </button>
                      )}
                    </div>

                    {/* Bottom Row: Stage Name */}
                    <div className="stage-content-row">
                      <span className="stage-name-text">
                        {stage.name}
                      </span>
                    </div>
                  </div>

                  {/* Chevron Circle exactly between cards */}
                  {idx < stages.length - 1 && (
                    <div className="pipeline-connector">
                      <span className="material-symbols-outlined pipeline-connector-icon">
                        chevron_right
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Add Stage Trigger Card */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="btn-add-stage-card"
            >
              <div className="add-stage-card-icon-wrapper">
                <span className="material-symbols-outlined add-stage-card-icon">
                  add
                </span>
              </div>
              <span className="add-stage-card-label">
                Add Stage
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Stage Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="modal-title">Add New Stage</h3>
              <p className="modal-subtitle">Customize your pipeline stage block</p>
            </div>

            <div className="space-y-4">
              {/* Stage Name Input */}
              <div>
                <label className="modal-label">Stage Name</label>
                <input
                  type="text"
                  value={newStage.name}
                  onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                  placeholder="e.g., Proposal"
                  className="modal-input"
                  autoFocus
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="modal-label">Stage Color</label>
                <div className="color-picker-grid">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewStage({ ...newStage, color })}
                      className={newStage.color === color ? 'color-dot-selected' : 'color-dot-inactive'}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <label className="modal-label">Live Preview</label>
                <div className="preview-container">
                  <div className="preview-card">
                    <div className="preview-stripe" style={{ backgroundColor: newStage.color }} />
                    <div className="stage-header-left">
                      <span className="material-symbols-outlined drag-icon">drag_indicator</span>
                      <span className="stage-number-label">PREVIEW STAGE</span>
                    </div>
                    <span className="preview-name">
                      {newStage.name || 'Enter a name...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStage}
                  disabled={!newStage.name.trim()}
                  className="btn-modal-submit"
                >
                  Add Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

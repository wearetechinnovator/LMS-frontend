import React, { useState, useEffect } from 'react'
import Icon from '../../../../components/Icon';

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

    const username = localStorage.getItem('username');
    const statusesKey = username ? `lms_custom_statuses_${username}` : 'lms_custom_statuses';
    const journeysKey = username ? `lms_custom_journeys_${username}` : 'lms_custom_journeys';
    const leadJourneyKey = username ? `lms_lead_journey_${username}` : 'lms_lead_journey';

    // Save statuses to localStorage
    localStorage.setItem(statusesKey, JSON.stringify(mappedStatuses));

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
    localStorage.setItem(journeysKey, JSON.stringify(customJourneys));
    localStorage.setItem(leadJourneyKey, JSON.stringify(journeySteps));

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
        {/* Pipeline Stages */}
        <div className="pipeline-card-container">
          <div className="pipeline-header">
            <div>
              <h2 className="config-section-title">
                <Icon name="view_timeline" size={20} className="mr-2.5 text-primary font-bold" />
                Pipeline Stages
              </h2>
              <p className="pipeline-desc">Define the lifecycle of a lead. Drag and drop stages horizontally to customize the flow.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-pipeline-add"
            >
              <Icon name="add" size={14} className="mr-1.5 font-bold" /> ADD STAGE
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
                          <Icon name="drag_indicator" size={16} className="drag-icon" />
                        ) : (
                          <Icon name="lock" size={16} className="lock-icon" />
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
                          className="stage-btn-remove bg-transparent border-0 flex items-center justify-center p-0 cursor-pointer"
                        >
                          <Icon name="close" size={14} />
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
                      <Icon name="chevron_right" size={16} className="pipeline-connector-icon" />
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
                <Icon name="add" size={20} className="add-stage-card-icon" />
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
            <div className="modal-header">
              <h3 className="modal-title">Add New Stage</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="modal-close-btn"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Stage Name Input */}
              <div className="modal-field">
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
              <div className="modal-field">
                <label className="modal-label">Select Color</label>
                <div className="color-swatch-container">
                  {COLOR_PRESETS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewStage({ ...newStage, color })}
                      className={`color-swatch ${newStage.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                    >
                      {newStage.color === color && <Icon name="check" size={12} className="text-white" />}
                    </button>
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
                      <Icon name="drag_indicator" size={16} className="drag-icon" />
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

import React, { useState, useEffect, useRef } from 'react'
import ExportButton from '../ExportButton'
import Toast from '../Toast'
import Icon from '../Icon'

export default function FormBuilderHeader({ handleCreateFromScratch, handleOpenTemplateModal }) {
    const [toastMessage, setToastMessage] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const triggerToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="form-builder-header">
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <div className="form-header-title-block">
                <h1 className="form-header-title">Form Management</h1>
                <p className="form-header-subtitle">Manage lead capture forms and monitor conversion metrics.</p>
            </div>

            <div className="form-header-actions">
                <ExportButton triggerToast={triggerToast} />

                {/* Dropdown Container */}
                <div className="dropdown-container" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="btn-create-form"
                        data-tour="btn-create-form"
                    >
                        <Icon name="add" className="create-icon" size={16} />
                        Create New Form
                        <Icon name="expand_more" className={`caret-icon ${isDropdownOpen ? 'open' : ''}`} size={16} />
                    </button>

                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    handleCreateFromScratch()
                                    setIsDropdownOpen(false)
                                }}
                            >
                                <Icon name="edit_note" className="item-icon text-indigo-500" size={18} />
                                <div className="item-text-container">
                                    <span className="item-title">Create from Scratch</span>
                                    <span className="item-desc">Start with a blank canvas</span>
                                </div>
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    handleOpenTemplateModal()
                                    setIsDropdownOpen(false)
                                }}
                            >
                                <Icon name="grid_view" className="item-icon text-purple-500" size={18} />
                                <div className="item-text-container">
                                    <span className="item-title">Create from Template</span>
                                    <span className="item-desc">Use pre-designed blueprints</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

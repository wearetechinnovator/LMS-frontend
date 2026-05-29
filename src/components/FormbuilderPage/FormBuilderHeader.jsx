import React, { useState, useEffect, useRef } from 'react'
import '../../assets/formbuilderpage/formbuilderpageheader.css'
import ExportButton from '../ExportButton'
import Toast from '../Toast'

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
                    >
                        <span className="material-symbols-outlined create-icon">add</span>
                        Create New Form
                        <span className={`material-symbols-outlined caret-icon ${isDropdownOpen ? 'open' : ''}`}>
                            expand_more
                        </span>
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
                                <span className="material-symbols-outlined item-icon text-indigo-500">edit_note</span>
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
                                <span className="material-symbols-outlined item-icon text-purple-500">grid_view</span>
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

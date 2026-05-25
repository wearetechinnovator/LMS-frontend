import React, { useState } from 'react'
import '../../assets/formbuilderpage/formbuilderpageheader.css'
import ExportButton from '../ExportButton'
import Toast from '../Toast'

export default function FormBuilderHeader({ handleCreateNewForm }) {
    const [toastMessage, setToastMessage] = useState('')
    const [showToast, setShowToast] = useState(false)

    const triggerToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

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

                <button
                    onClick={handleCreateNewForm}
                    className="btn-create-form"
                >
                    <span className="material-symbols-outlined create-icon">add</span>
                    Create New Form
                </button>
            </div>
        </div>
    )
}

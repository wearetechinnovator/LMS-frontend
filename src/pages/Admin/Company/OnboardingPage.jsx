import React, { useState } from 'react'
import CompanyProfile from './steps/CompanyProfile'
import InitialConfig from './steps/InitialConfig'
import '../../../assets/custom.css'

export default function OnboardingPage({ username, onLogout, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [companyData, setCompanyData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    primaryEmail: '',
    supportPhone: '',
    logoFile: null,
    adminUsername: '',
    adminEmail: '',
    adminPassword: ''
  })

  const handleCompanyChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 2 && onComplete) {
      onComplete()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const stepTitles = ['Company Profile', 'Initial Config']
  const stepDescriptions = [
    'Provide basic information about your organization to establish your workspace identity.',
    'Define the core operational parameters for your Lead Management environment.'
  ]

  return (
    <div className="onboarding-wrapper onboarding-page-scope">
      <nav className="onboarding-sidebar">
        <div className="onboarding-sidebar-header">
          <div className="onboarding-sidebar-title">LeadManager Setup</div>
          <div className="onboarding-sidebar-subtitle">Onboarding Progress</div>
        </div>

        <div className="onboarding-sidebar-nav">
          <div
            onClick={() => setCurrentStep(1)}
            className={`onboarding-nav-item ${currentStep === 1 ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined onboarding-nav-icon">business</span>
            <span className="onboarding-nav-text">Company Profile</span>
          </div>

          <div
            onClick={() => setCurrentStep(2)}
            className={`onboarding-nav-item ${currentStep === 2 ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined onboarding-nav-icon" style={{ fontVariationSettings: "'FILL' 1" }}>settings_suggest</span>
            <span className="onboarding-nav-text">Initial Config</span>
          </div>
        </div>

        <div className="onboarding-sidebar-footer">
          <div className="onboarding-progress-bar">
            <div className="onboarding-progress-fill" style={{ width: `${(currentStep / 2) * 100}%` }}></div>
          </div>
          <div className="onboarding-progress-text">STEP {currentStep} OF 2</div>
        </div>
      </nav>

      <main className="onboarding-main">
        <div className="onboarding-header">
          <h1 className="onboarding-title">{stepTitles[currentStep - 1]}</h1>
          <p className="onboarding-description">{stepDescriptions[currentStep - 1]}</p>
        </div>

        <div className="onboarding-content">
          {currentStep === 1 && (
            <CompanyProfile data={companyData} onChange={handleCompanyChange} />
          )}
          {currentStep === 2 && (
            <InitialConfig />
          )}
        </div>

        <div className="onboarding-footer-container">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="onboarding-btn onboarding-btn-prev"
          >
            <span className="material-symbols-outlined btn-icon-left">arrow_back</span>
            Previous
          </button>

          <button
            onClick={handleNextStep}
            className="onboarding-btn onboarding-btn-next"
          >
            {currentStep === 2 ? 'Complete Setup' : 'Next Step'}
            <span className="material-symbols-outlined btn-icon-right">
              {currentStep === 2 ? 'check_circle' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}
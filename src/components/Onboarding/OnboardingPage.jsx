import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CompanyProfile from './steps/CompanyProfile'
import InitialConfig from './steps/InitialConfig'

export default function OnboardingPage({ username, onLogout, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [companyData, setCompanyData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    primaryEmail: '',
    supportPhone: '',
    logoFile: null
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
    <div className="bg-background text-on-background font-body-sm text-body-sm antialiased h-screen flex overflow-hidden">
      {/* SideNavBar */}
      <nav className="w-60 h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-gutter space-y-stack-gap z-10 hidden md:flex">
        <div className="px-gutter mb-6">
          <div className="font-headline-md text-headline-md text-primary font-bold">LeadManager Setup</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Onboarding Progress</div>
        </div>
        <div className="flex-1 overflow-y-auto px-unit space-y-unit">
          {/* Step 1 */}
          <div className={`flex items-center px-cell-padding-h py-cell-padding-v rounded cursor-pointer transition-all duration-200 ${
            currentStep === 1 
              ? 'bg-secondary-container/30 border-l-2 border-primary' 
              : currentStep > 1 
                ? 'text-on-surface-variant hover:bg-surface-container' 
                : 'text-on-surface-variant hover:bg-surface-container'
          }`}>
            <span className="material-symbols-outlined mr-3 text-[18px]">business</span>
            <span className="font-body-md text-body-md">Company Profile</span>
          </div>
          
          {/* Step 2 */}
          <div className={`flex items-center px-cell-padding-h py-cell-padding-v rounded cursor-pointer transition-all duration-200 ${
            currentStep === 2 
              ? 'bg-secondary-container/30 border-l-2 border-primary text-primary font-bold' 
              : currentStep > 2 
                ? 'text-on-surface-variant hover:bg-surface-container' 
                : 'text-on-surface-variant hover:bg-surface-container'
          }`}>
            <span className="material-symbols-outlined mr-3 text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>settings_suggest</span>
            <span className="font-body-md text-body-md">Initial Config</span>
          </div>
        </div>
        
        <div className="p-gutter mt-auto border-t border-outline-variant/50">
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all" style={{width: `${(currentStep / 2) * 100}%`}}></div>
          </div>
          <div className="mt-2 text-right font-label-caps text-label-caps text-on-surface-variant">STEP {currentStep} OF 2</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-60 h-screen overflow-y-auto bg-background p-container-padding flex flex-col">
        {/* Header */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">{stepTitles[currentStep - 1]}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">{stepDescriptions[currentStep - 1]}</p>
        </div>

        {/* Content Canvas - Scrollable */}
        <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto pr-4 flex flex-col">
          {currentStep === 1 && (
            <CompanyProfile data={companyData} onChange={handleCompanyChange} />
          )}
          {currentStep === 2 && (
            <InitialConfig />
          )}
        </div>

        {/* Footer Actions - Fixed */}
        <div className="border-t border-outline-variant/50 pt-6 pb-2 flex justify-between items-center mt-6">
          <button 
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`h-8 px-4 rounded border border-outline-variant text-on-surface font-body-md text-body-md flex items-center transition-colors ${
              currentStep === 1 
                ? 'bg-surface text-on-surface-variant opacity-50 cursor-not-allowed' 
                : 'bg-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] mr-2">arrow_back</span>
            Previous
          </button>
          
          <button 
            onClick={handleNextStep}
            className="h-8 px-6 rounded bg-primary-container text-on-primary font-body-md text-body-md font-bold hover:opacity-90 transition-opacity flex items-center shadow-sm"
          >
            {currentStep === 2 ? 'Complete Setup' : 'Next Step'}
            <span className="material-symbols-outlined text-[18px] ml-2">
              {currentStep === 2 ? 'check_circle' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}

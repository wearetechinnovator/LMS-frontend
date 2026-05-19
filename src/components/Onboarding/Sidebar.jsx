import React from 'react'

export default function Sidebar({ currentStep, setCurrentStep }) {
  const steps = [
    { num: 1, title: 'Company Profile' },
    { num: 2, title: 'Admin Account' },
    { num: 3, title: 'Initial Config' },
  ]

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-300 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="font-semibold text-slate-900 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{fontSize: '16px', lineHeight: '1'}}>domain</span>
          </div>
          LeadPro Setup
        </div>
      </div>

      {/* Steps Navigation */}
      <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-hidden">
        {steps.map(step => {
          const isActive = currentStep === step.num
          const isCompleted = currentStep > step.num
          
          return (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`flex items-center gap-3 p-2 rounded transition-colors min-w-[160px] md:min-w-0 shrink-0 border-b-2 md:border-b-0 md:border-l-2 ${
                isActive
                  ? 'bg-blue-100 border-blue-600 text-blue-700'
                  : 'text-slate-600 border-transparent hover:bg-slate-50'
              }`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center font-semibold text-xs ${
                isCompleted
                  ? 'bg-blue-600 text-white'
                  : isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isCompleted ? (
                  <span className="material-symbols-outlined" style={{fontSize: '16px', lineHeight: '1'}}>check</span>
                ) : (
                  step.num
                )}
              </div>
              <span className="text-sm font-semibold">{step.title}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

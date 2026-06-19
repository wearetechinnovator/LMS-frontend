import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { hasPermission } from './ProtectRoute'
import './InteractiveTour.css'

export default function InteractiveTour({ username }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentStepIdx, setCurrentStepIdx] = useState(-1) // -1 is welcome modal
    const [showTour, setShowTour] = useState(false)
    const [highlightRect, setHighlightRect] = useState(null)
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
    const targetElementRef = useRef(null)

    // Array of walkthrough steps dynamically filtered by permissions
    const steps = useMemo(() => {
        const canDashboard = hasPermission('dashboard')
        const defaultPath = canDashboard ? '/admin/dashboard' : '/admin/leads'
        const list = []

        if (canDashboard) {
            list.push({
                selector: '[data-tour="dashboard-overview"]',
                title: "Interactive Workspace Dashboard",
                description: "Monitor critical indicators like total ingest, source channels, conversion rates, and closed performance in real-time.",
                position: 'bottom',
                path: '/admin/dashboard'
            })
        }

        list.push({
            selector: '[data-tour="sidebar-aside"]',
            title: "Main Sidebar Navigation",
            description: "Quickly access leads database tables, campaign logs, dynamic role settings, audit logs, and settings parameters.",
            position: 'right',
            path: defaultPath
        })

        if (hasPermission('forms_view')) {
            list.push({
                selector: '[data-tour="sidebar-item-form-builder"]',
                title: "Custom Form Builder Navigation",
                description: "Access the form designer module where you can manage lead capture inputs.",
                position: 'right',
                path: defaultPath
            })
            list.push({
                selector: '[data-tour="btn-create-form"]',
                title: "Form Creation Hub",
                description: "Create brand new forms from scratch, or clone pre-designed templates.",
                position: 'bottom',
                path: '/admin/form-builder'
            })
            list.push({
                selector: '[data-tour="field-library"]',
                title: "Drag & Drop Field Library",
                description: "Pick standard inputs (like Names, Emails, Phone, and States/Cities lists) and drag them onto the canvas.",
                position: 'right',
                path: '/admin/form-builder'
            })
            list.push({
                selector: '[data-tour="form-canvas"]',
                title: "Interactive Form Canvas",
                description: "Rearrange form elements visually. Select any element to edit its properties, validation, or delete it.",
                position: 'bottom',
                path: '/admin/form-builder'
            })
            list.push({
                selector: '[data-tour="properties-panel"]',
                title: "Dynamic Properties & Validation",
                description: "Set validation rules, helper descriptions, and customize cascading dependent conditions.",
                position: 'left',
                path: '/admin/form-builder'
            })
        }

        if (hasPermission('leads_view')) {
            list.push({
                selector: '[data-tour="sidebar-item-leads"]',
                title: "Leads Database Log",
                description: "Access the central database. Filter records, update progress stages, assign counselors, and bulk ingest CSV lead dumps.",
                position: 'right',
                path: defaultPath
            })
        }

        list.push({
            selector: '[data-tour="navbar-user"]',
            title: "Profile Settings",
            description: "Adjust your profile details, customize password settings, and upload or select your profile avatar image from your device.",
            position: 'left',
            path: defaultPath
        })

        return list
    }, [])

    // Check if the tour should start
    useEffect(() => {
        const userKey = username || localStorage.getItem('username') || 'guest'
        const tourCompleted = localStorage.getItem(`lms_tour_completed_${userKey}`)
        // Automatically start the tour for new logins
        if (tourCompleted !== 'true') {
            setShowTour(true)
            setCurrentStepIdx(-1) // Start at welcome step
        }
    }, [username])

    // Sync Form Builder editor state with active walkthrough steps
    useEffect(() => {
        if (!showTour || currentStepIdx < 0 || currentStepIdx >= steps.length) return

        const activeStep = steps[currentStepIdx]
        if (!activeStep) return

        if (
            activeStep.selector === '[data-tour="field-library"]' ||
            activeStep.selector === '[data-tour="form-canvas"]' ||
            activeStep.selector === '[data-tour="properties-panel"]'
        ) {
            window.dispatchEvent(new CustomEvent('lms_tour_open_editor'))
        } else {
            window.dispatchEvent(new CustomEvent('lms_tour_close_editor'))
        }
    }, [currentStepIdx, showTour, steps])

    // Track screen resizing to recalculate highlighted box coordinates
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Recalculate target element position whenever step indexes or route changes
    useEffect(() => {
        if (!showTour || currentStepIdx < 0 || currentStepIdx >= steps.length) {
            setHighlightRect(null)
            targetElementRef.current = null
            return
        }

        const step = steps[currentStepIdx]

        // Redirect user to the correct path if they're not on it
        if (step.path && location.pathname !== step.path) {
            navigate(step.path)
            // Wait slightly for route transition/render to locate element
            const timer = setTimeout(updateSpotlightPosition, 300)
            return () => clearTimeout(timer)
        }

        updateSpotlightPosition()

        // Setup observer to watch element bounding rect shifts (collapsing sidebars, etc.)
        const interval = setInterval(updateSpotlightPosition, 400)
        return () => clearInterval(interval)
    }, [currentStepIdx, showTour, windowSize, location.pathname])

    const updateSpotlightPosition = () => {
        if (currentStepIdx < 0 || currentStepIdx >= steps.length) return

        const step = steps[currentStepIdx]
        const element = document.querySelector(step.selector)

        if (element) {
            targetElementRef.current = element
            const rect = element.getBoundingClientRect()
            
            // Cap coordinates to visible viewport window to keep spotlight boundaries sane
            const top = Math.max(0, rect.top)
            const left = Math.max(0, rect.left)
            const bottom = Math.min(window.innerHeight, rect.bottom)
            const right = Math.min(window.innerWidth, rect.right)

            setHighlightRect({
                top,
                left,
                width: Math.max(0, right - left),
                height: Math.max(0, bottom - top),
                right,
                bottom
            })
            // Scroll to the element if it's off-screen
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        } else {
            setHighlightRect(null)
            targetElementRef.current = null
        }
    }

    const handleNext = () => {
        if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStepIdx > -1) {
            setCurrentStepIdx(prev => prev - 1)
        }
    }

    const handleSkip = () => {
        const userKey = username || localStorage.getItem('username') || 'guest'
        localStorage.setItem(`lms_tour_completed_${userKey}`, 'true')
        setShowTour(false)
    }

    const handleComplete = () => {
        const userKey = username || localStorage.getItem('username') || 'guest'
        localStorage.setItem(`lms_tour_completed_${userKey}`, 'true')
        setShowTour(false)
    }

    if (!showTour) return null

    // Determine absolute positioning coordinates for the glassmorphic tooltip card
    const getTooltipStyles = () => {
        if (!highlightRect) {
            // Falls back to center screen
            return {}
        }

        const step = steps[currentStepIdx]
        const position = step.position || 'bottom'
        const offset = 12

        // Tooltip dimensions are 320px width
        const tooltipWidth = 320
        const tooltipHeight = 180 // approximate average height

        let top = 0
        let left = 0

        switch (position) {
            case 'right':
                top = Math.max(16, highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2)
                left = highlightRect.right + offset
                break
            case 'left':
                top = Math.max(16, highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2)
                left = highlightRect.left - tooltipWidth - offset
                break
            case 'top':
                top = highlightRect.top - tooltipHeight - offset
                left = Math.max(16, highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2)
                break
            case 'bottom':
            default:
                top = highlightRect.bottom + offset
                left = Math.max(16, highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2)
                break
        }

        // Apply strict boundaries to keep the tooltip fully visible inside the viewport
        if (top + tooltipHeight > window.innerHeight) {
            top = window.innerHeight - tooltipHeight - 16
        }
        if (top < 16) {
            top = 16
        }
        if (left + tooltipWidth > window.innerWidth) {
            left = window.innerWidth - tooltipWidth - 16
        }
        if (left < 16) {
            left = 16
        }

        return {
            top: `${top}px`,
            left: `${left}px`
        }
    }

    const activeStep = currentStepIdx >= 0 ? steps[currentStepIdx] : null
    const tooltipStyles = getTooltipStyles()

    return (
        <>
            {/* Spotlights Cutout Dark Overlay masks */}
            {highlightRect && (
                <>
                    {/* Top Mask */}
                    <div 
                        className="tour-mask-block" 
                        style={{ top: 0, left: 0, width: '100%', height: `${highlightRect.top}px` }} 
                    />
                    {/* Bottom Mask */}
                    <div 
                        className="tour-mask-block" 
                        style={{ 
                            top: `${highlightRect.bottom}px`, 
                            left: 0, 
                            width: '100%', 
                            height: `${windowSize.height - highlightRect.bottom}px` 
                        }} 
                    />
                    {/* Left Mask */}
                    <div 
                        className="tour-mask-block" 
                        style={{ 
                            top: `${highlightRect.top}px`, 
                            left: 0, 
                            width: `${highlightRect.left}px`, 
                            height: `${highlightRect.height}px` 
                        }} 
                    />
                    {/* Right Mask */}
                    <div 
                        className="tour-mask-block" 
                        style={{ 
                            top: `${highlightRect.top}px`, 
                            left: `${highlightRect.right}px`, 
                            width: `${windowSize.width - highlightRect.right}px`, 
                            height: `${highlightRect.height}px` 
                        }} 
                    />
                    {/* Focus Overlay borders */}
                    <div 
                        className="tour-spotlight-focus" 
                        style={{ 
                            top: `${highlightRect.top - 4}px`, 
                            left: `${highlightRect.left - 4}px`, 
                            width: `${highlightRect.width + 8}px`, 
                            height: `${highlightRect.height + 8}px` 
                        }} 
                    />
                </>
            )}

            {/* General Dark Mask Backdrop if welcome screen is open */}
            {currentStepIdx === -1 && (
                <div 
                    className="tour-mask-block" 
                    style={{ top: 0, left: 0, width: '100%', height: '100%' }} 
                />
            )}

            {/* Glassmorphic dialog card */}
            <div 
                className={`tour-tooltip-container ${!highlightRect ? 'tour-tooltip-center' : ''}`}
                style={tooltipStyles}
            >
                {/* Header */}
                <div className="tour-header">
                    <span className="tour-title">
                        {currentStepIdx === -1 ? "Welcome to LMS Workspace" : activeStep.title}
                    </span>
                    <button className="tour-close-btn" onClick={handleSkip} title="Skip Walkthrough">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                    </button>
                </div>

                {/* Description */}
                <p className="tour-description">
                    {currentStepIdx === -1 
                        ? "Welcome! Let's take a quick interactive walk to orient you around the key modules and management actions."
                        : activeStep.description
                    }
                </p>

                {/* Footer Controls */}
                <div className="tour-footer">
                    {/* Dots indicator */}
                    <div className="tour-steps-dots">
                        {steps.map((_, idx) => (
                            <span 
                                key={idx} 
                                className={`tour-dot ${idx === currentStepIdx ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="tour-actions">
                        {currentStepIdx === -1 ? (
                            <>
                                <button className="tour-btn tour-btn-skip" onClick={handleSkip}>
                                    Skip Tour
                                </button>
                                <button className="tour-btn tour-btn-next" onClick={handleNext}>
                                    Start Tour
                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="tour-btn tour-btn-back" onClick={handleBack}>
                                    Back
                                </button>
                                {currentStepIdx === steps.length - 1 ? (
                                    <button className="tour-btn tour-btn-complete" onClick={handleComplete}>
                                        Finish
                                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                                    </button>
                                ) : (
                                    <button className="tour-btn tour-btn-next" onClick={handleNext}>
                                        Next
                                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

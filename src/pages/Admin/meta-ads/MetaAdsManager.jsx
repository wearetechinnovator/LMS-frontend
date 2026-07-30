import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../../../components/Icon'
import './meta-ads.css'

const toastStyles = "fixed bottom-6 right-6 px-4 py-3 bg-[#0f172a] text-white text-[11px] font-bold rounded-xl shadow-lg flex items-center gap-2 z-[9999] border border-white/5 animate-fadeIn"

const OBJECTIVES = [
    { id: 'awareness', label: 'Awareness', icon: 'campaign', desc: 'Increase brand awareness' },
    { id: 'traffic', label: 'Traffic', icon: 'navigation', desc: 'Drive traffic to your website' },
    { id: 'engagement', label: 'Engagement', icon: 'thumb_up', desc: 'Get more engagement on your content' },
    { id: 'leads', label: 'Leads', icon: 'person_add', desc: 'Generate leads and collect contacts' },
    { id: 'app_promotion', label: 'App Promotion', icon: 'phone_iphone', desc: 'Promote your app installs and activity' },
    { id: 'sales', label: 'Sales', icon: 'shopping_bag', desc: 'Increase sales and conversions' }
]

const CTAS = ['Learn More', 'Sign Up', 'Contact Us', 'Apply Now', 'Book Now', 'Shop Now']

const SHOE_VARIATIONS = [
    { id: 0, name: 'Blue & White Runner', url: '/shoe-blue.png' },
    { id: 1, name: 'White & Black Classic', url: '/shoe-white.png' },
    { id: 2, name: 'Dark Navy Speed', url: '/shoe-dark.png' }
]

export default function MetaAdsManager() {
    // -------------------------------------------------------------
    // State management
    // -------------------------------------------------------------
    const [activeStep, setActiveStep] = useState(1) // 1 = Campaign, 2 = Ad Set, 3 = Ad, 4 = Review
    const [campaign, setCampaign] = useState({
        name: 'New Awareness Campaign',
        objective: 'awareness',
        buyingType: 'Auction',
        specialCategory: 'None',
        budgetOptimization: true,
        budgetType: 'Daily',
        dailyBudget: '50.00',
        lifetimeBudget: '350.00',
        spendingLimit: '500.00'
    })

    const [adSet, setAdSet] = useState({
        conversionLocation: 'website',
        pixel: "Sayan's Pixel",
        optimizationEvent: 'Purchase',
        locations: ['India'],
        locationInput: '',
        ageMin: 18,
        ageMax: 65,
        gender: 'All',
        languages: 'English (All)',
        detailedTargeting: ['React', 'Software Engineer', 'Fitness', 'Gaming'],
        detailedTargetingInput: '',
        customAudience: '',
        lookalikeAudience: '',
        placementType: 'automatic', // 'automatic' | 'manual'
        includedPlacements: ['facebook_feed', 'instagram_feed', 'stories', 'reels', 'marketplace', 'messenger', 'audience_network'],
        budgetType: 'Daily',
        dailyBudget: '50.00',
        lifetimeBudget: '350.00',
        startDate: '2025-05-22',
        startTime: '10:45 AM',
        setEndDate: true,
        endDate: '2025-06-22',
        endTime: '10:45 AM',
        optimizationForAdDelivery: 'Conversions',
        bidStrategy: 'Lowest cost',
        attributionSetting: '7-day click or 1-day view'
    })

    const [adCreative, setAdCreative] = useState({
        facebookPage: 'Poweva Store',
        instagramAccount: '@poweva.store',
        format: 'single_image', // 'single_image' | 'video' | 'carousel' | 'collection' | 'flexible'
        primaryText: 'Discover our new collection designed for performance and style.',
        headline: 'Elevate Your Performance',
        description: 'High quality • Best Price',
        cta: 'Learn More',
        websiteUrl: 'https://poweva.com/collection'
    })

    const [selectedVariation, setSelectedVariation] = useState(0)
    const [activePlatform, setActivePlatform] = useState('facebook') // 'facebook' | 'instagram' | 'stories' | 'reels'
    const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'structure'
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishProgress, setPublishProgress] = useState(0)

    const triggerToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleSaveDraft = () => {
        triggerToast("Draft saved successfully!")
    }

    const handlePublish = () => {
        setIsPublishing(true)
        setPublishProgress(0)

        const interval = setInterval(() => {
            setPublishProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 20
            })
        }, 300)
    }

    // Diagnostics / completion check
    const isNameValid = campaign.name.trim().length > 0
    const isObjectiveValid = !!campaign.objective
    const isBuyingTypeValid = !!campaign.buyingType
    const isBudgetValid = !campaign.budgetOptimization || (campaign.budgetType === 'Daily' ? Number(campaign.dailyBudget) > 0 : Number(campaign.lifetimeBudget) > 0)

    const getCompletionPercentage = () => {
        let pct = 0
        if (isNameValid) pct += 20
        if (isObjectiveValid) pct += 20
        if (isBuyingTypeValid) pct += 20
        if (isBudgetValid) pct += 40
        return pct
    }

    const completionPct = getCompletionPercentage()

    return (
        <div className="meta-ads-workspace w-full h-[calc(100vh-44px)] flex flex-col overflow-hidden text-slate-800 select-none bg-[#f8fafc]">

            {/* ── STEPPER / HEADER BAR ── */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                {/* Logo or placeholder to push stepper to center */}
                <div className="w-[150px]">
                    <span className="text-[11px] font-black tracking-wider uppercase text-blue-600 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]!">ads_click</span>
                        Ads Manager
                    </span>
                </div>

                {/* Central Stepper */}
                <div className="flex items-center gap-6">
                    {[
                        { step: 1, label: 'Campaign' },
                        { step: 2, label: 'Ad Set' },
                        { step: 3, label: 'Ad' },
                        { step: 4, label: 'Review' }
                    ].map((item, idx) => (
                        <React.Fragment key={item.step}>
                            <button
                                onClick={() => {
                                    setActiveStep(item.step)
                                    triggerToast(`Switched to ${item.label} configuration view.`)
                                }}
                                className="flex items-center gap-2 focus:outline-none transition-colors group cursor-pointer"
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${activeStep === item.step
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                    : activeStep > item.step
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                    }`}>
                                    {item.step}
                                </div>
                                <span className={`text-[11px] font-extrabold transition-colors ${activeStep === item.step
                                    ? 'text-blue-600'
                                    : 'text-slate-400 group-hover:text-slate-600'
                                    }`}>
                                    {item.label}
                                </span>
                            </button>
                            {idx < 3 && <div className="w-8 h-[1px] bg-slate-200" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3 w-[220px] justify-end">
                    <button
                        onClick={handleSaveDraft}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                    >
                        {activeStep === 4 ? 'Publish Campaign' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* ── THREE COLUMN WORKSPACE ── */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* ── COLUMN 1: CONFIGURATION FORM (LEFT) ── */}
                <div className="flex-1 bg-white border-r border-slate-200 overflow-y-auto p-8 text-left meta-scroll">
                    {activeStep === 1 ? (
                        <div className="max-w-[580px] mx-auto space-y-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Campaign</h2>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Define your campaign objective and budget.</p>
                            </div>

                            {/* Field 1: Campaign Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700">Campaign Name</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={campaign.name}
                                        onChange={e => setCampaign({ ...campaign, name: e.target.value.slice(0, 100) })}
                                        className="w-full h-10 pl-3 pr-16 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none"
                                    />
                                    <span className="absolute right-4 text-[10px] font-bold text-slate-400">
                                        {campaign.name.length}/100
                                    </span>
                                </div>
                            </div>

                            {/* Field 2: Objective Card Grid */}
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 block">Objective</label>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-normal">Choose the objective that best aligns with your business goals.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {OBJECTIVES.map(obj => {
                                        const isSelected = campaign.objective === obj.id
                                        return (
                                            <button
                                                key={obj.id}
                                                onClick={() => setCampaign({ ...campaign, objective: obj.id })}
                                                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col gap-2.5 cursor-pointer ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 shadow-[0_2px_8px_rgba(0,102,254,0.04)]'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/30'
                                                    }`}
                                            >
                                                {/* Selection checkmark bubble */}
                                                {isSelected && (
                                                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                                        <span className="material-symbols-outlined text-[10px]! font-bold">check</span>
                                                    </div>
                                                )}

                                                <span className={`material-symbols-outlined text-[20px]! ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                                    {obj.icon}
                                                </span>

                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-800 block leading-none">{obj.label}</span>
                                                    <span className="text-[9.5px] text-slate-400 font-normal mt-1 block leading-snug">
                                                        {obj.desc}
                                                    </span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Field 3: Buying Type & Special Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-700">Buying Type</label>
                                    <select
                                        value={campaign.buyingType}
                                        onChange={e => setCampaign({ ...campaign, buyingType: e.target.value })}
                                        className="w-full h-10 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                    >
                                        <option value="Auction">Auction</option>
                                        <option value="Reservation">Reservation</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-1">
                                        <label className="text-xs font-semibold text-slate-700">Special Category</label>
                                        <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer hover:text-slate-600" title="More information">info</span>
                                    </div>
                                    <select
                                        value={campaign.specialCategory}
                                        onChange={e => setCampaign({ ...campaign, specialCategory: e.target.value })}
                                        className="w-full h-10 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                    >
                                        <option value="None">None</option>
                                        <option value="Housing">Housing</option>
                                        <option value="Employment">Employment</option>
                                        <option value="Credit">Credit</option>
                                    </select>
                                </div>
                            </div>

                            {/* Field 4: Campaign Budget Optimization Toggle & Inline budget row */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-extrabold text-slate-900 block">Campaign Budget Optimization</span>
                                        <span className="text-[9.5px] text-slate-400 font-medium block">Optimize budget across ad sets for better performance.</span>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        type="button"
                                        onClick={() => setCampaign({ ...campaign, budgetOptimization: !campaign.budgetOptimization })}
                                        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${campaign.budgetOptimization ? 'bg-blue-600' : 'bg-slate-200'
                                            }`}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-200 ${campaign.budgetOptimization ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {campaign.budgetOptimization && (
                                    <div className="flex items-center gap-6 flex-wrap">
                                        {/* Daily Budget */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                checked={campaign.budgetType === 'Daily'}
                                                onChange={() => setCampaign({ ...campaign, budgetType: 'Daily' })}
                                                className="accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                                            />
                                            <span className="text-[11px] font-bold text-slate-700">Daily Budget</span>
                                            <span className="text-[10px] font-bold text-slate-400">$</span>
                                            <input
                                                type="number"
                                                value={campaign.dailyBudget}
                                                disabled={campaign.budgetType !== 'Daily'}
                                                onChange={e => setCampaign({ ...campaign, dailyBudget: e.target.value })}
                                                className="w-16 h-7 text-right px-1.5 border border-slate-200 rounded-lg text-[11px] font-extrabold text-slate-800 disabled:opacity-40 outline-none"
                                            />
                                            <span className="text-[9.5px] font-bold text-slate-400">USD</span>
                                        </label>

                                        {/* Lifetime Budget */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                checked={campaign.budgetType === 'Lifetime'}
                                                onChange={() => setCampaign({ ...campaign, budgetType: 'Lifetime' })}
                                                className="accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                                            />
                                            <span className="text-[11px] font-bold text-slate-700">Lifetime Budget</span>
                                            <span className="text-[10px] font-bold text-slate-400">$</span>
                                            <input
                                                type="number"
                                                value={campaign.lifetimeBudget}
                                                disabled={campaign.budgetType !== 'Lifetime'}
                                                onChange={e => setCampaign({ ...campaign, lifetimeBudget: e.target.value })}
                                                className="w-16 h-7 text-right px-1.5 border border-slate-200 rounded-lg text-[11px] font-extrabold text-slate-800 disabled:opacity-40 outline-none"
                                            />
                                            <span className="text-[9.5px] font-bold text-slate-400">USD</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Field 5: Campaign Spending Limit */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700">Campaign Spending Limit · <span className="font-normal text-slate-400">Optional</span></label>
                                <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-white">
                                    <span className="text-[11px] font-bold text-slate-400">$</span>
                                    <input
                                        type="number"
                                        value={campaign.spendingLimit}
                                        onChange={e => setCampaign({ ...campaign, spendingLimit: e.target.value })}
                                        className="flex-1 h-6 px-1 text-slate-800 text-[11px] font-extrabold outline-none"
                                    />
                                    <span className="text-[9.5px] font-bold text-slate-400">USD</span>
                                </div>
                                <p className="text-[9.5px] text-slate-400 font-medium">We won't spend more than this amount.</p>
                            </div>

                            {/* Field 6: Advanced Settings Accordion */}
                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                                <button
                                    type="button"
                                    onClick={() => setAdvancedOpen(!advancedOpen)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors focus:outline-none cursor-pointer"
                                >
                                    <span className="text-xs font-extrabold text-slate-800">Advanced Settings</span>
                                    <span className={`material-symbols-outlined text-[18px]! text-slate-400 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {advancedOpen && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden border-t border-slate-100"
                                        >
                                            <div className="p-4 space-y-3.5 text-xs text-slate-600 bg-slate-50/30">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-slate-400">Bid Strategy</span>
                                                    <span className="font-extrabold text-slate-700">Lowest Cost (Default)</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-slate-400">Scheduling</span>
                                                    <span className="font-extrabold text-slate-700">Run continuously starting today</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-slate-400">Frequency Cap</span>
                                                    <span className="font-extrabold text-slate-700">Default (Uncapped)</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : activeStep === 2 ? (
                        <div className="max-w-[580px] mx-auto space-y-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Ad Set</h2>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Configure target audience, optimization goals, and placements.</p>
                            </div>

                            {/* Section 1: Conversion Location */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">1</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Conversion Location</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Choose where you want to drive results.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                    {[
                                        { id: 'website', label: 'Website', icon: 'language' },
                                        { id: 'app', label: 'App', icon: 'phone_iphone' },
                                        { id: 'messenger', label: 'Messenger', icon: 'chat' },
                                        { id: 'whatsapp', label: 'WhatsApp', icon: 'chat_bubble' },
                                        { id: 'calls', label: 'Phone Calls', icon: 'call' },
                                        { id: 'instagram', label: 'Instagram', icon: 'photo_camera' }
                                    ].map(loc => {
                                        const isSelected = adSet.conversionLocation === loc.id
                                        return (
                                            <button
                                                key={loc.id}
                                                onClick={() => setAdSet({ ...adSet, conversionLocation: loc.id })}
                                                className={`p-3 rounded-xl border text-center transition-all relative flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[72px] ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500 shadow-[0_1px_6px_rgba(37,99,235,0.03)]'
                                                    : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                                        <span className="material-symbols-outlined text-[8px]! font-bold">check</span>
                                                    </div>
                                                )}
                                                <span className={`material-symbols-outlined text-[18px]! ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                                    {loc.icon}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-700 block leading-tight">{loc.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Section 2: Pixel & Optimization */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">2</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Pixel & Optimization</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Select pixel and optimization event.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Pixel</label>
                                        <select
                                            value={adSet.pixel}
                                            onChange={e => setAdSet({ ...adSet, pixel: e.target.value })}
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                        >
                                            <option value="Sayan's Pixel">Sayan's Pixel</option>
                                            <option value="Secondary Pixel">Secondary Pixel</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Optimization Event</label>
                                        <select
                                            value={adSet.optimizationEvent}
                                            onChange={e => setAdSet({ ...adSet, optimizationEvent: e.target.value })}
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                        >
                                            <option value="Purchase">Purchase</option>
                                            <option value="Lead">Lead</option>
                                            <option value="AddToCart">Add to Cart</option>
                                            <option value="PageView">Page View</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Audience */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">3</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Audience</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Define who you want to reach.</p>
                                    </div>
                                </div>

                                <div className="space-y-3.5">
                                    {/* Locations */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Locations</label>
                                        <select className="w-full h-9 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 bg-white mb-2 outline-none cursor-pointer">
                                            <option>People living in or recently in this location</option>
                                            <option>People living in this location</option>
                                            <option>People recently in this location</option>
                                        </select>

                                        {/* Tag Container */}
                                        <div className="flex items-center gap-1.5 flex-wrap p-2 border border-slate-200 rounded-xl bg-slate-50/50">
                                            {adSet.locations.map(loc => (
                                                <div key={loc} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700 rounded-lg shadow-xs">
                                                    <span>{loc}</span>
                                                    <button
                                                        onClick={() => setAdSet({ ...adSet, locations: adSet.locations.filter(l => l !== loc) })}
                                                        className="hover:text-red-500 cursor-pointer"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black rounded-lg uppercase">
                                                +2 more
                                            </div>
                                        </div>
                                    </div>

                                    {/* Age range */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                                            <span>Age</span>
                                            <span className="font-extrabold text-slate-800">{adSet.ageMin} - {adSet.ageMax}+</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="13"
                                                max="65"
                                                value={adSet.ageMin}
                                                onChange={e => setAdSet({ ...adSet, ageMin: parseInt(e.target.value) })}
                                                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Gender</label>
                                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                                            {['All', 'Men', 'Women'].map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => setAdSet({ ...adSet, gender: g })}
                                                    className={`py-1.5 rounded-lg text-[10.5px] font-extrabold text-center transition-all cursor-pointer ${adSet.gender === g
                                                        ? 'bg-white text-blue-600 shadow-xs'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Languages</label>
                                        <select
                                            value={adSet.languages}
                                            onChange={e => setAdSet({ ...adSet, languages: e.target.value })}
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                        >
                                            <option value="English (All)">English (All)</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="Hindi">Hindi</option>
                                        </select>
                                    </div>

                                    {/* Detailed Targeting */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Detailed Targeting</label>
                                        <div className="flex items-center gap-1.5 flex-wrap p-2.5 border border-slate-200 rounded-xl bg-slate-50/50">
                                            {adSet.detailedTargeting.map(tag => (
                                                <div key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700 rounded-lg shadow-xs">
                                                    <span>{tag}</span>
                                                    <button
                                                        onClick={() => setAdSet({ ...adSet, detailedTargeting: adSet.detailedTargeting.filter(t => t !== tag) })}
                                                        className="hover:text-red-500 cursor-pointer"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Placements */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">4</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Placements</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Show your ads where they'll perform best.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setAdSet({ ...adSet, placementType: 'automatic' })}
                                        className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col gap-1.5 cursor-pointer ${adSet.placementType === 'automatic'
                                            ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                                            }`}
                                    >
                                        {adSet.placementType === 'automatic' && (
                                            <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                                <span className="material-symbols-outlined text-[8px]! font-bold">check</span>
                                            </div>
                                        )}
                                        <span className="text-[10.5px] font-bold text-slate-800 leading-none">Automatic Placements</span>
                                        <span className="text-[9px] text-slate-400 font-medium leading-snug">Let our algorithm show your ads in the best performing placements.</span>
                                    </button>

                                    <button
                                        onClick={() => setAdSet({ ...adSet, placementType: 'manual' })}
                                        className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col gap-1.5 cursor-pointer ${adSet.placementType === 'manual'
                                            ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                                            }`}
                                    >
                                        {adSet.placementType === 'manual' && (
                                            <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                                <span className="material-symbols-outlined text-[8px]! font-bold">check</span>
                                            </div>
                                        )}
                                        <span className="text-[10.5px] font-bold text-slate-800 leading-none">Manual Placements</span>
                                        <span className="text-[9px] text-slate-400 font-medium leading-snug">Choose specific places to show your ads.</span>
                                    </button>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Included Placements</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'facebook_feed', label: 'Facebook Feed' },
                                            { id: 'instagram_feed', label: 'Instagram Feed' },
                                            { id: 'stories', label: 'Stories' },
                                            { id: 'reels', label: 'Reels' },
                                            { id: 'marketplace', label: 'Marketplace' },
                                            { id: 'messenger', label: 'Messenger' },
                                            { id: 'audience_network', label: 'Audience Network' }
                                        ].map(item => {
                                            const isChecked = adSet.includedPlacements.includes(item.id)
                                            return (
                                                <label key={item.id} className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50/50 hover:bg-slate-50 rounded-lg border border-slate-200/50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            const newPlacements = isChecked
                                                                ? adSet.includedPlacements.filter(p => p !== item.id)
                                                                : [...adSet.includedPlacements, item.id]
                                                            setAdSet({ ...adSet, includedPlacements: newPlacements })
                                                        }}
                                                        className="accent-blue-600 w-3.5 h-3.5 rounded cursor-pointer"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeStep === 3 ? (
                        <div className="max-w-[580px] mx-auto space-y-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Ad Creative</h2>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Build your ad by selecting identity, format, media and content.</p>
                            </div>

                            {/* Section 1: Identity */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">1</div>
                                        <div className="space-y-0.5">
                                            <h3 className="text-xs font-bold text-slate-800 leading-tight">Identity</h3>
                                            <p className="text-[10px] text-slate-400 leading-tight font-medium">Choose the account and identity to promote your ad.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => triggerToast("Manage Identities panel opened.")} className="text-[10px] font-black text-blue-600 hover:underline cursor-pointer">
                                        Manage Identities
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Facebook Page</label>
                                        <div className="relative">
                                            <select
                                                value={adCreative.facebookPage}
                                                onChange={e => setAdCreative({ ...adCreative, facebookPage: e.target.value })}
                                                className="w-full h-9 pl-8 pr-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                            >
                                                <option value="Poweva Store">Poweva Store</option>
                                                <option value="Secondary Page">Secondary Page</option>
                                            </select>
                                            <span className="material-symbols-outlined text-[14px] text-blue-600 absolute left-2.5 top-1/2 -translate-y-1/2">facebook</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Instagram Account</label>
                                        <div className="relative">
                                            <select
                                                value={adCreative.instagramAccount}
                                                onChange={e => setAdCreative({ ...adCreative, instagramAccount: e.target.value })}
                                                className="w-full h-9 pl-8 pr-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                            >
                                                <option value="@poweva.store">@poweva.store</option>
                                                <option value="@secondary.store">@secondary.store</option>
                                            </select>
                                            <span className="material-symbols-outlined text-[14px] text-pink-500 absolute left-2.5 top-1/2 -translate-y-1/2">photo_camera</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Ad Format */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">2</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Ad Format</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Choose how you want your ad to look.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    {[
                                        { id: 'single_image', label: 'Single Image', desc: 'One image for your ad', icon: 'image' },
                                        { id: 'video', label: 'Video', desc: 'Tell your story with video', icon: 'play_circle' },
                                        { id: 'carousel', label: 'Carousel', desc: '2 or more scrollable images', icon: 'view_carousel' },
                                        { id: 'collection', label: 'Collection', desc: 'Group of items to browse', icon: 'layers' },
                                        { id: 'flexible', label: 'Flexible', desc: 'Automatically optimized', icon: 'auto_awesome' }
                                    ].map(fmt => {
                                        const isSelected = adCreative.format === fmt.id
                                        return (
                                            <button
                                                key={fmt.id}
                                                onClick={() => setAdCreative({ ...adCreative, format: fmt.id })}
                                                className={`p-2.5 rounded-xl border text-center transition-all relative flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[82px] ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500'
                                                    : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                                                    }`}
                                            >
                                                <span className={`material-symbols-outlined text-[16px]! ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                                    {fmt.icon}
                                                </span>
                                                <span className="text-[9.5px] font-black text-slate-800 block leading-tight">{fmt.label}</span>
                                                <span className="text-[7.5px] text-slate-400 block leading-tight font-normal">{fmt.desc}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Section 3: Media */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">3</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Media</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Add the media for your ad.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Dropzone */}
                                    <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/30 space-y-3 min-h-[120px]">
                                        <span className="material-symbols-outlined text-[20px] text-slate-300">cloud_upload</span>
                                        <span className="text-[9.5px] font-bold text-slate-500">Drag and drop image here</span>
                                        <span className="text-[8.5px] text-slate-400">or</span>
                                        <button onClick={() => triggerToast("File uploader dialog opened.")} className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[9.5px] font-black text-slate-700 shadow-sm cursor-pointer">
                                            Upload Image
                                        </button>
                                    </div>

                                    {/* Preview container */}
                                    <div className="border border-slate-150 rounded-xl overflow-hidden relative aspect-[4/3] bg-slate-50 flex items-center justify-center min-h-[120px]">
                                        <img
                                            src={SHOE_VARIATIONS[selectedVariation].url}
                                            alt="Preview shoe"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-2 right-2 flex gap-1.5">
                                            <button onClick={() => triggerToast("Refreshing image variant")} className="w-6 h-6 rounded-lg bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-white hover:scale-105 cursor-pointer">
                                                <span className="material-symbols-outlined text-[12px] text-slate-600 font-black">refresh</span>
                                            </button>
                                            <button onClick={() => triggerToast("Clearing selected media")} className="w-6 h-6 rounded-lg bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-white hover:text-red-500 hover:scale-105 cursor-pointer">
                                                <span className="material-symbols-outlined text-[12px] text-slate-600 font-black">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-semibold">
                                    <span className="material-symbols-outlined text-[13px]! text-emerald-500">check_circle</span>
                                    <span>Recommended: 1080 x 1080px (1:1)</span>
                                </div>
                            </div>

                            {/* Section 4 & 5 Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold flex items-center justify-center">4</span>
                                            <span>Primary Text</span>
                                        </div>
                                        <span>{adCreative.primaryText.length}/125</span>
                                    </div>
                                    <textarea
                                        value={adCreative.primaryText}
                                        onChange={e => setAdCreative({ ...adCreative, primaryText: e.target.value.slice(0, 125) })}
                                        className="w-full h-16 p-2 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-850 outline-none resize-none"
                                        placeholder="Tell people what your ad is about..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold flex items-center justify-center">5</span>
                                            <span>Headline</span>
                                        </div>
                                        <span>{adCreative.headline.length}/40</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={adCreative.headline}
                                        onChange={e => setAdCreative({ ...adCreative, headline: e.target.value.slice(0, 40) })}
                                        className="w-full h-9 px-2 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-850 outline-none"
                                        placeholder="Grab attention with a short headline..."
                                    />
                                </div>
                            </div>

                            {/* Section 6 & 7 Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold flex items-center justify-center">6</span>
                                            <span>Description · Optional</span>
                                        </div>
                                        <span>{adCreative.description.length}/30</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={adCreative.description}
                                        onChange={e => setAdCreative({ ...adCreative, description: e.target.value.slice(0, 30) })}
                                        className="w-full h-9 px-2 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-850 outline-none"
                                        placeholder="Add more details..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold flex items-center justify-center">7</span>
                                        <span>Call To Action</span>
                                    </div>
                                    <select
                                        value={adCreative.cta}
                                        onChange={e => setAdCreative({ ...adCreative, cta: e.target.value })}
                                        className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 outline-none bg-white cursor-pointer"
                                    >
                                        <option value="Learn More">Learn More</option>
                                        <option value="Shop Now">Shop Now</option>
                                        <option value="Sign Up">Sign Up</option>
                                        <option value="Book Now">Book Now</option>
                                        <option value="Apply Now">Apply Now</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section 8 & 9 Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold flex items-center justify-center">8</span>
                                        <span>Website URL</span>
                                    </div>
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={adCreative.websiteUrl}
                                            onChange={e => setAdCreative({ ...adCreative, websiteUrl: e.target.value })}
                                            className="w-full h-9 pl-3 pr-8 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-850 outline-none"
                                            placeholder="Where do you want to send people?"
                                        />
                                        <span className="material-symbols-outlined text-[13px]! text-emerald-500 absolute right-2.5 font-bold">check</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold flex items-center justify-center">9</span>
                                        <span>Tracking</span>
                                    </div>
                                    <button
                                        onClick={() => triggerToast("UTM Parameter Builder dialog opened.")}
                                        className="w-full h-9 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-750 flex items-center justify-center gap-1 bg-white shadow-xs cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[13px]! font-black">link</span>
                                        UTM Builder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : activeStep === 4 ? (
                        <div className="max-w-[760px] mx-auto space-y-6 animate-fadeIn">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Review Your Campaign</h2>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">Please review all settings before publishing your campaign.</p>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black rounded-lg inline-flex items-center gap-1 uppercase select-none">
                                        All good to go! 🎉
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 mt-0.5">No issues found</div>
                                </div>
                            </div>

                            {/* Section 1: Campaign Review Card */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[15px]! font-black">campaign</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Campaign</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveStep(1)
                                            triggerToast("Navigating to Campaign Details.")
                                        }}
                                        className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-[10px] font-black text-slate-650 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-[10.5px] pt-2 border-t border-slate-100/50">
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Campaign Name</span>
                                        <span className="font-extrabold text-slate-800 block truncate max-w-[200px]">{campaign.name || 'Untitled'}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Objective</span>
                                        <span className="font-extrabold text-slate-800 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]! text-blue-500 font-bold">
                                                {OBJECTIVES.find(o => o.id === campaign.objective)?.icon || 'campaign'}
                                            </span>
                                            {OBJECTIVES.find(o => o.id === campaign.objective)?.label || 'Awareness'}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Buying Type</span>
                                        <span className="font-extrabold text-slate-800 block">Auction</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Budget</span>
                                        <span className="font-extrabold text-slate-800 block">
                                            ${campaign.budgetType === 'Daily' ? `${campaign.dailyBudget} Daily` : `${campaign.lifetimeBudget} Lifetime`}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Campaign Budget Optimization</span>
                                        <span className="font-extrabold text-slate-800 block">{campaign.budgetOptimization ? 'On' : 'Off'}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Campaign Spending Limit</span>
                                        <span className="font-extrabold text-slate-800 block">${campaign.spendingLimit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Ad Set Review Card */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[15px]! font-black">layers</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Ad Set</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveStep(2)
                                            triggerToast("Navigating to Ad Set Details.")
                                        }}
                                        className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-[10px] font-black text-slate-650 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-[10.5px] pt-2 border-t border-slate-100/50">
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Conversion Location</span>
                                        <span className="font-extrabold text-slate-800 block capitalize">{adSet.conversionLocation}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Pixel</span>
                                        <span className="font-extrabold text-slate-850 flex items-center gap-1.5">
                                            {adSet.pixel}
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Optimization Event</span>
                                        <span className="font-extrabold text-slate-800 block">{adSet.optimizationEvent}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Audience</span>
                                        <span className="font-extrabold text-slate-800 block whitespace-pre-line leading-relaxed">
                                            {adSet.locations.join(', ')}
                                            {`\n${adSet.ageMin} - ${adSet.ageMax}+`}
                                            {`\n${adSet.gender} Genders`}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Placements</span>
                                        <span className="font-extrabold text-slate-800 block">
                                            {adSet.placementType === 'automatic' ? 'Automatic Placements' : 'Manual Placements'}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Budget</span>
                                        <span className="font-extrabold text-slate-800 block">
                                            ${adSet.budgetType === 'Daily' ? `${adSet.dailyBudget} Daily` : `${adSet.lifetimeBudget} Lifetime`}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Schedule</span>
                                        <span className="font-extrabold text-slate-800 block">May 22, 2025 – Jun 22, 2025</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Bid Strategy</span>
                                        <span className="font-extrabold text-slate-800 block">{adSet.bidStrategy}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-400 block">Attribution Setting</span>
                                        <span className="font-extrabold text-slate-800 block">{adSet.attributionSetting}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Ad Review Card */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[15px]! font-black">image</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Ad</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveStep(3)
                                            triggerToast("Navigating to Ad Creative details.")
                                        }}
                                        className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-[10px] font-black text-slate-650 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="flex gap-5 pt-2 border-t border-slate-100/50">
                                    {/* Thumbnail Preview */}
                                    <div className="w-24 h-24 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                                        <img
                                            src={SHOE_VARIATIONS[selectedVariation].url}
                                            alt="Preview shoe"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Ad Specs */}
                                    <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-[10.5px] flex-1">
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Identity</span>
                                            <span className="font-extrabold text-slate-800 block whitespace-pre-line leading-snug">
                                                {adCreative.facebookPage}
                                                {`\n${adCreative.instagramAccount}`}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Ad Format</span>
                                            <span className="font-extrabold text-slate-800 block">
                                                {adCreative.format.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Primary Text</span>
                                            <span className="font-extrabold text-slate-800 block truncate max-w-[150px]" title={adCreative.primaryText}>
                                                {adCreative.primaryText}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Headline</span>
                                            <span className="font-extrabold text-slate-800 block truncate max-w-[150px]" title={adCreative.headline}>
                                                {adCreative.headline}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Call To Action</span>
                                            <span className="font-extrabold text-slate-800 block">{adCreative.cta}</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Website URL</span>
                                            <span className="font-extrabold text-slate-800 block truncate max-w-[150px]" title={adCreative.websiteUrl}>
                                                {adCreative.websiteUrl}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Tracking</span>
                                            <span className="font-extrabold text-slate-800 block">UTM Builder Enabled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Validation Checklist */}
                            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left flex gap-6 font-semibold">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Validation Checklist</h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">We've reviewed your campaign and everything looks good.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {[
                                            'Campaign name is set',
                                            'Budget is set',
                                            'Ad creative is added',
                                            'Call to action is added',
                                            'Objective is selected',
                                            'Ad set audience is defined',
                                            'Primary text is added',
                                            'Tracking is configured',
                                            'Buying type is set',
                                            'Placements are selected'
                                        ].map(item => (
                                            <div key={item} className="flex items-center gap-2 text-[10.5px] font-bold text-slate-650">
                                                <span className="material-symbols-outlined text-[13px]! text-emerald-500 font-bold">check_circle</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-[180px] border-l border-slate-100 pl-6 flex flex-col items-center justify-center text-center space-y-2 shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                                        <span className="material-symbols-outlined text-[20px]! font-black">check</span>
                                    </div>
                                    <span className="text-[10.5px] font-black text-slate-850">You're all set!</span>
                                    <p className="text-[9px] text-slate-450 leading-relaxed max-w-[130px] font-medium">Your campaign is ready to be published.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-[580px] mx-auto py-12 text-center text-slate-400">
                            Coming soon
                        </div>
                    )}
                </div>

                {/* ── COLUMN 2: SUMMARY & RESULTS PANEL (MIDDLE) ── */}
                {activeStep !== 4 && (
                    <div className={`${activeStep === 3 ? 'w-[380px] bg-slate-50' : 'w-[300px] bg-white'} border-r border-slate-200 p-6 overflow-y-auto space-y-6 shrink-0 text-left meta-scroll font-medium`}>

                    {activeStep === 1 ? (
                        <>
                            {/* Card 1: Campaign Summary */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11.5px] font-black text-slate-900 tracking-tight">Campaign Summary</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black rounded-full uppercase">
                                        All good
                                    </span>
                                </div>

                                <div className="p-4 border border-slate-100 rounded-2xl space-y-3.5 text-[11px] bg-slate-50/20">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Campaign Name</span>
                                        <span className="font-extrabold text-slate-800 truncate max-w-[120px]">{campaign.name || 'Untitled'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-400">Objective</span>
                                        <span className="font-extrabold text-slate-800 flex items-center gap-1 text-[10.5px]">
                                            <span className="material-symbols-outlined text-[13px]! text-blue-500 font-bold">
                                                {OBJECTIVES.find(o => o.id === campaign.objective)?.icon || 'campaign'}
                                            </span>
                                            {OBJECTIVES.find(o => o.id === campaign.objective)?.label || 'Awareness'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Buying Type</span>
                                        <span className="font-extrabold text-slate-800">{campaign.buyingType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Budget</span>
                                        <span className="font-extrabold text-slate-800">
                                            ${campaign.budgetOptimization
                                                ? (campaign.budgetType === 'Daily' ? `${campaign.dailyBudget} Daily` : `${campaign.lifetimeBudget} Lifetime`)
                                                : 'Ad Set Configured'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-400">Status</span>
                                        <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            Draft
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Structure Preview */}
                            <div className="space-y-3">
                                <span className="text-[11.5px] font-black text-slate-900 tracking-tight block">Structure Preview</span>
                                <div className="p-4 border border-slate-100 rounded-2xl space-y-2 bg-slate-50/20">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800">
                                            <span className="material-symbols-outlined text-[14px]! text-blue-500">folder</span>
                                            Campaign
                                        </div>
                                        <div className="text-[9.5px] text-slate-400 font-bold pl-5 truncate max-w-[200px]">
                                            {campaign.name || 'Untitled Campaign'}
                                        </div>
                                    </div>

                                    <div className="pl-4 flex items-center gap-1 text-[11px] font-extrabold text-slate-400">
                                        <span className="text-slate-300 font-normal">└─</span>
                                        <span className="material-symbols-outlined text-[14px]!">grid_view</span>
                                        0 Ad Sets
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Estimated Results */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[11.5px] font-black text-slate-900 tracking-tight">
                                        Estimated Results
                                        <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer hover:text-slate-600" title="Calculated estimates">info</span>
                                    </div>
                                    <select className="border-0 bg-transparent text-[10px] font-extrabold text-slate-500 hover:text-slate-800 outline-none cursor-pointer">
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                    </select>
                                </div>

                                <div className="space-y-3 text-[11px]">
                                    {/* Reach */}
                                    <div className="flex items-center justify-between py-1">
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Reach</span>
                                            <span className="font-black text-[13px] text-slate-800 block">1.2K - 3.5K</span>
                                        </div>
                                        <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                            <path d="M0,15 C10,12 15,18 25,12 C35,6 40,16 50,10 C60,4 65,14 80,6" />
                                        </svg>
                                    </div>

                                    {/* Impressions */}
                                    <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Impressions</span>
                                            <span className="font-black text-[13px] text-slate-800 block">2.4K - 6.8K</span>
                                        </div>
                                        <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                            <path d="M0,16 C12,18 18,10 30,12 C42,14 48,6 60,8 C72,10 75,2 80,4" />
                                        </svg>
                                    </div>

                                    {/* Clicks */}
                                    <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-400 block">Clicks</span>
                                            <span className="font-black text-[13px] text-slate-800 block">35 - 120</span>
                                        </div>
                                        <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                            <path d="M0,10 C15,8 20,18 35,14 C50,10 55,4 65,8 C75,12 78,2 80,4" />
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                                    Estimates are based on your targeting and budget.
                                </p>
                            </div>

                            {/* Card 4: Completion Checker */}
                            <div className="space-y-4 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11.5px] font-black text-slate-900 tracking-tight">Completion</span>
                                    <span className="text-[11px] font-black text-blue-600">{completionPct}%</span>
                                </div>

                                {/* Progress bar container */}
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionPct}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                {/* Steps checklist */}
                                <div className="space-y-2 text-[10.5px] font-bold">
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[15px]! font-black ${isNameValid ? 'text-emerald-500' : 'text-slate-300'
                                            }`}>
                                            {isNameValid ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span className={isNameValid ? 'text-slate-700' : 'text-slate-400'}>Campaign Name</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[15px]! font-black ${isObjectiveValid ? 'text-emerald-500' : 'text-slate-300'
                                            }`}>
                                            {isObjectiveValid ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span className={isObjectiveValid ? 'text-slate-700' : 'text-slate-400'}>Objective</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[15px]! font-black ${isBuyingTypeValid ? 'text-emerald-500' : 'text-slate-300'
                                            }`}>
                                            {isBuyingTypeValid ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span className={isBuyingTypeValid ? 'text-slate-700' : 'text-slate-400'}>Buying Type</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[15px]! font-black ${isBudgetValid ? 'text-emerald-500' : 'text-slate-300'
                                            }`}>
                                            {isBudgetValid ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span className={isBudgetValid ? 'text-slate-700' : 'text-slate-400'}>Budget</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : activeStep === 2 ? (
                        <>
                            {/* Budget & Schedule */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">5</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Budget & Schedule</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Set how much and when to spend.</p>
                                    </div>
                                </div>

                                <div className="space-y-3.5 text-left">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Budget</label>
                                        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                                            {['Daily Budget', 'Lifetime Budget'].map(b => {
                                                const matches = adSet.budgetType === (b.startsWith('Daily') ? 'Daily' : 'Lifetime')
                                                return (
                                                    <button
                                                        key={b}
                                                        onClick={() => setAdSet({ ...adSet, budgetType: b.startsWith('Daily') ? 'Daily' : 'Lifetime' })}
                                                        className={`py-1 rounded-lg text-[9.5px] font-black text-center cursor-pointer transition-all ${matches
                                                            ? 'bg-white text-blue-600 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-750'
                                                            }`}
                                                    >
                                                        {b}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-white">
                                        <span className="text-[11px] font-bold text-slate-400">$</span>
                                        <input
                                            type="number"
                                            value={adSet.budgetType === 'Daily' ? adSet.dailyBudget : adSet.lifetimeBudget}
                                            onChange={e => setAdSet({
                                                ...adSet,
                                                dailyBudget: adSet.budgetType === 'Daily' ? e.target.value : adSet.dailyBudget,
                                                lifetimeBudget: adSet.budgetType === 'Lifetime' ? e.target.value : adSet.lifetimeBudget
                                            })}
                                            className="flex-1 h-6 px-1 text-slate-800 text-[11px] font-extrabold outline-none"
                                        />
                                        <span className="text-[9.5px] font-bold text-slate-400">USD</span>
                                    </div>
                                    <p className="text-[9.5px] text-slate-400 font-semibold leading-normal">
                                        You'll spend up to $62.50 on some days, and less on others.
                                    </p>

                                    {/* Schedule */}
                                    <div className="space-y-2.5 pt-1">
                                        <label className="text-[10px] font-semibold text-slate-500 block">Schedule</label>
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] text-slate-400 font-bold block">Start Date</span>
                                            <div className="flex gap-2">
                                                <input
                                                    type="date"
                                                    value={adSet.startDate}
                                                    onChange={e => setAdSet({ ...adSet, startDate: e.target.value })}
                                                    className="flex-1 h-8 px-2 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-700 outline-none bg-white cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={adSet.startTime}
                                                    onChange={e => setAdSet({ ...adSet, startTime: e.target.value })}
                                                    className="w-20 h-8 px-2 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-700 text-center outline-none bg-white"
                                                />
                                            </div>
                                        </div>

                                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                                            <input
                                                type="checkbox"
                                                checked={adSet.setEndDate}
                                                onChange={e => setAdSet({ ...adSet, setEndDate: e.target.checked })}
                                                className="accent-blue-600 w-3.5 h-3.5 cursor-pointer rounded"
                                            />
                                            <span className="text-[10px] font-bold text-slate-700">Set End Date</span>
                                        </label>

                                        {adSet.setEndDate && (
                                            <div className="space-y-1.5 animate-fadeIn">
                                                <span className="text-[9px] text-slate-400 font-bold block">End Date</span>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="date"
                                                        value={adSet.endDate}
                                                        onChange={e => setAdSet({ ...adSet, endDate: e.target.value })}
                                                        className="flex-1 h-8 px-2 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-700 outline-none bg-white cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={adSet.endTime}
                                                        onChange={e => setAdSet({ ...adSet, endTime: e.target.value })}
                                                        className="w-20 h-8 px-2 border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-700 text-center outline-none bg-white"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Optimization & Delivery */}
                            <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">6</div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 leading-tight">Optimization & Delivery</h3>
                                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Control how your ads are delivered.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Optimization for Ad Delivery</label>
                                        <select
                                            value={adSet.optimizationForAdDelivery}
                                            onChange={e => setAdSet({ ...adSet, optimizationForAdDelivery: e.target.value })}
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                        >
                                            <option value="Conversions">Conversions</option>
                                            <option value="Landing Page Views">Landing Page Views</option>
                                            <option value="Link Clicks">Link Clicks</option>
                                            <option value="Impressions">Impressions</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Bid Strategy</label>
                                        <select
                                            value={adSet.bidStrategy}
                                            onChange={e => setAdSet({ ...adSet, bidStrategy: e.target.value })}
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                        >
                                            <option value="Lowest cost">Lowest cost</option>
                                            <option value="Cost cap">Cost cap</option>
                                            <option value="Bid cap">Bid cap</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500">Attribution Setting</label>
                                        <select
                                            value={adSet.attributionSetting}
                                            onChange={e => setAdSet({ ...adSet, attributionSetting: e.target.value })}
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                        >
                                            <option value="7-day click or 1-day view">7-day click or 1-day view</option>
                                            <option value="1-day click or view">1-day click or view</option>
                                            <option value="1-day click">1-day click</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : activeStep === 3 ? (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="flex items-center gap-1.5 text-[11.5px] font-black text-slate-900 tracking-tight select-none">
                                <span>Ad Preview</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400 cursor-help" title="Preview of your ad across placements.">info</span>
                            </div>
                            {/* Platform Selector Icons */}
                            <div className="flex items-center justify-center gap-5 bg-white p-3 rounded-2xl border border-slate-100">
                                {[
                                    { id: 'facebook', label: 'Facebook\nFeed', icon: 'facebook', color: 'bg-blue-600' },
                                    { id: 'instagram', label: 'Instagram', icon: 'photo_camera', color: 'bg-slate-100' },
                                    { id: 'stories', label: 'Stories', icon: 'history_toggle_off', color: 'bg-blue-100' },
                                    { id: 'reels', label: 'Reels', icon: 'movie', color: 'bg-rose-100' }
                                ].map(p => {
                                    const isSelected = activePlatform === p.id
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setActivePlatform(p.id)
                                                triggerToast(`Showing mockup for ${p.label.replace('\n', ' ')}`)
                                            }}
                                            className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-all group"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                                                : `${p.color} text-slate-500 group-hover:shadow-sm`
                                                }`}>
                                                <span className="material-symbols-outlined text-[18px]!">{p.icon}</span>
                                            </div>
                                            <span className={`text-[9px] font-bold text-center leading-tight whitespace-pre-line ${isSelected ? 'text-blue-600' : 'text-slate-400'
                                                }`}>{p.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Feed Settings Details row */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                    <span>Mobile Feed</span>
                                    <span className="material-symbols-outlined text-[13px]!">expand_more</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span>1 of 3</span>
                                    <div className="flex gap-1">
                                        <button className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 cursor-pointer">
                                            <span className="material-symbols-outlined text-[11px] font-black">chevron_left</span>
                                        </button>
                                        <button className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 cursor-pointer">
                                            <span className="material-symbols-outlined text-[11px] font-black">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Live Ad Mockup Phone Shell Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0">
                                {/* Header profile */}
                                <div className="p-3.5 flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0 leading-none">
                                        POWEVA
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-900 leading-tight">{adCreative.facebookPage}</div>
                                        <div className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                                            Sponsored
                                            <span className="material-symbols-outlined text-[11px]!">public</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ad Copy */}
                                <div className="px-3.5 pb-3 text-[10.5px] leading-relaxed text-slate-700 font-medium">
                                    {adCreative.primaryText}
                                </div>

                                {/* Media visual */}
                                <div className="aspect-[16/11] bg-slate-50 border-y border-slate-100 flex items-center justify-center overflow-hidden relative">
                                    <img
                                        src={SHOE_VARIATIONS[selectedVariation].url}
                                        alt="Preview creative"
                                        className="w-full h-full object-cover animate-fadeIn"
                                        key={selectedVariation}
                                    />
                                </div>

                                {/* CTA Details Box */}
                                <div className="p-3.5 bg-slate-50/50 flex items-center justify-between gap-3 border-b border-slate-100">
                                    <div className="min-w-0">
                                        <p className="text-[8px] text-slate-400 uppercase font-black tracking-wider truncate">
                                            {adCreative.websiteUrl ? adCreative.websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0].toUpperCase() : 'POWEVA.COM'}
                                        </p>
                                        <h4 className="text-[11px] font-black text-slate-800 truncate mt-0.5">{adCreative.headline}</h4>
                                        <p className="text-[9px] text-slate-400 truncate mt-0.5 font-medium">{adCreative.description}</p>
                                    </div>
                                    <button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[9.5px] font-black text-slate-700 rounded shadow-sm shrink-0 select-none cursor-pointer">
                                        {adCreative.cta}
                                    </button>
                                </div>

                                {/* Social likes engagement row */}
                                <div className="px-3.5 py-2.5 flex items-center justify-between text-[9px] text-slate-400 font-bold border-b border-slate-100">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex -space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] border border-white">
                                                <span className="material-symbols-outlined text-[8px]! font-black">thumb_up</span>
                                            </div>
                                            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] border border-white">
                                                <span className="material-symbols-outlined text-[8px] font-black">favorite</span>
                                            </div>
                                        </div>
                                        <span>1.2K</span>
                                    </div>
                                    <span>23 Comments</span>
                                </div>

                                {/* Actions row: Like, Comment, Share */}
                                <div className="grid grid-cols-3 py-1 px-1 text-[10px] text-slate-400 font-black bg-white">
                                    <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span className="material-symbols-outlined text-[13px]!">thumb_up</span>
                                        Like
                                    </button>
                                    <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span className="material-symbols-outlined text-[13px]!">chat_bubble</span>
                                        Comment
                                    </button>
                                    <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span className="material-symbols-outlined text-[13px]!">share</span>
                                        Share
                                    </button>
                                </div>
                            </div>

                            {/* Previewing Variations footer block */}
                            <div className="space-y-2 px-1">
                                <span className="text-[11px] font-semibold text-slate-500 block">Previewing variations</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {SHOE_VARIATIONS.map(v => {
                                        const isSelected = selectedVariation === v.id
                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() => {
                                                    setSelectedVariation(v.id)
                                                    triggerToast(`Selected variation: ${v.name}`)
                                                }}
                                                className={`aspect-square rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center p-1.5 cursor-pointer transition-all ${isSelected
                                                    ? 'border-blue-500 shadow-md scale-105'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <img src={v.url} alt={v.name} className="w-full h-full object-cover rounded-lg" />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400">
                            Coming soon
                        </div>
                    )}

                </div>
            )}

                {/* ── COLUMN 3: AD PREVIEW PANEL (RIGHT) ── */}
                <div className={`${activeStep === 4 ? 'w-[340px] bg-slate-50 border-l border-slate-200' : activeStep === 3 ? 'w-[300px] bg-white' : 'w-[380px] bg-slate-50'} flex flex-col shrink-0 overflow-y-auto p-6 space-y-6 text-left meta-scroll`}>
                    {activeStep === 4 ? (
                        <div className="space-y-5 animate-fadeIn">
                            {/* Card 1: Campaign Summary */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-850 tracking-tight uppercase">Campaign Summary</span>
                                    <button onClick={() => triggerToast("Viewing full report details.")} className="text-[10px] font-black text-blue-600 hover:underline cursor-pointer">
                                        View Full Report
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-semibold text-slate-400">Est. Reach</div>
                                        <div className="text-xs font-black text-slate-800">6.2K – 18K</div>
                                        <span className="material-symbols-outlined text-[15px] text-slate-400">group</span>
                                    </div>
                                    <div className="space-y-1 border-x border-slate-100">
                                        <div className="text-[10px] font-semibold text-slate-400">Est. Clicks</div>
                                        <div className="text-xs font-black text-slate-800">120 – 310</div>
                                        <span className="material-symbols-outlined text-[15px] text-slate-400 font-bold">ads_click</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-semibold text-slate-400">Conversions</div>
                                        <div className="text-xs font-black text-slate-800">15 – 45</div>
                                        <span className="material-symbols-outlined text-[15px] text-slate-400 font-bold">show_chart</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Audience Overview */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-850 tracking-tight uppercase">Audience Overview</span>
                                    <span className="material-symbols-outlined text-[14px] text-slate-400 cursor-pointer hover:text-slate-655" title="Audience Information">info</span>
                                </div>

                                <div className="relative flex flex-col items-center pt-2">
                                    <svg className="w-44 h-22 overflow-visible" viewBox="0 0 100 50">
                                        <defs>
                                            <linearGradient id="gauge-grad-review" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ef4444" />
                                                <stop offset="50%" stopColor="#f59e0b" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gauge-grad-review)" strokeWidth="8" strokeLinecap="round" />

                                        {/* Needle */}
                                        <g transform="translate(50, 50)">
                                            <line x1="0" y1="0" x2="0" y2="-36" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" transform="rotate(15)" />
                                            <circle cx="0" cy="0" r="4.5" fill="#1e293b" />
                                            <circle cx="0" cy="0" r="2" fill="#ffffff" />
                                        </g>
                                    </svg>
                                    <div className="text-center mt-3">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audience Size</div>
                                        <div className="text-sm font-extrabold text-emerald-500 mt-0.5">Good</div>
                                        <p className="text-[10.5px] font-black text-slate-800 mt-0.5">
                                            2.4M – 2.8M
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Budget Overview */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-850 tracking-tight uppercase">Budget Overview</span>
                                    <span className="text-[10px] font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">${adSet.dailyBudget}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Estimated Daily Results</span>
                                    {/* Small line graph representing daily results trend */}
                                    <div className="h-10 w-full flex items-end pt-2">
                                        <svg className="w-full h-full stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 200 40">
                                            <path d="M0,32 C20,34 30,22 50,26 C70,30 80,14 100,18 C120,22 130,8 150,12 C170,16 185,4 200,6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Campaign Structure */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <span className="text-[11px] font-black text-slate-855 tracking-tight uppercase block">Campaign Structure</span>

                                <div className="space-y-4 relative pl-3.5 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                                    {/* Campaign */}
                                    <div className="flex items-start gap-3 relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center absolute -left-[18.5px] top-0.5 z-10">
                                            <span className="material-symbols-outlined text-[9px]! font-black">campaign</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-extrabold text-slate-800 leading-none block">{campaign.name || 'Campaign'}</span>
                                            <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Campaign</span>
                                        </div>
                                    </div>

                                    {/* Ad Set */}
                                    <div className="flex items-start gap-3 relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center absolute -left-[18.5px] top-0.5 z-10">
                                            <span className="material-symbols-outlined text-[9px]! font-black">layers</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-extrabold text-slate-800 leading-none block">
                                                {adSet.conversionLocation.charAt(0).toUpperCase() + adSet.conversionLocation.slice(1)} • {adSet.locations.join(', ')} • {adSet.ageMin}-{adSet.ageMax}+
                                            </span>
                                            <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">1 Ad Set</span>
                                        </div>
                                    </div>

                                    {/* Ad */}
                                    <div className="flex items-start gap-3 relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-purple-500 text-white flex items-center justify-center absolute -left-[18.5px] top-0.5 z-10">
                                            <span className="material-symbols-outlined text-[9px]! font-black">image</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-extrabold text-slate-800 leading-none block">
                                                {adCreative.format.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} • {adCreative.cta}
                                            </span>
                                            <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">1 Ad</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Budget Summary */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="space-y-3.5 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Total Budget</span>
                                        <span className="font-extrabold text-slate-800">${adSet.dailyBudget} Daily</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Schedule</span>
                                        <span className="font-extrabold text-slate-850">May 22, 2025 – Jun 22, 2025</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-100">
                                        <span className="font-semibold text-slate-400">Total Spend (31 days)</span>
                                        <span className="font-extrabold text-slate-800">$1,550.00 – $1,650.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeStep === 3 ? (
                        <div className="space-y-5 animate-fadeIn">
                            {/* Card 1: Audience & Performance */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase">Audience & Performance</span>
                                    <span className="material-symbols-outlined text-[14px] text-slate-400 cursor-pointer hover:text-slate-655" title="Audience Information">info</span>
                                </div>

                                <div className="relative flex flex-col items-center pt-2">
                                    <svg className="w-48 h-24 overflow-visible" viewBox="0 0 100 50">
                                        <defs>
                                            <linearGradient id="gauge-grad-4" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ef4444" />
                                                <stop offset="50%" stopColor="#f59e0b" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gauge-grad-4)" strokeWidth="8" strokeLinecap="round" />

                                        {/* Needle */}
                                        <g transform="translate(50, 50)">
                                            <line x1="0" y1="0" x2="0" y2="-36" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" transform="rotate(15)" />
                                            <circle cx="0" cy="0" r="4.5" fill="#1e293b" />
                                            <circle cx="0" cy="0" r="2" fill="#ffffff" />
                                        </g>
                                    </svg>
                                    <div className="text-center mt-3">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audience Size</div>
                                        <div className="text-sm font-extrabold text-emerald-500 mt-0.5">Good</div>
                                        <p className="text-[10.5px] font-black text-slate-800 mt-0.5">
                                            2.4M – 2.8M
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    {/* Estimated Daily Results */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Estimated Daily Results</span>

                                        <div className="space-y-3">
                                            {/* Reach */}
                                            <div className="flex items-center justify-between py-1">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 block">Reach</span>
                                                    <span className="font-black text-xs text-slate-800 block">6.2K – 18K</span>
                                                </div>
                                                <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible animate-pulse" viewBox="0 0 80 20">
                                                    <path d="M0,15 C10,12 15,18 25,12 C35,6 40,16 50,10 C60,4 65,14 80,6" />
                                                </svg>
                                            </div>

                                            {/* Link Clicks */}
                                            <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 block">Link Clicks</span>
                                                    <span className="font-black text-xs text-slate-800 block">120 – 310</span>
                                                </div>
                                                <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                                    <path d="M0,16 C12,18 18,10 30,12 C42,14 48,6 60,8 C72,10 75,2 80,4" />
                                                </svg>
                                            </div>

                                            {/* Conversions */}
                                            <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 block">Conversions</span>
                                                    <span className="font-black text-xs text-slate-800 block">15 – 45</span>
                                                </div>
                                                <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                                    <path d="M0,10 C15,8 20,18 35,14 C50,10 55,4 65,8 C75,12 78,2 80,4" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed border-t border-slate-100 pt-2 text-center">
                                        Estimates are based on your targeting and budget.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Ad Quality */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-855 tracking-tight uppercase">Ad Quality</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black rounded-lg">
                                        9.2 / 10
                                    </span>
                                </div>
                                <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                                    Great! Your ad is optimized for better performance.
                                </p>
                                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                                    {[
                                        { label: 'Image Quality', status: 'Good' },
                                        { label: 'Text Length', status: 'Good' },
                                        { label: 'Call To Action', status: 'Good' }
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between text-[10px]">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-650">
                                                <span className="material-symbols-outlined text-[13px]! text-emerald-500 font-bold">check_circle</span>
                                                <span>{item.label}</span>
                                            </div>
                                            <span className="font-extrabold text-emerald-600">{item.status}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 flex justify-center">
                                    <button onClick={() => triggerToast("View creative recommendations dialog.")} className="px-4 py-1.5 border border-blue-500 hover:bg-blue-50 text-blue-600 text-[9.5px] font-black rounded-xl cursor-pointer">
                                        View Recommendations
                                    </button>
                                </div>
                            </div>

                            {/* Card 3: Budget Summary */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase block">Budget Summary</span>
                                    <button onClick={() => triggerToast("Direct edit budget shortcut triggered.")} className="material-symbols-outlined text-[14px] text-slate-450 cursor-pointer hover:text-slate-650">edit</button>
                                </div>

                                <div className="space-y-3.5 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Daily Budget</span>
                                        <span className="font-extrabold text-slate-800">${adSet.dailyBudget}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Schedule</span>
                                        <span className="font-extrabold text-slate-850">May 22 – Jun 22, 2025</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-100">
                                        <span className="font-semibold text-slate-400">Total Spend (31 days)</span>
                                        <span className="font-extrabold text-slate-800">$1,550.00 – $1,650.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Tabs row: Ad Preview / Structure */}
                            <div className="flex border-b border-slate-200 text-xs font-black">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`pb-2.5 px-4 focus:outline-none transition-colors border-b-2 cursor-pointer ${activeTab === 'preview'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    Ad Preview
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('structure')
                                        triggerToast("Structure analysis tab activated.")
                                    }}
                                    className={`pb-2.5 px-4 focus:outline-none transition-colors border-b-2 cursor-pointer ${activeTab === 'structure'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    Structure
                                </button>
                            </div>

                            {activeTab === 'preview' ? (
                                activeStep === 2 ? (
                                    <div className="space-y-5">
                                        {/* Card 1: Audience Overview */}
                                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase">Audience Overview</span>
                                                <span className="material-symbols-outlined text-[14px] text-slate-400 cursor-pointer hover:text-slate-650" title="Audience Information">info</span>
                                            </div>

                                            <div className="relative flex flex-col items-center pt-2">
                                                <svg className="w-48 h-24 overflow-visible" viewBox="0 0 100 50">
                                                    <defs>
                                                        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#ef4444" />
                                                            <stop offset="50%" stopColor="#f59e0b" />
                                                            <stop offset="100%" stopColor="#10b981" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Arc path */}
                                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gauge-grad)" strokeWidth="8" strokeLinecap="round" />

                                                    {/* Needle */}
                                                    <g transform="translate(50, 50)">
                                                        <line x1="0" y1="0" x2="0" y2="-36" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" transform="rotate(15)" />
                                                        <circle cx="0" cy="0" r="4.5" fill="#1e293b" />
                                                        <circle cx="0" cy="0" r="2" fill="#ffffff" />
                                                    </g>
                                                </svg>
                                                <div className="text-center mt-3">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audience Size</div>
                                                    <div className="text-sm font-extrabold text-emerald-500 mt-0.5">Good</div>
                                                    <p className="text-[9.5px] text-slate-400 font-medium max-w-[180px] mx-auto mt-1 leading-snug">
                                                        Your audience selection is fairly broad.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10.5px] font-semibold text-slate-400">Potential Reach</span>
                                                    <div className="text-right">
                                                        <span className="text-sm font-black text-slate-800">2.4M – 2.8M</span>
                                                    </div>
                                                </div>

                                                {/* Estimated Daily Results */}
                                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Estimated Daily Results</span>

                                                    <div className="space-y-3">
                                                        {/* Reach */}
                                                        <div className="flex items-center justify-between py-1">
                                                            <div className="space-y-0.5">
                                                                <span className="text-[10px] font-semibold text-slate-400 block">Reach</span>
                                                                <span className="font-black text-xs text-slate-800 block">6.2K – 18K</span>
                                                            </div>
                                                            <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible animate-pulse" viewBox="0 0 80 20">
                                                                <path d="M0,15 C10,12 15,18 25,12 C35,6 40,16 50,10 C60,4 65,14 80,6" />
                                                            </svg>
                                                        </div>

                                                        {/* Link Clicks */}
                                                        <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                                            <div className="space-y-0.5">
                                                                <span className="text-[10px] font-semibold text-slate-400 block">Link Clicks</span>
                                                                <span className="font-black text-xs text-slate-800 block">120 – 310</span>
                                                            </div>
                                                            <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                                                <path d="M0,16 C12,18 18,10 30,12 C42,14 48,6 60,8 C72,10 75,2 80,4" />
                                                            </svg>
                                                        </div>

                                                        {/* Conversions */}
                                                        <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                                            <div className="space-y-0.5">
                                                                <span className="text-[10px] font-semibold text-slate-400 block">Conversions</span>
                                                                <span className="font-black text-xs text-slate-800 block">15 – 45</span>
                                                            </div>
                                                            <svg className="w-16 h-6 stroke-blue-500 stroke-[1.8] fill-none overflow-visible" viewBox="0 0 80 20">
                                                                <path d="M0,10 C15,8 20,18 35,14 C50,10 55,4 65,8 C75,12 78,2 80,4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 2: Audience Quality */}
                                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-black text-slate-850 tracking-tight uppercase">Audience Quality</span>
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black rounded-lg">
                                                    7.8 / 10
                                                </span>
                                            </div>

                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                                            </div>
                                            <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                                                Great! Your audience is well-defined.
                                            </p>
                                        </div>

                                        {/* Card 3: Budget Usage */}
                                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                            <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase block">Budget Usage</span>

                                            <div className="space-y-2 text-[10.5px]">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-slate-400">Daily Average Spend</span>
                                                    <span className="font-extrabold text-slate-800">$50.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-slate-400">Projected Spend (7 days)</span>
                                                    <span className="font-extrabold text-slate-800">$350.00</span>
                                                </div>
                                            </div>

                                            {/* Weekly spend bar chart */}
                                            <div className="flex items-end justify-between h-20 px-1 pt-4">
                                                {[
                                                    { day: 'M', height: 'h-8' },
                                                    { day: 'T', height: 'h-14' },
                                                    { day: 'W', height: 'h-16' },
                                                    { day: 'T', height: 'h-12' },
                                                    { day: 'F', height: 'h-10' },
                                                    { day: 'S', height: 'h-18' },
                                                    { day: 'S', height: 'h-14' }
                                                ].map((bar, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                                                        <div className="w-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-t-sm transition-colors relative group h-14 flex items-end justify-center cursor-pointer">
                                                            <div className={`w-full bg-blue-500 rounded-t-sm ${bar.height}`} />
                                                        </div>
                                                        <span className="text-[9px] font-bold text-slate-400">{bar.day}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Platform Selector Icons */}
                                        <div className="flex items-center justify-center gap-5">
                                            {[
                                                { id: 'facebook', label: 'Facebook\nFeed', icon: 'facebook', color: 'bg-blue-600' },
                                                { id: 'instagram', label: 'Instagram', icon: 'photo_camera', color: 'bg-slate-100' },
                                                { id: 'stories', label: 'Stories', icon: 'history_toggle_off', color: 'bg-blue-100' },
                                                { id: 'reels', label: 'Reels', icon: 'movie', color: 'bg-rose-100' }
                                            ].map(p => {
                                                const isSelected = activePlatform === p.id
                                                return (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => {
                                                            setActivePlatform(p.id)
                                                            triggerToast(`Showing mockup for ${p.label.replace('\n', ' ')}`)
                                                        }}
                                                        className={`flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-all group`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected
                                                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                                                            : `${p.color} text-slate-500 group-hover:shadow-sm`
                                                            }`}>
                                                            <span className="material-symbols-outlined text-[18px]!">{p.icon}</span>
                                                        </div>
                                                        <span className={`text-[9px] font-bold text-center leading-tight whitespace-pre-line ${isSelected ? 'text-blue-600' : 'text-slate-400'
                                                            }`}>{p.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* Feed Settings Details row */}
                                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                                <span>Mobile Feed</span>
                                                <span className="material-symbols-outlined text-[13px]!">expand_more</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span>1 of 3</span>
                                                <div className="flex gap-1">
                                                    <button className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 cursor-pointer">
                                                        <span className="material-symbols-outlined text-[11px] font-black">chevron_left</span>
                                                    </button>
                                                    <button className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 cursor-pointer">
                                                        <span className="material-symbols-outlined text-[11px] font-black">chevron_right</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Live Ad Mockup Phone Shell Card */}
                                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0">
                                            {/* Header profile */}
                                            <div className="p-3.5 flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0 leading-none">
                                                    POWEVA
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-900 leading-tight">{adCreative.facebookPage}</div>
                                                    <div className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                                                        Sponsored
                                                        <span className="material-symbols-outlined text-[11px]!">public</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ad Copy */}
                                            <div className="px-3.5 pb-3 text-[10.5px] leading-relaxed text-slate-700 font-medium">
                                                {adCreative.primaryText}
                                            </div>

                                            {/* Media visual */}
                                            <div className="aspect-[16/11] bg-slate-50 border-y border-slate-100 flex items-center justify-center overflow-hidden relative">
                                                <img
                                                    src={SHOE_VARIATIONS[selectedVariation].url}
                                                    alt="Preview creative"
                                                    className="w-full h-full object-cover animate-fadeIn"
                                                    key={selectedVariation}
                                                />
                                            </div>

                                            {/* CTA Details Box */}
                                            <div className="p-3.5 bg-slate-50/50 flex items-center justify-between gap-3 border-b border-slate-100">
                                                <div className="min-w-0">
                                                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-wider truncate">{adCreative.websiteUrl ? adCreative.websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0].toUpperCase() : 'POWEVA.COM'}</p>
                                                    <h4 className="text-[11px] font-black text-slate-800 truncate mt-0.5">{adCreative.headline}</h4>
                                                    <p className="text-[9px] text-slate-400 truncate mt-0.5 font-medium">{adCreative.description}</p>
                                                </div>
                                                <button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[9.5px] font-black text-slate-700 rounded shadow-sm shrink-0 select-none cursor-pointer">
                                                    {adCreative.cta}
                                                </button>
                                            </div>

                                            {/* Social likes engagement row */}
                                            <div className="px-3.5 py-2.5 flex items-center justify-between text-[9px] text-slate-400 font-bold border-b border-slate-100">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="flex -space-x-1">
                                                        <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] border border-white">
                                                            <span className="material-symbols-outlined text-[8px]! font-black">thumb_up</span>
                                                        </div>
                                                        <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] border border-white">
                                                            <span className="material-symbols-outlined text-[8px] font-black">favorite</span>
                                                        </div>
                                                    </div>
                                                    <span>1.2K</span>
                                                </div>
                                                <span>23 Comments</span>
                                            </div>

                                            {/* Actions row: Like, Comment, Share */}
                                            <div className="grid grid-cols-3 py-1 px-1 text-[10px] text-slate-400 font-black bg-white">
                                                <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                                    <span className="material-symbols-outlined text-[13px]!">thumb_up</span>
                                                    Like
                                                </button>
                                                <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                                    <span className="material-symbols-outlined text-[13px]!">chat_bubble</span>
                                                    Comment
                                                </button>
                                                <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                                    <span className="material-symbols-outlined text-[13px]!">share</span>
                                                    Share
                                                </button>
                                            </div>
                                        </div>

                                        {/* Previewing Variations footer block */}
                                        <div className="space-y-2 px-1">
                                            <span className="text-[11px] font-semibold text-slate-500 block">Previewing variations</span>
                                            <div className="grid grid-cols-3 gap-2">
                                                {SHOE_VARIATIONS.map(v => {
                                                    const isSelected = selectedVariation === v.id
                                                    return (
                                                        <button
                                                            key={v.id}
                                                            onClick={() => {
                                                                setSelectedVariation(v.id)
                                                                triggerToast(`Selected variation: ${v.name}`)
                                                            }}
                                                            className={`aspect-square rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center p-1.5 cursor-pointer transition-all ${isSelected
                                                                ? 'border-blue-500 shadow-md scale-105'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                                }`}
                                                        >
                                                            <img src={v.url} alt={v.name} className="w-full h-full object-cover rounded-lg" />
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )
                            ) : (
                                <div className="flex-1 border border-slate-200 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-white space-y-2">
                                    <span className="material-symbols-outlined text-[32px] text-slate-300">account_tree</span>
                                    <span className="text-xs font-extrabold text-slate-700">Placements Hierarchy</span>
                                    <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                                        Analysis of structural campaign elements, split tests, and delivery parameters.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                </div>

            </div>

            {/* ── WIZARD CONTROLS FOOTER ── */}
            <div className="h-14 border-t border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                    <span className="material-symbols-outlined text-[15px]! text-emerald-500 font-black">check_circle</span>
                    <span>Draft saved</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-400">Just now</span>
                </div>

                <div className="flex items-center gap-3">
                    {activeStep > 1 ? (
                        <button
                            onClick={() => {
                                setActiveStep(activeStep - 1)
                                triggerToast(`Navigating to Step ${activeStep - 1}`)
                            }}
                            className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                        >
                            {activeStep === 4 ? 'Back to Ad' : 'Back'}
                        </button>
                    ) : (
                        <button
                            onClick={() => triggerToast("Edit cancelled. Returning to main panel.")}
                            className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (activeStep < 4) {
                                setActiveStep(activeStep + 1)
                                triggerToast(`Navigating to Step ${activeStep + 1}`)
                            } else {
                                handlePublish()
                            }
                        }}
                        className={`px-5 py-2 ${activeStep === 4 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5`}
                    >
                        <span>
                            {activeStep === 1 ? 'Next: Ad Set' :
                                activeStep === 2 ? 'Next: Ad' :
                                    activeStep === 3 ? 'Next: Review' : 'Publish Campaign'}
                        </span>
                        <span className="material-symbols-outlined text-[13px]! font-bold">
                            {activeStep === 4 ? 'send' : 'arrow_forward'}
                        </span>
                    </button>
                </div>
            </div>

            {/* ── PUBLISH LOADING DIALOG ── */}
            <AnimatePresence>
                {isPublishing && (
                    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 bg-slate-950/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl w-full max-w-sm p-6 text-center space-y-5 shadow-2xl border border-slate-100"
                        >
                            {publishProgress < 100 ? (
                                <div className="space-y-4">
                                    <div className="w-10 h-10 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto"></div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-800">Publishing campaign creative</h3>
                                        <p className="text-[10px] text-slate-400 mt-1">Uploading budget rules & webhooks parameters... {publishProgress}%</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-800">Campaign Published</h3>
                                        <p className="text-[10px] text-slate-400 mt-1">Lead webhook mapping is live on active ad placements.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsPublishing(false)}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                    >
                                        Return
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Alerts */}
            {toastMessage && (
                <div className={toastStyles}>
                    <span className="material-symbols-outlined text-[15px]! text-blue-400">info</span>
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
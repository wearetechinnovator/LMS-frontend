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
                <div className="flex items-center gap-3 w-[180px] justify-end">
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
                        Publish Campaign
                    </button>
                </div>
            </div>

            {/* ── THREE COLUMN WORKSPACE ── */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* ── COLUMN 1: CONFIGURATION FORM (LEFT) ── */}
                <div className="flex-1 bg-white border-r border-slate-200 overflow-y-auto p-8 text-left meta-scroll">
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
                </div>

                {/* ── COLUMN 2: SUMMARY & RESULTS PANEL (MIDDLE) ── */}
                <div className="w-[300px] border-r border-slate-200 bg-white p-6 overflow-y-auto space-y-6 shrink-0 text-left meta-scroll font-medium">

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

                </div>

                {/* ── COLUMN 3: AD PREVIEW PANEL (RIGHT) ── */}
                <div className="w-[380px] bg-slate-50 flex flex-col shrink-0 overflow-y-auto p-6 space-y-6 text-left meta-scroll">

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
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                {/* Header profile */}
                                <div className="p-3.5 flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                        YOUR LOGO
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-900 leading-tight">Your Page</div>
                                        <div className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                                            Sponsored
                                            <span className="material-symbols-outlined text-[11px]">public</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ad Copy */}
                                <div className="px-3.5 pb-3 text-[10.5px] leading-relaxed text-slate-700 font-medium">
                                    Discover our new collection designed for performance and style.
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
                                        <p className="text-[8px] text-slate-400 uppercase font-black tracking-wider truncate">YOURWEBSITE.COM</p>
                                        <h4 className="text-[11px] font-black text-slate-800 truncate mt-0.5">Elevate Your Performance</h4>
                                        <p className="text-[9px] text-slate-400 truncate mt-0.5 font-medium">High quality • Best Price</p>
                                    </div>
                                    <button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[9.5px] font-black text-slate-700 rounded shadow-sm shrink-0 select-none cursor-pointer">
                                        Learn More
                                    </button>
                                </div>

                                {/* Social likes engagement row */}
                                <div className="px-3.5 py-2.5 flex items-center justify-between text-[9px] text-slate-400 font-bold border-b border-slate-100">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex -space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] border border-white">
                                                <span className="material-symbols-outlined text-[8px] font-black">thumb_up</span>
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
                                        <span className="material-symbols-outlined text-[13px]">thumb_up</span>
                                        Like
                                    </button>
                                    <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span className="material-symbols-outlined text-[13px]">chat_bubble</span>
                                        Comment
                                    </button>
                                    <button className="py-2 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span className="material-symbols-outlined text-[13px]">share</span>
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
                    ) : (
                        <div className="flex-1 border border-slate-200 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-white space-y-2">
                            <span className="material-symbols-outlined text-[32px] text-slate-300">account_tree</span>
                            <span className="text-xs font-extrabold text-slate-700">Placements Hierarchy</span>
                            <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                                Analysis of structural campaign elements, split tests, and delivery parameters.
                            </p>
                        </div>
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
                    <button
                        onClick={() => triggerToast("Edit cancelled. Returning to main panel.")}
                        className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (activeStep < 4) {
                                setActiveStep(activeStep + 1)
                                triggerToast(`Navigating to Step ${activeStep + 1}`)
                            } else {
                                handlePublish()
                            }
                        }}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        <span>{activeStep === 4 ? 'Publish Campaign' : 'Next: Ad Set'}</span>
                        <span className="material-symbols-outlined text-[13px]! font-bold">arrow_forward</span>
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
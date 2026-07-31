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

const PLATFORM_DETAILS = {
    meta: {
        profile: 'Meta Developer Workspace',
        scopes: 'ads_management, leads_retrieval',
        tokenMask: 'EAAX...ZAAZ',
        syncLabel: 'Webhooks Active'
    },
    google: {
        profile: 'Google Ads Manager Console',
        scopes: 'adwords_management, youtube_reporting',
        tokenMask: 'ya29.a0AfH6S...Z947',
        syncLabel: 'API Sync Active'
    },
    tiktok: {
        profile: 'TikTok Business Center',
        scopes: 'ads.manage, business.creative_search',
        tokenMask: 'tt_act_582...9852',
        syncLabel: 'API Sync Active'
    },
    linkedin: {
        profile: 'LinkedIn Campaign Developer Org',
        scopes: 'r_ads, r_ads_reporting, w_member_social',
        tokenMask: 'aq.lms_linkedin...1985',
        syncLabel: 'API Sync Active'
    }
}

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
    const [creationMode, setCreationMode] = useState('select') // 'select' | 'manual' | 'ai'
    const [chatInput, setChatInput] = useState('')
    const [chatMessages, setChatMessages] = useState([
        { sender: 'ai', text: "Hi there! I am your AI Campaign Builder. Let's configure an optimized ads campaign together.\n\nFirst, what is your primary goal or objective for this campaign? (Awareness, Traffic, Engagement, Leads, App Promotion, or Sales)" }
    ])
    const [aiQuestionIndex, setAiQuestionIndex] = useState(0)
    const [chatIsTyping, setChatIsTyping] = useState(false)
    const [integrations, setIntegrations] = useState({
        meta: { connected: true, accountName: 'Poweva Store', adsAccountId: 'ACT-9852-1085', pagesCount: 3, adAccountsCount: 4 },
        google: { connected: true, accountName: 'Google Ads Search Channel', adsAccountId: '938-123-4567', campaignsCount: 2, adAccountsCount: 2 },
        tiktok: { connected: true, needsAttention: true, accountName: 'TikTok Business Account', adsAccountId: 'ACT-5829-9852', expiresLabel: 'Expires in 8 days', adAccountsCount: 1 },
        linkedin: { connected: false, accountName: null, adsAccountId: null }
    })
    const [authModalPlatform, setAuthModalPlatform] = useState(null) // null | 'meta' | 'google' | 'tiktok' | 'linkedin'
    const [authTempName, setAuthTempName] = useState('')
    const [authTempId, setAuthTempId] = useState('')
    const [editCredentialsMode, setEditCredentialsMode] = useState(false)

    const apiBaseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5001/api/v1'
        : (import.meta.env.VITE_BASE_URL || 'https://lms-backend-xt66.onrender.com/api/v1')

    const [insightsData, setInsightsData] = useState({
        spend: 1550.00,
        reach: '6.2K – 18K',
        impressions: 28540,
        clicks: '120 – 310',
        conversions: '15 – 45',
        ctr: 1.25,
        cpc: 1.50,
        cpm: 12.00,
        roas: 2.40
    })

    const [adAccountsList, setAdAccountsList] = useState([
        { id: 'act_9852', name: 'Poweva Primary Ads Account' },
        { id: 'act_2047', name: 'Tech Solutions Sandbox Account' }
    ])
    const [facebookPagesList, setFacebookPagesList] = useState([
        { id: 'page_2947', name: 'Poweva Store' },
        { id: 'page_5829', name: 'LMS Corporate Page' }
    ])
    const [selectedAdAccount, setSelectedAdAccount] = useState('act_9852')
    const [selectedPage, setSelectedPage] = useState('page_2947')

    const [campaignModalOpen, setCampaignModalOpen] = useState(false)
    const [campaignModalForm, setCampaignModalForm] = useState({
        name: 'New Awareness Campaign',
        dailyBudget: '50.00',
        objective: 'awareness',
        status: 'PAUSED'
    })

    const fetchAccounts = async () => {
        const token = localStorage.getItem('authToken')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        try {
            const res = await fetch(`${apiBaseUrl}/meta/accounts`, { headers })
            if (res.ok) {
                const data = await res.json()
                if (data.connected) {
                    setIntegrations(prev => ({
                        ...prev,
                        meta: {
                            connected: true,
                            accountName: data.pages?.find(p => p.id === data.selectedPage)?.name || 'Meta Ads API Channel',
                            adsAccountId: data.selectedAdAccount || 'act_9852',
                            pagesCount: data.pages?.length || 3,
                            adAccountsCount: data.adAccounts?.length || 4,
                            facebookUser: data.facebookUser
                        }
                    }))
                    if (data.adAccounts && data.adAccounts.length > 0) {
                        setAdAccountsList(data.adAccounts)
                    }
                    if (data.pages && data.pages.length > 0) {
                        setFacebookPagesList(data.pages)
                    }
                    if (data.selectedAdAccount) {
                        setSelectedAdAccount(data.selectedAdAccount)
                    }
                    if (data.selectedPage) {
                        setSelectedPage(data.selectedPage)
                    }
                }
            }
        } catch (err) {
            console.error("Error loading linked ad accounts:", err)
        }
    }

    const fetchInsights = async () => {
        const token = localStorage.getItem('authToken')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        try {
            const res = await fetch(`${apiBaseUrl}/meta/insights`, { headers })
            if (res.ok) {
                const data = await res.json()
                setInsightsData({
                    spend: data.spend || 1550.00,
                    reach: data.reach ? `${(data.reach / 1000).toFixed(1)}K` : '6.2K – 18K',
                    impressions: data.impressions || 28540,
                    clicks: data.clicks ? String(data.clicks) : '120 – 310',
                    conversions: data.conversions || data.leads || 24,
                    ctr: data.ctr || 1.25,
                    cpc: data.cpc || 1.50,
                    cpm: data.cpm || 12.00,
                    roas: data.roas || 2.40
                })
            }
        } catch (err) {
            console.error("Error fetching campaign insights:", err)
        }
    }

    const handleSelectAccountsChange = async (adAccId, pageId) => {
        const token = localStorage.getItem('authToken')
        const headers = token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        }
        try {
            const pageToken = facebookPagesList.find(p => p.id === pageId)?.access_token || 'mock_page_token'
            await fetch(`${apiBaseUrl}/meta/select-accounts`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    adAccountId: adAccId,
                    facebookPageId: pageId,
                    pageAccessToken: pageToken
                })
            })
            triggerToast("Configurations updated successfully.")
            fetchAccounts()
        } catch (err) {
            console.error(err)
        }
    }

    const handleAdAccountChange = (val) => {
        setSelectedAdAccount(val)
        handleSelectAccountsChange(val, selectedPage)
    }

    const handlePageChange = (val) => {
        setSelectedPage(val)
        handleSelectAccountsChange(selectedAdAccount, val)
    }

    const handleConnectMeta = () => {
        if (window.FB) {
            window.FB.login((response) => {
                if (response.authResponse) {
                    exchangeMetaToken(response.authResponse.accessToken)
                } else {
                    triggerToast("Facebook login cancelled or failed.")
                }
            }, { scope: 'ads_management,ads_read,pages_show_list' })
        } else {
            const mockToken = "mock_fb_user_token_" + Math.random().toString(36).substring(7)
            exchangeMetaToken(mockToken)
        }
    }

    const exchangeMetaToken = async (token) => {
        const headers = localStorage.getItem('authToken') ? {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        }
        try {
            const res = await fetch(`${apiBaseUrl}/meta/oauth/exchange`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ shortLivedToken: token })
            })
            const data = await res.json()
            if (res.ok) {
                setIntegrations(prev => ({
                    ...prev,
                    meta: {
                        connected: true,
                        accountName: 'Poweva Store',
                        adsAccountId: 'act_9852',
                        pagesCount: 3,
                        adAccountsCount: 4
                    }
                }))
                triggerToast("Meta account connected successfully!")
                fetchAccounts()
                fetchInsights()
            } else {
                triggerToast(data.error || "Failed to exchange token.")
            }
        } catch (err) {
            console.error(err)
            triggerToast("Network error connecting Meta account.")
        }
    }

    const handleCreateCampaignSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('authToken')
        const headers = token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        }
        try {
            const res = await fetch(`${apiBaseUrl}/meta/campaigns`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: campaignModalForm.name,
                    objective: campaignModalForm.objective,
                    daily_budget: campaignModalForm.dailyBudget,
                    status: campaignModalForm.status,
                    page_id: selectedPage
                })
            })
            const data = await res.json()
            if (res.ok) {
                triggerToast(`Campaign created successfully! ID: ${data.id}`)
                setCampaignModalOpen(false)
                setCreationMode('manual')
                setActiveStep(1)
            } else {
                triggerToast(data.error || "Failed to create campaign.")
            }
        } catch (err) {
            console.error(err)
            triggerToast("Network error creating campaign.")
        }
    }

    useEffect(() => {
        fetchAccounts()
        fetchInsights()
        window.fbAsyncInit = function() {
            window.FB.init({
                appId: '1729260811681200',
                cookie: true,
                xfbml: true,
                version: 'v25.0'
            })
        };
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) return
            js = d.createElement(s); js.id = id
            js.src = "https://connect.facebook.net/en_US/sdk.js"
            fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
    }, [])

    useEffect(() => {
        if (activeStep === 4) {
            const fetchInsights = async () => {
                const token = localStorage.getItem('authToken')
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
                try {
                    const res = await fetch(`${apiBaseUrl}/meta/insights`, { headers })
                    if (res.ok) {
                        const data = await res.json()
                        setInsightsData({
                            spend: data.spend || 1550.00,
                            reach: data.reach ? `${(data.reach / 1000).toFixed(1)}K` : '6.2K – 18K',
                            impressions: data.impressions || 28540,
                            clicks: data.clicks ? String(data.clicks) : '120 – 310',
                            conversions: data.conversions ? String(data.conversions) : '15 – 45',
                            ctr: data.ctr || 1.25,
                            cpc: data.cpc || 1.50,
                            cpm: data.cpm || 12.00,
                            roas: data.roas || 2.40
                        })
                    }
                } catch (err) {
                    console.error("Error fetching campaign insights:", err)
                }
            }
            fetchInsights()
        }
    }, [activeStep])

    const [activePlatform, setActivePlatform] = useState('facebook') // 'facebook' | 'instagram' | 'stories' | 'reels'
    const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'structure'
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishProgress, setPublishProgress] = useState(0)

    const chatEndRef = useRef(null)
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatMessages, chatIsTyping])

    const triggerToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleSendChatMessage = (textToSubmit) => {
        const text = textToSubmit || chatInput
        if (!text.trim()) return

        const newMsgUser = { sender: 'user', text: text }
        setChatMessages(prev => [...prev, newMsgUser])
        setChatInput('')
        setChatIsTyping(true)

        setTimeout(() => {
            let nextIndex = aiQuestionIndex
            let replyText = ""

            if (aiQuestionIndex === 0) {
                const lowerText = text.toLowerCase()
                let parsedGoal = 'awareness'
                let label = 'Awareness'
                if (lowerText.includes('lead')) { parsedGoal = 'leads'; label = 'Leads'; }
                else if (lowerText.includes('sale') || lowerText.includes('convers')) { parsedGoal = 'sales'; label = 'Sales'; }
                else if (lowerText.includes('traffic') || lowerText.includes('click') || lowerText.includes('websi')) { parsedGoal = 'traffic'; label = 'Traffic'; }
                else if (lowerText.includes('engag') || lowerText.includes('like') || lowerText.includes('comment')) { parsedGoal = 'engagement'; label = 'Engagement'; }
                else if (lowerText.includes('app') || lowerText.includes('promo')) { parsedGoal = 'app_promotion'; label = 'App Promotion'; }

                setCampaign(prev => ({
                    ...prev,
                    objective: parsedGoal,
                    name: `AI Generated ${label} Campaign`
                }))

                replyText = `Great! I've set your campaign goal to **${label}**.\n\nNext, what is your target daily budget? (e.g., $20, $50, $100)`
                nextIndex = 1
            } else if (aiQuestionIndex === 1) {
                const numbers = text.match(/\d+(\.\d+)?/)
                let budgetVal = "50.00"
                if (numbers) {
                    budgetVal = parseFloat(numbers[0]).toFixed(2)
                }

                setCampaign(prev => ({ ...prev, dailyBudget: budgetVal }))
                setAdSet(prev => ({ ...prev, dailyBudget: budgetVal }))

                replyText = `Perfect! Budget set to **$${budgetVal} Daily**.\n\nNow, let's configure your audience. What target location or country would you like to focus on? (e.g., India, USA, Global)`
                nextIndex = 2
            } else if (aiQuestionIndex === 2) {
                const loc = text.trim()
                setAdSet(prev => ({ ...prev, locations: [loc] }))

                replyText = `Got it! Targeting **${loc}**.\n\nWhat is the target age range for this campaign? (e.g., 18-65, 25-50)`
                nextIndex = 3
            } else if (aiQuestionIndex === 3) {
                const matches = text.match(/\d+/g)
                let min = 18
                let max = 65
                if (matches && matches.length >= 2) {
                    min = parseInt(matches[0])
                    max = parseInt(matches[1])
                } else if (matches && matches.length === 1) {
                    min = parseInt(matches[0])
                }

                setAdSet(prev => ({ ...prev, ageMin: min, ageMax: max }))

                replyText = `Audience configured! Age range set to **${min} - ${max}+**.\n\nNext, what website URL should we direct users to? (e.g., https://poweva.com/collection)`
                nextIndex = 4
            } else if (aiQuestionIndex === 4) {
                let url = text.trim()
                if (!/^https?:\/\//i.test(url)) {
                    url = 'https://' + url
                }
                setAdCreative(prev => ({ ...prev, websiteUrl: url }))

                replyText = `URL saved: **${url}**.\n\nLet's write your ad text. What is the primary message or hook for your ad creative? (e.g., 'Discover our new collection designed for performance and style.')`
                nextIndex = 5
            } else if (aiQuestionIndex === 5) {
                const primary = text.trim()
                setAdCreative(prev => ({ ...prev, primaryText: primary }))

                replyText = `Primary text configured!\n\nNow, write a short, catchy Headline for the ad. (e.g., 'Elevate Your Performance')`
                nextIndex = 6
            } else if (aiQuestionIndex === 6) {
                const head = text.trim()
                setAdCreative(prev => ({ ...prev, headline: head }))

                replyText = `Headline configured: "${head}".\n\nWrite a brief description or secondary message. (e.g., 'High quality • Best Price')`
                nextIndex = 7
            } else if (aiQuestionIndex === 7) {
                const desc = text.trim()
                setAdCreative(prev => ({ ...prev, description: desc }))

                replyText = `Description saved!\n\nFinally, which Call-To-Action (CTA) label matches best? (Learn More, Shop Now, Sign Up, Contact Us, Book Now)`
                nextIndex = 8
            } else if (aiQuestionIndex === 8) {
                const lowerText = text.toLowerCase()
                let parsedCta = 'Learn More'
                if (lowerText.includes('shop')) parsedCta = 'Shop Now'
                else if (lowerText.includes('sign')) parsedCta = 'Sign Up'
                else if (lowerText.includes('contact')) parsedCta = 'Contact Us'
                else if (lowerText.includes('book')) parsedCta = 'Book Now'
                else if (lowerText.includes('apply')) parsedCta = 'Apply Now'

                setAdCreative(prev => ({ ...prev, cta: parsedCta }))

                replyText = `All details set! I have configured the CTA to **${parsedCta}**.\n\nYour Campaign configuration is complete and the ad has been created. Click the button below to view the final review screen and publish your campaign.`
                nextIndex = 9
            }

            setChatIsTyping(false)
            setAiQuestionIndex(nextIndex)
            setChatMessages(prev => [...prev, { sender: 'ai', text: replyText }])
        }, 1200)
    }

    const handleSaveDraft = async () => {
        const token = localStorage.getItem('authToken')
        const headers = token ? { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {}
        
        try {
            const res = await fetch(`${apiBaseUrl}/meta/campaigns`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: campaign.name,
                    objective: campaign.objective,
                    status: 'PAUSED',
                    dailyBudget: campaign.dailyBudget,
                    lifetimeBudget: campaign.lifetimeBudget,
                    budgetType: campaign.budgetType
                })
            })
            if (res.ok) {
                triggerToast("Campaign draft saved to Meta server!")
            } else {
                triggerToast("Draft saved locally (Offline)")
            }
        } catch (err) {
            console.error("Error saving campaign draft:", err)
            triggerToast("Draft saved locally (Offline)")
        }
    }

    const handlePublish = async () => {
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

        const token = localStorage.getItem('authToken')
        const headers = token ? { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {}

        try {
            await fetch(`${apiBaseUrl}/meta/campaigns`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: campaign.name,
                    objective: campaign.objective,
                    status: 'ACTIVE',
                    dailyBudget: campaign.dailyBudget,
                    lifetimeBudget: campaign.lifetimeBudget,
                    budgetType: campaign.budgetType
                })
            })
            triggerToast("Campaign published live to Meta networks!")
        } catch (err) {
            console.error("Error publishing campaign:", err)
            triggerToast("Failed to upload active assets to Meta servers.")
        }
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

    // Helper to render rating dots
    const renderDots = (filled, colorClass = 'bg-blue-600') => {
        return (
            <div className="flex gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < filled ? colorClass : 'bg-slate-200'}`} />
                ))}
            </div>
        )
    }

    const connectedCount = Object.values(integrations).filter(item => item.connected && !item.needsAttention).length;

    return creationMode === 'select' ? (
        <div className="meta-ads-workspace w-full h-full flex flex-col overflow-y-auto text-slate-800 bg-[#f8fafc] p-8 select-none">
            <div className="max-w-6xl w-full mx-auto space-y-8 animate-fadeIn py-6">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
                    <div className="space-y-3 z-10 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
                                <span className="material-symbols-outlined text-[26px]! font-black">campaign</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-905 tracking-tight leading-none">Campaign Creation</h1>
                                <p className="text-[10px] text-slate-450 font-bold mt-1.5 uppercase tracking-wider">Choose your approach</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xl">
                            Choose how you want to build and configure your marketing campaign. You can create it manually with full control or let AI do the heavy lifting.
                        </p>
                        <div className="pt-1">
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('compares-table');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[15px]! font-black">article</span>
                                Not sure which to choose? Compare options
                                <span className="material-symbols-outlined text-[13px]! font-black">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Right decorative chart */}
                    <div className="hidden md:flex items-center gap-6 relative select-none pr-4 shrink-0 z-10">
                        <div className="w-48 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 border border-slate-200/60 rounded-2xl p-3 flex flex-col justify-between shadow-2xs relative rotate-2 hover:rotate-0 transition-transform">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-100/50 px-2 py-0.5 rounded-md">AI Insights</span>
                                <span className="material-symbols-outlined text-purple-500 text-[15px]! font-black animate-pulse">auto_awesome</span>
                            </div>
                            <div className="flex items-end gap-1.5 h-12 pt-2">
                                <div className="w-2.5 h-6 bg-blue-300 rounded-xs animate-pulse" />
                                <div className="w-2.5 h-10 bg-indigo-400 rounded-sm animate-pulse delay-75" />
                                <div className="w-2.5 h-8 bg-blue-500 rounded-sm animate-pulse delay-150" />
                                <div className="w-2.5 h-12 bg-indigo-600 rounded-sm animate-pulse delay-200" />
                                <div className="flex-1 text-right text-[11px] font-black text-slate-800 pr-1 pb-1">84% <span className="text-[8px] text-emerald-600 font-bold block">+12%</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CARD SELECTION SECTION ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option 1: Create Manually */}
                    <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-sm relative flex flex-col justify-between space-y-6 text-left group">
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <span className="material-symbols-outlined text-[16px]! font-black">check</span>
                        </div>
                        
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[24px]! font-black">edit_note</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-800">Create Manually</h3>
                                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Step-by-step Setup Wizard</p>
                                    </div>
                                </div>
                                
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Configure every detail of your campaign manually with full control and advanced options.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                                    {[
                                        'Full campaign control',
                                        'Custom Budget & schedule',
                                        'Advanced targeting',
                                        'Manual optimization'
                                    ].map(f => (
                                        <div key={f} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold">
                                            <span className="material-symbols-outlined text-[13px]! text-blue-500 font-black">check</span>
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Miniature visual */}
                            <div className="hidden lg:block w-32 h-28 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 relative select-none shrink-0 overflow-hidden shadow-2xs">
                                <div className="h-3 w-8 bg-blue-100 rounded-xs mb-2" />
                                <div className="space-y-1.5">
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                                    <div className="h-1.5 w-10/12 bg-slate-200 rounded-full" />
                                    <div className="h-4 w-full bg-white border border-slate-200 rounded-xs flex items-center px-1">
                                        <div className="h-1 w-6 bg-slate-350 rounded-full" />
                                    </div>
                                    <div className="flex gap-1.5 pt-1">
                                        <div className="h-3 w-7 bg-blue-600 rounded-xs" />
                                        <div className="h-3 w-7 bg-slate-200 rounded-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
                                <span className="material-symbols-outlined text-[14px]! text-slate-450 font-black">schedule</span>
                                <span className="text-[10px] text-slate-550 font-bold">Estimated time: <span className="text-slate-700 font-black">2 - 5 min</span></span>
                            </div>
                            <button
                                onClick={() => setCampaignModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md hover:translate-x-0.5"
                            >
                                Configure Manually
                                <span className="material-symbols-outlined text-[13px]! font-black">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>

                    {/* Option 2: Create with AI */}
                    <div className="bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between space-y-6 text-left group">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[24px]! font-black">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-800">Create with AI</h3>
                                        <p className="text-[9px] text-purple-600 font-bold uppercase tracking-wider">Conversational AI Builder</p>
                                    </div>
                                </div>
                                
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Answer a few questions and our AI will build an optimized campaign for you.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                                    {[
                                        'AI audience suggestions',
                                        'Creative ideas',
                                        'Budget recommendations',
                                        'Targeting optimization'
                                    ].map(f => (
                                        <div key={f} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold">
                                            <span className="material-symbols-outlined text-[13px]! text-purple-500 font-black">check</span>
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Robot visual */}
                            <div className="hidden lg:block w-32 h-28 relative select-none shrink-0 overflow-hidden">
                                <svg className="w-full h-full animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(10, 5)">
                                        <rect x="25" y="45" width="30" height="25" rx="8" fill="#F3E8FF" stroke="#A78BFA" strokeWidth="2" />
                                        <rect x="33" y="52" width="14" height="10" rx="3" fill="#E9D5FF" />
                                        <circle cx="40" cy="57" r="2" fill="#7C3AED" />
                                        
                                        <rect x="20" y="15" width="40" height="25" rx="10" fill="#E8EDFF" stroke="#3B82F6" strokeWidth="2.5" />
                                        <rect x="28" y="22" width="24" height="10" rx="5" fill="#1E293B" />
                                        <circle cx="34" cy="27" r="2.5" fill="#38BDF8" className="animate-pulse" />
                                        <circle cx="46" cy="27" r="2.5" fill="#38BDF8" className="animate-pulse" />
                                        
                                        <line x1="40" y1="15" x2="40" y2="8" stroke="#3B82F6" strokeWidth="2.5" />
                                        <circle cx="40" cy="7" r="3.5" fill="#F43F5E" className="animate-pulse" />
                                        <rect x="16" y="23" width="4" height="8" rx="1" fill="#94A3B8" />
                                        <rect x="60" y="23" width="4" height="8" rx="1" fill="#94A3B8" />
                                        
                                        <path d="M 25,52 Q 15,55 18,65" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
                                        <path d="M 55,52 Q 65,55 62,65" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
                                <span className="material-symbols-outlined text-[14px]! text-slate-450 font-black">schedule</span>
                                <span className="text-[10px] text-slate-555 font-bold">Estimated time: <span className="text-slate-700 font-black">45 sec</span></span>
                            </div>
                            <button
                                onClick={() => {
                                    setCreationMode('ai')
                                    setAiQuestionIndex(0)
                                    setChatMessages([
                                        { sender: 'ai', text: "Hi there! I am your AI Campaign Builder. Let's configure an optimized ads campaign together.\n\nFirst, what is your primary goal or objective for this campaign? (Awareness, Traffic, Engagement, Leads, App Promotion, or Sales)" }
                                    ])
                                    triggerToast("AI campaign mode activated.")
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 border border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-650 text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                                Start AI Builder
                                <span className="material-symbols-outlined text-[13px]! font-black">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── LAYOUT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    {/* Left Column (col-span-2) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Comparison Table */}
                        <div id="compares-table" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4 scroll-mt-6">
                            <div>
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">How it compares</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Choose the best option for your needs.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[10px] text-slate-450 font-extrabold uppercase tracking-wider text-center">
                                            <th className="py-2.5 text-left font-black w-24">Approach</th>
                                            <th className="py-2.5">Speed</th>
                                            <th className="py-2.5">Control</th>
                                            <th className="py-2.5">Beginner Friendly</th>
                                            <th className="py-2.5">Customization</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/65 text-[11px]">
                                        <tr className="hover:bg-slate-50/40 transition-colors text-center">
                                            <td className="py-3 text-left font-black text-slate-700">Manual</td>
                                            <td className="py-3 text-amber-500 font-extrabold">⚡⚡</td>
                                            <td className="py-3">{renderDots(4, 'bg-blue-600')}</td>
                                            <td className="py-3">{renderDots(2, 'bg-blue-600')}</td>
                                            <td className="py-3">{renderDots(5, 'bg-blue-600')}</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/40 transition-colors text-center">
                                            <td className="py-3 text-left font-black text-slate-700">AI</td>
                                            <td className="py-3 text-amber-500 font-extrabold">⚡⚡⚡⚡</td>
                                            <td className="py-3">{renderDots(2, 'bg-purple-600')}</td>
                                            <td className="py-3">{renderDots(5, 'bg-purple-600')}</td>
                                            <td className="py-3">{renderDots(2, 'bg-purple-600')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                                <div className="space-y-1 text-left min-w-0">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block truncate">Ad Spend</span>
                                    <div className="text-lg font-black text-slate-805">${Number(insightsData.spend || 0).toFixed(2)}</div>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]! font-black">payments</span>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                                <div className="space-y-1 text-left min-w-0">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block truncate">Impressions</span>
                                    <div className="text-lg font-black text-slate-805">{Number(insightsData.impressions || 0).toLocaleString()}</div>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]! font-black">visibility</span>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                                <div className="space-y-1 text-left min-w-0">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block truncate">Clicks</span>
                                    <div className="text-lg font-black text-slate-850">{Number(insightsData.clicks || 0).toLocaleString()}</div>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]! font-black">ads_click</span>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                                <div className="space-y-1 text-left min-w-0">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block truncate">Lead Counts</span>
                                    <div className="text-lg font-black text-slate-850">{Number(insightsData.conversions || insightsData.leads || 0).toLocaleString()}</div>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]! font-black">contact_mail</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Drafts */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recent Drafts</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Pick up where you left off.</p>
                                </div>
                                <button 
                                    onClick={() => triggerToast("Viewing all drafts...")}
                                    className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline font-bold cursor-pointer"
                                >
                                    View All
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {[
                                    { id: 'draft-1', name: 'Summer Collection Traffic', objective: 'traffic', timeText: 'Updated Yesterday, 3:30 PM', logo: 'public', color: 'bg-blue-600' },
                                    { id: 'draft-2', name: 'iPhone 15 Launch Campaign', objective: 'sales', timeText: 'Updated May 20, 2026', logo: 'smart_display', color: 'bg-red-500' },
                                    { id: 'draft-3', name: 'LMS - Business Coaching', objective: 'leads', timeText: 'Updated May 18, 2026', logo: 'work', color: 'bg-blue-800' }
                                ].map(draft => (
                                    <div key={draft.id} className="border border-slate-100 hover:border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-8 h-8 rounded-xl ${draft.color} text-white flex items-center justify-center shrink-0`}>
                                                <span className="material-symbols-outlined text-[16px]! font-black">{draft.logo}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[11.5px] font-black text-slate-850 truncate">{draft.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] text-slate-400 font-bold">
                                                    <span className="capitalize text-blue-600/80 bg-blue-50 px-1.5 py-0.2 rounded-md font-extrabold">{draft.objective}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{draft.timeText}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => {
                                                    setCampaign(prev => ({
                                                        ...prev,
                                                        name: draft.name,
                                                        objective: draft.objective
                                                    }))
                                                    setCreationMode('manual')
                                                    setActiveStep(1)
                                                    triggerToast(`Resuming draft campaign: ${draft.name}`)
                                                }}
                                                className="px-3 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-600 hover:text-white text-slate-700 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer"
                                            >
                                                Continue
                                            </button>
                                            <button 
                                                onClick={() => triggerToast("Action menu opened.")}
                                                className="w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[14px]! font-black">more_vert</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Start From Template */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Start From Template</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Pre-built campaigns to get you started.</p>
                                </div>
                                <button 
                                    onClick={() => triggerToast("Viewing all templates...")}
                                    className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline font-bold cursor-pointer"
                                >
                                    View All Templates
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'tpl-1', name: 'E-commerce Sales', desc: 'Drive sales for your store', objective: 'sales', icon: 'shopping_bag', defaultName: 'E-commerce Sales Campaign', color: 'text-rose-500 bg-rose-50' },
                                    { id: 'tpl-2', name: 'App Install', desc: 'Get more installs', objective: 'app_promotion', icon: 'phone_android', defaultName: 'App Install Campaign', color: 'text-indigo-500 bg-indigo-50' },
                                    { id: 'tpl-3', name: 'Lead Generation', desc: 'Generate quality leads', objective: 'leads', icon: 'contact_mail', defaultName: 'Lead Generation Campaign', color: 'text-emerald-500 bg-emerald-50' },
                                    { id: 'tpl-4', name: 'Website Traffic', desc: 'Increase visitors', objective: 'traffic', icon: 'language', defaultName: 'Website Traffic Campaign', color: 'text-sky-500 bg-sky-50' },
                                    { id: 'tpl-5', name: 'Engagement', desc: 'Boost posts & likes', objective: 'favorite', defaultName: 'Engagement Campaign', icon: 'favorite', color: 'text-pink-500 bg-pink-50' },
                                    { id: 'tpl-6', name: 'Local Business', desc: 'Promote local services', objective: 'awareness', defaultName: 'Local Business Promotion', icon: 'storefront', color: 'text-amber-500 bg-amber-50' }
                                ].map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => {
                                            setCampaign(prev => ({
                                                ...prev,
                                                name: template.defaultName,
                                                objective: template.objective
                                            }))
                                            setCreationMode('manual')
                                            setActiveStep(1)
                                            triggerToast(`Initialized template: ${template.name}`)
                                        }}
                                        className="border border-slate-100 hover:border-blue-200 hover:bg-blue-50/10 p-4 rounded-2xl flex flex-col text-left space-y-2 cursor-pointer transition-all hover:shadow-2xs group"
                                    >
                                        <div className={`w-8 h-8 rounded-xl ${template.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                                            <span className="material-symbols-outlined text-[16px]! font-black">{template.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-slate-805 group-hover:text-blue-600 transition-colors leading-snug">{template.name}</h4>
                                            <p className="text-[9px] text-slate-400 font-medium leading-normal mt-0.5">{template.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Connected Ad Networks sidebar (col-span-1) */}
                    <div className="lg:col-span-1">
                        <div id="ad-networks-sidebar" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs text-left space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Connected Ad Networks</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Manage connections and permissions.</p>
                                </div>
                                <button 
                                    onClick={() => triggerToast("Managing all connections...")}
                                    className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline font-bold cursor-pointer"
                                >
                                    Manage All
                                </button>
                            </div>
                            
                            <div className="space-y-4 divide-y divide-slate-100">
                                {[
                                    { key: 'meta', label: 'Meta Ads', desc: 'Facebook & Instagram', icon: 'public', color: 'bg-blue-600' },
                                    { key: 'google', label: 'Google Ads', desc: 'YouTube & Search', icon: 'smart_display', color: 'bg-red-500' },
                                    { key: 'tiktok', label: 'TikTok Ads', desc: 'Short Video Feed', icon: 'movie', color: 'bg-slate-900' },
                                    { key: 'linkedin', label: 'LinkedIn Ads', desc: 'B2B Professional Network', icon: 'work', color: 'bg-blue-800' }
                                ].map((platform, idx) => {
                                    const connData = integrations[platform.key]
                                    const isConnected = connData.connected
                                    const isNeedsAttention = connData.needsAttention
                                    
                                    return (
                                        <div key={platform.key} className={`flex flex-col space-y-3 ${idx > 0 ? 'pt-4' : ''}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-xl ${platform.color} text-white flex items-center justify-center shrink-0`}>
                                                        <span className="material-symbols-outlined text-[16px]! font-black">{platform.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-slate-800 leading-snug">{platform.label}</h4>
                                                        <p className="text-[9px] text-slate-400 font-medium">{platform.desc}</p>
                                                    </div>
                                                </div>
                                                
                                                {isNeedsAttention ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[8.5px] font-extrabold flex items-center gap-1 select-none">
                                                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                                        Needs Attention
                                                    </span>
                                                ) : isConnected ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8.5px] font-extrabold flex items-center gap-1 select-none">
                                                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                        Connected
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-505 text-[8.5px] font-extrabold select-none">
                                                        Not Connected
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {isNeedsAttention ? (
                                                <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-[9px] text-slate-505 space-y-0.5">
                                                    <div className="font-extrabold text-slate-700 truncate">{connData.accountName}</div>
                                                    <div className="text-[8px] text-amber-600 font-extrabold flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[11px]! font-black">warning</span>
                                                        {connData.expiresLabel}
                                                    </div>
                                                    <div className="font-bold text-slate-400">{connData.adAccountsCount} Ad Account</div>
                                                </div>
                                            ) : isConnected ? (
                                                <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-[9px] text-slate-555 space-y-2 text-left">
                                                    {platform.key === 'meta' && connData.facebookUser && (
                                                        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-150">
                                                            {connData.facebookUser.picture ? (
                                                                <img src={connData.facebookUser.picture} alt="FB Profile" className="w-5 h-5 rounded-full border border-slate-200" />
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7.5px] font-black uppercase shrink-0">
                                                                    {connData.facebookUser.name?.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col truncate">
                                                                <span className="font-black text-slate-700 text-[9.5px] leading-tight truncate">{connData.facebookUser.name}</span>
                                                                <span className="font-mono text-[7px] text-slate-400 leading-none">User ID: {connData.facebookUser.id}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="font-extrabold text-slate-700 truncate">{connData.accountName}</div>
                                                    <div className="font-mono text-[8px] text-slate-400">ID: {connData.adsAccountId}</div>
                                                    
                                                    {platform.key === 'meta' && (
                                                        <div className="space-y-1.5 pt-1 border-t border-slate-150 text-left">
                                                            <div className="flex flex-col gap-0.5">
                                                                <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Active Ad Account</label>
                                                                <select 
                                                                    value={selectedAdAccount} 
                                                                    onChange={(e) => handleAdAccountChange(e.target.value)}
                                                                    className="w-full text-[9px] border border-slate-200 rounded-lg p-1 bg-white outline-none font-bold text-slate-750"
                                                                >
                                                                    {adAccountsList.map(acc => (
                                                                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-0.5">
                                                                <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Active Page</label>
                                                                <select 
                                                                    value={selectedPage} 
                                                                    onChange={(e) => handlePageChange(e.target.value)}
                                                                    className="w-full text-[9px] border border-slate-200 rounded-lg p-1 bg-white outline-none font-bold text-slate-750"
                                                                >
                                                                    {facebookPagesList.map(page => (
                                                                        <option key={page.id} value={page.id}>{page.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {platform.key !== 'meta' && (
                                                        <div className="flex gap-2 text-[8px] text-slate-400 font-bold mt-1">
                                                            {platform.key === 'google' && <span>{connData.campaignsCount} Campaigns</span>}
                                                            <span>{connData.adAccountsCount} Ad Accounts</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 border border-dashed border-slate-200 p-3 rounded-xl text-[9px] text-slate-400 text-center leading-normal text-left">
                                                    Link your advertising account to enable publishing.
                                                </div>
                                            )}
                                            
                                            <div className="text-right">
                                                {isNeedsAttention ? (
                                                    <button
                                                        onClick={() => {
                                                            setAuthTempName(connData.accountName)
                                                            setAuthTempId(connData.adsAccountId)
                                                            setAuthModalPlatform(platform.key)
                                                            setEditCredentialsMode(true)
                                                        }}
                                                        className="inline-flex items-center gap-0.5 text-[9.5px] text-amber-700 hover:text-amber-800 font-extrabold cursor-pointer hover:underline"
                                                    >
                                                        Reconnect
                                                        <span className="material-symbols-outlined text-[11px]! font-black">arrow_right_alt</span>
                                                    </button>
                                                ) : isConnected ? (
                                                    <div className="flex items-center justify-between">
                                                        <button
                                                            onClick={() => {
                                                                setIntegrations(prev => ({
                                                                    ...prev,
                                                                    [platform.key]: { connected: false, accountName: null, adsAccountId: null }
                                                                }))
                                                                triggerToast(`Disconnected ${platform.label} account.`)
                                                            }}
                                                            className="text-[9.5px] text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                                                        >
                                                            Disconnect
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAuthTempName(connData.accountName)
                                                                setAuthTempId(connData.adsAccountId)
                                                                setAuthModalPlatform(platform.key)
                                                                setEditCredentialsMode(false)
                                                            }}
                                                            className="inline-flex items-center gap-0.5 text-[9.5px] text-blue-600 hover:text-blue-700 font-extrabold cursor-pointer hover:underline"
                                                        >
                                                            Configure
                                                            <span className="material-symbols-outlined text-[11px]! font-black">arrow_right_alt</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (platform.key === 'meta') {
                                                                handleConnectMeta()
                                                            } else {
                                                                setAuthTempName(platform.key === 'google' ? 'Google Sandbox Ads Account' : platform.key === 'tiktok' ? 'TikTok Creator Page' : 'LinkedIn Org Campaign Account')
                                                                setAuthTempId(platform.key === 'google' ? 'ACT-1085-2947' : platform.key === 'tiktok' ? 'ACT-5829-9852' : 'ACT-9852-1985')
                                                                setAuthModalPlatform(platform.key)
                                                                setEditCredentialsMode(true)
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-0.5 text-[9.5px] text-blue-600 hover:text-blue-700 font-extrabold cursor-pointer hover:underline"
                                                    >
                                                        {platform.key === 'meta' ? 'Connect Meta Account' : 'Connect'}
                                                        <span className="material-symbols-outlined text-[11px]! font-black">arrow_right_alt</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {campaignModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 bg-slate-950/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl border border-slate-100 text-left">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">New Meta Campaign</h3>
                            <button 
                                onClick={() => setCampaignModalOpen(false)}
                                className="w-6 h-6 rounded-full border border-slate-150 flex items-center justify-center hover:bg-slate-50 text-slate-400 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[14px]! font-black">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateCampaignSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-450 uppercase">Campaign Name</label>
                                <input 
                                    type="text" 
                                    value={campaignModalForm.name}
                                    onChange={(e) => setCampaignModalForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-white outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-450 uppercase">Daily Budget ($)</label>
                                <input 
                                    type="number" 
                                    value={campaignModalForm.dailyBudget}
                                    onChange={(e) => setCampaignModalForm(prev => ({ ...prev, dailyBudget: e.target.value }))}
                                    className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-white outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-450 uppercase">Objective</label>
                                <select 
                                    value={campaignModalForm.objective}
                                    onChange={(e) => setCampaignModalForm(prev => ({ ...prev, objective: e.target.value }))}
                                    className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-white outline-none font-bold"
                                >
                                    <option value="awareness">Awareness</option>
                                    <option value="leads">Leads</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-450 uppercase">Status</label>
                                <select 
                                    value={campaignModalForm.status}
                                    onChange={(e) => setCampaignModalForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-white outline-none font-bold"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="PAUSED">Paused</option>
                                </select>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setCampaignModalOpen(false)}
                                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                                >
                                    Create Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        {/* ── OAUTH AUTHENTICATION SIMULATOR DIALOG ── */}
        <AnimatePresence>
            {authModalPlatform && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 bg-slate-950/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-5 shadow-2xl border border-slate-100 text-left"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px]! font-black">vpn_key</span>
                                    </div>
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                        {integrations[authModalPlatform].connected ? 'Configure Account' : 'Link Ad Account'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setAuthModalPlatform(null)}
                                    className="w-6 h-6 rounded-full border border-slate-150 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-650 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px]! font-black">close</span>
                                </button>
                            </div>

                            {!editCredentialsMode ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-sm font-bold">✓</div>
                                        <div className="text-left min-w-0">
                                            <div className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Sync Active</div>
                                            <div className="text-xs font-black text-slate-800 truncate">{integrations[authModalPlatform].accountName || 'Connected Ad Account'}</div>
                                            <div className="text-[9px] font-mono text-slate-450">{integrations[authModalPlatform].adsAccountId || 'N/A'}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 text-[11px] text-slate-650 bg-slate-50 p-4 rounded-2xl">
                                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                            <span className="font-semibold text-slate-400">Owner API Profile</span>
                                            <span className="font-extrabold text-slate-700">{PLATFORM_DETAILS[authModalPlatform]?.profile || 'Developer Workspace'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                            <span className="font-semibold text-slate-400">Linked Scopes</span>
                                            <span className="font-extrabold text-slate-700 font-mono text-[9px] uppercase">{PLATFORM_DETAILS[authModalPlatform]?.scopes || 'ads_management'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                            <span className="font-semibold text-slate-400">Connection State</span>
                                            <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                                {PLATFORM_DETAILS[authModalPlatform]?.syncLabel || 'Live Synced'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-slate-400">API Access Token</span>
                                            <span className="font-mono text-[9px] text-slate-400">{PLATFORM_DETAILS[authModalPlatform]?.tokenMask || 'EAAX...ZAAZ'}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setEditCredentialsMode(true)}
                                        className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                                    >
                                        Edit Connection Details
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Account / Page Name</label>
                                        <input
                                            type="text"
                                            value={authTempName}
                                            onChange={e => setAuthTempName(e.target.value)}
                                            className="w-full h-10 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-755 transition-all outline-none"
                                            placeholder="e.g., Brand Facebook Page"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Ad Account ID</label>
                                        <input
                                            type="text"
                                            value={authTempId}
                                            onChange={e => setAuthTempId(e.target.value)}
                                            className="w-full h-10 px-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-755 font-mono transition-all outline-none"
                                            placeholder="e.g., ACT-xxxx-xxxx"
                                        />
                                    </div>

                                    <p className="text-[9px] text-slate-400 leading-normal bg-slate-50 p-3 rounded-2xl">
                                        By connecting your account, you authorize the Campaign manager to fetch metrics, sync dynamic creatives, and upload budget rules.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setAuthModalPlatform(null)}
                                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                                {editCredentialsMode && (
                                    <button
                                        onClick={() => {
                                            setIntegrations(prev => {
                                                const counts = {
                                                    meta: { pagesCount: 3, adAccountsCount: 4 },
                                                    google: { campaignsCount: 2, adAccountsCount: 2 },
                                                    tiktok: { adAccountsCount: 1 },
                                                    linkedin: { adAccountsCount: 1 }
                                                }[authModalPlatform] || {};
                                                return {
                                                    ...prev,
                                                    [authModalPlatform]: {
                                                        connected: true,
                                                        needsAttention: false,
                                                        accountName: authTempName || 'Connected Channel API',
                                                        adsAccountId: authTempId || 'ACT-SIM-9824',
                                                        ...counts
                                                    }
                                                };
                                            });
                                            setAuthModalPlatform(null);
                                            triggerToast(`Authorized account and connected successfully!`);
                                        }}
                                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm animate-pulse"
                                    >
                                        Approve & Link
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    ) : (
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
                        {activeStep === 4 ? 'Publish' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* ── WORKSPACE PANELS ── */}
            {creationMode === 'ai' ? (
                <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-50/30">
                    {/* Left Column: Chat Assistant */}
                    <div className="flex-1 bg-white border-r border-slate-200 flex flex-col min-w-0">
                        {/* Chat header */}
                        <div className="h-14 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-650 font-bold relative flex items-center justify-center animate-fadeIn">
                                    <span className="material-symbols-outlined text-[16px]! font-black animate-pulse">auto_awesome</span>
                                    <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                                </div>
                                <div className="text-left animate-fadeIn">
                                    <div className="text-xs font-black text-slate-800">AI Campaign Builder</div>
                                    <div className="text-[9px] text-slate-450 font-bold flex items-center gap-1">
                                        <span>Agent Online</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase bg-slate-100 px-2 py-0.5 rounded-md select-none">GEMINI PRO</span>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 meta-scroll bg-slate-50/20">
                            {chatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 max-w-[85%] animate-fadeIn ${
                                        msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold leading-none ${
                                        msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {msg.sender === 'user' ? 'ME' : 'AI'}
                                    </div>
                                    <div className={`p-3.5 rounded-2xl text-[11px] leading-relaxed text-left font-medium ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-750 rounded-tl-none shadow-3xs'
                                    }`}>
                                        <p className="whitespace-pre-line">
                                            {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold">{chunk}</strong> : chunk)}
                                        </p>

                                        {/* Completion option button */}
                                        {index === chatMessages.length - 1 && aiQuestionIndex === 9 && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => {
                                                        setCreationMode('manual')
                                                        setActiveStep(4)
                                                        triggerToast("Navigated to Campaign Review!")
                                                    }}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-black rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                                                >
                                                    Go to Review
                                                    <span className="material-symbols-outlined text-[13px]! font-black">arrow_forward</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {chatIsTyping && (
                                <div className="flex items-start gap-3 max-w-[80%] animate-fadeIn">
                                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold bg-slate-200 text-slate-750">
                                        AI
                                    </div>
                                    <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-3xs flex items-center gap-1 px-4 py-3">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot" />
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot" />
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot" />
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Action Suggestion Chips */}
                        {aiQuestionIndex === 0 && (
                            <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto meta-scroll shrink-0">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Quick Goals:</span>
                                {['Awareness', 'Traffic', 'Engagement', 'Leads', 'Sales'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => handleSendChatMessage(g)}
                                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-full shrink-0 shadow-2xs transition-colors cursor-pointer"
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        )}

                        {aiQuestionIndex === 8 && (
                            <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto meta-scroll shrink-0">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Quick CTAs:</span>
                                {['Learn More', 'Shop Now', 'Sign Up', 'Contact Us'].map(cta => (
                                    <button
                                        key={cta}
                                        onClick={() => handleSendChatMessage(cta)}
                                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-full shrink-0 shadow-2xs transition-colors cursor-pointer"
                                    >
                                        {cta}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Chat input box */}
                        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !chatIsTyping) {
                                            handleSendChatMessage()
                                        }
                                    }}
                                    disabled={chatIsTyping || aiQuestionIndex === 9}
                                    placeholder={
                                        aiQuestionIndex === 9
                                            ? "Campaign builder complete!"
                                            : "Type your message here..."
                                    }
                                    className="w-full h-11 pl-4 pr-12 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl text-xs font-semibold text-slate-755 transition-all outline-none disabled:bg-slate-50 disabled:text-slate-400"
                                />
                                <button
                                    onClick={() => handleSendChatMessage()}
                                    disabled={chatIsTyping || !chatInput.trim() || aiQuestionIndex === 9}
                                    className="absolute right-2 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <span className="material-symbols-outlined text-[15px]! font-black">send</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Ad Preview */}
                    <div className="w-[380px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0">
                        <div className="flex-1 overflow-y-auto p-6 space-y-5 meta-scroll text-left">
                            <div className="flex items-center gap-1.5 text-[11.5px] font-black text-slate-900 tracking-tight select-none">
                                <span>Ad Preview</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400 cursor-help" title="Preview updates live as you answer AI questions.">info</span>
                            </div>

                            {/* Platform Selector */}
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
                                                {p.icon === 'facebook' ? (
                                                    <span className="material-symbols-outlined text-[18px]! font-black">public</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[18px]! font-black">{p.icon}</span>
                                                )}
                                            </div>
                                            <span className={`text-[8.5px] font-extrabold leading-tight text-center ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-650'}`}>
                                                {p.label}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Mockup Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0 animate-fadeIn">
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
                                <div className="px-3.5 pb-3 text-[10.5px] leading-relaxed text-slate-700 font-medium select-text">
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
                                            {adCreative.websiteUrl ? adCreative.websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0].toUpperCase() : 'YOURWEBSITE.COM'}
                                        </p>
                                        <h4 className="text-[11px] font-black text-slate-800 truncate mt-0.5">{adCreative.headline}</h4>
                                        <p className="text-[9px] text-slate-455 truncate mt-0.5 font-medium">{adCreative.description}</p>
                                    </div>
                                    <button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[9.5px] font-black text-slate-700 rounded shadow-sm shrink-0 select-none cursor-pointer">
                                        {adCreative.cta}
                                    </button>
                                </div>
                            </div>

                            {/* Active variation selector thumbnails */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ad Media Variation</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {SHOE_VARIATIONS.map((v, i) => {
                                        const isSel = selectedVariation === i
                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariation(i)}
                                                className={`aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                                                    isSel ? 'border-blue-500 shadow-sm scale-98' : 'border-slate-200 hover:border-slate-350'
                                                }`}
                                            >
                                                <img src={v.url} alt={v.name} className="w-full h-full object-cover" />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Campaign Parameters Summary Panel */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5 shadow-2xs">
                                <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider block">Extracted Parameters</span>
                                <div className="space-y-2.5 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Objective</span>
                                        <span className="font-extrabold text-slate-800 capitalize">{campaign.objective}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Budget</span>
                                        <span className="font-extrabold text-slate-800">${campaign.dailyBudget} / day</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Target Location</span>
                                        <span className="font-extrabold text-slate-800">{adSet.locations.join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-400">Age Bracket</span>
                                        <span className="font-extrabold text-slate-800">{adSet.ageMin} - {adSet.ageMax} yrs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
                                            <span className="material-symbols-outlined text-[14px]! text-blue-600 absolute left-2.5 top-1/2 -translate-y-1/2">facebook</span>
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
                                            <span className="material-symbols-outlined text-[14px]! text-pink-500 absolute left-2.5 top-1/2 -translate-y-1/2">photo_camera</span>
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
                                <span className="material-symbols-outlined text-[14px]! text-slate-400 cursor-help" title="Preview of your ad across placements.">info</span>
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
                                        <div className="text-xs font-black text-slate-800">{insightsData.reach}</div>
                                        <span className="material-symbols-outlined text-[15px]! text-slate-400">group</span>
                                    </div>
                                    <div className="space-y-1 border-x border-slate-100">
                                        <div className="text-[10px] font-semibold text-slate-400">Est. Clicks</div>
                                        <div className="text-xs font-black text-slate-800">{insightsData.clicks}</div>
                                        <span className="material-symbols-outlined text-[15px]! text-slate-400 font-bold">ads_click</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-semibold text-slate-400">Conversions</div>
                                        <div className="text-xs font-black text-slate-800">{insightsData.conversions}</div>
                                        <span className="material-symbols-outlined text-[15px]! text-slate-400 font-bold">show_chart</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Audience Overview */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-850 tracking-tight uppercase">Audience Overview</span>
                                    <span className="material-symbols-outlined text-[14px]! text-slate-400 cursor-pointer hover:text-slate-655" title="Audience Information">info</span>
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
                                        <span className="font-extrabold text-slate-800">
                                            {insightsData.spend ? '$' + Number(insightsData.spend).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '$1,550.00'}
                                        </span>
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
                                    <span className="material-symbols-outlined text-[14px]! text-slate-400 cursor-pointer hover:text-slate-655" title="Audience Information">info</span>
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
                                    <button onClick={() => triggerToast("Direct edit budget shortcut triggered.")} className="material-symbols-outlined text-[14px]! text-slate-450 cursor-pointer hover:text-slate-650">edit</button>
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
                                                <span className="material-symbols-outlined text-[14px]! text-slate-400 cursor-pointer hover:text-slate-650" title="Audience Information">info</span>
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
            )}

            {/* ── WIZARD CONTROLS FOOTER ── */}
            {creationMode === 'manual' && (
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
            )}

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
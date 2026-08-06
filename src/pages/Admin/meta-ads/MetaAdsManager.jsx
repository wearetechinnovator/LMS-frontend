import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../../../components/Icon'
import lottie from 'lottie-web'
import assistantBotAnimation from '../../../assets/Assistant-Bot.json'
import marketingAnimation from '../../../assets/marketing.json'
import salesAnimation from '../../../assets/Sales.json'
import searchForEmployeeAnimation from '../../../assets/search_for_employee.json'
import socialMediaInfluencerAnimation from '../../../assets/Social_Media_Influencer.json'
import socialMediaInteractionAnimation from '../../../assets/Social_Media_Interaction.json'
import socialMediaMarketingAnnouncementAnimation from '../../../assets/Social_Media_Marketing_announcement.json'
import websiteAnimation from '../../../assets/website.json'
import './meta-ads.css'

const LottieAnimation = ({ animationData }) => {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        let anim
        try {
            anim = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            })
        } catch (err) {
            console.error("Lottie failed to load animation:", err)
        }

        return () => {
            if (anim) anim.destroy()
        }
    }, [animationData])

    return <div ref={containerRef} className="w-full h-full" />
}

const toastStyles = "fixed bottom-6 right-6 px-4 py-3 bg-[#0f172a] text-white text-[11px] font-bold rounded-xl shadow-lg flex items-center gap-2 z-[9999] border border-white/5 animate-fadeIn"

const OBJECTIVES = [
    { id: 'awareness', label: 'Awareness', icon: 'campaign', desc: 'Increase brand awareness' },
    { id: 'traffic', label: 'Traffic', icon: 'navigation', desc: 'Drive traffic to your website' },
    { id: 'engagement', label: 'Engagement', icon: 'thumb_up', desc: 'Get more engagement on your content' },
    { id: 'leads', label: 'Leads', icon: 'person_add', desc: 'Generate leads and collect contacts' },
    { id: 'app_promotion', label: 'App Promotion', icon: 'phone_iphone', desc: 'Promote your app installs and activity' },
    { id: 'sales', label: 'Sales', icon: 'shopping_bag', desc: 'Increase sales and conversions' }
]

const OBJECTIVE_OPTIONS = [
    {
        value: 'awareness',
        icon: 'campaign',
        title: 'Awareness',
        description: 'Show your ads to people who are most likely to remember them.',
        tags: ['Reach', 'Brand awareness', 'Video views'],
        illBg: '#d1fae5',
        animationData: socialMediaMarketingAnnouncementAnimation
    },
    {
        value: 'traffic',
        icon: 'arrow_selector_tool',
        title: 'Traffic',
        description: 'Send people to a destination, such as your website, app, Instagram profile or Facebook event.',
        tags: ['Link clicks', 'Landing page views', 'Instagram profile visits', 'Messenger, Instagram and WhatsApp', 'Calls'],
        illBg: '#fef3c7',
        animationData: websiteAnimation
    },
    {
        value: 'engagement',
        icon: 'chat',
        title: 'Engagement',
        description: 'Get more messages, purchases through messaging, video views, interactions, Page likes or event responses.',
        tags: ['Messenger, Instagram and WhatsApp', 'Video views', 'Interactions', 'Conversions'],
        illBg: '#dbeafe',
        animationData: socialMediaInteractionAnimation
    },
    {
        value: 'leads',
        icon: 'filter_alt',
        title: 'Leads',
        description: 'Collect leads for your business or brand.',
        tags: ['Website and instant forms', 'Instant forms', 'Messenger, Instagram and WhatsApp', 'Conversions', 'Calls'],
        illBg: '#ffedd5',
        animationData: searchForEmployeeAnimation
    },
    {
        value: 'app_promotion',
        icon: 'install_mobile',
        title: 'App promotion',
        description: 'Find new people to install your app and continue using it.',
        tags: ['App installs', 'App events'],
        illBg: '#f3e8ff',
        animationData: socialMediaInfluencerAnimation
    },
    {
        value: 'sales',
        icon: 'shopping_bag',
        title: 'Sales',
        description: 'Find people likely to purchase your product or service.',
        tags: ['Conversions', 'Catalog sales', 'Messenger, Instagram and WhatsApp', 'Calls'],
        illBg: '#fee2e2',
        animationData: salesAnimation
    }
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

const getObjectiveDetails = (obj) => {
    const o = (obj || '').toUpperCase();
    if (o.includes('AWARENESS')) return { logo: 'campaign', color: 'bg-blue-600', label: 'Awareness' };
    if (o.includes('TRAFFIC')) return { logo: 'navigation', color: 'bg-emerald-500', label: 'Traffic' };
    if (o.includes('ENGAGEMENT')) return { logo: 'thumb_up', color: 'bg-orange-500', label: 'Engagement' };
    if (o.includes('LEAD')) return { logo: 'person_add', color: 'bg-blue-800', label: 'Leads' };
    if (o.includes('APP')) return { logo: 'phone_iphone', color: 'bg-pink-600', label: 'App Promotion' };
    if (o.includes('SALE')) return { logo: 'shopping_bag', color: 'bg-red-500', label: 'Sales' };
    return { logo: 'campaign', color: 'bg-slate-500', label: 'Awareness' };
}
const ToggleSwitch = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 cursor-pointer ${checked ? 'bg-blue-600' : 'bg-slate-200'
            }`}
    >
        <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
                }`}
        />
    </button>
);

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
        facebookPage: localStorage.getItem('companyName') || '',
        instagramAccount: localStorage.getItem('companyName') ? `@${localStorage.getItem('companyName').toLowerCase().replace(/\s+/g, '')}` : '',
        format: 'single_image', // 'single_image' | 'video' | 'carousel' | 'collection' | 'flexible'
        primaryText: '',
        headline: '',
        description: '',
        cta: 'Learn More',
        websiteUrl: '',
        imageSrc: null
    })

    const [selectedVariation, setSelectedVariation] = useState(0)
    const [creationMode, setCreationMode] = useState('select') // 'select' | 'manual' | 'ai'
    const [chatInput, setChatInput] = useState('')
    const [chatMessages, setChatMessages] = useState([
        { sender: 'ai', text: "Hi there! I am your AI Campaign Builder. Let's configure an optimized ads campaign together.\n\nFirst, what is your primary goal or objective for this campaign? (Awareness, Traffic, Engagement, Leads, App Promotion, or Sales)" }
    ])
    const [aiQuestionIndex, setAiQuestionIndex] = useState(0)
    const [chatIsTyping, setChatIsTyping] = useState(false)
    const [liveVideoAd, setLiveVideoAd] = useState(false)
    const [abTest, setAbTest] = useState(false)
    const [frequencyControl, setFrequencyControl] = useState(false)
    const [showDetailsOptions, setShowDetailsOptions] = useState(false)
    const [shareBudget20, setShareBudget20] = useState(false)
    const [adSetName, setAdSetName] = useState('New Engagement ad set')
    const [conversionLocation, setConversionLocation] = useState('Message destinations')
    const [performanceGoal, setPerformanceGoal] = useState('Maximise number of conversations')
    const [costPerResult, setCostPerResult] = useState('')
    const [showConversionOptions, setShowConversionOptions] = useState(false)
    const [dailyBudgetAmount, setDailyBudgetAmount] = useState('800.00')
    const [startDateVal, setStartDateVal] = useState('2026-08-05')
    const [startTimeVal, setStartTimeVal] = useState('12:40')
    const [adSetEndDateEnabled, setAdSetEndDateEnabled] = useState(false)
    const [adSetEndDateVal, setAdSetEndDateVal] = useState('2026-09-05')
    const [adSetEndTimeVal, setAdSetEndTimeVal] = useState('12:40')
    const [showBudgetOptions, setShowBudgetOptions] = useState(false)
    const [scheduleBudgetIncreases, setScheduleBudgetIncreases] = useState(false)
    const [setScheduleForAds, setSetScheduleForAds] = useState(false)
    const [securitiesInvestment, setSecuritiesInvestment] = useState(false)
    const [showAudienceOptions, setShowAudienceOptions] = useState(false)
    const [partnershipAd, setPartnershipAd] = useState(false)
    const [adCreativeFormat, setAdCreativeFormat] = useState('single_image')
    const [multiAdvertiserAds, setMultiAdvertiserAds] = useState(true)
    const [urlParameters, setUrlParameters] = useState('key1=value1&key2=value2')
    const [websiteEventsEnabled, setWebsiteEventsEnabled] = useState(true)
    const [appEventsEnabled, setAppEventsEnabled] = useState(false)
    const [offlineEventsEnabled, setOfflineEventsEnabled] = useState(false)
    const [selectedAdPreviewTab, setSelectedAdPreviewTab] = useState('ad')
    const [adName, setAdName] = useState('New Engagement ad')
    const [integrations, setIntegrations] = useState({
        meta: { connected: false, accountName: null, adsAccountId: null, pagesCount: 0, adAccountsCount: 0 },
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
        spend: 0.00,
        reach: '0',
        impressions: 0,
        clicks: '0',
        conversions: '0',
        ctr: 0.00,
        cpc: 0.00,
        cpm: 0.00,
        roas: 0.00
    })

    const [adAccountsList, setAdAccountsList] = useState([])
    const [facebookPagesList, setFacebookPagesList] = useState([])
    const [selectedAdAccount, setSelectedAdAccount] = useState('')
    const [selectedPage, setSelectedPage] = useState('')

    const [campaignsList, setCampaignsList] = useState([])
    const [campaignsLoading, setCampaignsLoading] = useState(false)
    const [campaignLoading, setCampaignLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [objectiveFilter, setObjectiveFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [activeActionMenuId, setActiveActionMenuId] = useState(null)

    const fetchCampaigns = async () => {
        setCampaignsLoading(true)
        const token = localStorage.getItem('authToken')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        try {
            const params = new URLSearchParams({
                search: searchQuery,
                status: statusFilter,
                objective: objectiveFilter,
                page: String(currentPage),
                limit: '4',
                sort: 'updated_time',
                order: 'desc'
            })
            const res = await fetch(`${apiBaseUrl}/meta/campaigns?${params.toString()}`, { headers })
            if (res.ok) {
                const data = await res.json()
                setCampaignsList(data.data || [])
                setTotalPages(data.totalPages || 1)
            }
        } catch (err) {
            console.error("Error loading campaigns:", err)
        } finally {
            setCampaignsLoading(false)
        }
    }

    const handleToggleCampaignStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
        const token = localStorage.getItem('authToken')
        const headers = token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        }
        try {
            const res = await fetch(`${apiBaseUrl}/meta/campaigns/${id}/status`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ status: nextStatus })
            })
            if (res.ok) {
                triggerToast(`Campaign status changed to ${nextStatus}!`)
                fetchCampaigns()
            } else {
                triggerToast("Failed to update status.")
            }
        } catch (err) {
            console.error(err)
            triggerToast("Network error updating status.")
        }
        setActiveActionMenuId(null)
    }

    const handleDuplicateCampaign = async (id, name) => {
        const token = localStorage.getItem('authToken')
        const headers = token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        }
        try {
            const res = await fetch(`${apiBaseUrl}/meta/campaigns/${id}/duplicate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: `${name} (Copy)` })
            })
            if (res.ok) {
                triggerToast("Campaign duplicated successfully!")
                fetchCampaigns()
            } else {
                triggerToast("Failed to duplicate campaign.")
            }
        } catch (err) {
            console.error(err)
            triggerToast("Network error duplicating campaign.")
        }
        setActiveActionMenuId(null)
    }

    const handleDeleteCampaign = async (id) => {
        const token = localStorage.getItem('authToken')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        try {
            const res = await fetch(`${apiBaseUrl}/meta/campaigns/${id}`, {
                method: 'DELETE',
                headers
            })
            if (res.ok) {
                triggerToast("Campaign deleted successfully!")
                fetchCampaigns()
            } else {
                triggerToast("Failed to delete campaign.")
            }
        } catch (err) {
            console.error(err)
            triggerToast("Network error deleting campaign.")
        }
        setActiveActionMenuId(null)
    }

    const [campaignModalOpen, setCampaignModalOpen] = useState(false)
    const [campaignModalForm, setCampaignModalForm] = useState({
        name: 'New Awareness Campaign',
        dailyBudget: '50.00',
        objective: 'awareness',
        status: 'PAUSED',
        buyingType: 'Auction'
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
                            accountName: data.adAccounts?.find(acc => acc.id === data.selectedAdAccount)?.name || data.pages?.find(p => p.id === data.selectedPage)?.name || 'Meta Ads API Channel',
                            adsAccountId: data.selectedAdAccount || 'act_9852',
                            pagesCount: data.pages?.length || 3,
                            adAccountsCount: data.adAccounts?.length || 4,
                            facebookUser: data.facebookUser,
                            appName: data.appName,
                            scopes: data.scopes,
                            maskedToken: data.maskedToken,
                            syncLabel: 'Webhooks Active'
                        }
                    }))
                    if (data.adAccounts && data.adAccounts.length > 0) {
                        setAdAccountsList(data.adAccounts)
                    }
                    if (data.pages && data.pages.length > 0) {
                        setFacebookPagesList(data.pages)
                        const defaultPageId = data.selectedPage || data.pages[0].id;
                        const defaultPageObj = data.pages.find(p => p.id === defaultPageId);
                        if (defaultPageObj) {
                            setAdCreative(prev => ({
                                ...prev,
                                facebookPage: defaultPageObj.name
                            }));
                        }
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
                    spend: data.spend !== undefined ? Number(data.spend) : 0,
                    reach: data.reach !== undefined ? String(data.reach) : '0',
                    impressions: data.impressions !== undefined ? Number(data.impressions) : 0,
                    clicks: data.clicks !== undefined ? String(data.clicks) : '0',
                    conversions: (data.conversions !== undefined ? String(data.conversions) : null) || (data.leads !== undefined ? String(data.leads) : '0'),
                    ctr: data.ctr !== undefined ? Number(data.ctr) : 0.00,
                    cpc: data.cpc !== undefined ? Number(data.cpc) : 0.00,
                    cpm: data.cpm !== undefined ? Number(data.cpm) : 0.00,
                    roas: data.roas !== undefined ? Number(data.roas) : 0.00
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
        const selectedPageObj = facebookPagesList.find(p => p.id === val);
        if (selectedPageObj) {
            setAdCreative(prev => ({
                ...prev,
                facebookPage: selectedPageObj.name
            }));
        }
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
        if (e && e.preventDefault) e.preventDefault()
        const token = localStorage.getItem('authToken')
        const headers = token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        }

        const objectiveLabel = campaignModalForm.objective.charAt(0).toUpperCase() + campaignModalForm.objective.slice(1).replace('_', ' ');
        const campaignName = campaignModalForm.name || `New ${objectiveLabel} Campaign`;
        const dailyBudget = "50.00";
        const status = "PAUSED";

        try {
            const res = await fetch(`${apiBaseUrl}/meta/campaigns`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: campaignName,
                    objective: campaignModalForm.objective,
                    daily_budget: dailyBudget,
                    status: status,
                    page_id: selectedPage
                })
            })
            const data = await res.json()
            if (res.ok) {
                triggerToast(`Campaign created successfully! ID: ${data.id}`)
                setCampaignModalOpen(false)
                setCampaign({
                    name: campaignName,
                    objective: campaignModalForm.objective,
                    buyingType: campaignModalForm.buyingType || 'Auction',
                    specialCategory: 'None',
                    budgetOptimization: true,
                    budgetType: 'Daily',
                    dailyBudget: dailyBudget,
                    lifetimeBudget: '350.00',
                    spendingLimit: '500.00'
                })
                setAdSetName(`New ${objectiveLabel} ad set`)
                setAdName(`New ${objectiveLabel} ad`)
                setCreationMode('manual')
                setActiveStep(1)
                fetchCampaigns()
            } else {
                triggerToast(data.error || "Failed to create campaign. Proceeding in draft mode.")
                setCampaignModalOpen(false)
                setCampaign({
                    name: campaignName,
                    objective: campaignModalForm.objective,
                    buyingType: campaignModalForm.buyingType || 'Auction',
                    specialCategory: 'None',
                    budgetOptimization: true,
                    budgetType: 'Daily',
                    dailyBudget: dailyBudget,
                    lifetimeBudget: '350.00',
                    spendingLimit: '500.00'
                })
                setAdSetName(`New ${objectiveLabel} ad set`)
                setAdName(`New ${objectiveLabel} ad`)
                setCreationMode('manual')
                setActiveStep(1)
            }
        } catch (err) {
            console.error(err)
            triggerToast("Proceeding in manual draft mode...")
            setCampaignModalOpen(false)
            setCampaign({
                name: campaignName,
                objective: campaignModalForm.objective,
                buyingType: campaignModalForm.buyingType || 'Auction',
                specialCategory: 'None',
                budgetOptimization: true,
                budgetType: 'Daily',
                dailyBudget: dailyBudget,
                lifetimeBudget: '350.00',
                spendingLimit: '500.00'
            })
            setAdSetName(`New ${objectiveLabel} ad set`)
            setAdName(`New ${objectiveLabel} ad`)
            setCreationMode('manual')
            setActiveStep(1)
        }
    }

    useEffect(() => {
        fetchAccounts()
        fetchInsights()
        fetchCampaigns()
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1729260811681200',
                cookie: true,
                xfbml: true,
                version: 'v25.0'
            })
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) return
            js = d.createElement(s); js.id = id
            js.src = "https://connect.facebook.net/en_US/sdk.js"
            fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
    }, [])

    useEffect(() => {
        fetchCampaigns()
    }, [searchQuery, statusFilter, objectiveFilter, currentPage, selectedAdAccount])

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
                            spend: data.spend !== undefined ? Number(data.spend) : 0,
                            reach: data.reach !== undefined ? String(data.reach) : '0',
                            impressions: data.impressions !== undefined ? Number(data.impressions) : 0,
                            clicks: data.clicks !== undefined ? String(data.clicks) : '0',
                            conversions: (data.conversions !== undefined ? String(data.conversions) : null) || (data.leads !== undefined ? String(data.leads) : '0'),
                            ctr: data.ctr !== undefined ? Number(data.ctr) : 0.00,
                            cpc: data.cpc !== undefined ? Number(data.cpc) : 0.00,
                            cpm: data.cpm !== undefined ? Number(data.cpm) : 0.00,
                            roas: data.roas !== undefined ? Number(data.roas) : 0.00
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

    const callGeminiAPI = async (messagesHistory) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API Key is missing. If you are running locally, please restart your dev server. If you are using the deployed version (e.g. Render/Vercel), you must add 'VITE_GEMINI_API_KEY' in your dashboard's Environment Variables settings.");
        }
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Map the chat history to Gemini's format
        const contents = messagesHistory.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        // System instructions to guide Gemini
        const systemInstruction = {
            parts: [{
                text: `You are an expert Facebook Ads Campaign Assistant. Your task is to help the user build a complete Meta Ads Campaign step-by-step through a friendly chat.
To build a campaign, you need to collect all of the following parameters from the user:
1. campaignName (e.g. "Summer Collection Launch")
2. objective (Must extract one of these EXACT strings: "awareness", "traffic", "engagement", "leads", "sales", "app_promotion")
3. dailyBudget (e.g. "50.00" - numerical string in USD)
4. adSetName (e.g. "Broad Targeting AdSet")
5. locations (e.g. "India" or "USA" - array of strings)
6. ageMin (minimum age, default 18)
7. ageMax (maximum age, default 65)
8. gender (Must extract one of: "Male", "Female", "All")
9. primaryText (Primary ad copy or marketing hook)
10. headline (Ad headline)
11. description (Ad description)
12. cta (Must extract one of: "Learn More", "Shop Now", "Sign Up", "Contact Us", "Book Now")
13. websiteUrl (Target URL link)

Rules:
- Be polite, direct, concise, and professional.
- Ask questions one or two at a time to build the campaign step-by-step.
- If the user provides info for any of the parameters in their response, extract them.
- Crucially, whenever you extract or update any parameters, append a single tag at the very end of your response in this exact format (on a new line):
[UPDATE: {"campaignName": "...", "objective": "...", "dailyBudget": "...", "adSetName": "...", "locations": ["..."], "ageMin": 18, "ageMax": 65, "gender": "...", "primaryText": "...", "headline": "...", "description": "...", "cta": "...", "websiteUrl": "..."}]
Only include the keys that you have successfully resolved or updated so far. Do not include unresolved keys.
- Once ALL parameters have been collected, tell the user that the configuration is complete, and they can click "Go to Review" to publish.
- Prefilled company details: Company Name is "${localStorage.getItem('companyName') || ''}".`
            }]
        };

        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey 
                },
                body: JSON.stringify({
                    contents,
                    systemInstruction
                })
            });
        } catch (fetchErr) {
            console.warn("Failed calling Gemini API with v1 endpoint:", fetchErr.message);
        }

        if (!response || !response.ok) {
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            response = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey 
                },
                body: JSON.stringify({
                    contents,
                    systemInstruction
                })
            });
        }

        if (!response.ok) {
            let errorText = "";
            try {
                const errData = await response.json();
                errorText = errData.error?.message || JSON.stringify(errData);
            } catch (e) {
                errorText = `Status ${response.status}`;
            }

            try {
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                if (listRes.ok) {
                    const listData = await listRes.json();
                    const modelNames = listData.models?.map(m => m.name.replace("models/", "")) || [];
                    if (modelNames.length > 0) {
                        errorText += `\n\nAvailable models for your key: ${modelNames.join(", ")}`;
                    }
                }
            } catch (listErr) {
                console.warn("Failed to list models:", listErr);
            }

            throw new Error(`Gemini API Error: ${errorText}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I encountered an issue processing your request.";
    };

    const handleSendChatMessage = async (textToSubmit) => {
        const text = textToSubmit || chatInput;
        if (!text.trim()) return;

        const newMsgUser = { sender: 'user', text: text };
        const currentMessages = [...chatMessages, newMsgUser];
        
        setChatMessages(currentMessages);
        setChatInput('');
        setChatIsTyping(true);

        try {
            const rawReply = await callGeminiAPI(currentMessages);
            
            // Extract the [UPDATE: ...] tag if it exists in the raw reply
            let cleanedReply = rawReply;
            let updateData = null;
            
            const updateRegex = /\[UPDATE:\s*(\{.*?\}|\{[\s\S]*?\})\]/;
            const match = rawReply.match(updateRegex);
            if (match) {
                try {
                    updateData = JSON.parse(match[1]);
                    // Strip the tag from the reply text
                    cleanedReply = rawReply.replace(updateRegex, '').trim();
                } catch (e) {
                    console.error("Failed to parse [UPDATE] JSON tag from Gemini response:", e);
                }
            }

            // If Gemini resolved parameters, update the corresponding React states dynamically!
            if (updateData) {
                if (updateData.campaignName) {
                    setCampaign(prev => ({ ...prev, name: updateData.campaignName }));
                }
                if (updateData.objective) {
                    let mappedObj = updateData.objective.toLowerCase();
                    if (mappedObj.startsWith("outcome_")) {
                        mappedObj = mappedObj.replace("outcome_", "");
                    }
                    setCampaign(prev => ({ ...prev, objective: mappedObj }));
                }
                if (updateData.dailyBudget) {
                    setCampaign(prev => ({ ...prev, dailyBudget: updateData.dailyBudget }));
                    setAdSet(prev => ({ ...prev, dailyBudget: updateData.dailyBudget }));
                }
                if (updateData.adSetName) {
                    setAdSetName(updateData.adSetName);
                }
                if (updateData.locations) {
                    setAdSet(prev => ({ ...prev, locations: updateData.locations }));
                }
                if (updateData.ageMin) {
                    setAdSet(prev => ({ ...prev, ageMin: updateData.ageMin }));
                }
                if (updateData.ageMax) {
                    setAdSet(prev => ({ ...prev, ageMax: updateData.ageMax }));
                }
                if (updateData.gender) {
                    setAdSet(prev => ({ ...prev, gender: updateData.gender }));
                }
                if (updateData.facebookPage) {
                    setAdCreative(prev => ({ ...prev, facebookPage: updateData.facebookPage }));
                }
                if (updateData.primaryText) {
                    setAdCreative(prev => ({ ...prev, primaryText: updateData.primaryText }));
                }
                if (updateData.headline) {
                    setAdCreative(prev => ({ ...prev, headline: updateData.headline }));
                }
                if (updateData.description) {
                    setAdCreative(prev => ({ ...prev, description: updateData.description }));
                }
                if (updateData.cta) {
                    setAdCreative(prev => ({ ...prev, cta: updateData.cta }));
                }
                if (updateData.websiteUrl) {
                    setAdCreative(prev => ({ ...prev, websiteUrl: updateData.websiteUrl }));
                }
            }

            const isCompleted = cleanedReply.toLowerCase().includes("complete") || cleanedReply.toLowerCase().includes("review") || aiQuestionIndex >= 8;
            
            setChatMessages(prev => [...prev, { sender: 'ai', text: cleanedReply }]);
            if (isCompleted) {
                setAiQuestionIndex(9); // triggers the Go to Review option
            } else {
                setAiQuestionIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error("Error calling Gemini API:", err);
            const textMsg = err.message || "I'm sorry, I encountered a connection issue while building your campaign. Please try again.";
            setChatMessages(prev => [...prev, { sender: 'ai', text: textMsg }]);
        } finally {
            setChatIsTyping(false);
        }
    };

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
                fetchCampaigns()
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
                    budgetType: campaign.budgetType,
                    adSetName: adSetName,
                    adSet: {
                        conversionLocation: adSet.conversionLocation,
                        pixel: adSet.pixel,
                        optimizationEvent: adSet.optimizationEvent,
                        locations: adSet.locations,
                        ageMin: adSet.ageMin,
                        ageMax: adSet.ageMax,
                        gender: adSet.gender,
                        placementType: adSet.placementType,
                        includedPlacements: adSet.includedPlacements,
                        optimizationForAdDelivery: adSet.optimizationForAdDelivery,
                        bidStrategy: adSet.bidStrategy,
                        attributionSetting: adSet.attributionSetting,
                        startDate: adSet.startDate,
                        startTime: adSet.startTime,
                        setEndDate: adSet.setEndDate,
                        endDate: adSet.endDate,
                        endTime: adSet.endTime
                    },
                    adName: adName,
                    adCreative: {
                        facebookPage: adCreative.facebookPage,
                        instagramAccount: adCreative.instagramAccount,
                        format: adCreative.format,
                        primaryText: adCreative.primaryText,
                        headline: adCreative.headline,
                        description: adCreative.description,
                        cta: adCreative.cta,
                        websiteUrl: adCreative.websiteUrl
                    },
                    page_id: selectedPage
                })
            })
            triggerToast("Campaign published live to Meta networks!")
            fetchCampaigns()
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
        <div className="meta-ads-workspace w-full h-full flex flex-col overflow-y-auto text-slate-800 bg-[#f8fafc] p-2 select-none">
            <div className="max-w-6xl w-full mx-auto space-y-8 animate-fadeIn py-2">
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
                                        <h3 className="text-sm font-extrabold text-slate-805">Create Manually</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px]!">
                                        <span className="material-symbols-outlined text-[10px]! text-slate-450 font-black">schedule</span>
                                        <span className="text-slate-700 font-black">2 - 5 min</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Configure every detail of your campaign manually with full control and advanced options.
                                </p>
                            </div>

                            {/* Miniature visual with Lottie Animation */}
                            <div className="hidden lg:block w-32 h-28 relative select-none shrink-0">
                                <LottieAnimation
                                    animationData={marketingAnimation}
                                />
                                <button
                                    onClick={() => setCampaignModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md hover:translate-x-0.5 shrink-0 self-center z-10 absolute right-4 bottom-0"
                                >
                                    Create
                                    <span className="material-symbols-outlined text-[13px]! font-black">arrow_right_alt</span>
                                </button>
                            </div>
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
                                        <h3 className="text-sm font-extrabold text-slate-805">Create with AI</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px]!">
                                        <span className="material-symbols-outlined text-[10px]! text-slate-450 font-black">schedule</span>
                                        <span className="text-slate-700 font-black">45 sec</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Answer a few questions and our AI will build an optimized campaign for you.
                                </p>
                            </div>

                            {/* Robot visual with Lottie Animation */}
                            <div className="hidden lg:block w-32 h-28 relative select-none shrink-0">
                                <LottieAnimation
                                    animationData={assistantBotAnimation}
                                />
                                <button
                                    onClick={() => {
                                        setCreationMode('ai')
                                        setAiQuestionIndex(0)
                                        setChatMessages([
                                            { sender: 'ai', text: `Hello! I am your AI Campaign Assistant. I will guide you to create an optimized Meta Ads Campaign with all options (Name, Objective, Budget, Ad Set Targeting, and Ad Creative).\n\nTo start, what is the name of your campaign and what objective or goal would you like to target?` }
                                        ])
                                        triggerToast("AI campaign mode activated.")
                                    }}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs shrink-0 z-10 absolute right-4 bottom-0"
                                >
                                    Start
                                    <span className="material-symbols-outlined text-[13px]! font-black">arrow_right_alt</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── LAYOUT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    {/* Left Column (col-span-2) */}
                    <div className="lg:col-span-2 space-y-8">



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

                        {/* Side-by-Side: Recent Drafts & Start From Template */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Campaigns */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4 relative">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recent Campaigns</h3>
                                        <p className="text-[10px] text-slate-400 font-medium">Manage and check your campaigns.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            placeholder="Search..."
                                            className="h-7 px-2.5 text-[10px] font-bold text-slate-800 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none w-28 placeholder:text-slate-400"
                                        />
                                        <select
                                            value={statusFilter}
                                            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                            className="h-7 px-2 text-[10px] font-extrabold text-slate-700 border border-slate-200 rounded-xl bg-slate-50 outline-none cursor-pointer hover:bg-slate-100/50"
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="PAUSED">Paused</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3 min-h-[160px] flex flex-col justify-between">
                                    <div className="space-y-3">
                                        {campaignsLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                            </div>
                                        ) : campaignsList.length === 0 ? (
                                            <div className="text-center py-12 text-[10.5px] font-bold text-slate-400">
                                                No campaigns found.
                                            </div>
                                        ) : (
                                            campaignsList.map(c => {
                                                const details = getObjectiveDetails(c.objective);
                                                const isStatusActive = c.status === 'ACTIVE';
                                                return (
                                                    <div key={c.id} className="border border-slate-100 hover:border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-4 hover:bg-slate-50/20 transition-all relative">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`w-8 h-8 rounded-xl ${details.color} text-white flex items-center justify-center shrink-0`}>
                                                                <span className="material-symbols-outlined text-[16px]! font-black">{details.logo}</span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-[11.5px] font-black text-slate-850 truncate">{c.name}</h4>
                                                                <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] text-slate-450 font-extrabold">
                                                                    <span className="capitalize text-blue-600 bg-blue-50/70 px-1.5 py-0.2 rounded-md font-black text-[8.5px]">{details.label}</span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${isStatusActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                                        {c.status}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span className="shrink-0">{c.updated_time ? new Date(c.updated_time).toLocaleDateString() : 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 shrink-0 relative">
                                                            <button
                                                                disabled={campaignLoading}
                                                                onClick={async () => {
                                                                    setCampaignLoading(true);
                                                                    const token = localStorage.getItem('authToken');
                                                                    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                                                                    try {
                                                                        const res = await fetch(`${apiBaseUrl}/meta/campaigns/${c.id}`, { headers });
                                                                        if (res.ok) {
                                                                            const details = await res.json();
                                                                            setCampaign({
                                                                                id: details.id,
                                                                                name: details.name,
                                                                                objective: details.objective ? details.objective.replace("OUTCOME_", "").toLowerCase() : "awareness",
                                                                                buyingType: details.buyingType || details.buying_type || "Auction",
                                                                                status: details.status || "PAUSED",
                                                                                dailyBudget: details.dailyBudget ? (details.dailyBudget / 100).toFixed(2) : "50.00",
                                                                                lifetimeBudget: details.lifetimeBudget ? (details.lifetimeBudget / 100).toFixed(2) : "350.00",
                                                                                budgetType: details.lifetimeBudget ? "Lifetime" : "Daily",
                                                                                budgetOptimization: true,
                                                                                specialCategory: "None",
                                                                                spendingLimit: "500.00"
                                                                            });
                                                                            if (details.insights) {
                                                                                setInsightsData({
                                                                                    spend: details.insights?.spend !== undefined ? Number(details.insights.spend) : 0,
                                                                                    reach: details.insights?.reach !== undefined ? String(details.insights.reach) : '0',
                                                                                    impressions: details.insights?.impressions !== undefined ? Number(details.insights.impressions) : 0,
                                                                                    clicks: details.insights?.clicks !== undefined ? String(details.insights.clicks) : '0',
                                                                                    conversions: (details.insights?.conversions !== undefined ? String(details.insights.conversions) : null) || (details.insights?.leads !== undefined ? String(details.insights.leads) : '0'),
                                                                                    ctr: details.insights?.ctr !== undefined ? Number(details.insights.ctr) : 0.00,
                                                                                    cpc: details.insights?.cpc !== undefined ? Number(details.insights.cpc) : 0.00,
                                                                                    cpm: details.insights?.cpm !== undefined ? Number(details.insights.cpm) : 0.00,
                                                                                    roas: details.insights?.roas !== undefined ? Number(details.insights.roas) : 0.00
                                                                                });
                                                                            }
                                                                            setCreationMode('manual');
                                                                            setActiveStep(1);
                                                                            triggerToast(`Resuming campaign: ${details.name}`);
                                                                        } else {
                                                                            triggerToast("Failed to fetch campaign details.");
                                                                        }
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                        triggerToast("Error loading campaign.");
                                                                    } finally {
                                                                        setCampaignLoading(false);
                                                                    }
                                                                }}
                                                                className="px-3 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-600 hover:text-white text-slate-700 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer"
                                                            >
                                                                {campaignLoading ? 'Loading...' : 'Continue'}
                                                            </button>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setActiveActionMenuId(activeActionMenuId === c.id ? null : c.id)}
                                                                    className="w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]! font-black">more_vert</span>
                                                                </button>
                                                                {activeActionMenuId === c.id && (
                                                                    <div className="absolute right-0 top-8 z-[9999] bg-white border border-slate-200 rounded-xl p-1.5 shadow-lg w-28 text-left space-y-1 animate-fadeIn">
                                                                        <button
                                                                            onClick={() => handleToggleCampaignStatus(c.id, c.status)}
                                                                            className="w-full text-left px-2 py-1 text-[9.5px] font-black text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[12px]!">
                                                                                {c.status === 'ACTIVE' ? 'pause_circle' : 'play_circle'}
                                                                            </span>
                                                                            {c.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDuplicateCampaign(c.id, c.name)}
                                                                            className="w-full text-left px-2 py-1 text-[9.5px] font-black text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[12px]!">content_copy</span>
                                                                            Duplicate
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                if (window.confirm("Are you sure you want to delete this campaign?")) {
                                                                                    handleDeleteCampaign(c.id);
                                                                                } else {
                                                                                    setActiveActionMenuId(null);
                                                                                }
                                                                            }}
                                                                            className="w-full text-left px-2 py-1 text-[9.5px] font-black text-red-650 hover:bg-red-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[12px]! text-red-500">delete</span>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-450">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                className="px-2 py-1 border border-slate-155 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                                            >
                                                Previous
                                            </button>
                                            <span>Page {currentPage} of {totalPages}</span>
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                className="px-2 py-1 border border-slate-155 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
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
                                        View All
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
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
                                    { key: 'meta', label: 'Meta Ads', desc: 'Facebook & Instagram', icon: 'public', color: 'bg-blue-600' }
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
                                                <div className="bg-slate-50  p-2.5 rounded-xl text-[9px] text-slate-555 space-y-2 text-left">
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
                    <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 text-left overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg select-none">
                                    Create new campaign
                                </span>
                            </div>
                            <button
                                onClick={() => setCampaignModalOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px] font-bold">close</span>
                            </button>
                        </div>

                        {/* Modal Body: Left and Right Columns */}
                        <div className="flex flex-1 overflow-y-auto min-h-0">
                            {/* Left Column (Options selection) */}
                            <div className="w-1/2 p-6 border-r border-slate-100 overflow-y-auto space-y-6">
                                {/* Buying Type */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                                        <span>Choose a buying type</span>
                                        <span className="material-symbols-outlined text-[14px]! text-slate-400 cursor-pointer" title="Buying types define how you pay for and target ads.">info</span>
                                    </div>
                                    <select
                                        value={campaignModalForm.buyingType || 'Auction'}
                                        onChange={(e) => setCampaignModalForm(prev => ({ ...prev, buyingType: e.target.value }))}
                                        className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-700 cursor-pointer"
                                    >
                                        <option value="Auction">Auction</option>
                                        <option value="Reservation">Reservation</option>
                                    </select>
                                </div>

                                {/* Objective Option Header */}
                                <div className="space-y-3">
                                    <h4 className="text-[12px]! font-black text-slate-800">Choose a campaign objective</h4>
                                    {/* Grid of objectives */}
                                    <div className="space-y-1">
                                        {OBJECTIVE_OPTIONS.map((item) => {
                                            const isSelected = campaignModalForm.objective === item.value;
                                            return (
                                                <div
                                                    key={item.value}
                                                    onClick={() => {
                                                        const label = item.title;
                                                        setCampaignModalForm(prev => ({
                                                            ...prev,
                                                            objective: item.value,
                                                            name: `New ${label} Campaign`
                                                        }));
                                                    }}
                                                    className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-slate-100/90' : 'hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {/* Custom Radio Button */}
                                                    <div className={`w-[16px]! h-[16px]! rounded-full border-[2px]! flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-blue-600 bg-white' : 'border-slate-350'
                                                        }`}>
                                                        {isSelected && (
                                                            <div className="w-[8px]! h-[8px]! rounded-full bg-blue-600"></div>
                                                        )}
                                                    </div>

                                                    {/* Icon Box */}
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                        <span className={`material-symbols-outlined text-[18px]! ${isSelected ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                                                            {item.icon}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {item.title}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Objective Details & Illustration) */}
                            <div className="w-1/2 p-8 flex flex-col items-center bg-slate-50/30 overflow-y-auto">
                                {(() => {
                                    const activeObj = OBJECTIVE_OPTIONS.find(item => item.value === campaignModalForm.objective) || OBJECTIVE_OPTIONS[0];
                                    return (
                                        <div className="w-full flex flex-col items-start text-left space-y-6">
                                            {/* Circular Illustration */}
                                            <div className="w-full flex justify-center py-4">
                                                <div
                                                    className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center shadow-inner transition-all duration-300 relative p-4"
                                                    style={{ backgroundColor: activeObj.illBg }}
                                                >
                                                    <LottieAnimation animationData={activeObj.animationData} />
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-4 w-full">
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-slate-800">
                                                        {activeObj.title}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                                                        {activeObj.description}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-[10px]! font-black text-slate-450 uppercase tracking-wider">
                                                        Good for:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {activeObj.tags.map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2.5 py-1 bg-[#f1f5f9] text-[#475569] text-[10px] font-bold rounded-lg border border-slate-100"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                            {/* Blue Info Link */}
                            <a
                                href="https://www.facebook.com/business/help/1438474483098610"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                                About campaign objectives
                            </a>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCampaignModalOpen(false)}
                                    className="px-5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCreateCampaignSubmit()}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center shadow-sm hover:shadow"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
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
                                            <span className="font-extrabold text-slate-700">{integrations[authModalPlatform]?.appName || PLATFORM_DETAILS[authModalPlatform]?.profile || 'Developer Workspace'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                            <span className="font-semibold text-slate-400">Linked Scopes</span>
                                            <span className="font-extrabold text-slate-700 font-mono text-[9px] uppercase">{integrations[authModalPlatform]?.scopes || PLATFORM_DETAILS[authModalPlatform]?.scopes || 'ads_management'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                            <span className="font-semibold text-slate-400">Connection State</span>
                                            <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                                {integrations[authModalPlatform]?.syncLabel || PLATFORM_DETAILS[authModalPlatform]?.syncLabel || 'Live Synced'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-slate-400">API Access Token</span>
                                            <span className="font-mono text-[9px] text-slate-400">{integrations[authModalPlatform]?.maskedToken || PLATFORM_DETAILS[authModalPlatform]?.tokenMask || 'EAAX...ZAAZ'}</span>
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
                                        onClick={async () => {
                                            if (authModalPlatform === 'meta') {
                                                const token = localStorage.getItem('authToken')
                                                const headers = token ? {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'application/json'
                                                } : {
                                                    'Content-Type': 'application/json'
                                                }
                                                try {
                                                    const resolvedPage = facebookPagesList.find(p => p.name.toLowerCase() === authTempName.toLowerCase() || p.id === authTempName);
                                                    const resolvedPageId = resolvedPage ? resolvedPage.id : authTempName;
                                                    const resolvedPageToken = resolvedPage ? resolvedPage.access_token : undefined;

                                                    const resolvedAdAccount = adAccountsList.find(a => a.name.toLowerCase() === authTempId.toLowerCase() || a.id === authTempId);
                                                    const resolvedAdAccountId = resolvedAdAccount ? resolvedAdAccount.id : authTempId;

                                                    const res = await fetch(`${apiBaseUrl}/meta/select-accounts`, {
                                                        method: 'POST',
                                                        headers,
                                                        body: JSON.stringify({
                                                            adAccountId: resolvedAdAccountId,
                                                            facebookPageId: resolvedPageId,
                                                            pageAccessToken: resolvedPageToken
                                                        })
                                                    })
                                                    if (res.ok) {
                                                        triggerToast("Configurations updated successfully.")
                                                        fetchAccounts()
                                                    } else {
                                                        triggerToast("Failed to update backend credentials.")
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                    triggerToast("Network error updating credentials.")
                                                }
                                            } else {
                                                setIntegrations(prev => {
                                                    const counts = {
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
                                                triggerToast(`Authorized account and connected successfully!`);
                                            }
                                            setAuthModalPlatform(null);
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
                {/* <div className="w-[150px]">
                    <span className="text-[11px] font-black tracking-wider uppercase text-blue-600 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]!">ads_click</span>
                        Ads Manager
                    </span>
                </div> */}

                {/* Central Stepper */}
                <div className="flex items-center gap-6">
                    {[
                        { step: 1, label: campaign.name || 'Campaign' },
                        { step: 2, label: adSetName || 'Ad Set' },
                        { step: 3, label: adName || 'Ad' },
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
                                    className={`flex items-start gap-3 max-w-[85%] animate-fadeIn ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold leading-none ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                        {msg.sender === 'user' ? 'ME' : 'AI'}
                                    </div>
                                    <div className={`p-3.5 rounded-2xl text-[11px] leading-relaxed text-left font-medium ${msg.sender === 'user'
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
                        <div className="p-4 border-t border-slate-200 bg-white shrink-0 space-y-3">
                            {/* File Upload in AI Chat */}
                            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <span className="material-symbols-outlined text-[16px] text-slate-400">image</span>
                                <span className="text-[10px] text-slate-600 font-bold flex-1 text-left">
                                    {adCreative.imageSrc ? "Custom Image Uploaded" : "Upload Ad Image (Optional)"}
                                </span>
                                <input
                                    type="file"
                                    id="ai-ad-image-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const objectUrl = URL.createObjectURL(file);
                                            setAdCreative(prev => ({ ...prev, imageSrc: objectUrl }));
                                            triggerToast("Ad image uploaded successfully!");
                                        }
                                    }}
                                />
                                {adCreative.imageSrc ? (
                                    <button
                                        onClick={() => {
                                            setAdCreative(prev => ({ ...prev, imageSrc: null }));
                                            triggerToast("Image removed.");
                                        }}
                                        className="px-2 py-1 text-red-500 hover:bg-red-50 text-[9px] font-black rounded-lg cursor-pointer border border-transparent"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => document.getElementById('ai-ad-image-upload')?.click()}
                                        className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-black text-slate-700 shadow-sm cursor-pointer"
                                    >
                                        Choose File
                                    </button>
                                )}
                            </div>

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
                                        src={adCreative.imageSrc || SHOE_VARIATIONS[selectedVariation].url}
                                        alt="Preview creative"
                                        className="w-full h-full object-cover animate-fadeIn"
                                        key={adCreative.imageSrc || selectedVariation}
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
                                                className={`aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${isSel ? 'border-blue-500 shadow-sm scale-98' : 'border-slate-200 hover:border-slate-350'
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
                            <div className="max-w-[580px] mx-auto space-y-4">
                                {/* Card 1: Campaign name */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Campaign name</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={campaign.name}
                                            onChange={e => setCampaign({ ...campaign, name: e.target.value.slice(0, 100) })}
                                            className="flex-1 h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-800 transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => triggerToast("Template creation modal opened.")}
                                            className="h-9 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer text-center"
                                        >
                                            Create template
                                        </button>
                                    </div>
                                </div>

                                {/* Card 2: Live video ad */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Live video ad</h3>
                                        <div className="flex items-center gap-2 select-none">
                                            <span className="text-[10px] font-bold text-slate-400">{liveVideoAd ? 'On' : 'Off'}</span>
                                            <ToggleSwitch checked={liveVideoAd} onChange={() => setLiveVideoAd(!liveVideoAd)} />
                                        </div>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Use settings that are suggested for a live video ad. This will adjust your budget and schedule to more efficiently deliver your ads and drive engagement.
                                    </p>
                                </div>

                                {/* Card 3: Campaign details */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Campaign details</h3>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10.5px] font-bold text-slate-400">Buying type</h4>
                                        <p className="text-xs font-semibold text-slate-800">Auction</p>
                                    </div>
                                    <div className="space-y-1.5 pt-1.5">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-400">Campaign objective</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-450 cursor-pointer" title="Campaign objective is dynamic">info</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-800 capitalize">
                                            {campaign.objective}
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowDetailsOptions(!showDetailsOptions)}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-750 flex items-center gap-0.5 focus:outline-none cursor-pointer select-none"
                                        >
                                            <span>{showDetailsOptions ? 'Hide options' : 'Show options'}</span>
                                            <span className="material-symbols-outlined text-[16px]!">
                                                {showDetailsOptions ? 'arrow_drop_up' : 'arrow_drop_down'}
                                            </span>
                                        </button>
                                        {showDetailsOptions && (
                                            <div className="pt-3.5 space-y-2 animate-fadeIn">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10.5px] font-bold text-slate-500">Campaign spending limit</span>
                                                    <span className="text-slate-350 text-[10px] select-none">•</span>
                                                    <span className="text-[10.5px] font-bold text-slate-400">Optional</span>
                                                    <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer select-none" title="Limits overall spend">info</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={campaign.spendingLimit}
                                                        onChange={e => setCampaign({ ...campaign, spendingLimit: e.target.value })}
                                                        placeholder="None added"
                                                        className="w-24 h-8 px-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-400">USD</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 4: Advantage+ campaign budget */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 select-none">
                                            <h3 className="text-xs font-bold text-slate-800 tracking-tight">Advantage+ campaign budget</h3>
                                            <span className="material-symbols-outlined text-[14px]! text-blue-500 font-bold">star</span>
                                        </div>
                                        <div className="flex items-center gap-2 select-none">
                                            <span className="text-[10px] font-bold text-slate-400">{campaign.budgetOptimization ? 'On' : 'Off'}</span>
                                            <ToggleSwitch
                                                checked={campaign.budgetOptimization}
                                                onChange={() => setCampaign({ ...campaign, budgetOptimization: !campaign.budgetOptimization })}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Distribute your budget across ad sets to get more results. You can control spending for each ad set. <span className="text-blue-600 cursor-pointer hover:underline">About Advantage+ campaign budget</span>
                                    </p>
                                    {campaign.budgetOptimization && (
                                        <div className="pt-4 border-t border-slate-100 space-y-4 animate-fadeIn">
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={campaign.budgetType}
                                                    onChange={e => setCampaign({ ...campaign, budgetType: e.target.value })}
                                                    className="text-xs border border-slate-200 focus:border-blue-500 rounded-lg p-2 bg-white outline-none font-bold text-slate-700 cursor-pointer"
                                                >
                                                    <option value="Daily">Daily Budget</option>
                                                    <option value="Lifetime">Lifetime Budget</option>
                                                </select>
                                                <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white">
                                                    <span className="text-xs font-bold text-slate-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={campaign.budgetType === 'Daily' ? campaign.dailyBudget : campaign.lifetimeBudget}
                                                        onChange={e => {
                                                            if (campaign.budgetType === 'Daily') {
                                                                setCampaign({ ...campaign, dailyBudget: e.target.value })
                                                            } else {
                                                                setCampaign({ ...campaign, lifetimeBudget: e.target.value })
                                                            }
                                                        }}
                                                        className="w-20 text-slate-800 text-xs font-semibold outline-none"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-450">USD</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1 select-none">
                                                    <h4 className="text-[10.5px] font-bold text-slate-400">Campaign bid strategy</h4>
                                                    <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Bid strategy defines how we bid for your ads">info</span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-800">Highest volume</p>
                                            </div>

                                            <label className="flex items-start gap-2 cursor-pointer pt-2 select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={shareBudget20}
                                                    onChange={() => setShareBudget20(!shareBudget20)}
                                                    className="accent-blue-600 rounded mt-0.5"
                                                />
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10.5px] font-bold text-slate-700">Share up to 20% of your budget with other ad sets</span>
                                                    <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Distributes a portion of the budget to other ad sets to boost volume">info</span>
                                                </div>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Card 5: Campaign frequency control */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Campaign frequency control</h3>
                                        <div className="flex items-center gap-2 select-none">
                                            <span className="text-[10px] font-bold text-slate-400">{frequencyControl ? 'On' : 'Off'}</span>
                                            <ToggleSwitch checked={frequencyControl} onChange={() => setFrequencyControl(!frequencyControl)} />
                                        </div>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Set a frequency if you have a specific number of times that you want people to see your ads throughout your campaign. <span className="text-blue-600 cursor-pointer hover:underline">Learn more</span>
                                    </p>
                                </div>

                                {/* Card 6: A/B test */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">A/B test</h3>
                                        <div className="flex items-center gap-2 select-none">
                                            <span className="text-[10px] font-bold text-slate-400">{abTest ? 'On' : 'Off'}</span>
                                            <ToggleSwitch checked={abTest} onChange={() => setAbTest(!abTest)} />
                                        </div>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Help improve ad performance by comparing versions to see what works best. For accuracy, each one will be shown to separate groups of your audience. <span className="text-blue-600 cursor-pointer hover:underline">About A/B tests</span>
                                    </p>
                                </div>

                                {/* Card 7: Special Ad Categories */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Special Ad Categories</h3>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Declare if your ads are related to financial products and services, employment, housing, social issues, elections or politics to help prevent ad rejections. Requirements differ by country. <span className="text-blue-600 cursor-pointer hover:underline">About Special Ad Categories</span>
                                    </p>
                                    <div className="space-y-2">
                                        <h4 className="text-[10.5px] font-bold text-slate-400">Categories</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">Select the categories that best describe what this campaign will advertise.</p>
                                        <select
                                            value={campaign.specialCategory}
                                            onChange={e => setCampaign({ ...campaign, specialCategory: e.target.value })}
                                            className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 bg-white outline-none font-semibold text-slate-700 cursor-pointer"
                                        >
                                            <option value="None">Declare category if applicable</option>
                                            <option value="Housing">Housing</option>
                                            <option value="Employment">Employment</option>
                                            <option value="Credit">Credit</option>
                                            <option value="Social Issues">Social Issues, Elections or Politics</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : activeStep === 2 ? (
                            <div className="max-w-[580px] mx-auto space-y-4">
                                {/* Card 1: Ad set name */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Ad set name</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={adSetName}
                                            onChange={e => setAdSetName(e.target.value.slice(0, 100))}
                                            className="flex-1 h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-800 transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => triggerToast("Template creation modal opened.")}
                                            className="h-9 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer text-center"
                                        >
                                            Create template
                                        </button>
                                    </div>
                                </div>

                                {/* Card 2: Conversion */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Conversion</h3>
                                    </div>

                                    {/* Conversion Location */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10.5px] font-bold text-slate-500">Conversion location</label>
                                        <select
                                            value={conversionLocation}
                                            onChange={e => setConversionLocation(e.target.value)}
                                            className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 bg-white outline-none font-semibold text-slate-750 cursor-pointer"
                                        >
                                            <option value="Message destinations">Message destinations</option>
                                            <option value="Website">Website</option>
                                            <option value="App">App</option>
                                            <option value="Messenger">Messenger</option>
                                        </select>
                                    </div>

                                    {/* Facebook Page Section */}
                                    <div className="space-y-1.5 pt-1.5">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-500">Facebook Page</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="The page that represents your business">info</span>
                                        </div>
                                        <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                                            This Page will represent your business in your ad and conversation.
                                        </p>
                                        <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-100 shadow-sm relative animate-fadeIn">
                                                    <span className="material-symbols-outlined text-[22px] text-slate-450">person</span>
                                                    <span className="w-4 h-4 bg-blue-600 rounded-full border border-white flex items-center justify-center absolute bottom-0 right-0 select-none">
                                                        <span className="material-symbols-outlined text-[8px]! text-white font-black">check</span>
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    <h5 className="text-[11px] font-bold text-slate-800">Facebook Page</h5>
                                                    <p className="text-[10.5px] text-slate-450 font-semibold mt-0.5">{selectedPage || "Zengame"}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => triggerToast("Edit Facebook page selection.")} className="p-1 hover:bg-slate-150 rounded cursor-pointer">
                                                <span className="material-symbols-outlined text-[16px]! text-slate-455">edit</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Message destinations Section */}
                                    <div className="space-y-1.5 pt-1.5">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-500">Message destinations</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Where messages are received">info</span>
                                        </div>
                                        <p className="text-[10px] text-slate-455 leading-relaxed font-semibold">
                                            Manual destination
                                        </p>
                                        <div className="flex items-center gap-2 p-1.5 px-3 bg-blue-50/30 border border-blue-100/50 rounded-lg w-max select-none">
                                            <span className="material-symbols-outlined text-[15px]! text-blue-600">chat</span>
                                            <span className="text-[10.5px] font-bold text-blue-850">{selectedPage || "Zengame"}</span>
                                        </div>
                                    </div>

                                    {/* Performance Goal */}
                                    <div className="space-y-1.5 pt-1.5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10.5px] font-bold text-slate-500">Performance goal</h4>
                                            <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">About performance goals</span>
                                        </div>
                                        <p className="text-[10px] text-slate-455 font-semibold leading-relaxed">
                                            How you measure success for your ads.
                                        </p>
                                        <select
                                            value={performanceGoal}
                                            onChange={e => setPerformanceGoal(e.target.value)}
                                            className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 bg-white outline-none font-semibold text-slate-700 cursor-pointer"
                                        >
                                            <option value="Maximise number of conversations">Maximise number of conversations</option>
                                            <option value="Maximise number of link clicks">Maximise number of link clicks</option>
                                            <option value="Maximise landing page views">Maximise landing page views</option>
                                        </select>
                                    </div>

                                    {/* Cost per result goal */}
                                    <div className="space-y-1.5 pt-1.5">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-500">Cost per result goal</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-455 cursor-pointer" title="Optional target amount">info</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={costPerResult}
                                            onChange={e => setCostPerResult(e.target.value)}
                                            placeholder="X.XXX"
                                            className="w-full h-9 px-3 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-800 transition-all outline-none"
                                        />
                                        <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                                            Meta will aim to spend your entire budget and get the most results using the highest-volume bid strategy.
                                        </p>
                                    </div>

                                    {/* Value rules */}
                                    <div className="space-y-1.5 pt-1.5">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-500">Value rules</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-450 cursor-pointer" title="Adjust bids dynamically">info</span>
                                        </div>
                                        <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                                            Tell us how much more certain audiences, conversion locations and placements are worth to your business. Our system will optimise for outcomes based on these rules. <span className="text-blue-600 cursor-pointer hover:underline">About value rules</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => triggerToast("Value rule set builder opened.")}
                                            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 w-max"
                                        >
                                            <span className="material-symbols-outlined text-[16px]! font-black">add</span>
                                            Create a rule set
                                        </button>
                                    </div>

                                    {/* Show/Hide more options link */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowConversionOptions(!showConversionOptions)}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-750 flex items-center gap-0.5 focus:outline-none cursor-pointer select-none"
                                        >
                                            <span>{showConversionOptions ? 'Hide options' : 'Show options'}</span>
                                            <span className="material-symbols-outlined text-[16px]!">
                                                {showConversionOptions ? 'arrow_drop_up' : 'arrow_drop_down'}
                                            </span>
                                        </button>
                                        {showConversionOptions && (
                                            <div className="pt-3.5 space-y-2 animate-fadeIn">
                                                <div className="flex items-center gap-1 select-none">
                                                    <span className="text-[10.5px] font-bold text-slate-500">Delivery type</span>
                                                    <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Meta delivery type">info</span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-800">Standard</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 3: Budget & schedule */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Budget & schedule</h3>
                                    </div>

                                    {/* Budget Type Dropdown & Input */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1 select-none">
                                            <label className="text-[10.5px] font-bold text-slate-500">Budget</label>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Sets the ad set level budget type and limit">info</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={adSet.budgetType}
                                                onChange={e => setAdSet({ ...adSet, budgetType: e.target.value })}
                                                className="text-xs border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 bg-white outline-none font-bold text-slate-700 cursor-pointer"
                                            >
                                                <option value="Daily">Daily budget</option>
                                                <option value="Lifetime">Lifetime budget</option>
                                            </select>
                                            <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white flex-1 max-w-[200px]">
                                                <span className="text-xs font-bold text-slate-400">₹</span>
                                                <input
                                                    type="number"
                                                    value={dailyBudgetAmount}
                                                    onChange={e => setDailyBudgetAmount(e.target.value)}
                                                    className="w-full text-slate-805 text-xs font-semibold outline-none"
                                                />
                                                <span className="text-[10px] font-bold text-slate-455 select-none">INR</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-455 font-semibold leading-relaxed">
                                            Ad set budget sharing is on, but you have only one ad set. We'll aim to spend an average of ₹{dailyBudgetAmount} per day. The maximum that you will spend on any day is ₹{Math.round(dailyBudgetAmount * 1.75)} and the maximum that you will spend in a week is ₹{Math.round(dailyBudgetAmount * 7)}. <span className="text-blue-600 hover:underline cursor-pointer">About daily budget</span>
                                        </p>
                                    </div>

                                    {/* Schedule */}
                                    <div className="space-y-3 pt-1">
                                        <h4 className="text-[11px] font-bold text-slate-800 tracking-tight">Schedule</h4>
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-500 block">Start date</span>
                                            <div className="flex gap-2.5">
                                                <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white flex-1">
                                                    <span className="material-symbols-outlined text-[16px]! text-slate-400 select-none">calendar_today</span>
                                                    <input
                                                        type="date"
                                                        value={startDateVal}
                                                        onChange={e => setStartDateVal(e.target.value)}
                                                        className="w-full text-xs font-semibold text-slate-800 outline-none"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white flex-1">
                                                    <span className="material-symbols-outlined text-[16px]! text-slate-400 select-none">schedule</span>
                                                    <input
                                                        type="text"
                                                        value={startTimeVal}
                                                        onChange={e => setStartTimeVal(e.target.value)}
                                                        className="w-full text-xs font-semibold text-slate-800 outline-none"
                                                    />
                                                    <span className="text-[9px] font-bold text-slate-400 select-none">GMT+5:30</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-1.5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={adSetEndDateEnabled}
                                                    onChange={() => setAdSetEndDateEnabled(!adSetEndDateEnabled)}
                                                    className="accent-blue-600 rounded"
                                                />
                                                <span className="text-[11px] font-bold text-slate-700">Set an end date</span>
                                            </label>
                                            {adSetEndDateEnabled && (
                                                <div className="flex gap-2.5 pt-1 animate-fadeIn">
                                                    <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white flex-1">
                                                        <span className="material-symbols-outlined text-[16px]! text-slate-400 select-none">calendar_today</span>
                                                        <input
                                                            type="date"
                                                            value={adSetEndDateVal}
                                                            onChange={e => setAdSetEndDateVal(e.target.value)}
                                                            className="w-full text-xs font-semibold text-slate-800 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white flex-1">
                                                        <span className="material-symbols-outlined text-[16px]! text-slate-400 select-none">schedule</span>
                                                        <input
                                                            type="text"
                                                            value={adSetEndTimeVal}
                                                            onChange={e => setAdSetEndTimeVal(e.target.value)}
                                                            className="w-full text-xs font-semibold text-slate-800 outline-none"
                                                        />
                                                        <span className="text-[9px] font-bold text-slate-400 select-none">GMT+5:30</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Show/Hide more options link */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowBudgetOptions(!showBudgetOptions)}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-750 flex items-center gap-0.5 focus:outline-none cursor-pointer select-none"
                                        >
                                            <span>{showBudgetOptions ? 'Hide options' : 'Show options'}</span>
                                            <span className="material-symbols-outlined text-[16px]!">
                                                {showBudgetOptions ? 'arrow_drop_up' : 'arrow_drop_down'}
                                            </span>
                                        </button>
                                        {showBudgetOptions && (
                                            <div className="pt-3.5 space-y-4 animate-fadeIn">
                                                {/* Budget scheduling */}
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1 select-none">
                                                        <h4 className="text-[10.5px] font-bold text-slate-500">Budget scheduling</h4>
                                                        <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Adjust budget on schedule">info</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-455 font-semibold leading-relaxed">
                                                        Increase your budget during specific days or times.
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={scheduleBudgetIncreases}
                                                                onChange={() => setScheduleBudgetIncreases(!scheduleBudgetIncreases)}
                                                                className="accent-blue-600 rounded"
                                                            />
                                                            <span className="text-[10.5px] font-bold text-slate-700">Schedule budget increases</span>
                                                        </label>
                                                        <button disabled className="text-[10px] font-bold px-2.5 py-1 border border-slate-200 text-slate-400 bg-slate-50 rounded-lg">View</button>
                                                    </div>
                                                </div>

                                                {/* Ad set scheduling Banner */}
                                                <div className="space-y-1.5 pt-1.5">
                                                    <div className="flex items-center gap-1 select-none">
                                                        <h4 className="text-[10.5px] font-bold text-slate-500">Ad set scheduling</h4>
                                                        <span className="material-symbols-outlined text-[13px]! text-slate-400 cursor-pointer" title="Delivery hours">info</span>
                                                    </div>

                                                    <div className="p-3.5 bg-emerald-50/30 border border-emerald-100/50 rounded-xl space-y-3">
                                                        <div className="flex gap-2.5 items-start">
                                                            <span className="material-symbols-outlined text-[16px]! text-emerald-600 mt-0.5 select-none">trending_up</span>
                                                            <div className="text-left space-y-1">
                                                                <h5 className="text-[10.5px] font-bold text-slate-805 leading-snug">You could get 22.8% more conversions by running ads during specific business hours</h5>
                                                                <p className="text-[9.5px] text-slate-455 leading-relaxed font-semibold">With ad set scheduling, we'll show your ads when your business is likely open and available to message, which may help you connect with more potential customers.</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSetScheduleForAds(true);
                                                                triggerToast("Applied ad set scheduling.");
                                                            }}
                                                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer text-center"
                                                        >
                                                            Apply now
                                                        </button>
                                                    </div>

                                                    <label className="flex items-center gap-2 cursor-pointer select-none pt-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={setScheduleForAds}
                                                            onChange={() => setSetScheduleForAds(!setScheduleForAds)}
                                                            className="accent-blue-600 rounded"
                                                        />
                                                        <span className="text-[10.5px] font-bold text-slate-700">Set a schedule for ads</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 4: Audience controls */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Audience controls</h3>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Set criteria for where ads for this campaign can be delivered. <span className="text-blue-600 cursor-pointer hover:underline">Learn more</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg select-none">No account controls set</span>
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <label className="text-[10.5px] font-bold text-slate-500 block">Use a saved audience</label>
                                        <select className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 bg-white outline-none font-semibold text-slate-400 cursor-pointer">
                                            <option>No saved audience</option>
                                        </select>
                                    </div>

                                    {/* Locations Section */}
                                    <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl space-y-3.5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1 select-none">
                                                <span className="text-[11px] font-bold text-slate-800">* Locations</span>
                                                <span className="material-symbols-outlined text-[13px]! text-slate-450 cursor-pointer" title="Ad target location">info</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => triggerToast("Edit target locations modal.")}
                                                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-750 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[13px]!">edit</span>
                                                Edit
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="text-[10px] font-bold text-slate-450 select-none">Included location:</h5>
                                            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-0.5 select-none" />
                                                India
                                            </p>
                                        </div>

                                        {/* India Securities Warning Banner */}
                                        <div className="p-3 bg-amber-50/30 border border-amber-200/50 rounded-lg space-y-2.5">
                                            <div className="flex gap-2 items-start">
                                                <span className="material-symbols-outlined text-[15px]! text-amber-600 mt-0.5 select-none">warning</span>
                                                <p className="text-[9.5px] text-slate-700 leading-snug font-semibold">To run ads in India, you need to declare if your ads are related to securities and investments.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSecuritiesInvestment(true);
                                                    triggerToast("Requirements reviewed.");
                                                }}
                                                className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[9.5px] font-extrabold rounded transition-colors cursor-pointer text-center"
                                            >
                                                Review requirements
                                            </button>
                                        </div>
                                    </div>
                                    {/* Show/Hide options link */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowAudienceOptions(!showAudienceOptions)}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-750 flex items-center gap-0.5 focus:outline-none cursor-pointer select-none"
                                        >
                                            <span>{showAudienceOptions ? 'Hide options' : 'Show options'}</span>
                                            <span className="material-symbols-outlined text-[16px]!">
                                                {showAudienceOptions ? 'arrow_drop_up' : 'arrow_drop_down'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Card 5: Policy and regulatory requirements (India) */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-805 tracking-tight leading-none">Policy and regulatory requirements (India)</h3>
                                    </div>
                                    <p className="text-[10.5px] text-slate-505 font-semibold leading-relaxed">
                                        Provide required information about your ads, yourself or your organisation.
                                    </p>
                                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={securitiesInvestment}
                                            onChange={() => setSecuritiesInvestment(!securitiesInvestment)}
                                            className="accent-blue-600 rounded mt-0.5"
                                        />
                                        <div className="text-left space-y-0.5">
                                            <span className="text-[10.5px] font-bold text-slate-700 block leading-tight">This ad set includes ads related to securities and investments</span>
                                            <span className="text-[9.5px] text-blue-600 hover:underline block cursor-pointer">About verification requirements</span>
                                        </div>
                                    </label>
                                </div>

                                {/* Card 6: Placements */}
                                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]! text-emerald-600 font-bold select-none">check_circle</span>
                                        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Placements</h3>
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                        Choose where your ad appears across Meta technologies. <span className="text-blue-600 cursor-pointer hover:underline">Learn more</span>
                                    </p>

                                    {/* Value rule banner */}
                                    <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl flex justify-between items-start gap-2.5 select-none">
                                        <div className="flex gap-2 items-start">
                                            <span className="material-symbols-outlined text-[15px]! text-slate-450 mt-0.5">info</span>
                                            <div className="text-left">
                                                <h5 className="text-[10px] font-bold text-slate-805 leading-none">Value rule creation is changing</h5>
                                                <p className="text-[9.5px] text-slate-455 mt-1 font-semibold leading-normal">You can now add rules closer to where you select your ad set's placements.</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <span className="material-symbols-outlined text-[15px]! font-bold">close</span>
                                        </button>
                                    </div>

                                    {/* Placement value rules section */}
                                    <div className="p-4 bg-blue-50/10 border border-blue-100 rounded-xl space-y-3.5">
                                        <div className="flex items-center gap-1 select-none">
                                            <span className="text-[11px] font-bold text-slate-800">Placement value rules</span>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-455 cursor-pointer" title="Adjust bids for placements">info</span>
                                        </div>
                                        <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                                            Prioritise the placements that matter most to your business by adjusting bids for them. <span className="text-blue-600 cursor-pointer hover:underline">About value rules</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => triggerToast("Placement value rules builder opened.")}
                                            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 w-max"
                                        >
                                            <span className="material-symbols-outlined text-[16px]! font-black">add</span>
                                            Create a rule set
                                        </button>
                                    </div>

                                    {/* Account controls */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-505">Account controls</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-slate-455 cursor-pointer" title="Excluded placements settings">info</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-805">Excluded placements: None</p>
                                    </div>

                                    {/* Advantage+ placements */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center gap-1 select-none">
                                            <h4 className="text-[10.5px] font-bold text-slate-505">Advantage+ placements</h4>
                                            <span className="material-symbols-outlined text-[13px]! text-blue-500 font-bold">star</span>
                                        </div>
                                        <p className="text-[10px] text-slate-455 font-semibold leading-relaxed">
                                            Your budget will be allocated by Meta's delivery system across multiple placements based on where they're likely to perform best.
                                        </p>
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
                                <div className=" rounded-2xl bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
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
                                                    className="w-full h-9 pl-8 pr-3 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
                                                >
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
                                                    className="w-full h-9 pl-8 pr-3  focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 transition-all outline-none bg-white cursor-pointer"
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
                                            <input
                                                type="file"
                                                id="ad-image-upload"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const objectUrl = URL.createObjectURL(file);
                                                        setAdCreative(prev => ({ ...prev, imageSrc: objectUrl }));
                                                        triggerToast("Custom image uploaded successfully!");
                                                    }
                                                }}
                                            />
                                            <button 
                                                onClick={() => document.getElementById('ad-image-upload')?.click()} 
                                                className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[9.5px] font-black text-slate-700 shadow-sm cursor-pointer"
                                            >
                                                Upload Image
                                            </button>
                                        </div>

                                        {/* Preview container */}
                                        <div className="border border-slate-150 rounded-xl overflow-hidden relative aspect-[4/3] bg-slate-50 flex items-center justify-center min-h-[120px]">
                                            <img
                                                src={adCreative.imageSrc || SHOE_VARIATIONS[selectedVariation].url}
                                                alt="Preview shoe"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-2 right-2 flex gap-1.5">
                                                <button 
                                                    onClick={() => {
                                                        setAdCreative(prev => ({ ...prev, imageSrc: null }));
                                                        triggerToast("Custom media cleared.");
                                                    }} 
                                                    className="w-6 h-6 rounded-lg bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-white hover:text-red-500 hover:scale-105 cursor-pointer"
                                                >
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
                                                src={adCreative.imageSrc || SHOE_VARIATIONS[selectedVariation].url}
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
                                                src={adCreative.imageSrc || SHOE_VARIATIONS[selectedVariation].url}
                                                alt="Preview creative"
                                                className="w-full h-full object-cover animate-fadeIn"
                                                key={adCreative.imageSrc || selectedVariation}
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
                                                        src={adCreative.imageSrc || SHOE_VARIATIONS[selectedVariation].url}
                                                        alt="Preview creative"
                                                        className="w-full h-full object-cover animate-fadeIn"
                                                        key={adCreative.imageSrc || selectedVariation}
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
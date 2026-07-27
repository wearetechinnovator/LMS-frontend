import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FormEmbedSkeleton } from '../../../components/Skeletons'
import Icon from '../../../components/Icon'
import './form.css'

// ---------- Appearance defaults ----------
const APPEARANCE_DEFAULTS = {
    bgColor: '#f8fafc',
    cardBg: '#ffffff',
    textColor: '#1f2937', // gray-800
    labelColor: '#4b5563', // gray-600
    btnColor: '#2563eb', // Stripe blue
    btnTextColor: '#ffffff',
    borderRadius: 12, // rounded-xl (12px)
    inputRadius: 8,
    fontFamily: 'System',
    maxWidth: 512,
    padding: 24,
    hideHeader: false,
    btnStyle: 'rounded', // rounded | pill | square
    shadow: 'small', // none | small | medium | large
    themeMode: 'light', // light | dark
}

const FONT_OPTIONS = [
    { label: 'System Default', value: 'System' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Outfit', value: 'Outfit' },
    { label: 'DM Sans', value: 'DM Sans' },
]

// ---------- Mini live form preview ----------
function LiveFormPreview({ form, appearance }) {
    const [vals, setVals] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const a = { ...APPEARANCE_DEFAULTS, ...appearance }

    // Map button styles
    const buttonBorderRadius = a.btnStyle === 'square' ? '0px' : (a.btnStyle === 'pill' ? '9999px' : `${a.inputRadius}px`);

    // Map shadows
    const cardShadows = {
        none: 'none',
        small: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    };
    const cardShadow = cardShadows[a.shadow] || cardShadows.small;

    // Font mapping
    const fontStyle = a.fontFamily !== 'System' ? { fontFamily: `'${a.fontFamily}', sans-serif` } : {};

    if (!form) return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16 text-slate-400">
            <span className="material-symbols-outlined text-[40px]">integration_instructions</span>
            <p className="text-sm font-medium">Select a form to preview it live</p>
        </div>
    )

    if (submitted) return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
        >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-[24px]">check_circle</span>
            </div>
            <div>
                <p className="font-bold text-slate-800 text-base">Submitted!</p>
                <p className="text-xs text-slate-500 mt-1">This is how it looks for your leads.</p>
            </div>
            <button
                onClick={() => { setSubmitted(false); setVals({}) }}
                className="mt-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
                Reset Preview
            </button>
        </motion.div>
    )

    return (
        <div style={{ background: a.bgColor, padding: `${a.padding}px`, ...fontStyle }} className="w-full h-full flex items-center justify-center">
            <div style={{ background: a.cardBg, borderRadius: `${a.borderRadius}px`, maxWidth: `${a.maxWidth}px`, boxShadow: cardShadow }} className="w-full border border-slate-100 overflow-hidden transition-all duration-200">
                {!a.hideHeader && (
                    <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', background: `${a.cardBg}` }}>
                        <h3 style={{ color: a.textColor }} className="text-sm font-bold">{form.name}</h3>
                        <p style={{ color: a.labelColor }} className="text-[11px] mt-1">Please fill out the form below.</p>
                    </div>
                )}
                <form
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
                    style={{ padding: `${a.padding}px` }}
                    className="space-y-4"
                >
                    {form.fields.slice(0, 3).map((field) => (
                        <div key={field.id} className="space-y-1">
                            <label style={{ color: a.labelColor }} className="text-[10px] font-bold text-transform: uppercase tracking-wider block">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                                type="text"
                                placeholder={field.placeholder || ''}
                                value={vals[field.id] || ''}
                                onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                style={{
                                    width: '100%', height: '36px', padding: '0 12px',
                                    border: '1px solid rgba(0,0,0,0.08)', borderRadius: `${a.inputRadius}px`,
                                    background: a.cardBg, color: a.textColor, fontSize: '13px',
                                    outline: 'none',
                                }}
                                className="focus:border-primary focus:ring-1 focus:ring-primary/20"
                            />
                        </div>
                    ))}
                    {form.fields.length > 3 && (
                        <p style={{ color: a.labelColor }} className="text-[10px] text-center">
                            +{form.fields.length - 3} more fields...
                        </p>
                    )}
                    <button
                        type="submit"
                        style={{
                            width: '100%', height: '38px',
                            background: a.btnColor, color: a.btnTextColor,
                            fontWeight: 600, fontSize: '13px',
                            borderRadius: buttonBorderRadius,
                            border: 'none', cursor: 'pointer',
                        }}
                        className="hover:opacity-90 active:opacity-95 transition-all shadow-sm flex items-center justify-center"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

// ---------- Simulated Browser Preview Frame ----------
function SimulatedBrowserFrame({ children, urlParams }) {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md">
            {/* Fake browser bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200/45">
                <div className="flex gap-1.5 select-none">
                    <span className="w-3 h-3 rounded-full bg-red-400/90" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/90" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/90" />
                </div>
                <div className="flex-1 mx-4 h-6 bg-slate-100 border border-slate-200/20 rounded-lg flex items-center px-3 gap-2">
                    <span className="material-symbols-outlined text-[12px] text-emerald-500 font-bold select-none">lock</span>
                    <span className="text-[11px] text-slate-600 truncate font-medium select-all">
                        your-website.com/form-integration{urlParams ? `?${urlParams}` : ''}
                    </span>
                    <span className="material-symbols-outlined text-[12px] text-slate-400 ml-auto select-none">refresh</span>
                </div>
            </div>
            {children}
        </div>
    )
}

// ---------- Appearance Controls Panel ----------
function AppearancePanel({ appearance, setAppearance, form }) {
    const a = { ...APPEARANCE_DEFAULTS, ...appearance }

    const update = (key, val) => setAppearance(prev => ({ ...prev, [key]: val }))

    const isDefault = useMemo(() => {
        return Object.keys(APPEARANCE_DEFAULTS).every(k => {
            if (appearance[k] === undefined) return true
            return appearance[k] === APPEARANCE_DEFAULTS[k]
        })
    }, [appearance])

    const applyThemePreset = (theme) => {
        if (theme === 'dark') {
            setAppearance(prev => ({
                ...prev,
                bgColor: '#0B0F19',
                cardBg: '#111827',
                textColor: '#F9FAFB',
                labelColor: '#9CA3AF',
                btnColor: '#3b82f6',
                btnTextColor: '#ffffff',
                themeMode: 'dark'
            }));
        } else {
            setAppearance(prev => ({
                ...prev,
                bgColor: '#f8fafc',
                cardBg: '#ffffff',
                textColor: '#1f2937',
                labelColor: '#4b5563',
                btnColor: '#2563eb',
                btnTextColor: '#ffffff',
                themeMode: 'light'
            }));
        }
    }

    const ColorInput = ({ label, prop }) => (
        <div className="flex items-center justify-between gap-3 p-1">
            <label className="text-[11px] font-semibold text-slate-650 select-none">{label}</label>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{a[prop]}</span>
                <label className="relative w-6 h-6 rounded-lg border border-slate-205 overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm" style={{ background: a[prop] }}>
                    <input
                        type="color"
                        value={a[prop]}
                        onChange={e => update(prop, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </label>
            </div>
        </div>
    )

    const SliderInput = ({ label, prop, min, max, unit = 'px' }) => (
        <div className="space-y-1.5 p-1">
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-650 select-none">{label}</label>
                <span className="text-[10px] font-bold text-primary tabular-nums">{a[prop]}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={a[prop]}
                onChange={e => update(prop, parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary focus:outline-none transition-all"
            />
        </div>
    )

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            {/* Controls */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
                {/* Theme Mode Toggles */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Theme Preset</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => applyThemePreset('light')}
                            className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${a.themeMode === 'light'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                        >
                            Light Theme
                        </button>
                        <button
                            onClick={() => applyThemePreset('dark')}
                            className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${a.themeMode === 'dark'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                        >
                            Dark Theme
                        </button>
                    </div>
                </div>

                {/* Colors Section */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">palette</span>
                        Colors
                    </p>
                    <div className="space-y-1.5 divide-y divide-slate-100">
                        <ColorInput label="Page Background" prop="bgColor" />
                        <ColorInput label="Card Background" prop="cardBg" />
                        <ColorInput label="Text Color" prop="textColor" />
                        <ColorInput label="Label Color" prop="labelColor" />
                        <ColorInput label="Primary Accent" prop="btnColor" />
                        <ColorInput label="Button Text" prop="btnTextColor" />
                    </div>
                </div>

                {/* Layout & Typography Section */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">dashboard_customize</span>
                        Shape & Layout
                    </p>
                    <SliderInput label="Card Border Radius" prop="borderRadius" min={0} max={24} />
                    <SliderInput label="Input Border Radius" prop="inputRadius" min={0} max={16} />
                    <SliderInput label="Card Width" prop="maxWidth" min={320} max={800} />
                    <SliderInput label="Internal Padding" prop="padding" min={16} max={48} />

                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <label className="text-[11px] font-semibold text-slate-650 select-none">Font Family</label>
                        <select
                            value={a.fontFamily}
                            onChange={e => update('fontFamily', e.target.value)}
                            className="h-8 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-705 focus:outline-none cursor-pointer font-medium"
                        >
                            {FONT_OPTIONS.map(f => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Button & Shadow Section */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        Button & Shadows
                    </p>

                    <div className="flex items-center justify-between gap-3">
                        <label className="text-[11px] font-semibold text-slate-650 select-none">Button Style</label>
                        <select
                            value={a.btnStyle}
                            onChange={e => update('btnStyle', e.target.value)}
                            className="h-8 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-705 focus:outline-none cursor-pointer font-medium"
                        >
                            <option value="rounded">Rounded</option>
                            <option value="pill">Pill</option>
                            <option value="square">Square</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <label className="text-[11px] font-semibold text-slate-650 select-none">Card Shadow</label>
                        <select
                            value={a.shadow}
                            onChange={e => update('shadow', e.target.value)}
                            className="h-8 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-705 focus:outline-none cursor-pointer font-medium"
                        >
                            <option value="none">None</option>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer select-none pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-650">Hide Header</span>
                        <button
                            type="button"
                            onClick={() => update('hideHeader', !a.hideHeader)}
                            className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors focus:outline-none shrink-0 ${a.hideHeader ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${a.hideHeader ? 'translate-x-4' : 'translate-x-1'}`} />
                        </button>
                    </label>
                </div>

                {/* Reset */}
                {!isDefault && (
                    <button
                        onClick={() => setAppearance({ ...APPEARANCE_DEFAULTS })}
                        className="w-full py-2 border border-slate-200 text-slate-500 hover:text-slate-700 text-[11px] font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm bg-white"
                    >
                        <span className="material-symbols-outlined text-[13px]">restart_alt</span>
                        Reset UI Defaults
                    </button>
                )}
            </div>

            {/* Live Mini Preview */}
            <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                    <span className="material-symbols-outlined text-[13px] text-primary">visibility</span>
                    Real-time Visual Check
                </div>
                <SimulatedBrowserFrame urlParams={buildAppearanceParams(appearance)}>
                    <div className="max-h-[480px] overflow-y-auto">
                        <LiveFormPreview form={form} appearance={appearance} />
                    </div>
                </SimulatedBrowserFrame>
            </div>
        </div>
    )
}

// ---------- Embed tab content ----------
const BASE_URL = window.location.origin

function buildAppearanceParams(appearance) {
    const params = new URLSearchParams()
    const defaults = APPEARANCE_DEFAULTS
    if (appearance.bgColor && appearance.bgColor !== defaults.bgColor) params.set('bg', appearance.bgColor.replace('#', ''))
    if (appearance.cardBg && appearance.cardBg !== defaults.cardBg) params.set('cardBg', appearance.cardBg.replace('#', ''))
    if (appearance.textColor && appearance.textColor !== defaults.textColor) params.set('textColor', appearance.textColor.replace('#', ''))
    if (appearance.labelColor && appearance.labelColor !== defaults.labelColor) params.set('labelColor', appearance.labelColor.replace('#', ''))
    if (appearance.btnColor && appearance.btnColor !== defaults.btnColor) params.set('btnColor', appearance.btnColor.replace('#', ''))
    if (appearance.btnTextColor && appearance.btnTextColor !== defaults.btnTextColor) params.set('btnText', appearance.btnTextColor.replace('#', ''))
    if (appearance.borderRadius !== undefined && appearance.borderRadius !== defaults.borderRadius) params.set('radius', appearance.borderRadius)
    if (appearance.inputRadius !== undefined && appearance.inputRadius !== defaults.inputRadius) params.set('inputRadius', appearance.inputRadius)
    if (appearance.fontFamily && appearance.fontFamily !== defaults.fontFamily) params.set('font', appearance.fontFamily)
    if (appearance.maxWidth !== undefined && appearance.maxWidth !== defaults.maxWidth) params.set('maxW', appearance.maxWidth)
    if (appearance.padding !== undefined && appearance.padding !== defaults.padding) params.set('pad', appearance.padding)
    if (appearance.hideHeader) params.set('hideHeader', '1')
    if (appearance.btnStyle && appearance.btnStyle !== defaults.btnStyle) params.set('btnStyle', appearance.btnStyle)
    if (appearance.shadow && appearance.shadow !== defaults.shadow) params.set('shadow', appearance.shadow)
    if (appearance.themeMode && appearance.themeMode !== defaults.themeMode) params.set('themeMode', appearance.themeMode)
    return params.toString()
}

// ---------- Embed code console ----------
function EmbedCodeConsole({
    formUrl,
    formName,
    embedWidth,
    embedHeight,
    embedBorderRadius,
    embedAutoHeight,
    onCopy,
    copiedKey
}) {
    const finalWidth = embedWidth.endsWith('%') || embedWidth.endsWith('px') ? embedWidth : `${embedWidth}px`;
    const finalHeight = embedAutoHeight ? '100%' : (embedHeight.endsWith('px') ? embedHeight : `${embedHeight}px`);
    const styleStr = `border:none;border-radius:${embedBorderRadius}px;width:${finalWidth};height:${finalHeight};`;

    const iframeCode = `<iframe\n  src="${formUrl}"\n  width="${finalWidth}"\n  height="${finalHeight}"\n  frameborder="0"\n  style="${styleStr}"\n  title="${formName}"\n></iframe>`

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-slate-800 shadow-sm relative p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="ml-1 text-[11px] text-slate-500 lowercase font-mono">iframe.html</span>
                </span>

                <button
                    onClick={() => onCopy('iframe', iframeCode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${copiedKey === 'iframe'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                >
                    <span className="material-symbols-outlined text-[13px]">
                        {copiedKey === 'iframe' ? 'check' : 'content_copy'}
                    </span>
                    {copiedKey === 'iframe' ? 'Copied!' : 'Copy Code'}
                </button>
            </div>

            <div className="text-[11.5px] font-mono text-slate-650 leading-relaxed overflow-x-auto whitespace-pre h-[140px] max-h-[140px] scrollbar-thin scrollbar-thumb-slate-200">
                <code>
                    <span className="text-pink-600">&lt;iframe</span><br />
                    &nbsp;&nbsp;<span className="text-sky-600">src</span>=<span className="text-emerald-650">"{formUrl}"</span><br />
                    &nbsp;&nbsp;<span className="text-sky-600">width</span>=<span className="text-emerald-650">"{finalWidth}"</span><br />
                    &nbsp;&nbsp;<span className="text-sky-600">height</span>=<span className="text-emerald-650">"{finalHeight}"</span><br />
                    &nbsp;&nbsp;<span className="text-sky-600">frameborder</span>=<span className="text-emerald-650">"0"</span><br />
                    &nbsp;&nbsp;<span className="text-sky-600">style</span>=<span className="text-emerald-650">"{styleStr}"</span><br />
                    &nbsp;&nbsp;<span className="text-sky-600">title</span>=<span className="text-emerald-650">"{formName}"</span><br />
                    <span className="text-pink-600">&gt;&lt;/iframe&gt;</span>
                </code>
            </div>
        </div>
    )
}

// ---------- Direct share card ----------
function DirectShareLinkCard({ formUrl, onCopy, copiedKey }) {
    return (
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
            <div>
                <h3 className="text-sm font-bold text-slate-800">Direct Share Link</h3>
                <p className="text-xs text-slate-500 mt-1">Use this direct link in text campaigns, social profiles, or direct emails.</p>
            </div>

            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    readOnly
                    value={formUrl}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none"
                />

                <button
                    onClick={() => onCopy('link', formUrl)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${copiedKey === 'link'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                >
                    <span className="material-symbols-outlined text-[13px]">{copiedKey === 'link' ? 'check' : 'content_copy'}</span>
                    {copiedKey === 'link' ? 'Copied!' : 'Copy'}
                </button>

                <a
                    href={formUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shrink-0"
                >
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    Open
                </a>
            </div>
        </div>
    )
}

// ---------- QR code card ----------
function QRCodeCard({ formUrl, formName }) {
    const [copied, setCopied] = useState(false);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formUrl)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(formUrl).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleDownload = async () => {
        try {
            const dlUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(formUrl)}`;
            const res = await fetch(dlUrl);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${formName.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.open(qrUrl, '_blank');
        }
    }

    return (
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col items-center text-center gap-4 h-full justify-between">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner">
                <img
                    src={qrUrl}
                    alt="Form QR Code"
                    className="w-36 h-36 border border-slate-200 rounded-xl bg-white p-1.5 shadow-sm"
                />
            </div>

            <div className="flex flex-col gap-2 w-full">
                <button
                    onClick={handleDownload}
                    className="w-full py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    Download PNG
                </button>
                <button
                    onClick={handleCopy}
                    className={`w-full py-2 text-xs font-semibold border rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${copied
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'link'}</span>
                    {copied ? 'Copied URL' : 'Copy Form URL'}
                </button>
            </div>
        </div>
    )
}

// ---------- Embed options config panel ----------
function EmbedOptionsPanel({
    embedWidth, setEmbedWidth,
    embedHeight, setEmbedHeight,
    embedBorderRadius, setEmbedBorderRadius,
    embedAutoHeight, setEmbedAutoHeight,
    embedTheme, setEmbedTheme,
    embedShowBranding, setEmbedShowBranding,
    embedAutoResize, setEmbedAutoResize
}) {
    return (
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-5">
            <div>
                <h3 className="text-sm font-bold text-slate-800">Embed Configuration</h3>
                <p className="text-xs text-slate-500 mt-1">Configure layout, size scaling, and indicators for code generation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Width */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Width</label>
                    <input
                        type="text"
                        value={embedWidth}
                        onChange={e => setEmbedWidth(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-850 focus:outline-none"
                        placeholder="e.g. 100% or 500"
                    />
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Height (px)</label>
                    <input
                        type="text"
                        value={embedHeight}
                        disabled={embedAutoHeight}
                        onChange={e => setEmbedHeight(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-855 focus:outline-none disabled:opacity-50 disabled:bg-slate-55"
                        placeholder="e.g. 600"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-1.5 col-span-2">
                    <div className="flex justify-between">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IFrame Border Radius</label>
                        <span className="text-[11px] font-bold text-primary">{embedBorderRadius}px</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="24"
                        value={embedBorderRadius}
                        onChange={e => setEmbedBorderRadius(e.target.value)}
                        className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
                    />
                </div>

                {/* Theme Selector */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">IFrame Base Theme</label>
                    <select
                        value={embedTheme}
                        onChange={e => setEmbedTheme(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-855 focus:outline-none cursor-pointer font-medium"
                    >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                    </select>
                </div>

                {/* Auto Height Toggle */}
                <div className="flex items-center justify-between col-span-1 border-t border-slate-100 pt-3 md:border-none md:pt-0">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-700 block">Auto Height</span>
                        <span className="text-[10px] text-slate-500 block">Form takes full dynamic content height</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEmbedAutoHeight(!embedAutoHeight)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${embedAutoHeight ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${embedAutoHeight ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                    </button>
                </div>

                {/* Show Branding Toggle */}
                <div className="flex items-center justify-between col-span-1 border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-700 block">Show branding logo</span>
                        <span className="text-[10px] text-slate-500 block">Displays logo links below form</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEmbedShowBranding(!embedShowBranding)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${embedShowBranding ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${embedShowBranding ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                    </button>
                </div>

                {/* Enable Auto Resize Toggle */}
                <div className="flex items-center justify-between col-span-1 border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-700 block">Auto resize responsive</span>
                        <span className="text-[10px] text-slate-500 block">Auto scales widgets based on viewport</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEmbedAutoResize(!embedAutoResize)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${embedAutoResize ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${embedAutoResize ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ---------- Main Page ----------
export default function FormEmbedPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [formsList, setFormsList] = useState([])
    const [selectedForm, setSelectedForm] = useState(null)
    const [activeTab, setActiveTab] = useState('embed') // 'embed' | 'preview' | 'appearance'
    const [copiedKey, setCopiedKey] = useState(null)
    const [search, setSearch] = useState('')
    const [appearance, setAppearance] = useState({ ...APPEARANCE_DEFAULTS })
    const [showHowItWorks, setShowHowItWorks] = useState(false)

    // Dynamic embed option states
    const [embedWidth, setEmbedWidth] = useState('100%')
    const [embedHeight, setEmbedHeight] = useState('600')
    const [embedBorderRadius, setEmbedBorderRadius] = useState('12')
    const [embedAutoHeight, setEmbedAutoHeight] = useState(false)
    const [embedTheme, setEmbedTheme] = useState('light')
    const [embedShowBranding, setEmbedShowBranding] = useState(true)
    const [embedAutoResize, setEmbedAutoResize] = useState(true)

    useEffect(() => {
        const fetchForms = async () => {
            const startTime = Date.now()
            try {
                const token = localStorage.getItem('authToken');
                if (!token || token === 'mock-jwt-token') {
                    setFormsList([]);
                    setSelectedForm(null);
                    const elapsed = Date.now() - startTime
                    const delay = Math.max(0, 500 - elapsed)
                    setTimeout(() => setIsLoading(false), delay)
                    return;
                }
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/form/get-form`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormsList(data);
                    if (data.length > 0) {
                        setSelectedForm(data[0]);
                    }
                } else {
                    setFormsList([]);
                    setSelectedForm(null);
                }
            } catch (err) {
                console.error("Failed to load forms from backend:", err);
                setFormsList([]);
                setSelectedForm(null);
            } finally {
                const elapsed = Date.now() - startTime
                const delay = Math.max(0, 500 - elapsed)
                setTimeout(() => {
                    setIsLoading(false);
                }, delay)
            }
        };
        fetchForms();
    }, []);

    const filtered = formsList.filter(f => {
        const nameStr = f.name || '';
        return nameStr.toLowerCase().includes(search.toLowerCase());
    })

    // Pagination State for Forms
    const [currentPage, setCurrentPage] = useState(1)
    const formsPerPage = 5

    // Reset pagination to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    const paginatedForms = filtered.slice(
        (currentPage - 1) * formsPerPage,
        (currentPage - 1) * formsPerPage + formsPerPage
    )

    const handleCopy = (key, text) => {
        navigator.clipboard.writeText(text).catch(() => { })
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const statusStyle = {
        PUBLISHED: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
        DRAFT: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
        TEMPLATE: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    }

    // Embed URL calculation
    const tokenOrId = selectedForm ? (selectedForm.public_token || selectedForm.id) : '';
    const qs = buildAppearanceParams(appearance)
    const embedParams = new URLSearchParams()
    if (embedTheme) embedParams.set('theme', embedTheme)
    if (!embedShowBranding) embedParams.set('hideBranding', '1')
    if (embedAutoResize) embedParams.set('autoResize', '1')
    const finalQs = [qs, embedParams.toString()].filter(Boolean).join('&')
    const formUrl = selectedForm ? `${BASE_URL}/embed/form/${tokenOrId}${finalQs ? `?${finalQs}` : ''}` : '';

    if (isLoading) {
        return <FormEmbedSkeleton />
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-6 md:p-8">
            <div className="max-w-[1100px] mx-auto">

                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between border-b border-slate-200 pb-6 gap-4">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-32px font-black text-slate-950 tracking-tight">Form Embed &amp; Share</h1>
                            {selectedForm && (
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusStyle[selectedForm.status] || 'bg-slate-105 text-slate-650'}`}>
                                    {selectedForm.status}
                                </span>
                            )}
                        </div>
                        {selectedForm && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                <span className="flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">fingerprint</span>
                                    ID: {selectedForm.id}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">dataset</span>
                                    {selectedForm.fields.length} fields
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
                                    {selectedForm.responses != null ? selectedForm.responses.toLocaleString() : 0} responses
                                </span>
                            </div>
                        )}

                    </div>
                    <div className="shrink-0">
                        <Link
                            to="/admin/form-builder"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-250 text-xs font-semibold text-slate-700 hover:bg-slate-55 transition-colors shadow-sm cursor-pointer bg-white"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Back to Forms
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ── Left: Form Selector (Sidebar) ── */}
                    <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search forms..."
                                className="w-full h-9.5 pl-9 pr-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-850 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-450 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
                            {filtered.length === 0 && (
                                <p className="text-sm text-center text-slate-400 py-8">No forms found</p>
                            )}
                            {paginatedForms.map(form => {
                                const isSelected = selectedForm?.id === form.id;
                                return (
                                    <motion.button
                                        key={form.id}
                                        onClick={() => setSelectedForm(form)}
                                        whileHover={{ x: isSelected ? 0 : 2 }}
                                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                                        className={`relative w-full text-left p-3 rounded-xl border transition-all cursor-pointer select-none overflow-hidden ${isSelected
                                            ? 'border-primary bg-primary/[0.02] shadow-sm font-semibold'
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                                            }`}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="activeFormBorder"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                                                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                                            />
                                        )}
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <p className="text-xs font-bold text-slate-855 leading-snug line-clamp-1">{form.name}</p>
                                            <span className={`shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${statusStyle[form.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {form.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px] text-slate-400">dataset</span>
                                                {form.fields.length} fields
                                            </span>
                                            {form.responses != null && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px] text-slate-400">person</span>
                                                    {form.responses.toLocaleString()} responses
                                                </span>
                                            )}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Compact Pagination Controls */}
                        {filtered.length > formsPerPage && (
                            <div className="flex items-center justify-between text-[11px] text-slate-500 select-none mt-2 px-1">
                                <span>Page {currentPage} of {Math.ceil(filtered.length / formsPerPage)}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`p-1 rounded-md transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filtered.length / formsPerPage)))}
                                        disabled={currentPage === Math.ceil(filtered.length / formsPerPage)}
                                        className={`p-1 rounded-md transition-colors ${currentPage === Math.ceil(filtered.length / formsPerPage) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right: Embed Config Area ── */}
                    <div className="flex-1 min-w-0 w-full">
                        {selectedForm ? (
                            <motion.div
                                key={selectedForm.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                            >
                                {/* Segmented Control Tabs */}
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                                    <div className="flex bg-slate-105 p-1 rounded-xl gap-1 relative select-none w-fit border border-slate-200/20">
                                        {[
                                            { id: 'embed', icon: 'code', label: 'Embed Code' },
                                            { id: 'appearance', icon: 'palette', label: 'Appearance' },
                                            { id: 'preview', icon: 'visibility', label: 'Live Preview' },
                                        ].map(tab => {
                                            const isTabActive = activeTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`relative cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg transition-all focus:outline-none flex items-center gap-1.5 ${isTabActive
                                                        ? 'text-slate-900 font-bold shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-800'
                                                        }`}
                                                >
                                                    {isTabActive && (
                                                        <motion.div
                                                            layoutId="activeTabBg"
                                                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                                            style={{ zIndex: 1 }}
                                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                        />
                                                    )}
                                                    <span className="relative z-10 flex items-center gap-1.5">
                                                        <Icon name={tab.icon} size={14} />
                                                        {tab.label}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Tab content */}
                                <div className="p-6">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'embed' ? (
                                            <motion.div
                                                key="embed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-6"
                                            >
                                                <EmbedCodeConsole
                                                    formUrl={formUrl}
                                                    formName={selectedForm.name}
                                                    embedWidth={embedWidth}
                                                    embedHeight={embedHeight}
                                                    embedBorderRadius={embedBorderRadius}
                                                    embedAutoHeight={embedAutoHeight}
                                                    onCopy={handleCopy}
                                                    copiedKey={copiedKey}
                                                />

                                                <DirectShareLinkCard
                                                    formUrl={formUrl}
                                                    onCopy={handleCopy}
                                                    copiedKey={copiedKey}
                                                />
                                            </motion.div>
                                        ) : activeTab === 'appearance' ? (
                                            <motion.div
                                                key="appearance"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <AppearancePanel
                                                    appearance={appearance}
                                                    setAppearance={setAppearance}
                                                    form={selectedForm}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="preview"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <div className="w-full">
                                                    <SimulatedBrowserFrame urlParams={buildAppearanceParams(appearance)}>
                                                        <div className="min-h-[480px]">
                                                            <LiveFormPreview form={selectedForm} appearance={appearance} />
                                                        </div>
                                                    </SimulatedBrowserFrame>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex items-center justify-center h-64 border border-dashed border-slate-250 rounded-2xl text-slate-400 text-sm">
                                Select a form from the left sidebar to get started.
                            </div>
                        )}
                    </div>
                </div>

                {/* Collapsible Info Accordion */}
                <div className="border border-slate-200 rounded-xl bg-white mt-8 overflow-hidden shadow-sm">
                    <button
                        onClick={() => setShowHowItWorks(!showHowItWorks)}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-700 hover:bg-slate-50/50 transition-colors uppercase tracking-wider focus:outline-none"
                    >
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">help_outline</span>
                            How embedding works
                        </span>
                        <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${showHowItWorks ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    <AnimatePresence>
                        {showHowItWorks && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 border-t border-slate-200 text-xs text-slate-500 leading-relaxed space-y-3 bg-slate-50/10">
                                    <p className="font-semibold text-slate-700">Getting Started with Forms Integration:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>iFrame Code Embed:</strong> Copy the code snippet from the "Embed Code" card and insert it inside your site manager editor. If your site builder doesn't support auto-height resizing, configure absolute width and height attributes in the customization section.</li>
                                        <li><strong>Sharing Directly:</strong> Generate direct links or download high-quality PNG QR codes to distribute forms directly via emails, buttons, social links, or printed media.</li>
                                        <li><strong>Capturing Leads:</strong> Every submission sent from your embedded forms gets validated and routed directly to the <Link to="/admin/all-leads" className="text-primary font-semibold hover:underline">All Leads</Link> dashboard in real-time.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}

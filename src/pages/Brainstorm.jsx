import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Toast from '../components/Toast'
import '../assets/brainstorm/brainstorm.css'

export default function Brainstorm() {
    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [tool, setTool] = useState('pen')
    const [color, setColor] = useState('#000000')
    const [strokeWidth, setStrokeWidth] = useState(2)
    const [toastMessage, setToastMessage] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [elements, setElements] = useState([])
    const [currentElement, setCurrentElement] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showShapesMenu, setShowShapesMenu] = useState(false)
    const [showTextDialog, setShowTextDialog] = useState(false)
    const [textInput, setTextInput] = useState('')
    const [selectedElement, setSelectedElement] = useState(null)

    const triggerToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

    const tools = [
        { id: 'pen', icon: 'edit', label: 'Draw' },
        { id: 'text', icon: 'text_fields', label: 'Text' },
        { id: 'shapes', icon: 'square', label: 'Shapes' },
        { id: 'line', icon: 'straight', label: 'Line' },
        { id: 'arrow', icon: 'trending_flat', label: 'Arrow' },
        { id: 'eraser', icon: 'auto_delete', label: 'Erase' },
        { id: 'select', icon: 'pan_tool', label: 'Select' }
    ]

    const shapes = [
        { id: 'rectangle', icon: 'square', label: 'Rectangle' },
        { id: 'circle', icon: 'radio_button_unchecked', label: 'Circle' },
        { id: 'triangle', icon: 'change_history', label: 'Triangle' },
        { id: 'diamond', icon: 'diamond', label: 'Diamond' }
    ]

    const colors = [
        '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
    ]

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            redrawCanvas()
        }

        const handleResize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            redrawCanvas()
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [elements])

    const redrawCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        ctx.translate(panX, panY)
        ctx.scale(zoom, zoom)

        elements.forEach(element => drawElement(ctx, element))

        ctx.restore()
    }

    const drawElement = (ctx, element) => {
        ctx.strokeStyle = element.color || color
        ctx.fillStyle = element.color || color
        ctx.lineWidth = element.strokeWidth || strokeWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        switch (element.type) {
            case 'pen':
                if (element.points && element.points.length > 1) {
                    ctx.beginPath()
                    ctx.moveTo(element.points[0].x, element.points[0].y)
                    element.points.forEach(point => ctx.lineTo(point.x, point.y))
                    ctx.stroke()
                }
                break
            case 'line':
                ctx.beginPath()
                ctx.moveTo(element.start.x, element.start.y)
                ctx.lineTo(element.end.x, element.end.y)
                ctx.stroke()
                break
            case 'rectangle':
                ctx.strokeRect(
                    Math.min(element.start.x, element.end.x),
                    Math.min(element.start.y, element.end.y),
                    Math.abs(element.end.x - element.start.x),
                    Math.abs(element.end.y - element.start.y)
                )
                break
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(element.end.x - element.start.x, 2) +
                    Math.pow(element.end.y - element.start.y, 2)
                )
                ctx.beginPath()
                ctx.arc(element.start.x, element.start.y, radius, 0, 2 * Math.PI)
                ctx.stroke()
                break
            case 'text':
                ctx.font = `${element.fontSize || 16}px Arial`
                ctx.fillText(element.text, element.x, element.y)
                break
            default:
                break
        }
    }

    const getMousePos = (e) => {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        return {
            x: (e.clientX - rect.left - panX) / zoom,
            y: (e.clientY - rect.top - panY) / zoom
        }
    }

    const handleMouseDown = (e) => {
        if (tool === 'select') return

        const pos = getMousePos(e)

        if (tool === 'text') {
            setShowTextDialog(true)
            setCurrentElement({ type: 'text', x: pos.x, y: pos.y })
            return
        }

        setIsDrawing(true)
        setCurrentElement({
            type: tool,
            start: pos,
            end: pos,
            points: tool === 'pen' ? [pos] : undefined,
            color: color,
            strokeWidth: strokeWidth
        })
    }

    const handleMouseMove = (e) => {
        if (!isDrawing || !currentElement) return

        const pos = getMousePos(e)

        if (tool === 'pen') {
            setCurrentElement(prev => ({
                ...prev,
                points: [...(prev.points || []), pos]
            }))
        } else {
            setCurrentElement(prev => ({
                ...prev,
                end: pos
            }))
        }

        redrawCanvas()
        const ctx = canvasRef.current.getContext('2d')
        ctx.save()
        ctx.translate(panX, panY)
        ctx.scale(zoom, zoom)
        drawElement(ctx, currentElement)
        ctx.restore()
    }

    const handleMouseUp = () => {
        if (currentElement && isDrawing) {
            setElements([...elements, currentElement])
            setCurrentElement(null)
            triggerToast(`${tool} added`)
        }
        setIsDrawing(false)
    }

    const addText = () => {
        if (textInput.trim()) {
            const newText = {
                ...currentElement,
                text: textInput,
                fontSize: 16
            }
            setElements([...elements, newText])
            setTextInput('')
            setShowTextDialog(false)
            triggerToast('Text added')
        }
    }

    const handleClear = () => {
        setElements([])
        triggerToast('Canvas cleared')
    }

    const handleUndo = () => {
        if (elements.length > 0) {
            setElements(elements.slice(0, -1))
            triggerToast('Action undone')
        }
    }

    const handleDownload = () => {
        const canvas = canvasRef.current
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `brainstorm-${Date.now()}.png`
        link.click()
        triggerToast('Brainstorm downloaded')
    }

    const handleZoom = (direction) => {
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2
        setZoom(Math.max(0.5, Math.min(3, newZoom)))
    }

    return (
        <div className="brainstorm-container">
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            {/* Header */}
            <div className="brainstorm-header">
                <div className="brainstorm-header-left">
                    <h1 className="brainstorm-title">Brainstorm Board</h1>
                    <p className="brainstorm-subtitle">Create diagrams, notes & visual ideas</p>
                </div>
                <div className="brainstorm-header-actions">
                    <button
                        onClick={() => handleZoom('out')}
                        className="brainstorm-btn-compact"
                        title="Zoom out"
                    >
                        <span className="material-symbols-outlined">zoom_out</span>
                    </button>
                    <span className="brainstorm-zoom-display">{Math.round(zoom * 100)}%</span>
                    <button
                        onClick={() => handleZoom('in')}
                        className="brainstorm-btn-compact"
                        title="Zoom in"
                    >
                        <span className="material-symbols-outlined">zoom_in</span>
                    </button>
                    <div className="brainstorm-divider" />
                    <button
                        onClick={handleUndo}
                        className="brainstorm-btn-compact"
                        title="Undo (Ctrl+Z)"
                    >
                        <span className="material-symbols-outlined">undo</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="brainstorm-btn-compact"
                        title="Download"
                    >
                        <span className="material-symbols-outlined">download</span>
                    </button>
                    <button
                        onClick={handleClear}
                        className="brainstorm-btn-compact brainstorm-btn-danger"
                        title="Clear canvas"
                    >
                        <span className="material-symbols-outlined">delete_sweep</span>
                    </button>
                </div>
            </div>

            <div className="brainstorm-workspace">
                {/* Toolbar Left */}
                <div className="brainstorm-toolbar">
                    <div className="brainstorm-toolbar-section">
                        <label className="brainstorm-toolbar-label">Tools</label>
                        {tools.map(t => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTool(t.id)
                                    if (t.id === 'shapes') {
                                        setShowShapesMenu(!showShapesMenu)
                                    }
                                }}
                                className={`brainstorm-toolbar-btn ${tool === t.id ? 'active' : ''}`}
                                title={t.label}
                            >
                                <span className="material-symbols-outlined">{t.icon}</span>
                                <span className="brainstorm-toolbar-tooltip">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Shapes Submenu */}
                    <AnimatePresence>
                        {showShapesMenu && (
                            <motion.div
                                className="brainstorm-submenu"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <label className="brainstorm-toolbar-label">Shapes</label>
                                {shapes.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setTool(s.id)
                                            setShowShapesMenu(false)
                                        }}
                                        className="brainstorm-toolbar-btn"
                                        title={s.label}
                                    >
                                        <span className="material-symbols-outlined">{s.icon}</span>
                                        <span className="brainstorm-toolbar-tooltip">{s.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="brainstorm-toolbar-section">
                        <label className="brainstorm-toolbar-label">Size</label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={strokeWidth}
                            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                            className="brainstorm-slider"
                        />
                        <span className="brainstorm-size-display">{strokeWidth}px</span>
                    </div>

                    <div className="brainstorm-toolbar-section">
                        <label className="brainstorm-toolbar-label">Colors</label>
                        <div className="brainstorm-color-grid">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`brainstorm-color-btn ${color === c ? 'active' : ''}`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="brainstorm-color-picker"
                        />
                    </div>
                </div>

                {/* Canvas */}
                <div className="brainstorm-canvas-wrapper">
                    <canvas
                        ref={canvasRef}
                        className="brainstorm-canvas"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                </div>

                {/* Right Panel - Properties */}
                <div className="brainstorm-properties">
                    <h3 className="brainstorm-properties-title">Properties</h3>
                    <div className="brainstorm-properties-info">
                        <p className="brainstorm-info-item">
                            <span>Elements:</span>
                            <strong>{elements.length}</strong>
                        </p>
                        <p className="brainstorm-info-item">
                            <span>Tool:</span>
                            <strong>{tool}</strong>
                        </p>
                        <p className="brainstorm-info-item">
                            <span>Color:</span>
                            <span
                                className="brainstorm-color-preview"
                                style={{ backgroundColor: color }}
                            />
                        </p>
                    </div>
                </div>
            </div>

            {/* Text Input Dialog */}
            <AnimatePresence>
                {showTextDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTextDialog(false)}
                            className="brainstorm-modal-overlay"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="brainstorm-modal"
                        >
                            <h3 className="brainstorm-modal-title">Add Text</h3>
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Enter your text here..."
                                className="brainstorm-textarea"
                                autoFocus
                            />
                            <div className="brainstorm-modal-actions">
                                <button
                                    onClick={() => setShowTextDialog(false)}
                                    className="brainstorm-btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addText}
                                    className="brainstorm-btn-primary"
                                >
                                    Add Text
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
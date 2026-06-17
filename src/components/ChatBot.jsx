import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'model',
            text: 'Hello! I am your LMS AI Assistant. Ask me anything about your leads, e.g. "who enquired about BCA?" or "show leads with status Qualified".'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(true);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setUnread(false);
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');

        const newUserMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: userMsg
        };
        setMessages(prev => [...prev, newUserMessage]);
        setLoading(true);

        const history = messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMsg,
                    history
                })
            });

            if (response.ok) {
                const data = await response.json();

                const newModelMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: data.reply || "I couldn't process that response."
                };
                setMessages(prev => [...prev, newModelMessage]);

                if (data.command) {
                    const cmd = data.command;
                    const action = cmd.action;
                    const val = cmd.value;

                    if (action === 'filter_query') {
                        window.dispatchEvent(new CustomEvent('lms-bot-filter', { detail: { query: val } }));
                    } else if (action === 'filter_status') {
                        window.dispatchEvent(new CustomEvent('lms-bot-filter', { detail: { status: val } }));
                    } else if (action === 'filter_search') {
                        window.dispatchEvent(new CustomEvent('lms-bot-filter', { detail: { search: val } }));
                    } else if (action === 'clear_filters') {
                        window.dispatchEvent(new CustomEvent('lms-bot-filter', { detail: { clear: true } }));
                    }
                }
            } else {
                const errData = await response.json().catch(() => ({}));
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: `Error: ${errData.error || "Failed to communicate with AI Assistant."}`
                }]);
            }
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Network error. Please make sure the backend is running and try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Floating Chat Icon Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-toggle-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="material-symbols-outlined icon" style={{ fontSize: '26px' }}>
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
                {!isOpen && unread && (
                    <span className="chatbot-badge"></span>
                )}
            </motion.button>

            {/* Chatbot Popup Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.2 }}
                        className="chatbot-window"
                    >
                        {/* Header */}
                        <div className="chatbot-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="chatbot-avatar">
                                    <span className="material-symbols-outlined text-indigo-600" style={{ fontSize: '18px' }}>smart_toy</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>LMS AI Assistant</h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#dae2fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                                        Gemini Active
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                            </button>
                        </div>

                        {/* Messages List */}
                        <div className="chatbot-messages">
                            {messages.map((m) => {
                                const isModel = m.role === 'model';
                                return (
                                    <div
                                        key={m.id}
                                        className={`chatbot-message ${isModel ? 'model' : 'user'}`}
                                    >
                                        {isModel && (
                                            <div className="chatbot-avatar">
                                                <span className="material-symbols-outlined text-indigo-600" style={{ fontSize: '15px' }}>smart_toy</span>
                                            </div>
                                        )}
                                        <div className="chatbot-bubble">
                                            {m.text}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing Indicator */}
                            {loading && (
                                <div className="chatbot-message model">
                                    <div className="chatbot-avatar">
                                        <span className="material-symbols-outlined text-indigo-600" style={{ fontSize: '15px' }}>smart_toy</span>
                                    </div>
                                    <div className="chatbot-bubble">
                                        <div className="chatbot-typing-dots">
                                            <span className="chatbot-typing-dot"></span>
                                            <span className="chatbot-typing-dot"></span>
                                            <span className="chatbot-typing-dot"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="chatbot-input-area">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your leads..."
                                disabled={loading}
                                className="chatbot-input"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="chatbot-send-btn"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

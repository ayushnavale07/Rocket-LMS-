import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { MessageSquare, Send, X, Minus } from 'lucide-react';
import API_BASE_URL from '../api/config';
import './AIChatbot.css';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am your AI learning assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const nodeRef = useRef(null); // Added nodeRef for React 19 compatibility

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the brain! Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chatbot-wrapper">
            {!isOpen ? (
                <Draggable nodeRef={nodeRef}>
                    <div className="chat-trigger" onClick={() => setIsOpen(true)} ref={nodeRef}>
                        <MessageSquare size={24} color="white" />
                        <span className="tooltip">Chat with AI</span>
                    </div>
                </Draggable>
            ) : (
                <Draggable handle=".chat-header" nodeRef={nodeRef}>
                    <div className="chat-window" ref={nodeRef}>
                        <div className="chat-header">
                            <div className="header-info">
                                <div className="ai-avatar">AI</div>
                                <span>Rocket Assistant</span>
                            </div>
                            <div className="header-actions">
                                <button onClick={() => setIsOpen(false)}><Minus size={18} /></button>
                                <button onClick={() => setIsOpen(false)}><X size={18} /></button>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg, i) => (
                                <div key={i} className={`message ${msg.role}`}>
                                    <div className="msg-bubble">{msg.content}</div>
                                </div>
                            ))}
                            {loading && <div className="message assistant"><div className="msg-bubble loader-dots"><span>.</span><span>.</span><span>.</span></div></div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type your question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" disabled={loading}><Send size={18} /></button>
                        </form>
                    </div>
                </Draggable>
            )}
        </div>
    );
};

export default AIChatbot;

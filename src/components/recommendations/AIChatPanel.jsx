import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Brain,
  Send,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  MessageCircle,
  X,
} from 'lucide-react';
import { getMockResponse, getQuickChips } from '../../data/chatMockResponses';

/**
 * AI Chat Panel — a drug-aware clinical copilot chat that sits alongside
 * the recommendation cards. Supports contextual quick chips, typing
 * indicator, and pre-filled questions from medication cards.
 */
export default function AIChatPanel({
  open,
  onToggle,
  recommendations = [],
  actionedMap = {},
  drugContext,
  onClearContext,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Handle drug context from "Ask AI" button on cards
  useEffect(() => {
    if (drugContext && open) {
      const contextMessage = `Tell me about ${drugContext.med} — why was it recommended?`;
      setInputValue('');
      handleSendMessage(contextMessage);
      onClearContext?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugContext, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSendMessage = useCallback(
    (overrideMessage) => {
      const text = (overrideMessage || inputValue).trim();
      if (!text || isTyping) return;

      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      // Get mock AI response
      const { response, delay } = getMockResponse(text, recommendations || []);

      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'ai',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, delay);
    },
    [inputValue, isTyping, recommendations]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickChips = getQuickChips(recommendations || []);

  // Render markdown-like bold text
  const renderContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // -- Collapsed state --
  if (!open) {
    return (
      <div className="flex-shrink-0 animate-fade-in">
        <button
          onClick={onToggle}
          className="w-12 h-full min-h-[500px] bg-white border border-slate-200/80 rounded-2xl shadow-card flex flex-col items-center justify-center gap-3 hover:shadow-card-md hover:border-primary-200 transition-all duration-300 group"
          aria-label="Open AI chat"
        >
          <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <MessageCircle className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest [writing-mode:vertical-lr] group-hover:text-primary-600 transition-colors">
            Chat
          </span>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 transition-colors" />
        </button>
      </div>
    );
  }

  // -- Expanded state --
  return (
    <div className="w-[380px] flex-shrink-0 flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden animate-slide-in-right">
      {/* Purple accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 flex-shrink-0" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              GLYERAL Assistant
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Clinical decision support
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          aria-label="Collapse chat panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 scrollbar-thin"
        style={{ maxHeight: 'calc(100vh - 340px)', minHeight: '300px' }}
      >
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center py-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1.5">
              Clinical AI Assistant
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
              Ask me about recommended medications, drug interactions, clinical
              guidelines, or alternative treatment options.
            </p>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 animate-fade-in ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'ai'
                  ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                  : 'bg-slate-600'
              }`}
            >
              {msg.role === 'ai' ? (
                <Brain className="w-3.5 h-3.5 text-white" />
              ) : (
                <User className="w-3.5 h-3.5 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.role === 'ai'
                  ? 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-md'
                  : 'bg-primary-600 text-white rounded-tr-md'
              }`}
            >
              {msg.role === 'ai' ? (
                <div className="whitespace-pre-line">
                  {renderContent(msg.content)}
                </div>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex-shrink-0 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="typing-dot w-2 h-2 rounded-full bg-primary-400" />
                <span
                  className="typing-dot w-2 h-2 rounded-full bg-primary-400"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="typing-dot w-2 h-2 rounded-full bg-primary-400"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {quickChips.slice(0, 4).map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSendMessage(chip.message)}
                disabled={isTyping}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200/60 hover:bg-primary-100 hover:border-primary-300 transition-all duration-200 disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contextual chips after conversation starts */}
      {messages.length > 0 && messages.length < 6 && !isTyping && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {quickChips.slice(0, 3).map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSendMessage(chip.message)}
                disabled={isTyping}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-all duration-200 disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-3 py-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about medications..."
              disabled={isTyping}
              className="w-full px-3.5 py-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all disabled:opacity-60 disabled:bg-slate-50"
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-primary-600 shadow-sm hover:shadow-md"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          AI responses are simulated for demo purposes
        </p>
      </div>
    </div>
  );
}

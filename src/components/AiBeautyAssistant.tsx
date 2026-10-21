import React, { useState, useRef, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { getTranslation } from '../utils/translations';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  Scissors,
  Check,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAiLive?: boolean;
}

export const AiBeautyAssistant: React.FC = () => {
  const { 
    isAiAssistantOpen, 
    closeAiAssistant, 
    language, 
    openBookingModal, 
    services 
  } = useSalon();

  const t = (key: string) => getTranslation(language, key);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'नमस्ते! मैं ग्लो एंड ग्लैम सैलून की एआई सलाहकार हूँ। मैं आपके बालों की देखभाल, स्किनकेयर, ब्राइडल मेकओवर या बजट के अनुसार सही सर्विस चुनने में आपकी मदद कर सकती हूँ।'
        : language === 'pb'
        ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਗਲੋ ਐਂਡ ਗਲੈਮ ਦੀ ਏਆਈ ਸਲਾਹਕਾਰ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਹੇਅਰ ਸਟਾਈਲ, ਫੇਸ਼ੀਅਲ ਜਾਂ ਵਿਆਹ ਪੈਕੇਜ ਚੁਣਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ।'
        : 'Welcome to Glow & Glam Salon! I am your luxury beauty and bridal concierge. Ask me anything about haircare transformations, bridal packages, skin radiance rituals, or pre-event preparation tips.',
      timestamp: 'Just now',
      isAiLive: true,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLiveActive, setIsAiLiveActive] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    t('aiQuickPrompt1'),
    t('aiQuickPrompt2'),
    t('aiQuickPrompt3'),
    'Suggest a skincare routine for radiant bridal glow',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isAiAssistantOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), language }),
      });

      if (!response.ok) {
        throw new Error('Assistant API returned an error');
      }

      const data = await response.json();
      setIsAiLiveActive(!!data.isAiLive);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiLive: data.isAiLive,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      // Graceful fallback
      setIsAiLiveActive(false);
      const fallbackMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'For personalized recommendations, our signature 24K Gold Facial (₹4,500) and French Balayage (₹7,200) are top choices. You can also explore our Royal Maharani Bridal Extravaganza.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiLive: false,
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#E7E2DA] animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E2DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  {t('aiTitle')}
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isAiLiveActive 
                    ? 'bg-[#ECFDF5] text-[#059669]' 
                    : 'bg-[#FFFBEB] text-[#B45309]'
                }`}>
                  {isAiLiveActive ? t('aiLiveBadge') : t('aiDemoBadge')}
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] -mt-0.5">
                {t('aiSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={closeAiAssistant}
            className="p-1.5 rounded-lg text-[#78716C] hover:bg-[#F5F2EB] hover:text-[#1C1917] transition-colors"
            aria-label="Close AI Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#1C1917] text-[#FAF8F5] rounded-br-none'
                    : 'bg-white text-[#1C1917] border border-[#E7E2DA] rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line font-light">{msg.text}</div>

                {/* Direct Deep-Link Booking Button if suggested in response */}
                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-2.5 border-t border-[#F5F2EB] flex items-center justify-between">
                    <span className="text-[10px] text-[#A8A29E] font-mono">{msg.timestamp}</span>
                    <button
                      onClick={() => {
                        closeAiAssistant();
                        openBookingModal();
                      }}
                      className="bg-[#1C1917] text-[#FAF8F5] hover:bg-[#292524] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      <span>Book Treatment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-[#E7E2DA] rounded-xl text-xs text-[#78716C] max-w-[70%]">
              <RefreshCw className="w-3.5 h-3.5 text-[#B38838] animate-spin" />
              <span>{t('aiThinking')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-[#E7E2DA] bg-[#FAF6F0] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-[#B38838] shrink-0">
              Suggestions:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] text-[#57534E] bg-white border border-[#E7DECE] hover:border-[#1C1917] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#E7E2DA] space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiPlaceholder')}
              disabled={isLoading}
              className="flex-1 bg-[#FAF8F5] border border-[#D7D2C7] focus:border-[#1C1917] focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-[#1C1917] placeholder:text-[#A8A29E]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#1C1917] text-[#FAF8F5] disabled:opacity-40 hover:bg-[#292524] px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('aiSend')}</span>
              <Send className="w-3 h-3 text-[#C5A059]" />
            </button>
          </form>

          {/* Medical Disclaimer */}
          <div className="text-[10px] text-[#A8A29E] leading-tight flex items-start gap-1">
            <AlertCircle className="w-3 h-3 shrink-0 text-[#B38838] mt-0.5" />
            <span>{t('aiDisclaimer')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

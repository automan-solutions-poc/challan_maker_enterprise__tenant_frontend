import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, BookOpen, Languages } from "lucide-react";
import { supportBot } from "../api";
import "./SupportChatWidget.css";

const STORAGE_KEY = "support_language";

const DEFAULT_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
];

const GREETINGS = {
  en: "Hi! I'm the InfiChallan assistant. Ask me anything about creating, delivering, or troubleshooting challans.",
  hi: "नमस्ते! मैं InfiChallan सहायक हूँ। challan बनाने, डिलीवर करने या समस्या हल करने से जुड़ा कुछ भी पूछें।",
  ta: "வணக்கம்! நான் InfiChallan உதவியாளர். challan உருவாக்குதல், வழங்குதல் அல்லது சிக்கல் தீர்த்தல் பற்றி எதையும் கேளுங்கள்.",
  te: "నమస్కారం! నేను InfiChallan సహాయకుడిని. challan సృష్టించడం, డెలివరీ లేదా సమస్య పరిష్కారం గురించి ఏదైనా అడగండి.",
  bn: "হ্যালো! আমি InfiChallan সহকারী। challan তৈরি, ডেলিভারি বা সমস্যা সমাধান সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন।",
  mr: "नमस्कार! मी InfiChallan सहाय्यक आहे. challan तयार करणे, डिलिव्हरी किंवा अडचण याबद्दल काहीही विचारा.",
  gu: "નમસ્તે! હું InfiChallan સહાયક છું. challan બનાવવા, ડિલિવરી કે સમસ્યા વિશે કંઈપણ પૂછો.",
  kn: "ನಮಸ್ಕಾರ! ನಾನು InfiChallan ಸಹಾಯಕ. challan ರಚನೆ, ವಿತರಣೆ ಅಥವಾ ಸಮಸ್ಯೆ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ.",
  ml: "ഹലോ! ഞാൻ InfiChallan സഹായിയാണ്. challan സൃഷ്ടിക്കൽ, ഡെലിവറി അല്ലെങ്കിൽ പ്രശ്നം സംബന്ധിച്ച് എന്തും ചോദിക്കൂ.",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ InfiChallan ਸਹਾਇਕ ਹਾਂ। challan ਬਣਾਉਣ, ਡਿਲੀਵਰੀ ਜਾਂ ਸਮੱਸਿਆ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
};

const SUGGESTIONS = [
  "How do I create a challan?",
  "How does the delivery OTP work?",
  "Which image formats can I upload?",
];

const formatSource = (file = "") =>
  file
    .replace(/^workflows\//, "")
    .replace(/\.md$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const greetingFor = (code) => GREETINGS[code] || GREETINGS.en;

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState(DEFAULT_LANGUAGES);
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const hasLanguage = Boolean(language);

  useEffect(() => {
    if (!open) return;
    supportBot
      .languages()
      .then((data) => {
        if (data?.languages?.length) setLanguages(data.languages);
      })
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (open && hasLanguage && messages.length === 0) {
      setMessages([{ role: "assistant", text: greetingFor(language), citations: [] }]);
    }
  }, [open, hasLanguage, language, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open, hasLanguage]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const chooseLanguage = (code) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLanguage(code);
    setMessages([{ role: "assistant", text: greetingFor(code), citations: [] }]);
  };

  const send = useCallback(
    async (rawQuestion) => {
      const question = (rawQuestion ?? input).trim();
      if (!question || loading || !hasLanguage) return;

      setMessages((prev) => [...prev, { role: "user", text: question }]);
      setInput("");
      setLoading(true);

      try {
        const data = await supportBot.ask(question, language);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data?.answer || "I couldn't produce an answer. Please try again.",
            citations: data?.citations || [],
            abstained: data?.abstained,
          },
        ]);
      } catch (error) {
        const status = error?.response?.status;
        const text =
          status === 503
            ? "The support assistant is temporarily unavailable. Please try again later."
            : "Sorry, something went wrong while contacting the support assistant.";
        setMessages((prev) => [...prev, { role: "assistant", text, citations: [], error: true }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, hasLanguage, language]
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const activeLabel = useMemo(
    () => languages.find((item) => item.code === language)?.label || "English",
    [languages, language]
  );

  return (
    <>
      {open && (
        <div className="support-widget" role="dialog" aria-label="InfiChallan support assistant">
          <header className="support-widget__header">
            <div className="support-widget__brand">
              <span className="support-widget__avatar">
                <Sparkles size={18} />
              </span>
              <div>
                <div className="support-widget__title">InfiChallan Support</div>
                <div className="support-widget__subtitle">Answers from our documentation</div>
              </div>
            </div>
            <button
              className="support-widget__icon-btn"
              onClick={() => setOpen(false)}
              aria-label="Close support assistant"
            >
              <X size={18} />
            </button>
          </header>

          {hasLanguage && (
            <div className="support-widget__langbar">
              <Languages size={14} />
              <select
                value={language}
                onChange={(e) => chooseLanguage(e.target.value)}
                aria-label="Answer language"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className="support-widget__langhint">{activeLabel}</span>
            </div>
          )}

          {!hasLanguage ? (
            <div className="support-widget__picker">
              <p className="support-widget__picker-title">Choose your language</p>
              <p className="support-widget__picker-sub">
                Answers will be written only in the language you pick.
              </p>
              <div className="support-widget__picker-grid">
                {languages.map((item) => (
                  <button key={item.code} onClick={() => chooseLanguage(item.code)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="support-widget__messages" ref={scrollRef}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`support-msg support-msg--${message.role} ${
                      message.error ? "support-msg--error" : ""
                    }`}
                  >
                    <div className="support-msg__bubble">{message.text}</div>
                    {message.citations?.length > 0 && (
                      <ul className="support-msg__sources">
                        {message.citations.map((citation, cIndex) => (
                          <li key={cIndex} title={citation.excerpt}>
                            <BookOpen size={12} />
                            <span>{formatSource(citation.source_file)}</span>
                            {citation.section && (
                              <span className="support-msg__section">· {citation.section}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="support-msg support-msg--assistant">
                    <div className="support-msg__bubble support-msg__bubble--typing">
                      <Loader2 size={16} className="support-widget__spin" />
                      <span>Searching the docs…</span>
                    </div>
                  </div>
                )}

                {messages.length === 1 && !loading && (
                  <div className="support-widget__suggestions">
                    {SUGGESTIONS.map((suggestion) => (
                      <button key={suggestion} onClick={() => send(suggestion)}>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="support-widget__composer">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  placeholder="Ask a question…"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={loading}
                  aria-label="Ask a question"
                />
                <button
                  className="support-widget__send"
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  aria-label="Send question"
                >
                  {loading ? <Loader2 size={18} className="support-widget__spin" /> : <Send size={18} />}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        className={`support-widget__launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close support assistant" : "Open support assistant"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}

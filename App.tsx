import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import NewsGenerator from './components/news/NewsGenerator';
import QuoteGenerator from './components/quote/QuoteGenerator';
import MorningGenerator from './components/morning/MorningGenerator';
import StorageManager from './components/StorageManager';
import { LayoutTemplate, PenTool, Image as ImageIcon, MonitorPlay, Sparkles, KeyRound, ExternalLink } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('news-card');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isKeyReady, setIsKeyReady] = useState(true);
  
  // Dark Mode State - Defaulting to Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('bk_theme');
      return savedMode === 'light' ? false : true;
    } catch {
      return true;
    }
  });

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bk_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setIsKeyReady(true);
    }
  };

  const handleInvalidKey = () => {
    setIsKeyReady(false);
  };

  const updateLogo = (logoData: string) => {
    setCustomLogo(logoData);
    try {
      localStorage.setItem('bk_custom_logo', logoData);
    } catch (e) {
      console.error("Failed to save logo to local storage", e);
    }
  };

  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('bk_custom_logo');
      if (savedLogo) {
        setCustomLogo(savedLogo);
      }
    } catch (e) {
      console.error("Failed to load logo from local storage", e);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'news-card':
        return (
          <NewsGenerator 
            customLogo={customLogo}
            onApiKeyInvalid={handleInvalidKey}
          />
        );
      case 'quote-card':
        return (
          <QuoteGenerator 
            customLogo={customLogo}
            onApiKeyInvalid={handleInvalidKey}
          />
        );
      case 'morning-card':
        return (
          <MorningGenerator 
            customLogo={customLogo}
            onApiKeyInvalid={handleInvalidKey}
          />
        );
      case 'poster-maker':
        return <Placeholder title="পোস্টার মেকার" icon={<LayoutTemplate className="w-16 h-16 text-purple-400/40 mb-4"/>} desc="সোশ্যাল মিডিয়া পোস্ট ও বিজ্ঞাপন তৈরি করুন।" />;
      case 'thumbnail-maker':
        return <Placeholder title="থাম্বনেইল মেকার" icon={<MonitorPlay className="w-16 h-16 text-red-400/40 mb-4"/>} desc="ভিডিওর জন্য আকর্ষণীয় থাম্বনেইল ডিজাইন।" />;
      case 'image-editor':
        return <Placeholder title="ফটো এডিটর" icon={<ImageIcon className="w-16 h-16 text-blue-400/40 mb-4"/>} desc="ছবির কালার গ্রেডিং এবং বেসিক এডিটিং।" />;
      case 'text-tool':
        return <Placeholder title="টেক্সট টুল" icon={<PenTool className="w-16 h-16 text-orange-400/40 mb-4"/>} desc="ছবির ওপর সুন্দর বাংলা টাইপোগ্রাফি।" />;
      default:
        return (
          <NewsGenerator 
            customLogo={customLogo} 
            onApiKeyInvalid={handleInvalidKey}
          />
        );
    }
  };

  if (!isKeyReady) {
    return (
      <div className="min-h-screen bg-bk-bg-light dark:bg-bk-bg-dark flex items-center justify-center p-4 font-bengali transition-colors duration-500">
        <div className="max-w-lg w-full bg-bk-surface-light dark:bg-bk-surface-dark p-8 rounded-2xl shadow-xl border border-white dark:border-bk-border-dark text-center animate-in fade-in zoom-in-95">
           <div className="mx-auto w-16 h-16 flex items-center justify-center bg-bk-green/10 rounded-full mb-4">
               <KeyRound className="w-8 h-8 text-bk-green" />
           </div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-2">API কী পারমিশন সমস্যা</h1>
           <p className="text-slate-600 dark:text-gray-400 mb-6">
               AI ফিচারটি ব্যবহার করতে একটি সমস্যা হয়েছে, সম্ভবত API কী পারমিশনের কারণে। অনুগ্রহ করে একটি বৈধ, বিলিং-সক্ষম Google AI Studio API কী নির্বাচন করুন।
           </p>
           <button
               onClick={handleSelectKey}
               className="w-full py-3 bg-bk-green text-white font-bold rounded-xl shadow-lg hover:shadow-bk-green/30 hover:-translate-y-0.5 transform active:scale-[0.98] transition-all flex justify-center items-center"
           >
               সঠিক API কী নির্বাচন করুন
           </button>
           <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-bk-green transition-colors"
           >
              বিলিং সম্পর্কে আরও জানুন <ExternalLink className="w-3 h-3" />
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bk-bg-light dark:bg-bk-bg-dark font-bengali text-slate-800 dark:text-gray-100 pb-12 transition-colors duration-500 selection:bg-bk-green/30 selection:text-bk-green">
      <TopBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenGallery={() => setIsGalleryOpen(true)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="max-w-7xl mx-auto p-2 lg:p-8">
        {renderContent()}
      </main>

      <StorageManager 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(imageData) => updateLogo(imageData)}
      />
    </div>
  );
}

const Placeholder = ({ title, icon, desc }: { title: string, icon: React.ReactNode, desc: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-bk-surface-light dark:bg-bk-surface-dark rounded-3xl border border-dashed border-slate-200 dark:border-bk-border-dark shadow-sm animate-in fade-in zoom-in-95 duration-300 text-center p-8 max-w-2xl mx-auto mt-4">
    <div className="bg-bk-input-light dark:bg-bk-input-dark p-6 rounded-full mb-6 shadow-inner">
      {icon}
    </div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-2">{title}</h2>
    <p className="text-slate-500 dark:text-gray-400 mb-8 text-lg max-w-md">{desc}</p>
    
    <button className="group relative px-8 py-3 bg-slate-900 dark:bg-black text-white rounded-full font-medium hover:bg-bk-green transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <span className="relative z-10 flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> কাজ চলছে...
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  </div>
);

export default App;
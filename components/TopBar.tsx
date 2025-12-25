import React, { useState, useMemo } from 'react';
import { Newspaper, Image, PenTool, LayoutTemplate, Menu, X, FolderOpen, Settings, ChevronRight, Quote, MonitorPlay, Layers, Edit3, Moon, Sun, Calendar } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGallery: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const TOOL_CATEGORIES = {
  'news': {
    label: 'নিউজ ও মিডিয়া',
    icon: Newspaper,
    description: 'কার্ড এবং কোট জেনারেশন',
    tools: [
      { id: 'news-card', label: 'নিউজ কার্ড', icon: Newspaper },
      { id: 'quote-card', label: 'উক্তি কার্ড', icon: Quote },
      { id: 'morning-card', label: 'ডেউলি কার্ডস', icon: Calendar },
    ]
  },
  'social': {
    label: 'সোশ্যাল মিডিয়া',
    icon: Layers,
    description: 'পোস্টার এবং থাম্বনেইল',
    tools: [
      { id: 'poster-maker', label: 'পোস্টার মেকার', icon: LayoutTemplate },
      { id: 'thumbnail-maker', label: 'থাম্বনেইল', icon: MonitorPlay },
    ]
  },
  'editing': {
    label: 'এডিটিং টুলস',
    icon: Edit3,
    description: 'ছবি এবং টেক্সট এডিট',
    tools: [
      { id: 'image-editor', label: 'ফটো এডিটর', icon: Image },
      { id: 'text-tool', label: 'টেক্সট টুল', icon: PenTool },
    ]
  }
};

const TopBar: React.FC<TopBarProps> = React.memo(({ activeTab, setActiveTab, onOpenGallery, isDarkMode, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeCategoryKey = useMemo(() => {
    for (const [key, category] of Object.entries(TOOL_CATEGORIES)) {
      if (category.tools.find(t => t.id === activeTab)) {
        return key;
      }
    }
    return 'news';
  }, [activeTab]);

  const currentTools = TOOL_CATEGORIES[activeCategoryKey as keyof typeof TOOL_CATEGORIES].tools;

  const handleCategorySelect = (catKey: string) => {
    const category = TOOL_CATEGORIES[catKey as keyof typeof TOOL_CATEGORIES];
    if (category && category.tools.length > 0) {
      setActiveTab(category.tools[0].id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-bk-surface-light/80 dark:bg-bk-surface-dark/80 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-bk-border-dark transition-all duration-500">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => handleCategorySelect('news')}>
            <div className="w-9 h-9 rounded-full border-2 border-bk-red flex items-center justify-center overflow-hidden bg-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
               <div className="w-1.5 h-full bg-bk-green mx-[1px]"></div>
               <div className="w-1.5 h-full bg-bk-green mx-[1px]"></div>
            </div>
            <span className="font-bold text-xl text-bk-green tracking-tight hidden lg:block">
              বাঁশের<span className="text-bk-red">কেল্লা</span>
            </span>
          </div>
          
          {/* Center: Dynamic Tool Tabs */}
          <div className="flex-1 flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden mask-linear-fade -mx-2 px-2 sm:mx-0 sm:px-0">
            <div className="flex items-center bg-gray-100/50 dark:bg-bk-surface-dark p-1 rounded-full border border-gray-200/50 dark:border-bk-border-dark shadow-inner transition-colors duration-300">
              {currentTools.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-shrink-0 flex items-center px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-bk-green/10 text-bk-green dark:text-bk-green shadow-sm scale-105 ring-1 ring-gray-200 dark:ring-bk-green/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-white/5'
                    }
                  `}
                >
                  <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 ${activeTab === tab.id ? 'text-bk-red' : 'text-gray-400 dark:text-gray-500'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Menu & Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 pl-2">
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
                title={isDarkMode ? "লাইট মোড" : "ডার্ক মোড"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${isMobileMenuOpen ? 'bg-bk-green text-white rotate-90' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 inset-x-0 md:inset-x-auto md:right-4 w-full md:w-80 bg-bk-surface-light/95 dark:bg-bk-surface-dark/95 backdrop-blur-xl border-b md:border border-gray-200 dark:border-bk-border-dark shadow-2xl z-40 animate-in slide-in-from-top-2 md:rounded-2xl overflow-hidden">
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">টুলস ক্যাটাগরি</div>
            
            {Object.entries(TOOL_CATEGORIES).map(([key, cat]) => {
              const isActive = key === activeCategoryKey;
              return (
                <button
                  key={key}
                  onClick={() => handleCategorySelect(key)}
                  className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-bk-green/10 dark:bg-bk-green/10 text-bk-green ring-1 ring-bk-green/20' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-white dark:bg-bk-bg-dark text-bk-green shadow-sm' : 'bg-gray-100 dark:bg-bk-input-dark text-gray-500 dark:text-gray-400'}`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">{cat.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 opacity-80">{cat.description}</div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </button>
              );
            })}

            <div className="border-t border-gray-100 dark:border-bk-border-dark my-2 mx-2"></div>
            <div className="px-3 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">অন্যান্য</div>

            <button
                onClick={() => {
                  onOpenGallery();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors group"
              >
                <FolderOpen className="w-5 h-5 mr-3 text-yellow-500 group-hover:scale-110 transition-transform" />
                ফাইল গ্যালারি
            </button>

            <button className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 cursor-not-allowed">
                <Settings className="w-5 h-5 mr-3" />
                সেটিংস (শীঘ্রই আসছে)
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default TopBar;
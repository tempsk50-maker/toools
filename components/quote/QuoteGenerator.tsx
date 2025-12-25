import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Loader2, Sparkles, Upload, Trash2, RefreshCcw, Type, Image as ImageIcon, Star } from 'lucide-react';
import QuoteCanvas from './QuoteCanvas';
import { processNewsText } from '../../services/geminiService';
import { NewsData, NewsCardTemplate } from '../../types';

declare const html2canvas: any;

interface QuoteGeneratorProps {
  customLogo: string | null;
  onApiKeyInvalid: () => void;
}

const FONT_OPTIONS = [
  { id: 'hind', name: 'হিন্দ শিলিগুড়ি', css: "'Hind Siliguri', sans-serif" },
  { id: 'anek', name: 'অনেক বাংলা', css: "'Anek Bangla', sans-serif" },
  { id: 'tiro', name: 'তিরো বাংলা', css: "'Tiro Bangla', serif" },
  { id: 'noto-serif', name: 'নোটো সেরিফ', css: "'Noto Serif Bengali', serif" },
  { id: 'noto-sans', name: 'নোটো স্যান্স', css: "'Noto Sans Bengali', sans-serif" },
  { id: 'baloo', name: 'বালু দা ২', css: "'Baloo Da 2', sans-serif" },
  { id: 'mina', name: 'মিনা', css: "'Mina', sans-serif" },
  { id: 'galada', name: 'গলাদা', css: "'Galada', cursive" },
  { id: 'kalam', name: 'কালাম', css: "'Kalam', cursive" },
  { id: 'merriweather', name: 'মেরিওয়েদার', css: "'Merriweather', serif" },
  { id: 'oswald', name: 'অসওয়াল্ড', css: "'Oswald', sans-serif" },
];

const QUOTE_TEMPLATES: { id: NewsCardTemplate; label: string }[] = [
  { id: 'bk-quote-grid-classic', label: 'গ্রিড ক্লাসিক' },
  { id: 'bk-quote-red-split', label: 'রেড স্প্লিট' },
  { id: 'bk-quote-sidebar-green', label: 'গ্রিন সাইডবার' },
  { id: 'bk-quote-glass', label: 'ডার্ক গ্লাস' },
  { id: 'bk-quote-dark-vibe', label: 'ডার্ক ভাইব' },
  { id: 'bk-quote-elegant-frame', label: 'এলিগেন্ট ফ্রেম' },
];

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ 
  customLogo, 
  onApiKeyInvalid
}) => {
  const [inputText, setInputText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<NewsData>({ headline: '', body: '', caption: '' });
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isImageTransparent, setIsImageTransparent] = useState(true);

  const [defaultTemplate, setDefaultTemplate] = useState<NewsCardTemplate>(() => {
    try {
      const storedTemplate = localStorage.getItem('bk_default_template_quote') as NewsCardTemplate | null;
      const allIds = QUOTE_TEMPLATES.map(t => t.id);
      if (storedTemplate && allIds.includes(storedTemplate)) {
        return storedTemplate;
      }
      return 'bk-quote-grid-classic';
    } catch {
      return 'bk-quote-grid-classic';
    }
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<NewsCardTemplate>(defaultTemplate);

  const [defaultFont, setDefaultFont] = useState<string>(() => {
    try {
      return localStorage.getItem('bk_default_font') || FONT_OPTIONS[0].css;
    } catch {
      return FONT_OPTIONS[0].css;
    }
  });

  const [selectedFont, setSelectedFont] = useState<string>(defaultFont);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const fontMenuRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target as Node)) {
        setShowFontMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFontSelect = (fontCss: string) => {
    setSelectedFont(fontCss);
    setTimeout(() => setShowFontMenu(false), 150);
  };

  const handleSetDefault = (e: React.MouseEvent, fontCss: string) => {
    e.stopPropagation(); 
    setDefaultFont(fontCss);
    try {
      localStorage.setItem('bk_default_font', fontCss);
    } catch (e) {
      console.error("Could not save default font");
    }
  };

  const handleSetDefaultTemplate = (e: React.MouseEvent, templateId: NewsCardTemplate) => {
    e.stopPropagation();
    setDefaultTemplate(templateId);
    try {
      localStorage.setItem('bk_default_template_quote', templateId);
    } catch (e) {
      console.error("Could not save default template");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newImageUrls = Array.from(files).map((file) => URL.createObjectURL(file as Blob));
    setImages(prev => [...prev, ...newImageUrls]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleResize = useCallback(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth <= 0) return;
        const targetWidth = 600; 
        const buffer = 32; 
        const availableWidth = containerWidth - buffer;
        let newScale = availableWidth / targetWidth;
        if (newScale > 1) newScale = 1;
        if (newScale < 0.3) newScale = 0.3; 
        requestAnimationFrame(() => {
            setScale(newScale);
        });
      }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [handleResize]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    try {
      const result = await processNewsText(inputText, 'quote');
      setGeneratedData({
        headline: result.headline,
        body: result.body,
        caption: result.caption || ''
      });
    } catch (error: any) {
      const errorString = error?.toString() || '';
      if (errorString.includes('PERMISSION_DENIED') || errorString.includes('403')) {
        onApiKeyInvalid();
      } else {
        alert("AI এনালাইসিসে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = async () => {
    const originalNode = cardRef.current;
    if (!originalNode) return;

    setIsCapturing(true);

    const width = 600;
    const height = 750;

    const captureNode = originalNode.cloneNode(true) as HTMLElement;
    captureNode.style.width = `${width}px`;
    captureNode.style.height = `${height}px`;
    captureNode.style.position = 'absolute';
    captureNode.style.top = '0';
    captureNode.style.left = '-9999px'; 
    captureNode.style.transform = 'none';

    document.body.appendChild(captureNode);

    try {
        const canvas = await html2canvas(captureNode, {
            allowTaint: true,
            useCORS: true,
            scale: 2, 
            backgroundColor: '#ffffff', 
            logging: false,
        }) as HTMLCanvasElement;

        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);

        canvas.toBlob((blob: Blob | null) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bk-quote-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);

    } catch (error) {
        console.error("Capture failed:", error);
        alert("দুঃখিত, স্ক্রিনশট তৈরিতে সমস্যা হয়েছে।");
    } finally {
        document.body.removeChild(captureNode);
        setIsCapturing(false);
    }
  };

  const inputPlaceholder = 'উদাহরণ: "ছাত্ররা যদি জেগে ওঠে তবে কেউ তাদের থামাতে পারবে না" - ড. ইউনূস';
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 animate-in fade-in duration-300 relative">
      
      {showFlash && (
          <div className="fixed inset-0 z-[100] bg-white animate-out fade-out duration-300 pointer-events-none"></div>
      )}

      {/* Controls */}
      <div className="lg:col-span-5 space-y-2 lg:space-y-4 order-1">
        
        {/* Input */}
        <div className="bg-bk-surface-light dark:bg-bk-surface-dark p-3 lg:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-bk-border-dark transition-all">
          <div className="space-y-2 lg:space-y-3">
              <div className="relative" ref={fontMenuRef}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full h-36 p-4 pr-12 rounded-xl border border-bk-border-light dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-bk-input-dark focus:ring-2 focus:ring-bk-green/20 focus:border-bk-green outline-none resize-none text-sm transition-all shadow-inner"
                />
                <div className="absolute top-2 right-2 z-20">
                    <button 
                       onClick={() => setShowFontMenu(!showFontMenu)}
                       className="p-2 rounded-lg bg-white dark:bg-bk-surface-dark border border-gray-200 dark:border-bk-border-dark hover:text-bk-green transition-all shadow-sm"
                       title="ফন্ট পরিবর্তন করুন"
                    >
                       <Type className="w-4 h-4" />
                    </button>
                    {showFontMenu && (
                       <div className="absolute top-10 right-0 w-64 bg-bk-surface-light dark:bg-bk-surface-dark rounded-xl shadow-2xl border border-gray-100 dark:border-bk-border-dark overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                              {FONT_OPTIONS.map(font => (
                                  <button
                                     key={font.id}
                                     onClick={() => handleFontSelect(font.css)}
                                     className={`w-full text-left px-2 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 ${selectedFont === font.css ? 'bg-green-50 dark:bg-bk-green/10 border border-green-100 dark:border-bk-green/20' : 'hover:bg-gray-50 dark:hover:bg-bk-input-dark'}`}
                                  >
                                     <div onClick={(e) => handleSetDefault(e, font.css)} className="p-1">
                                         <Star className={`w-4 h-4 ${defaultFont === font.css ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                     </div>
                                     <span style={{ fontFamily: font.css }}>{font.name}</span>
                                  </button>
                              ))}
                          </div>
                       </div>
                    )}
                </div>
              </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !inputText}
              className="w-full py-3.5 bg-gradient-to-r from-bk-green to-[#006e36] text-white font-bold rounded-xl shadow-lg hover:shadow-bk-green/30 hover:-translate-y-0.5 transform active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? <Loader2 className="w-5 h-6 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
              {isProcessing ? 'প্রসেসিং হচ্ছে...' : 'এনালাইসিস ও তৈরি করুন'}
            </button>
          </div>
        </div>

        {/* Image Upload & Settings */}
        <div className="bg-bk-surface-light dark:bg-bk-surface-dark p-3 lg:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-bk-border-dark transition-all">
           <div className="flex justify-between items-center mb-2">
             <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
              <ImageIcon className="w-3.5 h-3.5 mr-2 text-bk-green" />
              বক্তার ছবি
            </h2>
           </div>
          
           <label className="w-full flex items-center gap-4 px-4 py-3 border border-dashed border-gray-300 dark:border-bk-border-dark rounded-xl cursor-pointer hover:border-bk-green dark:hover:border-bk-green hover:bg-bk-green/5 dark:hover:bg-bk-green/10 transition-all group bg-white dark:bg-bk-input-dark shadow-sm">
                <div className="p-2 bg-gray-100 dark:bg-bk-surface-dark rounded-full group-hover:bg-white dark:group-hover:bg-bk-bg-dark transition-colors flex-shrink-0">
                   <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-bk-green transition-colors" />
                </div>
                <div className="flex-1 overflow-hidden">
                     <div className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-bk-green transition-colors truncate">
                        {images.length > 0 ? 'আরও ছবি যুক্ত করুন' : 'ছবি আপলোড করুন'}
                     </div>
                     <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                        ক্লিক বা ড্র্যাগ অ্যান্ড ড্রপ
                     </div>
                </div>
                <span className="flex-shrink-0 px-3 py-1.5 bg-gray-100 dark:bg-bk-surface-dark rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-bk-green transition-colors border border-gray-200 dark:border-bk-border-dark">ব্রাউজ</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
           </label>
           
           {images.length > 0 && (
               <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                   {images.map((img, idx) => (
                       <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-bk-border-dark group shadow-sm bg-gray-50">
                           <img src={img} className="w-full h-full object-cover" />
                           <button 
                               onClick={() => removeImage(idx)} 
                               className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                               <Trash2 className="w-4 h-4 text-white hover:text-red-400" />
                           </button>
                       </div>
                   ))}
               </div>
           )}
           
            <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-gray-100 dark:border-bk-border-dark">
                <div className="flex items-center gap-2 p-2 bg-bk-input-light dark:bg-bk-input-dark/50 rounded-lg border border-gray-100 dark:border-bk-border-dark">
                    <input 
                        type="checkbox" 
                        id="transparent-mode"
                        checked={isImageTransparent}
                        onChange={(e) => setIsImageTransparent(e.target.checked)}
                        className="w-4 h-4 text-bk-green rounded focus:ring-bk-green cursor-pointer"
                    />
                    <label htmlFor="transparent-mode" className="text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                        ট্রান্সপারেন্ট ছবি?
                    </label>
                </div>
            </div>
        </div>
        
        {/* Manual Edit */}
        <div className="bg-bk-surface-light dark:bg-bk-surface-dark p-3 lg:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-bk-border-dark text-sm transition-all">
           <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center uppercase tracking-wide text-xs">
               <RefreshCcw className="w-4 h-4 mr-2 text-bk-green"/> ম্যানুয়াল এডিট
           </h3>
           <div className="space-y-2 lg:space-y-3">
                <textarea
                   className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-3 rounded-xl h-24 focus:bg-white dark:focus:bg-bk-input-dark focus:ring-2 focus:ring-bk-green/20 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" 
                   value={generatedData.headline} 
                   onChange={(e) => setGeneratedData({...generatedData, headline: e.target.value})}
                   placeholder="মূল উক্তি লিখুন"
                />
               <input 
                  type="text"
                  className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-3 rounded-xl focus:bg-white dark:focus:bg-bk-input-dark focus:ring-2 focus:ring-bk-green/20 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  value={generatedData.body}
                  onChange={(e) => setGeneratedData({...generatedData, body: e.target.value})}
                  placeholder="বক্তার নাম ও পদবী"
               />
           </div>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:col-span-7 flex flex-col items-center order-2 mt-0 lg:mt-0">
         <div className="sticky top-24 space-y-2 lg:space-y-4 w-full flex flex-col items-center">
            
            {/* Template Selector */}
            <div className="w-full bg-bk-surface-light dark:bg-bk-surface-dark p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-bk-border-dark transition-all">
               <div className="flex justify-start gap-2 overflow-x-auto pb-1 pt-1 px-1 no-scrollbar mask-linear-fade">
                  {QUOTE_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`
                        group relative flex items-center gap-1.5 flex-shrink-0 pl-2 pr-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200
                        ${selectedTemplate === t.id 
                          ? 'bg-bk-green text-white shadow-md transform scale-105' 
                          : 'bg-gray-50 dark:bg-bk-input-dark text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-bk-border-dark'
                        }
                      `}
                    >
                      <div onClick={(e) => handleSetDefaultTemplate(e, t.id)} className="p-1 cursor-pointer">
                         <Star className={`w-3 h-3 ${defaultTemplate === t.id ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </div>
                      {t.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* Canvas Area (Preview) */}
            <div 
              className="w-full flex justify-center items-center py-8 bg-gray-100/50 dark:bg-bk-bg-dark rounded-3xl shadow-inner border border-gray-200/60 dark:border-bk-border-dark transition-all duration-300 ease-out relative group/canvas overflow-hidden min-h-[400px]" 
              ref={containerRef}
            >
                {/* Scaled Wrapper */}
                <div style={{ 
                    width: scale ? 600 * scale : '100%',
                    height: scale ? 750 * scale : 'auto',
                    position: 'relative',
                    transition: 'width 0.2s, height 0.2s'
                }}>
                    <div style={{ 
                        width: '600px',
                        height: '750px',
                        transform: `scale(${scale})`, 
                        transformOrigin: 'top left', 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        willChange: 'transform'
                    }}>
                        <QuoteCanvas
                            ref={cardRef}
                            headline={generatedData.headline}
                            body={generatedData.body}
                            images={images}
                            customLogo={customLogo}
                            template={selectedTemplate}
                            selectedFont={selectedFont}
                            isImageTransparent={isImageTransparent}
                        />

                        <button
                          onClick={handleCapture}
                          disabled={isCapturing}
                          style={{ transform: `scale(${1/scale})`, transformOrigin: 'top right' }} 
                          className="absolute -top-4 -right-4 z-50 p-3 bg-gray-900 dark:bg-bk-surface-dark text-white rounded-full shadow-2xl border-2 border-white dark:border-bk-border-dark hover:bg-bk-green dark:hover:bg-bk-green transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                          title="ডিজাইনের স্ক্রিনশট নিন"
                        >
                          {isCapturing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />}
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default QuoteGenerator;
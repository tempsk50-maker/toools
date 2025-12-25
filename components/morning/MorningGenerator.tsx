

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Loader2, Upload, Trash2, Image as ImageIcon, Calendar, Clock, BookOpen, Sun, Star, RefreshCcw, Quote, Wand2 } from 'lucide-react';
import MorningCanvas from './MorningCanvas';
import { NewsCardTemplate } from '../../types';

declare const html2canvas: any;

interface MorningGeneratorProps {
  customLogo: string | null;
  onApiKeyInvalid: () => void;
}

type DailyCardType = 'morning' | 'prayer' | 'hadith';

// Template Lists
const MORNING_TEMPLATES: { id: NewsCardTemplate; label: string }[] = [
    { id: 'bk-morning-classic', label: 'ম্যাগাজিন' },
    { id: 'bk-morning-modern', label: 'গ্লাস ফ্রস্ট' },
    { id: 'bk-morning-corporate', label: 'মিনিমাল' },
    { id: 'bk-morning-minimal', label: 'বোল্ড' },
    { id: 'bk-morning-gradient', label: 'কর্পোরেট' },
];

const PRAYER_TEMPLATES: { id: NewsCardTemplate; label: string }[] = [
    { id: 'bk-prayer-classic', label: 'ক্লাসিক' },
    { id: 'bk-prayer-modern', label: 'মডার্ন ডার্ক' },
    { id: 'bk-prayer-clean', label: 'ক্লিন লিস্ট' },
    { id: 'bk-prayer-image', label: 'ইমেজ ওভারলে' },
    { id: 'bk-prayer-elegant', label: 'এলিগেন্ট' },
];

const HADITH_TEMPLATES: { id: NewsCardTemplate; label: string }[] = [
    { id: 'bk-hadith-classic', label: 'ক্লাসিক' },
    { id: 'bk-hadith-modern', label: 'মডার্ন' },
    { id: 'bk-hadith-box', label: 'বক্স স্টাইল' },
    { id: 'bk-hadith-image', label: 'ইমেজ ওভারলে' },
    { id: 'bk-hadith-golden', label: 'গোল্ডেন ডার্ক' },
    { id: 'bk-hadith-midnight', label: 'মিডনাইট ব্লু' },
    { id: 'bk-hadith-split', label: 'মডার্ন স্প্লিট' },
    { id: 'bk-hadith-floral', label: 'ফ্লোরাল মিনিমাল' },
];

// Predefined Captions
const DEFAULT_CAPTIONS = [
    "প্রতিটি নতুন সকাল আল্লাহর পক্ষ থেকে একটি নতুন সুযোগ। আলহামদুলিল্লাহ।",
    "ধৈর্য ধরুন, আল্লাহ উত্তম পরিকল্পনাকারী। দিনটি শুভ হোক।",
    "দিনটি শুরু হোক বিসমিল্লাহ বলে। আল্লাহ আমাদের সবাইকে হেফাজতে রাখুন।",
    "সততা ও নিষ্ঠার সাথে দিনটি অতিবাহিত করুন। সফলতা আসবেই, ইনশাআল্লাহ।",
    "আলহামদুলিল্লাহ, আরেকটি নতুন দিনের জন্য। আজকের দিনটি আপনার জন্য কল্যাণকর হোক।",
    "মানুষের সাথে হাসিমুখে কথা বলাও একটি সদকা। শুভ সকাল।",
    "বিপদ যত বড়ই হোক, আল্লাহর রহমত তার চেয়েও বড়। ভরসা রাখুন।",
    "আজকের দিনটি এমনভাবে কাটান যেন এটিই আপনার জীবনের শ্রেষ্ঠ দিন।",
    "ক্ষমা ও ভালোবাসার মাধ্যমে দিনটি শুরু করুন। মনে প্রশান্তি আসবে।",
    "রিজিকের মালিক আল্লাহ, তাই দুশ্চিন্তা না করে চেষ্টা চালিয়ে যান।"
];

// Safe Image Keywords for Hadith
const HADITH_IMAGE_PROMPTS = [
    "beautiful mosque interior cinematic lighting 4k",
    "serene nature landscape mountains sunset 4k",
    "islamic geometric pattern gold and black 4k",
    "open holy quran book on wooden stand soft lighting 4k",
    "macro flower photography soft bokeh 4k",
    "soft clouds blue sky cinematic 4k",
    "abstract islamic art background 4k",
    "minimalist desert landscape sunset 4k"
];

const MorningGenerator: React.FC<MorningGeneratorProps> = ({ 
  customLogo, 
  onApiKeyInvalid
}) => {
  // General State
  const [activeTab, setActiveTab] = useState<DailyCardType>('morning');
  const [selectedTemplate, setSelectedTemplate] = useState<NewsCardTemplate>('bk-morning-classic');
  const [images, setImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Common Date States
  const [dayName, setDayName] = useState('শনিবার');
  const [dateOne, setDateOne] = useState('২৯ নভেম্বর ২০২৫');
  const [dateTwo, setDateTwo] = useState('১৪ অগ্রহায়ণ ১৪৩২');
  const [dateThree, setDateThree] = useState('৭ জমাদিউস সানি ১৪৪৭');

  // Morning Card State
  const [caption, setCaption] = useState('');
  const [imageSource, setImageSource] = useState(''); 

  // Prayer Card State
  const [prayerLocation, setPrayerLocation] = useState('ঢাকা ও পার্শ্ববর্তী এলাকা');
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: '৫:১০',
    sunrise: '৬:২৫',
    dhuhr: '১২:০৫',
    asr: '৩:৪৫',
    maghrib: '৫:৩৫',
    isha: '৬:৫০',
  });

  // Hadith/Ayah Card State
  const [hadithType, setHadithType] = useState<'Ayah' | 'Hadith'>('Hadith');
  const [hadithArabic, setHadithArabic] = useState('');
  const [hadithBengali, setHadithBengali] = useState('তোমাদের মধ্যে সর্বোত্তম ঐ ব্যক্তি যে কুরআন শিখে এবং অপরকে শিক্ষা দেয়।');
  const [hadithSource, setHadithSource] = useState('সহীহ বুখারী: ৫০২৭');

  // Auto-fill dates and random caption on mount
  useEffect(() => {
    const today = new Date();
    const banglaDate = new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);
    const banglaDay = new Intl.DateTimeFormat('bn-BD', { weekday: 'long' }).format(today);
    
    setDayName(banglaDay);
    setDateOne(banglaDate);
    
    if (!caption) {
        setCaption(DEFAULT_CAPTIONS[Math.floor(Math.random() * DEFAULT_CAPTIONS.length)]);
    }
  }, []);

  const handleRandomCaption = () => {
      const random = DEFAULT_CAPTIONS[Math.floor(Math.random() * DEFAULT_CAPTIONS.length)];
      setCaption(random);
  };

  const handleGenerateHadithImage = useCallback(() => {
      setIsGeneratingImage(true);
      const randomPrompt = HADITH_IMAGE_PROMPTS[Math.floor(Math.random() * HADITH_IMAGE_PROMPTS.length)];
      // Using pollinations.ai for instant safe stock-like images without API key
      const seed = Math.floor(Math.random() * 10000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(randomPrompt)}?width=1080&height=1080&nologo=true&seed=${seed}`;
      
      // Preload image
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
          setImages([imageUrl]);
          setIsGeneratingImage(false);
      };
      img.onerror = () => {
          setIsGeneratingImage(false);
          // Fallback or retry logic could go here
      };
  }, []);

  // Update selected template when tab changes
  useEffect(() => {
    if (activeTab === 'morning') setSelectedTemplate(MORNING_TEMPLATES[0].id);
    if (activeTab === 'prayer') setSelectedTemplate(PRAYER_TEMPLATES[0].id);
    if (activeTab === 'hadith') {
        setSelectedTemplate(HADITH_TEMPLATES[0].id);
        // Auto generate image if none exists
        if (images.length === 0) {
            handleGenerateHadithImage();
        }
    }
  }, [activeTab, handleGenerateHadithImage]); // Added images.length check inside

  const currentTemplateList = 
    activeTab === 'morning' ? MORNING_TEMPLATES :
    activeTab === 'prayer' ? PRAYER_TEMPLATES :
    HADITH_TEMPLATES;

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

  const handleCapture = async () => {
    const originalNode = cardRef.current;
    if (!originalNode) return;

    setIsCapturing(true);

    const width = 600;
    const height = 600;

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
            a.download = `bk-${activeTab}-${Date.now()}.png`;
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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 animate-in fade-in duration-300 relative">
      
      {showFlash && (
          <div className="fixed inset-0 z-[100] bg-white animate-out fade-out duration-300 pointer-events-none"></div>
      )}

      {/* Controls */}
      <div className="lg:col-span-5 space-y-2 lg:space-y-4 order-1">
        
        {/* Header & Tabs */}
        <div className="space-y-3">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-bk-surface-dark dark:to-bk-surface-dark p-2 rounded-2xl border border-orange-100 dark:border-bk-border-dark">
                 <div className="flex p-1 bg-white/50 dark:bg-bk-input-dark/50 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('morning')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'morning' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Sun className="w-4 h-4" /> প্রভাত
                    </button>
                    <button 
                        onClick={() => setActiveTab('prayer')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'prayer' ? 'bg-white shadow text-bk-green' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Clock className="w-4 h-4" /> নামাজ
                    </button>
                    <button 
                        onClick={() => setActiveTab('hadith')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'hadith' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <BookOpen className="w-4 h-4" /> বাণী
                    </button>
                 </div>
            </div>
        </div>

        {/* Dynamic Inputs Based on Tab */}
        <div className="bg-bk-surface-light dark:bg-bk-surface-dark p-3 lg:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-bk-border-dark transition-all space-y-4">
             
             {/* Common Date Inputs */}
             <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-bk-border-dark">
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> তারিখ ও বার
                 </label>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-2.5 rounded-xl text-sm font-bold"
                        value={dayName}
                        onChange={(e) => setDayName(e.target.value)}
                        placeholder="বার (যেমন: শনিবার)"
                    />
                     <input 
                        type="text" 
                        className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-2.5 rounded-xl text-sm"
                        value={dateOne}
                        onChange={(e) => setDateOne(e.target.value)}
                        placeholder="ইংরেজি তারিখ"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-2.5 rounded-xl text-sm"
                        value={dateTwo}
                        onChange={(e) => setDateTwo(e.target.value)}
                        placeholder="বাংলা তারিখ"
                    />
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-2.5 rounded-xl text-sm"
                        value={dateThree}
                        onChange={(e) => setDateThree(e.target.value)}
                        placeholder="হিজরি তারিখ"
                    />
                 </div>
             </div>

             {/* MORNING SPECIFIC */}
             {activeTab === 'morning' && (
                 <div className="space-y-3">
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">ক্যাপশন</label>
                            <button onClick={handleRandomCaption} className="text-[10px] bg-gray-100 hover:bg-bk-green hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1" title="নতুন ক্যাপশন জেনারেট করুন">
                                <RefreshCcw className="w-3 h-3" /> নতুন ক্যাপশন
                            </button>
                        </div>
                        <textarea
                           className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-3 rounded-xl h-24 focus:bg-white dark:focus:bg-bk-input-dark focus:ring-2 focus:ring-bk-green/20 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm" 
                           value={caption} 
                           onChange={(e) => setCaption(e.target.value)}
                           placeholder="ক্যাপশন লিখুন..."
                        />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">ছবির ক্রেডিট (অপশনাল)</label>
                         <input 
                            type="text" 
                            className="w-full border border-gray-200 dark:border-bk-border-dark bg-bk-input-light dark:bg-bk-input-dark/50 p-2.5 rounded-xl text-sm"
                            value={imageSource}
                            onChange={(e) => setImageSource(e.target.value)}
                            placeholder="যেমন: আনিস মাহমুদ / সংগৃহীত"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">ফাঁকা রাখলে অটোমেটিক 'ছবি: সংগৃহীত' লেখা হবে।</p>
                     </div>
                 </div>
             )}

             {/* PRAYER SPECIFIC */}
             {activeTab === 'prayer' && (
                 <div className="space-y-3">
                    <div className="mb-2">
                        <label className="text-xs font-bold text-gray-500 block mb-1">এলাকা</label>
                        <input 
                            type="text"
                            value={prayerLocation}
                            onChange={(e) => setPrayerLocation(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light"
                            placeholder="এলাকার নাম"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">ফজর</label>
                            <input type="text" value={prayerTimes.fajr} onChange={(e) => setPrayerTimes({...prayerTimes, fajr: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">সূর্যোদয়</label>
                            <input type="text" value={prayerTimes.sunrise} onChange={(e) => setPrayerTimes({...prayerTimes, sunrise: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">জোহর</label>
                            <input type="text" value={prayerTimes.dhuhr} onChange={(e) => setPrayerTimes({...prayerTimes, dhuhr: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">আছর</label>
                            <input type="text" value={prayerTimes.asr} onChange={(e) => setPrayerTimes({...prayerTimes, asr: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">মাগরিব</label>
                            <input type="text" value={prayerTimes.maghrib} onChange={(e) => setPrayerTimes({...prayerTimes, maghrib: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">এশা</label>
                            <input type="text" value={prayerTimes.isha} onChange={(e) => setPrayerTimes({...prayerTimes, isha: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light" />
                        </div>
                    </div>
                 </div>
             )}

             {/* HADITH SPECIFIC */}
             {activeTab === 'hadith' && (
                 <div className="space-y-3">
                    <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={hadithType === 'Hadith'} onChange={() => setHadithType('Hadith')} name="hType" className="text-bk-green" />
                            <span className="text-sm font-bold">হাদীস</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={hadithType === 'Ayah'} onChange={() => setHadithType('Ayah')} name="hType" className="text-bk-green" />
                            <span className="text-sm font-bold">আয়াত</span>
                        </label>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">আরবি টেক্সট (ঐচ্ছিক)</label>
                        <textarea 
                            value={hadithArabic}
                            onChange={(e) => setHadithArabic(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light h-16"
                            placeholder="আরবি টেক্সট এখানে..."
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">বাংলা অনুবাদ</label>
                        <textarea 
                            value={hadithBengali}
                            onChange={(e) => setHadithBengali(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light h-24"
                            placeholder="বাংলা অনুবাদ এখানে..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">রেফারেন্স / উৎস</label>
                        <input 
                            type="text"
                            value={hadithSource}
                            onChange={(e) => setHadithSource(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-bk-input-light"
                            placeholder="যেমন: সহীহ বুখারী, আয়াত নম্বর..."
                        />
                    </div>
                 </div>
             )}
        </div>

        {/* Universal Image Upload & Auto Generate */}
        <div className="bg-bk-surface-light dark:bg-bk-surface-dark p-3 lg:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-bk-border-dark transition-all">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                    <ImageIcon className="w-3.5 h-3.5 mr-2 text-bk-green" />
                    {activeTab === 'morning' ? 'প্রকৃতির ছবি' : activeTab === 'prayer' ? 'মসজিদ/ব্যাকগ্রাউন্ড ছবি' : 'ব্যাকগ্রাউন্ড ছবি'}
                </h2>
                {activeTab === 'hadith' && (
                    <button 
                        onClick={handleGenerateHadithImage}
                        disabled={isGeneratingImage}
                        className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100 flex items-center gap-1 hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                        {isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3"/>}
                        অটোমেটিক ছবি
                    </button>
                )}
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
        </div>
      </div>

      {/* Preview */}
      <div className="lg:col-span-7 flex flex-col items-center order-2 mt-0 lg:mt-0">
         <div className="sticky top-24 space-y-2 lg:space-y-4 w-full flex flex-col items-center">
            
            {/* Template Selector List */}
            <div className="w-full bg-bk-surface-light dark:bg-bk-surface-dark p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-bk-border-dark transition-all">
               <div className="flex justify-start gap-2 overflow-x-auto pb-1 pt-1 px-1 no-scrollbar mask-linear-fade">
                  {currentTemplateList.map((t) => (
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
                      <div className="p-1 cursor-pointer">
                         <Star className={`w-3 h-3 ${selectedTemplate === t.id ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
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
                    height: scale ? 600 * scale : 'auto',
                    position: 'relative',
                    transition: 'width 0.2s, height 0.2s'
                }}>
                    <div style={{ 
                        width: '600px',
                        height: '600px',
                        transform: `scale(${scale})`, 
                        transformOrigin: 'top left', 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        willChange: 'transform'
                    }}>
                        <MorningCanvas
                            ref={cardRef}
                            caption={caption}
                            dayName={dayName}
                            dateOne={dateOne}
                            dateTwo={dateTwo}
                            dateThree={dateThree}
                            images={images}
                            customLogo={customLogo}
                            template={selectedTemplate}
                            imageSource={imageSource}
                            // Prayer Props
                            prayerLocation={prayerLocation}
                            prayerTimes={prayerTimes}
                            // Hadith Props
                            hadithType={hadithType}
                            hadithArabic={hadithArabic}
                            hadithBengali={hadithBengali}
                            hadithSource={hadithSource}
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

export default MorningGenerator;
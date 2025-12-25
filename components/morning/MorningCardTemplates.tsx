import React, { forwardRef } from 'react';
import { NewsCardTemplate } from '../../types';
import { Sun, Calendar, Camera } from 'lucide-react';

interface MorningCardProps {
  caption: string;
  dayName: string;
  dateOne: string;
  dateTwo: string;
  dateThree: string;
  images: string[];
  customLogo: string | null;
  template: NewsCardTemplate;
  imageSource?: string;
}

// --- Brand Colors ---
const BK_RED = '#da291c';
const BK_GREEN = '#008542';

// --- Brand Header (Isolated Copy) ---
const BrandHeader = ({ 
  customLogo, 
  variant = 'light',
  className = '',
  scale = 1
}: { 
  customLogo: string | null;
  variant?: 'light' | 'dark' | 'colored' | 'mono-red' | 'mono-white' | 'red-white' | 'gold' | 'teal' | 'black' | 'white';
  className?: string;
  scale?: number;
}) => {
  const colors = {
    'light': { text: `text-[${BK_GREEN}]`, accent: `text-[${BK_RED}]`, border: `border-[${BK_GREEN}]` },
    'dark': { text: 'text-white', accent: `text-[${BK_RED}]`, border: 'border-white' },
    'colored': { text: `text-[${BK_GREEN}]`, accent: `text-[${BK_RED}]`, border: `border-[${BK_GREEN}]` },
    'mono-red': { text: `text-[${BK_RED}]`, accent: `text-[${BK_RED}]`, border: `border-[${BK_RED}]` },
    'mono-white': { text: 'text-white', accent: 'text-white', border: 'border-white' },
    'red-white': { text: 'text-white', accent: 'text-white', border: 'border-white' },
    'gold': { text: `text-[${BK_GREEN}]`, accent: 'text-white', border: `border-[${BK_GREEN}]` }, 
    'teal': { text: `text-[${BK_GREEN}]`, accent: `text-[${BK_RED}]`, border: `border-[${BK_GREEN}]` },
    'black': { text: 'text-black', accent: `text-[${BK_RED}]`, border: 'border-black' },
    'white': { text: 'text-white', accent: 'text-white', border: 'border-white' },
  };

  const c = colors[variant as keyof typeof colors] || colors.light;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ transform: `scale(${scale})` }}>
      <div className="h-10 w-10 flex-shrink-0">
        {customLogo ? (
            <img src={customLogo} className="w-full h-full object-contain drop-shadow-sm" alt="Logo" />
        ) : (
            <div className={`w-full h-full rounded-lg border-[2.5px] ${c.border} flex items-center justify-center bg-transparent relative overflow-hidden`}>
                <div className={`absolute -right-2 -top-2 w-6 h-6 bg-[${BK_RED}] rounded-full opacity-20`}></div>
                <span className={`font-oswald font-bold text-2xl tracking-tighter pb-1 pl-px ${c.text}`}>bk</span>
            </div>
        )}
      </div>
      
      <div className="flex flex-col justify-center h-full pt-1">
          <div className="flex items-center text-[20px] font-bold tracking-tight leading-none font-bengali">
             <span className={c.text}>বাঁশের</span>
             <span className={c.accent}>কেল্লা</span>
          </div>
          <div className={`text-[9px] font-bold uppercase tracking-[0.2em] ${c.text} opacity-80 leading-tight mt-0.5 font-oswald text-left`}>
                News Media
          </div>
      </div>
    </div>
  );
};

const MorningCardTemplates = forwardRef<HTMLDivElement, MorningCardProps>(({
    caption,
    dayName,
    dateOne,
    dateTwo,
    dateThree,
    images = [], 
    customLogo, 
    template,
    imageSource
}, ref) => {
    const image = images.length > 0 ? images[0] : null;

    const width = 600;
    const height = 600;

    const containerStyle: React.CSSProperties = {
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '"Hind Siliguri", sans-serif',
      flexShrink: 0
    };

    const displayCredit = imageSource ? imageSource : 'ছবি: সংগৃহীত';
    const displayCaption = caption || "প্রতিটি নতুন সকাল আল্লাহর পক্ষ থেকে একটি নতুন সুযোগ। আলহামদুলিল্লাহ।";
    const GREETING_TEXT = "সুবাহুল খায়ের";

    if (template === 'bk-morning-classic') {
        return (
            <div ref={ref} style={containerStyle} className="bg-black flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Morning" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gray-800"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                </div>

                <div className="absolute inset-0 z-10 flex flex-col p-8">
                    {/* Top: Brand */}
                    <div className="flex justify-between items-start">
                         <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                              <span className="text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                  <Sun size={12} className="text-yellow-400"/> Morning Vibes
                              </span>
                         </div>
                    </div>

                    {/* Middle-Bottom: Content */}
                    <div className="mt-auto mb-6">
                        <h1 className="text-[56px] font-bold text-white leading-tight mb-4 drop-shadow-2xl" style={{ fontFamily: '"Hind Siliguri", sans-serif' }}>
                            {GREETING_TEXT}
                        </h1>
                        <div className={`w-20 h-1.5 bg-[${BK_GREEN}] mb-6 rounded-full`}></div>
                        
                        <p className="text-[19px] text-gray-100 font-medium leading-relaxed drop-shadow-md mb-8 max-w-[90%]">
                            {displayCaption}
                        </p>

                        {/* Date Strip */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#fcd34d] font-bold text-lg">
                                <Calendar size={18} />
                                <span>{dayName}, {dateOne}</span>
                            </div>
                            <div className="w-full h-px bg-white/20"></div>
                            <div className="flex items-center justify-between text-white/90 text-sm font-medium">
                                <span>{dateThree}</span>
                                <span>•</span>
                                <span>{dateTwo}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center opacity-80">
                        <div className="text-[10px] text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                            <Camera size={12} /> {displayCredit}
                        </div>
                        <div className="transform scale-90 origin-bottom-right brightness-0 invert">
                            <BrandHeader customLogo={customLogo} variant="white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-morning-modern') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                {/* Image Top 60% */}
                <div className="h-[60%] w-full relative">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Morning" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Content Bottom */}
                <div className="flex-1 px-8 pb-8 relative z-10 -mt-10 flex flex-col items-center text-center">
                     <div className={`bg-[${BK_GREEN}] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg mb-6`}>
                         {dayName}, {dateOne}
                     </div>

                     <h1 className={`text-[42px] font-bold text-gray-800 leading-none mb-4`}>
                         {GREETING_TEXT}
                     </h1>

                     <p className="text-[17px] text-gray-600 leading-relaxed font-medium mb-6 px-4">
                         {displayCaption}
                     </p>

                     <div className="mt-auto w-full border-t border-gray-100 pt-4 flex flex-col gap-1 items-center">
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                              <span>{dateThree}</span>
                              <span className={`w-1.5 h-1.5 rounded-full bg-[${BK_RED}]`}></span>
                              <span>{dateTwo}</span>
                          </div>
                     </div>

                     <div className="absolute bottom-4 left-4 text-[9px] text-gray-300 font-bold uppercase">
                         {displayCredit}
                     </div>
                     <div className="absolute bottom-4 right-4 transform scale-75 origin-bottom-right">
                         <BrandHeader customLogo={customLogo} variant="colored" />
                     </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-morning-corporate') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#fffdf5] flex flex-col relative overflow-hidden border-[12px] border-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                
                <div className="flex-1 p-6 flex flex-col relative z-10">
                    <div className="w-full h-[300px] rounded-2xl overflow-hidden relative shadow-md mb-6">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Morning" crossOrigin="anonymous"/>
                        ) : (
                            <div className="w-full h-full bg-gray-200"></div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                            {displayCredit}
                        </div>
                    </div>

                    <div className="text-center px-4">
                        <h1 className={`text-[40px] font-bold text-[${BK_GREEN}] mb-3 drop-shadow-sm`}>
                             {GREETING_TEXT}
                        </h1>
                        <p className="text-[18px] text-gray-700 font-medium leading-relaxed">
                             {displayCaption}
                        </p>
                    </div>

                    <div className="mt-auto bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm flex justify-between items-center">
                        <div className="flex flex-col text-left">
                            <div className="text-base font-bold text-gray-800">{dayName}, {dateOne}</div>
                            <div className="text-xs font-bold text-gray-500 mt-0.5">{dateThree} | {dateTwo}</div>
                        </div>
                        <div className="transform scale-75 origin-right">
                             <BrandHeader customLogo={customLogo} variant="colored" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-morning-minimal') {
        return (
            <div ref={ref} style={containerStyle} className="bg-black flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover opacity-70" alt="Morning" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gray-800"></div>
                    )}
                </div>

                <div className="absolute top-0 bottom-0 left-0 w-[40%] bg-white/95 backdrop-blur-sm z-10 p-8 flex flex-col justify-center shadow-2xl">
                     <div className={`w-12 h-12 bg-[${BK_GREEN}] rounded-full flex items-center justify-center text-white mb-6`}>
                         <Sun size={24} />
                     </div>

                     <h1 className="text-[44px] font-bold text-gray-900 leading-tight mb-6">
                         {GREETING_TEXT}
                     </h1>

                     <p className="text-[16px] text-gray-600 font-medium leading-relaxed mb-8">
                         {displayCaption}
                     </p>

                     <div className="mt-auto space-y-4 border-t border-gray-200 pt-6">
                         <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date</span>
                             <span className="text-lg font-bold text-gray-900">{dayName}, {dateOne}</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Hijri & Bangla</span>
                             <span className="text-sm font-bold text-gray-600">{dateThree}</span>
                             <span className="text-sm font-bold text-gray-600">{dateTwo}</span>
                         </div>
                     </div>
                     
                     <div className="mt-8 transform scale-75 origin-left">
                          <BrandHeader customLogo={customLogo} variant="colored" />
                     </div>
                </div>

                <div className="absolute bottom-6 right-6 z-10 text-[10px] text-white/50 font-bold uppercase tracking-widest">
                    {displayCredit}
                </div>
            </div>
        );
    }

    if (template === 'bk-morning-gradient') {
        return (
            <div ref={ref} style={containerStyle} className="bg-gray-900 flex flex-col relative overflow-hidden">
                {/* Image BG */}
                <div className="absolute inset-0 z-0">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Morning" crossOrigin="anonymous"/>
                    ) : (
                         <div className="w-full h-full bg-gray-800"></div>
                    )}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-[#1a1a1a]/90 backdrop-blur-md rounded-2xl p-8 border-t-4 border-[${BK_GREEN}] shadow-2xl">
                     <div className="flex justify-between items-start mb-4">
                         <h1 className="text-[36px] font-bold text-white">
                             {GREETING_TEXT}
                         </h1>
                         <div className={`bg-[${BK_RED}] w-8 h-8 rounded-full flex items-center justify-center`}>
                             <Sun size={16} className="text-white" />
                         </div>
                     </div>

                     <p className="text-[18px] text-gray-300 leading-relaxed font-medium mb-6">
                         {displayCaption}
                     </p>

                     <div className="w-full h-px bg-white/10 mb-4"></div>

                     <div className="flex justify-between items-center">
                         <div className="flex flex-col gap-0.5">
                             <div className="text-sm font-bold text-white">{dayName} | {dateOne}</div>
                             <div className="text-xs font-bold text-[${BK_GREEN}]">{dateThree} | {dateTwo}</div>
                         </div>
                         <div className="transform scale-75 origin-right brightness-0 invert opacity-80">
                             <BrandHeader customLogo={customLogo} variant="white" />
                         </div>
                     </div>
                </div>

                <div className="absolute top-8 right-8 text-[10px] text-white/70 font-bold bg-black/20 px-2 py-1 rounded">
                    {displayCredit}
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} style={containerStyle} className="bg-gray-100 flex items-center justify-center">
            Morning Template Not Found
        </div>
    );
});

export default MorningCardTemplates;
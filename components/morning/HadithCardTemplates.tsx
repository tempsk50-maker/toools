

import React, { forwardRef } from 'react';
import { NewsCardTemplate } from '../../types';
import { Quote, BookOpen, Star, Leaf, Moon } from 'lucide-react';

interface HadithCardProps {
  dayName: string;
  dateOne: string;
  dateTwo: string;
  dateThree: string;
  images: string[];
  customLogo: string | null;
  template: NewsCardTemplate;
  hadithType?: 'Ayah' | 'Hadith';
  hadithArabic?: string;
  hadithBengali?: string;
  hadithSource?: string;
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

const HadithCardTemplates = forwardRef<HTMLDivElement, HadithCardProps>(({
    dayName,
    dateOne,
    dateTwo,
    dateThree,
    images = [], 
    customLogo, 
    template,
    hadithType,
    hadithArabic,
    hadithBengali,
    hadithSource
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

    if (template === 'bk-hadith-classic') {
        return (
             <div ref={ref} style={containerStyle} className="bg-[#fdfbf7] flex flex-col relative overflow-hidden">
                 {/* Parchment Texture */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60"></div>
                 
                 {/* Ornate Border */}
                 <div className="absolute inset-3 border-2 border-[#bfa05f] opacity-40 pointer-events-none z-10"></div>
                 <div className="absolute inset-4 border border-[#bfa05f] opacity-30 pointer-events-none z-10"></div>
                 
                 {/* Corner Ornaments */}
                 <div className="absolute top-5 left-5 w-16 h-16 border-t-4 border-l-4 border-[#1a4d2e] opacity-80 z-20"></div>
                 <div className="absolute bottom-5 right-5 w-16 h-16 border-b-4 border-r-4 border-[#1a4d2e] opacity-80 z-20"></div>

                 <div className="flex-1 flex flex-col items-center justify-center p-12 relative z-10 text-center">
                      {/* Badge */}
                      <div className="mb-8">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#1a4d2e] rounded-full bg-[#1a4d2e]/5">
                               <Star size={10} className="text-[#1a4d2e] fill-[#1a4d2e]" />
                               <span className="text-[#1a4d2e] font-bold uppercase tracking-widest text-xs">
                                  {hadithType === 'Ayah' ? 'পবিত্র কুরআন' : 'পবিত্র হাদীস'}
                               </span>
                               <Star size={10} className="text-[#1a4d2e] fill-[#1a4d2e]" />
                          </div>
                      </div>

                      {/* Image (Optional but looks good if present) */}
                      {image && (
                          <div className="w-32 h-32 mb-6 rounded-full border-4 border-[#bfa05f]/30 overflow-hidden shadow-sm relative mx-auto">
                              <img src={image} className="w-full h-full object-cover" alt="Hadith" crossOrigin="anonymous"/>
                          </div>
                      )}

                      {hadithArabic && (
                          <div className="mb-6 w-full">
                              <p className="text-3xl font-bold text-[#2d3748] leading-loose drop-shadow-sm" style={{fontFamily: "'Amiri', serif"}}>
                                  {hadithArabic}
                              </p>
                          </div>
                      )}

                      <div className="mb-6">
                           <h1 className="text-[26px] font-bold text-[#1a202c] leading-snug font-bengali">
                               "{hadithBengali}"
                           </h1>
                      </div>

                      <div className="mt-4">
                          <div className="inline-block border-b-2 border-[#bfa05f] pb-1">
                              <p className="text-sm font-bold text-[#1a4d2e] italic">
                                  — {hadithSource}
                              </p>
                          </div>
                      </div>
                 </div>

                 {/* Footer */}
                 <div className="p-6 border-t border-[#e2e8f0] bg-white/60 relative z-10 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4a5568]">
                           <span>{dayName}</span>
                           <span className="w-1 h-1 bg-[#bfa05f] rounded-full"></span>
                           <span>{dateOne}</span>
                           <span className="w-1 h-1 bg-[#bfa05f] rounded-full"></span>
                           <span>{dateThree}</span>
                           <span className="w-1 h-1 bg-[#bfa05f] rounded-full"></span>
                           <span>{dateTwo}</span>
                      </div>
                      <div className="transform scale-75 origin-right">
                           <BrandHeader customLogo={customLogo} variant="colored" />
                      </div>
                 </div>
             </div>
        );
    }

    if (template === 'bk-hadith-modern') {
        return (
             <div ref={ref} style={containerStyle} className="bg-[#004d40] flex flex-col relative overflow-hidden text-white">
                 {/* Geometric Pattern Overlay */}
                 <div className="absolute inset-0 z-0 opacity-10" style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                 }}></div>
                 
                 {/* Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-br from-[#004d40] via-[#00695c] to-[#004d40] opacity-90 z-0"></div>

                 <div className="flex-1 flex flex-col p-10 relative z-10">
                      {/* Top Bar */}
                      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
                           <div className="flex items-center gap-2">
                               <BookOpen size={18} className="text-[#4db6ac]" />
                               <span className="text-[#4db6ac] font-bold text-xs uppercase tracking-widest">
                                   {hadithType === 'Ayah' ? 'Daily Verse' : 'Daily Hadith'}
                               </span>
                           </div>
                           <div className="text-white/60 text-xs font-bold">{dateOne}</div>
                      </div>

                      {/* Content */}
                      <div className="my-auto">
                          {hadithArabic && (
                              <p className="text-3xl text-[#e0f2f1] mb-8 font-bold leading-loose text-right" style={{fontFamily: "'Amiri', serif"}}>
                                  {hadithArabic}
                              </p>
                          )}
                          
                          <div className="border-l-4 border-[#26a69a] pl-6 py-2">
                              <h1 className="text-[28px] font-bold text-white leading-snug drop-shadow-md">
                                  {hadithBengali}
                              </h1>
                          </div>
                          
                          <div className="mt-8 flex items-center gap-3">
                              <div className="h-px flex-1 bg-white/20"></div>
                              <p className="text-sm text-[#80cbc4] font-bold uppercase tracking-wide">
                                  {hadithSource}
                              </p>
                          </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-6">
                           <div className="flex justify-between items-center text-[10px] text-[#b2dfdb] font-bold uppercase tracking-widest bg-black/20 p-3 rounded-lg">
                               <div className="flex gap-3">
                                   <span>{dayName}</span>
                                   <span>|</span>
                                   <span>{dateThree}</span>
                                   <span>|</span>
                                   <span>{dateTwo}</span>
                               </div>
                               <div className="transform scale-75 origin-right brightness-0 invert opacity-90">
                                   <BrandHeader customLogo={customLogo} variant="white" />
                               </div>
                           </div>
                      </div>
                 </div>
             </div>
        );
    }

    if (template === 'bk-hadith-box') {
        return (
            <div ref={ref} style={containerStyle} className="bg-gray-900 flex flex-col justify-center items-center relative overflow-hidden p-8">
                 {/* Background Image with Blur */}
                 <div className="absolute inset-0 z-0">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover filter blur-sm scale-110" alt="Background" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                    )}
                    <div className="absolute inset-0 bg-black/30"></div>
                 </div>
                 
                 {/* The Floating Card */}
                 <div className="bg-white p-10 shadow-2xl rounded-2xl relative w-full flex flex-col items-center text-center z-10 max-w-lg border border-white/20">
                      <div className={`w-12 h-12 bg-[${BK_GREEN}] rounded-full flex items-center justify-center text-white absolute -top-6 shadow-lg border-4 border-white`}>
                           <Quote size={20} className="fill-white" />
                      </div>

                      <div className="mt-8 mb-6">
                           <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{hadithType === 'Ayah' ? 'Al-Quran' : 'Al-Hadith'}</span>
                      </div>

                      {hadithArabic && (
                          <p className="text-2xl text-gray-800 mb-6 leading-relaxed font-bold" style={{fontFamily: "'Amiri', serif"}}>{hadithArabic}</p>
                      )}

                      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-8">
                          {hadithBengali}
                      </h1>

                      <div className="bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                              {hadithSource}
                          </p>
                      </div>
                 </div>

                 {/* Bottom Info */}
                 <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-2 text-white/90 text-xs font-bold shadow-black drop-shadow-md">
                           <span>{dayName}</span>
                           <span>•</span>
                           <span>{dateOne}</span>
                           <span>•</span>
                           <span>{dateThree}</span>
                           <span>•</span>
                           <span>{dateTwo}</span>
                      </div>
                      <div className="transform scale-75 origin-bottom-right brightness-0 invert">
                           <BrandHeader customLogo={customLogo} variant="white" />
                      </div>
                 </div>
            </div>
        );
    }

    if (template === 'bk-hadith-image') {
        return (
            <div ref={ref} style={containerStyle} className="bg-black flex flex-col relative overflow-hidden">
                 {/* Full Image */}
                 <div className="absolute inset-0 z-0">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Hadith" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">Add Background Image</div>
                    )}
                    {/* Gradient Overlay from Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                 </div>

                 <div className="relative z-10 w-full h-full p-10 flex flex-col justify-end">
                      <div className="mb-auto pt-4 flex justify-between">
                           <div className={`px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20`}>
                               {hadithType === 'Ayah' ? 'আয়াত' : 'হাদীস'}
                           </div>
                           <div className="transform scale-75 origin-top-right brightness-0 invert opacity-90">
                               <BrandHeader customLogo={customLogo} variant="white" />
                           </div>
                      </div>

                      <div className="mb-8">
                           {hadithArabic && (
                               <p className="text-3xl text-white/90 mb-4 font-bold drop-shadow-lg text-right" style={{fontFamily: "'Amiri', serif"}}>{hadithArabic}</p>
                           )}
                           
                           <div className="flex gap-4">
                               <div className={`w-1 bg-[${BK_GREEN}] rounded-full`}></div>
                               <h1 className="text-[32px] font-bold text-white leading-tight drop-shadow-xl">
                                   "{hadithBengali}"
                               </h1>
                           </div>
                           
                           <div className="mt-6 flex items-center gap-2 pl-5">
                                <div className={`w-8 h-px bg-[${BK_GREEN}]`}></div>
                                <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                                    {hadithSource}
                                </p>
                           </div>
                      </div>

                      <div className="border-t border-white/20 pt-4 flex gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                           <span>{dayName}</span>
                           <span>|</span>
                           <span>{dateOne}</span>
                           <span>|</span>
                           <span>{dateThree}</span>
                           <span>|</span>
                           <span>{dateTwo}</span>
                      </div>
                 </div>
            </div>
        );
    }

    if (template === 'bk-hadith-golden') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#0c0a09] flex flex-col relative overflow-hidden p-4">
                 {/* Texture */}
                 <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>

                 <div className="w-full h-full border border-[#b45309]/40 rounded-sm flex flex-col relative z-10 bg-[#1c1917]/80">
                      {/* Ornamental Corners */}
                      <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-[#f59e0b]"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-[#f59e0b]"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-[#f59e0b]"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-[#f59e0b]"></div>

                      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                           <div className="mb-8">
                               <span className="text-[#f59e0b] text-[10px] font-bold uppercase tracking-[0.4em] border-b border-[#f59e0b]/50 pb-1">
                                   {hadithType === 'Ayah' ? 'Holy Quran' : 'Holy Hadith'}
                               </span>
                           </div>
                           
                           {hadithArabic && (
                               <p className="text-3xl text-[#fbbf24] mb-8 font-bold drop-shadow-sm leading-loose" style={{fontFamily: "'Amiri', serif"}}>{hadithArabic}</p>
                           )}
                           
                           <h1 className="text-[26px] font-serif text-gray-200 leading-relaxed mb-8">
                               {hadithBengali}
                           </h1>
                           
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-px bg-[#b45309]"></div>
                               <p className="text-xs text-[#d97706] font-bold uppercase tracking-widest">{hadithSource}</p>
                               <div className="w-8 h-px bg-[#b45309]"></div>
                           </div>
                      </div>

                      {/* Footer Info */}
                      <div className="p-4 flex justify-between items-center bg-black/40 border-t border-[#b45309]/20">
                           <div className="flex flex-col gap-0.5">
                               <span className="text-[10px] font-bold text-[#b45309]">{dayName} | {dateOne}</span>
                               <span className="text-[9px] font-bold text-[#78350f]">{dateThree} | {dateTwo}</span>
                           </div>
                           <div className="transform scale-75 origin-right brightness-0 invert opacity-70">
                                <BrandHeader customLogo={customLogo} variant="white" />
                           </div>
                      </div>
                 </div>
            </div>
        );
    }

    if (template === 'bk-hadith-midnight') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#1e1b4b] flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#172554] to-[#1e1b4b]"></div>
                
                {/* Moon/Night graphic */}
                <div className="absolute top-8 right-8 text-yellow-100 opacity-20">
                    <Moon size={120} />
                </div>
                
                {/* Decorative border */}
                <div className="absolute inset-4 border border-white/10 rounded-xl"></div>
                <div className="absolute inset-5 border border-white/5 rounded-lg"></div>

                <div className="flex-1 z-10 p-12 flex flex-col justify-center text-center">
                    {hadithArabic && (
                        <p className="text-4xl text-[#fef3c7] mb-8 font-bold leading-relaxed" style={{fontFamily: "'Amiri', serif"}}>
                            {hadithArabic}
                        </p>
                    )}
                    
                    <h1 className="text-2xl font-bold text-white leading-relaxed mb-6">
                        "{hadithBengali}"
                    </h1>

                    <div className="w-16 h-1 bg-[#4338ca] mx-auto rounded-full mb-4"></div>

                    <p className="text-sm text-[#a5b4fc] font-bold uppercase tracking-wider">
                        {hadithSource}
                    </p>
                </div>

                <div className="p-6 z-10 flex justify-between items-center border-t border-white/5 bg-[#172554]/30">
                     <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex gap-3">
                        <span>{dayName}</span>
                        <span className="text-[#4338ca]">●</span>
                        <span>{dateThree}</span>
                        <span className="text-[#4338ca]">●</span>
                        <span>{dateTwo}</span>
                     </div>
                     <div className="transform scale-75 origin-right brightness-0 invert opacity-80">
                        <BrandHeader customLogo={customLogo} variant="white" />
                     </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-hadith-split') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                {/* Top Image Half */}
                <div className="h-[45%] w-full relative">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Background" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                    
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider text-gray-800">
                        {hadithType === 'Ayah' ? 'Daily Verse' : 'Daily Hadith'}
                    </div>
                </div>

                {/* Bottom Text Half */}
                <div className="flex-1 p-8 flex flex-col relative -mt-6">
                     <div className="mb-auto">
                        {hadithArabic && (
                            <p className="text-2xl text-gray-400 mb-4 font-bold text-right leading-relaxed" style={{fontFamily: "'Amiri', serif"}}>
                                {hadithArabic}
                            </p>
                        )}
                        <h1 className="text-[26px] font-bold text-gray-900 leading-snug">
                             {hadithBengali}
                        </h1>
                     </div>

                     <div className="mt-8 flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full bg-[${BK_GREEN}] flex items-center justify-center text-white`}>
                             <BookOpen size={18} />
                         </div>
                         <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-500 uppercase">Reference</span>
                             <span className="text-sm font-bold text-gray-800">{hadithSource}</span>
                         </div>
                     </div>

                     <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                         <div className="flex flex-col text-xs font-bold text-gray-400">
                             <span>{dayName}, {dateOne}</span>
                             <span className="text-[10px] text-gray-300">{dateThree} • {dateTwo}</span>
                         </div>
                         <div className="transform scale-75 origin-right">
                            <BrandHeader customLogo={customLogo} variant="colored" />
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-hadith-floral') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#fafaf9] flex flex-col justify-center items-center relative overflow-hidden p-8 border-[16px] border-white shadow-inner">
                {/* Decorative Corners */}
                <div className="absolute top-4 left-4 text-[#d6d3d1]">
                   <Leaf size={48} className="-rotate-45" />
                </div>
                <div className="absolute bottom-4 right-4 text-[#d6d3d1]">
                   <Leaf size={48} className="rotate-[135deg]" />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center border border-[#e7e5e4] rounded-lg p-8">
                     <div className="mb-6 text-[#a8a29e]">
                         <Star size={24} />
                     </div>

                     {hadithArabic && (
                        <p className="text-3xl text-[#57534e] mb-8 font-bold leading-loose" style={{fontFamily: "'Amiri', serif"}}>
                            {hadithArabic}
                        </p>
                     )}

                     <h1 className="text-2xl font-bold text-[#44403c] leading-relaxed mb-8">
                         {hadithBengali}
                     </h1>

                     <div className="w-20 h-px bg-[#d6d3d1] mb-4"></div>

                     <p className="text-sm font-bold text-[#78716c] uppercase tracking-widest mb-10">
                         {hadithSource}
                     </p>

                     <div className="absolute bottom-4 w-full flex justify-center text-[10px] text-[#a8a29e] font-bold uppercase tracking-widest gap-4">
                         <span>{dayName}</span>
                         <span>•</span>
                         <span>{dateThree}</span>
                         <span>•</span>
                         <span>{dateTwo}</span>
                     </div>
                </div>
                
                <div className="absolute bottom-6 right-8 transform scale-75 origin-bottom-right opacity-60">
                    <BrandHeader customLogo={customLogo} variant="colored" />
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} style={containerStyle} className="bg-gray-100 flex items-center justify-center">
            Hadith Template Not Found
        </div>
    );
});

export default HadithCardTemplates;
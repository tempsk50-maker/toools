import React, { forwardRef } from 'react';
import { NewsCardTemplate } from '../../types';
import { Quote, CalendarDays, Clock } from 'lucide-react';

interface NewsCanvasProps {
  headline: string;
  images: string[];
  customLogo: string | null;
  template: NewsCardTemplate;
  selectedFont?: string;
}

const getBengaliDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('bn-BD', options).format(date);
};

const CardImage = ({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) => (
  <img 
    src={src} 
    className={`w-full h-full object-cover ${className}`} 
    alt="News"
    crossOrigin="anonymous"
    style={style}
  />
);

// --- Brand Colors ---
const BK_RED = '#da291c';
const BK_GREEN = '#008542';

// --- Brand Header (Reusable) ---
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

const NewsCanvas = forwardRef<HTMLDivElement, NewsCanvasProps>(
  ({ 
    headline, 
    images = [], 
    customLogo, 
    template, 
    selectedFont, 
  }, ref) => {
    
    const image = images.length > 0 ? images[0] : null;
    const todayDate = getBengaliDate();
    const headlineFont = selectedFont || '"Hind Siliguri", sans-serif';

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

    const getHeadlineStyle = (size: number, lineHeight: number = 1.4, weight: string | number = 'bold', color: string = 'inherit') => ({
      fontFamily: headlineFont,
      fontSize: `${size}px`,
      lineHeight: lineHeight,
      fontWeight: weight,
      color: color,
      maxHeight: `${size * lineHeight * 3.8}px`,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 4,
      WebkitBoxOrient: 'vertical' as const,
    });

    // -------------------------------------------------------------------------
    // NEWS CARD TEMPLATES
    // -------------------------------------------------------------------------

    // 1. "Robi Prime" Design (Classic Light)
    if (template === 'bk-news-classic-light') {
      return (
        <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
           {/* Top Image Section (Approx 55%) */}
           <div className="w-full h-[55%] bg-[#f3f4f6] relative">
              {image ? (
                <CardImage src={image} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                   <span className="text-lg">No Image</span>
                </div>
              )}
              
              {/* Date Tag - Top Right, Red Background */}
              <div className={`absolute top-0 right-0 bg-[${BK_RED}] text-white px-6 py-2 rounded-bl-2xl shadow-md z-10`}>
                 <span className="text-xs font-bold tracking-wide">{todayDate}</span>
              </div>
           </div>

           {/* Bottom Text Section */}
           <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 relative">
              
              {/* Three Dots Decoration (Pinkish-Green-Pinkish) */}
              <div className="flex gap-2 mb-6">
                   <div className="w-3 h-3 rounded-full bg-[#ff8ba7]"></div>
                   <div className={`w-3 h-3 rounded-full bg-[${BK_GREEN}]`}></div>
                   <div className="w-3 h-3 rounded-full bg-[#ff8ba7]"></div>
              </div>

              {/* Headline */}
              <div className="w-full text-center mb-8">
                 <h1 style={getHeadlineStyle(38, 1.35, 700, '#111827')} className="tracking-tight leading-snug">
                    {headline || "রবি প্রাইম ডিজাইনে আপনার হেডলাইনটি চমৎকার দেখাবে, এমনকি তিন লাইনে হলেও..."}
                 </h1>
              </div>

              {/* Logo Footer */}
              <div className="mt-auto mb-8 transform scale-90">
                 <BrandHeader customLogo={customLogo} variant="colored" />
              </div>
           </div>
        </div>
      );
    }

    // 2. "Emerald Slate" Design (Studio Dark)
    if (template === 'bk-news-studio-dark') {
      return (
        <div ref={ref} style={containerStyle} className="bg-[#0b1215] flex flex-col relative overflow-hidden">
           {/* Top Image Section (Approx 50%) */}
           <div className="w-full h-[50%] bg-[#1a202c] relative z-0">
               {image ? (
                  <CardImage src={image} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                     <span className="text-lg">No Image</span>
                  </div>
               )}
               {/* Fade to dark at bottom of image */}
               <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0b1215] to-transparent"></div>
           </div>

           {/* Bottom Content Section */}
           <div className="flex-1 relative z-10 flex flex-col items-center pt-0 px-8 pb-8">
               
               {/* Date Pill - Centered, Dark with Green Border */}
               <div className={`-mt-3 mb-8 bg-[#0b1215] border border-[${BK_GREEN}] text-white px-6 py-1.5 rounded-full shadow-lg z-20`}>
                   <span className="text-xs font-bold tracking-wide">{todayDate}</span>
               </div>

               {/* Headline */}
               <div className="w-full text-center relative z-20 mb-4">
                  <h1 style={getHeadlineStyle(32, 1.4, 700, '#ffffff')} className="tracking-tight drop-shadow-lg leading-snug">
                      {headline || "এমারল্ড স্লেট থিমে সংবাদের আভিজাত্য ফুটে উঠবে এবং পর্যাপ্ত জায়গা থাকবে..."}
                  </h1>
               </div>

               {/* Logo Footer */}
               <div className="mt-auto mb-4 transform scale-90 opacity-90">
                  <BrandHeader customLogo={customLogo} variant="white" />
               </div>
           </div>
        </div>
      );
    }

    // 3. "Corporate Dark" (Dark Blue BG, Red Curve, Centered Date)
    if (template === 'bk-news-corporate-dark') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#111827] flex flex-col relative overflow-hidden">
                {/* Background Decor */}
                <div className={`absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-[${BK_RED}] to-pink-900 rounded-full opacity-90 z-0`}></div>
                
                {/* Image Section - Top 50% */}
                <div className="w-full h-[50%] bg-gray-800 relative z-10">
                    {image ? (
                         <div className="w-full h-full relative">
                            <CardImage src={image} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#111827] to-transparent"></div>
                         </div>
                    ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center pt-0 px-8 pb-8 relative z-20">
                     {/* Date Pill */}
                     <div className={`-mt-4 mb-8 bg-[#1f2937] border border-gray-700 px-5 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
                        <div className={`w-2 h-2 rounded-full bg-[${BK_RED}]`}></div>
                        <span className="text-xs font-bold text-gray-300">{todayDate}</span>
                     </div>

                     {/* Headline */}
                     <div className="text-center mb-8">
                        <h1 style={getHeadlineStyle(34, 1.4, 700, '#ffffff')} className="tracking-wide leading-snug">
                            {headline || "কর্পোরেট ডার্ক থিমে একটি প্রফেশনাল এবং গাম্ভীর্যপূর্ণ লুক পাওয়া যায়..."}
                        </h1>
                     </div>

                     {/* Logo */}
                     <div className="mt-auto transform scale-90">
                        <BrandHeader customLogo={customLogo} variant="white" />
                     </div>
                </div>
            </div>
        );
    }

    // 4. "Premium Minimal" (White BG, Left Bar Headline, Clock Icon)
    if (template === 'bk-news-premium-minimal') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#f9fafb] flex flex-col relative overflow-hidden">
                {/* Image Section - Top 55% */}
                <div className="w-full h-[55%] bg-gray-200 relative">
                     {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
                </div>

                {/* Tag Pill - Overlapping Left */}
                <div className="absolute top-[53%] left-0 z-20">
                     <div className="bg-white pr-5 py-2 rounded-r-xl shadow-sm flex items-center gap-2 border border-gray-100">
                         <div className={`w-1.5 h-4 bg-[${BK_RED}] rounded-full ml-1`}></div>
                         <span className={`text-[11px] font-bold text-[${BK_GREEN}] uppercase tracking-widest`}>NEWS UPDATE</span>
                     </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-8 pt-10 pb-8 bg-white relative">
                     {/* Date */}
                     <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-4 ml-1">
                         <Clock size={14} />
                         {todayDate}
                     </div>

                     {/* Headline with Bar */}
                     <div className="flex gap-4 mb-6">
                         <div className="w-1.5 bg-gray-900 rounded-full flex-shrink-0 mt-2 mb-2"></div>
                         <h1 style={getHeadlineStyle(36, 1.3, 700, '#0f172a')} className="tracking-tight leading-tight">
                            {headline || "প্রিমিয়াম মিনিমাল ডিজাইনে একটি ক্লিন এবং ম্যাগাজিন স্টাইলের লুক পাওয়া যায়..."}
                         </h1>
                     </div>

                     {/* Footer */}
                     <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-6">
                         <div className="transform scale-75 origin-bottom-left">
                            <BrandHeader customLogo={customLogo} variant="colored" />
                         </div>
                         <div className="flex gap-1.5 pb-2">
                            <div className={`w-1.5 h-1.5 rounded-full bg-[${BK_GREEN}]`}></div>
                            <div className={`w-1.5 h-1.5 rounded-full bg-[${BK_GREEN}] opacity-60`}></div>
                            <div className={`w-1.5 h-1.5 rounded-full bg-[${BK_GREEN}] opacity-30`}></div>
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    // 5. "Elegant Light" (Green Diamond, Pill Date)
    if (template === 'bk-news-elegant-light') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#f8fafc] flex flex-col relative overflow-hidden">
                {/* Header with Date Pill */}
                <div className="absolute top-6 right-6 z-20">
                    <div className={`bg-[${BK_GREEN}] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2`}>
                        <CalendarDays size={12} /> {todayDate}
                    </div>
                </div>

                <div className="absolute top-6 left-6 z-20 transform scale-75 origin-top-left">
                     <BrandHeader customLogo={customLogo} variant="colored" />
                </div>

                {/* Card Container - Floating Effect */}
                <div className="m-6 mt-20 mb-6 bg-white rounded-3xl shadow-xl border border-gray-100 flex-1 flex flex-col overflow-hidden relative">
                    
                    {/* Image - Top 55% */}
                    <div className="h-[55%] w-full bg-gray-100 relative">
                         {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300">No Image</div>}
                         
                         {/* Diamond Divider */}
                         <div className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 rotate-45 w-10 h-10 bg-[${BK_GREEN}] border-4 border-white shadow-sm z-10`}>
                            <div className="w-full h-full flex items-center justify-center -rotate-45">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                         </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-8 pt-10 pb-6 flex flex-col items-center justify-center text-center">
                         <h1 style={getHeadlineStyle(32, 1.4, 700, '#1e293b')} className="tracking-tight leading-snug">
                            {headline || "এলিগেন্ট লাইট ডিজাইনে ছবিটি একটি ফ্রেমের মধ্যে থাকে এবং টেক্সট সাদা ক্যানভাসে..."}
                         </h1>
                    </div>

                    {/* Footer Pills */}
                    <div className="px-6 pb-6 flex justify-between items-center text-[10px] font-bold text-gray-400">
                        <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 flex items-center gap-1">
                             <Quote size={10} /> বিস্তারিত কমেন্টে
                        </div>
                        <div className="px-3 py-1 bg-gray-900 text-white rounded-full">basherkella.com</div>
                    </div>
                </div>
            </div>
        );
    }

    // 6. "Focus Red" (Red BG, White Text)
    if (template === 'bk-news-focus-red') {
        return (
            <div ref={ref} style={containerStyle} className={`bg-[${BK_RED}] flex flex-col relative overflow-hidden`}>
                {/* Image Section - Top 58% */}
                <div className="h-[58%] w-full bg-gray-900 relative">
                     {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-500">No Image</div>}
                     <div className={`absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[${BK_RED}] to-transparent`}></div>
                </div>

                {/* Content */}
                <div className="flex-1 px-10 pb-10 flex flex-col items-center justify-center relative z-10 text-center">
                     <h1 style={getHeadlineStyle(36, 1.35, 700, '#ffffff')} className="drop-shadow-md leading-snug">
                        {headline || "ফোকাস রেড ডিজাইনে সংবাদের শিরোনামটি লাল ব্যাকগ্রাউন্ডে সাদা রঙে ফুটে উঠবে..."}
                     </h1>
                </div>

                {/* Footer Bar */}
                <div className="h-16 bg-black/10 flex items-center justify-between px-8 backdrop-blur-sm border-t border-white/10">
                     <div className="transform scale-90 origin-left brightness-0 invert">
                        <BrandHeader customLogo={customLogo} variant="white" />
                     </div>
                     <span className="text-xs font-bold text-white/80 tracking-wide">{todayDate}</span>
                </div>
                
                {/* Decor */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
            </div>
        );
    }

    // 7. "Red Headline" (White BG, Red Left Border, Green Badge)
    if (template === 'bk-news-red-headline') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                {/* Image - Top 50% */}
                <div className="h-[50%] w-full bg-gray-100 relative">
                    {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300">No Image</div>}
                    
                    {/* Badge */}
                    <div className={`absolute top-6 left-0 bg-[${BK_GREEN}] text-white px-4 py-1.5 rounded-r text-[10px] font-bold uppercase tracking-widest shadow-md`}>
                        News Update
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 pt-8 pb-8 flex flex-col">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        {todayDate}
                    </div>

                    {/* Headline - WITH RED LEFT BORDER */}
                    <div className="mb-6 flex-1 flex items-start">
                         <div className={`border-l-[6px] border-[${BK_RED}] pl-5 h-full`}>
                            <h1 style={getHeadlineStyle(36, 1.3, 700, '#111827')} className="tracking-tighter leading-tight">
                                {headline || "রেড হেডলাইন ডিজাইনে বাম পাশে একটি লাল বর্ডার থাকে যা সংবাদের গুরুত্ব বাড়িয়ে দেয়..."}
                            </h1>
                         </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-end justify-between border-t border-gray-100 pt-6 mt-auto">
                        <div className="transform scale-90 origin-bottom-left">
                            <BrandHeader customLogo={customLogo} variant="colored" />
                        </div>
                        {/* Decorative Red Line at bottom right */}
                        <div className={`w-16 h-1.5 bg-[${BK_RED}] rounded-full mb-2 opacity-80`}></div>
                    </div>
                </div>
            </div>
        );
    }

    // 8. "Vibrant Overlay"
    if (template === 'bk-news-vibrant-overlay') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#002411] flex flex-col relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    {image ? (
                        <CardImage src={image} className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="w-full h-full bg-[#002411] flex items-center justify-center opacity-10">
                            <span className="text-white text-4xl font-bold opacity-10">No Image</span>
                        </div>
                    )}
                    {/* Strong Green Overlay - Using Opacity instead of Mix Blend for better HTML2Canvas Export */}
                    <div className={`absolute inset-0 bg-[#002411]/80`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#00381c] via-transparent to-black/40`}></div>
                </div>

                {/* Date Top Right */}
                <div className="absolute top-6 right-6 z-20">
                     <div className="bg-[#1f2937]/80 backdrop-blur border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
                        {todayDate}
                     </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 text-center mt-12">
                    <div className={`w-12 h-1 bg-[${BK_RED}] mb-6 rounded-full shadow-[0_0_10px_rgba(218,41,28,0.5)]`}></div>
                    <h1 style={getHeadlineStyle(36, 1.35, 700, '#ffffff')} className="drop-shadow-xl leading-snug">
                        {headline || "ভাইব্রেন্ট ওভারলে ডিজাইনে ছবিটি সম্পূর্ণ দেখা যাবে এবং ব্র্যান্ড কালার ফুটে উঠবে..."}
                    </h1>
                </div>

                {/* Footer */}
                <div className="pb-8 relative z-10 flex justify-center border-t border-white/10 w-full pt-6 mt-auto">
                    <div className="transform scale-90">
                        <BrandHeader customLogo={customLogo} variant="white" />
                    </div>
                </div>
            </div>
        );
    }

    // 9. "Modern Card"
    if (template === 'bk-news-modern-card') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                {/* Image Section - Top 55% */}
                <div className="h-[55%] w-full bg-gray-100 relative">
                     {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300">No Image</div>}
                </div>
                
                {/* Date - Floating Top Right */}
                <div className="absolute top-6 right-6 z-20">
                    <div className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-md flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-[${BK_RED}]`}></div>
                        {todayDate}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white relative z-10 flex flex-col items-center pt-8 px-8 pb-8 -mt-8 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                     {/* Green Line */}
                     <div className={`w-12 h-1 bg-[${BK_GREEN}] mb-6 rounded-full`}></div>

                     {/* Headline */}
                     <div className="text-center mb-6 w-full">
                        <h1 style={getHeadlineStyle(34, 1.35, 700, '#111827')} className="tracking-tight leading-snug">
                            {headline || "মডার্ন কার্ড ডিজাইনে খবরের শিরোনাম এবং ছবি একটি সুন্দর কাঠামোর মধ্যে থাকে..."}
                        </h1>
                     </div>

                     {/* Footer */}
                     <div className="mt-auto transform scale-90">
                        <BrandHeader customLogo={customLogo} variant="colored" />
                     </div>
                </div>
            </div>
        );
    }

    // 10. "Midnight Impact" (Dark Navy, Split Line)
    if (template === 'bk-news-midnight-impact') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#0f1623] flex flex-col relative overflow-hidden text-white">
                {/* Image Section - Top 50% */}
                <div className="h-[50%] w-full bg-[#1a202c] relative">
                    {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-600">No Image</div>}
                </div>
                
                {/* Content */}
                <div className="flex-1 px-8 pt-8 pb-6 flex flex-col items-center">
                    {/* Split Divider */}
                    <div className="flex w-16 h-1 mb-8 rounded-full overflow-hidden">
                        <div className={`w-1/2 h-full bg-[${BK_RED}]`}></div>
                        <div className={`w-1/2 h-full bg-[${BK_GREEN}]`}></div>
                    </div>
                    
                    {/* Headline */}
                    <div className="text-center mb-6 w-full">
                        <h1 style={getHeadlineStyle(34, 1.4, 700, '#ffffff')} className="tracking-wide leading-snug">
                            {headline || "মিডনাইট ইমপ্যাক্ট থিমে আপনার সংবাদটি অত্যন্ত শার্প এবং মডার্ন দেখাবে..."}
                        </h1>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-auto w-full flex justify-between items-end border-t border-gray-800 pt-4 opacity-80">
                        <span className="text-xs text-gray-400 font-bold tracking-wider">{todayDate}</span>
                        <div className="transform scale-75 origin-bottom-right brightness-0 invert">
                            <BrandHeader customLogo={customLogo} variant="white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 11. "Elegant Border" (White BG, Full Green Border)
    if (template === 'bk-news-elegant-border') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white p-3 flex flex-col relative">
                <div className={`w-full h-full border-[2.5px] border-[${BK_GREEN}] flex flex-col overflow-hidden`}>
                    {/* Image Section - Top 55% */}
                    <div className="h-[55%] w-full bg-gray-100 relative border-b border-gray-100">
                        {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300">No Image</div>}
                    </div>
                    
                    {/* Date Separator */}
                    <div className="flex items-center justify-center gap-4 py-6">
                        <div className={`w-12 h-[1.5px] bg-[${BK_GREEN}]`}></div>
                        <span className={`text-[11px] font-bold text-[${BK_GREEN}] uppercase tracking-widest`}>{todayDate}</span>
                        <div className={`w-12 h-[1.5px] bg-[${BK_GREEN}]`}></div>
                    </div>
                    
                    {/* Headline */}
                    <div className="px-6 text-center mb-6 flex-1 flex items-center justify-center">
                        <h1 style={getHeadlineStyle(34, 1.35, 700, '#111827')} className="tracking-tight leading-snug">
                            {headline || "এলিগেন্ট বর্ডার ডিজাইনে সংবাদটি একটি ম্যাগাজিন লুক পাবে এবং বড় হেডলাইনও ধরবে..."}
                        </h1>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-auto pb-6 flex justify-center">
                        <div className="transform scale-90">
                            <BrandHeader customLogo={customLogo} variant="colored" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 12. "Royal Green" (Dark BG, Green Glow Line)
    if (template === 'bk-news-royal-green') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#101418] flex flex-col relative overflow-hidden text-white">
                {/* Image Section - Top 55% */}
                <div className="h-[55%] w-full bg-[#1a202c] relative">
                    {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-600">No Image</div>}
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#101418] to-transparent"></div>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 flex flex-col items-center justify-center relative -mt-4">
                    {/* Green Glow Line */}
                    <div className={`w-12 h-1 bg-[${BK_GREEN}] mb-6 shadow-[0_0_20px_${BK_GREEN}] rounded-full`}></div>

                    {/* Headline */}
                    <div className="text-center w-full mb-8">
                        <h1 style={getHeadlineStyle(40, 1.4, 700, '#ffffff')} className="tracking-wide leading-snug drop-shadow-lg">
                            {headline || "রয়্যাল গ্রিন থিমে সংবাদটি অত্যন্ত রাজকীয় এবং ব্র্যান্ড কালারে আকর্ষণীয় দেখাবে..."}
                        </h1>
                    </div>

                    {/* Date */}
                    <div className={`text-[${BK_GREEN}] text-xs font-bold tracking-wider mb-2 opacity-80`}>
                        {todayDate}
                    </div>

                    {/* Logo */}
                    <div className="mt-auto pb-8 transform scale-90 origin-bottom brightness-0 invert opacity-90">
                        <BrandHeader customLogo={customLogo} variant="white" />
                    </div>
                </div>
            </div>
        );
    }

    // 13. "Dark Studio" (Red Pill)
    if (template === 'bk-news-dark-studio') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#0f1713] flex flex-col relative overflow-hidden text-white">
                {/* Image Section - Top 50% */}
                <div className="h-[50%] w-full bg-[#1a202c] relative">
                    {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-600">No Image</div>}
                </div>

                {/* Content */}
                <div className="flex-1 px-8 pb-8 flex flex-col items-center pt-0 relative">
                    {/* Red Pill Date - Positioned centered vertically on the boundary */}
                    <div className={`-mt-4 mb-8 bg-[${BK_RED}] text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg z-10 border-2 border-[#0f1713]`}>
                        {todayDate}
                    </div>

                    {/* Headline */}
                    <div className="text-center w-full mb-6 relative z-0">
                        <h1 style={getHeadlineStyle(40, 1.4, 700, '#ffffff')} className="tracking-tight leading-snug">
                            {headline || "ডার্ক স্টুডিও থিমে আপনার সংবাদ সুন্দরভাবে ফুটে উঠবে এবং তিন লাইনেও পারফেক্ট দেখাবে..."}
                        </h1>
                    </div>

                    {/* Logo */}
                    <div className="mt-auto transform scale-90 brightness-0 invert">
                        <BrandHeader customLogo={customLogo} variant="white" />
                    </div>
                </div>
            </div>
        );
    }

    // 14. "Classic Center" (White BG, Green Top Line)
    if (template === 'bk-news-classic-center') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                {/* Image Section - Top 55% */}
                <div className="h-[55%] w-full bg-gray-100 relative">
                    {image ? <CardImage src={image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300">No Image</div>}
                    
                    {/* Date Pill Top Right */}
                    <div className="absolute top-5 right-5 bg-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-2 text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-[${BK_RED}]`}></div>
                        {todayDate}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 pt-10 pb-8 flex flex-col items-center">
                    {/* Green Center Line */}
                    <div className={`w-12 h-1 bg-[${BK_GREEN}] mb-6 rounded-full`}></div>

                    {/* Headline */}
                    <div className="text-center w-full mb-6">
                        <h1 style={getHeadlineStyle(38, 1.3, 700, '#111827')} className="tracking-tighter leading-tight">
                            {headline || "সেন্টার অ্যালাইনমেন্টে সুন্দর একটি হেডলাইন যা এখন তিন লাইন পর্যন্ত খুব সুন্দরভাবে ধরবে..."}
                        </h1>
                    </div>

                    {/* Logo */}
                    <div className="mt-auto transform scale-90">
                        <BrandHeader customLogo={customLogo} variant="colored" />
                    </div>
                </div>
            </div>
        );
    }

    // Default Fallback
    return (
        <div ref={ref} style={containerStyle} className="bg-gray-50 flex flex-col justify-center items-center">
             <p className="text-gray-400">ডিজাইন সিলেক্ট করুন</p>
        </div>
    );
  }
);

export default NewsCanvas;
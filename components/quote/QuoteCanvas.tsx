import React, { forwardRef } from 'react';
import { NewsCardTemplate } from '../../types';
import { Quote, CalendarDays } from 'lucide-react';

interface QuoteCanvasProps {
  headline: string;
  body: string;
  images: string[];
  customLogo: string | null;
  template: NewsCardTemplate;
  selectedFont?: string;
  isImageTransparent?: boolean;
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
    alt="Quote"
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

const QuoteCanvas = forwardRef<HTMLDivElement, QuoteCanvasProps>(
  ({ 
    headline, 
    body, 
    images = [], 
    customLogo, 
    template, 
    selectedFont, 
    isImageTransparent = false 
  }, ref) => {
    
    const image = images.length > 0 ? images[0] : null;
    const todayDate = getBengaliDate();
    const headlineFont = selectedFont || '"Hind Siliguri", sans-serif';

    const width = 600;
    const height = 750;

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
      maxHeight: `${size * lineHeight * 8}px`,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 8,
      WebkitBoxOrient: 'vertical' as const,
    });

    // -------------------------------------------------------------------------
    // QUOTE CARD TEMPLATES
    // -------------------------------------------------------------------------

        if (template === 'bk-quote-grid-classic') {
            return (
                <div ref={ref} style={containerStyle} className="bg-[#fcfcfc] flex flex-col relative">
                    <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
                    <div className={`h-4 w-full bg-[${BK_GREEN}] absolute top-0 left-0 z-20 shadow-sm`}></div>
                    <div className="px-8 pt-16 pb-0 flex flex-col z-10 relative h-full">
                        <div className="flex justify-center mb-6">
                            <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500 tracking-wider">
                                {todayDate}
                            </span>
                        </div>
                        <div className="text-center mb-6 relative z-30 px-2">
                            <h1 style={getHeadlineStyle(38, 1.4, 700, '#111827')} className="leading-snug drop-shadow-sm">
                                {headline || "গ্রিড ক্লাসিক ডিজাইনে আপনার উক্তিটি খুব সুন্দরভাবে ফুটে উঠবে..."}
                            </h1>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="relative w-full h-[450px] flex items-end">
                            <div className={`absolute bottom-10 left-0 bg-[${BK_GREEN}] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 rounded-2xl z-30 max-w-[280px] text-white`}>
                                 <div>
                                    <h2 className={`text-2xl font-bold leading-tight`}>
                                        {body ? (body.includes(',') ? body.split(',')[0] : body) : "বক্তার নাম"}
                                    </h2>
                                    <p className={`text-sm font-medium opacity-90 mt-1`}>
                                        {body ? (body.includes(',') ? body.split(',').slice(1).join(',') : 'পদবী') : 'পদবী'}
                                    </p>
                                 </div>
                                 <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                                     <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">News Update</span>
                                     <div className="scale-75 origin-right -mr-2 opacity-90 filter brightness-0 invert">
                                        <BrandHeader customLogo={customLogo} variant="white" />
                                     </div>
                                 </div>
                            </div>
                            <div className="absolute right-[-30px] bottom-0 w-[450px] h-[520px] z-20 flex items-end justify-end pointer-events-none">
                                 {image ? (
                                    isImageTransparent ? (
                                        <CardImage src={image} className="object-contain w-full h-full drop-shadow-2xl" style={{ objectPosition: 'bottom center' }} />
                                    ) : (
                                        <div className="w-[320px] h-[380px] bg-white p-2.5 shadow-xl rotate-[-3deg] mb-12 mr-10 rounded-2xl border border-gray-100 pointer-events-auto">
                                            <div className="w-full h-full overflow-hidden rounded-xl relative bg-gray-100">
                                                <CardImage src={image} className="w-full h-full object-cover" style={{ objectPosition: 'top center' }}/>
                                                <div className="absolute inset-0 ring-1 ring-black/5 rounded-xl pointer-events-none"></div>
                                            </div>
                                        </div>
                                    )
                                 ) : (
                                    <div className="w-[300px] h-[400px] flex items-end justify-end p-10 text-gray-300 opacity-50"><Quote size={120} /></div>
                                 )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'bk-quote-elegant-frame') {
            return (
                <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className={`h-3 w-full bg-[${BK_GREEN}]`}></div>
                    <div className="flex-1 flex flex-col items-center pt-8 px-8 pb-8 relative z-10">
                        <div className="mb-6 transform scale-90">
                             <BrandHeader customLogo={customLogo} variant="colored" />
                        </div>
                        <div className="relative mb-8 group">
                            <div className={`absolute inset-0 rounded-full bg-[${BK_GREEN}]/10 transform translate-x-2 translate-y-2`}></div>
                            <div className={`w-[260px] h-[260px] rounded-full p-2 bg-white border border-gray-100 shadow-xl relative z-10 overflow-hidden`}>
                                <div className="w-full h-full rounded-full overflow-hidden relative">
                                     {image ? (
                                        <CardImage src={image} className="w-full h-full object-cover" style={{ objectPosition: 'top center' }} />
                                     ) : (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300"><Quote size={60} /></div>
                                     )}
                                </div>
                            </div>
                            <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[${BK_GREEN}] text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg z-20 whitespace-nowrap`}>
                                {todayDate}
                            </div>
                        </div>
                        <div className="w-full text-center relative flex-1 flex flex-col justify-center">
                            <Quote size={32} className={`text-[${BK_RED}]/20 absolute -top-6 left-0 transform -scale-x-100`} />
                            <h1 style={{...getHeadlineStyle(28, 1.6, 600, '#1f2937'), fontFamily: '"Merriweather", "Noto Serif Bengali", serif'}} className="relative z-10 px-4">
                                {headline || "এলিগেন্ট ফ্রেম ডিজাইনে এখন ছবিটি আরও বড় এবং স্পষ্ট দেখাবে..."}
                            </h1>
                            <Quote size={32} className={`text-[${BK_RED}]/20 absolute -bottom-2 right-0`} />
                        </div>
                        <div className="mt-6 text-center border-t border-gray-100 pt-5 w-full">
                             <h2 className={`text-2xl font-bold text-[${BK_GREEN}] tracking-tight`}>
                                {body ? (body.includes(',') ? body.split(',')[0] : body) : "বক্তার নাম"}
                             </h2>
                             <p className="text-sm font-medium text-gray-500 mt-1">
                                {body ? (body.includes(',') ? body.split(',').slice(1).join(',') : 'পদবী') : 'পদবী'}
                             </p>
                        </div>
                    </div>
                    <div className={`h-2 w-full bg-[${BK_RED}]`}></div>
                </div>
            );
        }

        if (template === 'bk-quote-red-split') {
            return (
                <div ref={ref} style={containerStyle} className="flex flex-row relative">
                    <div className={`w-[60%] h-full bg-[#590e09] text-white p-8 flex flex-col relative overflow-hidden`}>
                         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                         <div className="relative z-10 flex-1 flex flex-col justify-center">
                             <div className="mb-6"><Quote size={48} className="fill-white text-white" /></div>
                             <h1 style={getHeadlineStyle(32, 1.45, 700, '#ffffff')} className="leading-snug tracking-wide">
                                {headline || "রেড স্প্লিট ডিজাইনে বাম পাশে বোল্ড টেক্সট এবং ডান পাশে বক্তার ছবি থাকে..."}
                             </h1>
                             <div className="mt-8 flex items-center gap-2 text-white/60 text-xs font-bold border-t border-white/20 pt-4 w-max">
                                 <div className={`w-1.5 h-1.5 bg-[${BK_GREEN}] rounded-full`}></div>
                                 {todayDate}
                             </div>
                         </div>
                    </div>
                    <div className="w-[40%] h-full bg-[#f3f4f6] relative flex flex-col items-center pt-16 pb-8 border-l border-gray-200">
                         <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
                         <div className="mb-8"><BrandHeader customLogo={customLogo} variant="colored" scale={0.7} /></div>
                         <div className={`w-[200px] h-[200px] rounded-full border-4 border-[${BK_RED}] shadow-xl overflow-hidden mb-6 relative bg-white`}>
                             {image ? (
                                <CardImage src={image} className="w-full h-full object-cover" style={{ objectPosition: 'top center' }} />
                             ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400"><Quote size={48} /></div>
                             )}
                         </div>
                         <div className="text-center px-2 relative z-10 w-full">
                             <h2 className="text-xl font-bold text-gray-900 leading-tight">{body ? (body.includes(',') ? body.split(',')[0] : body) : "বক্তার নাম"}</h2>
                             <div className={`h-1 w-10 bg-[${BK_GREEN}] mx-auto my-3 rounded-full`}></div>
                             <p className="text-xs text-gray-600 font-medium whitespace-pre-wrap">{body ? (body.includes(',') ? body.split(',').slice(1).join(',') : 'পদবী') : 'পদবী'}</p>
                         </div>
                         <div className="mt-auto flex flex-col items-center gap-1 opacity-70">
                             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">fb/basherkella</div>
                         </div>
                    </div>
                </div>
            );
        }

        if (template === 'bk-quote-sidebar-green') {
            return (
                <div ref={ref} style={containerStyle} className="bg-[#fcfcfc] flex flex-col relative overflow-hidden">
                     <div className={`absolute top-0 bottom-0 left-0 w-[25%] bg-[${BK_GREEN}] z-0`}></div>
                     <div className="absolute top-0 bottom-0 right-0 w-[75%] bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-50 z-0"></div>
                     <div className="relative z-10 w-full h-full flex flex-col">
                         <div className="flex justify-end pt-6 pr-8"><BrandHeader customLogo={customLogo} variant="colored" scale={0.8} /></div>
                         <div className="flex-1 pl-[28%] pr-8 pt-10 flex flex-col justify-start">
                             <div className="mb-4"><span className={`bg-[#fff9c4] text-black px-2 py-1 text-sm font-bold border-l-4 border-[${BK_RED}] shadow-sm`}>আলোচিত উক্তি</span></div>
                             <h1 style={getHeadlineStyle(34, 1.4, 700, '#111827')} className="mb-6 drop-shadow-sm">
                                {headline || "গ্রিন সাইডবার ডিজাইনে ছবিটি বাম পাশের বারে ওভারল্যাপ করে..."}
                             </h1>
                             <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                             <div className="mt-4">
                                 <p className="text-gray-500 text-sm font-bold flex items-center gap-2"><span className={`w-4 h-px bg-[${BK_RED}]`}></span>{body ? (body.includes(',') ? body.split(',')[0] : body) : "বক্তার নাম"}</p>
                                 <p className="text-gray-400 text-xs pl-6 mt-0.5">{body ? (body.includes(',') ? body.split(',').slice(1).join(',') : 'পদবী') : 'পদবী'}</p>
                             </div>
                         </div>
                         <div className="h-[400px] w-full relative mt-auto pointer-events-none">
                             <div className="absolute bottom-0 left-4 w-[350px] h-full flex items-end">
                                {image ? <CardImage src={image} className="object-contain w-full h-full origin-bottom-left filter drop-shadow-xl" style={{ objectPosition: 'bottom left' }} /> : <div className="w-[200px] h-[300px] bg-gray-300 ml-8 rounded-t-full flex items-center justify-center text-gray-500 opacity-50">Photo</div>}
                             </div>
                             <div className={`absolute bottom-0 right-0 w-[75%] h-12 bg-[#fff9c4] flex items-center justify-end px-8 gap-3 z-[-1]`}>
                                 <span className="text-xs font-bold text-gray-800">{todayDate}</span>
                             </div>
                         </div>
                     </div>
                </div>
            );
        }

        if (template === 'bk-quote-glass') {
            return (
                <div ref={ref} style={containerStyle} className="bg-[#050a07] flex flex-col relative text-white">
                    <div className="absolute inset-0 z-0">
                        {image ? (
                            <CardImage src={image} className="w-full h-full object-cover" style={{ objectPosition: 'top center' }} /> 
                        ) : (
                            <div className="w-full h-full bg-[#1a1a1a]"></div>
                        )}
                        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 w-full h-[75%] bg-gradient-to-t from-[#050a07] via-[#050a07]/90 to-transparent"></div>
                    </div>
                    <div className="absolute inset-0 z-10 flex flex-col p-8">
                        <div className="flex justify-between items-start">
                            <BrandHeader customLogo={customLogo} variant="dark" scale={0.75} />
                            <div className={`px-3 py-1 border border-[${BK_GREEN}] rounded text-[10px] font-bold text-[${BK_GREEN}] uppercase tracking-widest bg-black/40 backdrop-blur-md`}>Quote of the Day</div>
                        </div>
                        <div className="mt-auto mb-6">
                            <div className={`mb-4 w-10 h-10 rounded-full bg-[${BK_RED}] flex items-center justify-center shadow-lg shadow-red-900/50`}><Quote size={18} className="text-white fill-white" /></div>
                            <div className={`border-l-4 border-[${BK_GREEN}] pl-6 py-2 mb-6 bg-gradient-to-r from-black/40 to-transparent rounded-r-xl backdrop-blur-sm`}>
                                 <h1 style={{...getHeadlineStyle(34, 1.4, 700, '#ffffff'), textShadow: '0 2px 8px rgba(0,0,0,0.8)'}} className="tracking-wide">
                                    {headline || "ডার্ক গ্লাস থিমে আপনার উক্তিটি অত্যন্ত প্রফেশনাল এবং গাম্ভীর্যপূর্ণ দেখাবে..."}
                                 </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">{body ? (body.includes(',') ? body.split(',')[0] : body) : "বক্তার নাম"}</h2>
                                    <p className={`text-sm font-medium text-[${BK_GREEN}] uppercase tracking-wider mt-1 drop-shadow-md`}>{body ? (body.includes(',') ? body.split(',').slice(1).join(',') : 'পদবী') : 'পদবী'}</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-gray-400 text-xs font-bold"><CalendarDays size={14} />{todayDate}</div>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (template === 'bk-quote-dark-vibe') {
            return (
                <div ref={ref} style={{...containerStyle, backgroundColor: '#09090b'}} className="flex flex-col relative text-white overflow-hidden">
                    <div className={`absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[${BK_GREEN}] opacity-[0.15] blur-[150px] rounded-full pointer-events-none`}></div>
                    <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[${BK_RED}] opacity-[0.1] blur-[150px] rounded-full pointer-events-none`}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    
                    <div className="z-10 w-full h-full flex flex-col relative">
                        <div className="flex justify-between items-start px-8 pt-8 z-20">
                             <div className="flex flex-col">
                                 <span className={`text-[10px] font-bold tracking-[0.3em] text-[${BK_GREEN}] uppercase mb-1`}>Date</span>
                                 <span className="text-sm font-bold text-gray-200 font-oswald">{todayDate}</span>
                             </div>
                             <BrandHeader customLogo={customLogo} variant="dark" scale={0.75} />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[60%] z-0">
                            {image ? (
                                 <div className="w-full h-full relative">
                                    <CardImage src={image} className="w-full h-full object-cover" style={{ objectPosition: 'top center' }} />
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/30 via-transparent to-[#09090b]"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent"></div>
                                 </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-600"><Quote size={64} /></div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-end px-8 pb-10 relative z-20 mt-[40%]">
                            <div className="mb-4">
                                <div className={`w-10 h-10 rounded-full bg-[${BK_RED}]/90 flex items-center justify-center shadow-lg shadow-red-900/40 backdrop-blur-sm`}>
                                    <Quote size={18} className="text-white fill-white" />
                                </div>
                            </div>
                            <div className="relative mb-6">
                                <h1 style={{
                                    ...getHeadlineStyle(30, 1.6, 700, '#ffffff'), 
                                    textShadow: '0 4px 12px rgba(0,0,0,0.9)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 7, 
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }} className="tracking-wide drop-shadow-2xl">
                                   {headline || "ডার্ক ভাইব ডিজাইনে এখন টেক্সট কেটে যাবে না এবং সম্পূর্ণ স্পষ্টভাবে দেখা যাবে..."}
                                </h1>
                            </div>
                            <div className={`w-full h-px bg-gradient-to-r from-[${BK_GREEN}] to-transparent opacity-50 mb-4`}></div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
                                    {body ? (body.includes(',') ? body.split(',')[0] : body) : "বক্তার নাম"}
                                </h2>
                                <p className={`text-sm font-bold text-[${BK_GREEN}] uppercase tracking-widest mt-1 opacity-90`}>
                                    {body ? (body.includes(',') ? body.split(',').slice(1).join(',') : 'পদবী') : 'পদবী'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        return (
            <div ref={ref} style={containerStyle} className="bg-[#fcfcfc] flex flex-col relative justify-center items-center">
                 <p className="text-red-500">টেমপ্লেট লোড হয়নি</p>
            </div>
        );
    }
);

export default QuoteCanvas;
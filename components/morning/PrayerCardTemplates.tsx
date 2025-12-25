import React, { forwardRef } from 'react';
import { NewsCardTemplate } from '../../types';
import { Sunrise, Sunset, Moon, Sun, Clock, MapPin, Calendar, CloudMoon, CloudSun, Star } from 'lucide-react';

interface PrayerCardProps {
  dayName: string;
  dateOne: string;
  dateTwo: string;
  dateThree: string;
  images: string[];
  customLogo: string | null;
  template: NewsCardTemplate;
  prayerLocation?: string;
  prayerTimes?: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
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

const PrayerCardTemplates = forwardRef<HTMLDivElement, PrayerCardProps>(({
    dayName,
    dateOne,
    dateTwo,
    dateThree,
    images = [], 
    customLogo, 
    template,
    prayerLocation,
    prayerTimes
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

    if (template === 'bk-prayer-classic') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.03]"></div>
                
                {/* Header */}
                <div className={`bg-[${BK_GREEN}] w-full py-6 px-8 relative overflow-hidden`}>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                     <div className="flex justify-between items-center relative z-10">
                         <div>
                             <h1 className="text-2xl font-bold text-white mb-1">আজকের নামাজের সময়সূচি</h1>
                             <div className="flex items-center gap-1.5 text-green-100 text-xs font-bold">
                                 <MapPin size={12} /> {prayerLocation}
                             </div>
                         </div>
                         <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center text-[${BK_GREEN}]`}>
                             <Clock size={20} />
                         </div>
                     </div>
                </div>

                {/* Times Grid */}
                <div className="flex-1 p-6 grid grid-cols-2 gap-4 content-start">
                     {[
                        { name: 'ফজর', time: prayerTimes?.fajr, icon: CloudMoon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { name: 'সূর্যোদয়', time: prayerTimes?.sunrise, icon: Sunrise, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { name: 'জোহর', time: prayerTimes?.dhuhr, icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                        { name: 'আছর', time: prayerTimes?.asr, icon: CloudSun, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { name: 'মাগরিব', time: prayerTimes?.maghrib, icon: Sunset, color: 'text-red-500', bg: 'bg-red-50' },
                        { name: 'এশা', time: prayerTimes?.isha, icon: Moon, color: 'text-slate-600', bg: 'bg-slate-50' },
                     ].map((item, idx) => {
                         const Icon = item.icon;
                         return (
                             <div key={idx} className={`${item.bg} rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm relative overflow-hidden group`}>
                                 <div className={`absolute top-2 right-2 opacity-20 ${item.color}`}>
                                     <Icon size={24} />
                                 </div>
                                 <div className={`text-sm font-bold ${item.color} mb-1 uppercase tracking-wide`}>{item.name}</div>
                                 <div className="text-3xl font-bold text-gray-800 font-oswald">{item.time}</div>
                             </div>
                         );
                     })}
                </div>

                {/* Footer */}
                <div className="mt-auto">
                    <div className="bg-gray-50 border-t border-gray-100 py-3 px-6 flex justify-between items-center">
                         <div className="flex flex-col">
                             <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                 <span>{dayName}</span>
                                 <span className="w-1 h-4 bg-gray-300"></span>
                                 <span>{dateOne}</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mt-0.5">
                                 <span>{dateThree}</span>
                                 <span>•</span>
                                 <span>{dateTwo}</span>
                             </div>
                         </div>
                         <div className="transform scale-90 origin-right">
                             <BrandHeader customLogo={customLogo} variant="colored" />
                         </div>
                    </div>
                    <div className={`h-1.5 w-full bg-[${BK_RED}]`}></div>
                </div>
            </div>
        );
    }
    
    if (template === 'bk-prayer-modern') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#0f172a] flex flex-col relative overflow-hidden text-white">
                <div className={`absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-[${BK_GREEN}] opacity-20 rounded-full blur-[80px]`}></div>
                <div className={`absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[${BK_RED}] opacity-10 rounded-full blur-[80px]`}></div>
                
                <div className="pt-8 px-8 pb-4 z-10 flex justify-between items-end border-b border-white/10">
                     <div>
                         <div className={`text-xs font-bold text-[${BK_GREEN}] tracking-[0.2em] uppercase mb-1`}>Prayer Schedule</div>
                         <h1 className="text-3xl font-bold text-white mb-2">সালাতের সময়</h1>
                         <div className="flex items-center gap-2 text-gray-400 text-xs">
                             <MapPin size={12} /> {prayerLocation}
                         </div>
                     </div>
                     <div className="pb-2">
                         <Calendar size={24} className="text-white/80" />
                     </div>
                </div>

                <div className="flex-1 px-8 py-4 z-10 flex flex-col justify-center gap-2.5">
                    {[
                        { name: 'ফজর', time: prayerTimes?.fajr, active: false },
                        { name: 'সূর্যোদয়', time: prayerTimes?.sunrise, active: false, accent: true },
                        { name: 'জোহর', time: prayerTimes?.dhuhr, active: true },
                        { name: 'আছর', time: prayerTimes?.asr, active: false },
                        { name: 'মাগরিব', time: prayerTimes?.maghrib, active: false },
                        { name: 'এশা', time: prayerTimes?.isha, active: false },
                    ].map((item, idx) => (
                        <div key={idx} className={`flex justify-between items-center px-4 py-2.5 rounded-lg border transition-all ${item.active ? `bg-[${BK_GREEN}]/20 border-[${BK_GREEN}]` : 'bg-white/5 border-white/5'}`}>
                            <span className={`text-sm font-bold ${item.accent ? 'text-orange-400' : 'text-gray-300'}`}>{item.name}</span>
                            <span className={`text-xl font-bold font-oswald ${item.active ? 'text-white' : item.accent ? 'text-orange-400' : 'text-gray-400'}`}>{item.time}</span>
                        </div>
                    ))}
                </div>

                <div className="px-8 pb-6 z-10">
                    <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                        <div className="flex flex-col text-xs text-gray-400 font-bold gap-1">
                            <span className="text-white">{dayName} | {dateOne}</span>
                            <span>{dateThree} | {dateTwo}</span>
                        </div>
                        <div className="transform scale-75 origin-right brightness-0 invert opacity-80">
                            <BrandHeader customLogo={customLogo} variant="white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-prayer-clean') {
        return (
            <div ref={ref} style={containerStyle} className="bg-white flex flex-col relative overflow-hidden">
                <div className="pt-10 px-10 pb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">নামাজের সময়সূচি</h1>
                    <div className={`w-16 h-1 bg-[${BK_RED}] mx-auto mb-4 rounded-full`}></div>
                    <p className="text-sm font-bold text-gray-500 flex items-center justify-center gap-1">
                        <MapPin size={14} className={`text-[${BK_GREEN}]`} /> {prayerLocation}
                    </p>
                </div>

                <div className="flex-1 px-10 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {[
                            { name: 'ফজর', time: prayerTimes?.fajr },
                            { name: 'সূর্যোদয়', time: prayerTimes?.sunrise, accent: true },
                            { name: 'জোহর', time: prayerTimes?.dhuhr },
                            { name: 'আছর', time: prayerTimes?.asr },
                            { name: 'মাগরিব', time: prayerTimes?.maghrib },
                            { name: 'এশা', time: prayerTimes?.isha },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${item.accent ? 'text-orange-500' : 'text-gray-400'}`}>{item.name}</span>
                                <span className="text-3xl font-bold text-gray-800 font-oswald">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 px-10 py-6 mt-auto flex justify-between items-center">
                     <div>
                         <div className="text-sm font-bold text-gray-900">{dayName}, {dateOne}</div>
                         <div className="text-xs font-medium text-gray-500">{dateThree} • {dateTwo}</div>
                     </div>
                     <div className="transform scale-75 origin-right">
                         <BrandHeader customLogo={customLogo} variant="colored" />
                     </div>
                </div>
            </div>
        );
    }

    if (template === 'bk-prayer-image') {
        return (
            <div ref={ref} style={containerStyle} className="bg-black flex flex-col relative overflow-hidden">
                 <div className="absolute inset-0 z-0">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Prayer" crossOrigin="anonymous"/>
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">Add Mosque Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
                 </div>

                 <div className="relative z-10 w-full h-full flex flex-col p-8">
                      <div className="flex justify-between items-start mb-6 border-b border-white/20 pb-6">
                          <div>
                              <h1 className="text-3xl font-bold text-white mb-1">নামাজের সময়</h1>
                              <p className="text-sm text-gray-300 font-medium flex items-center gap-1">
                                  <MapPin size={12} className={`text-[${BK_RED}]`}/> {prayerLocation}
                              </p>
                          </div>
                          <div className="text-right">
                              <div className={`text-xl font-bold text-[${BK_GREEN}]`}>{dayName}</div>
                              <div className="text-xs text-gray-400">{dateOne}</div>
                          </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-4">
                          {[
                            { name: 'ফজর', time: prayerTimes?.fajr },
                            { name: 'সূর্যোদয়', time: prayerTimes?.sunrise, accent: true },
                            { name: 'জোহর', time: prayerTimes?.dhuhr },
                            { name: 'আছর', time: prayerTimes?.asr },
                            { name: 'মাগরিব', time: prayerTimes?.maghrib },
                            { name: 'এশা', time: prayerTimes?.isha },
                          ].map((item, idx) => (
                             <div key={idx} className={`rounded-xl p-4 flex flex-col items-center justify-center border backdrop-blur-sm ${item.accent ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/10 border-white/10'}`}>
                                 <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${item.accent ? 'text-orange-400' : 'text-gray-300'}`}>{item.name}</div>
                                 <div className="text-2xl font-bold text-white font-oswald">{item.time}</div>
                             </div>
                          ))}
                      </div>

                      <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/10">
                           <div className="text-[10px] text-gray-400 font-bold tracking-wide">
                               {dateThree} | {dateTwo}
                           </div>
                           <div className="transform scale-75 origin-right brightness-0 invert opacity-80">
                               <BrandHeader customLogo={customLogo} variant="white" />
                           </div>
                      </div>
                 </div>
            </div>
        );
    }

    if (template === 'bk-prayer-elegant') {
        return (
            <div ref={ref} style={containerStyle} className="bg-[#fffbf2] p-5 flex flex-col relative overflow-hidden">
                 <div className="w-full h-full border-2 border-[#d4b996] rounded-[2rem] flex flex-col relative bg-white shadow-xl overflow-hidden">
                      {/* Top Decor */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-[#d4b996]"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-[#d4b996] rounded-b-2xl flex items-center justify-center">
                          <Star className="text-white fill-white w-4 h-4" />
                      </div>

                      <div className="pt-12 px-8 pb-4 text-center">
                           <h1 className="text-3xl font-bold text-[#5d4037] mb-2 font-serif">সালাতের সময়সূচি</h1>
                           <div className="flex justify-center items-center gap-2 text-[#8d6e63] text-xs font-bold uppercase tracking-widest">
                               <MapPin size={12} /> {prayerLocation}
                           </div>
                      </div>

                      <div className="flex-1 px-8 py-2 space-y-2">
                           {[
                             { name: 'ফজর', time: prayerTimes?.fajr },
                             { name: 'সূর্যোদয়', time: prayerTimes?.sunrise, accent: true },
                             { name: 'যোহর', time: prayerTimes?.dhuhr },
                             { name: 'আছর', time: prayerTimes?.asr },
                             { name: 'মাগরিব', time: prayerTimes?.maghrib },
                             { name: 'এশা', time: prayerTimes?.isha },
                           ].map((item, idx) => (
                               <div key={idx} className={`flex justify-between items-center px-4 py-2.5 rounded-lg ${item.accent ? 'bg-orange-50' : 'bg-[#fcf8f3]'}`}>
                                    <span className={`text-lg font-serif font-bold ${item.accent ? 'text-orange-800' : 'text-[#5d4037]'}`}>{item.name}</span>
                                    <div className="flex-1 border-b border-dotted border-[#d4b996] mx-4 relative top-1 opacity-50"></div>
                                    <span className={`text-xl font-bold font-oswald ${item.accent ? 'text-orange-600' : 'text-[#8d6e63]'}`}>{item.time}</span>
                               </div>
                           ))}
                      </div>

                      <div className="bg-[#fcf8f3] mt-auto px-8 py-4 border-t border-[#ede0d4] flex justify-between items-center">
                           <div className="flex flex-col">
                               <span className="text-sm font-bold text-[#5d4037]">{dayName}, {dateOne}</span>
                               <span className="text-[10px] font-bold text-[#8d6e63]">{dateThree} • {dateTwo}</span>
                           </div>
                           <div className="transform scale-75 origin-right opacity-80">
                               <BrandHeader customLogo={customLogo} variant="colored" />
                           </div>
                      </div>
                 </div>
            </div>
        );
    }

    return (
        <div ref={ref} style={containerStyle} className="bg-gray-100 flex items-center justify-center">
            Prayer Template Not Found
        </div>
    );
});

export default PrayerCardTemplates;
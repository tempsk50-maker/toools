import React, { forwardRef } from 'react';
import { NewsCardTemplate } from '../../types';
import MorningCardTemplates from './MorningCardTemplates';
import PrayerCardTemplates from './PrayerCardTemplates';
import HadithCardTemplates from './HadithCardTemplates';

interface MorningCanvasProps {
  caption: string;
  dayName: string;
  dateOne: string;
  dateTwo: string;
  dateThree: string;
  images: string[];
  customLogo: string | null;
  template: NewsCardTemplate;
  imageSource?: string;
  // Prayer Props
  prayerLocation?: string;
  prayerTimes?: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  // Hadith Props
  hadithType?: 'Ayah' | 'Hadith';
  hadithArabic?: string;
  hadithBengali?: string;
  hadithSource?: string;
}

const MorningCanvas = forwardRef<HTMLDivElement, MorningCanvasProps>(
  ({ 
    caption,
    dayName,
    dateOne,
    dateTwo,
    dateThree,
    images = [], 
    customLogo, 
    template,
    imageSource,
    prayerLocation,
    prayerTimes,
    hadithType,
    hadithArabic,
    hadithBengali,
    hadithSource
  }, ref) => {
    
    // Determine which sub-component to render based on the template ID prefix
    
    if (template.startsWith('bk-morning-')) {
        return (
            <MorningCardTemplates 
                ref={ref}
                caption={caption}
                dayName={dayName}
                dateOne={dateOne}
                dateTwo={dateTwo}
                dateThree={dateThree}
                images={images}
                customLogo={customLogo}
                template={template}
                imageSource={imageSource}
            />
        );
    }

    if (template.startsWith('bk-prayer-')) {
        return (
            <PrayerCardTemplates 
                ref={ref}
                dayName={dayName}
                dateOne={dateOne}
                dateTwo={dateTwo}
                dateThree={dateThree}
                images={images}
                customLogo={customLogo}
                template={template}
                prayerLocation={prayerLocation}
                prayerTimes={prayerTimes}
            />
        );
    }

    if (template.startsWith('bk-hadith-')) {
        return (
            <HadithCardTemplates 
                ref={ref}
                dayName={dayName}
                dateOne={dateOne}
                dateTwo={dateTwo}
                dateThree={dateThree}
                images={images}
                customLogo={customLogo}
                template={template}
                hadithType={hadithType}
                hadithArabic={hadithArabic}
                hadithBengali={hadithBengali}
                hadithSource={hadithSource}
            />
        );
    }

    // Fallback if no matching prefix found
    return (
        <div ref={ref} style={{ width: '600px', height: '600px' }} className="bg-gray-100 flex items-center justify-center">
            Template Not Found
        </div>
    );
  }
);

export default MorningCanvas;
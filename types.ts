

export interface NewsData {
  headline: string;
  body: string;
  source?: string;
  caption?: string;
}

export enum CardTemplate {
  QUOTE = 'QUOTE',
  HEADLINE = 'HEADLINE'
}

export interface GeneratedContent {
  headline: string;
  body: string;
  caption?: string;
}

export type CardType = 'news' | 'quote' | 'morning';

export type NewsCardTemplate = 
  // --- NEWS DESIGNS ---
  | 'bk-news-classic-light'   // Robi Prime
  | 'bk-news-studio-dark'     // Emerald Slate
  | 'bk-news-corporate-dark'  // Corporate Dark
  | 'bk-news-premium-minimal' // Premium Minimal
  | 'bk-news-elegant-light'   // Elegant Light
  | 'bk-news-focus-red'       // Focus Red
  | 'bk-news-red-headline'    // Red Headline
  | 'bk-news-vibrant-overlay' // Vibrant Overlay
  | 'bk-news-modern-card'     // Modern Card
  | 'bk-news-midnight-impact' // Midnight Impact
  | 'bk-news-elegant-border'  // Elegant Border
  | 'bk-news-royal-green'     // New: Royal Green
  | 'bk-news-dark-studio'     // New: Dark Studio (Red Pill)
  | 'bk-news-classic-center'  // New: Classic Center

  // --- QUOTE TEMPLATES ---
  | 'bk-quote-glass'
  | 'bk-quote-dark-vibe'
  | 'bk-quote-elegant-frame'
  | 'bk-quote-grid-classic'
  | 'bk-quote-red-split'
  | 'bk-quote-sidebar-green'
  
  // --- DAILY/MORNING TEMPLATES ---
  // Morning
  | 'bk-morning-classic'
  | 'bk-morning-modern'
  | 'bk-morning-corporate'
  | 'bk-morning-minimal'
  | 'bk-morning-gradient'
  
  // Prayer
  | 'bk-prayer-classic'
  | 'bk-prayer-modern'
  | 'bk-prayer-clean'
  | 'bk-prayer-image'
  | 'bk-prayer-elegant'
  
  // Hadith
  | 'bk-hadith-classic'
  | 'bk-hadith-modern'
  | 'bk-hadith-box'
  | 'bk-hadith-image'
  | 'bk-hadith-golden'
  | 'bk-hadith-midnight'
  | 'bk-hadith-split'
  | 'bk-hadith-floral';
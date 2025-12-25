import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';

interface StorageItem {
  id: string;
  name: string;
  data: string; // Base64 string
  date: number;
}

interface StorageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageData: string) => void; 
}

const STORAGE_KEY = 'bk_asset_gallery';

const StorageManager: React.FC<StorageManagerProps> = ({ isOpen, onClose, onSelect }) => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadItems = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load gallery", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
  }, [isOpen]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      if (file.size > 500 * 1024) {
        setError("ফাইল সাইজ অনেক বড়। ৫০০ KB এর নিচে রাখার চেষ্টা করুন।");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        
        const newItem: StorageItem = {
          id: Date.now().toString(),
          name: file.name,
          data: base64,
          date: Date.now()
        };

        const updatedItems = [newItem, ...items];
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
          setItems(updatedItems);
        } catch (err) {
           setError("মেমোরি ফুল! কিছু পুরনো ছবি ডিলিট করুন।");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update storage after delete", e);
    }
  };

  const handleClearAll = () => {
    if (confirm("আপনি কি নিশ্চিত আপনি সব সেভ করা ফাইল ডিলিট করতে চান?")) {
      setItems([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("Failed to clear storage", e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bk-surface-light dark:bg-bk-surface-dark w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-colors border border-gray-100 dark:border-bk-border-dark">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-bk-border-dark flex justify-between items-center">
          <div>
             <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
               <ImageIcon className="w-6 h-6 text-bk-green" />
               ফাইল গ্যালারি
             </h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ভবিষ্যতে ব্যবহারের জন্য আপনার অ্যাসেটগুলো এখানে সেভ রাখুন</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-bk-input-dark rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-bk-bg-light/50 dark:bg-bk-bg-dark/50">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center text-sm border border-red-100 dark:border-red-900/50">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            
            {/* Upload Button Card */}
            <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-bk-border-dark rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-bk-green dark:hover:border-bk-green hover:bg-bk-green/5 dark:hover:bg-bk-green/10 transition-all group bg-white dark:bg-bk-input-dark">
              <div className="w-12 h-12 bg-gray-100 dark:bg-bk-surface-dark rounded-full flex items-center justify-center mb-2 group-hover:bg-white dark:group-hover:bg-bk-bg-dark group-hover:text-bk-green transition-colors">
                 <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-bk-green" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">নতুন আপলোড</span>
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleUpload} />
            </label>

            {/* Gallery Items */}
            {items.map((item) => (
              <div key={item.id} className="group relative aspect-square bg-white dark:bg-bk-input-dark rounded-xl border border-gray-200 dark:border-bk-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image Preview */}
                <div className="w-full h-full p-2">
                   <img src={item.data} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                   <button 
                     onClick={() => {
                       onSelect(item.data);
                       onClose();
                     }}
                     className="w-full py-1.5 bg-bk-green text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-600"
                   >
                     <Check className="w-3 h-3" /> ব্যবহার করুন
                   </button>
                   <button 
                     onClick={() => handleDelete(item.id)}
                     className="w-full py-1.5 bg-white text-red-500 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-50"
                   >
                     <Trash2 className="w-3 h-3" /> ডিলিট
                   </button>
                </div>
                
                {/* File Label (hidden on hover) */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-bk-surface-dark/90 px-2 py-1 text-[10px] text-center truncate border-t border-gray-100 dark:border-bk-border-dark group-hover:opacity-0 transition-opacity text-gray-700 dark:text-gray-300">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-600">
                <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                <p>কোনো ফাইল সেভ করা নেই</p>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-bk-border-dark bg-bk-surface-light dark:bg-bk-surface-dark flex justify-between items-center rounded-b-2xl">
           <span className="text-xs text-gray-400 dark:text-gray-500">
             {items.length} টি ফাইল সেভ করা আছে
           </span>
           {items.length > 0 && (
             <button 
               onClick={handleClearAll}
               className="text-red-500 text-sm font-medium hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
             >
               সব মুছে ফেলুন
             </button>
           )}
        </div>

      </div>
    </div>
  );
};

export default StorageManager;
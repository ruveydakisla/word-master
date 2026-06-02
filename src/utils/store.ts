// utils/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordItem } from '@/types';

// 🎯 Rozet Veri Tipi Tanımı
export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;       // Ionicons ikon ismi
  color: string;      // Rozet ikon rengi
  bgColor: string;    // Rozet arka plan rengi
  isUnlocked: boolean;
}

// ⚙️ Store Durum ve Fonksiyon Tipleri
interface WordState {
  wordPool: WordItem[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  badges: BadgeItem[];
  
  // 🧭 Ayarlar Ekranı İçin Geri Eklenen Tipler
  remindersEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  
  addWord: (word: WordItem) => void;
  removeWord: (id: string) => void;
  clearWordPool: () => void; // 🎯 Havuzu temizleme fonksiyon tipi
  addXp: (amount: number) => void;
  checkAndUpdateStreak: () => void;
  checkBadges: () => void;
  
  // 🎯 Ayar Değiştirici Fonksiyon Tipleri
  setRemindersEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
}

// Başlangıç rozet senaryoları
const initialBadges: BadgeItem[] = [
  { id: 'first_word', title: 'İlk Adım', description: 'Havuza ilk kelimeni ekledin.', icon: 'bookmark', color: '#3b82f6', bgColor: 'bg-blue-50', isUnlocked: false },
  { id: 'word_collector', title: 'Kelime Avcısı', description: 'Havuzda 10 kelimeye ulaştın.', icon: 'folder-open', color: '#10b981', bgColor: 'bg-emerald-50', isUnlocked: false },
  { id: 'quiz_master', title: 'Kusursuz Bitiriş', description: 'Bir quiz alıştırmasından tam puan aldın.', icon: 'trophy', color: '#f59e0b', bgColor: 'bg-amber-50', isUnlocked: false },
  { id: 'xp_warrior', title: 'Bilgi Küpü', description: 'Toplamda 500 XP barajını aştın.', icon: 'school', color: '#8b5cf6', bgColor: 'bg-purple-50', isUnlocked: false },
];

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      wordPool: [],
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      badges: initialBadges,

      // ⚙️ Ayarlar İçin Başlangıç Değerleri (Default: true)
      remindersEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,

      addWord: (word) => {
        const exists = get().wordPool.some((w) => w.eng.toLowerCase() === word.eng.toLowerCase());
        if (exists) return;

        set((state) => ({ 
          wordPool: [word, ...state.wordPool],
          xp: state.xp + 10 
        }));
        
        get().checkBadges();
      },

      removeWord: (id) => set((state) => ({
        wordPool: state.wordPool.filter((w) => w.id !== id),
      })),

      // 🗑️ Tüm Havuzu Temizleme Fonksiyonu
      clearWordPool: () => set({ wordPool: [] }),

      addXp: (amount) => {
        set((state) => ({ xp: state.xp + amount }));
        get().checkBadges();
      },

      // 🔄 Ayar Durumlarını Güncelleyen Tetikleyiciler
      setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),

      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastActiveDate;
        const currentStreak = get().streak;

        if (!lastDate) {
          set({ streak: 1, lastActiveDate: today });
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastDate === today) {
          return;
        } else if (lastDate === yesterdayString) {
          set({ streak: currentStreak + 1, lastActiveDate: today });
        } else {
          set({ streak: 1, lastActiveDate: today });
        }
      },

      // 🔥 ROZET KİLİT AÇMA ALGORİTMASI
      checkBadges: () => {
        const { wordPool, xp, badges } = get();
        let updated = false;

        const newBadges = badges.map((badge) => {
          if (badge.isUnlocked) return badge;

          let shouldUnlock = false;

          if (badge.id === 'first_word' && wordPool.length >= 1) shouldUnlock = true;
          if (badge.id === 'word_collector' && wordPool.length >= 10) shouldUnlock = true;
          if (badge.id === 'xp_warrior' && xp >= 500) shouldUnlock = true;

          if (shouldUnlock) {
            updated = true;
            return { ...badge, isUnlocked: true };
          }
          return badge;
        });

        if (updated) {
          set({ badges: newBadges });
        }
      },
    }),
    {
      name: 'word-master-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
// app/match-game.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWordStore } from '@/utils/store';

const { width } = Dimensions.get('window');

interface MatchCard {
  id: string;      // Benzersiz render ID'si (Kelime havuzdan tekrar gelirse çakışmasın diye)
  wordId: string;  // Eşleşme kontrolü için gerçek kelime ID'si
  text: string;    // Kart üstü yazısı
  type: 'eng' | 'tr';
}

export default function MatchGameScreen() {
  const router = useRouter();
  const { wordPool, addXp } = useWordStore();

  // --- OYUN AKIŞ STATE'LERİ ---
  const [waitingWords, setWaitingWords] = useState<any[]>([]); // Sırada bekleyen kelime havuzu
  const [activeCards, setActiveCards] = useState<MatchCard[]>([]); // Ekranda aktif basılı 6 kart
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [completedWordCount, setCompletedWordCount] = useState<number>(0); // Toplam bilinen kelime sayısı
  const [moves, setMoves] = useState<number>(0);

  // --- ANIMASYON REFLERİ ---
  // Ekranda 6 indeks olacağı için her bir yuva için ayrı opaklık (Opacity) ref'i tutuyoruz
  const fadeAnims = useRef([
    new Animated.Value(1), new Animated.Value(1), new Animated.Value(1),
    new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)
  ]).current;

  // Toplam oynanacak çift sayısı (Havuzun tamamı)
  const totalPairs = wordPool.length;

  // --- OYUN BAŞLANGICI ---
  useEffect(() => {
    if (wordPool.length < 4) {
      Alert.alert('Oyun Kilitli 🔒', 'Eşleştirme oyunu için havuzunda en az 4 kelime olmalı!');
      router.back();
      return;
    }

    // Havuzdaki tüm kelimeleri karıştırıp sıraya koyalım
    const shuffledPool = [...wordPool].sort(() => 0.5 - Math.random());
    
    // İlk 3 kelimeyi (6 kart) sahneye alalım, kalanları yedek sıraya koyalım
    const startingWords = shuffledPool.slice(0, 3);
    const initialWaiting = shuffledPool.slice(3);

    const engCards: MatchCard[] = startingWords.map(w => ({ id: `${w.id}_eng_${Date.now()}`, wordId: w.id, text: w.eng, type: 'eng' }));
    const trCards: MatchCard[] = startingWords.map(w => ({ id: `${w.id}_tr_${Date.now()}`, wordId: w.id, text: w.tr, type: 'tr' }));
    const shuffledInitialCards = [...engCards, ...trCards].sort(() => 0.5 - Math.random());

    setActiveCards(shuffledInitialCards);
    setWaitingWords(initialWaiting);
  }, []);

  // --- KART SEÇİM MOTORU ---
  const handleCardPress = (card: MatchCard) => {
    if (selectedCards.some(c => c.id === card.id)) return;
    if (selectedCards.length >= 2) return;

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newSelection;

      // DOĞRU EŞLEŞME KONTROLÜ
      if (first.wordId === second.wordId && first.type !== second.type) {
        
        // Eşleşen kartların ekrandaki indekslerini bulalım (Hangi yuvalar fade-out olacak?)
        const idx1 = activeCards.findIndex(c => c.id === first.id);
        const idx2 = activeCards.findIndex(c => c.id === second.id);

        setTimeout(() => {
          // 1. ADIM: Doğru eşleşen 2 kartı yumuşakça yok et (Fade Out)
          Animated.parallel([
            Animated.timing(fadeAnims[idx1], { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeAnims[idx2], { toValue: 0, duration: 300, useNativeDriver: true })
          ]).start(() => {
            
            // Bilinen kelime sayısını bir artır
            const newCompletedCount = completedWordCount + 1;
            setCompletedWordCount(newCompletedCount);

            // Oyun tamamen bitti mi? (Ekranda kart kalmadı ve sırada bekleyen yoksa)
            if (waitingWords.length === 0 && newCompletedCount === totalPairs) {
              const earnedXp = totalPairs * 15;
              addXp(earnedXp);
              Alert.alert(
                'Matrix Tamamlandı! 🏆',
                `Havuzundaki tüm kelimeleri sırayla akıtarak ${moves + 1} hamlede erittin!\n\n🏅 Kazandığın: +${earnedXp} XP`,
                [{ text: 'Harika!', onPress: () => router.back() }]
              );
              return;
            }

            // Sırada bekleyen kelime var mı kontrol et
            const currentWaiting = [...waitingWords];
            let nextCard1: MatchCard | null = null;
            let nextCard2: MatchCard | null = null;

            if (currentWaiting.length > 0) {
              const nextWord = currentWaiting.shift(); // Sıradaki ilk kelimeyi çek
              setWaitingWords(currentWaiting);

              const timestamp = Date.now();
              nextCard1 = { id: `${nextWord.id}_eng_${timestamp}`, wordId: nextWord.id, text: nextWord.eng, type: 'eng' };
              nextCard2 = { id: `${nextWord.id}_tr_${timestamp}`, wordId: nextWord.id, text: nextWord.tr, type: 'tr' };
            }

            // Sahneyi güncelle (Giden kartların yerine yenisini koy, yoksa boşalt)
            setActiveCards(prev => {
              const updated = [...prev];
              
              // Eğer yeni kelime varsa yerlerine koy, yoksa o yuvayı gizlemek için null/boş ata
              if (nextCard1 && nextCard2) {
                // Rastgele dağıtmak için 50% şansla yerleştir
                if (Math.random() > 0.5) {
                  updated[idx1] = nextCard1;
                  updated[idx2] = nextCard2;
                } else {
                  updated[idx1] = nextCard2;
                  updated[idx2] = nextCard1;
                }
              } else {
                // Havuz bittiyse kartları sahnede sök ama grid yapısı bozulmasın diye yer tutucu bırak
                updated[idx1] = { id: `empty_${idx1}`, wordId: '', text: '', type: 'eng' };
                updated[idx2] = { id: `empty_${idx2}`, wordId: '', text: '', type: 'tr' };
              }
              return updated;
            });

            setSelectedCards([]);

            // 2. ADIM: Yeni gelen kartları parlatarak ekrana getir (Fade In)
            Animated.parallel([
              Animated.timing(fadeAnims[idx1], { toValue: 1, duration: 400, useNativeDriver: true }),
              Animated.timing(fadeAnims[idx2], { toValue: 1, duration: 400, useNativeDriver: true })
            ]).start();

          });
        }, 300);

      } else {
        // YANLIŞ EŞLEŞME: Kartları kırmızı göster, 800ms sonra seçimleri temizle
        setTimeout(() => {
          setSelectedCards([]);
        }, 850);
      }
    }
  };

  // İlerleme yüzdesi hesabı
  const progressPercent = totalPairs > 0 ? (completedWordCount / totalPairs) * 100 : 0;

  return (
<LinearGradient
  colors={['#090d16', '#0f172a', '#1e1b4b']} // Derin uzay / Gece mavisi ve hafif morumsu lacivert geçişi
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  className="flex-1 p-5 pt-14"
>
  
  {/* Arka Plan Canlı Parlama Efektleri */}
  <View className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
    <View className="absolute top-[-50px] -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
    <View className="absolute bottom-20 right-[-50px] w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
  </View>

  {/* Üst Kontrol Paneli */}
  <View className="flex-row justify-between items-center mb-5 z-10">
    <TouchableOpacity 
      onPress={() => router.back()} 
      className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 active:scale-95"
    >
      <Ionicons name="chevron-back" size={20} color="#f8fafc" />
    </TouchableOpacity>

    <View className="items-center">
      <Text className="text-white font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">
        Sonsuz Akış
      </Text>
      <Text className="text-slate-400 text-xs font-bold mt-0.5">Eşleşen Gider, Yeni Gelir</Text>
    </View>

    <View className="px-4 py-2.5 rounded-2xl border border-cyan-500/40 bg-slate-900/50">
      <Text className="text-cyan-400 font-black text-xs uppercase tracking-wider">Hamle: {moves}</Text>
    </View>
  </View>

  {/* Canlı İlerleme Çubuğu */}
  <View className="mb-8 z-10">
    <View className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex-row items-center justify-between shadow-xl shadow-black/20">
      <View className="flex-1 mr-4">
        <View className="flex-row justify-between mb-1.5 px-0.5">
          <Text className="text-xs font-bold text-slate-400">Eritilen Kelimeler</Text>
          <Text className="text-xs font-black text-pink-400">{completedWordCount} / {totalPairs}</Text>
        </View>
        <View className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
          <View 
            style={{ width: `${progressPercent}%` }} 
            className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full"
          />
        </View>
      </View>
      <View className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
        <MaterialCommunityIcons name="layers-outline" size={20} color="#ec4899" />
      </View>
    </View>
  </View>

  {/* 🎮 6 BÜYÜK KART ALANI */}
 {/* 🎮 6 BÜYÜK KART ALANI */}
<View className="flex-row flex-wrap justify-between gap-4 z-10">
  {activeCards.map((card, index) => {
    if (card.wordId === '') {
      return <View key={`empty_space_${index}`} style={{ width: (width - 56) / 2, height: 200 }} className="opacity-0" />;
    }

    const isSelected = selectedCards.some(c => c.id === card.id);
    const hasTwoSelected = selectedCards.length === 2;
    
    // 🧠 Eşleşme Durum Kontrolleri
    const isCorrectMatch = hasTwoSelected && 
      selectedCards[0].wordId === selectedCards[1].wordId && 
      selectedCards[0].type !== selectedCards[1].type;

    const isWrong = hasTwoSelected && !isCorrectMatch && isSelected;
    const isCorrect = hasTwoSelected && isCorrectMatch && isSelected;

    // 🎨 DINAMIK TEMALANDIRMA
  let cardBg: readonly [string, string, ...string[]] = ['#1e293b', '#0f172a'] as const;
let borderStyle = "border-cyan-500/20 shadow-lg shadow-black/40 border-b-4";
let textStyle = "text-slate-200 font-black text-lg";

if (isCorrect) {
  // 🟢 Doğru Eşleşme
  cardBg = ['#10b981', '#065f46'] as const; 
  borderStyle = "border-emerald-400 scale-[0.96] shadow-xl shadow-emerald-900/40 border-b-4";
  textStyle = "text-white font-black text-lg tracking-wide";
} else if (isWrong) {
  // 🔴 Yanlış Eşleşme
  cardBg = ['#ef4444', '#7f1d1d'] as const;
  borderStyle = "border-red-500 scale-95 border-b-4";
  textStyle = "text-red-100 font-black text-lg";
} else if (isSelected) {
  // 🟣 Seçili Durum
  cardBg = ['#d946ef', '#4c1d95'] as const;
  borderStyle = "border-fuchsia-400 scale-[0.96] shadow-xl shadow-fuchsia-900/40 border-b-4";
  textStyle = "text-white font-black text-lg tracking-wide";

    }

    return (
      <Animated.View
        key={card.id}
        style={{ 
          width: (width - 56) / 2, 
          height: 200, 
          opacity: fadeAnims[index]
        }}
      >
        <TouchableOpacity
          onPress={() => handleCardPress(card)}
          activeOpacity={0.85}
          className="w-full h-full rounded-3xl overflow-hidden"
        >
          <LinearGradient
            colors={cardBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`w-full h-full p-5 items-center justify-center ${borderStyle}`}
          >
            {/* Kart Türü İndikatörü */}
            <View className="absolute top-4 left-4 opacity-40">
              <MaterialCommunityIcons 
                name={card.type === 'eng' ? 'alpha-e-box' : 'alpha-t-box'} 
                size={18} 
                color={isSelected ? "#ffffff" : "#94a3b8"} 
              />
            </View>

            {/* Kelime Metni */}
            <Text 
              numberOfLines={3}
              className={`text-center capitalize px-1 tracking-wide leading-6 ${textStyle}`}
            >
              {card.text}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  })}
</View>
</LinearGradient>
  );
}
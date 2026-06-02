// app/quiz-result.tsx
import React from 'react';
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function QuizResultScreen() {
  const router = useRouter();
  
  // URL parametrelerinden gelen verileri yakalıyoruz
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();
  
  const numericScore = parseInt(score || '0', 10);
  const numericTotal = parseInt(total || '0', 10);
  const successRate = numericTotal > 0 ? Math.round((numericScore / numericTotal) * 100) : 0;

  const handleClose = () => {
    // Ana kelime listesine güvenli bir şekilde geri döner
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl items-center border border-gray-100/50">
        <View className="bg-amber-100 p-4 rounded-full mb-4 shadow-sm">
          <Ionicons name="trophy" size={56} color="#ffd700" />
        </View>
        
        <Text className="text-2xl font-black text-cello tracking-tight">Alıştırma Bitti!</Text>
        <Text className="text-gray-400 text-sm mt-1 text-center font-medium">Performans raporun hazır.</Text>
        
        {/* Skor Kartı */}
        <View className="bg-brightChrome w-full rounded-2xl p-5 my-6 items-center border border-gray-100">
          <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Toplam Skor</Text>
          <Text className="text-4xl font-black text-cello">
            {numericScore} <Text className="text-gray-400 text-xl font-bold">/ {numericTotal}</Text>
          </Text>
          <View className="bg-secondary/10 px-4 py-1.5 rounded-full mt-3">
            <Text className="text-xs font-bold text-secondary">
              Başarı Oranı: %{successRate}
            </Text>
          </View>
        </View>

        {/* Aksiyon Butonları */}
        <TouchableOpacity 
          activeOpacity={0.9}
          className="bg-cello w-full py-4 rounded-2xl items-center shadow-md mb-3 active:scale-[0.98]" 
          onPress={() => router.replace('/quiz')}
        >
          <Text className="text-white font-extrabold text-base tracking-wide">Yeniden Başlat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8}
          className="w-full py-3.5 items-center bg-gray-100 rounded-2xl active:scale-[0.98]" 
          onPress={handleClose}
        >
          <Text className="text-gray-600 font-bold text-sm tracking-wide">Kelimelerime Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
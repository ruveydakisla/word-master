// app/(tabs)/badges.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BadgesPanel } from '@/components/BadgesPanel';
import { useWordStore } from '@/utils/store';

export default function BadgesScreen() {
  const { xp, wordPool } = useWordStore();

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Arka plan dekoratif neon parıltıları */}
      <View className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <View className="absolute top-[-40px] -right-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <View className="absolute bottom-10 left-[-30px] w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
      </View>

      <ScrollView className="flex-1 p-5 pt-14 z-10" showsVerticalScrollIndicator={false}>
        
        {/* 👑 Üst Başlık */}
        <View className="mb-6 px-1">
          <View className="bg-purple-500/10 px-2.5 py-1 rounded-md self-start mb-1.5 border border-purple-500/10">
            <Text className="text-[9px] font-black text-purple-700 uppercase tracking-widest">
              GELİŞİM VE OYUNLAŞTIRMA
            </Text>
          </View>
          <Text className="text-3xl font-black text-cello tracking-tight">
            Başarılarım
          </Text>
        </View>

        {/* 📊 Hızlı İstatistik Kartları */}
        <View className="flex-row justify-between mb-5 px-1" style={{ gap: 12 }}>
          <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
            <View className="bg-amber-100 p-2.5 rounded-xl">
              <Ionicons name="flash" size={20} color="#d97706" />
            </View>
            <View className="ml-3">
              <Text className="text-xs font-bold text-gray-400">Toplam XP</Text>
              <Text className="text-lg font-black text-cello">{xp}</Text>
            </View>
          </View>

          <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
            <View className="bg-blue-100 p-2.5 rounded-xl">
              <Ionicons name="star" size={20} color="#2563eb" />
            </View>
            <View className="ml-3">
              <Text className="text-xs font-bold text-gray-400">Öğrenilen</Text>
              <Text className="text-lg font-black text-cello">{wordPool.length} Kelime</Text>
            </View>
          </View>
        </View>

        {/* 🏅 Rozetler Listesi */}
        <View className="pb-10">
          <BadgesPanel />
        </View>

      </ScrollView>
    </View>
  );
}
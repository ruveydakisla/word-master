// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // 🎯 Yeni eklenen kütüphane
import { SearchBar, WordDetailModal, WordCard } from '@/components';
import { useHomeLogic } from '@/hooks/useHomeLogic';
import { useWordStore } from '@/utils/store'; // Store'u bağla
export default function HomeScreen() {
  const {
    searchWord,
    setSearchWord,
    loading,
    pageReady,
    randomWord,
    selectedWord,
    modalVisible,
    isNewSearch,
    setModalVisible,
    handleSearch,
    handleRandomCardPress,
    handleAddWord,
    pickRandomWord,
  } = useHomeLogic();
  const checkAndUpdateStreak = useWordStore((state) => state.checkAndUpdateStreak);
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);
  if (!pageReady || !randomWord) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8fafc]">
        <ActivityIndicator size="large" color="#1e3d59" />
        <Text className="mt-3 text-sm font-bold tracking-wide text-cello/60">
          Sihirli Kelimeler Yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Arka plan dekoratif neon daireler */}
      <View className="pointer-events-none absolute bottom-0 left-0 right-0 top-0">
        <View className="absolute left-1/4 top-[-50px] h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
        <View className="absolute -right-20 top-[150px] h-60 w-60 rounded-full bg-emerald-200/20 blur-3xl" />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="z-10">
        <View className="flex-1 justify-between p-5 pb-8 pt-14">
          {/* 👑 1. KATMAN: Üst Alan */}
          <View className="mb-6 w-full">
            <View className="mb-5 flex-row items-center justify-between px-1">
              <View>
                <View className="mb-1.5 self-start rounded-md bg-purple-100 px-2.5 py-1">
                  <Text className="text-[9px] font-black uppercase tracking-widest text-purple-700">
                    LEVEL UP YOUR ENGLISH
                  </Text>
                </View>
                <Text className="text-3xl font-black tracking-tight text-cello">
                  Word<Text className="text-secondary">Master</Text>
                </Text>
              </View>

              {/* Üst Sağ Buton: İçerisinde LinearGradient kullandık */}
              <TouchableOpacity activeOpacity={0.8} className="active:scale-95">
                <LinearGradient
                  colors={['#1e3d59', '#2b5884']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl border border-white/10 p-3.5 shadow-md">
                  <Ionicons name="flash" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Arama Çubuğu */}
            <View className="rounded-2xl bg-white/90 shadow-lg shadow-cello/5">
              <SearchBar
                value={searchWord}
                onChangeText={setSearchWord}
                onSearch={handleSearch}
                loading={loading}
              />
            </View>
          </View>

          {/* 🔮 2. KATMAN: Orta Alan (Keşif Sahnesi) */}
          <View className="my-4 w-full flex-1 items-center justify-center py-4">
            {/* Canlı Sinyal Rozeti */}
            <View className="mb-5 flex-row items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 shadow-sm">
              <View className="mr-2.5 h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-black uppercase tracking-widest text-emerald-700">
                ✨ GÜNÜN PARLAYAN KELİMESİ
              </Text>
            </View>

            {/* Kelime Kartı: Gradyan Çerçeve Efektini LinearGradient ile Veriyoruz */}
            <View className="w-full max-w-sm overflow-hidden rounded-[26px] shadow-2xl shadow-cello/10">
              <LinearGradient
                colors={['#a855f7', '#1e3d59', '#34d399']} // purple-500, cello, emerald-400
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-[3px]">
                <View className="min-h-[160px] justify-center overflow-hidden rounded-[23px] bg-white">
                  <WordCard word={randomWord} onPress={handleRandomCardPress} />
                </View>
              </LinearGradient>
            </View>

            {/* Oyunlaştırılmış Zar Butonu */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-8 overflow-hidden rounded-2xl shadow-xl shadow-purple-600/15 active:scale-[0.96]"
              onPress={pickRandomWord}>
              <LinearGradient
                colors={['#1e3d59', '#7c3aed']} // cello -> purple-600
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // Yatay geçiş
                className="flex-row items-center px-7 py-3.5">
                <View className="mr-2.5 rounded-xl bg-white/20 p-1.5">
                  <Ionicons name="dice" size={16} color="#fff" />
                </View>
                <Text className="text-sm font-black tracking-wide text-white">Yeni Kelime At</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 📑 3. KATMAN: Detay Modalı */}
      <WordDetailModal
        visible={modalVisible}
        word={selectedWord}
        onClose={() => setModalVisible(false)}
        showAddButton={isNewSearch}
        onAdd={handleAddWord}
      />
    </View>
  );
}

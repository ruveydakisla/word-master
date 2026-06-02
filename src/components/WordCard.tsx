import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useWordStore } from '@/utils/store'; // 🎯 Havuz kontrolü için store import edildi
import { WordItem } from '@/types';

interface WordCardProps {
  // WordItem tipini kullanarak store ile tam uyum sağlıyoruz
  word: WordItem; 
  onPress: () => void;
}

export function WordCard({ word, onPress }: WordCardProps) {
  // Store'dan kelime havuzunu ve ekleme fonksiyonunu çekiyoruz
  const wordPool = useWordStore((state) => state.wordPool);
  const addWord = useWordStore((state) => state.addWord);

  // Bu kelime zaten havuzda var mı kontrolü
  const isAlreadyInPool = wordPool.some((w) => w.eng.toLowerCase() === word.eng.toLowerCase());

  // 🗣️ Seslendirme Fonksiyonu
  const speak = (event: any) => {
    event.stopPropagation(); // ⚠️ Karta tıklama eylemini (modalı) engeller
    Speech.speak(word.eng, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85,
    });
  };

  // 📥 Havuza Ekleme Fonksiyonu
  const handleAddToPool = (event: any) => {
    event.stopPropagation(); // ⚠️ Karta tıklama eylemini (modalı) engeller
    if (!isAlreadyInPool) {
      addWord(word);
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9} 
      className="w-full p-6 bg-white rounded-3xl"
    >
      {/* ÜST SATIR: Kategori Rozeti ve Aksiyon Butonları */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {word.partOfSpeech ? `[${word.partOfSpeech}]` : 'Kelimeni Keşfet'}
        </Text>
        
        {/* Buton Grubu */}
        <View className="flex-row items-center space-x-2" style={{ gap: 8 }}>
          
          {/* 🔊 SES BUTONU */}
          <TouchableOpacity 
            onPress={speak} 
            className="bg-purple-100 p-2.5 rounded-xl active:scale-90"
          >
            <Ionicons name="volume-high" size={18} color="#7c3aed" />
          </TouchableOpacity>

          {/* 📥 HAVUZA EKLE / EKLENDİ BUTONU */}
          <TouchableOpacity 
            onPress={handleAddToPool}
            disabled={isAlreadyInPool}
            className={`p-2.5 rounded-xl active:scale-90 ${
              isAlreadyInPool ? 'bg-emerald-50 border border-emerald-200/50' : 'bg-emerald-500'
            }`}
          >
            <Ionicons 
              name={isAlreadyInPool ? "checkmark" : "add"} 
              size={18} 
              color={isAlreadyInPool ? "#10b981" : "#fff"} 
            />
          </TouchableOpacity>

        </View>
      </View>

      {/* ORTA SATIR: Kelime Metni */}
      <Text className="text-3xl font-black text-cello capitalize tracking-tight mb-1">
        {word.eng}
      </Text>
      
      {/* ALT SATIR: Bilgilendirme ve Durum Etiketi */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-gray-400 font-medium text-xs">
          Dokun ve Detayları Gör
        </Text>
        
        {isAlreadyInPool && (
          <Text className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
            Havuzunda Var ✨
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech'; // 🎯 Telaffuz kütüphanesi eklendi
import { ApiResponse } from '@/types';

interface ResultCardProps {
  data: ApiResponse & { turkishDefinition?: string };
  onAdd: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onAdd }) => {
  
  // 🗣️ Kelimeyi seslendiren fonksiyon
  const handleSpeak = () => {
    Speech.speak(data.word, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85, // Jürinin net duyması için hafifçe yavaşlatılmış akıcı tempo
    });
  };

  return (
    <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xl shadow-cello/5 mb-5">
      
      {/* Üst Kısım: Kelime, Fonetik ve Ses Butonu */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center flex-wrap">
            <Text className="text-2xl font-black text-cello capitalize mr-3">
              {data.word}
            </Text>
            
            {/* 🔊 SESLİ TELAFFUZ BUTONU */}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={handleSpeak}
              className="bg-purple-100 p-2 rounded-xl active:scale-90"
            >
              <Ionicons name="volume-high" size={16} color="#7c3aed" />
            </TouchableOpacity>
          </View>
          
          {data.phonetic && (
            <Text className="text-xs text-gray-400 italic mt-1">{data.phonetic}</Text>
          )}
        </View>

        {/* Kelime Türü Rozeti (Noun, Verb vb.) */}
        {data.meanings[0]?.partOfSpeech && (
          <View className="bg-cello/10 px-2.5 py-1 rounded-md border border-cello/5">
            <Text className="text-[10px] font-black text-cello uppercase tracking-wider">
              {data.meanings[0].partOfSpeech}
            </Text>
          </View>
        )}
      </View>
      
      {/* 🇬🇧 İngilizce Tanım Bloku */}
      <View className="bg-gray-50 p-3.5 rounded-2xl mb-3 border border-gray-100">
        <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
          ENGLISH DEFINITION
        </Text>
        <Text className="text-gray-600 text-sm font-medium leading-relaxed">
          {data.meanings[0]?.definitions[0]?.definition || 'Definition not found.'}
        </Text>
      </View>

      {/* 🇹🇷 Türkçe Tanım Bloku */}
      {data.turkishDefinition && (
        <View className="bg-emerald-50/50 p-3.5 rounded-2xl mb-4 border border-emerald-100/50">
          <Text className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
            TÜRKÇE ANLAMI
          </Text>
          <Text className="text-secondary text-sm font-bold">
            {data.turkishDefinition}
          </Text>
        </View>
      )}

      {/* Havuza Ekleme Butonu */}
      <TouchableOpacity 
        activeOpacity={0.85}
        className="bg-secondary p-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-secondary/20 active:scale-[0.98]"
        onPress={onAdd}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text className="text-white font-extrabold text-sm ml-2 tracking-wide">
          Bu Kelimeyi Havuzuma Ekle
        </Text>
      </TouchableOpacity>
    </View>
  );
};
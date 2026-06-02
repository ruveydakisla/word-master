import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech'; // 🎯 Telaffuz kütüphanesi eklendi
import { WordItem } from '@/types';

interface WordDetailModalProps {
  visible: boolean;
  word: WordItem | null;
  onClose: () => void;
  showAddButton?: boolean; 
  onAdd?: () => void;      
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({ 
  visible, 
  word, 
  onClose, 
  showAddButton = false, 
  onAdd 
}) => {

  // 🗣️ Kelimeyi seslendiren fonksiyon
  const handleSpeak = () => {
    if (word?.eng) {
      Speech.speak(word.eng, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.85, // Akıcı ve anlaşılır tempo
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        {/* Kapatmak için arka plana tıklama hissi */}
        <TouchableOpacity 
          className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none" 
          onPress={onClose} 
        />

        <View className="bg-white rounded-t-[32px] p-6 shadow-2xl pb-10 z-10 border-t border-gray-100">
          {/* Üst Tutamaç Çizgisi (BottomSheet Hissiyatı) */}
          <View className="items-center mb-5">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </View>

          {word && (
            <View>
              {/* 👑 Kelime Başlığı, Ses İkonu ve Türü */}
              <View className="flex-row justify-between items-center mb-5">
                <View className="flex-row items-center flex-1 pr-2 flex-wrap">
                  <Text className="text-3xl font-black text-cello capitalize mr-3 tracking-tight">
                    {word.eng}
                  </Text>
                  
                  {/* 🔊 TELAFFUZ BUTONU */}
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={handleSpeak}
                    className="bg-purple-100 p-2.5 rounded-xl active:scale-90"
                  >
                    <Ionicons name="volume-high" size={18} color="#7c3aed" />
                  </TouchableOpacity>
                </View>

                {/* Kelime Türü Rozeti */}
                {word.partOfSpeech && (
                  <View className="bg-cello/10 px-3 py-1 rounded-md border border-cello/5">
                    <Text className="text-xs font-black text-cello uppercase tracking-wider">
                      {word.partOfSpeech}
                    </Text>
                  </View>
                )}
              </View>

              {/* 🇹🇷 Türkçe Anlamı Kartı */}
              <View className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                <Text className="text-[10px] text-gray-400 font-black mb-1.5 uppercase tracking-widest">
                  TÜRKÇE ANLAMI
                </Text>
                <Text className="text-cello text-base font-bold leading-5">
                  {word.tr}
                </Text>
              </View>

              {/* 📝 Örnek Cümle Kartı (Solu Renkli Şeritli Premium Tasarım) */}
              {word.example && (
                <View className="bg-emerald-50/30 p-4 rounded-2xl mb-6 border-l-4 border-secondary/70">
                  <Text className="text-[10px] text-emerald-700 font-black mb-1.5 uppercase tracking-widest">
                    ÖRNEK CÜMLE (EXAMPLE)
                  </Text>
                  <Text className="text-gray-700 text-base italic font-medium leading-relaxed">
                    "{word.example}"
                  </Text>
                </View>
              )}

              {/* ⚙️ Alt Etkileşim Butonları */}
              {showAddButton && onAdd ? (
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
              ) : (
                <TouchableOpacity 
                  activeOpacity={0.85}
                  className="bg-cello p-4 rounded-2xl items-center justify-center shadow-lg shadow-cello/10 active:scale-[0.98]"
                  onPress={onClose}
                >
                  <Text className="text-white font-extrabold text-sm tracking-wide">
                    Anladım, Kapat!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
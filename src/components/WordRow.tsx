import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordItem } from '@/types';

interface WordRowProps {
  item: WordItem;
  onPress: () => void; // Tıklama fonksiyonunu prop olarak aldık
}

export const WordRow: React.FC<WordRowProps> = ({ item, onPress }) => {
  return (
    // View yerine TouchableOpacity kullanarak tüm satırı tıklanabilir yaptık
    <TouchableOpacity 
      className="bg-white p-4 rounded-xl mb-3 border-l-4 border-primary shadow-sm flex-row justify-between items-center active:opacity-70"
      onPress={onPress}
    >
      <View className="flex-1 pr-3">
        <View className="flex-row items-center space-x-2">
          <Text className="text-lg font-bold text-primary capitalize">{item.eng}</Text>
          <Text className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-2 capitalize">
            {item.partOfSpeech}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {item.tr}
        </Text>
      </View>
      <View className="p-2 bg-gray-50 rounded-full">
        <Ionicons name="chevron-forward" size={18} color="#1e3d59" />
      </View>
    </TouchableOpacity>
  );
};
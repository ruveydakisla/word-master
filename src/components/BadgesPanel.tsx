import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWordStore } from '@/utils/store';

export function BadgesPanel() {
  const badges = useWordStore((state) => state.badges);

  return (
    <View className="w-full mt-4 bg-white p-5 rounded-3xl shadow-lg shadow-cello/5 border border-gray-100">
      {/* Panel Başlığı */}
      <View className="flex-row items-center mb-4">
        <Ionicons name="ribbon-outline" size={20} color="#1e3d59" />
        <Text className="text-lg font-black text-cello ml-2 tracking-tight">
          Başarı Rozetleri
        </Text>
      </View>

      {/* Rozet Kartları Kafesi (Dikey Liste) */}
      <View className="space-y-3" style={{ gap: 12 }}>
        {badges.map((badge) => (
          <View 
            key={badge.id} 
            className={`flex-row items-center p-3.5 rounded-2xl border ${
              badge.isUnlocked 
                ? 'bg-white border-gray-100' 
                : 'bg-gray-50/50 border-gray-100 opacity-50'
            }`}
          >
            {/* İkon Yuvası */}
            <View 
              className={`p-3 rounded-xl items-center justify-center ${
                badge.isUnlocked ? badge.bgColor : 'bg-gray-200'
              }`}
            >
              <Ionicons 
                name={badge.isUnlocked ? (badge.icon as any) : 'lock-closed'} 
                size={22} 
                color={badge.isUnlocked ? badge.color : '#9ca3af'} 
              />
            </View>

            {/* Metin Detayları */}
            <View className="flex-1 ml-4">
              <View className="flex-row items-center justify-between">
                <Text className={`font-black text-sm ${badge.isUnlocked ? 'text-cello' : 'text-gray-400'}`}>
                  {badge.title}
                </Text>
                {badge.isUnlocked && (
                  <Text className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                    Açıldı ✨
                  </Text>
                )}
              </View>
              <Text className="text-gray-400 text-xs font-medium mt-0.5 leading-4">
                {badge.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
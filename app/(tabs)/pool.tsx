// app/(tabs)/pool.tsx
import React, { useState } from 'react';
import { Text, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { WordItem } from '@/types';
import { WordRow, WordDetailModal } from '@/components';
import { useWordStore } from '@/utils/store';

export default function PoolScreen() {
  const router = useRouter();
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  
  // 🎯 Store'dan havuzu ve silme fonksiyonunu çekiyoruz
  const wordPool = useWordStore((state) => state.wordPool);
  const removeWord = useWordStore((state) => state.removeWord);

  const handleStartQuiz = () => {
    if (wordPool.length < 4) {
      Alert.alert(
        'Alıştırma Kilitli 🔒',
        `Quiz başlatabilmek için havuzunda en az 4 kelime olmalı. Şu an ${wordPool.length} kelimen var. Biraz daha kelime ara ve ekle!`
      );
      return;
    }
    router.push('/quiz');
  };

  // 🎮 Kart Eşleştirme Oyununu Başlatma Tetikleyicisi
  const handleStartMatchGame = () => {
    if (wordPool.length < 4) {
      Alert.alert(
        'Oyun Kilitli 🔒',
        `Kelimeleri eşleştirebilmek için havuzunda en az 4 kelime olmalı. Şu an ${wordPool.length} kelimen var.az daha kelime ekle ve yarışa katıl!`
      );
      return;
    }
    router.push('/match-game');
  };

  // 🗑️ Güvenli Silme Onay Mekanizması
  const handleDeleteWord = (event: any, item: WordItem) => {
    event.stopPropagation(); // ⚠️ Satıra tıklama eylemini (modalı) tamamen engeller
    
    Alert.alert(
      'Kelimeyi Sil 🗑️',
      `"${item.eng}" kelimesini havuzundan kaldırmak istediğine emin misin?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive', 
          onPress: () => removeWord(item.id) 
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Arka plan dekoratif neon parıltıları */}
      <View className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <View className="absolute top-[-40px] -left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <View className="absolute bottom-10 right-[-30px] w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
      </View>

      <View className="flex-1 p-5 pt-14 pb-4 z-10">
        
        {/* 👑 Üst Başlık Paneli */}
        <View className="flex-row justify-between items-center mb-6 px-1">
          <View>
            <View className="bg-emerald-500/10 px-2.5 py-1 rounded-md self-start mb-1.5 border border-emerald-500/10">
              <Text className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                KİŞİSEL SÖZLÜĞÜM
              </Text>
            </View>
            <Text className="text-3xl font-black text-cello tracking-tight">
              Kelime Havuzu
            </Text>
          </View>

          {/* Kelime Sayacı Rozeti */}
          <View className="bg-cello/10 px-4 py-2 rounded-2xl border border-cello/5 items-center justify-center">
            <Text className="text-xl font-black text-cello">{wordPool.length}</Text>
            <Text className="text-[9px] font-bold text-cello/60 uppercase tracking-tight">Kelime</Text>
          </View>
        </View>

        {/* 📦 Kelime Listesi veya Boş Durum Sahnesi */}
        {wordPool.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View className="bg-white p-6 rounded-[32px] shadow-xl shadow-cello/5 items-center border border-gray-100">
              <View className="bg-purple-100 p-4 rounded-2xl mb-4">
                <Ionicons name="folder-open-outline" size={40} color="#7c3aed" />
              </View>
              <Text className="text-cello font-black text-xl text-center">
                Havuzun Henüz Boş
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center leading-relaxed font-medium">
                Ana sayfaya gidip bilmediğin kelimeleri aratarak koleksiyonuna ilk parçaları eklemeye ne dersin?
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={wordPool}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 160 }} // Butonların arkasında kelime kalmaması için padding artırıldı
            renderItem={({ item }) => (
              <View className="mb-3 bg-white rounded-2xl shadow-sm border border-gray-100/70 overflow-hidden flex-row items-center justify-between pr-3 active:scale-[0.99] active:opacity-95">
                
                {/* Sol Taraf: Kelime Satırının Kendisi */}
                <View className="flex-1">
                  <WordRow 
                    item={item} 
                    onPress={() => {
                      setSelectedWord(item);
                      setModalVisible(true);
                    }} 
                  />
                </View>

                {/* Sağ Taraf: 🗑️ SİLME BUTONU */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={(event) => handleDeleteWord(event, item)}
                  className="bg-red-50 p-2.5 rounded-xl border border-red-100/50 active:scale-90"
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>

              </View>
            )}
          />
        )}
      </View>

      {/* YÜZEN AKSİYON BUTONLARI KAFESİ (Sadece havuzda kelime varsa görünürler) */}
      {wordPool.length > 0 && (
        <>
          {/* 🎮 ÜSTTEKİ BUTON: KART EŞLEŞTİRME OYUNU (Görsel hiyerarşiyi bozmamak için bottom-24 yapıldı) */}
          <View className="absolute bottom-24 right-6 z-50 shadow-2xl shadow-pink-600/30 rounded-full overflow-hidden">
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={handleStartMatchGame}
              className="active:scale-90"
            >
              <LinearGradient
                colors={['#7c3aed', '#db2777']} // Enerjik mor-pembe oyun geçişi
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row px-5 py-3.5 items-center justify-center rounded-full"
              >
                <Ionicons name="game-controller" size={20} color="#fff" />
                <Text className="text-white font-black ml-1.5 text-sm tracking-wide">
                  Kart Eşleştir
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ⚡ ALTTAKİ BUTON: QUIZ'I BAŞLAT (Mevcut bottom-8 yerini koruyor) */}
          <View className="absolute bottom-8 right-6 z-50 shadow-2xl shadow-purple-600/30 rounded-full overflow-hidden">
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={handleStartQuiz}
              className="active:scale-90"
            >
              <LinearGradient
                colors={['#1e3d59', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row px-6 py-4 items-center justify-center rounded-full"
              >
                <MaterialIcons name="bolt" size={24} color="#fff" />
                <Text className="text-white font-black ml-1.5 text-base tracking-wide">
                  Quiz'i Başlat
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Detay Modalı */}
      <WordDetailModal 
        visible={modalVisible}
        word={selectedWord}
        onClose={() => setModalVisible(false)}
        showAddButton={false}
      />
    </View>
  );
}
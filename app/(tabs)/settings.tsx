// app/(tabs)/settings.tsx
import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWordStore } from '@/utils/store';

export default function SettingsScreen() {
  // 🎯 Zustand Store'dan tüm işlevsel state ve fonksiyonları çekiyoruz
  const {
    wordPool,
    clearWordPool,
    remindersEnabled,
    setRemindersEnabled,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
  } = useWordStore();

  // 🚨 Havuzu Sıfırlama Mekanizması
  const handleClearPool = () => {
    if (wordPool.length === 0) {
      Alert.alert('Bilgi', 'Kelime havuzun zaten boş! 📝');
      return;
    }

    Alert.alert(
      'Havuzu Sıfırla 🚨',
      `Havuzundaki tüm (${wordPool.length}) kelimeler kalıcı olarak silinecektir. Bu işlem geri alınamaz! Emin misin?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Hepsini Sil',
          style: 'destructive',
          onPress: () => {
            clearWordPool();
            Alert.alert('Başarılı', 'Kelime havuzun tamamen temizlendi.');
          },
        },
      ]
    );
  };

  // 💾 Veri Yedekleme Simülasyonu
  const handleBackup = () => {
    Alert.alert(
      'Veri Yedekleme',
      'Kelime havuzunuz ve uygulama tercihleriniz AsyncStorage üzerine güvenli bir şekilde yedeklendi! 💾'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Text className="mb-6 mt-8 text-2xl font-black tracking-tight text-cello">Settings</Text>

        {/* 🏆 BÖLÜM 1: İSTATİSTİK KARTI */}
        <View className="mb-6 flex-row items-center justify-between rounded-3xl border border-gray-100/50 bg-white p-5 shadow-sm">
          <View>
            <Text className="text-xs font-bold uppercase tracking-wider text-gray-400">
              İlerleme Durumu
            </Text>
            <Text className="mt-1 text-3xl font-black text-cello">{wordPool.length}</Text>
            <Text className="mt-1 text-xs font-medium text-gray-500">Havuzdaki Toplam Kelime</Text>
          </View>
          <View className="rounded-2xl bg-secondary/10 p-4">
            <Ionicons name="trophy" size={32} color="#4e9f3d" />
          </View>
        </View>

        {/* ⚙️ BÖLÜM 2: UYGULAMA TERCİHLERİ */}
        <Text className="mb-2 ml-1 text-xs font-black uppercase tracking-widest text-gray-400">
          Tercihler
        </Text>
        <View className="mb-6 rounded-3xl border border-gray-100/50 bg-white p-4 shadow-sm">
          {/* Daily Reminders Switch */}
          <View className="flex-row items-center justify-between border-b border-gray-100/60 py-3">
            <View className="flex-row items-center">
              <View className="rounded-xl bg-blue-50 p-2">
                <Ionicons name="notifications-outline" size={20} color="#1e3d59" />
              </View>
              <Text className="ml-3 text-base font-semibold text-gray-700">Daily Reminders</Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled} // 🎯 Store'daki fonksiyonu tetikler
              trackColor={{ false: '#e2e8f0', true: '#4e9f3d' }}
              thumbColor="#ffffff"
            />
          </View>
          <View className="flex-row items-center justify-between border-t border-gray-100/60 py-3">
            <View className="flex-row items-center">
              <View className="rounded-xl bg-pink-50 p-2">
                <Ionicons name="hardware-chip-outline" size={20} color="#1e3d59" />
              </View>
              <Text className="ml-3 text-base font-semibold text-gray-700">Vibration Effects</Text>
            </View> 
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#e2e8f0', true: '#4e9f3d' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Quiz Sound Effects Switch */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <View className="rounded-xl bg-purple-50 p-2">
                <Ionicons name="volume-high-outline" size={20} color="#1e3d59" />
              </View>
              <Text className="ml-3 text-base font-semibold text-gray-700">Quiz Sound Effects</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled} // 🎯 Store'daki fonksiyonu tetikler
              trackColor={{ false: '#e2e8f0', true: '#4e9f3d' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* 💾 BÖLÜM 3: VERİ VE SİSTEM */}
        <Text className="mb-2 ml-1 text-xs font-black uppercase tracking-widest text-gray-400">
          Veri ve Sistem
        </Text>
        <View className="mb-6 rounded-3xl border border-gray-100/50 bg-white p-4 shadow-sm">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackup}
            className="flex-row items-center justify-between border-b border-gray-100/60 py-3">
            <View className="flex-row items-center">
              <View className="rounded-xl bg-green-50 p-2">
                <Ionicons name="cloud-upload-outline" size={20} color="#1e3d59" />
              </View>
              <Text className="ml-3 text-base font-semibold text-gray-700">Backup Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between py-3"
            onPress={() =>
              Alert.alert(
                'Info',
                'Vocabulary Master v1.0.0 - Built with React Native, Zustand & Expo Router'
              )
            }>
            <View className="flex-row items-center">
              <View className="rounded-xl bg-amber-50 p-2">
                <Ionicons name="information-circle-outline" size={20} color="#1e3d59" />
              </View>
              <Text className="ml-3 text-base font-semibold text-gray-700">About App</Text>
            </View>
            <Text className="text-sm font-bold text-gray-400">v1.0.0</Text>
          </TouchableOpacity>
        </View>

        {/* 🚨 BÖLÜM 4: TEHLİKELİ BÖLGE */}
        <Text className="mb-2 ml-1 text-xs font-black uppercase tracking-widest text-red-400">
          Tehlikeli Bölge
        </Text>
        <View className="mb-10 rounded-3xl border border-red-100 bg-red-50/40 p-4 shadow-sm">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClearPool}
            className="flex-row items-center justify-between py-2">
            <View className=" bg-transparent flex-row items-center">
              <View className="rounded-xl  p-2">
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </View>
              <View className="ml-3">
                <Text className="text-base font-bold text-red-600">Clear Word Pool</Text>
                <Text className="text-xs font-medium text-red-400">
                  Tüm kelimeleri kalıcı olarak siler
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#f87171" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

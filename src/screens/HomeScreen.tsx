import React, { useState } from 'react';
import { Text, FlatList, SafeAreaView, Alert } from 'react-native';
import { WordItem } from '@/types';
import { fetchWordFromApi } from '@/utils/api';
import { SearchBar, WordRow, WordDetailModal } from '@/components'; // ResultCard kaldırıldı

export default function HomeScreen() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modal Kontrolleri
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // Yeni aranan kelime mi yoksa havuzdan mı tıklandı kontrolü
  const [isNewSearch, setIsNewSearch] = useState<boolean>(false);

  // Başlangıç Havuzu
  const [wordPool, setWordPool] = useState<WordItem[]>([
    { 
      id: '1', 
      eng: 'Persistent', 
      tr: 'Continuing firmly or obstinately',
      partOfSpeech: 'adjective',
      example: 'She was persistent in her pursuit of the truth.'
    },
  ]);

  // Kelime Arama ve Doğrudan Modal Açma Fonksiyonu
  const handleSearch = async () => {
    if (!searchWord.trim()) return;
    setLoading(true);

    try {
      const data = await fetchWordFromApi(searchWord);
      
      const firstMeaning = data.meanings[0];
      const firstDefObj = firstMeaning?.definitions[0];

      // API'den gelen ham veriyi geçici bir WordItem objesine dönüştürüyoruz
      const tempWord: WordItem = {
        id: 'temp', // Henüz havuza eklenmediği için geçici ID
        eng: data.word,
        tr: firstDefObj?.definition || 'Definition not found.',
        partOfSpeech: firstMeaning?.partOfSpeech || 'unknown',
        example: firstDefObj?.example || 'No example sentence available.'
      };

      setSelectedWord(tempWord);
      setIsNewSearch(true); // Yeni bir arama olduğunu işaretle
      setModalVisible(true); // Modalı patlat!
      setSearchWord('');      // Arama çubuğunu temizle
    } catch (error: any) {
      Alert.alert('Not Found', error.message || 'Word not found.');
    } finally {
      setLoading(false);
    }
  };

  // Modal İçindeki Butona Basıldığında Havuza Ekleme Fonksiyonu
  const handleAddWord = () => {
    if (!selectedWord) return;

    // Geçici ID'yi gerçek bir zaman damgasıyla değiştiriyoruz
    const newWord: WordItem = {
      ...selectedWord,
      id: Date.now().toString()
    };

    setWordPool([newWord, ...wordPool]);
    setModalVisible(false);
    setSelectedWord(null);
    Alert.alert('Success', `${newWord.eng} has been added to your pool! 🚀`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-bold text-primary text-center mt-8 mb-5">
        Vocabulary Master
      </Text>

      <SearchBar 
        value={searchWord} 
        onChangeText={setSearchWord} 
        onSearch={handleSearch} 
        loading={loading} 
      />

      <Text className="text-lg font-semibold text-gray-700 mb-3 mt-4">
        My Word Pool ({wordPool.length})
      </Text>

      <FlatList
        data={wordPool}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordRow item={item} onPress={() => {
            setSelectedWord(item);
            setIsNewSearch(false); // Havuzdan tıklandığı için buton gizlenecek
            setModalVisible(true);
          }} />
        )}
      />

      {/* Akıllı Detay Modalı */}
      <WordDetailModal 
        visible={modalVisible}
        word={selectedWord}
        onClose={() => setModalVisible(false)}
        showAddButton={isNewSearch} // Sadece yeni aramalarda butonu göster
        onAdd={handleAddWord}
      />
    </SafeAreaView>
  );
}
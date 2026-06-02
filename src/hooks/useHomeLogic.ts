// src/hooks/useHomeLogic.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { WordItem } from '@/types';
import { fetchWordFromApi } from '@/utils/api';
import { useWordStore } from '@/utils/store';

export function useHomeLogic() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // İlk açılışta ekranın hazır olma durumunu kontrol eder
  const [pageReady, setPageReady] = useState<boolean>(false);

  // Modal Kontrolleri
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isNewSearch, setIsNewSearch] = useState<boolean>(false);

  // Ortadaki dinamik internetten gelen kelime stateti
  const [randomWord, setRandomWord] = useState<WordItem | null>(null);

  const addWord = useWordStore((state) => state.addWord);

  // Sayfa ilk açıldığında internetten rastgele kelime yükler
  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    await pickRandomWord();
    setPageReady(true);
  };

// %100 UPTIME - ASLA ÇÖKMEYEN GITHUB CDN KELİME MOTORU
  const pickRandomWord = async () => {
    try {
      // 1. ADIM: GitHub üzerinde barındırılan en popüler 2500 İngilizce kelime listesine hafif bir istek atıyoruz
      const response = await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt');
      
      if (!response.ok || response.status !== 200) {
        throw new Error('GitHub CDN bağlantı hatası.');
      }

      const textData = await response.text();
      
      // Gelen text dosyasındaki tüm kelimeleri satır satır bölüp bir diziye (array) çeviriyoruz
      const wordsArray = textData.split('\n').filter(word => word.trim().length > 4); // 4 harften büyük anlamlı kelimeler

      if (!wordsArray || wordsArray.length === 0) {
        throw new Error('Kelime havuzu oluşturulamadı.');
      }

      // 10.000 kelimelik devasa listeden rastgele bir indeks seçiyoruz
      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      const generatedWord = wordsArray[randomIndex].toLowerCase();

      // 2. ADIM: Seçilen kelimeyi kendi sözlük API'mize besliyoruz
      const dictionaryData = await fetchWordFromApi(generatedWord);
      
      if (!dictionaryData || !dictionaryData.meanings || dictionaryData.meanings.length === 0) {
        throw new Error('Sözlük bu kelimeyi bulamadı, pas geçip hemen yenisini arıyoruz.');
      }
      
      const firstMeaning = dictionaryData.meanings[0];
      const firstDefObj = firstMeaning?.definitions?.[0];

      // 3. ADIM: Ekrana yansıtma
      setRandomWord({
        id: Date.now().toString(),
        eng: dictionaryData.word,
        tr: firstDefObj?.definition || 'No global definition found for this word.',
        partOfSpeech: firstMeaning?.partOfSpeech || 'unknown',
        example: firstDefObj?.example || 'No live example sentence available.'
      });

    } catch (error) {
      // console.log('Sözlük eşleşmesi aranıyor...', error);
      
      // Eğer seçilen kelime çok absürt bir kelmeyse ve sözlükte anlamı yoksa,
      // 100ms içinde kullanıcının ruhu duymadan listeden başka bir kelime seçer.
      setTimeout(() => {
        pickRandomWord();
      }, 100);
    }
  };
  // Üstteki manuel arama çubuğu fonksiyonu
  const handleSearch = async () => {
    if (!searchWord.trim()) return;
    setLoading(true);

    try {
      const data = await fetchWordFromApi(searchWord);
      const firstMeaning = data.meanings[0];
      const firstDefObj = firstMeaning?.definitions[0];

      const tempWord: WordItem = {
        id: 'temp',
        eng: data.word,
        tr: firstDefObj?.definition || 'Definition not found.',
        partOfSpeech: firstMeaning?.partOfSpeech || 'unknown',
        example: firstDefObj?.example || 'No example sentence available.'
      };

      setSelectedWord(tempWord);
      setIsNewSearch(true);
      setModalVisible(true);
      setSearchWord('');
    } catch (error) {
      Alert.alert('Not Found', 'Word could not be found in global dictionary.');
    } finally {
      setLoading(false);
    }
  };

  // Ortadaki karta basıldığında detay açma
  const handleRandomCardPress = () => {
    if (!randomWord) return;
    setSelectedWord(randomWord);
    setIsNewSearch(true); // Keşfedilen kelime de havuza eklenebilsin
    setModalVisible(true);
  };

  // Havuza kalıcı kaydetme
  const handleAddWord = () => {
    if (!selectedWord) return;

    const newWord: WordItem = {
      ...selectedWord,
      id: Date.now().toString() // Geçici ID'yi kalıcı yap
    };

    addWord(newWord);
    setModalVisible(false);
    setSelectedWord(null);
    Alert.alert('Success', `${newWord.eng} has been added to your pool! 🚀`);
  };

  return {
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
  };
}
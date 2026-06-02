// src/hooks/useQuizLogic.ts
import { useState, useEffect, useRef } from 'react';
import { useWordStore } from '@/utils/store';
import { WordItem } from '@/types';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export function useQuizLogic() {
  const wordPool = useWordStore((state) => state.wordPool);
  const soundEnabled = useWordStore((state) => state.soundEnabled);
  const vibrationEnabled = useWordStore((state) => state.vibrationEnabled);
  
  const [shuffledPool, setShuffledPool] = useState<WordItem[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizOver, setQuizOver] = useState<boolean>(false);

  // 🚨 ASENKRON ZAMANLAYICILARI TUTMAK İÇİN REF
const timerRef = useRef<any | null>(null);
  const isMounted = useRef<boolean>(true);

  // Bileşen hafızadan silindiğinde (unmount) tetiklenecek temizlik zırhı
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearTimeout(timerRef.current); // Arka plandaki sayacı durdur!
    };
  }, []);

  // Sadece sayfa ilk açıldığında 1 kereye mahsus quizi kurar.
 useEffect(() => {
    if (wordPool && wordPool.length >= 4) {
      const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
      setShuffledPool(shuffled);
      setQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setQuizOver(false);
    }
  }, [quizOver]);
  // Soru indeksi değiştikçe şıkları üretir
  useEffect(() => {
    if (shuffledPool.length > 0 && questionIndex < shuffledPool.length) {
      generateOptions(shuffledPool[questionIndex]);
    }
  }, [shuffledPool, questionIndex]);

  // Manuel Yeniden Başlatma
  const restartQuiz = () => {
    if (!wordPool || wordPool.length < 4) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    setShuffledPool(shuffled);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizOver(false);
  };

  // Şık üretici
  const generateOptions = (correctWord: WordItem) => {
    if (!wordPool || wordPool.length < 4) return;
    const wrongAnswers = wordPool
      .filter((w) => w.id !== correctWord.id)
      .map((w) => w.tr);
    
    const shuffledWrong = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    const finalOptions = [correctWord.tr, ...shuffledWrong].sort(() => Math.random() - 0.5);
    setOptions(finalOptions);
  };

  // Cevaplama fonksiyonu
  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    const currentQuestion = shuffledPool[questionIndex];
    if (!currentQuestion) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.tr;
    setIsCorrect(correct);
    
    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (soundEnabled) {
      Audio.Sound.createAsync(
        correct ? require('../../assets/sounds/correct.mp3') : require('../../assets/sounds/wrong.mp3')
      ).then(({ sound }) => {
        sound.playAsync().then(() => {
          sound.unloadAsync();
        });
      }).catch(err => console.log(err));
    }

    if (vibrationEnabled) {
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      ).catch(err => console.log(err));
    }

    // 🚨 Zamanlayıcıyı Ref'e kaydediyoruz ki sayfadan çıkılırsa iptal edebilelim
    timerRef.current = setTimeout(() => {
      // Sadece bileşen hâlâ ekrandaysa state güncellemesi yap (Çökmeyi önleyen altın kural)
      if (!isMounted.current) return;

      if (questionIndex + 1 < shuffledPool.length) {
        setSelectedAnswer(null);
        setQuestionIndex((prev) => prev + 1);
      } else {
        setQuizOver(true);
      }
    }, 1200);
  };

  const endQuiz = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuizOver(true);
  };

  return {
    wordPool,
    currentQuestion: shuffledPool[questionIndex] || null,
    options,
    score,
    questionIndex,
    selectedAnswer,
    isCorrect,
    quizOver,
    handleAnswer,
    restartQuiz,
    endQuiz,
    shuffledPool,
  };
}
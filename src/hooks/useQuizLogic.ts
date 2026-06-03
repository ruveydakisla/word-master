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

  // ASENKRON ZAMANLAYICILARI VE AKTİF SES NESNESİNİ TUTMAK İÇİN REFLER
  const timerRef = useRef<any | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMounted = useRef<boolean>(true);

  // Bileşen hafızadan silindiğinde (unmount) tetiklenecek temizlik zırhı
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(err => console.log("Sound unload error:", err));
      }
    };
  }, []);

  // Sadece sayfa ilk açıldığında veya kelime havuzu yüklendiğinde quizi kurar.
  // 🚨 quizOver bağımlılığı sonsuz döngü yaratmaması için burası stabilize edildi.
  useEffect(() => {
    if (wordPool && wordPool.length >= 4 && shuffledPool.length === 0) {
      initQuiz();
    }
  }, [wordPool]);

  // Soru indeksi değiştikçe şıkları üretir
  useEffect(() => {
    if (shuffledPool.length > 0 && questionIndex < shuffledPool.length) {
      generateOptions(shuffledPool[questionIndex]);
    }
  }, [shuffledPool, questionIndex]);

  const initQuiz = () => {
    if (!wordPool || wordPool.length < 4) return;
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    setShuffledPool(shuffled);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizOver(false);
  };

  // Manuel Yeniden Başlatma
  const restartQuiz = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    initQuiz();
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

  // 🎵 GÜVENLİ SES OYNATICI FONKSİYONU
  const playFeedbackSound = async (correct: boolean) => {
    if (!soundEnabled) return;

    try {
      // Eğer önceden kalan ve temizlenmemiş bir ses objesi varsa önce onu boşaltalım
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
      }

      const soundFile = correct 
        ? require('../../assets/sounds/correct.mp3') 
        : require('../../assets/sounds/wrong.mp3');

      const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true });
      soundRef.current = sound;

      // 🎯 Altın Kural: Ses çalmayı bitirdiğinde otomatik olarak hafızadan (RAM) temizlensin
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(err => console.log("Unload error:", err));
          soundRef.current = null;
        }
      });

    } catch (error) {
      console.log("Ses oynatılamadı:", error);
    }
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

    // Tetikleyiciler
    playFeedbackSound(correct);

    if (vibrationEnabled) {
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      ).catch(err => console.log(err));
    }

    // Zamanlayıcıyı Ref'e kaydediyoruz ki sayfadan çıkılırsa iptal edebilelim
    timerRef.current = setTimeout(() => {
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
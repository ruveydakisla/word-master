// app/quiz.tsx
import React, { useEffect, useRef } from 'react';
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useWordStore } from '@/utils/store';

export default function QuizScreen() {
  const router = useRouter();
  const {
    wordPool,
    currentQuestion,
    options,
    score,
    questionIndex,
    selectedAnswer,
    isCorrect,
    quizOver,
    handleAnswer,
    restartQuiz,
    endQuiz,
  } = useQuizLogic();

  const totalQuestions = wordPool?.length || 0;
  const addXp = useWordStore((state) => state.addXp); // Store'dan çek

  // 🎯 Mükerrer XP eklenmesini önlemek için bir kilit (guard) mekanizması
  const xpAddedRef = useRef(false);

 useEffect(() => {
  if (quizOver && !xpAddedRef.current) {
    const earnedXp = score * 25;
    if (earnedXp > 0) {
      addXp(earnedXp);
    }

    // 🔥 Kusursuz Bitiriş Rozet Kontrolü
    if (score === totalQuestions && totalQuestions > 0) {
      const currentBadges = useWordStore.getState().badges;
      const updatedBadges = currentBadges.map(b => 
        b.id === 'quiz_master' ? { ...b, isUnlocked: true } : b
      );
      useWordStore.setState({ badges: updatedBadges });
    }
    
    xpAddedRef.current = true;

    router.replace({
      pathname: '/quiz-result',
      params: { score: score.toString(), total: totalQuestions.toString() },
    });
  }
}, [quizOver, score, totalQuestions, addXp]);

  const handleClose = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-between p-5">
        {/* ÜST BAR */}
        <View className="mt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleClose}
              className="rounded-full bg-gray-200/60 p-2.5 active:scale-90"
            >
              <Ionicons name="close" size={20} color="#1e3d59" />
            </TouchableOpacity>

            <View className="rounded-full border border-blue-100/30 bg-blue-50 px-4 py-1.5">
              <Text className="text-xs font-black text-cello">
                Soru {Math.min(questionIndex + 1, totalQuestions)} / {totalQuestions}
              </Text>
            </View>

            <View className="flex-row items-center rounded-full border border-green-100/30 bg-green-50 px-3.5 py-1.5">
              <Ionicons name="checkmark-circle" size={16} color="#4e9f3d" />
              <Text className="ml-1 text-xs font-black text-secondary">{score}</Text>
            </View>
          </View>

          {/* İlerleme Çubuğu */}
          <View className="shadow-inner h-3 w-full overflow-hidden rounded-full border border-gray-100 bg-gray-200">
            <View
              className="h-full rounded-full bg-cello"
              style={{
                width: `${totalQuestions > 0 ? (questionIndex / totalQuestions) * 100 : 0}%`,
              }}
            />
          </View>
        </View>

        {/* ORTA ALAN: Soru Kartı */}
        <View className="my-6 items-center justify-center rounded-3xl border border-gray-100/80 bg-white p-8 shadow-sm">
          <View className="mb-3 rounded-full bg-secondary/10 px-3 py-1">
            <Text className="text-[10px] font-black uppercase tracking-widest text-secondary">
              Kelimeni Hatırla
            </Text>
          </View>
          <Text className="text-center text-3xl font-black capitalize tracking-tight text-cello">
            {currentQuestion?.eng || ''}
          </Text>
          {currentQuestion?.partOfSpeech && (
            <Text className="mt-2 rounded-md border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-xs font-bold italic text-gray-400">
              [{currentQuestion.partOfSpeech}]
            </Text>
          )}
        </View>

        {/* ALT ALAN: Akıllı Şıklar */}
        <View className="my-2 flex-1 justify-center">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isThisOptionCorrect = currentQuestion ? option === currentQuestion.tr : false;

            let containerClass =
              'w-full p-4 mb-4 rounded-2xl border flex-row items-center justify-between bg-white border-gray-200/80 shadow-sm active:scale-[0.98]';
            let textClass = 'text-base flex-1 pr-2 text-gray-700 font-semibold';
            let iconName: 'checkmark-circle' | 'close-circle' | null = null;

            if (selectedAnswer) {
              if (isThisOptionCorrect) {
                containerClass =
                  'w-full p-4 mb-4 rounded-2xl border flex-row items-center justify-between bg-green-500 border-green-600 shadow-md';
                textClass = 'text-base flex-1 pr-2 text-white font-black';
                iconName = 'checkmark-circle';
              } else if (isSelected && !isCorrect) {
                containerClass =
                  'w-full p-4 mb-4 rounded-2xl border flex-row items-center justify-between bg-red-500 border-red-600 shadow-md';
                textClass = 'text-base flex-1 pr-2 text-white font-black';
                iconName = 'close-circle';
              } else {
                containerClass =
                  'w-full p-4 mb-4 rounded-2xl border flex-row items-center justify-between bg-white border-gray-100 opacity-30';
                textClass = 'text-base flex-1 pr-2 text-gray-400 font-normal';
              }
            }

            return (
              <TouchableOpacity
                key={index}
                disabled={selectedAnswer !== null}
                activeOpacity={0.7}
                className={containerClass}
                onPress={() => handleAnswer(option)}
              >
                <Text className={textClass}>{option}</Text>
                {iconName && <Ionicons name={iconName} size={22} color="#ffffff" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {!selectedAnswer && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={endQuiz}
            className="mb-2 w-full items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 py-4 active:bg-red-100/80"
          >
            <Text className="text-sm font-bold tracking-wide text-red-500">
              Alıştırmayı Bitir ve Skoru Gör
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
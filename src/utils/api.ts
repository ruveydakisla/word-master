import { ApiResponse } from '@/types';

export const fetchWordFromApi = async (word: string): Promise<ApiResponse & { englishDefinition: string }> => {
  const cleanWord = word.trim().toLowerCase();

  // Doğrudan Free Dictionary API'ye istek atıyoruz
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
  
  if (!response.ok) {
    throw new Error('Word not found in the global dictionary.');
  }

  const data: ApiResponse[] = await response.json();
  const mainData = data[0];

  // Kelimenin sözlükteki ilk İngilizce tanımını cımbızlıyoruz
  const englishDefinition = mainData.meanings[0]?.definitions[0]?.definition || 'Definition not found.';

  return {
    ...mainData,
    englishDefinition,
  };
};
export interface WordItem {
  id: string;
  eng: string;
  tr: string; // İngilizce açıklama için kullanmaya devam ediyoruz
  partOfSpeech: string; // Noun, Adjective, Verb vb.
  example: string; // Örnek cümle
}

export interface ApiResponse {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string; // API'den bazen örnek cümle gelir
    }[];
  }[];
}
// app/_layout.tsx
import { Stack } from 'expo-router';
import '../global.css'; // Veya senin tailwind/nativewind import yolun

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tab navigasyonun */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Quiz ekranın - Modally açılıyorsa tam context sağlamak için */}
      <Stack.Screen
        name="quiz"
        options={{
          presentation: 'modal', // Sayfanın aşağıdan yukarı açılmasını sağlar
          headerShown: false,
        }}
      />
      // app/_layout.tsx içindeki Stack'in içine eklenecek:
      <Stack.Screen name="quiz-result" options={{ headerShown: false, presentation: 'card' }} />
    </Stack>
  );
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1e3d59', // Aktif ikon rengi (Primary)
        tabBarInactiveTintColor: '#94a3b8', // Pasif ikon rengi
        tabBarStyle: {
          backgroundColor: '#ffffff', // Tab bar arka planı
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 12,
          paddingTop: 2,
        },
        headerShown: false, // Sayfa üst başlıklarını gizle (Kendimiz çizeceğiz)
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pool"
        options={{
          title: 'My Pool',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Başarılarım',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ribbon' : 'ribbon-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

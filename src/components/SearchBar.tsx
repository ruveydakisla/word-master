import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSearch, loading }) => {
  return (
    <View className="bg-white p-3 rounded-2xl shadow-sm mb-4 flex-row items-center justify-between">
      <TextInput
        className="flex-1 p-2 text-base"
        placeholder="İngilizce kelime ara..."
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      <TouchableOpacity 
        className="bg-primary p-3 rounded-xl justify-center items-center"
        onPress={onSearch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons name="search" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};
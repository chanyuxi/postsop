import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

export function SearchBar() {
  const [searchText, setSearchText] = useState('')

  return (
    <View style={styles.container}>
      <TextInput
        cursorColor="#8800f8ff"
        placeholder="Type a movie name..."
        placeholderTextColor="#fff6"
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#24292e',
  },
  input: {
    color: '#fff',
    borderRadius: 10,
    backgroundColor: '#353a3e',
  },
})

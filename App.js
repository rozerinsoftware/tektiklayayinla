import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TekTıklaYayınla</Text>
      <Text style={styles.subtitle}>İlan Ekleme Formu</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="İlan Başlığı"
      />
      
      <TextInput 
        style={styles.input}
        placeholder="Açıklama"
      />
      
      <TextInput 
        style={styles.input}
        placeholder="Fiyat"
      />
      
      <Button title="İlan Ekle" onPress={() => alert('İlan eklendi!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

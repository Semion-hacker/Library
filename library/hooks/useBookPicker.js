import * as DocumentPicker from 'expo-document-picker';

const ALLOWED_EXTENSIONS = ['epub', 'fb2', 'pdf'];

export default function useBookPicker() {
  const pickBook = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        return null;
      }

      const extension = asset.name?.split('.').pop()?.toLowerCase() ?? '';

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        alert('Допустимые форматы: EPUB, FB2, PDF');
        return null;
      }

      return {
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
      };
    } catch (error) {
      console.error('Ошибка при выборе файла:', error);
      alert('Не удалось выбрать файл');
      return null;
    }
  };

  return { pickBook };
}

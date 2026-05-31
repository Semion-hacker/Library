import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

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

      // Extract metadata based on file type
      let title = asset.name; // Default to filename
      let author = 'Неизвестный автор';

      try {
        if (extension === 'fb2') {
          // Read FB2 file as text
          const fb2Content = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.UTF8,
          });

          // Try multiple strategies to find title
          let foundTitle = '';
          let titleInfoStart = -1;

          // Strategy 1: <book-title> inside <title-info>
          titleInfoStart = fb2Content.indexOf('<title-info>');
          if (titleInfoStart !== -1) {
            const titleInfoEnd = fb2Content.indexOf('</title-info>', titleInfoStart);
            if (titleInfoEnd !== -1) {
              const titleInfoContent = fb2Content.substring(titleInfoStart, titleInfoEnd);
              const bookTitleStart = titleInfoContent.indexOf('<book-title>');
              if (bookTitleStart !== -1) {
                const bookTitleEnd = titleInfoContent.indexOf('</book-title>', bookTitleStart);
                if (bookTitleEnd !== -1) {
                  foundTitle = titleInfoContent.substring(
                    bookTitleStart + '<book-title>'.length,
                    bookTitleEnd
                  ).trim();
                }
              }
              // If not found, try <title> inside title-info
              if (!foundTitle) {
                const titleStart = titleInfoContent.indexOf('<title>');
                if (titleStart !== -1) {
                  const titleEnd = titleInfoContent.indexOf('</title>', titleStart);
                  if (titleEnd !== -1) {
                    foundTitle = titleInfoContent.substring(
                      titleStart + '<title>'.length,
                      titleEnd
                    ).trim();
                  }
                }
              }
              // Try to extract author
              if (foundTitle) {
                const authorStart = titleInfoContent.indexOf('<author>');
                if (authorStart !== -1) {
                  const authorEnd = titleInfoContent.indexOf('</author>', authorStart);
                  if (authorEnd !== -1) {
                    author = titleInfoContent.substring(
                      authorStart + '<author>'.length,
                      authorEnd
                    ).trim();
                  }
                }
              }
            }
          }

          // Strategy 2: Direct <book-title> anywhere
          if (!foundTitle) {
            const bookTitleStart = fb2Content.indexOf('<book-title>');
            if (bookTitleStart !== -1) {
              const bookTitleEnd = fb2Content.indexOf('</book-title>', bookTitleStart);
              if (bookTitleEnd !== -1) {
                foundTitle = fb2Content.substring(
                  bookTitleStart + '<book-title>'.length,
                  bookTitleEnd
                ).trim();
              }
            }
          }

          // Strategy 3: Direct <title> anywhere (first occurrence)
          if (!foundTitle) {
            const titleStart = fb2Content.indexOf('<title>');
            if (titleStart !== -1) {
              const titleEnd = fb2Content.indexOf('</title>', titleStart);
              if (titleEnd !== -1) {
                foundTitle = fb2Content.substring(
                  titleStart + '<title>'.length,
                  titleEnd
                ).trim();
              }
            }
          }

          if (foundTitle) {
            title = foundTitle;
          }
          if (!author || author === 'Неизвестный автор') {
            author = 'Неизвестный автор';
          }
        }
        // For EPUB and PDF, we'll use the filename as title for now
      } catch (parseError) {
        console.warn('Ошибка при извлечении метаданных:', parseError);
        title = asset.name;
        author = 'Неизвестный автор';
      }

      // Sanitize title and author
      if (title) {
        title = title.replace(/[\r\n\t]+/g, ' ').trim();
        if (!title) title = asset.name;
      }
      if (author) {
        author = author.replace(/[\r\n\t]+/g, ' ').trim();
        if (!author) author = 'Неизвестный автор';
      }

      return {
        uri: asset.uri,
        name: asset.name,
        title: title,
        author: author,
        size: asset.size,
        mimeType: asset.mimeType,
        favorite: false,
      };
    } catch (error) {
      console.error('Ошибка при выборе файла:', error);
      alert('Не удалось выбрать файл');
      return null;
    }
  };

  return { pickBook };
}
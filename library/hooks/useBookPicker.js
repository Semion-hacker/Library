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

          // Strategy 1: <book-title> inside <title-info>
          const titleInfoStart = fb2Content.indexOf('<title-info>');
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
            // Try to extract author from <author> inside <title-info>
            let foundAuthor = '';
            if (titleInfoStart !== -1) {
              const titleInfoEnd = fb2Content.indexOf('</title-info>', titleInfoStart);
              if (titleInfoEnd !== -1) {
                const titleInfoContent = fb2Content.substring(titleInfoStart, titleInfoEnd);
                const authorStart = titleInfoContent.indexOf('<author>');
                if (authorStart !== -1) {
                  const authorEnd = titleInfoContent.indexOf('</author>', authorStart);
                  if (authorEnd !== -1) {
                    foundAuthor = titleInfoContent.substring(
                      authorStart + '<author>'.length,
                      authorEnd
                    ).trim();
                  }
                }
              }
            }
            // If not found in title-info, try anywhere
            if (!foundAuthor) {
              const authorStart = fb2Content.indexOf('<author>');
              if (authorStart !== -1) {
                const authorEnd = fb2Content.indexOf('</author>', authorStart);
                if (authorEnd !== -1) {
                  foundAuthor = fb2Content.substring(
                    authorStart + '<author>'.length,
                    authorEnd
                  ).trim();
                }
              }
            }
            if (foundAuthor) {
              author = foundAuthor;
            }
          }
        }
        // For EPUB and PDF, we'll use the filename as title for now
        // TODO: Implement EPUB and PDF metadata extraction in future
      } catch (parseError) {
        console.warn('Ошибка при извлечении метаданных:', parseError);
        // Fallback to filename if metadata extraction fails
        title = asset.name;
        author = 'Неизвестный автор';
      }

      // Sanitize title and author: replace newlines/tabs with spaces, trim
      if (title) {
        title = title.replace(/[\r\n\t]+/g, ' ').trim();
        // If after sanitizing it's empty, fallback to filename
        if (!title) {
          title = asset.name;
        }
      }
      if (author) {
        author = author.replace(/[\r\n\t]+/g, ' ').trim();
        if (!author) {
          author = 'Неизвестный автор';
        }
      }

      return {
        uri: asset.uri,
        name: asset.name,
        title: title, // Actual book title or filename
        author: author, // Author name or default
        size: asset.size,
        mimeType: asset.mimeType,
        favorite: false, // Initialize favorite status
      };
    } catch (error) {
      console.error('Ошибка при выборе файла:', error);
      alert('Не удалось выбрать файл');
      return null;
    }
  };

  return { pickBook };
}
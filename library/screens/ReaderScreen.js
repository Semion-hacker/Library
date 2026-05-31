import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import ArrowLeftIcon from '../assets/images/svg/arrowLeft.svg';
import * as FileSystem from 'expo-file-system/legacy';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH - 10;
const CONTAINER_HEIGHT = SCREEN_HEIGHT * 0.78;
const FONT_SIZE = 20;
const LINE_HEIGHT = 30;
const TEXT_AVAILABLE_WIDTH = CONTAINER_WIDTH - 30;
const MAX_CHARS_PER_LINE = Math.floor(TEXT_AVAILABLE_WIDTH / (FONT_SIZE * 0.55));
const LINES_PER_PAGE = 20;

export default function ReaderScreen({ book, initialPage, onClose, onSaveProgress }) {
  // Используем initialPage при инициализации, чтобы страница не сбрасывалась при перерендере
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => initialPage || 0);

  useEffect(() => {
    const loadBookContent = async () => {
      setLoading(true);
      setError(null);
      
      const bookTitle = book?.title || book?.name || 'Книга';
      
      try {
        if (!book || !book.uri) {
          setError('Файл не выбран или URI отсутствует');
          setPages([['']]);
          return;
        }

        const extension = book.uri.split('.').pop()?.toLowerCase();
        let paragraphs = [];
        
        if (extension === 'fb2') {
          try {
            const fb2Content = await FileSystem.readAsStringAsync(book.uri, {
              encoding: FileSystem.EncodingType.UTF8,
            });
            paragraphs = extractFb2Text(fb2Content);
          } catch (readError) {
            setError(`Не удалось прочитать FB2: ${readError.message || 'Unknown error'}`);
            paragraphs = [bookTitle];
          }
        } else if (extension === 'epub') {
          paragraphs = [`[EPUB] ${bookTitle}`, 'Формат EPUB пока не поддерживается полностью.'];
        } else if (extension === 'pdf') {
          paragraphs = [`[PDF] ${bookTitle}`, 'Формат PDF пока не поддерживается полностью.'];
        } else {
          paragraphs = [bookTitle || 'Неизвестный формат'];
        }

        const paginatedPages = paginateText(paragraphs, MAX_CHARS_PER_LINE, LINES_PER_PAGE);
        setPages(paginatedPages);
      } catch (err) {
        setError(`Ошибка: ${err.message || 'Unknown error'}`);
        setPages([['Ошибка']]);
      } finally {
        setLoading(false);
      }
    };

    loadBookContent();
  }, [book]);

  const extractFb2Text = (fb2Content) => {
    if (!fb2Content) return [];
    
    let bodyMatch = fb2Content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : fb2Content;
    
    bodyContent = bodyContent.replace(/<p[^>]*>/gi, '\n');
    bodyContent = bodyContent.replace(/<\/p>/gi, '\n');
    bodyContent = bodyContent.replace(/<text[^>]*>/gi, '');
    bodyContent = bodyContent.replace(/<\/text>/gi, '');
    bodyContent = bodyContent.replace(/<subtitle[^>]*>/gi, '\n');
    bodyContent = bodyContent.replace(/<\/subtitle>/gi, '\n');
    bodyContent = bodyContent.replace(/<section[^>]*>/gi, '\n');
    bodyContent = bodyContent.replace(/<\/section>/gi, '\n');
    bodyContent = bodyContent.replace(/<[^>]+>/g, ' ');
    
    bodyContent = bodyContent.replace(/&lt;/g, '<');
    bodyContent = bodyContent.replace(/&gt;/g, '>');
    bodyContent = bodyContent.replace(/&amp;/g, '&');
    bodyContent = bodyContent.replace(/&quot;/g, '"');
    bodyContent = bodyContent.replace(/&apos;/g, "'");
    bodyContent = bodyContent.replace(/&nbsp;/g, ' ');
    
    bodyContent = bodyContent.replace(/[ \t]+/g, ' ');
    
    return bodyContent.trim().split('\n').filter(p => p.trim().length > 0);
  };

  const paginateText = (paragraphs, maxCharsPerLine, linesPerPage) => {
    const allLines = [];
    
    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let currentLine = '';
      let isFirstLine = true;
      
      words.forEach(word => {
        if (currentLine.length === 0) {
          currentLine = word;
        } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine = currentLine + ' ' + word;
        } else {
          allLines.push({ text: currentLine, indent: isFirstLine });
          isFirstLine = false;
          currentLine = word;
        }
      });
      
      if (currentLine.trim()) {
        allLines.push({ text: currentLine.trim(), indent: isFirstLine });
      }
    });
    
    const pages = [];
    for (let i = 0; i < allLines.length; i += linesPerPage) {
      pages.push(allLines.slice(i, i + linesPerPage));
    }
    
    return pages.length > 0 ? pages : [[]];
  };

  const handleTap = useCallback((event) => {
    const x = event.nativeEvent.locationX;
    
    if (x < CONTAINER_WIDTH * 0.3) {
      if (currentPage > 0) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        if (onSaveProgress && book?.id) {
          onSaveProgress(book.id, newPage);
        }
      }
    } else if (x > CONTAINER_WIDTH * 0.7) {
      if (currentPage < pages.length - 1) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        if (onSaveProgress && book?.id) {
          onSaveProgress(book.id, newPage);
        }
      }
    }
  }, [currentPage, pages.length, onSaveProgress, book?.id]);

  // Save progress on unmount when closing reader
  useEffect(() => {
    return () => {
      if (onSaveProgress && book?.id && pages.length > 0) {
        onSaveProgress(book.id, currentPage);
      }
    };
  }, [onSaveProgress, book?.id, pages.length, currentPage]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#94664E" />
        <Text style={styles.loadingText}>Загрузка книги...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeftIcon width={28} height={28} color="#fff" />
        </Pressable>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {book?.title || book?.name || 'Книга'}
        </Text>
      </View>

      <View style={styles.centerContainer}>
        <TouchableOpacity 
          style={styles.readerContainer}
          onPress={handleTap}
          activeOpacity={1}
        >
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.pageContent}>
              {(pages[currentPage] || []).map((lineObj, index) => (
                <Text 
                  key={index} 
                  style={[
                    styles.pageText,
                    lineObj.indent && styles.firstLineIndent
                  ]}
                >
                  {lineObj.text}
                </Text>
              ))}
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.pageIndicator}>
          {pages.length > 0 ? currentPage + 1 : 0}/{pages.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f5f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 26, 27, 0.9)',
    zIndex: 10,
  },
  bookTitle: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    top: 10,
    alignItems: 'center',
  },
  readerContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pageContent: {
    flex: 1,
  },
  pageText: {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: '#333',
  },
  firstLineIndent: {
    paddingLeft: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#999',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
});
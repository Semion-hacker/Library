import { useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';

const SLOTS_FILE = FileSystem.documentDirectory + 'library-slots.json';
const PROGRESS_FILE = FileSystem.documentDirectory + 'library-progress.json';
const PAGES_FILE = FileSystem.documentDirectory + 'library-pages.json';

const getInitialSlots = () => [
  { id: 1, books: [] },
  { id: 2, books: [] },
  { id: 3, books: [] },
  { id: 4, books: [] },
  { id: 5, books: [] },
];

export default function usePersistentStorage() {
  const [slots, setSlots] = useState(getInitialSlots());
  const [readingProgress, setReadingProgress] = useState({});
  const [totalPages, setTotalPages] = useState({});
  const isFirstLoad = useRef(true);

  // Load data on mount only once
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load slots
        const slotsInfo = await FileSystem.getInfoAsync(SLOTS_FILE);
        if (slotsInfo.exists) {
          const content = await FileSystem.readAsStringAsync(SLOTS_FILE, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          const savedSlots = JSON.parse(content);
          setSlots(savedSlots);
        }
      } catch (error) {
        console.error('Failed to load slots:', error);
      }

      try {
        // Load reading progress
        const progressInfo = await FileSystem.getInfoAsync(PROGRESS_FILE);
        if (progressInfo.exists) {
          const content = await FileSystem.readAsStringAsync(PROGRESS_FILE, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          const savedProgress = JSON.parse(content);
          setReadingProgress(savedProgress);
        }
      } catch (error) {
        console.error('Failed to load reading progress:', error);
      }

      try {
        // Load total pages
        const pagesInfo = await FileSystem.getInfoAsync(PAGES_FILE);
        if (pagesInfo.exists) {
          const content = await FileSystem.readAsStringAsync(PAGES_FILE, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          const savedPages = JSON.parse(content);
          setTotalPages(savedPages);
        }
      } catch (error) {
        console.error('Failed to load total pages:', error);
      }

      isFirstLoad.current = false;
    };
    loadData();
  }, []);

  // Save slots whenever they change (skip first load to avoid circular save)
  useEffect(() => {
    if (!isFirstLoad.current) {
      FileSystem.writeAsStringAsync(
        SLOTS_FILE,
        JSON.stringify(slots),
        { encoding: FileSystem.EncodingType.UTF8 }
      ).catch(err => console.error('Failed to save slots:', err));
    }
  }, [slots]);

  // Save reading progress whenever it changes (skip first load)
  useEffect(() => {
    if (!isFirstLoad.current) {
      FileSystem.writeAsStringAsync(
        PROGRESS_FILE,
        JSON.stringify(readingProgress),
        { encoding: FileSystem.EncodingType.UTF8 }
      ).catch(err => console.error('Failed to save progress:', err));
    }
  }, [readingProgress]);

  // Save total pages whenever it changes (skip first load)
  useEffect(() => {
    if (!isFirstLoad.current) {
      FileSystem.writeAsStringAsync(
        PAGES_FILE,
        JSON.stringify(totalPages),
        { encoding: FileSystem.EncodingType.UTF8 }
      ).catch(err => console.error('Failed to save total pages:', err));
    }
  }, [totalPages]);

  return {
    slots,
    setSlots,
    readingProgress,
    setReadingProgress,
    totalPages,
    setTotalPages,
  };
}
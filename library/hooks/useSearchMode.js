import { useState } from 'react';

export default function useSearchMode() {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const open = () => setVisible(true);
  const close = () => {
    setVisible(false);
    setQuery('');
  };

  return { visible, open, close, query, setQuery };
}
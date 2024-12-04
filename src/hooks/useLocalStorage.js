import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // This state will hold our todo items
  const [storedValue, setStoredValue] = useState(() => {
    // Don't try to access localStorage during server-side rendering
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get the value from localStorage
      const item = window.localStorage.getItem(key);
      // If it exists, parse it. If not, use the initial value
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // This effect runs whenever our stored value changes
  useEffect(() => {
    try {
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage; 
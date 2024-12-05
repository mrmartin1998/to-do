import { useCallback } from 'react';

function useNotifications(todos) {
  const simpleTest = useCallback(async () => {
    try {
      // 1. Check browser support
      if (!("Notification" in window)) {
        alert("This browser does not support notifications");
        return;
      }

      // 2. Request permission
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Notification permission denied');
          return;
        }
      }

      // 3. Create a basic notification
      new Notification('Hello!', {
        body: 'This is a test notification',
        icon: '/favicon.ico',
        requireInteraction: true
      });

    } catch (error) {
      console.error('Notification error:', error);
      alert(`Error: ${error.message}`);
    }
  }, []);

  return { simpleTest };
}

export default useNotifications; 
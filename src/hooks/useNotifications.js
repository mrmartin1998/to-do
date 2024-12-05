import { useEffect, useCallback } from 'react';

function useNotifications(todos) {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Separate permission request logic
  const requestPermission = useCallback(async () => {
    if (!isBrowser) return false;

    try {
      if (!("Notification" in window)) {
        alert("This browser does not support notifications");
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      // Try using the newer ServiceWorkerRegistration API first
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.showNotification) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
          }
        } catch (error) {
          console.log('ServiceWorker notification not available, falling back to regular notifications');
        }
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Simple test function with more debugging
  const simpleTest = useCallback(async () => {
    if (!isBrowser) return;

    console.log('Testing notifications...');
    
    try {
      // Check if we're on HTTPS or localhost
      const isSecureContext = window.isSecureContext;
      console.log('Is secure context:', isSecureContext);
      
      if (!isSecureContext) {
        alert('Notifications require a secure context (HTTPS or localhost)');
        return;
      }

      // Check browser support
      if (!("Notification" in window)) {
        alert("This browser does not support notifications");
        return;
      }
      
      // Request permission
      const permission = await Notification.requestPermission();
      console.log('Permission status:', permission);
      
      if (permission !== 'granted') {
        alert('Notification permission denied');
        return;
      }

      // Try using ServiceWorker notifications first
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.showNotification) {
            await registration.showNotification('Test Notification', {
              body: 'This is a test notification',
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: 'test-notification',
              requireInteraction: true,
              vibrate: [200, 100, 200]
            });
            console.log('ServiceWorker notification sent');
            return;
          }
        } catch (error) {
          console.log('ServiceWorker notification failed, falling back to regular notifications');
        }
      }

      // Fallback to regular notifications
      const notification = new Notification('Test Notification', {
        body: 'This is a test notification',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: true,
        silent: false
      });
      
      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };

      notification.onshow = () => {
        console.log('Notification shown');
      };

      notification.onerror = (error) => {
        console.error('Notification error:', error);
        alert('Error showing notification: ' + error);
      };

      console.log('Regular notification created:', notification);
    } catch (error) {
      console.error('Error in simpleTest:', error);
      alert('Error creating notification: ' + error.message);
    }
  }, []);

  // Effect for deadline notifications
  useEffect(() => {
    if (!isBrowser) return;

    let interval;
    
    const initializeNotifications = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      const checkDeadlines = () => {
        todos.forEach(todo => {
          if (todo.completed || !todo.deadline) return;
          
          const deadline = new Date(todo.deadline);
          const now = new Date();
          const timeUntilDeadline = deadline.getTime() - now.getTime();
          
          if (
            (timeUntilDeadline > 0 && timeUntilDeadline <= 5 * 60 * 1000) || // 5 minutes
            (timeUntilDeadline > 0 && timeUntilDeadline <= 24 * 60 * 60 * 1000) || // 24 hours
            (timeUntilDeadline < 0 && timeUntilDeadline > -60 * 60 * 1000) // Just overdue
          ) {
            try {
              const message = timeUntilDeadline < 0
                ? `"${todo.title}" is overdue!`
                : timeUntilDeadline <= 5 * 60 * 1000
                ? `"${todo.title}" is due in less than 5 minutes!`
                : `"${todo.title}" is due in less than 24 hours!`;

              const notification = new Notification('Todo Reminder', {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `${todo.id}-${Math.floor(timeUntilDeadline / (60 * 60 * 1000))}`,
                requireInteraction: true,
                silent: false,
                timestamp: Date.now()
              });

              notification.onclick = () => {
                window.focus();
                notification.close();
              };
            } catch (error) {
              console.error('Error creating deadline notification:', error);
            }
          }
        });
      };

      checkDeadlines();
      interval = setInterval(checkDeadlines, 60000); // Check every minute
    };

    initializeNotifications();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [todos, requestPermission]);

  return {
    requestPermission,
    simpleTest
  };
}

export default useNotifications; 
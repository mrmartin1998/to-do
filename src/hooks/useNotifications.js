import { useCallback, useEffect, useRef } from 'react';

function useNotifications(todos) {
  // Keep track of sent notifications
  const sentNotifications = useRef(new Set());

  const simpleTest = useCallback(async () => {
    try {
      if (!("Notification" in window)) {
        alert("This browser does not support notifications");
        return;
      }

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Notification permission denied');
          return;
        }
      }

      new Notification('Todo Reminder', {
        body: 'This is a test notification. Notifications are working!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: true
      });

    } catch (error) {
      console.error('Notification error:', error);
      alert(`Error: ${error.message}`);
    }
  }, []);

  // Check for upcoming deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      todos.forEach(todo => {
        if (todo.completed || !todo.deadline) return;
        
        const deadline = new Date(todo.deadline);
        const now = new Date();
        const timeUntilDeadline = deadline.getTime() - now.getTime();
        
        // Create unique notification keys for different time thresholds
        const notificationKeys = {
          hour: `${todo.id}-hour`,
          day: `${todo.id}-day`,
          overdue: `${todo.id}-overdue`
        };

        if (timeUntilDeadline > 0 && timeUntilDeadline <= 60 * 60 * 1000 && !sentNotifications.current.has(notificationKeys.hour)) {
          // 1 hour notification
          new Notification('Todo Deadline Alert', {
            body: `Task "${todo.title}" is due in less than an hour!`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `deadline-${todo.id}`,
            requireInteraction: true
          });
          sentNotifications.current.add(notificationKeys.hour);
        } else if (timeUntilDeadline > 0 && timeUntilDeadline <= 24 * 60 * 60 * 1000 && !sentNotifications.current.has(notificationKeys.day)) {
          // 24 hours notification
          new Notification('Todo Deadline Alert', {
            body: `Task "${todo.title}" is due in less than 24 hours!`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `deadline-${todo.id}`,
            requireInteraction: true
          });
          sentNotifications.current.add(notificationKeys.day);
        } else if (timeUntilDeadline < 0 && timeUntilDeadline > -60 * 1000 && !sentNotifications.current.has(notificationKeys.overdue)) {
          // Just overdue notification
          new Notification('Todo Deadline Alert', {
            body: `Task "${todo.title}" is now overdue!`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `deadline-${todo.id}`,
            requireInteraction: true
          });
          sentNotifications.current.add(notificationKeys.overdue);
        }
      });
    };

    // Check deadlines every minute
    const interval = setInterval(checkDeadlines, 60000);
    
    // Initial check
    checkDeadlines();

    return () => {
      clearInterval(interval);
      // Clear sent notifications when component unmounts
      sentNotifications.current.clear();
    };
  }, [todos]);

  return { simpleTest };
}

export default useNotifications; 
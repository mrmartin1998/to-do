import { useCallback, useEffect } from 'react';

function useNotifications(todos) {
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
        
        // Notify for tasks:
        // - Due in 24 hours
        // - Due in 1 hour
        // - Just overdue
        if (
          (timeUntilDeadline > 0 && timeUntilDeadline <= 60 * 60 * 1000) || // 1 hour
          (timeUntilDeadline > 0 && timeUntilDeadline <= 24 * 60 * 60 * 1000) || // 24 hours
          (timeUntilDeadline < 0 && timeUntilDeadline > -60 * 1000) // Just overdue
        ) {
          const message = timeUntilDeadline < 0
            ? `Task "${todo.title}" is now overdue!`
            : timeUntilDeadline <= 60 * 60 * 1000
            ? `Task "${todo.title}" is due in less than an hour!`
            : `Task "${todo.title}" is due in less than 24 hours!`;

          new Notification('Todo Deadline Alert', {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `deadline-${todo.id}`,
            requireInteraction: true
          });
        }
      });
    };

    // Check deadlines every minute
    const interval = setInterval(checkDeadlines, 60000);
    
    // Initial check
    checkDeadlines();

    return () => clearInterval(interval);
  }, [todos]);

  return { simpleTest };
}

export default useNotifications; 
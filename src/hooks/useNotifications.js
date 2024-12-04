import { useEffect } from 'react';

function useNotifications(todos) {
  useEffect(() => {
    // Request notification permission when the hook is first used
    const requestPermission = async () => {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    };
    requestPermission();

    // Check for upcoming deadlines every minute
    const checkDeadlines = () => {
      todos.forEach(todo => {
        if (todo.completed || !todo.deadline) return;
        
        const deadline = new Date(todo.deadline);
        const now = new Date();
        const timeUntilDeadline = deadline - now;
        
        // Notify 1 hour before deadline
        if (timeUntilDeadline > 0 && timeUntilDeadline <= 60 * 60 * 1000) {
          new Notification('Todo Deadline Approaching!', {
            body: `"${todo.title}" is due in less than an hour!`,
            icon: '/favicon.ico'
          });
        }
      });
    };

    const interval = setInterval(checkDeadlines, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [todos]);
}

export default useNotifications; 
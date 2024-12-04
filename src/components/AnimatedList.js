import { useState, useEffect } from 'react';

function AnimatedList({ items, renderItem }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`transform transition-all duration-300 ease-in-out
            ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-0'}
            ${index > 0 ? 'delay-[' + (index * 100) + 'ms]' : ''}`}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default AnimatedList; 
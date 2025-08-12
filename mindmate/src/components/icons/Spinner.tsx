import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex space-x-1.5">
      <div className="w-2 h-2 bg-zinc-500 dark:bg-white/70 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-zinc-500 dark:bg-white/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-zinc-500 dark:bg-white/70 rounded-full animate-bounce"></div>
    </div>
  );
};

export default Spinner;
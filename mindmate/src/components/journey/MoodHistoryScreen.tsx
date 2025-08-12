


import React, { useState } from 'react';
import { MoodsRow } from '../../types';
import { BackIcon } from '../icons/NavIcons';
import MoodHistoryItem from './MoodHistoryItem';

interface MoodHistoryScreenProps {
  moods: MoodsRow[];
  isLoading: boolean;
  justAddedId: string | null;
  onBack: () => void;
  onDeleteMoods: (ids: string[]) => Promise<boolean>;
}

const MoodHistoryScreen: React.FC<MoodHistoryScreenProps> = ({ moods, isLoading, justAddedId, onBack, onDeleteMoods }) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleItemPress = (id: string) => {
    if (isSelectionMode) {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      setSelectedIds(newSelectedIds);
    }
  };

  const handleItemLongPress = (id: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds(new Set([id]));
    }
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} mood entries? This action cannot be undone.`)) {
      setIsDeleting(true);
      const idsToDelete = Array.from(selectedIds);
      
      await onDeleteMoods(idsToDelete);

      // Always exit selection mode after a delete attempt to avoid getting stuck.
      setIsSelectionMode(false);
      setSelectedIds(new Set());
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-slideInFromRight">
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 pt-20">
        {isSelectionMode ? (
          <button
            onClick={handleCancelSelection}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full font-semibold text-sm"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={onBack}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full"
            aria-label="Go back to mood tracker"
          >
            <BackIcon />
          </button>
        )}
        <h1 className="text-lg font-serif font-bold">
          {isSelectionMode ? `${selectedIds.size} Selected` : 'Full History'}
        </h1>
        <div className="w-16"></div>
      </header>
      
      <main className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center text-[var(--text-secondary)] py-16">
            <p>Loading history...</p>
          </div>
        ) : moods.length > 0 ? (
          <ul className="space-y-3">
            {moods.map((entry) => (
              <MoodHistoryItem
                key={entry.id}
                entry={entry}
                isSelected={selectedIds.has(entry.id)}
                onPress={handleItemPress}
                onLongPress={handleItemLongPress}
                justAddedId={justAddedId}
              />
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center text-[var(--text-secondary)] py-16">
            <p>Your mood history will appear here.</p>
          </div>
        )}
      </main>

      {isSelectionMode && (
        <footer className="flex-shrink-0 p-4 border-t border-[var(--card-border)] animate-fadeInUp">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || isDeleting}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-full disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
          </button>
        </footer>
      )}
    </div>
  );
};

export default MoodHistoryScreen;
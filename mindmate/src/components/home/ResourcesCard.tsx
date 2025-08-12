
import React from 'react';
import { View } from '../../types';
import { ResourcesIcon } from '../icons/NavIcons';

interface ResourcesCardProps {
    onNavigate: (view: View) => void;
}

const ResourcesCard: React.FC<ResourcesCardProps> = ({ onNavigate }) => {
    return (
        <button
            onClick={() => onNavigate('resources')}
            className="w-full h-full glass-card rounded-2xl p-4 flex flex-col justify-between items-center text-center min-h-[160px] hover:bg-zinc-500/5 transition-colors duration-200"
        >
            <div className="flex flex-col items-center justify-center flex-grow">
                 <div className="p-3 bg-[var(--brand-primary-glass)] rounded-full mb-3">
                     <ResourcesIcon />
                </div>
                <h2 className="font-serif font-bold text-base">Explore Resources</h2>
                <p className="text-[var(--text-secondary)] text-xs mt-1">Tools for wellness</p>
            </div>
        </button>
    );
};

export default ResourcesCard;
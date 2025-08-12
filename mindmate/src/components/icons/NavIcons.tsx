

import React from 'react';

interface IconProps {
    isActive?: boolean;
    className?: string;
}

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 ${className || ''}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        {children}
    </svg>
);

const FilledIconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
     <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 ${className || ''}`} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
    >
        {children}
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ isActive }) => {
    if (isActive) {
        return (
            <FilledIconWrapper>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
            </FilledIconWrapper>
        );
    }
    return (
        <IconWrapper>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </IconWrapper>
    );
};

export const ChatIcon: React.FC<IconProps> = ({ isActive }) => {
    if (isActive) {
        return (
            <FilledIconWrapper>
                 <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </FilledIconWrapper>
        );
    }
    return (
        <IconWrapper>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </IconWrapper>
    );
};

export const MoodIcon: React.FC<IconProps> = ({ isActive }) => {
    if (isActive) {
        return (
            <FilledIconWrapper>
                 <path d="M11.99 2C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM8.5 8c.83 0 1.5.67 1.5 1.5S9.33 11 8.5 11s-1.5-.67-1.5-1.5S7.67 8 8.5 8zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3.5 9.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
            </FilledIconWrapper>
        );
    }
    return (
        <IconWrapper>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
        </IconWrapper>
    );
};

export const ResourcesIcon: React.FC<IconProps> = ({ isActive }) => {
    if (isActive) {
        return (
            <FilledIconWrapper>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.082l-6.805 3.588A.75.75 0 014.12 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
            </FilledIconWrapper>
        );
    }
    return (
        <IconWrapper>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </IconWrapper>
    );
};

export const ProfileIcon: React.FC = () => (
    <IconWrapper>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </IconWrapper>
);

export const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
       <polyline points="15 18 9 12 15 6" />
    </IconWrapper>
);

export const HistoryIcon: React.FC = () => (
    <IconWrapper>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </IconWrapper>
);
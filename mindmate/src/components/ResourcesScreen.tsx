
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import ForYouCard from './resources/ForYouCard';
import BoxBreathingTool from './resources/BoxBreathingTool';
import TaskDestresserTool from './resources/TaskDestresserTool';
import ThoughtReframerTool from './resources/ThoughtReframerTool';
import { MoodsRow, MoodEnum } from '../types';
import { MOOD_CONFIG } from '../constants';

interface ResourcesScreenProps {
    moods: MoodsRow[];
}

const forYouGradient = {
    light: ['#f9a8d4', '#f472b6', '#2dd4bf'], // Orchid Pink, Hot Pink, Bright Teal
    dark: ['#68011d', '#970197', '#df1672']
};

const resourceTools = [
  {
    id: "mindfulness",
    title: "Mindfulness & Relaxation",
    component: BoxBreathingTool,
    gradient: {
        light: ['#c084fc', '#a855f7', '#9333ea'], // Vibrant Purple, Intense Purple, Violet
        dark: ['#480048', '#aa4b6b', '#6b275a']
    }
  },
  {
    id: "stress",
    title: "Stress Management",
    component: TaskDestresserTool,
    gradient: {
        light: ['#fcd34d', '#fb923c', '#f87171'], // Amber, Orange, Red
        dark: ['#c56b48', '#ee7997', '#f99f96']
    }
  },
  {
    id: "reframing",
    title: "Cognitive Reframing",
    component: ThoughtReframerTool,
    gradient: {
        light: ['#7dd3fc', '#38bdf8', '#0ea5e9'], // Sky Blue, Intense Sky Blue, Steel Blue
        dark: ['#012954', '#1a4f91', '#3b79b6']
    }
  }
];

// --- Color Interpolation Helpers ---
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const interpolateColor = (colorA: string, colorB: string, factor: number): string => {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);

  if (!rgbA || !rgbB) return colorA; // Fallback

  const r = Math.round(rgbA.r + factor * (rgbB.r - rgbA.r));
  const g = Math.round(rgbA.g + factor * (rgbB.g - rgbA.g));
  const b = Math.round(rgbA.b + factor * (rgbB.b - rgbA.b));

  return `rgb(${r}, ${g}, ${b})`;
};

const DynamicBackgroundPortal: React.FC<{ backgroundStyle: React.CSSProperties; isScrolling: boolean }> = ({ backgroundStyle, isScrolling }) => {
    const portalRoot = document.getElementById('dynamic-bg-root');
    if (!portalRoot) return null;

    const combinedStyle: React.CSSProperties = {
        ...backgroundStyle,
        transition: 'background 150ms linear',
    };

    const background = (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="relative w-full max-w-md h-full max-h-[900px] rounded-3xl overflow-hidden z-0">
                <div
                    className={`absolute inset-0 ${isScrolling ? 'animate-gradient-pan' : ''}`}
                    style={combinedStyle}
                    aria-hidden="true"
                />
            </div>
        </div>
    );
    return createPortal(background, portalRoot);
};

const ResourcesScreen: React.FC<ResourcesScreenProps> = ({ moods }) => {
    const { theme } = useTheme();
    const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
    const [isScrolling, setIsScrolling] = useState(false);
    const [cardScales, setCardScales] = useState<Record<string, number>>({});
    const screenContainerRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<number | null>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const sortedResources = useMemo(() => {
        const recentMoods = moods.slice(0, 3);
        if (recentMoods.length === 0) return resourceTools;

        const averageMoodValue = recentMoods.reduce((acc, mood) => acc + MOOD_CONFIG[mood.mood].value, 0) / recentMoods.length;
        
        if (averageMoodValue < MOOD_CONFIG.Okay.value) {
            return [...resourceTools].sort((a, b) => {
                if (a.id === 'stress' || a.id === 'reframing') return -1;
                if (b.id === 'stress' || b.id === 'reframing') return 1;
                return 0;
            });
        }
        return resourceTools;
    }, [moods]);

    const allCards = useMemo(() => [{ id: 'for-you', gradient: forYouGradient }, ...sortedResources], [sortedResources]);

    useEffect(() => {
        pageRefs.current = pageRefs.current.slice(0, allCards.length);
    }, [allCards]);

    useEffect(() => {
        const initialColors = theme === 'dark' ? allCards[0].gradient.dark : allCards[0].gradient.light;
        setBackgroundStyle({
            background: `linear-gradient(160deg, ${initialColors.join(', ')})`,
            backgroundSize: '200% 200%',
        });
        
        const scrollContainer = screenContainerRef.current?.parentElement;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const pageHeight = pageRefs.current[0]?.offsetHeight;
            if (!pageHeight) return;

            const { scrollTop, clientHeight } = scrollContainer;
            
            const gradientTotalScrollable = (allCards.length - 1) * pageHeight;
            const clampedScrollTop = Math.min(scrollTop, gradientTotalScrollable);
            const scrollProgress = gradientTotalScrollable > 0 ? clampedScrollTop / gradientTotalScrollable : 0;
            const cardProgress = scrollProgress * (allCards.length - 1);
            const fromIndex = Math.floor(cardProgress);
            const toIndex = Math.min(fromIndex + 1, allCards.length - 1);
            const factor = cardProgress - fromIndex;
            
            const fromGradient = theme === 'dark' ? allCards[fromIndex].gradient.dark : allCards[fromIndex].gradient.light;
            const toGradient = theme === 'dark' ? allCards[toIndex].gradient.dark : allCards[toIndex].gradient.light;
            const newColors = fromGradient.map((color, i) => interpolateColor(color, toGradient[i], factor));
            
            setBackgroundStyle({
                background: `linear-gradient(160deg, ${newColors.join(', ')})`,
                backgroundSize: '200% 200%',
            });

            const viewportCenter = clientHeight / 2;
            const newScales: Record<string, number> = {};
            pageRefs.current.forEach((pageEl, index) => {
                if (!pageEl) return;
                const cardId = allCards[index].id;
                const { top, height } = pageEl.getBoundingClientRect();
                if (height === 0) return;

                const pageCenter = top + height / 2;
                const distance = Math.abs(viewportCenter - pageCenter);
                const scale = Math.max(1.0, 1.05 - (distance / viewportCenter) * 0.05);
                newScales[cardId] = scale;
            });
            setCardScales(newScales);

            setIsScrolling(true);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = window.setTimeout(() => setIsScrolling(false), 150);
        };
        
        const initTimeoutId = setTimeout(() => {
            handleScroll();
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        }, 100);

        return () => {
            clearTimeout(initTimeoutId);
            scrollContainer.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [theme, allCards]);

    return (
        <div ref={screenContainerRef} className="h-full">
            <DynamicBackgroundPortal backgroundStyle={backgroundStyle} isScrolling={isScrolling} />
            
            <div 
                ref={(el) => { if (el) pageRefs.current[0] = el; }}
                className="h-full w-full snap-center flex items-center justify-center px-6 pb-8"
            >
                <div className="flex flex-col items-center">
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Tips & Resources</h1>
                        <p className="text-[var(--text-secondary)] dark:text-white mt-1">Tools and support to help you on your journey.</p>
                    </header>
                    <ForYouCard moods={moods} scale={cardScales['for-you'] || 1} />
                </div>
            </div>

            {sortedResources.map((resource, index) => {
                const Component = resource.component;
                return (
                    <div 
                        key={resource.id} 
                        className="h-full w-full snap-center flex items-center justify-center px-6 pb-8"
                        ref={(el) => { if (el) pageRefs.current[index + 1] = el; }}
                    >
                        <Component 
                            scale={cardScales[resource.id] || 1} 
                            isScrolling={isScrolling}
                        />
                    </div>
                );
            })}
            
            {/* This div adds empty space at the end of the scroll container, 
                allowing the final card to properly snap to the center of the viewport. */}
            <div className="h-[40vh]" aria-hidden="true" />
        </div>
    );
};

export default ResourcesScreen;
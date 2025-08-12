
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { MoodsRow } from '../../types';
import { MOOD_CONFIG } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';
import { Mood } from '../../types';

interface MoodChartProps {
  data: MoodsRow[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div className="glass-card p-3 rounded-lg shadow-lg">
        <p className="label text-sm text-[var(--text-secondary)]">{`${new Date(label).toLocaleDateString()}`}</p>
        <p className="intro text-md font-bold text-[var(--text-primary)]">{`Mood: ${entry.mood}`}</p>
        {entry.notes && <p className="desc text-xs text-[var(--text-secondary)] max-w-xs">{`Notes: ${entry.notes}`}</p>}
      </div>
    );
  }

  return null;
};

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
    const { theme } = useTheme();

    const chartData = data.map(entry => ({
        ...entry,
        moodValue: MOOD_CONFIG[entry.mood as Mood].value,
    })).sort((a,b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());

    const strokeColor = theme === 'dark' ? 'rgba(234, 234, 234, 0.8)' : 'rgba(61, 61, 61, 0.8)';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const lineColor = 'var(--brand-primary)';
    const activeDotFill = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
            dataKey="created_at" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke={strokeColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <YAxis 
            dataKey="moodValue" 
            domain={[0, 6]} 
            tickCount={6}
            tickFormatter={(value) => {
                const mood = Object.keys(MOOD_CONFIG).find(key => MOOD_CONFIG[key as keyof typeof MOOD_CONFIG].value === value);
                return mood || '';
            }}
            stroke={strokeColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--brand-primary)', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5 }} />
        <Legend wrapperStyle={{fontSize: "14px", color: strokeColor, display: 'none' }} />
        <Line 
            type="monotone" 
            dataKey="moodValue" 
            name="Mood Level"
            stroke={lineColor}
            strokeWidth={2.5}
            dot={{ r: 4, fill: lineColor, stroke: 'none' }}
            activeDot={{ r: 8, stroke: lineColor, strokeWidth: 2, fill: activeDotFill }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodChart;
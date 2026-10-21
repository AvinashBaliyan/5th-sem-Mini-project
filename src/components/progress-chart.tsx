"use client";

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import type { BenchmarkZones } from '@/lib/benchmarks';

type TestType = 'jump-height' | 'sit-ups' | 'run-time' | 'squats' | 'lunges' | 'push-ups' | 'all';

interface ProgressChartProps {
  data: any[];
  testType: TestType;
  zones?: BenchmarkZones;
}

export function ProgressChart({ data, testType, zones }: ProgressChartProps) {
    const chartData = useMemo(() => {
        return data.map(item => ({
            ...item,
            date: format(parseISO(item.date), 'MMM d'),
        }));
    }, [data]);

    const nameMapping = {
      'jump-height': 'Vertical Jump',
      'sit-ups': 'Sit-ups',
      'run-time': '40-yard Dash',
      'squats': 'Squats',
      'lunges': 'Lunges',
      'push-ups': 'Push-ups',
    }

  const chartConfig = {
    'jump-height': {
      label: 'Jump Height (m)',
      color: 'hsl(var(--chart-1))',
    },
    'sit-ups': {
      label: 'Sit-ups (reps)',
      color: 'hsl(var(--chart-2))',
    },
    'run-time': {
      label: 'Run Time (s)',
      color: 'hsl(var(--chart-3))',
    },
    'squats': {
      label: 'Squats (reps)',
      color: 'hsl(var(--chart-4))',
    },
    'lunges': {
      label: 'Lunges (reps)',
      color: 'hsl(var(--chart-5))',
    },
    'push-ups': {
      label: 'Push-ups (reps)',
      color: 'hsl(var(--chart-2))',
    },
    score: {
      label: 'Score',
      color: 'hsl(var(--chart-1))',
    },
  };
  
  const yAxisDomain = useMemo(() => {
    if (!zones || data.length === 0) return ['auto', 'auto'];

    const values = data.map(d => d.score);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    
    const zoneMin = Math.min(zones.red.y1, zones.orange.y1, zones.green.y1);
    const zoneMax = Math.max(zones.red.y2, zones.orange.y2, zones.green.y2);

    const finalMin = Math.min(dataMin, zoneMin);
    const finalMax = Math.max(dataMax, zoneMax);

    const padding = (finalMax - finalMin) * 0.1;

    if (testType === 'run-time') {
         return [Math.max(0, finalMin - padding), finalMax + padding];
    }

    return [Math.max(0, finalMin - padding), finalMax + padding];

  }, [data, zones, testType]);
  

  const getZoneForArea = (zoneName: 'red' | 'orange' | 'green') => {
      if (!zones) return { y1: 0, y2: 0 };
      const zone = zones[zoneName];
      const isLowerBetter = testType === 'run-time';

      let { y1, y2 } = zone;

      if (y1 === (isLowerBetter ? 'dataMax' : 'dataMin')) y1 = yAxisDomain[0] as number;
      if (y2 === (isLowerBetter ? 'dataMin' : 'dataMax')) y2 = yAxisDomain[1] as number;

      return { y1, y2 };
  }

  return (
     <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          {testType === 'all' ? (
             <>
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" label={{ value: "Height (m) / Reps", angle: -90, position: 'insideLeft' }}/>
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" label={{ value: "Time (s)", angle: -90, position: 'insideRight' }}/>
             </>
          ) : (
            <YAxis yAxisId="left" domain={yAxisDomain} />
          )}
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          {zones && testType !== 'all' && (
            <>
                <ReferenceArea yAxisId="left" {...getZoneForArea('red')} stroke="hsl(var(--destructive) / 0.2)" strokeOpacity={0.3} fill="hsl(var(--destructive) / 0.1)" />
                <ReferenceArea yAxisId="left" {...getZoneForArea('orange')} stroke="hsl(var(--primary) / 0.2)" strokeOpacity={0.3} fill="hsl(var(--primary) / 0.1)" />
                <ReferenceArea yAxisId="left" {...getZoneForArea('green')} stroke="hsl(140 80% 40% / 0.2)" strokeOpacity={0.3} fill="hsl(140 80% 40% / 0.1)" />
            </>
          )}

          {testType === 'all' ? (
            <>
              <Line yAxisId="left" type="monotone" dataKey="jump-height" name="Jump Height" stroke={chartConfig['jump-height'].color} strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="sit-ups" name="Sit-ups" stroke={chartConfig['sit-ups'].color} strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="run-time" name="Run Time" stroke={chartConfig['run-time'].color} strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="squats" name="Squats" stroke={chartConfig['squats'].color} strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="lunges" name="Lunges" stroke={chartConfig['lunges'].color} strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="push-ups" name="Push-ups" stroke={chartConfig['push-ups'].color} strokeWidth={2} dot={false} />
            </>
          ) : (
             <Line yAxisId="left" type="monotone" dataKey="score" name={nameMapping[testType]} stroke={chartConfig[testType]?.color || chartConfig.score.color} strokeWidth={2} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

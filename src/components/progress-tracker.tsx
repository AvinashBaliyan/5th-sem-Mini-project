"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPerformanceData } from '@/lib/mock-data';
import { ProgressChart } from './progress-chart';
import { ProgressTable } from './progress-table';
import { useMemo } from 'react';
import { getBenchmarkZones, BenchmarkZones } from '@/lib/benchmarks';

type TestType = 'jump-height' | 'sit-ups' | 'run-time' | 'squats' | 'lunges' | 'push-ups' | 'all';

export function ProgressTracker() {
  const [selectedTest, setSelectedTest] = useState<TestType>('all');

  const filteredTableData = useMemo(() => mockPerformanceData.filter(
    (record) => selectedTest === 'all' || record.assessmentTest === selectedTest
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [selectedTest]);
  
  const chartData = useMemo(() => {
    const sortedData = [...mockPerformanceData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (selectedTest === 'all') {
      const dataByDate = sortedData.reduce((acc, record) => {
          if (!acc[record.date]) {
              acc[record.date] = { date: record.date };
          }
          acc[record.date][record.assessmentTest] = record.score;
          return acc;
      }, {} as Record<string, any>);
      return Object.values(dataByDate);
    }
    return sortedData.filter(record => record.assessmentTest === selectedTest);
  }, [selectedTest]);

  const benchmarkZones = useMemo(() => {
    if (selectedTest === 'all' || chartData.length === 0) return undefined;
    
    // Using the latest record's age and gender for benchmark context
    const latestRecord = chartData[chartData.length -1];
    return getBenchmarkZones(selectedTest, latestRecord.age, latestRecord.gender);

  }, [selectedTest, chartData]);


  const testOptions: { value: TestType; label: string }[] = [
    { value: 'all', label: 'All Tests' },
    { value: 'jump-height', label: 'Vertical Jump Height' },
    { value: 'sit-ups', label: 'Sit-ups' },
    { value: 'run-time', label: '40-yard Dash' },
    { value: 'squats', label: 'Squats' },
    { value: 'lunges', label: 'Lunges' },
    { value: 'push-ups', label: 'Push-ups' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your assessment scores over the last 6 months.</CardDescription>
            </div>
            <div className="w-48">
                 <Select onValueChange={(value: TestType) => setSelectedTest(value)} defaultValue={selectedTest}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a test" />
                    </SelectTrigger>
                    <SelectContent>
                        {testOptions.map(option => (
                             <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ProgressChart 
              data={chartData} 
              testType={selectedTest}
              zones={benchmarkZones}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>A detailed log of all your submitted assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressTable data={filteredTableData} />
        </CardContent>
      </Card>
    </div>
  );
}

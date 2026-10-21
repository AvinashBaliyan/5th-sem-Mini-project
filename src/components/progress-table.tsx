'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PerformanceRecord } from '@/lib/mock-data';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

interface ProgressTableProps {
  data: PerformanceRecord[];
}

const testNameMapping = {
    'jump-height': 'Vertical Jump',
    'sit-ups': 'Sit-ups',
    'run-time': '40-yard Dash',
    'squats': 'Squats',
    'lunges': 'Lunges',
    'push-ups': 'Push-ups',
}

const unitMapping = {
    'jump-height': 'm',
    'sit-ups': 'reps',
    'run-time': 's',
    'squats': 'reps',
    'lunges': 'reps',
    'push-ups': 'reps',
}

export function ProgressTable({ data }: ProgressTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Test</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? data.map((record, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{format(new Date(record.date), "MMMM d, yyyy")}</TableCell>
            <TableCell>
              <Badge variant="outline">{testNameMapping[record.assessmentTest]}</Badge>
            </TableCell>
            <TableCell className="text-right">{record.score.toFixed(2)} {unitMapping[record.assessmentTest]}</TableCell>
          </TableRow>
        )) : (
            <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No assessment history found.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

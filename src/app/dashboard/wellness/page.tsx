

'use client';

import { MentalWellnessJournal } from "@/components/mental-wellness-journal";
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry';
import { useState } from "react";
import { DailyYogaSession } from "@/components/daily-yoga-session";
import { dailyYogaPoses } from "@/lib/yoga-poses";

export default function WellnessPage() {
  const [analysisFeedback, setAnalysisFeedback] = useState<AnalyzeJournalEntryOutput | null>(null);

  const suggestedYogaPose = analysisFeedback?.suggestedPose 
    ? dailyYogaPoses.find(p => p.name === analysisFeedback.suggestedPose) 
    : undefined;

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Mental Wellness Hub</h2>
          <p className="text-muted-foreground">
            A quiet space to check in with yourself and find balance.
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
            <MentalWellnessJournal 
                feedback={analysisFeedback}
                onFeedbackChange={setAnalysisFeedback}
            />
        </div>
      </div>
    </div>
  );
}

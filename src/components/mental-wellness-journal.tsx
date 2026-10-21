'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles, Lightbulb, HelpCircle, Activity, Quote } from 'lucide-react';
import { analyzeJournalEntry } from '@/ai/flows/analyze-journal-entry';
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry';
import { Separator } from './ui/separator';

const feelings = ['Happy', 'Calm', 'Okay', 'Anxious', 'Sad', 'Stressed'];

interface MentalWellnessJournalProps {
  feedback: AnalyzeJournalEntryOutput | null;
  onFeedbackChange: (feedback: AnalyzeJournalEntryOutput | null) => void;
}

export function MentalWellnessJournal({ feedback, onFeedbackChange }: MentalWellnessJournalProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFeelingClick = (feeling: string) => {
    setSelectedFeeling(feeling);
  };

  const handleJournalSubmit = async () => {
    if (!journalEntry.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Journal',
        description: 'Please write a few words about how you are feeling.',
      });
      return;
    }

    setIsSubmitting(true);
    onFeedbackChange(null);
    
    try {
      const result = await analyzeJournalEntry({ 
        feeling: selectedFeeling || undefined, 
        entry: journalEntry 
      });
      onFeedbackChange(result);
      toast({
        title: 'Entry Saved',
        description: 'Your journal entry has been saved and reflected upon.',
      });
    } catch (error) {
      console.error("Error analyzing journal entry:", error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get feedback at this time. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Daily Check-in</CardTitle>
          <CardDescription>Take a moment to reflect and write down what's on your mind.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="journal" className="text-sm font-medium">Your thoughts</label>
            <Textarea
              id="journal"
              placeholder="Write about your thoughts, feelings, or whatever is on your mind..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              rows={8}
            />
          </div>
          <div>
            <label className="text-sm font-medium">How are you feeling today? (Optional)</label>
            <div className="flex flex-wrap gap-2 pt-2">
              {feelings.map((feeling) => (
                <Button
                  key={feeling}
                  variant={selectedFeeling === feeling ? 'default' : 'outline'}
                  onClick={() => handleFeelingClick(feeling)}
                >
                  {feeling}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleJournalSubmit} disabled={!journalEntry || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Journal Entry'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Your Reflection</CardTitle>
          <CardDescription>AI-powered feedback on your entry.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isSubmitting && (
            <div className="text-center text-muted-foreground p-8">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p>Analyzing your thoughts...</p>
            </div>
          )}
          {!isSubmitting && feedback && (
            <div className="space-y-4 text-sm w-full">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-2 rounded-full">
                  <Quote className="h-5 w-5"/>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Thought for the Day</h4>
                  <p className="text-muted-foreground italic">"{feedback.thought}"</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Lightbulb className="h-5 w-5"/>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Key Insight</h4>
                  <p className="text-muted-foreground italic">"{feedback.insight}"</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-2 rounded-full">
                  <HelpCircle className="h-5 w-5"/>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Reflective Question</h4>
                  <p className="text-muted-foreground">{feedback.question}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="bg-secondary p-2 rounded-full">
                  <Activity className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Suggested Action</h4>
                  <p className="text-muted-foreground">{feedback.action}</p>
                </div>
              </div>
            </div>
          )}
          {!isSubmitting && !feedback && (
            <div className="text-center text-muted-foreground p-8">
              <Sparkles className="h-10 w-10 mx-auto mb-4" />
              <p>Your AI-generated feedback will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

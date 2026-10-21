'use server';

/**
 * @fileOverview Analyzes a user's journal entry to provide empathetic and structured feedback.
 *
 * - analyzeJournalEntry - A function that handles the journal analysis.
 * - AnalyzeJournalEntryInput - The input type for the analyzeJournalEntry function.
 * - AnalyzeJournalEntryOutput - The return type for the analyzeJournalEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalEntryInputSchema = z.object({
  feeling: z.string().optional().describe("The feeling the user selected (e.g., 'Happy', 'Sad')."),
  entry: z.string().describe("The user's written journal entry."),
});
export type AnalyzeJournalEntryInput = z.infer<typeof AnalyzeJournalEntryInputSchema>;

const AnalyzeJournalEntryOutputSchema = z.object({
  insight: z.string().describe("A single, insightful sentence that identifies the core emotion or theme."),
  question: z.string().describe("A gentle, open-ended question to encourage deeper self-reflection."),
  action: z.string().describe("A small, simple, and concrete wellness action the user could take."),
  thought: z.string().describe("A relevant Sanskrit shlok (in Devanagari script, with a transliteration and English meaning) or an inspiring motivational quote that aligns with the user's entry."),
  suggestedPose: z.string().optional().describe("If the suggested action is yoga-related, provide the English name of a single, simple yoga pose (e.g., 'Child\'s Pose', 'Mountain Pose', 'Tree Pose'). Otherwise, leave empty."),
});
export type AnalyzeJournalEntryOutput = z.infer<typeof AnalyzeJournalEntryOutputSchema>;

export async function analyzeJournalEntry(
  input: AnalyzeJournalEntryInput
): Promise<AnalyzeJournalEntryOutput> {
  return analyzeJournalEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJournalEntryPrompt',
  input: {schema: AnalyzeJournalEntryInputSchema},
  output: {schema: AnalyzeJournalEntryOutputSchema},
  prompt: `You are an empathetic and insightful AI wellness coach. Your role is to provide a brief, structured, and encouraging response to a user's journal entry.

Do not provide medical advice. If the entry suggests a serious issue, gently suggest talking to a professional or a trusted person in the "action" field.

The user is feeling: {{{feeling}}}.
Their journal entry is:
"{{{entry}}}"

Based on this, provide the following:
1.  **insight**: A single, insightful sentence that identifies the core emotion or theme from the entry.
2.  **question**: A gentle, open-ended question to encourage deeper self-reflection.
3.  **action**: A small, simple, and concrete wellness action. If you suggest yoga, phrase it like "Try a calming yoga pose like...".
4.  **thought**: A relevant Sanskrit shlok or an inspiring motivational quote. If providing a shlok, it must be in the format: "Shlok in Devanagari (e.g., कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।) - Transliteration (e.g., Karmanye vadhikaraste Ma Phaleshu Kadachana.) - Meaning: Your English translation."
5.  **suggestedPose**: If your suggested action involves yoga, provide the English name of ONE simple, relevant yoga pose (e.g., 'Child\'s Pose', 'Mountain Pose', 'Tree Pose'). Otherwise, this field must be empty.
`,
});

const analyzeJournalEntryFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntryFlow',
    inputSchema: AnalyzeJournalEntryInputSchema,
    outputSchema: AnalyzeJournalEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

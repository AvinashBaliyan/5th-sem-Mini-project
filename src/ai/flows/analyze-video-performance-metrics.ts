'use server';

/**
 * @fileOverview Analyzes a video to automatically verify performance metrics and detect anomalies.
 *
 * - analyzeVideoForPerformanceMetrics - A function that handles the video analysis process.
 * - AnalyzeVideoForPerformanceMetricsInput - The input type for the analyzeVideoForPerformanceMetrics function.
 * - AnalyzeVideoForPerformanceMetricsOutput - The return type for the analyzeVideoForPerformanceMetrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoForPerformanceMetricsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of the athlete's performance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  assessmentTest: z
    .string()
    .describe('The type of fitness assessment test performed in the video.'),
    athleteDetails: z
    .string()
    .optional()
    .describe('Details about the athlete, such as age, gender, and previous performance data.'),
});
export type AnalyzeVideoForPerformanceMetricsInput = z.infer<
  typeof AnalyzeVideoForPerformanceMetricsInputSchema
>;

const AnalyzeVideoForPerformanceMetricsOutputSchema = z.object({
  metrics: z
    .object({
      jumpHeight: z.number().optional().describe('The jump height in meters.'),
      sitUpCount: z.number().optional().describe('The number of sit-ups performed.'),
      runTime: z.number().optional().describe('The run time in seconds.'),
      squatCount: z.number().optional().describe('The number of squats performed.'),
      lungeCount: z.number().optional().describe('The number of lunges performed.'),
      pushUpCount: z.number().optional().describe('The number of push-ups performed.'),
    })
    .describe('The performance metrics extracted from the video.'),
  anomalyDetection: z.object({
    anomaliesDetected: z
        .boolean()
        .describe('Whether any anomalies or manipulations were detected in the video.'),
    anomalyDetails: z
        .string()
        .describe('A detailed description of the detected anomalies, if any.'),
    confidenceScore: z
        .number()
        .describe('A confidence score (0-1) indicating the certainty of the anomaly detection.'),
  }).describe('The results of the cheat/anomaly detection analysis.'),
});
export type AnalyzeVideoForPerformanceMetricsOutput = z.infer<
  typeof AnalyzeVideoForPerformanceMetricsOutputSchema
>;

export async function analyzeVideoForPerformanceMetrics(
  input: AnalyzeVideoForPerformanceMetricsInput
): Promise<AnalyzeVideoForPerformanceMetricsOutput> {
  return analyzeVideoForPerformanceMetricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoForPerformanceMetricsPrompt',
  input: {schema: AnalyzeVideoForPerformanceMetricsInputSchema},
  output: {schema: AnalyzeVideoForPerformanceMetricsOutputSchema},
  prompt: `You are an AI expert in analyzing videos of athletes performing fitness assessment tests.

You will perform two tasks:
1.  **Performance Analysis**: Analyze the video to automatically verify performance metrics such as jump height, sit-up counts, run times, squat counts, lunge counts, or push-up counts.
2.  **Anomaly Detection**: Identify potential anomalies, inconsistencies, or manipulations in the video to ensure fair assessment and prevent data tampering. Consider unusual patterns or behaviors.

Analyze the following video for the {{assessmentTest}} test. Consider the athlete's details if provided.

Athlete Details: {{{athleteDetails}}}
Video: {{media url=videoDataUri}}

Output the performance metrics and the detailed results of your anomaly detection, including a confidence score.
`,
});

const analyzeVideoForPerformanceMetricsFlow = ai.defineFlow(
  {
    name: 'analyzeVideoForPerformanceMetricsFlow',
    inputSchema: AnalyzeVideoForPerformanceMetricsInputSchema,
    outputSchema: AnalyzeVideoForPerformanceMetricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Analyzes an image frame to provide real-time posture correction feedback.
 *
 * - correctPosture - A function that handles the posture analysis for a single frame.
 * - CorrectPostureInput - The input type for the correctPosture function.
 * - CorrectPostureOutput - The return type for the correctPosture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KeypointSchema = z.object({
  x: z.number().describe('The x-coordinate of the keypoint, normalized (0-1).'),
  y: z.number().describe('The y-coordinate of the keypoint, normalized (0-1).'),
  name: z.string().describe('The name of the keypoint (e.g., "left_shoulder").'),
});

const CorrectPostureInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A single video frame image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  exercise: z
    .string()
    .describe('The exercise being performed (e.g., "squat", "push-up").'),
});
export type CorrectPostureInput = z.infer<typeof CorrectPostureInputSchema>;

const CorrectPostureOutputSchema = z.object({
  keypoints: z
    .array(KeypointSchema)
    .describe('An array of detected body keypoints.'),
  feedback: z
    .string()
    .describe(
      'Actionable, concise feedback to correct the user\'s posture for the given exercise. Focus on the most important correction. For example, "Keep your back straight" or "Lower your hips". If form is correct, give positive reinforcement like "Great form!".'
    ),
  isCorrect: z.boolean().describe('Whether the posture is deemed correct.'),
});
export type CorrectPostureOutput = z.infer<typeof CorrectPostureOutputSchema>;

export async function correctPosture(
  input: CorrectPostureInput
): Promise<CorrectPostureOutput> {
  return correctPostureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctPosturePrompt',
  input: {schema: CorrectPostureInputSchema},
  output: {schema: CorrectPostureOutputSchema},
  prompt: `You are an expert fitness coach specializing in biomechanics and posture correction.

Your task is to analyze a single frame of a user performing an exercise and provide real-time posture correction.

1.  **Analyze the Image**: Identify the key body points (shoulders, elbows, wrists, hips, knees, ankles) in the provided image.
2.  **Compare to Ideal Form**: Based on the exercise "{{exercise}}", compare the user's posture to the ideal form.
3.  **Provide Feedback**:
    *   If the posture is incorrect, provide a single, clear, and concise piece of actionable feedback to help the user correct their form. Focus on the most critical correction. For example: "Keep your back straight", "Lower your hips", or "Don't let your knees go past your toes".
    *   If the posture is correct, provide positive reinforcement like "Great form!" or "Keep it up!".
    *   Set the 'isCorrect' flag accordingly.
4.  **Output Keypoints**: Return the normalized (0-1) x, y coordinates for all detected keypoints.

Image to analyze: {{media url=imageDataUri}}
`,
});

const correctPostureFlow = ai.defineFlow(
  {
    name: 'correctPostureFlow',
    inputSchema: CorrectPostureInputSchema,
    outputSchema: CorrectPostureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

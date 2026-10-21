'use server';
/**
 * @fileOverview Generates a personalized diet and workout plan for an athlete.
 *
 * - generatePersonalizedPlan - A function that handles the plan generation process.
 * - GeneratePersonalizedPlanInput - The input type for the generatePersonalizedPlan function.
 * - GeneratePersonalizedPlanOutput - The return type for the generatePersonalizedPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedPlanInputSchema = z.object({
  age: z.number().describe('The age of the athlete.'),
  gender: z.enum(['male', 'female']).describe('The gender of the athlete.'),
  height: z.number().describe('The height of the athlete in centimeters.'),
  weight: z.number().describe('The weight of the athlete in kilograms.'),
  fitnessGoal: z.enum(['weight-loss', 'muscle-gain', 'endurance']).describe('The primary fitness goal.'),
  dietaryPreference: z.enum(['none', 'vegetarian', 'vegan', 'non-veg']).describe('The dietary preference of the athlete.'),
  activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active']).describe('The current activity level of the athlete.'),
});
export type GeneratePersonalizedPlanInput = z.infer<typeof GeneratePersonalizedPlanInputSchema>;

const DailyPlanSchema = z.object({
  day: z.string().describe('The day of the week (e.g., Monday).'),
  workout: z.object({
    title: z.string().describe('The title of the workout for the day.'),
    description: z.string().describe('A brief description of the workout.'),
    exercises: z.array(z.object({
      name: z.string().describe('The name of the exercise.'),
      sets: z.number().describe('The number of sets.'),
      reps: z.string().describe('The number of repetitions (e.g., "8-12" or "30 seconds").'),
    })).describe('A list of exercises for the workout.'),
  }),
  diet: z.object({
    calories: z.number().describe('The total estimated calories for the day.'),
    meals: z.array(z.object({
      name: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']).describe('The name of the meal.'),
      description: z.string().describe('A description of the meal with food items.'),
    })).describe('A list of meals for the day.'),
  }),
});

const GeneratePersonalizedPlanOutputSchema = z.object({
  weeklyPlan: z.array(DailyPlanSchema).describe('A 7-day personalized diet and workout plan.'),
  summary: z.string().describe('A brief summary of the plan and some motivational tips.'),
});
export type GeneratePersonalizedPlanOutput = z.infer<typeof GeneratePersonalizedPlanOutputSchema>;

export async function generatePersonalizedPlan(input: GeneratePersonalizedPlanInput): Promise<GeneratePersonalizedPlanOutput> {
  return generatePersonalizedPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedPlanPrompt',
  input: {schema: GeneratePersonalizedPlanInputSchema},
  output: {schema: GeneratePersonalizedPlanOutputSchema},
  prompt: `You are an expert AI sports nutritionist and personal trainer for the Sports Authority of India (SAI). Your role is to create a comprehensive, personalized 7-day diet and workout plan for an athlete based on their specific details and goals.

The plan should be realistic, balanced, and tailored to Indian dietary habits and available foods where appropriate.

Athlete Details:
- Age: {{{age}}}
- Gender: {{{gender}}}
- Height: {{{height}}} cm
- Weight: {{{weight}}} kg
- Activity Level: {{{activityLevel}}}
- Primary Goal: {{{fitnessGoal}}}
- Dietary Preference: {{{dietaryPreference}}}

Instructions:
1.  **Create a 7-Day Plan**: Generate a detailed plan for each day of the week (Monday to Sunday).
2.  **Workout Plan**: For each day, provide a workout with a title, a short description, and a list of specific exercises with sets and reps. Tailor the workouts to the athlete's goal (e.g., more cardio for weight loss, strength training for muscle gain, combination for endurance). Include at least one rest day.
3.  **Diet Plan**: For each day, provide a diet plan with an estimated total calorie count. Include meal suggestions for Breakfast, Lunch, and Dinner, and optionally a Snack. Ensure the diet aligns with the athlete's dietary preference and fitness goal.
4.  **Summary**: Provide a brief summary of the plan, explaining the approach and offering some motivational tips for the athlete.

Generate the output in the specified JSON format.
`,
});

const generatePersonalizedPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedPlanFlow',
    inputSchema: GeneratePersonalizedPlanInputSchema,
    outputSchema: GeneratePersonalizedPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

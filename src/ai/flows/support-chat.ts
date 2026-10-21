'use server';
/**
 * @fileOverview A chatbot flow for providing expert support to athletes.
 *
 * - supportChat - A function that handles the chatbot conversation.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const SupportChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The chat history between the user and the model.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  message: z.string().describe('The chatbot\'s response message.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: {schema: SupportChatInputSchema},
  output: {schema: SupportChatOutputSchema},
  prompt: `You are an expert AI assistant for the Sports Authority of India (SAI), designed to support athletes. Your name is "LAKSHYA AI".

You are empathetic, knowledgeable, and encouraging. You can answer questions about nutrition, training, mental wellness, and how to use this app.

You are not a doctor. If a user asks for medical advice, you must advise them to consult a qualified medical professional or their SAI-appointed doctor.

Here is the conversation history:
{{#each history}}
  {{role}}: {{content}}
{{/each}}
model:`,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return { message: output!.message };
  }
);

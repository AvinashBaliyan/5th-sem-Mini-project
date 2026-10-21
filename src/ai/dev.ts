'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-video-performance-metrics.ts';
import '@/ai/flows/generate-personalized-plan.ts';
import '@/ai/flows/correct-posture.ts';
import '@/ai/flows/support-chat.ts';
import '@/ai/flows/analyze-journal-entry.ts';
import '@/ai/flows/text-to-speech.ts';

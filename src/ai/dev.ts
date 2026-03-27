import { config } from 'dotenv';
config();

import '@/ai/flows/generate-skill-documentation.ts';
import '@/ai/flows/generate-sustentation-flow.ts';
import '@/ai/flows/simulate-skill-execution.ts';

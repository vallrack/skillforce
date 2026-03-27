'use server';
/**
 * @fileOverview Un flujo para generar un documento de sustentación técnica para una habilidad de IA.
 * Explica conceptos de MCP, orquestación y conexión con agentes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SustentationInputSchema = z.object({
  skillName: z.string(),
  skillPurpose: z.string(),
  problemSolved: z.string(),
  toolsMentioned: z.array(z.string()).optional(),
});

const SustentationOutputSchema = z.object({
  sustentationMarkdown: z.string().describe('El contenido del documento de sustentación en formato Markdown.'),
});

export type SustentationInput = z.infer<typeof SustentationInputSchema>;

export async function generateSustentation(input: SustentationInput) {
  return generateSustentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSustentationPrompt',
  input: {schema: SustentationInputSchema},
  output: {schema: SustentationOutputSchema},
  prompt: `Eres un experto en Arquitectura de Agentes de IA y el Model Context Protocol (MCP).
  
Genera un documento de sustentación profesional para la habilidad: "{{{skillName}}}".
El documento debe estar en ESPAÑOL y contener:

1. **Introducción**: Breve descripción del problema que resuelve: "{{{problemSolved}}}".
2. **Arquitectura y MCP**: Explica cómo esta habilidad se implementaría siguiendo el estándar MCP. Menciona que actúa como un "Server" que expone una "Tool" que el "Client" (un agente) puede invocar.
3. **Conexión con Herramientas**: Detalla cómo se conectaría específicamente con herramientas como Claude Code, Cursor o Gemini CLI (configuración de mcpSettings.json).
4. **Orquestación de Agentes**: Explica el papel de esta habilidad en un flujo multi-agente. Por ejemplo, cómo un "Agente Orquestador" decidiría usar esta herramienta basándose en la descripción del SKILL.md.
5. **Conclusión**: Beneficios de usar este enfoque estandarizado.

Información adicional:
Propósito: {{{skillPurpose}}}
`,
});

const generateSustentationFlow = ai.defineFlow(
  {
    name: 'generateSustentationFlow',
    inputSchema: SustentationInputSchema,
    outputSchema: SustentationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview Un flujo para generar un documento de sustentación técnica para una habilidad de IA.
 * Explica conceptos de MCP, orquestación y conexión con agentes, alineado con las semanas 11-15 del curso.
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
  prompt: `Eres un experto en Arquitectura de Agentes de IA y el Model Context Protocol (MCP), especializado en contenidos de las semanas 11 a 15 del curso.
  
Genera un documento de sustentación profesional para la habilidad: "{{{skillName}}}".
El documento debe estar en ESPAÑOL y contener los siguientes puntos obligatorios:

1. **Introducción y Problema Real**: Explica profundamente el problema: "{{{problemSolved}}}". Detalla por qué una solución basada en agentes es superior a una tradicional.
2. **Arquitectura Técnica y Estándar MCP**: Explica que esta habilidad se ha diseñado bajo el protocolo MCP. Describe el flujo donde el "MCP Server" expone esta "Tool" y el "Agente (Client)" la consume mediante un contrato JSON-RPC.
3. **Integración con Ecosistemas de Agentes**: Detalla paso a paso cómo conectar esta skill con herramientas como Claude Code, Cursor o Gemini CLI utilizando la configuración de mcpSettings.json.
4. **Orquestación Multi-Agente**: Explica cómo un "Orquestador" (como LangGraph o CrewAI) utilizaría esta habilidad dentro de un flujo de trabajo complejo, basándose en la descripción semántica del archivo SKILL.md para la selección de herramientas.
5. **Conclusión**: Resume los beneficios de la estandarización y la interoperabilidad lograda.

Propósito de la habilidad: {{{skillPurpose}}}
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

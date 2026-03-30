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
});

const SustentationOutputSchema = z.object({
  sustentationMarkdown: z.string().describe('El contenido completo y detallado del documento de sustentación en formato Markdown.'),
});

export type SustentationInput = z.infer<typeof SustentationInputSchema>;

export async function generateSustentation(input: SustentationInput) {
  return generateSustentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSustentationPrompt',
  input: {schema: SustentationInputSchema},
  output: {schema: SustentationOutputSchema},
  prompt: `Eres un experto en Arquitectura de Agentes de IA y el estándar Model Context Protocol (MCP). Tu objetivo es redactar un informe de sustentación técnica IMPECABLE y COMPLETO en ESPAÑOL.

No te detengas hasta completar los 5 puntos siguientes para la habilidad: "{{{skillName}}}".

ESTRUCTURA OBLIGATORIA:

1. INTRODUCCIÓN Y PROBLEMA REAL: Analiza profundamente el problema "{{{problemSolved}}}". Explica por qué una solución basada en Agentes con MCP es superior a una API tradicional (autonomía, contexto dinámico).

2. ARQUITECTURA TÉCNICA Y ESTÁNDAR MCP: Describe el flujo técnico. Explica que la habilidad actúa como un "MCP Server" que expone herramientas (Tools) que el "Agente (Client)" consume. Menciona el contrato de entrada/salida y el uso de JSON-RPC.

3. INTEGRACIÓN CON ECOSISTEMAS: Explica cómo un usuario conectaría esta skill a Claude Code o Cursor. Detalla el uso de mcpSettings.json para registrar el servidor y permitir que el LLM "vea" la herramienta.

4. ORQUESTACIÓN MULTI-AGENTE: Explica cómo un orquestador (ej. LangGraph) usaría esta skill. Cómo la descripción semántica en el SKILL.md permite que el agente decida cuándo invocarla durante un razonamiento complejo.

5. CONCLUSIÓN: Beneficios de la interoperabilidad y el futuro de las Agent Skills.

Propósito de la habilidad: {{{skillPurpose}}}

REGLA CRÍTICA: Asegúrate de cerrar todas las ideas. El documento debe ser profesional y listo para una entrega académica.`,
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

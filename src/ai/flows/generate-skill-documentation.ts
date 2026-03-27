'use server';
/**
 * @fileOverview Un flujo para generar documentación de una habilidad de IA, incluyendo ejemplos de uso e instrucciones.
 *
 * - generateSkillDocumentation - Una función que genera documentación en markdown para una habilidad.
 * - GenerateSkillDocumentationInput - El tipo de entrada para la función generateSkillDocumentation.
 * - GenerateSkillDocumentationOutput - El tipo de retorno para la función generateSkillDocumentation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Representa la entrada para generar la documentación de la habilidad.
 */
const GenerateSkillDocumentationInputSchema = z.object({
  skillName: z.string().describe('El nombre de la habilidad.'),
  skillPurpose: z.string().describe('El propósito principal o meta de la habilidad.'),
  problemSolved:
    z.string().describe('Una descripción del problema real que la habilidad busca resolver.'),
  inputSchemaDefinition:
    z.string().describe(
      'Una representación en cadena JSON del esquema Zod para la entrada de la habilidad, incluyendo descripciones para cada campo.'
    ),
  outputSchemaDefinition:
    z.string().describe(
      'Una representación en cadena JSON del esquema Zod para la salida de la habilidad, incluyendo descripciones para cada campo.'
    ),
});
export type GenerateSkillDocumentationInput = z.infer<
  typeof GenerateSkillDocumentationInputSchema
>;

/**
 * Representa la salida para la documentación de la habilidad generada.
 */
const GenerateSkillDocumentationOutputSchema = z.object({
  generatedMarkdown:
    z.string().describe(
      'El contenido markdown generado para la habilidad, incluyendo una descripción, instrucciones claras y al menos un ejemplo de uso con entrada/salida.'
    ),
});
export type GenerateSkillDocumentationOutput = z.infer<
  typeof GenerateSkillDocumentationOutputSchema
>;

/**
 * Genera documentación exhaustiva en markdown para una habilidad de IA basada en su definición.
 *
 * @param input - La entrada que contiene el nombre de la habilidad, propósito, problema resuelto y definiciones de esquema.
 * @returns Una promesa que se resuelve en un objeto que contiene la documentación markdown generada.
 */
export async function generateSkillDocumentation(
  input: GenerateSkillDocumentationInput
): Promise<GenerateSkillDocumentationOutput> {
  return generateSkillDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSkillDocumentationPrompt',
  input: {schema: GenerateSkillDocumentationInputSchema},
  output: {schema: GenerateSkillDocumentationOutputSchema},
  prompt: `Eres un experto escritor de documentación técnica para IA. Tu tarea es generar documentación clara, completa y fácil de usar para una habilidad de IA, adecuada para un archivo SKILL.md.

IMPORTANTE: Toda la documentación DEBE estar escrita íntegramente en ESPAÑOL.

La documentación debe incluir:
1.  **Nombre y Descripción de la Habilidad**: Un resumen claro y conciso de lo que hace la habilidad.
2.  **Problema que Resuelve**: Explicar el problema del mundo real que aborda esta habilidad.
3.  **Instrucciones**: Guía paso a paso sobre cómo usar la habilidad, haciendo referencia a sus entradas y salidas.
4.  **Ejemplos de Uso**: Al menos un ejemplo detallado que demuestre cómo invocar la habilidad, incluyendo una entrada de muestra y la salida esperada en formato JSON, adhiriéndose a los esquemas proporcionados.

Utiliza la siguiente información para generar la documentación:

Nombre de la Habilidad: {{{skillName}}}
Propósito de la Habilidad: {{{skillPurpose}}}
Problema Resuelto: {{{problemSolved}}}

Definición del Esquema de Entrada (JSON):
\`\`\`json
{{{inputSchemaDefinition}}}
\`\`\`

Definición del Esquema de Salida (JSON):
\`\`\`json
{{{outputSchemaDefinition}}}
\`\`\`

Genera el contenido en formato Markdown. Asegúrate de que todos los bloques de código estén formateados correctamente.
`,
});

const generateSkillDocumentationFlow = ai.defineFlow(
  {
    name: 'generateSkillDocumentationFlow',
    inputSchema: GenerateSkillDocumentationInputSchema,
    outputSchema: GenerateSkillDocumentationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

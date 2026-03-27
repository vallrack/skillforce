'use server';
/**
 * @fileOverview Un flujo para simular la ejecución de una habilidad de IA.
 * Recibe el contexto de la habilidad y los datos de entrada del usuario para generar un output coherente.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateSkillInputSchema = z.object({
  skillName: z.string(),
  skillPurpose: z.string(),
  inputProperties: z.array(z.object({
    name: z.string(),
    value: z.any()
  })),
  outputSchemaDefinition: z.string(),
});

const SimulateSkillOutputSchema = z.object({
  executionOutput: z.any().describe('El resultado de la ejecución de la habilidad en formato JSON.'),
  explanation: z.string().describe('Una breve explicación de lo que hizo la herramienta.'),
});

export async function simulateSkillExecution(input: z.infer<typeof SimulateSkillInputSchema>) {
  return simulateSkillExecutionFlow(input);
}

const simulateSkillExecutionFlow = ai.defineFlow(
  {
    name: 'simulateSkillExecutionFlow',
    inputSchema: SimulateSkillInputSchema,
    outputSchema: SimulateSkillOutputSchema,
  },
  async (input) => {
    const inputDataStr = JSON.stringify(input.inputProperties, null, 2);
    
    const {output} = await ai.generate({
      prompt: `Actúa como la implementación técnica de la herramienta de IA: "${input.skillName}".
      
      PROPÓSITO DE LA HERRAMIENTA:
      ${input.skillPurpose}
      
      DATOS DE ENTRADA RECIBIDOS (JSON):
      ${inputDataStr}
      
      ESQUEMA DE SALIDA ESPERADO (JSON):
      ${input.outputSchemaDefinition}
      
      TAREA:
      1. Procesa los datos de entrada según el propósito de la herramienta.
      2. Genera un objeto JSON que cumpla ESTRICTAMENTE con el esquema de salida.
      3. Proporciona una explicación técnica de 1 párrafo sobre el proceso realizado.
      
      Responde SOLO con el JSON de salida y la explicación.`,
      output: { schema: SimulateSkillOutputSchema }
    });

    return output!;
  }
);

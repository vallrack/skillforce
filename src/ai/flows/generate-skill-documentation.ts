'use server';
/**
 * @fileOverview A flow to generate documentation for an AI skill, including usage examples and instructions.
 *
 * - generateSkillDocumentation - A function that generates markdown documentation for a skill.
 * - GenerateSkillDocumentationInput - The input type for the generateSkillDocumentation function.
 * - GenerateSkillDocumentationOutput - The return type for the generateSkillDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Represents the input for generating skill documentation.
 */
const GenerateSkillDocumentationInputSchema = z.object({
  skillName: z.string().describe('The name of the skill.'),
  skillPurpose: z.string().describe('The main purpose or goal of the skill.'),
  problemSolved:
    z.string().describe('A description of the real-world problem the skill aims to solve.'),
  inputSchemaDefinition:
    z.string().describe(
      'A JSON string representation of the Zod schema for the skill\'s input, including descriptions for each field.'
    ),
  outputSchemaDefinition:
    z.string().describe(
      'A JSON string representation of the Zod schema for the skill\'s output, including descriptions for each field.'
    ),
});
export type GenerateSkillDocumentationInput = z.infer<
  typeof GenerateSkillDocumentationInputSchema
>;

/**
 * Represents the output for generated skill documentation.
 */
const GenerateSkillDocumentationOutputSchema = z.object({
  generatedMarkdown:
    z.string().describe(
      'The generated markdown content for the skill, including a description, clear instructions, and at least one usage example with input/output.'
    ),
});
export type GenerateSkillDocumentationOutput = z.infer<
  typeof GenerateSkillDocumentationOutputSchema
>;

/**
 * Generates comprehensive markdown documentation for an AI skill based on its definition.
 *
 * @param input - The input containing skill name, purpose, problem solved, and schema definitions.
 * @returns A promise that resolves to an object containing the generated markdown documentation.
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
  prompt: `You are an expert AI documentation writer. Your task is to generate clear, comprehensive, and user-friendly documentation for an AI skill, suitable for a SKILL.md file.

The documentation should include:
1.  **Skill Name and Description**: A clear, concise summary of what the skill does.
2.  **Problem Solved**: Explain the real-world problem this skill addresses.
3.  **Instructions**: Step-by-step guidance on how to use the skill, referencing its inputs and outputs.
4.  **Usage Examples**: At least one detailed example demonstrating how to invoke the skill, including sample input and expected output in JSON format, adhering to the provided schemas.

Use the following information to generate the documentation:

Skill Name: {{{skillName}}}
Skill Purpose: {{{skillPurpose}}}
Problem Solved: {{{problemSolved}}}

Input Schema Definition (JSON):
\`\`\`json
{{{inputSchemaDefinition}}}
\`\`\`

Output Schema Definition (JSON):
\`\`\`json
{{{outputSchemaDefinition}}}
\`\`\`

Generate the content in Markdown format. Ensure all code blocks are properly formatted.
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

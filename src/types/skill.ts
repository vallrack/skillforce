export type SchemaProperty = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
};

export type SkillDraft = {
  id: string;
  name: string;
  purpose: string;
  problem: string;
  inputProperties: SchemaProperty[];
  outputProperties: SchemaProperty[];
  generatedMarkdown?: string;
  updatedAt: number;
};
import type { SkillDraft } from '@/types/skill';

const STORAGE_KEY = 'skillforge_drafts_v2';

export function getSkills(): SkillDraft[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse skills from storage', e);
    return [];
  }
}

export function getSkill(id: string): SkillDraft | undefined {
  const skills = getSkills();
  return skills.find(s => s.id === id);
}

export function saveSkill(skill: SkillDraft): void {
  const skills = getSkills();
  const index = skills.findIndex(s => s.id === skill.id);
  
  if (index >= 0) {
    skills[index] = { ...skill, updatedAt: Date.now() };
  } else {
    skills.push({ ...skill, updatedAt: Date.now() });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}

export function deleteSkill(id: string): void {
  const skills = getSkills().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}

export function createNewSkill(): SkillDraft {
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: 'Analizador de Código Seguro',
    purpose: 'Analizar fragmentos de código en busca de vulnerabilidades comunes (OWASP Top 10) y proponer correcciones.',
    problem: 'Los desarrolladores a menudo pasan por alto errores de seguridad básicos durante el desarrollo rápido, lo que lleva a vulnerabilidades en producción.',
    inputProperties: [
      { name: 'codigo', type: 'string', description: 'El fragmento de código a analizar', required: true },
      { name: 'lenguaje', type: 'string', description: 'Lenguaje de programación (js, python, etc)', required: true }
    ],
    outputProperties: [
      { name: 'vulnerabilidades', type: 'array', description: 'Lista de hallazgos encontrados', required: true },
      { name: 'sugerencia', type: 'string', description: 'Código corregido propuesto', required: true }
    ],
    studentName: '',
    universityName: '',
    courseName: 'IA Generativa y Agentes',
    updatedAt: Date.now(),
  };
}

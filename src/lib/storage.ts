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
    name: 'Analizador de Código Seguro (Semanas 11-15)',
    purpose: 'Analizar fragmentos de código en busca de vulnerabilidades comunes (OWASP) y proponer correcciones automáticas siguiendo el estándar MCP.',
    problem: 'La falta de revisión de seguridad inmediata en el ciclo de desarrollo (Inner Loop), lo que genera deuda técnica y riesgos de seguridad en producción.',
    inputProperties: [
      { name: 'codigo', type: 'string', description: 'El fragmento de código fuente a analizar para buscar fallos de seguridad.', required: true },
      { name: 'contexto', type: 'string', description: 'Descripción del entorno donde corre el código (ej. web, móvil, backend).', required: false }
    ],
    outputProperties: [
      { name: 'vulnerabilidades', type: 'array', description: 'Lista detallada de fallos encontrados con nivel de criticidad.', required: true },
      { name: 'solucion_sugerida', type: 'string', description: 'Código refactorizado que resuelve el problema detectado.', required: true }
    ],
    studentName: '',
    universityName: '',
    courseName: 'IA Generativa y Agentes (MCP/Skills)',
    updatedAt: Date.now(),
  };
}

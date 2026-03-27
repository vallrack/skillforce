import type { SkillDraft } from '@/types/skill';

const STORAGE_KEY = 'skillforge_drafts';

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
    name: 'New Skill',
    purpose: '',
    problem: '',
    inputProperties: [],
    outputProperties: [],
    updatedAt: Date.now(),
  };
}
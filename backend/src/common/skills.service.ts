import { Injectable } from '@nestjs/common';
import { SKILLS_LIST } from './skills-list.js';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class SkillsService {
  extractSkills(text: string): string[] {
    const found = new Set<string>();

    for (const skill of SKILLS_LIST) {
      const matchesAny = skill.aliases.some((alias) => {
        const pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i');
        return pattern.test(text);
      });

      if (matchesAny) {
        found.add(skill.name);
      }
    }

    return Array.from(found);
  }
}
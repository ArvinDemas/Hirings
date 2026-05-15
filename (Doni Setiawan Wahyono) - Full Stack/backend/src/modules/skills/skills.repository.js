import { skillCatalog } from "./skill-catalog.data.js";

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchableTerms(skill) {
  return [skill.name, skill.category, ...(skill.aliases ?? [])].map(normalize);
}

function scoreSkill(skill, query) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return 1;
  }

  const terms = searchableTerms(skill);
  let bestScore = 0;

  for (const term of terms) {
    const tokens = term.split(" ");

    if (term === normalizedQuery) {
      bestScore = Math.max(bestScore, 100);
      continue;
    }

    if (term.startsWith(normalizedQuery)) {
      bestScore = Math.max(bestScore, 80 - Math.max(0, term.length - normalizedQuery.length));
      continue;
    }

    if (tokens.some((token) => token.startsWith(normalizedQuery))) {
      bestScore = Math.max(bestScore, 70);
      continue;
    }

    if (normalizedQuery.length >= 4 && term.includes(normalizedQuery)) {
      bestScore = Math.max(bestScore, 45 - term.indexOf(normalizedQuery));
    }
  }

  return bestScore;
}

function search({ q = "", limit = 10 }) {
  const query = q.trim();

  return skillCatalog
    .map((skill) => ({
      ...skill,
      score: scoreSkill(skill, query),
    }))
    .filter((skill) => skill.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ score: _score, ...skill }) => skill);
}

export const skillsRepository = {
  search,
};

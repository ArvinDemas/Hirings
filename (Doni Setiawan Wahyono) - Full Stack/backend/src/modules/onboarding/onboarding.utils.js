export function normalizeSkillName(skillName) {
  return skillName
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeConfidence(confidence) {
  if (confidence === undefined || confidence === null || confidence === "") {
    return undefined;
  }

  const value = Number(confidence);

  if (!Number.isFinite(value)) {
    return undefined;
  }

  return Math.min(1, Math.max(0, value));
}

export function deduplicateSkills(skills) {
  const seen = new Set();
  const result = [];

  for (const skill of skills) {
    const normalizedName = normalizeSkillName(skill.name);

    if (!normalizedName || seen.has(normalizedName)) {
      continue;
    }

    seen.add(normalizedName);
    result.push({
      name: skill.name.trim().replace(/\s+/g, " "),
      normalizedName,
      proficiencyLevel: skill.proficiencyLevel,
      confidence: normalizeConfidence(skill.confidence),
    });
  }

  return result;
}

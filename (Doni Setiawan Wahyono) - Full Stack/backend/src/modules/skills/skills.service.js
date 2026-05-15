import { skillsRepository } from "./skills.repository.js";

async function searchSkills(params) {
  return skillsRepository.search(params);
}

export const skillsService = {
  searchSkills,
};

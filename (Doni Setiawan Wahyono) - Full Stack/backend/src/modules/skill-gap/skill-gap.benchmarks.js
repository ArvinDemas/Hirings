export const skillGapTargets = {
  roles: [
    { id: "data-analyst", name: "Data Analyst" },
    { id: "data-scientist", name: "Data Scientist" },
    { id: "software-engineer", name: "Software Engineer" },
    { id: "frontend-developer", name: "Frontend Developer" },
    { id: "backend-developer", name: "Backend Developer" },
    { id: "ui-ux-designer", name: "UI/UX Designer" },
  ],
  industries: [
    { id: "technology", name: "Teknologi" },
    { id: "finance", name: "Finance" },
    { id: "ecommerce", name: "E-Commerce" },
    { id: "education", name: "Education" },
  ],
  levels: [
    { id: "entry", name: "Entry Level" },
    { id: "junior", name: "Junior" },
    { id: "mid", name: "Mid Level" },
  ],
};

const courses = {
  "machine learning": [
    {
      title: "Machine Learning untuk Pemula",
      provider: "Dicoding",
      durationWeeks: 6,
      url: "https://www.dicoding.com/",
    },
  ],
  "data visualization": [
    {
      title: "Data Visualization with Tableau",
      provider: "Coursera",
      durationWeeks: 4,
      url: "https://www.coursera.org/",
    },
  ],
  statistics: [
    {
      title: "Statistics for Data Science",
      provider: "Coursera",
      durationWeeks: 4,
      url: "https://www.coursera.org/",
    },
  ],
  tableau: [
    {
      title: "Tableau Essential Training",
      provider: "LinkedIn Learning",
      durationWeeks: 3,
      url: "https://www.linkedin.com/learning/",
    },
  ],
  react: [
    {
      title: "Belajar Membuat Aplikasi Web dengan React",
      provider: "Dicoding",
      durationWeeks: 6,
      url: "https://www.dicoding.com/",
    },
  ],
  "node.js": [
    {
      title: "Node.js Backend Development",
      provider: "Coursera",
      durationWeeks: 5,
      url: "https://www.coursera.org/",
    },
  ],
  docker: [
    {
      title: "Docker for Developers",
      provider: "Udemy",
      durationWeeks: 3,
      url: "https://www.udemy.com/",
    },
  ],
};

function skill(name, category, dimension, requiredScore, weight, priority = "medium", aliases = []) {
  return { name, category, dimension, requiredScore, weight, priority, aliases };
}

export const benchmarkCatalog = [
  {
    roleId: "data-analyst",
    industryId: "technology",
    levelId: "entry",
    requiredSkills: [
      skill("Python", "Teknis", "Technical Skill", 80, 1.1, "medium", ["py", "pyt"]),
      skill("SQL", "Teknis", "Technical Skill", 75, 1.1, "medium"),
      skill("Excel", "Tools", "Tools", 70, 0.8, "medium", ["microsoft excel"]),
      skill("Communication", "Soft Skill", "Communication", 75, 0.9, "medium", ["komunikasi"]),
      skill("Problem Solving", "Soft Skill", "Problem Solving", 80, 0.9, "medium"),
      skill("Machine Learning", "Teknis", "Technical Skill", 65, 0.85, "high", ["ml"]),
      skill("Data Visualization", "Teknis", "Technical Skill", 75, 1, "medium", ["visualisasi data", "dataviz"]),
      skill("Statistics", "Teknis", "Technical Skill", 75, 1, "high", ["statistik"]),
      skill("Tableau", "Tools", "Tools", 60, 0.7, "low"),
      skill("Power BI", "Tools", "Tools", 60, 0.7, "low", ["powerbi"]),
      skill("Data Cleaning", "Teknis", "Technical Skill", 75, 0.9, "medium"),
      skill("Critical Thinking", "Soft Skill", "Problem Solving", 75, 0.8, "medium"),
    ],
  },
  {
    roleId: "data-scientist",
    industryId: "technology",
    levelId: "entry",
    requiredSkills: [
      skill("Python", "Teknis", "Technical Skill", 85, 1.2, "medium", ["py", "pyt"]),
      skill("SQL", "Teknis", "Technical Skill", 75, 1, "medium"),
      skill("Statistics", "Teknis", "Technical Skill", 85, 1.2, "high", ["statistik"]),
      skill("Machine Learning", "Teknis", "Technical Skill", 80, 1.2, "high", ["ml"]),
      skill("Pandas", "Tools", "Tools", 75, 0.9),
      skill("NumPy", "Tools", "Tools", 70, 0.8),
      skill("Scikit-learn", "Tools", "Tools", 70, 0.8, "medium", ["sklearn"]),
      skill("Data Visualization", "Teknis", "Technical Skill", 75, 0.9),
      skill("Communication", "Soft Skill", "Communication", 70, 0.8),
      skill("Problem Solving", "Soft Skill", "Problem Solving", 80, 0.9),
      skill("Critical Thinking", "Soft Skill", "Problem Solving", 80, 0.8),
      skill("Git", "Tools", "Tools", 60, 0.6),
    ],
  },
  {
    roleId: "software-engineer",
    industryId: "technology",
    levelId: "entry",
    requiredSkills: [
      skill("JavaScript", "Teknis", "Technical Skill", 80, 1, "medium", ["js"]),
      skill("TypeScript", "Teknis", "Technical Skill", 70, 0.8, "medium", ["ts"]),
      skill("React", "Teknis", "Technical Skill", 75, 0.9, "medium", ["reactjs"]),
      skill("Node.js", "Teknis", "Technical Skill", 75, 0.9, "medium", ["node", "nodejs"]),
      skill("REST API", "Teknis", "Technical Skill", 75, 0.9, "medium", ["restful"]),
      skill("SQL", "Teknis", "Technical Skill", 70, 0.8),
      skill("Git", "Tools", "Tools", 70, 0.8),
      skill("Docker", "Tools", "Tools", 55, 0.6, "low"),
      skill("Problem Solving", "Soft Skill", "Problem Solving", 80, 1),
      skill("Communication", "Soft Skill", "Communication", 70, 0.7),
      skill("Teamwork", "Soft Skill", "Teamwork", 75, 0.8),
      skill("Testing", "Teknis", "Technical Skill", 65, 0.7, "medium", ["unit testing"]),
    ],
  },
  {
    roleId: "frontend-developer",
    industryId: "technology",
    levelId: "entry",
    requiredSkills: [
      skill("HTML", "Teknis", "Technical Skill", 80, 0.8),
      skill("CSS", "Teknis", "Technical Skill", 80, 0.8),
      skill("JavaScript", "Teknis", "Technical Skill", 80, 1, "medium", ["js"]),
      skill("React", "Teknis", "Technical Skill", 80, 1, "medium", ["reactjs"]),
      skill("Tailwind CSS", "Tools", "Tools", 70, 0.7, "low", ["tailwind"]),
      skill("Vite", "Tools", "Tools", 60, 0.5),
      skill("Git", "Tools", "Tools", 70, 0.7),
      skill("UI Design", "Soft Skill", "Leadership", 65, 0.6),
      skill("UX Design", "Soft Skill", "Communication", 65, 0.6),
      skill("Problem Solving", "Soft Skill", "Problem Solving", 75, 0.8),
      skill("Communication", "Soft Skill", "Communication", 70, 0.7),
      skill("Testing", "Teknis", "Technical Skill", 60, 0.6),
    ],
  },
  {
    roleId: "backend-developer",
    industryId: "technology",
    levelId: "entry",
    requiredSkills: [
      skill("Node.js", "Teknis", "Technical Skill", 80, 1, "medium", ["node", "nodejs"]),
      skill("Express.js", "Teknis", "Technical Skill", 75, 0.9, "medium", ["express"]),
      skill("REST API", "Teknis", "Technical Skill", 80, 1, "medium", ["restful"]),
      skill("PostgreSQL", "Tools", "Tools", 75, 0.9, "medium", ["postgres"]),
      skill("SQL", "Teknis", "Technical Skill", 75, 0.9),
      skill("JWT", "Teknis", "Technical Skill", 65, 0.6),
      skill("Docker", "Tools", "Tools", 60, 0.6, "low"),
      skill("Git", "Tools", "Tools", 70, 0.7),
      skill("Problem Solving", "Soft Skill", "Problem Solving", 80, 0.9),
      skill("Communication", "Soft Skill", "Communication", 70, 0.7),
      skill("Teamwork", "Soft Skill", "Teamwork", 75, 0.8),
      skill("Testing", "Teknis", "Technical Skill", 65, 0.7),
    ],
  },
  {
    roleId: "ui-ux-designer",
    industryId: "technology",
    levelId: "entry",
    requiredSkills: [
      skill("Figma", "Tools", "Tools", 80, 1, "medium"),
      skill("UI Design", "Teknis", "Technical Skill", 80, 1, "medium"),
      skill("UX Design", "Teknis", "Technical Skill", 80, 1, "medium"),
      skill("Wireframing", "Teknis", "Technical Skill", 75, 0.8),
      skill("Prototyping", "Teknis", "Technical Skill", 75, 0.8),
      skill("User Research", "Teknis", "Technical Skill", 70, 0.8),
      skill("Communication", "Soft Skill", "Communication", 80, 0.9),
      skill("Problem Solving", "Soft Skill", "Problem Solving", 75, 0.8),
      skill("Critical Thinking", "Soft Skill", "Problem Solving", 75, 0.8),
      skill("Teamwork", "Soft Skill", "Teamwork", 75, 0.7),
    ],
  },
];

export function getCourseRecommendations(normalizedSkillName) {
  return courses[normalizedSkillName] ?? [];
}

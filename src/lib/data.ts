export type EmploymentType = "Internship" | "Full-time" | "Part-time" | "Contract";
export type WorkMode = "On-site" | "Remote" | "Hybrid";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  domain: string;
  location: string;
  workMode: WorkMode;
  type: EmploymentType;
  pay?: string | undefined;
  deadline?: string | undefined; // ISO date
  postedAt: string; // ISO date
  description: string;
  responsibilities: string[];
  requirements: string[];
  applyUrl?: string | undefined;
}

export interface Application {
  id: string;
  opportunityId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string | undefined;
  status: "New" | "Reviewing" | "Shortlisted" | "Rejected";
  submittedAt: string;
}

export const DOMAINS = [
  "Software Engineering",
  "Data & Analytics",
  "Design",
  "Marketing",
  "Finance",
  "Operations",
] as const;

export const TYPES: EmploymentType[] = ["Internship", "Full-time", "Part-time", "Contract"];
export const MODES: WorkMode[] = ["On-site", "Remote", "Hybrid"];

// Sample listings use fictional companies.
export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "frontend-intern-northlane",
    title: "Frontend Engineering Intern",
    company: "Northlane Labs",
    companyInitials: "NL",
    domain: "Software Engineering",
    location: "Bengaluru",
    workMode: "Hybrid",
    type: "Internship",
    pay: "₹35,000 / month",
    deadline: "2026-11-20",
    postedAt: "2026-10-14",
    description:
      "Join a small product team building the dashboard used by logistics operators across 40 cities. You'll ship real features in React and TypeScript from your second week.",
    responsibilities: [
      "Build and test UI components in React and TypeScript",
      "Pair with designers to refine interaction details",
      "Improve performance of data-heavy table views",
    ],
    requirements: [
      "Comfortable with JavaScript, HTML and CSS",
      "Some experience with React (projects count)",
      "Available for 6 months, starting January",
    ],
  },
  {
    id: "data-analyst-grad-meridian",
    title: "Graduate Data Analyst",
    company: "Meridian Health",
    companyInitials: "MH",
    domain: "Data & Analytics",
    location: "Pune",
    workMode: "On-site",
    type: "Full-time",
    pay: "₹7.5-9 LPA",
    deadline: "2026-11-05",
    postedAt: "2026-10-12",
    description:
      "Help hospital networks understand patient flow. You'll own weekly reporting and grow into building forecasting models with the analytics lead.",
    responsibilities: [
      "Write SQL to clean and model operational data",
      "Maintain weekly dashboards for clinical leads",
      "Present findings to non-technical stakeholders",
    ],
    requirements: ["Strong SQL and spreadsheet skills", "Basic Python or R", "Degree in a quantitative field"],
  },
  {
    id: "product-design-intern-fieldnote",
    title: "Product Design Intern",
    company: "Fieldnote",
    companyInitials: "FN",
    domain: "Design",
    location: "Remote",
    workMode: "Remote",
    type: "Internship",
    pay: "₹25,000 / month",
    deadline: "2026-10-30",
    postedAt: "2026-10-15",
    description:
      "Fieldnote makes note-taking tools for researchers. Work directly with the founding designer on onboarding and the mobile app.",
    responsibilities: ["Run usability sessions", "Produce flows and high-fidelity prototypes in Figma", "Contribute to the design system"],
    requirements: ["A portfolio with 2+ case studies", "Figma proficiency", "Clear written communication"],
  },
  {
    id: "growth-marketing-associate-kettle",
    title: "Growth Marketing Associate",
    company: "Kettle & Co.",
    companyInitials: "KC",
    domain: "Marketing",
    location: "Mumbai",
    workMode: "Hybrid",
    type: "Full-time",
    pay: "₹6-7 LPA",
    deadline: "2026-11-28",
    postedAt: "2026-10-09",
    description: "Own lifecycle email and paid social experiments for a fast-growing D2C tea brand.",
    responsibilities: ["Plan and run weekly campaign experiments", "Report on CAC and retention", "Write copy for email and ads"],
    requirements: ["0-2 years experience", "Comfort with numbers and spreadsheets", "A sharp eye for copy"],
  },
  {
    id: "finance-analyst-intern-ardent",
    title: "Finance Analyst Intern",
    company: "Ardent Capital",
    companyInitials: "AC",
    domain: "Finance",
    location: "Gurugram",
    workMode: "On-site",
    type: "Internship",
    pay: "₹40,000 / month",
    deadline: "2026-11-12",
    postedAt: "2026-10-08",
    description: "Support the investment team with market research, financial models and portfolio reviews.",
    responsibilities: ["Build three-statement models", "Summarise industry research", "Prepare investment committee notes"],
    requirements: ["Final-year finance, economics or commerce student", "Advanced Excel", "Attention to detail"],
  },
  {
    id: "backend-engineer-relay",
    title: "Junior Backend Engineer",
    company: "Relay Payments",
    companyInitials: "RP",
    domain: "Software Engineering",
    location: "Hyderabad",
    workMode: "Hybrid",
    type: "Full-time",
    pay: "₹12-15 LPA",
    deadline: "2026-12-01",
    postedAt: "2026-10-13",
    description: "Work on the services that move money for 3,000 small businesses. Go, Postgres and a strong code-review culture.",
    responsibilities: ["Build and maintain APIs in Go", "Write tests and participate in on-call (after onboarding)", "Improve observability"],
    requirements: ["Solid fundamentals in one backend language", "Understanding of SQL databases", "Curiosity about distributed systems"],
  },
  {
    id: "ops-coordinator-parttime-greenbox",
    title: "Operations Coordinator",
    company: "Greenbox Grocers",
    companyInitials: "GG",
    domain: "Operations",
    location: "Chennai",
    workMode: "On-site",
    type: "Part-time",
    pay: "₹18,000 / month",
    postedAt: "2026-10-10",
    description: "Coordinate morning dispatch for a neighbourhood grocery delivery service. 20 hours a week, flexible around classes.",
    responsibilities: ["Coordinate rider schedules", "Track inventory discrepancies", "Handle escalations with vendors"],
    requirements: ["Organised and calm under pressure", "Basic spreadsheet skills", "Tamil or English fluency"],
  },
  {
    id: "ml-research-contract-quanta",
    title: "ML Research Assistant",
    company: "Quanta Research",
    companyInitials: "QR",
    domain: "Data & Analytics",
    location: "Remote",
    workMode: "Remote",
    type: "Contract",
    pay: "₹1,200 / hour",
    deadline: "2026-11-15",
    postedAt: "2026-10-11",
    description: "A 4-month contract evaluating language models on multilingual reasoning benchmarks.",
    responsibilities: ["Design evaluation datasets", "Run experiments and log results", "Write clear experiment reports"],
    requirements: ["Python and PyTorch", "Familiarity with transformers", "Fluency in at least one Indian language besides English"],
  },
];

/**
 * Seed script — populates the database with sample opportunities and an admin account.
 *
 * Usage:  npm run seed          (from the server/ directory)
 *    or:  node src/seed.js
 *
 * Requires MONGODB_URI in .env (or uses default localhost).
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Opportunity from "./models/Opportunity.js";
import Application from "./models/Application.js";
import Admin from "./models/Admin.js";

const SEED_OPPORTUNITIES = [
  {
    title: "Frontend Engineering Intern",
    companyName: "Northlane Labs",
    domain: "Software Engineering",
    location: "Bengaluru",
    workMode: "Hybrid",
    type: "Internship",
    pay: "₹35,000 / month",
    deadline: new Date("2026-11-20"),
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
    title: "Graduate Data Analyst",
    companyName: "Meridian Health",
    domain: "Data & Analytics",
    location: "Pune",
    workMode: "On-site",
    type: "Full-time",
    pay: "₹7.5-9 LPA",
    deadline: new Date("2026-11-05"),
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
    title: "Product Design Intern",
    companyName: "Fieldnote",
    domain: "Design",
    location: "Remote",
    workMode: "Remote",
    type: "Internship",
    pay: "₹25,000 / month",
    deadline: new Date("2026-10-30"),
    description:
      "Fieldnote makes note-taking tools for researchers. Work directly with the founding designer on onboarding and the mobile app.",
    responsibilities: [
      "Run usability sessions",
      "Produce flows and high-fidelity prototypes in Figma",
      "Contribute to the design system",
    ],
    requirements: ["A portfolio with 2+ case studies", "Figma proficiency", "Clear written communication"],
  },
  {
    title: "Growth Marketing Associate",
    companyName: "Kettle & Co.",
    domain: "Marketing",
    location: "Mumbai",
    workMode: "Hybrid",
    type: "Full-time",
    pay: "₹6-7 LPA",
    deadline: new Date("2026-11-28"),
    description: "Own lifecycle email and paid social experiments for a fast-growing D2C tea brand.",
    responsibilities: [
      "Plan and run weekly campaign experiments",
      "Report on CAC and retention",
      "Write copy for email and ads",
    ],
    requirements: ["0-2 years experience", "Comfort with numbers and spreadsheets", "A sharp eye for copy"],
  },
  {
    title: "Finance Analyst Intern",
    companyName: "Ardent Capital",
    domain: "Finance",
    location: "Gurugram",
    workMode: "On-site",
    type: "Internship",
    pay: "₹40,000 / month",
    deadline: new Date("2026-11-12"),
    description: "Support the investment team with market research, financial models and portfolio reviews.",
    responsibilities: [
      "Build three-statement models",
      "Summarise industry research",
      "Prepare investment committee notes",
    ],
    requirements: [
      "Final-year finance, economics or commerce student",
      "Advanced Excel",
      "Attention to detail",
    ],
  },
  {
    title: "Junior Backend Engineer",
    companyName: "Relay Payments",
    domain: "Software Engineering",
    location: "Hyderabad",
    workMode: "Hybrid",
    type: "Full-time",
    pay: "₹12-15 LPA",
    deadline: new Date("2026-12-01"),
    description:
      "Work on the services that move money for 3,000 small businesses. Go, Postgres and a strong code-review culture.",
    responsibilities: [
      "Build and maintain APIs in Go",
      "Write tests and participate in on-call (after onboarding)",
      "Improve observability",
    ],
    requirements: [
      "Solid fundamentals in one backend language",
      "Understanding of SQL databases",
      "Curiosity about distributed systems",
    ],
  },
  {
    title: "Operations Coordinator",
    companyName: "Greenbox Grocers",
    domain: "Operations",
    location: "Chennai",
    workMode: "On-site",
    type: "Part-time",
    pay: "₹18,000 / month",
    description:
      "Coordinate morning dispatch for a neighbourhood grocery delivery service. 20 hours a week, flexible around classes.",
    responsibilities: [
      "Coordinate rider schedules",
      "Track inventory discrepancies",
      "Handle escalations with vendors",
    ],
    requirements: [
      "Organised and calm under pressure",
      "Basic spreadsheet skills",
      "Tamil or English fluency",
    ],
  },
  {
    title: "ML Research Assistant",
    companyName: "Quanta Research",
    domain: "Data & Analytics",
    location: "Remote",
    workMode: "Remote",
    type: "Contract",
    pay: "₹1,200 / hour",
    deadline: new Date("2026-11-15"),
    description: "A 4-month contract evaluating language models on multilingual reasoning benchmarks.",
    responsibilities: [
      "Design evaluation datasets",
      "Run experiments and log results",
      "Write clear experiment reports",
    ],
    requirements: [
      "Python and PyTorch",
      "Familiarity with transformers",
      "Fluency in at least one Indian language besides English",
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/firstshift";
  console.log(`Connecting to ${uri} …`);
  await mongoose.connect(uri);

  // Clear existing data
  await Opportunity.deleteMany({});
  await Application.deleteMany({});
  await Admin.deleteMany({});

  // Seed opportunities
  const ops = await Opportunity.insertMany(SEED_OPPORTUNITIES);
  console.log(`✓ Seeded ${ops.length} opportunities`);

  // Seed admin account
  const adminEmail = process.env.ADMIN_EMAIL || "admin@firstshift.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  await Admin.create({ email: adminEmail, passwordHash: adminPassword });
  console.log(`✓ Seeded admin: ${adminEmail} / ${adminPassword}`);

  console.log("\nDone. You can now run:  npm run dev\n");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

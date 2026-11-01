import mongoose from "mongoose";

const DOMAINS = [
  "Software Engineering",
  "Data & Analytics",
  "Design",
  "Marketing",
  "Finance",
  "Operations",
];

const TYPES = ["Internship", "Full-time", "Part-time", "Contract"];
const MODES = ["On-site", "Remote", "Hybrid"];

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be under 200 characters"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [120, "Company name must be under 120 characters"],
    },
    companyInitials: {
      type: String,
      maxlength: 4,
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
      enum: { values: DOMAINS, message: "Invalid domain" },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location must be under 100 characters"],
    },
    workMode: {
      type: String,
      required: [true, "Work mode is required"],
      enum: { values: MODES, message: "Invalid work mode" },
    },
    type: {
      type: String,
      required: [true, "Employment type is required"],
      enum: { values: TYPES, message: "Invalid employment type" },
    },
    pay: {
      type: String,
      trim: true,
      maxlength: [80, "Pay must be under 80 characters"],
    },
    deadline: {
      type: Date,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [5000, "Description must be under 5000 characters"],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    applicationLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Application link must be a valid URL",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate company initials before saving
opportunitySchema.pre("save", function (next) {
  if (this.isModified("companyName") || !this.companyInitials) {
    this.companyInitials = this.companyName
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  next();
});

// Export constants for use in validators and seed
opportunitySchema.statics.DOMAINS = DOMAINS;
opportunitySchema.statics.TYPES = TYPES;
opportunitySchema.statics.MODES = MODES;

const Opportunity = mongoose.model("Opportunity", opportunitySchema);
export { DOMAINS, TYPES, MODES };
export default Opportunity;

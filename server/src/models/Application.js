import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: [true, "Opportunity reference is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [120, "Name must be under 120 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[+\d][\d\s-]{7,}$/, "Please enter a valid phone number"],
    },
    resumeUrl: {
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
        message: "Resume URL must be a valid URL",
      },
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [1500, "Cover letter must be under 1500 characters"],
    },
    status: {
      type: String,
      enum: ["New", "Reviewing", "Shortlisted", "Rejected"],
      default: "New",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for querying applications by opportunity
applicationSchema.index({ opportunityId: 1 });
applicationSchema.index({ email: 1, opportunityId: 1 });

const Application = mongoose.model("Application", applicationSchema);
export default Application;

import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import { success, paginated, fail, serverError } from "../utils/apiResponse.js";

/**
 * POST /api/applications
 * Submit an application (public, with validation).
 */
export async function submitApplication(req, res) {
  try {
    const { opportunityId, fullName, email, phone, resumeUrl, coverLetter } = req.body;

    // Verify the opportunity exists
    const opp = await Opportunity.findById(opportunityId);
    if (!opp) return fail(res, "Opportunity not found", 404);

    // Check if deadline has passed
    if (opp.deadline && new Date(opp.deadline) < new Date()) {
      return fail(res, "Applications for this opportunity have closed", 400);
    }

    // Check for duplicate submission
    const existing = await Application.findOne({ email: email.toLowerCase(), opportunityId });
    if (existing) {
      return fail(res, "You have already applied to this opportunity", 409);
    }

    const application = await Application.create({
      opportunityId,
      fullName,
      email,
      phone,
      resumeUrl: resumeUrl || undefined,
      coverLetter: coverLetter || undefined,
    });

    return success(res, application, 201);
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * GET /api/applications  (Admin only)
 * List all applications with optional filters.
 */
export async function listApplications(req, res) {
  try {
    const { opportunityId, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (opportunityId) filter.opportunityId = opportunityId;
    if (status) filter.status = status;

    const total = await Application.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await Application.find(filter)
      .populate("opportunityId", "title companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return paginated(res, data, { page: Number(page), limit: Number(limit), total, pages });
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * PATCH /api/applications/:id/status  (Admin only)
 * Update application status.
 */
export async function updateApplicationStatus(req, res) {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!app) return fail(res, "Application not found", 404);
    return success(res, app);
  } catch (error) {
    return serverError(res, error);
  }
}

import Opportunity from "../models/Opportunity.js";
import { success, paginated, fail, serverError } from "../utils/apiResponse.js";

/**
 * GET /api/opportunities
 * List, search, filter and paginate opportunities.
 */
export async function listOpportunities(req, res) {
  try {
    const { search, domain, type, mode, location, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (domain) filter.domain = domain;
    if (type) filter.type = type;
    if (mode) filter.workMode = mode;
    if (location) filter.location = { $regex: `^${location}$`, $options: "i" };

    const total = await Opportunity.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await Opportunity.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return paginated(res, data, { page: Number(page), limit: Number(limit), total, pages });
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * GET /api/opportunities/:id
 * View a single opportunity.
 */
export async function getOpportunityById(req, res) {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return fail(res, "Opportunity not found", 404);
    return success(res, opp);
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * POST /api/opportunities  (Admin only)
 * Create a new opportunity.
 */
export async function createOpportunity(req, res) {
  try {
    const allowed = [
      "title", "companyName", "domain", "location", "workMode", "type",
      "pay", "deadline", "description", "responsibilities", "requirements", "applicationLink",
    ];
    const body = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) body[key] = req.body[key];
    }

    const opp = await Opportunity.create(body);
    return success(res, opp, 201);
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * PATCH /api/opportunities/:id  (Admin only)
 * Update an existing opportunity.
 */
export async function updateOpportunity(req, res) {
  try {
    const allowed = [
      "title", "companyName", "domain", "location", "workMode", "type",
      "pay", "deadline", "description", "responsibilities", "requirements", "applicationLink",
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Re-derive initials if company name changed
    if (updates.companyName) {
      updates.companyInitials = updates.companyName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    const opp = await Opportunity.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!opp) return fail(res, "Opportunity not found", 404);
    return success(res, opp);
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * DELETE /api/opportunities/:id  (Admin only)
 * Delete an opportunity. Applications referencing it are preserved.
 */
export async function deleteOpportunity(req, res) {
  try {
    const opp = await Opportunity.findByIdAndDelete(req.params.id);
    if (!opp) return fail(res, "Opportunity not found", 404);
    return success(res, { message: "Opportunity deleted", id: opp._id });
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * GET /api/opportunities/domains
 * Returns list of domains with counts.
 */
export async function getDomainCounts(req, res) {
  try {
    const counts = await Opportunity.aggregate([
      { $group: { _id: "$domain", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return success(res, counts);
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * GET /api/opportunities/locations
 * Returns distinct location values.
 */
export async function getLocations(req, res) {
  try {
    const locations = await Opportunity.distinct("location");
    return success(res, locations.sort());
  } catch (error) {
    return serverError(res, error);
  }
}

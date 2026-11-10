import apiClient from "./apiClient";

export type EmploymentType = "Internship" | "Full-time" | "Part-time" | "Contract";
export type WorkMode = "On-site" | "Remote" | "Hybrid";

export interface Opportunity {
  _id?: string;
  id?: string;
  title: string;
  companyName: string;
  companyInitials?: string;
  domain: string;
  location: string;
  workMode: WorkMode;
  type: EmploymentType;
  pay?: string;
  deadline?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applicationLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpportunityQueryParams {
  search?: string;
  domain?: string;
  type?: string;
  mode?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOpportunities {
  data: Opportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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

// ── Stale-While-Revalidate (SWR) Cache ───────────────────────
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const swrMemoryCache = new Map<string, CacheEntry<any>>();

function getCacheKey(endpoint: string, params?: any): string {
  return `${endpoint}:${JSON.stringify(params || {})}`;
}

export function clearOpportunityCache() {
  swrMemoryCache.clear();
}

export const opportunityService = {
  /**
   * Fetches opportunities with Stale-While-Revalidate semantics.
   * If cached data exists, it immediately invokes onData(cached, true).
   * It then revalidates in the background and invokes onData(fresh, false).
   */
  async list(
    params?: OpportunityQueryParams,
    options?: { onRevalidate?: (fresh: PaginatedOpportunities) => void }
  ): Promise<PaginatedOpportunities> {
    const key = getCacheKey("/opportunities", params);
    const cached = swrMemoryCache.get(key);

    // Return stale cache immediately if present
    if (cached) {
      // Trigger background revalidation
      this._revalidateList(params, key, options?.onRevalidate);
      return cached.data;
    }

    // Otherwise perform standard network request
    const fresh = await this._fetchList(params);
    swrMemoryCache.set(key, { data: fresh, timestamp: Date.now() });
    return fresh;
  },

  async _fetchList(params?: OpportunityQueryParams): Promise<PaginatedOpportunities> {
    const res = await apiClient.get<any, { success: boolean; data: Opportunity[]; pagination: any }>("/opportunities", {
      params,
    });
    return {
      data: res.data || [],
      pagination: res.pagination || { page: 1, limit: 12, total: res.data?.length || 0, pages: 1 },
    };
  },

  async _revalidateList(
    params?: OpportunityQueryParams,
    key?: string,
    onRevalidate?: (fresh: PaginatedOpportunities) => void
  ) {
    try {
      const fresh = await this._fetchList(params);
      if (key) swrMemoryCache.set(key, { data: fresh, timestamp: Date.now() });
      if (onRevalidate) onRevalidate(fresh);
    } catch {
      // Background revalidation silently preserves cached stale data on network failure
    }
  },

  async getById(id: string): Promise<Opportunity> {
    const key = `opp:${id}`;
    const cached = swrMemoryCache.get(key);
    if (cached) {
      // Trigger background revalidate
      apiClient.get<any, { success: boolean; data: Opportunity }>(`/opportunities/${id}`)
        .then((res) => swrMemoryCache.set(key, { data: res.data, timestamp: Date.now() }))
        .catch(() => {});
      return cached.data;
    }
    const res = await apiClient.get<any, { success: boolean; data: Opportunity }>(`/opportunities/${id}`);
    swrMemoryCache.set(key, { data: res.data, timestamp: Date.now() });
    return res.data;
  },

  async create(data: Partial<Opportunity>): Promise<Opportunity> {
    clearOpportunityCache();
    const res = await apiClient.post<any, { success: boolean; data: Opportunity }>("/opportunities", data);
    return res.data;
  },

  async update(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    clearOpportunityCache();
    const res = await apiClient.patch<any, { success: boolean; data: Opportunity }>(`/opportunities/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    clearOpportunityCache();
    await apiClient.delete(`/opportunities/${id}`);
  },
};

// Auto-revalidate on window focus & network online
if (typeof window !== "undefined") {
  window.addEventListener("focus", () => {
    // Revalidation fires seamlessly for active pages
    window.dispatchEvent(new CustomEvent("fs-revalidate"));
  });
  window.addEventListener("online", () => {
    window.dispatchEvent(new CustomEvent("fs-revalidate"));
  });
}

export default opportunityService;

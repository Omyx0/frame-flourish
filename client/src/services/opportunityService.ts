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

export const opportunityService = {
  async list(params?: OpportunityQueryParams): Promise<PaginatedOpportunities> {
    const res = await apiClient.get<any, { success: boolean; data: Opportunity[]; pagination: any }>("/opportunities", {
      params,
    });
    return {
      data: res.data || [],
      pagination: res.pagination || { page: 1, limit: 12, total: res.data?.length || 0, pages: 1 },
    };
  },

  async getById(id: string): Promise<Opportunity> {
    const res = await apiClient.get<any, { success: boolean; data: Opportunity }>(`/opportunities/${id}`);
    return res.data;
  },

  async create(data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await apiClient.post<any, { success: boolean; data: Opportunity }>("/opportunities", data);
    return res.data;
  },

  async update(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await apiClient.patch<any, { success: boolean; data: Opportunity }>(`/opportunities/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/opportunities/${id}`);
  },
};

export default opportunityService;

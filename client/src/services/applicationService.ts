import apiClient from "./apiClient";

export type ApplicationStatus = "New" | "Reviewing" | "Shortlisted" | "Rejected";

export interface Application {
  _id?: string;
  id?: string;
  opportunityId: string | { _id: string; title: string; companyName: string };
  fullName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt?: string;
}

export interface ApplicationSubmission {
  opportunityId: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface PaginatedApplications {
  data: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const applicationService = {
  async submit(data: ApplicationSubmission): Promise<Application> {
    const res = await apiClient.post<any, { success: boolean; data: Application }>("/applications", data);
    return res.data;
  },

  async list(params?: { opportunityId?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedApplications> {
    const res = await apiClient.get<any, { success: boolean; data: Application[]; pagination: any }>("/applications", {
      params,
    });
    return {
      data: res.data || [],
      pagination: res.pagination || { page: 1, limit: 20, total: res.data?.length || 0, pages: 1 },
    };
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const res = await apiClient.patch<any, { success: boolean; data: Application }>(`/applications/${id}/status`, {
      status,
    });
    return res.data;
  },
};

export default applicationService;

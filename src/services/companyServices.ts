import axiosInstance from "@/services/axiosInstance";
import { API_PATHS } from "@/services/apiPath";

export const companyServices = {
  //  Get all companies (with optional filters/pagination)
  getCompanies: (filters?: any) =>
    axiosInstance.get(API_PATHS.COMPANIES.LIST, { params: filters }),

  // Get company by ID
  getCompanyById: (id: string | number) =>
    axiosInstance.get(API_PATHS.COMPANIES.DETAIL(id)),

  // Create company (admin only)
  createCompany: (data: any) =>
    axiosInstance.post(API_PATHS.COMPANIES.CREATE, data),

  // Update company
  updateCompany: (id: string | number, data: any) =>
    axiosInstance.put(API_PATHS.COMPANIES.UPDATE(id), data),

  // Delete company
  deleteCompany: (id: string | number) =>
    axiosInstance.delete(API_PATHS.COMPANIES.DELETE(id)),

  // Get company statistics
  getStats: () => axiosInstance.get(API_PATHS.COMPANIES.STATS),

  // Search companies
  searchCompanies: (query: string, filters?: any) =>
    axiosInstance.get(API_PATHS.COMPANIES.SEARCH, {
      params: {
        q: query?.trim(),
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        ...(filters?.industry && { industry: filters.industry }),
        ...(filters?.techRole && { techRole: filters.techRole }),
      },
    }),
    
  // Validate company logo upload
  validateLogo: (data: FormData) =>
    axiosInstance.post(API_PATHS.COMPANIES.VALIDATE_LOGO, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

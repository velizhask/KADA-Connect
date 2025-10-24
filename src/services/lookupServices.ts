import axiosInstance from "@/services/axiosInstance";
import { API_PATHS } from "@/services/apiPath";

export const lookupServices = {
  // Get full list of industries
  getIndustries: () => axiosInstance.get(API_PATHS.LOOKUP.INDUSTRIES),

  // Get list of tech roles (e.g. Frontend Developer, Backend Developer)
  getTechRoles: () => axiosInstance.get(API_PATHS.LOOKUP.TECH_ROLES),

  // Get all tech role categories (e.g. Engineering, Design, Data)
  getTechRoleCategories: () =>
    axiosInstance.get(API_PATHS.LOOKUP.TECH_ROLE_CATEGORIES),

  // Get most popular industries based on usage or data frequency
  getPopularIndustries: () =>
    axiosInstance.get(API_PATHS.LOOKUP.POPULAR_INDUSTRIES),

  // Get most popular tech roles among students or companies
  getPopularTechRoles: () =>
    axiosInstance.get(API_PATHS.LOOKUP.POPULAR_TECH_ROLES),

  // Get most popular technical skills (e.g. React, Python, SQL)
  getPopularTechSkills: () =>
    axiosInstance.get(API_PATHS.LOOKUP.POPULAR_TECH_SKILLS),

  // Get AI-powered suggestions for tech skills (auto-complete)
  getSuggestions: () => axiosInstance.get(API_PATHS.LOOKUP.SUGGEST_TECH_SKILLS),

  // Validate array of input tech skills (check if valid in system)
  validateTechSkills: (data: string[]) =>
    axiosInstance.post(API_PATHS.LOOKUP.VALIDATE_TECH_SKILLS, { skills: data }),

  // Clear cached lookup data (admin-only)
  clearCache: () => axiosInstance.post(API_PATHS.LOOKUP.CACHE_CLEAR),

  // Get current cache status (hit rate, TTL, etc.)
  getCacheStatus: () => axiosInstance.get(API_PATHS.LOOKUP.CACHE_STATUS),
};

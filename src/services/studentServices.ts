import axiosInstance from "@/services/axiosInstance";
import { API_PATHS } from "@/services/apiPath";

export const studentServices = {
  // Get all students (with all filters & pagination)
  getStudents: (filters?: Record<string, any>) =>
    axiosInstance.get(API_PATHS.STUDENTS.LIST, {
      params: {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.university && { university: filters.university }),
        ...(filters?.major && { major: filters.major }),
        ...(filters?.industry && { industry: filters.industry }),
        ...(filters?.skills && { skills: filters.skills }),
      },
    }),

  // Search students
  searchStudents: (query: string, filters?: any) =>
    axiosInstance.get(API_PATHS.STUDENTS.SEARCH, {
      params: {
        q: query?.trim(),
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.university && { university: filters.university }),
        ...(filters?.major && { major: filters.major }),
        ...(filters?.industry && { industry: filters.industry }),
        ...(filters?.skills && { skills: filters.skills }),
      },
    }),

  // Other endpoints
  getStudentById: (id: string | number) =>
    axiosInstance.get(API_PATHS.STUDENTS.DETAIL(id)),

  createStudent: (data: any) =>
    axiosInstance.post(API_PATHS.STUDENTS.CREATE, data),

  updateStudent: (id: string | number, data: any) =>
    axiosInstance.put(API_PATHS.STUDENTS.UPDATE(id), data),

  deleteStudent: (id: string | number) =>
    axiosInstance.delete(API_PATHS.STUDENTS.DELETE(id)),

  getStats: () => axiosInstance.get(API_PATHS.STUDENTS.STATS),
  getFeaturedStudents: () => axiosInstance.get(API_PATHS.STUDENTS.FEATURED),
  getStatusOptions: () => axiosInstance.get(API_PATHS.STUDENTS.STATUS),

  // Lookup endpoints
  getUniversities: () => axiosInstance.get(API_PATHS.STUDENTS.UNIVERSITIES),
  getMajors: () => axiosInstance.get(API_PATHS.STUDENTS.MAJORS),
  getPreferredIndustries: () =>
    axiosInstance.get(API_PATHS.STUDENTS.INDUSTRIES),
  getSkills: () => axiosInstance.get(API_PATHS.STUDENTS.SKILLS),

  // Validation endpoints
  validateCV: (data: FormData) =>
    axiosInstance.post(API_PATHS.STUDENTS.VALIDATE_CV, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  validatePhoto: (data: FormData) =>
    axiosInstance.post(API_PATHS.STUDENTS.VALIDATE_PHOTO, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

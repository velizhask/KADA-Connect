import axiosInstance from "@/services/axiosInstance";
import { API_PATHS } from "@/services/apiPath";

export const studentServices = {
  // Get students list (filter, pagination, etc.)
  getStudents: (params?: Record<string, any>) =>
    axiosInstance.get(API_PATHS.STUDENTS.LIST, { params }),

  // Get student by ID
  getStudentById: (id: string | number) =>
    axiosInstance.get(API_PATHS.STUDENTS.DETAIL(id)),

  // Create new student (admin only)
  createStudent: (data: any) =>
    axiosInstance.post(API_PATHS.STUDENTS.CREATE, data),

  // Update student
  updateStudent: (id: string | number, data: any) =>
    axiosInstance.put(API_PATHS.STUDENTS.UPDATE(id), data),

  // Delete student
  deleteStudent: (id: string | number) =>
    axiosInstance.delete(API_PATHS.STUDENTS.DELETE(id)),

  // Get student statistics
  getStats: () => axiosInstance.get(API_PATHS.STUDENTS.STATS),

  // Get featured students
  getFeaturedStudents: () => axiosInstance.get(API_PATHS.STUDENTS.FEATURED),

  // Get student status options
  getStatusOptions: () =>
    axiosInstance.get(API_PATHS.STUDENTS.STATUS_OPTIONS),

  // Advanced student search
  searchStudents: (filters: Record<string, any>) =>
    axiosInstance.post(API_PATHS.STUDENTS.SEARCH, filters),

  // Validate CV upload
  validateCV: (data: FormData) =>
    axiosInstance.post(API_PATHS.STUDENTS.VALIDATE_CV, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Validate student photo upload
  validatePhoto: (data: FormData) =>
    axiosInstance.post(API_PATHS.STUDENTS.VALIDATE_PHOTO, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

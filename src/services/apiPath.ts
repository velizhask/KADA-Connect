export const API_BASE_URL = "http://localhost:3001/api";

export const API_PATHS = {
  COMPANIES: {
    BASE: `${API_BASE_URL}/companies`,
    LIST: `${API_BASE_URL}/companies`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/companies/${id}`,
    CREATE: `${API_BASE_URL}/companies`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/companies/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/companies/${id}`,
    STATS: `${API_BASE_URL}/companies/stats`,
    SEARCH: `${API_BASE_URL}/companies/search`,
    VALIDATE_LOGO: `${API_BASE_URL}/companies/validate-logo`,
  },

  STUDENTS: {
    BASE: `${API_BASE_URL}/students`,
    LIST: `${API_BASE_URL}/students`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/students/${id}`,
    CREATE: `${API_BASE_URL}/students`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/students/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/students/${id}`,
    STATS: `${API_BASE_URL}/students/stats`,
    FEATURED: `${API_BASE_URL}/students/featured`,
    STATUS_OPTIONS: `${API_BASE_URL}/students/status-options`,
    SEARCH: `${API_BASE_URL}/students/search`,
    VALIDATE_CV: `${API_BASE_URL}/students/validate-cv`,
    VALIDATE_PHOTO: `${API_BASE_URL}/students/validate-photo`,
  },

  LOOKUP: {
    INDUSTRIES: `${API_BASE_URL}/industries`,
    TECH_ROLES: `${API_BASE_URL}/tech-roles`,
    TECH_ROLE_CATEGORIES: `${API_BASE_URL}/tech-role-categories`,
    TECH_ROLES_BY_CATEGORY: (category: string) =>
      `${API_BASE_URL}/tech-roles/category/${category}`,
    SEARCH_INDUSTRIES: `${API_BASE_URL}/search/industries`,
    SEARCH_TECH_ROLES: `${API_BASE_URL}/search/tech-roles`,
    SUGGEST_TECH_SKILLS: `${API_BASE_URL}/suggestions/tech-skills`,
    VALIDATE_TECH_SKILLS: `${API_BASE_URL}/validate/tech-skills`,
    ALL_LOOKUP: `${API_BASE_URL}/lookup/all`,
    POPULAR_INDUSTRIES: `${API_BASE_URL}/popular/industries`,
    POPULAR_TECH_ROLES: `${API_BASE_URL}/popular/tech-roles`,
    POPULAR_TECH_SKILLS: `${API_BASE_URL}/popular/tech-skills`,
    CACHE_CLEAR: `${API_BASE_URL}/cache/clear`,
    CACHE_STATUS: `${API_BASE_URL}/cache/status`,
  },
};

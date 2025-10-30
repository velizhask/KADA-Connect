
export const getStatusBadgeClass = (status: string): string => {
  const lower = status.toLowerCase();

  if (lower.includes("alumni")) {
    return "border-purple-200 text-purple-700 bg-purple-50";
  }

  return "border-primary-200 text-primary-700 bg-primary-50";
};
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter, Mail, Phone } from "lucide-react";
import { lookupServices } from "@/services/lookupServices";
import { companyServices } from "@/services/companyServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Company {
  id: number;
  companyName: string;
  companySummary: string;
  industry: string;
  website?: string;
  logo?: string;
  techRoles?: string;
  preferredSkillsets?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactInfoVisible?: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CompanyPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [techRoles, setTechRoles] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedTechRole, setSelectedTechRole] = useState("all");

  // 🔹 Load lookup data (industries & tech roles)
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [indRes, roleRes] = await Promise.all([
          lookupServices.getIndustries(),
          lookupServices.getTechRoles(),
        ]);
        setIndustries(indRes.data?.data || []);
        setTechRoles(roleRes.data?.data || []);
      } catch (err) {
        console.error("Lookup fetch error:", err);
      }
    };
    fetchLookups();
  }, []);

  // 🔹 Fetch companies (with filters + search)
  useEffect(() => {
    fetchCompanies(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedIndustry, selectedTechRole, pagination.page]);

  const fetchCompanies = async (page: number) => {
    try {
      setLoading(true);
      const filters = {
        page,
        limit: pagination.limit,
        ...(selectedIndustry !== "all" && { industry: selectedIndustry }),
        ...(selectedTechRole !== "all" && { techRole: selectedTechRole }),
      };

      const isSearching = searchTerm.trim().length > 0;

      const res = isSearching
        ? await companyServices.searchCompanies(searchTerm, filters)
        : await companyServices.getCompanies(filters);

      setCompanies(res.data?.data || []);
      setPagination(res.data?.pagination || pagination);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Visiting Companies
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore companies participating in the Industry Visit event.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6 shadow-sm border border-gray-100">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-base">
              <Filter className="h-4 w-4 text-primary-600" />
              <span>Filter Companies</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("");
                setSelectedIndustry("all");
                setSelectedTechRole("all");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                placeholder="Search company name..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Industry
              </label>
              <Select
                value={selectedIndustry}
                onValueChange={(val) => {
                  setSelectedIndustry(val);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tech Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tech Role Interest
              </label>
              <Select
                value={selectedTechRole}
                onValueChange={(val) => {
                  setSelectedTechRole(val);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {techRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="flex-1 transition-all duration-300">
          {!loading && !error && companies.length > 0 && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {companies.length} of {pagination.total} companies — Page{" "}
                {pagination.page} of {pagination.totalPages}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {!loading && !error && companies.length === 0 && (
            <div className="py-24 text-center text-muted-foreground">
              No companies match your filters.
            </div>
          )}

          {loading && (
            <div className="py-24 text-center text-muted-foreground">
              Loading companies...
            </div>
          )}

          {error && (
            <div className="py-24 text-center text-red-500">{error}</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Company Card
// Company Card Component
const CompanyCard = ({ company }: { company: Company }) => {
  const hasTechRoles = company.techRoles && company.techRoles.trim() !== "";
  const hasSkills = company.preferredSkillsets && company.preferredSkillsets.trim() !== "";

  return (
    <Card className="group relative overflow-hidden border border-gray-100 bg-white hover:border-primary-200 hover:shadow-md transition-all duration-300 rounded-2xl">
      <div className="p-6 flex flex-col h-full">
        {/* Logo + Name + Industry */}
        <div className="flex flex-col items-center text-center mb-4">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.companyName}
              className="w-20 h-20 object-contain rounded-md mb-3 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-500 mb-3">
              {company.companyName.charAt(0).toUpperCase()}
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {company.companyName}
          </h3>
          <Badge
            variant="outline"
            className="text-xs border-primary-300 text-primary-700 bg-primary-50"
          >
            {company.industry}
          </Badge>
        </div>

        {/* Summary */}
        {company.companySummary && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 text-center">
            {company.companySummary}
          </p>
        )}

        {/* Tech Roles */}
        {hasTechRoles && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1 text-gray-800 text-center">
              Tech Roles Needed
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {company.techRoles
                ?.split(",")
                .map((role) => role.trim())
                .filter((r) => r.length > 0)
                .map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="text-xs bg-gray-50 border-gray-200 text-gray-700"
                  >
                    {role}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Preferred Skillsets */}
        {hasSkills && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1 text-gray-800 text-center">
              Preferred Skillsets
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {company.preferredSkillsets
                ?.split(",")
                .map((skill) => skill.trim())
                .filter((s) => s.length > 0)
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-700"
                  >
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {company.contactInfoVisible && (
          <div className="mt-auto mb-4 text-xs text-gray-500 text-center space-y-1">
            {company.contactPerson && (
              <p className="font-medium text-gray-700">
                📇 {company.contactPerson}
              </p>
            )}
            {company.contactEmail && (
              <div className="flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{company.contactEmail}</span>
              </div>
            )}
            {company.contactPhone && (
              <div className="flex items-center justify-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{company.contactPhone}</span>
              </div>
            )}
          </div>
        )}

        {/* Website Link */}
        {company.website && (
          <Button
            variant="default"
            className="w-full mt-auto bg-primary hover:bg-primary/90 text-white"
            asChild
          >
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
};


export default CompanyPage;

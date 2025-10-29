import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter, Mail, Phone, Building2 } from "lucide-react";
import { lookupServices } from "@/services/lookupServices";
import { companyServices } from "@/services/companyServices";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

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
      setError("Oops! Something went wrong while loading the page.");
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
     <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
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
                placeholder="Search company...."
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
                Showing {companies.length} of {pagination.total} companies —
                Page {pagination.page} of {pagination.totalPages}
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

          {loading && <LoadingSpinner text="Loading companies..." />}


          {error && (
            <div className="py-24 text-center text-red-500">{error}</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};



// Company Card
const CompanyCard = ({ company }: { company: Company }) => {
  const [isError, setIsError] = useState(false);
  const hasTechRoles = company.techRoles && company.techRoles.trim() !== "";
  const hasSkills =
    company.preferredSkillsets && company.preferredSkillsets.trim() !== "";

  const handleWebsiteClick = (url?: string) => {
    if (!url || !url.startsWith("http")) {
      toast.warning("This company doesn't have a valid website link.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="group relative overflow-hidden border-0 bg-white hover:shadow-lg transition-all duration-300 rounded-xl shadow-sm">
      <div className="p-5 flex flex-col h-full">
        {/* Header: Logo + Name + Industry */}
        <div className="flex items-start gap-4 mb-4">
          {company.logo && !isError ? (
            <img
              src={company.logo}
              alt={company.companyName}
              className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
              onError={() => setIsError(true)}
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-xl shrink-0">
              <Building2 className="w-10 h-10 text-gray-300" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
              {company.companyName}
            </h3>
            {company.industry && (
              <div className="flex flex-wrap gap-1.5">
                {company.industry
                  .split(",")
                  .map((ind) => ind.trim())
                  .filter((i) => i.length > 0)
                  .slice(0, 2)
                  .map((ind) => (
                    <Badge
                      key={ind}
                      variant="outline"
                      className="text-xs border-primary-200 text-primary-700 bg-primary-50"
                    >
                      {ind}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {company.companySummary && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {company.companySummary}
            </p>
          </div>
        )}

        {/* Tech Roles */}
        {hasTechRoles && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Interested Tech Roles
            </p>
            <div className="flex flex-wrap gap-1.5">
              {company.techRoles
                ?.split(",")
                .map((role) => role.trim())
                .filter((r) => r.length > 0)
                .slice(0, 4)
                .map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="text-xs"
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
            <p className="text-xs font-medium text-gray-500 mb-2">
              Preferred Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {company.preferredSkillsets
                ?.split(",")
                .map((skill) => skill.trim())
                .filter((s) => s.length > 0)
                .slice(0, 5)
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-600 bg-gray-50"
                  >
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {company.contactInfoVisible && (
          <div className="mt-auto mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-2">Contact</p>
            <div className="space-y-1.5">
              {company.contactPerson && (
                <p className="text-sm font-medium text-gray-700">
                  {company.contactPerson}
                </p>
              )}
              {company.contactEmail && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{company.contactEmail}</span>
                </div>
              )}
              {company.contactPhone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{company.contactPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant="default"
          className="w-full mt-auto bg-primary hover:bg-primary/90 text-white h-9 text-sm font-medium"
          onClick={() => handleWebsiteClick(company.website)}
        >
          Visit Website
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CompanyPage;

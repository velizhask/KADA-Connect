import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter } from "lucide-react";
import { lookupServices } from "@/services/LookupServices";
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
  website: string;
  logo: string;
  techRoles: string;
}

const CompanyPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [techRoles, setTechRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  // Load lookup data (industries & roles)
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [indRes, roleRes] = await Promise.all([
          lookupServices.getIndustries(),
          lookupServices.getTechRoles(),
        ]);
        setIndustries(indRes.data.data || []);
        setTechRoles(roleRes.data.data || []);
      } catch (err) {
        console.error("Lookup fetch error:", err);
      }
    };
    fetchLookups();
  }, []);

  // Fetch companies (server-side filter + search)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const isSearching = searchTerm.trim().length > 0;

        const filters: any = {
          industry: selectedIndustry !== "all" ? selectedIndustry : undefined,
          techRole: selectedRole !== "all" ? selectedRole : undefined,
          page: 1,
          limit: 20,
        };

        const res = isSearching
          ? await companyServices.searchCompanies(searchTerm, filters)
          : await companyServices.getCompanies(filters);

        setCompanies(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchTerm, selectedIndustry, selectedRole]);

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

    <div className="flex flex-col min-h-[90vh] justify-start">
      {/* Filters */}
      <Card className="mb-8 p-6 shadow-sm transition-all duration-300 border border-gray-100">
  {/* Header */}
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
        setSelectedRole("all");
      }}
    >
      Clear Filters
    </Button>
  </div>

  {/* Filters Grid */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {/* Search */}
    <div className="flex flex-col justify-between">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Search
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search company name..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
      />
    </div>

    {/* Industry */}
    <div className="flex flex-col justify-between">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Industry
      </label>
      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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
    <div className="flex flex-col justify-between">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Tech Role Interest
      </label>
      <Select value={selectedRole} onValueChange={setSelectedRole}>
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


      {/* Results Section */}
      <div className="flex-1 transition-all duration-300">
        {!loading && !error && companies.length > 0 && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {companies.length} companies
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </>
        )}

        {!loading && !error && companies.length === 0 && (
          <div className="py-24 text-center text-muted-foreground">
            No companies match your filters.
          </div>
        )}
      </div>
    </div>
  </div>
</MainLayout>

  
  );
};

const CompanyCard = ({ company }: { company: Company }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold">{company.companyName}</h3>
          <Badge variant="secondary" className="mb-3">
            {company.industry}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {company.companySummary}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 text-sm font-semibold">Tech Roles of Interest</h4>
          <div className="flex flex-wrap gap-2">
            {company.techRoles
              ?.split(",")
              .map((role) => role.trim())
              .map((role) => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
          </div>
        </div>

        <Button variant="default" className="w-full" asChild>
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            Visit Website
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default CompanyPage;

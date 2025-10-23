import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter } from "lucide-react";
import { mockCompanies, industries, techRoles, type Company } from "@/utils/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredCompanies = mockCompanies.filter((company) => {
    const industryMatch = selectedIndustry === "all" || company.industry === selectedIndustry;
    const roleMatch = selectedRole === "all" || company.techRoles.includes(selectedRole);
    return industryMatch && roleMatch;
  });

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Visiting Companies</h1>
          <p className="text-lg text-muted-foreground">
            Explore companies participating in the Industry Visit event.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filter Companies
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Industry</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
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
            <div>
              <label className="mb-2 block text-sm font-medium">Tech Role Interest</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
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
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedIndustry("all");
                  setSelectedRole("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {mockCompanies.length} companies
        </div>

        {/* Company Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No companies match your current filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedIndustry("all");
                setSelectedRole("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const CompanyCard = ({ company }: { company: Company }) => {
  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg" 
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="p-6">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold">{company.name}</h3>
          <Badge variant="secondary" className="mb-3">
            {company.industry}
          </Badge>
          <p className="text-sm text-muted-foreground">{company.description}</p>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 text-sm font-semibold">Tech Roles of Interest</h4>
          <div className="flex flex-wrap gap-2">
            {company.techRoles.map((role) => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="default"
          className="w-full"
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
      </div>
    </Card>
  );
};

export default CompanyPage;
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Filter, ExternalLink } from "lucide-react";
import { lookupServices } from "@/services/lookupServices";
import { studentServices } from "@/services/studentServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Trainee {
  id: number;
  fullName: string;
  status: string;
  university: string;
  major: string;
  preferredIndustry?: string;
  techStack?: string;
  selfIntroduction?: string;
  cvUpload?: string;
  portfolioLink?: string;
  profilePhoto?: string;
  linkedin?: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const TraineePage = () => {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  const [industries, setIndustries] = useState<string[]>([]);
  const [skills, setSkills] = useState<{ name: string }[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [statuses] = useState<string[]>(["Current Trainee", "Alumni"]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  Load lookup data
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [indRes, skillsRes, univRes, majorsRes] = await Promise.all([
          lookupServices.getIndustries(),
          lookupServices.getPopularTechSkills(),
          studentServices.getUniversities(),
          studentServices.getMajors(),
        ]);

        setIndustries(indRes.data?.data || []);
        setSkills(skillsRes.data?.data || []);
        setUniversities(univRes.data?.data || []);
        setMajors(majorsRes.data?.data || []);
      } catch (err) {
        console.error("Lookup fetch error:", err);
      }
    };
    fetchLookups();
  }, []);

  // Fetch trainees with all filters
  useEffect(() => {
    fetchTrainees(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedStatus,
    selectedUniversity,
    selectedMajor,
    selectedIndustry,
    selectedSkill,
    pagination.page,
  ]);

  const fetchTrainees = async (page: number) => {
    try {
      setLoading(true);

      const filters = {
        page,
        limit: pagination.limit,
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(selectedUniversity !== "all" && { university: selectedUniversity }),
        ...(selectedMajor !== "all" && { major: selectedMajor }),
        ...(selectedIndustry !== "all" && { industry: selectedIndustry }),
        ...(selectedSkill !== "all" && { skills: selectedSkill }),
      };

      const res =
        searchTerm.trim().length > 0
          ? await studentServices.searchStudents(searchTerm, filters)
          : await studentServices.getStudents(filters);

      setTrainees(res.data?.data || []);
      setPagination(res.data?.pagination || pagination);
      setError(null);
    } catch (err) {
      console.error("Fetch trainees error:", err);
      setError("Failed to fetch trainees");
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
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">KADA Trainees</h1>
          <p className="text-lg text-muted-foreground">
            Discover talented professionals from the Korea-ASEAN Digital Academy
            program.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6 shadow-sm border border-gray-100">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-base">
              <Filter className="h-4 w-4 text-primary-600" />
              <span>Filter Trainees</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setSelectedUniversity("all");
                setSelectedMajor("all");
                setSelectedIndustry("all");
                setSelectedSkill("all");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FilterInput
              label="Search"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search trainee name..."
            />
            <FilterSelect label="Status" value={selectedStatus} onChange={setSelectedStatus} items={statuses} />
            <FilterSelect label="University" value={selectedUniversity} onChange={setSelectedUniversity} items={universities} />
            <FilterSelect label="Major" value={selectedMajor} onChange={setSelectedMajor} items={majors} />
            <FilterSelect label="Industry" value={selectedIndustry} onChange={setSelectedIndustry} items={industries} />
            <FilterSelect
              label="Tech Skills"
              value={selectedSkill}
              onChange={setSelectedSkill}
              items={skills.map((s) => s.name)}
              valueMap={skills.map((s) => s.name)}
            />
          </div>
        </Card>

        {/* Results */}
        <div className="flex-1 transition-all duration-300">
          {!loading && !error && trainees.length > 0 && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {trainees.length} of {pagination.total} trainees — Page{" "}
                {pagination.page} of {pagination.totalPages}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainees.map((t) => (
                  <TraineeCard key={t.id} trainee={t} onClick={() => setSelectedTrainee(t)} />
                ))}
              </div>

              {/* Pagination Controls */}
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

          {!loading && !error && trainees.length === 0 && (
            <div className="py-24 text-center text-muted-foreground">
              No trainees match your filters.
            </div>
          )}
          {loading && <div className="py-24 text-center text-muted-foreground">Loading trainees...</div>}
          {error && <div className="py-24 text-center text-red-500">{error}</div>}
        </div>

        {/* Profile Dialog */}
        <Dialog open={!!selectedTrainee} onOpenChange={() => setSelectedTrainee(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedTrainee?.fullName}</DialogTitle>
              <DialogDescription>Detailed trainee profile information</DialogDescription>
            </DialogHeader>

            {selectedTrainee && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  {selectedTrainee.profilePhoto && (
                    <img src={selectedTrainee.profilePhoto} alt={selectedTrainee.fullName} className="w-20 h-20 rounded-full object-cover" />
                  )}
                  <Badge variant="outline">{selectedTrainee.status}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold">University</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrainee.university} — {selectedTrainee.major}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Preferred Industry</h4>
                  <Badge>{selectedTrainee.preferredIndustry || "N/A"}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainee.techStack?.split(",").map((tech) => (
                      <Badge key={tech.trim()} variant="secondary">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Introduction</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrainee.selfIntroduction || "No introduction available."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedTrainee.cvUpload && (
                    <Button variant="default" asChild>
                      <a href={selectedTrainee.cvUpload} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" /> View CV
                      </a>
                    </Button>
                  )}
                  {selectedTrainee.portfolioLink && (
                    <Button variant="outline" asChild>
                      <a href={selectedTrainee.portfolioLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Portfolio
                      </a>
                    </Button>
                  )}
                  {selectedTrainee.linkedin && (
                    <Button variant="outline" asChild>
                      <a href={selectedTrainee.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

// Reusable Filter Components
const FilterInput = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange, items, valueMap }: any) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`All ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {items.map((item: string, i: number) => (
          <SelectItem key={i} value={valueMap ? valueMap[i] : item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const TraineeCard = ({ trainee, onClick }: { trainee: Trainee; onClick: () => void }) => (
  <Card className="group cursor-pointer overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
    <div className="p-6 flex flex-col items-center text-center space-y-3">
      {trainee.profilePhoto ? (
        <img
          src={trainee.profilePhoto}
          alt={trainee.fullName}
          className="w-24 h-24 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
          {trainee.fullName.charAt(0).toUpperCase()}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
        {trainee.fullName}
      </h3>
      <Badge variant="outline" className="border-primary-400 text-primary-700 bg-primary-50">
        {trainee.status}
      </Badge>
      <p className="text-sm text-gray-600 leading-tight">
        {trainee.university} <br /> {trainee.major}
      </p>

      {trainee.preferredIndustry && (
        <div className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700">
          {trainee.preferredIndustry}
        </div>
      )}

      {trainee.techStack && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {trainee.techStack.split(",").slice(0, 3).map((tech) => (
            <Badge key={tech.trim()} variant="secondary">
              {tech.trim()}
            </Badge>
          ))}
        </div>
      )}

      <Button
        variant="default"
        className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onClick}
      >
        View Profile
      </Button>
    </div>
  </Card>
);

export default TraineePage;

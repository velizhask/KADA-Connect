import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Filter, ExternalLink, UserCircle } from "lucide-react";
import { lookupServices } from "@/services/lookupServices";
import { studentServices } from "@/services/studentServices";
import { toast } from "sonner";
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
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Helper: Google Drive Formatter
const formatDriveUrl = (input?: string | null): string | undefined => {
  if (!input) return undefined;
  const url = input.trim();

  // Case 1: pure file ID
  if (/^[\w-]{25,}$/.test(url)) {
    return `https://drive.google.com/uc?export=view&id=${url}`;
  }

  // Case 2: pattern ?id= or open?id=
  const idMatch = url.match(/(?:id=|open\?id=)([-\w]{25,})/)?.[1];
  if (idMatch) {
    return `https://drive.google.com/uc?export=view&id=${idMatch}`;
  }

  // Case 3: pattern /d/FILE_ID
  const dMatch = url.match(/\/d\/([-\\w]{25,})/)?.[1];
  if (dMatch) {
    return `https://drive.google.com/uc?export=view&id=${dMatch}`;
  }

  // Case 4: already correct format
  if (url.includes("uc?export=view")) return url;

  // Default: return valid URL only
  return url.startsWith("http") ? url : undefined;
};

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

  // Fetch Lookup Data
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [indRes, skillsRes, univRes, majorsRes] = await Promise.all([
          lookupServices.getIndustries(),
          lookupServices.getPopularTechSkills(),
          lookupServices.getUniversities(),
          lookupServices.getMajors(),
        ]);

        setIndustries(indRes.data?.data || []);
        setSkills(skillsRes.data?.data || []);

        const universitiesData = (univRes.data?.data || []).map((u: any) => {
          const val =
            typeof u === "string" ? u : u.name || u.university || u.label || "";
          return val.trim().replace(/\s+/g, " ");
        });
        const majorsData = (majorsRes.data?.data || []).map((m: any) =>
          typeof m === "string" ? m : m.name || m.major || m.label || ""
        );

        setUniversities(universitiesData.filter(Boolean));
        setMajors(majorsData.filter(Boolean));
      } catch (err) {
        console.error("Lookup fetch error:", err);
      }
    };
    fetchLookups();
  }, []);

  // Fetch Trainee Data
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

  const handleLinkClick = (url?: string | null, label?: string) => {
    if (!url || !url.startsWith("http")) {
      toast.error(`${label || "This link"} is not available.`);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">KADA Trainees</h1>
          <p className="text-lg text-muted-foreground">
            Discover talented professionals from the Korea-ASEAN Digital Academy
            program.
          </p>
        </div>

        {/* Filter Section */}
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

          {/* Filter Inputs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FilterInput
              label="Search"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search trainee..."
            />
            <FilterSelect
              label="Status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              items={statuses}
            />
            <FilterSelect
              label="University"
              value={selectedUniversity}
              onChange={(val: string) => setSelectedUniversity(val.trim())}
              items={universities}
            />
            <FilterSelect
              label="Major"
              value={selectedMajor}
              onChange={setSelectedMajor}
              items={majors}
            />
            <FilterSelect
              label="Industry"
              value={selectedIndustry}
              onChange={setSelectedIndustry}
              items={industries}
            />
            <FilterSelect
              label="Tech Skills"
              value={selectedSkill}
              onChange={setSelectedSkill}
              items={skills.map((s) => s.name)}
            />
          </div>
        </Card>

        {/* Results Section */}
        <div className="flex-1 transition-all duration-300">
          {!loading && !error && trainees.length > 0 && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {trainees.length} of {pagination.total} trainees — Page{" "}
                {pagination.page} of {pagination.totalPages}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainees.map((t) => (
                  <TraineeCard
                    key={t.id}
                    trainee={t}
                    onClick={() => setSelectedTrainee(t)}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 gap-4 flex-wrap">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="min-w-[100px]"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      const current = pagination.page;
                      return (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= current - 1 && pageNum <= current + 1)
                      );
                    })
                    .map((pageNum, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && pageNum - prevPage > 1;
                      
                      return (
                        <div key={pageNum} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="text-gray-400 px-1">•••</span>
                          )}
                          <button
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pagination.page === pageNum
                                ? "bg-primary text-white shadow-sm"
                                : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="min-w-[100px]"
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
          {loading && <LoadingSpinner text="Loading trainee..." />}

          {error && (
            <div className="py-24 text-center text-red-500">{error}</div>
          )}
        </div>

        {/* Dialog */}
        <Dialog
          open={!!selectedTrainee}
          onOpenChange={() => setSelectedTrainee(null)}
        >
          <DialogContent className="max-w-2xl w-[90vw] md:w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl">
            <DialogHeader className="pb-4">
              {selectedTrainee && (
                <div className="flex items-center gap-4">
                  <ProfileImage
                    imageUrl={selectedTrainee.profilePhoto}
                    alt={selectedTrainee.fullName}
                  />
                  <div className="flex flex-col">
                    <DialogTitle className="text-2xl font-medium">
                      {selectedTrainee.fullName}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedTrainee.status}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>

            {selectedTrainee && (
              <div className="space-y-4 mt-1">
                <div>
                  <h4 className="font-medium mb-1">Introduction</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrainee.selfIntroduction ||
                      "No introduction available."}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">University</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrainee.university} — {selectedTrainee.major}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Preferred Industry</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainee.preferredIndustry ? (
                      selectedTrainee.preferredIndustry
                        .split(/\s*,\s*/)
                        .filter(Boolean)
                        .map((ind) => (
                          <Badge key={ind} variant="outline">
                            {ind}
                          </Badge>
                        ))
                    ) : (
                      <Badge variant="outline">N/A</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainee.techStack?.split(",").map((tech) => (
                      <Badge key={tech.trim()} variant="secondary">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="default"
                    onClick={() =>
                      handleLinkClick(
                        selectedTrainee.cvUpload ?? undefined,
                        "CV"
                      )
                    }
                  >
                    <FileText className="mr-2 h-4 w-4" /> View CV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleLinkClick(
                        selectedTrainee.portfolioLink ?? undefined,
                        "Portfolio"
                      )
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Portfolio
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleLinkClick(
                        selectedTrainee.linkedin ?? undefined,
                        "LinkedIn"
                      )
                    }
                  >
                    LinkedIn
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

// Reusable Components

const ProfileImage = ({
  imageUrl,
  alt,
}: {
  imageUrl?: string;
  alt: string;
}) => {
  const [isError, setIsError] = useState(false);
  const finalUrl = formatDriveUrl(imageUrl);

  if (!finalUrl || isError) {
    return (
      <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-xl shrink-0">
        <UserCircle className="w-16 h-16 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={finalUrl}
      alt={alt}
      className="w-20 h-20 rounded-full object-cover"
      onError={() => setIsError(true)}
    />
  );
};

const FilterInput = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange, items }: any) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`All ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {items.map((item: string, i: number) => (
          <SelectItem key={i} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const TraineeCard = ({
  trainee,
  onClick,
}: {
  trainee: Trainee;
  onClick: () => void;
}) => {
  const [isError, setIsError] = useState(false);
  const photoUrl = formatDriveUrl(trainee.profilePhoto);

  // Format name to title case
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get status badge style based on status
  const getStatusBadgeClass = (status: string) => {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes("alumni")) {
      return "border-purple-200 text-purple-700 bg-purple-50";
    }

    // Current trainee (default)
    return "border-primary-200 text-primary-700 bg-primary-50";
  };

  return (
    <Card className="group overflow-hidden border-0 hover:shadow-lg transition-all duration-300 rounded-xl bg-white shadow-sm">
      <div className="p-5">
        {/* Header Section - Photo & Name */}
        <div className="flex items-start gap-4 mb-4">
          {photoUrl && !isError ? (
            <img
              src={photoUrl}
              alt={trainee.fullName}
              className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
              onError={() => setIsError(true)}
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-xl shrink-0">
              <UserCircle className="w-10 h-10 text-gray-300" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
              {formatName(trainee.fullName)}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs ${getStatusBadgeClass(trainee.status)}`}
            >
              {trainee.status}
            </Badge>
          </div>
        </div>

        {/* Education Info */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            {trainee.university}
          </p>
          <p className="text-xs text-gray-500 mt-1">{trainee.major}</p>
        </div>

        {/* Industries */}
        {trainee.preferredIndustry && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Industry</p>
            <div className="flex flex-wrap gap-1.5">
              {trainee.preferredIndustry
                .split(/\s*,\s*/)
                .filter(Boolean)
                .slice(0, 3)
                .map((ind) => (
                  <Badge
                    key={ind}
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-600 bg-gray-50"
                  >
                    {ind}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {trainee.techStack && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {trainee.techStack
                .split(",")
                .slice(0, 4)
                .map((tech) => (
                  <Badge
                    key={tech.trim()}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tech.trim()}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant="default"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm font-medium"
          onClick={onClick}
        >
          View Full Profile
        </Button>
      </div>
    </Card>
  );
};
export default TraineePage;

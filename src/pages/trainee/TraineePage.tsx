import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Filter,
  ExternalLink,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { getImageUrl } from "@/utils/imageHelper";
import { useDebounce } from "@/hooks/useDebounce";
import { getStatusBadgeClass } from "@/utils/statusBadgeHelper";

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

  const [traineeImages, setTraineeImages] = useState<Record<number, string>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
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

        const rawIndustries = (indRes.data?.data as string[]) || [];

        const cleanIndustries: string[] = Array.from(
          new Set(
            rawIndustries
              .flatMap((item: string) =>
                item
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter((s: string) => Boolean(s))
              )
              .map((s: string) =>
                s
                  .replace(/\s+/g, " ")
                  .replace(/healthcare/i, "Healthcare")
                  .replace(/manufactury/i, "Manufacturing")
                  .replace(/manufacture/i, "Manufacturing")
                  .replace(/fmcg/i, "FMCG")
                  .replace(/fintech/i, "FinTech")
                  .replace(/edutech/i, "EduTech")
                  .replace(/\b(it)\b/i, "IT")
              )
              .filter(
                (s: string) =>
                  !/any\s*industr(y|ies)/i.test(s) &&
                  !/required\s+my\s+skill/i.test(s)
              )
          )
        ).sort((a: string, b: string) => a.localeCompare(b));

        setIndustries(cleanIndustries);

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
  }, [
    debouncedSearch,
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

      const fetchedData = res.data?.data || [];
      const fetchedPagination = res.data?.pagination || {};

      // 🔹 SIMPAN DATA DULU TANPA GAMBAR
      const traineesWithoutImages = fetchedData.map((t: any) => ({
        ...t,
        profilePhoto: undefined, // kosong dulu, nanti diisi async
      }));

      setTrainees(traineesWithoutImages);

      // 🔹 SET PAGINATION
      setPagination({
        ...pagination,
        page: fetchedPagination.page ?? 1,
        limit: fetchedPagination.limit ?? 12,
        total: fetchedPagination.total ?? fetchedData.length,
        totalPages:
          fetchedPagination.totalPages ??
          Math.ceil(
            (fetchedPagination.total ?? fetchedData.length) /
              (fetchedPagination.limit ?? 12)
          ),
      });

      // 🔹 Mulai load gambar di background TANPA nge-block render
      queueMicrotask(() => loadProfilePhotosAsync(fetchedData));

      setError(null);
    } catch (err) {
      console.error("Fetch trainees error:", err);
      setError("Oops! Something went wrong while loading the page.");
    } finally {
      setLoading(false);
    }
  };

  const TechStackSection = ({ techStack }: { techStack?: string }) => {
    const [showAll, setShowAll] = useState(false);
    if (!techStack) return null;

    const allSkills = techStack
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const displayed = showAll ? allSkills : allSkills.slice(0, 5);

    return (
      <div>
        <h4 className="font-medium mb-1">Tech Stack</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {displayed.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        {allSkills.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            {showAll ? "Hide" : `Show all (${allSkills.length})`}
          </button>
        )}
      </div>
    );
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };
  const handleLinkClick = (url?: string | null, label?: string) => {
    // Handle undefined, null, empty, or '-' input
    if (!url || url.trim() === "" || url.trim() === "-") {
      toast.error(`${label || "This link"} is not available.`);
      return;
    }

    // Split multiple links (&, comma, or space)
    const links = url
      .split(/[\s,&]+/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (links.length === 0) {
      toast.error(`${label || "This link"} is not available.`);
      return;
    }

    links.forEach((raw) => {
      let finalUrl = raw;

      // Remove 'www.' prefix if exists
      finalUrl = finalUrl.replace(/^www\./i, "");

      // LinkedIn auto-format
      if (label?.toLowerCase().includes("linkedin")) {
        if (!/^https?:\/\//i.test(finalUrl)) {
          if (finalUrl.startsWith("linkedin.com")) {
            finalUrl = `https://${finalUrl}`;
          } else if (/^[a-zA-Z0-9._-]+$/.test(finalUrl)) {
            finalUrl = `https://linkedin.com/in/${finalUrl}`;
          } else {
            finalUrl = `https://linkedin.com/${finalUrl.replace(/^\/+/, "")}`;
          }
        }
      }
      // Add https:// if missing
      else if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      // Open link safely
      try {
        window.open(finalUrl, "_blank", "noopener,noreferrer");
      } catch {
        toast.error(`Unable to open ${label || "the link"}.`);
      }
    });
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  // Get filtered page numbers for pagination
  const getPageNumbers = () => {
    const current = pagination.page;
    const total = pagination.totalPages;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    return Array.from({ length: total }, (_, i) => i + 1).filter((pageNum) => {
      if (isMobile) {
        return pageNum === 1 || pageNum === total || pageNum === current;
      }
      return (
        pageNum === 1 ||
        pageNum === total ||
        (pageNum >= current - 1 && pageNum <= current + 1)
      );
    });
  };

  const loadProfilePhotosAsync = async (fetchedData: any[]) => {
    const newImages: Record<number, string> = {};

    for (const t of fetchedData) {
      if (
        typeof t.profilePhoto === "string" &&
        t.profilePhoto.startsWith("data:image")
      ) {
        newImages[t.id] = t.profilePhoto;
      } else if (t.profilePhoto) {
        const url = getImageUrl(t.profilePhoto);
        if (url) newImages[t.id] = url;
      }
    }

    setTimeout(() => {
      setTraineeImages((prev) => ({ ...prev, ...newImages }));
    }, 10);
  };

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-medium">
            KADA Trainees
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Discover talented professionals from the Korea-ASEAN Digital Academy
            program.
          </p>
        </div>

        {/* Filter Section */}
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base">
              <Filter className="h-4 w-4 text-primary-600" />
              <span>Filter Trainees</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9"
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
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FilterInput
              label="Search"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Type name or keyword..."
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
              <div className="mb-4 text-xs sm:text-sm text-muted-foreground px-1">
                <span className="hidden sm:inline">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} trainees — Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>
                <span className="sm:hidden">
                  Page {pagination.page} of {pagination.totalPages} (
                  {pagination.total} total)
                </span>
              </div>
              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {trainees.map((t) => (
                  <TraineeCard
                    key={t.id}
                    trainee={t}
                    onClick={() => setSelectedTrainee(t)}
                    image={traineeImages[t.id]}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="w-full mt-6 sm:mt-8 px-2 sm:px-0">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {/* Previous */}
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="flex items-center justify-center gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-4 cursor-pointer text-xs sm:text-sm"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:inline">Prev</span>
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {getPageNumbers().map((pageNum, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && pageNum - prevPage > 1;

                      return (
                        <div
                          key={pageNum}
                          className="flex items-center gap-1 sm:gap-2"
                        >
                          {showEllipsis && (
                            <span className="text-gray-400 px-0.5 sm:px-1 text-xs sm:text-sm">
                              •••
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 sm:w-9 cursor-pointer sm:h-9 md:w-10 md:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                              pagination.page === pageNum
                                ? "bg-primary text-white shadow-sm cursor-pointer"
                                : "bg-white border border-gray-200 text-gray-700  cursor-pointer hover:border-primary-300 hover:bg-primary-50 active:scale-95"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next */}
                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="flex items-center justify-center gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-4 cursor-pointer text-xs sm:text-sm"
                  >
                    <span className="hidden xs:inline sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
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
          <DialogContent className="max-w-2xl w-[90vw] md:w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl animate-in fade-in duration-300">
            {selectedTrainee && (
              <>
                {/* Header Section */}
                <DialogHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                    <ProfileImage
                      imageUrl={
                        traineeImages[selectedTrainee.id] ||
                        selectedTrainee.profilePhoto ||
                        ""
                      }
                      alt={selectedTrainee.fullName || "Unknown Trainee"}
                    />

                    <div className="flex flex-col">
                      <DialogTitle className="text-2xl font-medium">
                        {selectedTrainee.fullName}
                      </DialogTitle>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusBadgeClass(
                            selectedTrainee.status
                          )}`}
                        >
                          {selectedTrainee.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Body Content */}
                <div className="space-y-4 mt-1 text-left">
                  {/* Introduction */}
                  <div>
                    <h4 className="font-medium mb-1">Introduction</h4>
                    <p className="text-sm text-muted-foreground text-justify">
                      {selectedTrainee.selfIntroduction ||
                        "No introduction available."}
                    </p>
                  </div>

                  {/* University */}
                  <div>
                    <h4 className="font-medium mb-1">University</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedTrainee.university} — {selectedTrainee.major}
                    </p>
                  </div>

                  {/* Preferred Industry */}
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

                  {/* Tech Stack */}
                  <TechStackSection techStack={selectedTrainee.techStack} />

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="default"
                      onClick={() =>
                        handleLinkClick(
                          selectedTrainee.cvUpload ?? undefined,
                          "CV"
                        )
                      }
                      className="cursor-pointer"
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
                      className="cursor-pointer"
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
                      className="cursor-pointer"
                    >
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </>
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
  const [finalSrc, setFinalSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setFinalSrc(null);
      return;
    }

    // Jalankan async tapi biarkan dialog render dulu
    const timeout = setTimeout(() => {
      const isBase64 =
        typeof imageUrl === "string" && imageUrl.startsWith("data:image");
      const resolvedUrl = isBase64 ? imageUrl : getImageUrl(imageUrl);
      setFinalSrc(resolvedUrl || null);
    }, 50); // delay kecil biar UI muncul dulu

    return () => clearTimeout(timeout);
  }, [imageUrl]);

  // fallback jika error
  if (!finalSrc || isError) {
    return (
      <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-xl shrink-0">
        <UserCircle className="w-16 h-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        loading="lazy"
        className={`w-36 h-36 rounded-xl object-cover shrink-0 transition-opacity duration-700 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

const FilterInput = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
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
    <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
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
  image,
}: {
  trainee: Trainee;
  onClick: () => void;
  image?: string;
}) => {
  const [isError, setIsError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Ambil dari async image prop dulu (base64 yang baru muncul)
  // fallback ke trainee.profilePhoto (URL biasa / proxy)
  const photoUrl =
    image ||
    (trainee.profilePhoto?.startsWith("data:image")
      ? undefined
      : getImageUrl(trainee.profilePhoto));

  const formatName = (name: string) =>
    name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <Card className="group flex flex-col justify-between border-0 hover:shadow-lg transition-all duration-300 rounded-xl bg-white shadow-sm h-full">
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 gap-3 mb-4">
          {/* Foto */}
          <div className="relative w-24 h-24 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
            {/* Skeleton shimmer tampil dulu */}
            {!loaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
            )}

            {/* Kalau ada image, load async */}
            {photoUrl && !isError ? (
              <img
                src={photoUrl}
                alt={trainee.fullName}
                onLoad={() => setLoaded(true)}
                onError={() => setIsError(true)}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-700 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              // Kalau gagal load, icon muncul tapi card tetap tampil
              <UserCircle className="w-10 h-10 text-gray-300" />
            )}
          </div>

          {/* Nama dan Status */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left mt-2 sm:mt-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
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
        <div className="mb-4 pb-3 border-b border-gray-100 text-left">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {trainee.university}
          </p>
          <p className="text-xs text-gray-500 mt-1">{trainee.major}</p>
        </div>

        {/* Industry */}
        {trainee.preferredIndustry && (
          <div className="mb-3 text-left">
            <p className="text-xs font-medium text-gray-500 mb-1.5">Industry</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
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

        {/* Skills */}
        {trainee.techStack
          ?.split(/[,|]/)
          .map((tech) => tech.trim())
          .filter(Boolean)
          .slice(0, 4)
          .map((tech, index) => {
            const shortTech = tech.split(/\s+/).slice(0, 4).join(" ");
            return (
              <Badge
                key={`${tech}-${index}`}
                variant="secondary"
                className="text-xs px-2 my-1 py-1 leading-snug whitespace-normal break-word rounded-2xl"
                title={tech}
              >
                {shortTech}
              </Badge>
            );
          })}
      </div>

      {/* Footer Button */}
      <div className="p-4 sm:p-5 pt-0 text-left">
        <Button
          variant="default"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs sm:text-sm font-medium cursor-pointer"
          onClick={onClick}
        >
          View Full Profile
        </Button>
      </div>
    </Card>
  );
};

export default TraineePage;

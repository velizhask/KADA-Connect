import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Filter } from "lucide-react";
import { mockTrainees, industries, techStacks, type Trainee } from "@/utils/mockData";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TraineePage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedTechStack, setSelectedTechStack] = useState<string>("all");
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  const filteredTrainees = mockTrainees.filter((trainee) => {
    const industryMatch =
      selectedIndustry === "all" || trainee.preferredIndustry === selectedIndustry;
    const techMatch =
      selectedTechStack === "all" || trainee.techStack.includes(selectedTechStack);
    return industryMatch && techMatch;
  });

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">KADA Trainees</h1>
          <p className="text-lg text-muted-foreground">
            Discover talented professionals from the Korea-ASEAN Digital Academy program.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filter Trainees
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Preferred Industry</label>
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
              <label className="mb-2 block text-sm font-medium">Tech Stack / Skills</label>
              <Select value={selectedTechStack} onValueChange={setSelectedTechStack}>
                <SelectTrigger>
                  <SelectValue placeholder="All Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {techStacks.map((stack) => (
                    <SelectItem key={stack} value={stack}>
                      {stack}
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
                  setSelectedTechStack("all");
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
          Showing {filteredTrainees.length} of {mockTrainees.length} trainees
        </div>

        {/* Trainee Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainees.map((trainee) => (
            <TraineeCard
              key={trainee.id}
              trainee={trainee}
              onClick={() => setSelectedTrainee(trainee)}
            />
          ))}
        </div>

        {filteredTrainees.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No trainees match your current filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedIndustry("all");
                setSelectedTechStack("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Trainee Detail Dialog */}
        <Dialog open={!!selectedTrainee} onOpenChange={() => setSelectedTrainee(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTrainee?.name}</DialogTitle>
              <DialogDescription>
                <Badge variant="outline" className="mt-2">
                  {selectedTrainee?.status}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Preferred Industry</h4>
                <Badge>{selectedTrainee?.preferredIndustry}</Badge>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainee?.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Introduction</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTrainee?.introduction}
                </p>
              </div>
              <Button className="w-full" asChild>
                <a href={selectedTrainee?.cvUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  View CV
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

const TraineeCard = ({
  trainee,
  onClick,
}: {
  trainee: Trainee;
  onClick: () => void;
}) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{ boxShadow: 'var(--shadow-card)' }}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="mb-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl font-bold">{trainee.name}</h3>
            <Badge variant="outline" className="text-xs">
              {trainee.status}
            </Badge>
          </div>
          <Badge variant="secondary" className="mb-3">
            {trainee.preferredIndustry}
          </Badge>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {trainee.introduction}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 text-sm font-semibold">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {trainee.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {trainee.techStack.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{trainee.techStack.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <Button variant="default" className="w-full">
          View Profile
        </Button>
      </div>
    </Card>
  );
};

export default TraineePage;
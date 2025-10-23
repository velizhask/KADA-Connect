import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, GraduationCap, Calendar, Target } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container relative px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to KADA Connect
            </h1>
            <p className="mb-8 text-lg sm:text-xl opacity-90">
              Bridging talent and opportunity. Connect with companies and trainees at the
              Korea-ASEAN Digital Academy Industry Visit.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/company">
                  <Building2 className="mr-2 h-5 w-5" />
                  Explore Companies
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <Link to="/trainees">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Meet Trainees
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 transition-all hover:shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">For Companies</h3>
              <p className="text-muted-foreground">
                Discover talented trainees from the KADA program. Filter by tech stack,
                industry preference, and explore their profiles and CVs.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">For Trainees</h3>
              <p className="text-muted-foreground">
                Explore visiting companies, learn about their focus areas, and discover
                potential career opportunities aligned with your skills.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg md:col-span-2 lg:col-span-1" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Industry Visit 2025</h3>
              <p className="text-muted-foreground">
                Join us on November 12, 2025 for meaningful connections between
                Korea-ASEAN talent and industry leaders.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50 py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold">About KADA Connect</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              KADA Connect is a digital platform designed to facilitate meaningful
              connections during the Industry Visit event. Our mission is to bridge the gap
              between talented digital professionals from Korea and ASEAN countries with
              leading companies seeking innovative talent.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-semibold">Centralized Profiles</h4>
                <p className="text-sm text-muted-foreground">
                  Easy access to comprehensive company and trainee information
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-semibold">Smart Filtering</h4>
                <p className="text-sm text-muted-foreground">
                  Find the perfect match by industry, skills, and interests
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
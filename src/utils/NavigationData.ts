import {
  LayoutDashboard,
  Users,
  Building2
} from "lucide-react";

export const NAVIGATION_DATA = {
  // ADMIN (Coordinator)
  admin: [
    {
      id: "01",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "02",
      label: "Manage Trainees",
      icon: Users,
      path: "/admin/trainees",
    },
    {
      id: "03",
      label: "Manage Companies",
      icon: Building2,
      path: "/admin/companies",
    },
  ],
  // COMPANY (Visitor)
  company: [
    {
      id: "01",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/company/dashboard",
    },
    {
      id: "02",
      label: "Trainee List",
      icon: Users,
      path: "/company/trainees",
    }
  ],

  // TRAINEE (Visitor)
  trainee: [
    {
      id: "01",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/trainee/dashboard",
    },
    {
      id: "02",
      label: "Company List",
      icon: Building2,
      path: "/trainee/companies",
    }
  ],
};

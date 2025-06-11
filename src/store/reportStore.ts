/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Report, User, Activity, AppState } from "../types";

interface ReportStore extends AppState {
  // Actions
  setReports: (reports: Report[]) => void;
  addReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  reorderReports: (activeId: string, overId: string) => void;

  // Search and Filter
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: "all" | "draft" | "published") => void;
  setSortBy: (sortBy: "updatedAt" | "createdAt" | "title") => void;
  setSortOrder: (order: "asc" | "desc") => void;

  // Activities
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setAiLoading: (loading: boolean) => void;

  // Computed
  getFilteredReports: () => Report[];
}

const defaultUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@company.com",
  role: "admin",
  avatar:
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
};

const sampleReports: Report[] = [
  {
    id: "1",
    title: "Q4 2024 Performance Analysis",
    content:
      "<h2>Executive Summary</h2><p>This report provides a comprehensive analysis of our Q4 2024 performance metrics...</p>",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    createdBy: "1",
    status: "published",
    tags: ["quarterly", "performance", "analysis"],
  },
  {
    id: "2",
    title: "Market Research: AI Trends 2025",
    content:
      "<h2>Introduction</h2><p>The AI landscape continues to evolve rapidly...</p>",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    createdBy: "1",
    status: "draft",
    tags: ["market research", "AI", "trends"],
    aiGenerated: true,
  },
];

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      // Initial state
      reports: sampleReports,
      currentUser: defaultUser,
      searchQuery: "",
      filterStatus: "all",
      sortBy: "updatedAt",
      sortOrder: "desc",
      activities: [],
      isLoading: false,
      aiLoading: false,

      // Actions
      setReports: (reports) => set({ reports }),

      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          reports: [newReport, ...state.reports],
        }));

        get().addActivity({
          reportId: newReport.id,
          action: "created",
          userId: get().currentUser.id,
        });
      },

      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updates, updatedAt: new Date() }
              : report
          ),
        }));

        get().addActivity({
          reportId: id,
          action: "edited",
          userId: get().currentUser.id,
        });
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
          activities: state.activities.filter(
            (activity) => activity.reportId !== id
          ),
        }));
      },

      reorderReports: (activeId, overId) => {
        const { reports } = get();
        const activeIndex = reports.findIndex(
          (report) => report.id === activeId
        );
        const overIndex = reports.findIndex((report) => report.id === overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newReports = [...reports];
          const [reorderedItem] = newReports.splice(activeIndex, 1);
          newReports.splice(overIndex, 0, reorderedItem);

          set({ reports: newReports });

          get().addActivity({
            reportId: activeId,
            action: "reordered",
            userId: get().currentUser.id,
          });
        }
      },

      // Search and Filter
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),

      // Activities
      addActivity: (activityData) => {
        const newActivity: Activity = {
          ...activityData,
          id: Date.now().toString(),
          timestamp: new Date(),
        };

        set((state) => ({
          activities: [newActivity, ...state.activities.slice(0, 49)], // Keep last 50 activities
        }));
      },

      // Loading states
      setLoading: (loading) => set({ isLoading: loading }),
      setAiLoading: (loading) => set({ aiLoading: loading }),

      // Computed
      getFilteredReports: () => {
        const { reports, searchQuery, filterStatus, sortBy, sortOrder } = get();

        const filtered = reports.filter((report) => {
          const matchesSearch =
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.content.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus =
            filterStatus === "all" || report.status === filterStatus;

          return matchesSearch && matchesStatus;
        });

        // Sort
        filtered.sort((a, b) => {
          let aVal: any = a[sortBy];
          let bVal: any = b[sortBy];

          if (sortBy === "title") {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          if (sortOrder === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });

        return filtered;
      },
    }),
    {
      name: "report-store",
      partialize: (state) => ({
        reports: state.reports,
        currentUser: state.currentUser,
        activities: state.activities,
      }),
    }
  )
);

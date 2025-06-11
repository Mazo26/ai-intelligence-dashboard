export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: 'draft' | 'published';
  tags: string[];
  aiGenerated?: boolean;
  aiSummary?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  avatar?: string;
}

export interface Activity {
  id: string;
  reportId: string;
  action: 'created' | 'edited' | 'ai_generated' | 'ai_summarized' | 'reordered';
  timestamp: Date;
  userId: string;
  details?: string;
}

export interface AppState {
  reports: Report[];
  currentUser: User;
  searchQuery: string;
  filterStatus: 'all' | 'draft' | 'published';
  sortBy: 'updatedAt' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  activities: Activity[];
  isLoading: boolean;
  aiLoading: boolean;
}
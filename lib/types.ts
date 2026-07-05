// ========================
// ENUMS & CONSTANTS
// ========================

export type ASKGroup = 'knowledge' | 'skill' | 'attitude';
export type CompetencyType = 'core' | 'functional' | 'management';
export type CompetencyStatus = 'draft' | 'active' | 'inactive';
export type EmployeeStatus = 'active' | 'probation' | 'inactive' | 'resigned';
export type EvaluationType = 'self' | 'manager' | 'peer' | '360';
export type EvaluationStatus = 'draft' | 'in_progress' | 'completed' | 'approved';
export type IDPStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
export type GapClassification = 'met' | 'needs_improvement' | 'critical_gap';
export type AIReportStatus = 'draft' | 'reviewed' | 'approved' | 'sent';
export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export const ASK_GROUP_LABELS: Record<ASKGroup, string> = {
  knowledge: 'Kiến thức (Knowledge)',
  skill: 'Kỹ năng (Skill)',
  attitude: 'Thái độ (Attitude)',
};

export const COMPETENCY_TYPE_LABELS: Record<CompetencyType, string> = {
  core: 'Cốt lõi',
  functional: 'Chuyên môn',
  management: 'Quản lý',
};

export const COMPETENCY_STATUS_LABELS: Record<CompetencyStatus, string> = {
  draft: 'Nháp',
  active: 'Đang áp dụng',
  inactive: 'Ngưng áp dụng',
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: 'Đang làm việc',
  probation: 'Thử việc',
  inactive: 'Nghỉ phép dài hạn',
  resigned: 'Đã nghỉ việc',
};

export const EVALUATION_TYPE_LABELS: Record<EvaluationType, string> = {
  self: 'Tự đánh giá',
  manager: 'Quản lý đánh giá',
  peer: 'Đồng nghiệp đánh giá',
  '360': 'Đánh giá 360°',
};

export const IDP_STATUS_LABELS: Record<IDPStatus, string> = {
  not_started: 'Chưa bắt đầu',
  in_progress: 'Đang thực hiện',
  completed: 'Hoàn thành',
  overdue: 'Quá hạn',
};

export const AI_REPORT_STATUS_LABELS: Record<AIReportStatus, string> = {
  draft: 'Bản nháp',
  reviewed: 'Đã xem xét',
  approved: 'Đã phê duyệt',
  sent: 'Đã gửi',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản trị viên',
  hr: 'Nhân sự (HR)',
  manager: 'Quản lý',
  employee: 'Nhân viên',
};

// ========================
// CORE INTERFACES
// ========================

export interface Department {
  id: string;
  name: string;
  description: string;
  teams: Team[];
}

export interface Team {
  id: string;
  departmentId: string;
  name: string;
  description: string;
}

export interface Position {
  id: string;
  teamId: string;
  departmentId: string;
  name: string;
  level: string; // Intern, Junior, Senior, Lead, Manager, Director
  description: string;
}

export interface LevelDescription {
  level: number; // 1-5
  description: string;
  behaviors: string[];
}

export interface Competency {
  id: string;
  code: string;
  name: string;
  askGroup: ASKGroup;
  type: CompetencyType;
  definition: string;
  observableBehaviors: string[];
  levelDescriptions: LevelDescription[];
  weight: number; // 1-3
  status: CompetencyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PositionCompetency {
  id: string;
  positionId: string;
  competencyId: string;
  requiredLevel: number; // 1-5
  weight: number; // 1-3
}

export interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  departmentId: string;
  teamId: string;
  positionId: string;
  level: string;
  managerId: string | null;
  startDate: string;
  status: EmployeeStatus;
  avatarUrl?: string;
}

export interface EvaluationPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed';
}

export interface CompetencyEvaluation {
  competencyId: string;
  competencyName: string;
  askGroup: ASKGroup;
  requiredLevel: number;
  selfScore: number | null;
  managerScore: number | null;
  peerScore: number | null;
  finalScore: number;
  gap: number;
  gapClassification: GapClassification;
  weight: number;
  evidence: string;
  evaluatorComment: string;
}

export interface Evaluation {
  id: string;
  employeeId: string;
  periodId: string;
  type: EvaluationType;
  evaluatorId: string | null;
  competencyScores: CompetencyEvaluation[];
  weightedTotalScore: number;
  overallComment: string;
  status: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IDPItem {
  id: string;
  employeeId: string;
  competencyId: string;
  competencyName: string;
  developmentGoal: string;
  trainingActions: string;
  responsiblePerson: string;
  deadline: string;
  status: IDPStatus;
  progressNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIReport {
  id: string;
  employeeId: string;
  periodId: string;
  status: AIReportStatus;
  reportData: AIReportData;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface AIReportData {
  summary: string;
  strengths: string[];
  developmentAreas: string[];
  askAnalysis: {
    knowledge: string;
    skill: string;
    attitude: string;
  };
  roleFit: string;
  risks: string[];
  developmentPlan30Days: string[];
  developmentPlan60Days: string[];
  developmentPlan90Days: string[];
  trainingSuggestions: string[];
  careerPathSuggestion: string;
  managerNotes: string;
  conclusion: string;
}

// ========================
// UI / APP STATE
// ========================

export type ActivePage =
  | 'dashboard'
  | 'dictionary'
  | 'framework'
  | 'employees'
  | 'evaluation'
  | 'gap-analysis'
  | 'idp'
  | 'reports'
  | 'ai-report'
  | 'settings';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
}

export interface DashboardStats {
  totalDepartments: number;
  totalTeams: number;
  totalPositions: number;
  totalEmployees: number;
  totalCompetencies: number;
  evaluationCompletionRate: number;
  topGapCompetencies: { name: string; avgGap: number }[];
  departmentGaps: { department: string; avgGap: number }[];
  employeesNeedingIDP: number;
}

// Helper to classify gap
export function classifyGap(gap: number): GapClassification {
  if (gap >= 0) return 'met';
  if (gap >= -1) return 'needs_improvement';
  return 'critical_gap';
}

export const GAP_LABELS: Record<GapClassification, string> = {
  met: 'Đạt',
  needs_improvement: 'Cần cải thiện',
  critical_gap: 'Thiếu hụt nghiêm trọng',
};

export const GAP_COLORS: Record<GapClassification, string> = {
  met: '#10b981',
  needs_improvement: '#f59e0b',
  critical_gap: '#ef4444',
};

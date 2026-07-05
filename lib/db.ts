import {
  Department,
  Team,
  Position,
  Competency,
  PositionCompetency,
  Employee,
  EvaluationPeriod,
  Evaluation,
  IDPItem,
  AIReport,
  DashboardStats,
} from './types';
import {
  SEED_DEPARTMENTS,
  SEED_TEAMS,
  SEED_POSITIONS,
  SEED_COMPETENCIES,
  SEED_POSITION_COMPETENCIES,
  SEED_EMPLOYEES,
  SEED_EVALUATION_PERIODS,
  SEED_EVALUATIONS,
  SEED_IDP_ITEMS,
  SEED_AI_REPORTS,
} from './seed-data';

const STORAGE_KEY = 'cf_data_v1';

interface DBState {
  departments: Department[];
  teams: Team[];
  positions: Position[];
  competencies: Competency[];
  positionCompetencies: PositionCompetency[];
  employees: Employee[];
  evaluationPeriods: EvaluationPeriod[];
  evaluations: Evaluation[];
  idpItems: IDPItem[];
  aiReports: AIReport[];
}

function getInitialState(): DBState {
  return {
    departments: SEED_DEPARTMENTS,
    teams: SEED_TEAMS,
    positions: SEED_POSITIONS,
    competencies: SEED_COMPETENCIES,
    positionCompetencies: SEED_POSITION_COMPETENCIES,
    employees: SEED_EMPLOYEES,
    evaluationPeriods: SEED_EVALUATION_PERIODS,
    evaluations: SEED_EVALUATIONS,
    idpItems: SEED_IDP_ITEMS,
    aiReports: SEED_AI_REPORTS,
  };
}

let dbInstance: DBState | null = null;

function loadDB(): DBState {
  if (typeof window === 'undefined') return getInitialState(); // SSR fallback
  if (dbInstance) return dbInstance;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      dbInstance = JSON.parse(saved);
      return dbInstance as DBState;
    } catch (e) {
      console.error('Failed to parse DB from localStorage', e);
    }
  }
  
  dbInstance = getInitialState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dbInstance));
  return dbInstance;
}

function saveDB(state: DBState) {
  if (typeof window === 'undefined') return;
  dbInstance = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const initializeDB = async () => {
  loadDB();
  return Promise.resolve();
};

export const resetDB = async () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  dbInstance = null;
  loadDB();
  return Promise.resolve();
};

// Generic CRUD helpers
const getCollection = <K extends keyof DBState>(key: K): DBState[K] => {
  return loadDB()[key];
};

const setCollection = <K extends keyof DBState>(key: K, data: DBState[K]) => {
  const db = loadDB();
  db[key] = data;
  saveDB(db);
};

// Departments
export const getDepartments = async () => getCollection('departments');

// Teams
export const getTeams = async () => getCollection('teams');

// Positions
export const getPositions = async () => getCollection('positions');

// Competencies
export const getCompetencies = async () => getCollection('competencies');
export const addCompetency = async (comp: Competency) => {
  const list = await getCompetencies();
  setCollection('competencies', [...list, comp]);
};
export const updateCompetency = async (comp: Competency) => {
  const list = await getCompetencies();
  setCollection('competencies', list.map(c => c.id === comp.id ? comp : c));
};
export const deleteCompetency = async (id: string) => {
  const list = await getCompetencies();
  setCollection('competencies', list.filter(c => c.id !== id));
};

// Position Competencies
export const getPositionCompetencies = async (positionId: string) => {
  const list = getCollection('positionCompetencies');
  return list.filter(pc => pc.positionId === positionId);
};
export const setPositionCompetencies = async (positionId: string, items: PositionCompetency[]) => {
  const list = getCollection('positionCompetencies');
  const filtered = list.filter(pc => pc.positionId !== positionId);
  setCollection('positionCompetencies', [...filtered, ...items]);
};

// Employees
export const getEmployees = async () => getCollection('employees');
export const addEmployee = async (emp: Employee) => {
  const list = await getEmployees();
  setCollection('employees', [...list, emp]);
};
export const updateEmployee = async (emp: Employee) => {
  const list = await getEmployees();
  setCollection('employees', list.map(e => e.id === emp.id ? emp : e));
};
export const deleteEmployee = async (id: string) => {
  const list = await getEmployees();
  setCollection('employees', list.filter(e => e.id !== id));
};

// Evaluations
export const getEvaluations = async () => getCollection('evaluations');
export const getEvaluationsByEmployee = async (employeeId: string) => {
  const list = await getEvaluations();
  return list.filter(e => e.employeeId === employeeId);
};
export const addEvaluation = async (eval_: Evaluation) => {
  const list = await getEvaluations();
  setCollection('evaluations', [...list, eval_]);
};
export const updateEvaluation = async (eval_: Evaluation) => {
  const list = await getEvaluations();
  setCollection('evaluations', list.map(e => e.id === eval_.id ? eval_ : e));
};

// IDP
export const getIDPItems = async () => getCollection('idpItems');
export const getIDPByEmployee = async (employeeId: string) => {
  const list = await getIDPItems();
  return list.filter(i => i.employeeId === employeeId);
};
export const addIDPItem = async (item: IDPItem) => {
  const list = await getIDPItems();
  setCollection('idpItems', [...list, item]);
};
export const updateIDPItem = async (item: IDPItem) => {
  const list = await getIDPItems();
  setCollection('idpItems', list.map(i => i.id === item.id ? item : i));
};
export const deleteIDPItem = async (id: string) => {
  const list = await getIDPItems();
  setCollection('idpItems', list.filter(i => i.id !== id));
};

// AI Reports
export const getAIReports = async () => getCollection('aiReports');
export const getAIReportsByEmployee = async (employeeId: string) => {
  const list = await getAIReports();
  return list.filter(r => r.employeeId === employeeId);
};
export const addAIReport = async (report: AIReport) => {
  const list = await getAIReports();
  setCollection('aiReports', [...list, report]);
};
export const updateAIReport = async (report: AIReport) => {
  const list = await getAIReports();
  setCollection('aiReports', list.map(r => r.id === report.id ? report : r));
};

// Evaluation Periods
export const getEvaluationPeriods = async () => getCollection('evaluationPeriods');

// Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [departments, teams, positions, employees, competencies, evaluations, idpItems] = await Promise.all([
    getDepartments(), getTeams(), getPositions(), getEmployees(), getCompetencies(), getEvaluations(), getIDPItems()
  ]);

  const completedEvals = evaluations.filter(e => e.status === 'completed' || e.status === 'approved').length;
  const evalRate = employees.length > 0 ? (completedEvals / employees.length) * 100 : 0;

  return {
    totalDepartments: departments.length,
    totalTeams: teams.length,
    totalPositions: positions.length,
    totalEmployees: employees.length,
    totalCompetencies: competencies.length,
    evaluationCompletionRate: evalRate,
    topGapCompetencies: [
      { name: 'Kỹ năng làm việc nhóm', avgGap: -1.2 },
      { name: 'Trình độ ngoại ngữ', avgGap: -1.0 },
    ], // Mocked for now, can be calculated
    departmentGaps: [
      { department: 'Phát Triển Kinh Doanh & Sản Phẩm', avgGap: -0.5 },
      { department: 'Kỹ Thuật & Vận Hành', avgGap: -0.8 },
    ],
    employeesNeedingIDP: idpItems.filter(i => i.status === 'not_started' || i.status === 'in_progress').length,
  };
};

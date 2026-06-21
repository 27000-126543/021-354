export interface LaborTeam {
  id: string;
  name: string;
  leader: string;
  phone: string;
  workerCount: number;
  workType: string;
}

export interface Project {
  id: string;
  name: string;
  region: string;
  projectType: string;
  generalContractor: string;
  riskLevel: 'high' | 'medium' | 'low';
  accountBalance: number;
  monthlyAverageSalary: number;
  payrollMonthsAvailable: number;
  totalWorkers: number;
  laborTeams: LaborTeam[];
  abnormalIndicators: string[];
  lastPayrollDate: string;
  consecutiveUnpaidMonths: number;
  confirmationRate: number;
  bankReturnCount: number;
}

export interface PayrollRecord {
  id: string;
  projectId: string;
  month: string;
  totalAmount: number;
  totalWorkers: number;
  actualPayCount: number;
  bankReturnCount: number;
  unconfirmedCount: number;
  perCapitaSalary: number;
}

export interface AbnormalWorker {
  id: string;
  name: string;
  idCard: string;
  laborTeam: string;
  abnormalType: 'bank_return' | 'unconfirmed' | 'consecutive_unpaid';
  abnormalCount: number;
  amount: number;
  lastUpdate: string;
}

export interface Rectification {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  content: string;
  level: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'reviewed' | 'closed';
  assignee: string;
  assignDepartment: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  handler: string;
  handleDescription: string;
  handleDate: string;
  reviewer: string;
  reviewComment: string;
  reviewDate: string;
}

export type RiskLevel = 'high' | 'medium' | 'low';
export type RectificationStatus = 'pending' | 'in_progress' | 'reviewed' | 'closed';
export type AbnormalType = 'bank_return' | 'unconfirmed' | 'consecutive_unpaid';

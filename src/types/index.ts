
export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  totalDebt: number;
  monthlyPayment: number;
  programLength: number;
  totalSavings: number;
  savingsPercentage: number;
  imageUrl?: string;
}

export interface DebtRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  debtAmount: string;
  address?: string;
  dateOfBirth?: string;
  lastFourSSN?: string;
  familyMembers?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }[];
}

export interface ApplicationStatus {
  id: string;
  status: 'pending' | 'approved' | 'declined';
  applicationData: ApplicationFormData;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'declined';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  debt_amount: number;
  address?: string;
  date_of_birth?: string;
  ssn_last_four?: string;
  employment_status?: string;
  monthly_income?: number;
  credit_score?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit' | 'bank';
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export type AppRoute = 
  | 'home'
  | 'apply'
  | 'how-it-works'
  | 'about-us'
  | 'resources'
  | 'client-stories'
  | 'blog'
  | 'admin'
  | 'admin-applications'
  | 'admin-payments';

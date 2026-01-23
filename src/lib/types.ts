import type { Database } from '@/types/supabase';

// ============================================
// Row Types (for reading data)
// ============================================

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Debt = Database['public']['Tables']['debts']['Row'];
export type DebtPayment = Database['public']['Tables']['debt_payments']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type GoalContribution = Database['public']['Tables']['goal_contributions']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

// ============================================
// Insert Types (for creating data)
// ============================================

export type NewProfile = Database['public']['Tables']['profiles']['Insert'];
export type NewTransaction = Database['public']['Tables']['transactions']['Insert'];
export type NewDebt = Database['public']['Tables']['debts']['Insert'];
export type NewDebtPayment = Database['public']['Tables']['debt_payments']['Insert'];
export type NewGoal = Database['public']['Tables']['goals']['Insert'];
export type NewGoalContribution = Database['public']['Tables']['goal_contributions']['Insert'];
export type NewSubscription = Database['public']['Tables']['subscriptions']['Insert'];

// ============================================
// Update Types (for updating data)
// ============================================

export type UpdateProfile = Database['public']['Tables']['profiles']['Update'];
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update'];
export type UpdateDebt = Database['public']['Tables']['debts']['Update'];
export type UpdateDebtPayment = Database['public']['Tables']['debt_payments']['Update'];
export type UpdateGoal = Database['public']['Tables']['goals']['Update'];
export type UpdateGoalContribution = Database['public']['Tables']['goal_contributions']['Update'];
export type UpdateSubscription = Database['public']['Tables']['subscriptions']['Update'];

// ============================================
// Enum Types
// ============================================

export type TransactionType = Database['public']['Enums']['transaction_type'];
export type DebtStatus = Database['public']['Enums']['debt_status'];
export type GoalStatus = Database['public']['Enums']['goal_status'];
export type SubscriptionFrequency = Database['public']['Enums']['subscription_frequency'];
export type SubscriptionStatus = Database['public']['Enums']['subscription_status'];

// ============================================
// Utility Types
// ============================================

/** Transaction with category joined */
export type TransactionWithCategory = Transaction & {
  category: Category | null;
};

/** Debt with payments joined */
export type DebtWithPayments = Debt & {
  payments: DebtPayment[];
};

/** Goal with contributions joined */
export type GoalWithContributions = Goal & {
  contributions: GoalContribution[];
};

// ============================================
// Dashboard Summary Types
// ============================================

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  activeDebts: number;
  activeGoals: number;
  activeSubscriptions: number;
  monthlySubscriptionCost: number;
}

export interface CategorySummary {
  category: Category;
  total: number;
  percentage: number;
  count: number;
}

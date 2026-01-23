import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Target,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Mock data for demo
const mockSummary = {
  balance: 4250.0,
  totalIncome: 8500.0,
  totalExpenses: 4250.0,
  activeDebts: 2,
  activeGoals: 3,
  monthlySubscriptionCost: 89.99,
};

const mockRecentTransactions = [
  {
    id: '1',
    description: 'Supermercado',
    amount: -125.5,
    type: 'expense',
    category: { name: 'Alimentación', color: '#FF6B6B', icon: 'utensils' },
    date: new Date().toISOString(),
  },
  {
    id: '2',
    description: 'Salario mensual',
    amount: 4500.0,
    type: 'income',
    category: null,
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    description: 'Netflix',
    amount: -15.99,
    type: 'expense',
    category: { name: 'Entretenimiento', color: '#45B7D1', icon: 'film' },
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    description: 'Uber',
    amount: -28.0,
    type: 'expense',
    category: { name: 'Transporte', color: '#4ECDC4', icon: 'car' },
    date: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    description: 'Freelance proyecto',
    amount: 800.0,
    type: 'income',
    category: null,
    date: new Date(Date.now() - 345600000).toISOString(),
  },
];

const mockCategoryBreakdown = [
  { name: 'Alimentación', total: 850, color: '#FF6B6B', percentage: 40 },
  { name: 'Transporte', total: 425, color: '#4ECDC4', percentage: 20 },
  { name: 'Entretenimiento', total: 318.75, color: '#45B7D1', percentage: 15 },
  { name: 'Servicios', total: 255, color: '#F8B500', percentage: 12 },
  { name: 'Otros', total: 276.25, color: '#95A5A6', percentage: 13 },
];

function formatCurrency(amount: number, currency = '$') {
  return `${currency}${Math.abs(amount).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get user profile for greeting
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileName = 'Usuario';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('user_id', user.id)
      .single();
    if (profile?.name) {
      profileName = profile.name.split(' ')[0]; // First name only
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Hola, {profileName}! 👋</h1>
        <p className="text-muted-foreground">Aquí está el resumen de tus finanzas este mes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Balance */}
        <Card className="shadow-card transition-smooth hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance del Mes
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(mockSummary.balance)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">+12.5% vs mes anterior</p>
          </CardContent>
        </Card>

        {/* Income */}
        <Card className="shadow-card transition-smooth hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
            <div className="rounded-lg bg-green-500/10 p-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockSummary.totalIncome)}</div>
            <p className="mt-1 text-xs text-muted-foreground">2 transacciones este mes</p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="shadow-card transition-smooth hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gastos</CardTitle>
            <div className="rounded-lg bg-red-500/10 p-2">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockSummary.totalExpenses)}</div>
            <p className="mt-1 text-xs text-muted-foreground">15 transacciones este mes</p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-card transition-smooth hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Suscripciones
            </CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-2">
              <RefreshCw className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockSummary.monthlySubscriptionCost)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">5 suscripciones activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-muted-foreground" />
              Gastos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCategoryBreakdown.map(category => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(category.total)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                Transacciones Recientes
              </CardTitle>
              <Badge variant="secondary" className="font-normal">
                Ver todas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg p-2 transition-smooth hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: transaction.category
                          ? `${transaction.category.color}20`
                          : transaction.type === 'income'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(156, 163, 175, 0.1)',
                      }}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownRight
                          className="h-5 w-5"
                          style={{
                            color: transaction.category?.color || '#6b7280',
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category?.name || 'Ingreso'} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-foreground'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Debts Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Goals */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              Metas de Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Fondo de emergencia', current: 3500, target: 10000 },
              { name: 'Vacaciones', current: 1200, target: 3000 },
              { name: 'Laptop nueva', current: 800, target: 1500 },
            ].map(goal => (
              <div key={goal.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Debts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Deudas Activas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                creditor: 'Tarjeta de crédito',
                paid: 2500,
                total: 5000,
                dueDate: '2025-02-15',
              },
              {
                creditor: 'Préstamo personal',
                paid: 8000,
                total: 12000,
                dueDate: '2025-06-01',
              },
            ].map(debt => (
              <div
                key={debt.creditor}
                className="rounded-lg border p-3 transition-smooth hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{debt.creditor}</span>
                  <Badge variant="outline" className="text-xs">
                    Vence:{' '}
                    {new Date(debt.dueDate).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pagado</span>
                    <span>
                      {formatCurrency(debt.paid)} / {formatCurrency(debt.total)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${(debt.paid / debt.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

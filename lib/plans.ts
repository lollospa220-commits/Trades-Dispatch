import { AccountType, SubscriptionPlan } from '@prisma/client';

export const PLAN_LIMITS: Record<SubscriptionPlan, { technicians: number; label: string; price: number }> = {
  SOLO: { technicians: 1, label: 'Solo', price: 20 },
  TEAM: { technicians: 5, label: 'Team', price: 49 },
  PRO: { technicians: 999, label: 'Pro', price: 69 },
};

export function defaultPlanForAccount(accountType: AccountType): SubscriptionPlan {
  return accountType === 'SOLO' ? 'SOLO' : 'TEAM';
}

export function planFromRegisterParam(plan?: string): SubscriptionPlan | null {
  if (plan === 'solo') return 'SOLO';
  if (plan === 'team') return 'TEAM';
  if (plan === 'pro') return 'PRO';
  return null;
}

export function canAddTechnician(plan: SubscriptionPlan, activeCount: number): boolean {
  return activeCount < PLAN_LIMITS[plan].technicians;
}

export function technicianLimitLabel(plan: SubscriptionPlan): string {
  const n = PLAN_LIMITS[plan].technicians;
  return n >= 999 ? 'illimitati' : String(n);
}
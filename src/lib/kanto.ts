export type Plan = 'Free' | 'Pro' | 'Unlimited';
export const plans = {
  Free: { name: 'Kapitbahay Starter', price: 0, limit: 3 },
  Pro: { name: 'Diskarte Plus', price: 149, limit: 10 },
  Unlimited: { name: 'Bossing Unli', price: 299, limit: Infinity },
} satisfies Record<Plan, { name: string; price: number; limit: number }>;
export const money = (amount: number) => `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export function canApply(plan: Plan, used: number) { return used < plans[plan].limit; }
export type LedgerEntry = { label: string; amount: number; date: string };
export type Wallet = { available: number; escrow: number; ledger: LedgerEntry[] };
export function transact(wallet: Wallet, kind: 'topup' | 'withdraw' | 'hold' | 'release' | 'refund' | 'subscription', amount: number): Wallet {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid amount.');
  if (['withdraw', 'hold', 'subscription'].includes(kind) && wallet.available < amount) throw new Error('Not enough balance. Please cash in first.');
  if (['release', 'refund'].includes(kind) && wallet.escrow < amount) throw new Error('This payment is not held in escrow.');
  const labels = { topup: 'Cash-in', withdraw: 'Withdrawal', hold: 'Escrow hold', release: 'Job payout', refund: 'Escrow refund', subscription: 'Subscription fee' };
  const incoming = ['topup', 'release', 'refund'].includes(kind);
  return {
    available: wallet.available + (incoming ? amount : -amount),
    escrow: wallet.escrow + (kind === 'hold' ? amount : ['release', 'refund'].includes(kind) ? -amount : 0),
    ledger: [{ label: labels[kind], amount: incoming ? amount : -amount, date: 'Just now' }, ...wallet.ledger],
  };
}
export type Job = { id: number; title: string; category: string; budget: number; distance: number; duration: string; client: string; initials: string; rating: string; urgent: boolean; description: string; schedule: string; mine?: boolean; landmark?: string };
export const initialJobs: Job[] = [
  { id: 1, title: 'Pasabuy ng gamot sa Mercury Drug', category: 'Delivery', budget: 150, distance: 0.4, duration: '30 mins', client: 'Maria Santos', initials: 'MS', rating: '4.9', urgent: true, schedule: 'Today', description: 'Need someone to pick up my prescription at Mercury Drug near the barangay hall. Medicine cost will be reimbursed separately.' },
  { id: 2, title: 'Magpabuhat ng sofa sa 3rd floor', category: 'Moving', budget: 350, distance: 0.8, duration: '1 hour', client: 'Carlo Reyes', initials: 'CR', rating: '4.8', urgent: false, schedule: 'Today', description: 'Help us carry a two-seater sofa to the third floor. Another person will help. Please bring gloves if you have them.' },
  { id: 3, title: 'Aircon window-type cleaning', category: 'Cleaning', budget: 600, distance: 1.2, duration: '2 hours', client: 'Ana Dela Cruz', initials: 'AD', rating: '5.0', urgent: false, schedule: 'Weekend', description: 'One window-type aircon needs a thorough cleaning. Please bring your own cleaning tools.' },
  { id: 4, title: 'Dog walking around subdivision', category: 'Pet Care', budget: 200, distance: 0.6, duration: '1 hour', client: 'Luis Garcia', initials: 'LG', rating: '4.9', urgent: false, schedule: 'Today', description: 'Take our friendly golden retriever Mochi for an afternoon walk. Leash and treats provided.' },
  { id: 5, title: 'Fix a leaky kitchen faucet', category: 'Repair', budget: 450, distance: 1.8, duration: '1 hour', client: 'Liza Ramos', initials: 'LR', rating: '4.7', urgent: true, schedule: 'Today', description: 'Kitchen faucet is leaking. Looking for someone with basic plumbing tools. Parts paid separately.' },
  { id: 6, title: 'Pila at barangay hall for clearance', category: 'Errands', budget: 250, distance: 0.9, duration: '2 hours', client: 'Ben Mendoza', initials: 'BM', rating: '4.9', urgent: false, schedule: 'Weekend', description: 'Help collect the requirements for my barangay clearance. I will provide authorization and all documents.' },
];
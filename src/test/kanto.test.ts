import { describe, it, expect } from 'vitest';
import { canApply, plans, transact, type Wallet } from '../lib/kanto';
const wallet: Wallet = { available: 1250, escrow: 0, ledger: [] };
describe('Subscription rules', () => {
  it('Free costs zero and blocks after 3 applications', () => { expect(plans.Free.price).toBe(0); expect(canApply('Free', 2)).toBe(true); expect(canApply('Free', 3)).toBe(false); });
  it('Pro costs 149 and blocks after 10 applications', () => { expect(plans.Pro.price).toBe(149); expect(canApply('Pro', 9)).toBe(true); expect(canApply('Pro', 10)).toBe(false); });
  it('Unlimited costs 299 and does not cap applications', () => { expect(plans.Unlimited.price).toBe(299); expect(canApply('Unlimited', 10000)).toBe(true); });
});
describe('Demo escrow rules', () => {
  it('Locks 350 from the 1250 balance', () => { const held = transact(wallet, 'hold', 350); expect(held.available).toBe(900); expect(held.escrow).toBe(350); });
  it('Releases held funds to the demo helper balance', () => { const paid = transact(transact(wallet, 'hold', 350), 'release', 350); expect(paid.available).toBe(1250); expect(paid.escrow).toBe(0); });
  it('Rejects insufficient balance', () => { expect(() => transact(wallet, 'hold', 1300)).toThrow('Not enough balance'); });
  it('Refunds a cancelled escrow exactly once', () => { const refunded = transact(transact(wallet, 'hold', 350), 'refund', 350); expect(refunded.available).toBe(1250); expect(() => transact(refunded, 'refund', 350)).toThrow(); });
  it('Charges the exact subscription amount', () => { expect(transact(wallet, 'subscription', plans.Pro.price).available).toBe(1101); });
});
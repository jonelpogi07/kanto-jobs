import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

export type AccountState = { user: User | null; loading: boolean };
const AccountContext = createContext<AccountState>({ user: null, loading: true });
export function AccountProvider({ value, children }: { value: AccountState; children: ReactNode }) {
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
export const useAccount = () => useContext(AccountContext);
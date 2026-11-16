import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from '@/components/account-context';
export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [
    { title: 'Reset your password — KantoJobs' }, { name: 'description', content: 'Choose a new password for your KantoJobs account.' },
    { property: 'og:title', content: 'Reset your KantoJobs password' }, { property: 'og:description', content: 'Securely reset your account password.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: ResetPassword,
});
function ResetPassword() {
  const { user } = useAccount(); const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [done, setDone] = useState(false);
  useEffect(()=>{setRecovery(new URLSearchParams(window.location.hash.slice(1)).get('type')==='recovery' || sessionStorage.getItem('kanto-recovery')==='true');},[]);
  async function submit(e: FormEvent) {
    e.preventDefault(); if (password !== confirmation) { setError('Passwords do not match.'); return; }
    setBusy(true); setError('');
    const result = await supabase.auth.updateUser({ password });
    setBusy(false); if (result.error) { setError(result.error.message); return; }
    sessionStorage.removeItem('kanto-recovery'); setDone(true);
  }
  return <main className="max-w-md mx-auto px-6 py-10"><h1 className="page-title">Reset your password</h1>{done?<><p role="status" className="text-primary mb-5">Your password has been updated.</p><Button asChild><Link to="/">Back to jobs</Link></Button></>:recovery&&user?<form className="form-grid" onSubmit={submit}><label>New password<input required type="password" autoComplete="new-password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirm password<input required type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>{error&&<p role="alert" className="text-destructive text-sm">{error}</p>}<Button type="submit" disabled={busy}>{busy?'Saving…':'Save new password'}</Button></form>:<><p className="text-muted-foreground mb-5">Open a valid password reset link from your email to continue.</p><Button asChild><Link to="/auth">Back to login</Link></Button></>}</main>;
}
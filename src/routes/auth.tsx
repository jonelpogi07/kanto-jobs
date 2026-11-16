import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAccount } from '@/components/account-context';
import '@lovable.dev/cloud-auth-js/styles.css';

export const Route = createFileRoute('/auth')({
  head: () => ({ meta: [
    { title: 'Log in or register — KantoJobs' },
    { name: 'description', content: 'Access your KantoJobs account or register to join your barangay community.' },
    { property: 'og:title', content: 'Join your neighbors — KantoJobs' },
    { property: 'og:description', content: 'Log in or register for KantoJobs.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: AuthPage,
});

function AuthPage() {
  const { user } = useAccount(); const navigate = useNavigate();
  const [mode, setMode] = useState<'login'|'register'|'forgot'>('login');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [status, setStatus] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setStatus('');
    try {
      if (mode === 'forgot') {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (result.error) throw result.error;
        setStatus('Check your email for a password reset link.');
      } else if (mode === 'register') {
        const result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (result.error) throw result.error;
        if (result.data.session) await navigate({ to: '/' });
        else setStatus('Check your email to confirm your account before logging in.');
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        await navigate({ to: '/' });
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.'); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google'|'lovable') {
    setBusy(true); setError('');
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: '/' });
    } catch (err) { setError(err instanceof Error ? err.message : 'Sign-in failed.'); }
    finally { setBusy(false); }
  }
  return <main className="max-w-md mx-auto px-6 py-10">
    <Link to="/" className="brand mb-10"><span className="brand-symbol"><HeartHandshake/></span>KantoJobs<span className="text-amber">.</span></Link>
    {user ? <><h1 className="page-title">You’re logged in</h1><p className="mb-6 text-muted-foreground">{user.email}</p><Button asChild><Link to="/">Go to jobs <ArrowRight/></Link></Button></> : <>
      <h1 className="page-title">{mode === 'register' ? 'Join your barangay' : mode === 'forgot' ? 'Reset your password' : 'Welcome back'}</h1>
      {mode !== 'forgot' && <div className="role-switch mb-6"><Button variant="ghost" className={`flex-1 ${mode==='login'?'selected':''}`} onClick={()=>{setMode('login');setError('');setStatus('');}}>Log in</Button><Button variant="ghost" className={`flex-1 ${mode==='register'?'selected':''}`} onClick={()=>{setMode('register');setError('');setStatus('');}}>Register</Button></div>}
      <form onSubmit={submit} className="form-grid">
        <label>Email<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
        {mode !== 'forgot' && <label>Password<input type="password" autoComplete={mode==='register'?'new-password':'current-password'} required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/></label>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{status && <p role="status" className="text-sm text-primary">{status}</p>}
        <Button type="submit" disabled={busy}>{busy?'Please wait…':mode==='register'?'Register':mode==='forgot'?'Send reset link':'Log in'}<ArrowRight/></Button>
      </form>
      <Button variant="link" className="mt-3 px-0" onClick={()=>{setMode(mode==='forgot'?'login':'forgot');setError('');setStatus('');}}>{mode==='forgot'?'Back to login':'Forgot password?'}</Button>
      {mode !== 'forgot' && <div className="grid gap-3 mt-5"><Button variant="outline" className="google-auth-button h-11" disabled={busy} onClick={()=>social('google')}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</Button><Button className="lovable-auth-button w-full h-11" disabled={busy} onClick={()=>social('lovable')}>Continue with Lovable</Button></div>}
    </>}
  </main>;
}
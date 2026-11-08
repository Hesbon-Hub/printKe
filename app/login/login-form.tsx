"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type SignInMethod = "phone" | "email";
type FormMode = "login" | "otp" | "reset" | "register" | "new-password";
type OtpPurpose = "signin" | "signup" | "reset";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("254")) return `+${digits}`;
  return `+254${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

export default function LoginForm() {
  const router = useRouter();
  const [method, setMethod] = useState<SignInMethod>("phone");
  const [mode, setMode] = useState<FormMode>("login");
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    if (hash.get("type") !== "recovery" || !accessToken || !refreshToken) return;

    const supabase = getSupabaseClient(rememberMe);
    if (!supabase) {
      setFeedback("Password recovery is not configured. Add the Supabase environment variables and try again.");
      return;
    }

    void supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
      if (error) setFeedback(error.message);
      else setMode("new-password");
      window.history.replaceState(null, "", window.location.pathname);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const supabase = getSupabaseClient(rememberMe);
    if (!supabase) {
      setFeedback("Sign-in is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the app.");
      setIsSubmitting(false);
      return;
    }

    const identity = String(formData.get(method) ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const phone = normalizePhone(identity);
    const identityValue = method === "email" ? { email: identity } : { phone };

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ ...identityValue, password });
        if (error) throw error;
        router.replace("/");
        router.refresh();
        return;
      }

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          ...identityValue,
          password,
          options: { data: { full_name: String(formData.get("name") ?? "").trim() } },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/");
          router.refresh();
          return;
        }
        setOtpPurpose("signup");
        setMode("otp");
        setFeedback(`Check your ${method === "email" ? "email" : "phone"} for the confirmation code.`);
        return;
      }

      if (mode === "otp") {
        const type = method === "email" ? otpPurpose === "signup" ? "signup" : "email" : "sms";
        const { error } = await supabase.auth.verifyOtp({ ...identityValue, token: String(formData.get("otp") ?? "").trim(), type });
        if (error) throw error;

        if (otpPurpose === "reset") {
          const { error: updateError } = await supabase.auth.updateUser({ password: String(formData.get("newPassword") ?? "") });
          if (updateError) throw updateError;
          setMode("login");
          setFeedback("Password updated. Sign in with your new password.");
          return;
        }

        router.replace("/");
        router.refresh();
        return;
      }

      if (mode === "reset") {
        if (method === "email") {
          const { error } = await supabase.auth.resetPasswordForEmail(identity, { redirectTo: `${window.location.origin}/login` });
          if (error) throw error;
          setFeedback("If an account exists for that email, password reset instructions have been sent.");
        } else {
          const { error } = await supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser: false } });
          if (error) throw error;
          setOtpPurpose("reset");
          setMode("otp");
          setFeedback("Enter the verification code sent to your phone, then choose a new password.");
        }
        return;
      }

      if (mode === "new-password") {
        const { error } = await supabase.auth.updateUser({ password: String(formData.get("newPassword") ?? "") });
        if (error) throw error;
        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to complete sign-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function beginOtpSignIn() {
    const identity = (document.getElementById("login-identity") as HTMLInputElement | null)?.value.trim() ?? "";
    if (!identity) {
      setFeedback(`Enter your ${method === "email" ? "email address" : "phone number"} first.`);
      return;
    }

    const supabase = getSupabaseClient(rememberMe);
    if (!supabase) {
      setFeedback("Sign-in is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the app.");
      return;
    }

    setFeedback("");
    setIsSubmitting(true);
    const destination = method === "email" ? { email: identity } : { phone: normalizePhone(identity) };
    try {
      const { error } = await supabase.auth.signInWithOtp({ ...destination, options: { shouldCreateUser: false } });
      if (error) throw error;
      setOtpPurpose("signin");
      setMode("otp");
      setFeedback(`A verification code has been sent to your ${method === "email" ? "email" : "phone"}.`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to send a verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRegister = mode === "register";
  const needsNewPassword = mode === "new-password" || mode === "otp" && otpPurpose === "reset";
  const title = mode === "reset" ? "Reset your password" : needsNewPassword ? "Choose a new password" : isRegister ? "Create your account" : "Welcome back";
  const description = mode === "reset" ? "Enter the email or phone number linked to your account." : needsNewPassword ? "Choose a new password to secure your account." : isRegister ? "Join Odeon Print Hub to manage your print orders." : "Sign in to your Odeon Print Hub account.";

  return <main className="login-page">
    <section className="login-visual" aria-label="Odeon Print Hub studio">
      <div className="login-visual-art" aria-hidden="true">
        <div className="studio-window"><i/><i/><i/></div>
        <div className="studio-sheet studio-sheet-back"><span>ODEON PRINT</span><strong>YOUR<br/>IDEA<br/>HERE.</strong></div>
        <div className="studio-sheet studio-sheet-front"><span>PRINT / BRAND / GROW</span><strong>Make it<br/><em>memorable.</em></strong><i/></div>
        <div className="studio-ink ink-cyan"/><div className="studio-ink ink-pink"/><div className="studio-ink ink-yellow"/>
        <div className="studio-caption"><span>ODEON PRINT HUB / NAIROBI</span><strong>Good work<br/>starts with a<br/>good impression.</strong></div>
      </div>
      <Link className="login-visual-logo" href="/"><Image src="/odeon-print-hub.svg" alt="Odeon Print Hub Shop" width={168} height={78}/></Link>
      <div className="login-visual-footer"><span>PRINTED WITH PURPOSE</span><span>01 — 04</span></div>
    </section>

    <section className="login-panel">
      <div className="login-panel-inner">
        <Link className="login-mobile-logo" href="/"><Image src="/odeon-print-hub.svg" alt="Odeon Print Hub Shop" width={144} height={67}/></Link>
        <div className="login-heading"><span className="login-mark">O</span><p className="login-eyebrow">ODEON PRINT HUB SHOP</p><h1>{title}</h1><p>{description}</p></div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && <label className="login-field"><span>Full name</span><input name="name" type="text" autoComplete="name" placeholder="Your name" required/></label>}
          {mode !== "new-password" && <><div className="login-field-heading"><label htmlFor="login-identity">{method === "phone" ? "Phone number" : "Email address"}</label>{mode !== "otp" && <button className="method-switch" type="button" onClick={() => {setMethod(method === "phone" ? "email" : "phone");setFeedback("")}}>Use {method === "phone" ? "email" : "phone"} instead</button>}</div><div className={`identity-field${method === "phone" ? " phone-identity" : ""}`}>{method === "phone" && <label className="country-code" htmlFor="login-identity"><span aria-hidden="true">🇰🇪</span><span>+254</span><span aria-hidden="true">⌄</span></label>}<input id="login-identity" name={method} type={method === "phone" ? "tel" : "email"} autoComplete={method === "phone" ? "tel-national" : "email"} placeholder={method === "phone" ? "712 123456" : "you@example.com"} required readOnly={mode === "otp"}/></div></>}

          {(mode === "login" || isRegister) && <label className="login-field"><span>{isRegister ? "Create password" : "Password"}</span><span className="password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Enter your password" minLength={8} required/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg></button></span></label>}
          {mode === "otp" && <label className="login-field"><span>One-time code</span><input name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="Enter the code sent to you" required/></label>}
          {needsNewPassword && <label className="login-field"><span>New password</span><input name="newPassword" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required/></label>}

          {!isRegister && mode === "login" && <div className="login-options"><label className="remember-option"><input type="checkbox" name="remember" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}/><span>Remember me</span></label><div><button type="button" disabled={isSubmitting} onClick={() => void beginOtpSignIn()}>Login with OTP</button><button type="button" onClick={() => {setMode("reset");setFeedback("")}}>Forgot password?</button></div></div>}

          {mode === "otp" && otpPurpose === "signin" && <button className="login-text-action" type="button" onClick={() => {setMode("login");setFeedback("")}}>Use password instead</button>}
          {(mode === "reset" || mode === "new-password") && <button className="login-text-action" type="button" onClick={() => {setMode("login");setFeedback("")}}>Back to sign in</button>}

          <button className="login-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait…" : mode === "otp" ? otpPurpose === "reset" ? "Verify and reset password" : "Verify code" : mode === "reset" ? "Send reset instructions" : mode === "new-password" ? "Update password" : isRegister ? "Create account" : "Sign in"}<span aria-hidden="true">→</span></button>
          {feedback && <p className={`login-feedback${feedback.includes("not configured") || feedback.includes("Invalid") || feedback.includes("expired") ? " login-feedback-error" : ""}`} role="status">{feedback}</p>}
        </form>

        {mode !== "otp" && mode !== "reset" && mode !== "new-password" && <div className="login-register">{isRegister ? <><span>Already have an account?</span><button type="button" onClick={() => {setMode("login");setFeedback("")}}>Sign in</button></> : <><span>New to Odeon Print Hub?</span><button type="button" onClick={() => {setMode("register");setFeedback("")}}>Create an account</button></>}</div>}
        <Link className="back-to-shop" href="/"><span aria-hidden="true">←</span> Back to shop</Link>
        <p className="login-legal">By continuing, you agree to our <a href="/#about">Terms</a> and <a href="/#about">Privacy Policy</a>.</p>
      </div>
    </section>
  </main>;
}
import { useState } from "react";
import { PawPrint, Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useTranslation } from "../../i18n/useTranslation";
import { LanguageSelector } from "../ui/LanguageSelector";

function Field({ icon: Icon, type, value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <span className="flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-300">
        <Icon className="h-4 w-4 shrink-0 text-ink-400" />
        <input
          required
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none"
        />
      </span>
    </label>
  );
}

/** Pantalla de inicio de sesión / registro (bilingüe, tokens de marca). */
export function LoginScreen() {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const isSignUp = mode === "signup";

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const { data, error } = await (isSignUp ? signUp(email, password) : signIn(email, password));
    setBusy(false);
    if (error) return setError(error.message);
    if (isSignUp && !data.session) setInfo(t("auth.checkEmail"));
    // Con sesión activa, onAuthStateChange actualiza el contexto y App muestra el dashboard.
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="absolute right-4 top-4">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/30">
            <PawPrint className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-800">
            Chow<span className="text-cta-500">Pulse</span>
          </h1>
          <p className="mt-1 text-sm text-ink-400">{t("auth.subtitle")}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="text-lg font-extrabold text-ink-800">{isSignUp ? t("auth.signUp") : t("auth.signIn")}</h2>

          <Field icon={Mail} type="email" value={email} onChange={setEmail} placeholder={t("auth.email")} autoComplete="email" />
          <Field
            icon={Lock}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={t("auth.password")}
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-100">
              {error}
            </p>
          )}
          {info && (
            <p className="flex items-start gap-2 rounded-xl bg-health-50 px-3 py-2 text-sm font-medium text-health-700 ring-1 ring-inset ring-health-200">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-500 px-4 py-3 font-bold text-white shadow-lg shadow-cta-500/30 transition hover:bg-cta-600 focus-visible:ring-2 focus-visible:ring-cta-400 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isSignUp ? t("auth.signUp") : t("auth.signIn")} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-ink-400">
            {isSignUp ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignUp ? "signin" : "signup");
                setError("");
                setInfo("");
              }}
              className="font-bold text-brand-600 hover:text-brand-700"
            >
              {isSignUp ? t("auth.toSignIn") : t("auth.toSignUp")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

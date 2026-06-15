import { useState, useEffect } from "react";
import { LayoutDashboard, PawPrint, Bone, HeartPulse, GraduationCap, Heart, LogOut, Loader2 } from "lucide-react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { DietWidget } from "./components/diet/DietWidget";
import { PublicProfileCard } from "./components/public/PublicProfileCard";
import { FloatingHelp } from "./components/ui/FloatingHelp";
import { LoginScreen } from "./components/auth/LoginScreen";
import { households as mockHouseholds, pets as mockPets } from "./data/mockData";
import { genSlug } from "./lib/format";
import { cn } from "./lib/cn";
import { useTranslation } from "./i18n/useTranslation";
import { useAuth } from "./auth/AuthContext";
import { fetchHouseholds, fetchPets, fetchPetDetail, setPetPublic } from "./lib/queries";

const NAV = [
  { id: "home", icon: LayoutDashboard },
  { id: "pets", icon: PawPrint },
  { id: "diet", icon: Bone },
  { id: "health", icon: HeartPulse },
  { id: "training", icon: GraduationCap },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-500 text-white shadow-lg shadow-cta-500/30">
        <PawPrint className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-white">
        Chow<span className="text-cta-400">Pulse</span>
      </span>
    </div>
  );
}

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white">
          <PawPrint className="h-6 w-6" strokeWidth={2.4} />
        </span>
        <Loader2 className="h-5 w-5 animate-spin text-ink-300" />
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();
  const { loading: authLoading, session, configured, signOut, user } = useAuth();

  const [households, setHouseholds] = useState(mockHouseholds);
  const [householdId, setHouseholdId] = useState(mockHouseholds[0].id);
  const [pets, setPets] = useState(() => mockPets.filter((p) => p.household_id === mockHouseholds[0].id));
  const [loading, setLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(() => mockPets[0]?.id ?? null);
  const [detail, setDetail] = useState(null); // { diet, skills } del seleccionado (modo real)
  const [active, setActive] = useState("home");

  // Hogares reales del usuario.
  useEffect(() => {
    if (!configured || !session) return;
    let on = true;
    fetchHouseholds().then((list) => {
      if (on && list.length) {
        setHouseholds(list);
        setHouseholdId(list[0].id);
      }
    });
    return () => {
      on = false;
    };
  }, [configured, session]);

  // Mascotas del hogar seleccionado (reactivo). Real con Supabase, si no mock.
  useEffect(() => {
    if (!configured) {
      const mp = mockPets.filter((p) => p.household_id === householdId);
      setPets(mp);
      setSelectedPetId(mp[0]?.id ?? null);
      return;
    }
    if (!session) return; // aún sin sesión: la app muestra el login
    let on = true;
    setLoading(true);
    fetchPets(householdId).then((list) => {
      if (!on) return;
      setPets(list);
      setSelectedPetId(list[0]?.id ?? null);
      setLoading(false);
    });
    return () => {
      on = false;
    };
  }, [householdId, configured, session]);

  // Detalle (dieta + trucos) del seleccionado — solo en modo real.
  useEffect(() => {
    if (!configured || !session || !selectedPetId) {
      setDetail(null);
      return;
    }
    let on = true;
    fetchPetDetail(selectedPetId).then((d) => on && setDetail(d));
    return () => {
      on = false;
    };
  }, [selectedPetId, configured, session]);

  const basePet = pets.find((p) => p.id === selectedPetId) || pets[0] || null;
  // En mock, la mascota ya trae diet/skills; en real, los fusionamos desde `detail`.
  const selectedPet = basePet
    ? configured
      ? { ...basePet, diet: detail?.diet ?? null, skills: detail?.skills ?? [] }
      : basePet
    : null;

  async function togglePublic(petId, value) {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? { ...p, is_public: value, public_slug: !configured && value ? p.public_slug || genSlug() : p.public_slug }
          : p
      )
    );
    if (configured) {
      const slug = await setPetPublic(petId, value);
      if (slug) setPets((prev) => prev.map((p) => (p.id === petId ? { ...p, public_slug: slug } : p)));
    }
  }

  if (authLoading) return <Splash />;
  if (configured && !session) return <LoginScreen />;

  const signedIn = configured && session;

  return (
    <div className="min-h-screen bg-cream text-ink-700">
      {/* ===== Barra lateral (desktop) ===== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-800 p-5 lg:flex">
        <Brand />
        <nav className="mt-8 flex-1 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active === item.id ? "bg-white/15 text-white" : "text-brand-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={2.2} />
              {t(`nav.${item.id}`)}
            </button>
          ))}
        </nav>

        {signedIn ? (
          <div className="rounded-2xl bg-brand-900/60 p-4">
            <p className="truncate text-xs text-brand-200">{user?.email}</p>
            <button
              onClick={signOut}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" /> {t("auth.signOut")}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-brand-900/60 p-4 text-sm text-brand-100">
            <Heart className="h-5 w-5 text-cta-400" />
            <p className="mt-2 font-semibold text-white">{t("sidebar.motto")}</p>
            <p className="mt-1 text-xs text-brand-200">{configured ? t("sidebar.sub") : t("auth.demoBadge")}</p>
          </div>
        )}
      </aside>

      {/* ===== Barra superior (móvil) ===== */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-brand-800 px-4 py-3 lg:hidden">
        <Brand />
        {signedIn ? (
          <button
            onClick={signOut}
            aria-label={t("auth.signOut")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 font-bold text-white">
            {(user?.email?.[0] || "L").toUpperCase()}
          </span>
        )}
      </header>

      {/* ===== Contenido ===== */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
          <Dashboard
            households={households}
            householdId={householdId}
            onHouseholdChange={setHouseholdId}
            pets={pets}
            loading={loading}
            selectedPetId={selectedPet?.id}
            onSelectPet={setSelectedPetId}
          />

          {selectedPet && (
            <section className="mt-10 lg:mt-14">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 rounded-full bg-cta-500" />
                <h2 className="text-xl font-extrabold tracking-tight text-ink-800">
                  {t("dashboard.careOf", { name: selectedPet.name })}
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <DietWidget pet={selectedPet} />
                <PublicProfileCard pet={selectedPet} onToggle={togglePublic} />
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ===== Navegación inferior (móvil) ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-ink-100 bg-white px-2 py-1.5 lg:hidden">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[0.65rem] font-semibold transition",
              active === item.id ? "text-brand-600" : "text-ink-400"
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={2.2} />
            {t(`nav.${item.id}`)}
          </button>
        ))}
      </nav>

      <FloatingHelp />
    </div>
  );
}

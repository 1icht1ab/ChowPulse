import { useState } from "react";
import { LayoutDashboard, PawPrint, Bone, HeartPulse, GraduationCap, Heart } from "lucide-react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { DietWidget } from "./components/diet/DietWidget";
import { PublicProfileCard } from "./components/public/PublicProfileCard";
import { FloatingHelp } from "./components/ui/FloatingHelp";
import { households, pets as seedPets } from "./data/mockData";
import { genSlug } from "./lib/format";
import { cn } from "./lib/cn";
import { useTranslation } from "./i18n/useTranslation";

// Navegación principal (i18n por id).
// Cada ítem usa su id como clave de traducción: t("nav.home"), t("nav.pets")...
const NAV = [
  { id: "home", icon: LayoutDashboard },
  { id: "pets", icon: PawPrint },
  { id: "diet", icon: Bone },
  { id: "health", icon: HeartPulse },
  { id: "training", icon: GraduationCap },
];

/** Logotipo en texto: "ChowPulse" (independiente del idioma). */
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

export default function App() {
  const { t } = useTranslation();
  const [allPets, setAllPets] = useState(seedPets);
  const [householdId, setHouseholdId] = useState(households[0].id);
  const [selectedPetId, setSelectedPetId] = useState(seedPets[0].id);
  const [active, setActive] = useState("home");

  const householdPets = allPets.filter((p) => p.household_id === householdId);
  const selectedPet = householdPets.find((p) => p.id === selectedPetId) || householdPets[0];

  function selectHousehold(id) {
    setHouseholdId(id);
    const first = allPets.find((p) => p.household_id === id);
    if (first) setSelectedPetId(first.id);
  }

  function togglePublic(petId, value) {
    setAllPets((prev) =>
      prev.map((p) =>
        p.id === petId ? { ...p, is_public: value, public_slug: p.public_slug || genSlug() } : p
      )
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink-700">
      {/* ===== Barra lateral (desktop) — branding púrpura ===== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-800 p-5 lg:flex">
        <Brand />
        <nav className="mt-8 flex-1 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active === item.id
                  ? "bg-white/15 text-white"
                  : "text-brand-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={2.2} />
              {t(`nav.${item.id}`)}
            </button>
          ))}
        </nav>
        <div className="rounded-2xl bg-brand-900/60 p-4 text-sm text-brand-100">
          <Heart className="h-5 w-5 text-cta-400" />
          <p className="mt-2 font-semibold text-white">{t("sidebar.motto")}</p>
          <p className="mt-1 text-xs text-brand-200">{t("sidebar.sub")}</p>
        </div>
      </aside>

      {/* ===== Barra superior (móvil) ===== */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-brand-800 px-4 py-3 lg:hidden">
        <Brand />
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 font-bold text-white">
          L
        </span>
      </header>

      {/* ===== Contenido ===== */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
          <Dashboard
            households={households}
            householdId={householdId}
            onHouseholdChange={selectHousehold}
            pets={householdPets}
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

      {/* ===== Ayuda flotante global ===== */}
      <FloatingHelp />
    </div>
  );
}

import { supabase } from "./supabaseClient";

// Hogares del usuario (vía tabla puente; la RLS limita a los suyos).
export async function fetchHouseholds() {
  const { data, error } = await supabase.from("household_members").select("role, households(id, name)");
  if (error || !data) return [];
  return data
    .filter((m) => m.households)
    .map((m) => ({ id: m.households.id, name: m.households.name, role: m.role, members: null }));
}

// Mascotas de un hogar.
export async function fetchPets(householdId) {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("ChowPulse pets:", error.message);
    return [];
  }
  return data ?? [];
}

// Detalle del panel: dieta activa + trucos públicos dominados.
export async function fetchPetDetail(petId) {
  const [dietRes, goalsRes] = await Promise.all([
    supabase.from("diets").select("*").eq("pet_id", petId).eq("is_active", true).maybeSingle(),
    supabase
      .from("training_goals")
      .select("skill")
      .eq("pet_id", petId)
      .eq("is_public", true)
      .eq("status", "mastered"),
  ]);
  return { diet: dietRes.data ?? null, skills: (goalsRes.data ?? []).map((g) => g.skill) };
}

// Persiste la visibilidad pública y devuelve el slug generado por el trigger.
export async function setPetPublic(petId, value) {
  const { error } = await supabase.from("pets").update({ is_public: value }).eq("id", petId);
  if (error) {
    console.error("ChowPulse toggle público:", error.message);
    return null;
  }
  if (!value) return null;
  const { data } = await supabase.from("pets").select("public_slug").eq("id", petId).maybeSingle();
  return data?.public_slug ?? null;
}

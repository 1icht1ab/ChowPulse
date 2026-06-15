// =====================================================================
// Diccionarios de traducción · ChowPulse
// Objetos estructurados por idioma. Las claves se resuelven con notación
// de punto desde useTranslation: t("diet.composition"), t("alerts.vaccine", { days: 5 }).
// Los textos con {variables} se interpolan en tiempo de render.
// =====================================================================

export const translations = {
  es: {
    app: { name: "ChowPulse", tagline: "Cuidado de mascotas" },
    nav: { home: "Inicio", pets: "Mascotas", diet: "Dietas", health: "Salud", training: "Entreno" },
    sidebar: { motto: "Cuidar es quererlos bien", sub: "Todo su cuidado, en un solo lugar." },
    lang: { label: "Idioma", switchTo: "Cambiar a {lang}", es: "Español", en: "Inglés" },

    caregiverMode: { label: "Modo Cuidador", hint: "Estás en el perfil familiar compartido. Lo que registres lo ven los dueños y demás miembros en tiempo real." },

    auth: {
      welcome: "Bienvenido a ChowPulse",
      subtitle: "El cuidado de tus peludos, en un solo lugar.",
      email: "Correo electrónico",
      password: "Contraseña",
      signIn: "Iniciar sesión",
      signUp: "Crear cuenta",
      signOut: "Cerrar sesión",
      noAccount: "¿No tienes cuenta?",
      haveAccount: "¿Ya tienes cuenta?",
      toSignUp: "Regístrate",
      toSignIn: "Inicia sesión",
      checkEmail: "Te enviamos un correo para confirmar tu cuenta.",
      demoBadge: "Modo demo (sin Supabase)",
    },

    dashboard: {
      greeting: "Hola de nuevo",
      title: "Tus peludos hoy",
      petsInHousehold: "Mascotas del hogar",
      addPet: "Añadir mascota",
      addPetSub: "Registra a un nuevo miembro de la familia",
      careOf: "Cuidado de {name}",
      noPets: "Este hogar aún no tiene mascotas registradas.",
    },

    species: { dog: "Perro", cat: "Gato", turtle: "Tortuga", reptile: "Reptil", bird: "Ave", rabbit: "Conejo", fish: "Pez", other: "Mascota" },

    pet: { publicProfile: "Perfil público activo", privateProfile: "Perfil privado", public: "Público", allGood: "Todo al día" },

    alerts: { vaccine: "Vacuna en {days} días", checkup: "Revisión anual", deworming: "Desparasitación pendiente" },

    age: { unknown: "Edad desconocida", year: "año", years: "años", month: "mes", months: "meses", and: "y" },

    household: {
      activeLabel: "Hogar activo",
      members: "{count} miembros",
      roles: { owner: "Propietario", caregiver: "Cuidador", viewer: "Observador" },
      roleDesc: {
        owner: "Control total: edita todo y decide quién entra al hogar.",
        caregiver: "Puede editar mascotas, dietas y salud, pero no gestionar miembros.",
        viewer: "Solo puede mirar la información, sin hacer cambios.",
      },
      help: {
        title: "¿Qué es un Hogar y los roles?",
        intro: "Un Hogar es tu grupo familiar. Todos sus miembros ven y cuidan a las mismas mascotas, cada quien según su rol:",
      },
    },

    diet: {
      types: { barf: "BARF", kibble: "Pienso", wet: "Húmeda", homemade: "Casera", mixed: "Mixta" },
      title: "Plan nutricional",
      none: "Sin dieta activa registrada.",
      activeOf: "Dieta activa de {name}",
      totalDaily: "Total diario",
      mealsPerDay: "Comidas/día",
      perMeal: "Por comida",
      composition: "Composición de la ración",
      over: "sobre {grams} g/día",
      ariaComposition: "Composición de la ración: {list}",
      segments: { muscle: "Músculo", bone: "Hueso", organs: "Vísceras", veg: "Vegetales", kibble: "Pienso" },
      help: {
        titleBreakdown: "Cómo leer y servir esta dieta",
        titleSimple: "Cómo servir esta ración",
        barfMeaning: "BARF significa “alimentación cruda biológicamente apropiada”. La barra muestra en qué proporción combinar cada parte:",
        muscle: "Músculo: la base, da proteína y energía.",
        bone: "Hueso: aporta el calcio. ¡Siempre carnoso, nunca cocido!",
        organs: "Vísceras: vitaminas (mitad hígado).",
        vegKibble: "Vegetales/Pienso: fibra o complemento.",
        howToServe: "Cómo servir:",
        howToServeText: " pesa el total del día con una balanza de cocina y repártelo en {meals} comida(s). No hace falta que cada plato sea exacto: lo importante es el equilibrio a lo largo de la semana.",
        simple: "Mide {grams} g de pienso por comida con un vaso medidor o balanza. Mantén siempre agua fresca disponible y ajusta la cantidad si notas cambios de peso.",
      },
      tipForPet: "Para {name}:",
      tipSplit: " reparte la ración en {meals} tomas (por ejemplo, mañana y noche). ",
      tipBarf: "No mezcles BARF con pienso seco (kibble) en la misma toma: tienen tiempos de digestión distintos.",
      tipMixed: "Como combina crudo y pienso, sepáralos en tomas distintas siempre que puedas para una mejor digestión.",
      simpleNote: "Dieta de pienso seco: sirve {grams} g por comida. Pulsa el botón (?) de arriba para ver cómo medir la porción correctamente.",
      closing: "Estas cantidades son una guía según el peso de {name}. Ante dudas de salud, consulta siempre a tu veterinario/a.",
    },

    publicProfile: {
      title: "Perfil público",
      visiblePublic: "Visible para cualquiera con el enlace",
      visiblePrivate: "Solo tú y tu hogar lo ven",
      public: "Público",
      private: "Privado",
      toggleLabel: "Activar perfil público",
      privacyStrip: "El historial médico y las dietas nunca se comparten en este enlace.",
      preview: "Vista previa",
      shareLink: "Enlace para compartir",
      copy: "Copiar enlace",
      copied: "¡Copiado!",
      copiedSr: "Enlace copiado al portapapeles",
      activateToShare: "Activa el perfil público (arriba) para generar y copiar el enlace.",
      inPrivate: "Perfil en privado",
      help: {
        title: "¿Qué se comparte en público?",
        intro: "Cuando activas esta opción, cualquiera con el enlace puede ver una tarjeta sencilla de {name}:",
        item1: "Nombre, especie, raza, edad y fotos.",
        item2: "Trucos aprendidos (si los marcas como públicos).",
        privacyNote: "El historial médico, las dietas y tus datos personales NUNCA se muestran. Tú tienes el control y puedes desactivarlo cuando quieras.",
      },
    },

    floatingHelp: {
      eyebrow: "Estamos contigo",
      title: "¿Cómo te ayudamos?",
      open: "Abrir centro de ayuda",
      close: "Cerrar ayuda",
      item1: "Toca los botones morados (?) en cada sección para una explicación sencilla.",
      item2: "En la dieta verás cuánta comida servir y por qué. Sin cálculos complicados.",
      item3: "Tus datos médicos siempre son privados. Tú decides qué compartir.",
    },

    a11y: { help: "Más ayuda", closeHelp: "Cerrar ayuda", addPet: "Añadir mascota" },
  },

  en: {
    app: { name: "ChowPulse", tagline: "Pet care" },
    nav: { home: "Home", pets: "Pets", diet: "Diets", health: "Health", training: "Training" },
    sidebar: { motto: "Caring is loving them well", sub: "All their care, in one place." },
    lang: { label: "Language", switchTo: "Switch to {lang}", es: "Spanish", en: "English" },

    caregiverMode: { label: "Caregiver Mode", hint: "You're in the shared family profile. Everything you log is visible in real time to the owners and other members." },

    auth: {
      welcome: "Welcome to ChowPulse",
      subtitle: "All your pets' care, in one place.",
      email: "Email",
      password: "Password",
      signIn: "Sign in",
      signUp: "Create account",
      signOut: "Sign out",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      toSignUp: "Sign up",
      toSignIn: "Sign in",
      checkEmail: "We sent you an email to confirm your account.",
      demoBadge: "Demo mode (no Supabase)",
    },

    dashboard: {
      greeting: "Welcome back",
      title: "Your pets today",
      petsInHousehold: "Household pets",
      addPet: "Add pet",
      addPetSub: "Register a new family member",
      careOf: "Caring for {name}",
      noPets: "This household has no pets registered yet.",
    },

    species: { dog: "Dog", cat: "Cat", turtle: "Turtle", reptile: "Reptile", bird: "Bird", rabbit: "Rabbit", fish: "Fish", other: "Pet" },

    pet: { publicProfile: "Public profile active", privateProfile: "Private profile", public: "Public", allGood: "All up to date" },

    alerts: { vaccine: "Vaccine in {days} days", checkup: "Annual checkup", deworming: "Deworming due" },

    age: { unknown: "Unknown age", year: "year", years: "years", month: "month", months: "months", and: "and" },

    household: {
      activeLabel: "Active household",
      members: "{count} members",
      roles: { owner: "Owner", caregiver: "Caregiver", viewer: "Viewer" },
      roleDesc: {
        owner: "Full control: edits everything and decides who joins the household.",
        caregiver: "Can edit pets, diets and health, but not manage members.",
        viewer: "Can only view information, without making changes.",
      },
      help: {
        title: "What is a Household and the roles?",
        intro: "A Household is your family group. All members see and care for the same pets, each according to their role:",
      },
    },

    diet: {
      types: { barf: "BARF", kibble: "Kibble", wet: "Wet", homemade: "Homemade", mixed: "Mixed" },
      title: "Nutrition plan",
      none: "No active diet registered.",
      activeOf: "{name}'s active diet",
      totalDaily: "Daily total",
      mealsPerDay: "Meals/day",
      perMeal: "Per meal",
      composition: "Ration breakdown",
      over: "of {grams} g/day",
      ariaComposition: "Ration breakdown: {list}",
      segments: { muscle: "Muscle", bone: "Bone", organs: "Organs", veg: "Veggies", kibble: "Kibble" },
      help: {
        titleBreakdown: "How to read and serve this diet",
        titleSimple: "How to serve this ration",
        barfMeaning: "BARF means “Biologically Appropriate Raw Food”. The bar shows the proportion to combine each part:",
        muscle: "Muscle: the base, provides protein and energy.",
        bone: "Bone: provides calcium. Always meaty, never cooked!",
        organs: "Organs: vitamins (half liver).",
        vegKibble: "Veggies/Kibble: fiber or supplement.",
        howToServe: "How to serve:",
        howToServeText: " weigh the daily total with a kitchen scale and split it into {meals} meal(s). Each plate doesn't need to be exact: what matters is the balance across the week.",
        simple: "Measure {grams} g of kibble per meal with a measuring cup or scale. Always keep fresh water available and adjust the amount if you notice weight changes.",
      },
      tipForPet: "For {name}:",
      tipSplit: " split the ration into {meals} servings (e.g., morning and night). ",
      tipBarf: "Don't mix BARF with dry kibble in the same serving: they have different digestion times.",
      tipMixed: "Since it combines raw and kibble, separate them into different servings whenever you can for better digestion.",
      simpleNote: "Dry kibble diet: serve {grams} g per meal. Tap the (?) button above to see how to measure the portion correctly.",
      closing: "These amounts are a guide based on {name}'s weight. For any health concerns, always consult your vet.",
    },

    publicProfile: {
      title: "Public profile",
      visiblePublic: "Visible to anyone with the link",
      visiblePrivate: "Only you and your household can see it",
      public: "Public",
      private: "Private",
      toggleLabel: "Enable public profile",
      privacyStrip: "Medical records and diets are never shared through this link.",
      preview: "Preview",
      shareLink: "Link to share",
      copy: "Copy link",
      copied: "Copied!",
      copiedSr: "Link copied to clipboard",
      activateToShare: "Enable the public profile (above) to generate and copy the link.",
      inPrivate: "Profile is private",
      help: {
        title: "What is shared publicly?",
        intro: "When you enable this, anyone with the link can see a simple card of {name}:",
        item1: "Name, species, breed, age and photos.",
        item2: "Learned tricks (if you mark them as public).",
        privacyNote: "Medical history, diets and your personal data are NEVER shown. You're in control and can turn it off whenever you want.",
      },
    },

    floatingHelp: {
      eyebrow: "We're with you",
      title: "How can we help?",
      open: "Open help center",
      close: "Close help",
      item1: "Tap the purple (?) buttons in each section for a simple explanation.",
      item2: "In the diet you'll see how much food to serve and why. No complicated math.",
      item3: "Your medical data is always private. You decide what to share.",
    },

    a11y: { help: "More help", closeHelp: "Close help", addPet: "Add pet" },
  },
};

export const LANGUAGES = [
  { code: "es", short: "ES" },
  { code: "en", short: "EN" },
];

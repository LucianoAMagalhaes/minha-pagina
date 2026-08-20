/* ============================================================
   EDITE AQUI: os serviços da LUMO.
   Cada objeto vira um card. A ordem do array é a ordem na página.

     title       — nome do serviço
     description — o que é e para quem, em duas ou três frases
     tags        — array de strings, aparecem no rodapé do card
     featured    — true destaca o card com fundo em gradiente (opcional)

   Ao mudar esta lista, atualize também o <noscript> no index.html,
   que repete os serviços para quem navega sem JavaScript.
   ============================================================ */
const services = [
  {
    title: "Desenvolvimento sob medida",
    description:
      "Sistemas internos, portais e APIs construídos do zero para o seu processo — " +
      "não para o processo que o software de prateleira presume que você tem.",
    tags: ["Web", "API", "Mobile"],
    featured: true,
  },
  {
    title: "Modernização de sistemas",
    description:
      "Aquele sistema que ninguém quer mexer mas a empresa inteira depende. " +
      "Migramos por partes, com a operação rodando o tempo todo.",
    tags: ["Legado", "Migração", "Cloud"],
  },
  {
    title: "Integrações e automação",
    description:
      "Conectamos ERP, gateway de pagamento, CRM e as planilhas que sobraram no meio, " +
      "para acabar com o retrabalho manual entre sistemas que não se falam.",
    tags: ["Integrações", "ETL", "Automação"],
  },
  {
    title: "Consultoria e arquitetura",
    description:
      "Apoio técnico para decidir o que construir, o que comprar e o que simplesmente " +
      "descartar — antes de gastar um trimestre construindo a coisa errada.",
    tags: ["Arquitetura", "Discovery", "Code review"],
  },
];

/* ============================================================
   Daqui para baixo você não precisa mexer.
   ============================================================ */

/**
 * Monta os cards a partir do array `services`.
 *
 * Usa createElement/textContent em vez de innerHTML, então títulos e
 * descrições podem conter <, & ou aspas sem quebrar a página.
 *
 * Cada card é um <article>, não um <a>: o card não leva a lugar nenhum,
 * então não deve receber foco de teclado nem parecer clicável.
 */
function renderServices(list, container) {
  if (!container) return;

  const fragment = document.createDocumentFragment();

  for (const service of list) {
    const card = document.createElement("article");
    card.className = "service-card";
    if (service.featured) card.classList.add("is-featured");

    const head = document.createElement("div");
    head.className = "service-head";

    const title = document.createElement("h3");
    title.className = "service-title";
    title.textContent = service.title;
    head.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "service-desc";
    desc.textContent = service.description;

    card.append(head, desc);

    if (Array.isArray(service.tags) && service.tags.length > 0) {
      const tagList = document.createElement("ul");
      tagList.className = "service-tags";
      // list-style: none tira o papel de lista no Safari/VoiceOver;
      // role="list" devolve a semântica. Mesmo motivo das listas do HTML.
      tagList.setAttribute("role", "list");
      for (const tag of service.tags) {
        const item = document.createElement("li");
        item.textContent = tag;
        tagList.appendChild(item);
      }
      card.appendChild(tagList);
    }

    fragment.appendChild(card);
  }

  container.replaceChildren(fragment);
}

/**
 * Fade-in das seções conforme entram na viewport.
 * Se o usuário pediu menos movimento no sistema, mostra tudo de uma vez.
 */
function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ============================================================
   TEMA CLARO / ESCURO
   ============================================================ */
const THEME_KEY = "lumo-theme";

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/**
 * Aplica um tema e acerta o que depende dele fora do CSS.
 *
 * Quem escolhe o tema inicial é o script inline do <head>, antes do
 * primeiro paint; esta função existe para o clique e para manter o
 * rótulo do botão e a cor da barra do navegador em dia.
 *
 * A cor da barra sai do --bg já computado, e não de uma constante aqui:
 * assim a lista de cores continua existindo em um lugar só, o :root.
 */
function applyTheme(theme, button) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  // O rótulo descreve a ação, não o estado: é o que o leitor de tela
  // anuncia e o que o ícone visível (sol ou lua) está mostrando.
  const label = theme === "light" ? "Ativar modo escuro" : "Ativar modo claro";
  if (button) {
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
  if (meta && bg) meta.setAttribute("content", bg);
}

function setupThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  applyTheme(currentTheme(), button);

  button.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    applyTheme(next, button);
    // Pode lançar em file:// ou com armazenamento bloqueado. O tema da
    // sessão atual continua valendo; só não sobrevive ao reload.
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* sem persistência, e tudo bem */
    }
  });

  // Enquanto o usuário não escolher um tema, acompanhamos o sistema —
  // inclusive se ele virar sozinho no meio da sessão (modo automático).
  const query = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = (event) => {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (e) {
      /* idem */
    }
    if (saved === "light" || saved === "dark") return;
    applyTheme(event.matches ? "light" : "dark", button);
  };

  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", onSystemChange);
  }
}

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

renderServices(services, document.getElementById("services-grid"));
setupReveal();
setupThemeToggle();
setCurrentYear();

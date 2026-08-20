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

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

renderServices(services, document.getElementById("services-grid"));
setupReveal();
setCurrentYear();

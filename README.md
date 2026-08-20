# LUMO — landing page

Página institucional em HTML, CSS e JavaScript puros. Sem build, sem dependências,
sem `npm install`. Abre com duplo clique e publica em qualquer host estático.

```
├── index.html          # hero, sobre, serviços, contato
├── styles.css          # design tokens + layout
├── script.js           # lista de serviços + render
└── assets/favicon.svg
```

## O que editar

| O quê | Onde |
|---|---|
| E-mail, WhatsApp, domínio | `index.html` — bloco comentado no topo do `<head>` |
| Textos do hero e do "Sobre" | `index.html`, nas seções `#hero` e `#sobre` |
| Números da empresa | `index.html`, bloco `.stats` na seção `#sobre` |
| Lista de serviços | `script.js` — array `services` no topo |
| Cores, fontes, espaçamentos | `styles.css` — bloco `:root` no topo |
| CNPJ | `index.html`, no rodapé |

### Placeholders que precisam virar dados reais

Antes de publicar, procure e substitua:

- `contato@lumo.com.br` — e-mail de contato
- `55DDDNUMERO` — WhatsApp, só dígitos, com o 55 na frente (ex.: `5511987654321`)
- `https://lumo.com.br` — domínio, nas metatags Open Graph
- `00.000.000/0001-00` — CNPJ
- Os números do bloco `.stats` (8+ anos, 40+ projetos, 12 clientes)

### Adicionar um serviço

Acrescente um objeto ao array `services` em `script.js`:

```js
{
  title: "Nome do serviço",
  description: "O que é e para quem, em duas ou três frases.",
  tags: ["Web", "API"],
  featured: false,   // true destaca o card
}
```

Atualize também a lista dentro do `<noscript>` no `index.html` — é o que aparece
para quem navega sem JavaScript.

### Trocar a cor da marca

No `:root` do `styles.css`:

```css
--accent:       #6366f1;   /* índigo — botões, brilho, foco, bordas */
--accent-hover: #4f46e5;
--accent-text:  #ffffff;   /* texto que vai EM CIMA do acento */

--accent-2:     #10b981;   /* esmeralda — acentos em TEXTO */
```

São dois acentos porque eles têm trabalhos diferentes:

- `--accent` é cor de **fundo** (botão primário, link de pular, anel de foco).
  O `--accent-text` vai em cima dele e precisa contrastar: o índigo é escuro,
  então o texto é branco (4.47:1). Se você trocar por uma cor de marca clara
  (um âmbar, por exemplo), mude `--accent-text` para algo escuro como `#0f172a`
  — senão os botões ficam ilegíveis.
- `--accent-2` é cor de **texto** sobre o fundo escuro (eyebrow, rótulo de seção,
  números das stats, ponto da marca). O índigo sobre `--bg` dá só 4.0:1 e reprova
  no mínimo de 4.5:1 para texto pequeno; o esmeralda dá 7.04:1. Se você mudar esta
  linha, verifique o contraste contra `--bg` com uma conta, não no olho.

## Rodar local

```bash
python3 -m http.server 8000
```

Abra <http://localhost:8000>. Abrir o `index.html` direto pelo navegador também
funciona — todos os caminhos são relativos.

## Publicar

**GitHub Pages** — suba os arquivos e, em *Settings → Pages*, aponte para a branch
`main`, pasta `/ (root)`.

**Netlify** — arraste a pasta para <https://app.netlify.com/drop>.

**Vercel** — `npx vercel` na raiz, ou importe o repositório pelo painel.

Não há build: é só conteúdo estático.

## Detalhes

- **Acessibilidade:** marcação semântica, link de pular para o conteúdo, foco visível,
  respeito a `prefers-reduced-motion` e contraste verificado: texto principal em
  16.3:1, texto secundário em 6.96:1, acentos em texto (esmeralda) em 7.04:1 e o
  branco sobre o botão índigo em 4.47:1 — este último a 0,03 do mínimo de 4.5:1.
- **Sem JavaScript:** a página continua inteira; a lista de serviços vem de um
  `<noscript>` em texto.
- **Fonte:** Inter via Google Fonts, com fallback para as fontes do sistema.

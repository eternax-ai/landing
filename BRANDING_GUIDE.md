# EternaX Branding Guide (Model Prompt Reference)

Use this as the canonical brand context for generating marketing copy, product descriptions, social posts, reports, and site content for EternaX.

## Brand Identity

- **Brand name:** `EternaX` (display wordmark often appears as `eternaX`)
- **Company name:** `EternaX Labs`
- **Category:** Post-quantum market infrastructure
- **Core tagline:** `Quantum-safe Settlement at Market Speed`
- **Primary thesis:** Post-quantum security must not impose a permanent throughput and coordination penalty.

## One-Liner and Positioning

- **Default one-liner:** EternaX is post-quantum market infrastructure for stablecoin issuance, RWA tokenization, and institutional settlement.
- **Positioning statement:** EternaX is a PQ-native Layer 1 built to stay fast when markets reprice quantum risk.
- **Strategic framing:** If PQ is expensive, liquidity routes around it; the fastest safe domain wins routing for payments, clearing, and settlement.

## Visual Brand Tokens

- **Primary text/brand color:** `#283771` (navy)
- **Primary background:** `#F7F4F4` / `#F8F4F4`
- **Surface:** `#FFFFFF`
- **Border neutral:** `#E0DEDE`
- **Supporting accent examples:**
  - Green: `#2F5E52`
  - Red: `#8D2E2E`
- **Typography family:** IBM Plex system (`IBM Plex Sans`, `IBM Plex Sans Condensed`, `IBM Plex Serif`, `IBM Plex Mono`)
- **Visual style:** Light institutional palette, clean cards, subtle borders, restrained glass effect, high readability.

## Channels and Brand Handles

- Website: `https://eternax.ai`
- X: `@EternaXlabs`
- LinkedIn: `EternaX Labs`
- GitHub: `eternax-ai`
- YouTube: `@eternaXlabs`

## Team Links

- Dariia Porechna
  - LinkedIn: `https://www.linkedin.com/in/dariia-porechna`
  - X: `https://x.com/FutureDies`
- Paarrthhh Birla
  - LinkedIn: `https://www.linkedin.com/in/paarrthhh-birla-b3607bb4/`
  - X: `https://x.com/parthweb34ai`
- Dr. Chen Feng
  - LinkedIn: `https://www.linkedin.com/in/chen-feng-75272a37`
  - Google Scholar: `https://scholar.google.com/citations?user=D8b0l-EAAAAJ`

## HTML Implementation Requirements

Use this checklist when creating or updating an EternaX HTML page.

### Required Branding Fields

- `<title>` with brand/category context:
  - Include `EternaX` and either `Post-Quantum Market Infrastructure` or page-specific equivalent.
- `<meta name="description">`:
  - Must include post-quantum positioning and primary page value proposition.
- `<meta name="keywords">`:
  - Include core keyword set plus page-specific terms.
- Canonical:
  - `<link rel="canonical" href="https://eternax.ai/<page>.html">`
- Tagline placement:
  - Include `Quantum-safe Settlement at Market Speed` in visible page content (hero, header, or footer).

### SEO Keywords (Core Set)

Use/adapt these in `keywords` metadata:

- `quantum-safe settlement`
- `post-quantum cryptography`
- `PQ-native assets`
- `post-quantum market infrastructure`
- `quantum-resistant blockchain`
- `quantum-safe signatures`
- `PQ-safe vaults`
- `post-quantum stablecoin`
- `RWA tokenization`
- `auditable privacy`
- `spendable finality`
- `post-quantum settlement`

### Social Metadata

- Open Graph:
  - `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale`
- Twitter:
  - `twitter:card`, `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`, `twitter:creator`

### Organization `sameAs` (Schema)

In JSON-LD Organization include:

- `https://x.com/eternaXLabs`
- `https://github.com/eternax-ai`
- `https://www.youtube.com/@eternaXlabs`
- `https://farcaster.xyz/eternax`
- `https://www.linkedin.com/company/eternax-labs`

### Required Structured Data

At minimum include JSON-LD blocks for:

1. `Organization`
  - `name`, `alternateName`, `url`, `logo`, `description`, `foundingDate`, `industry`, `sameAs`
  - `founder` and `advisor` where relevant
2. `WebSite`
  - `url`, `name`, `description`, `publisher`, `inLanguage`
3. Page-specific type
  - `AboutPage` for about pages
  - `ScholarlyArticle` for reports/research
  - `DefinedTermSet` for glossary pages
  - `BreadcrumbList` for non-home pages

### Technical Meta/Infra for HTML

- `meta charset="UTF-8"`
- `meta name="viewport" content="width=device-width, initial-scale=1.0"`
- `meta name="theme-color" content="#e2e2e2"`
- robots directives (`robots`, `googlebot`, `bingbot`)
- language/distribution/rating/fmt-detection tags
- favicon links (`svg` + `png`) from `./assets/eternax-icon.svg` and `./assets/eternax-icon.png`
- preconnect + dns-prefetch for Google Fonts
- stylesheet link [https://raw.githubusercontent.com/eternax-ai/landing/refs/heads/main/styles/tailwind.generated.css](https://raw.githubusercontent.com/eternax-ai/landing/refs/heads/main/styles/tailwind.generated.css)
- AI provenance tags used across pages:
  - `ai-content-declaration`
  - `article:publisher`


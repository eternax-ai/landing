# eternaX Landing Site

## Tech Stack

- **HTML5** + **Tailwind CSS** (utility-first, built via `npm run build:css`)
- **Jekyll** on GitHub Pages (static site hosting, `{% include %}` for shared partials)
- **GitHub Actions** for automated deployment
- **Marked** (Node.js) for blog Markdown-to-HTML generation

## Project Structure

```
landing/
├── index.html                          # Homepage
├── pilot.html                          # Pilot programme (primary conversion page)
├── why-eternax.html                    # Architecture and investment thesis
├── stablecoin-issuers.html             # Solution: stablecoin issuers
├── tokenized-funds-rwas.html           # Solution: tokenized funds / RWA platforms
├── custody-mpc-providers.html          # Solution: custody and MPC providers
├── testnet.html                        # Testnet access and developer proof
├── about.html                          # Company and founders
├── glossary.html                       # PQ terminology
├── post_quantum_mpc_custody_crisis_*   # Report: MPC Custody Crisis 2026
├── post_quantum_exposure_map_*         # Report: Exposure Map 2026
├── post-quantum-signature-security-*   # Report: Signature Security Ranking
├── post-quantum-cryptography-risk-*    # Report: Migration Debt Framework
├── already-broken-*                    # Report: Already Broken Q1 2026
├── blogs/
│   ├── index.html                      # Blog index (manually curated)
│   └── <slug>/index.md + index.html    # Individual blog posts
├── scripts/
│   ├── build-blog.js                   # Markdown → HTML blog generator
│   └── blog-template.html              # Shared blog HTML template
├── _includes/
│   └── navbar.html                     # Shared navigation partial
├── page-template.html                  # Template for new static pages
├── styles/
│   ├── tailwind.css                    # Tailwind input
│   ├── tailwind.generated.css          # Built CSS (committed)
│   └── tailwind.config.js
├── assets/                             # Images, icons, fonts
├── sitemap.xml                         # XML sitemap
├── sitemap-blogs.xml                   # Blog-specific sitemap
├── llms.txt                            # AI/LLM discovery file
├── robots.txt
├── _config.yml                         # Jekyll config
├── CNAME                               # Custom domain
└── .github/workflows/deploy.yml        # CI/CD
```

## Common Commands

```bash
# Build Tailwind CSS (run after adding/changing utility classes)
npm run build:css

# Generate or regenerate a blog post from Markdown
npm run build-blog blogs/<slug>
```

## Adding Pages

1. Copy `page-template.html` and rename it.
2. Replace placeholder metadata and content.
3. Keep shared nav/footer/styles intact.
4. Add to `sitemap.xml` and `llms.txt`.
5. Regenerate CSS if new Tailwind classes are used: `npm run build:css`.

## Blog Workflow

1. Create `blogs/<slug>/index.md` with content.
2. Register metadata in `scripts/build-blog.js` `postMetaMap`.
3. Run `node scripts/build-blog.js blogs/<slug>`.
4. Add the post to `blogs/index.html` manually.

## Deployment

Push to `main` branch. GitHub Actions builds via Jekyll and deploys to GitHub Pages at `https://eternax.ai`.

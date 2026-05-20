const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const blogFolder = process.argv[2];
if (!blogFolder) {
  console.error('Usage: node scripts/build-blog.js <blog-folder>');
  console.error('Example: node scripts/build-blog.js blogs/migrate-later');
  process.exit(1);
}

const root = path.resolve(process.cwd());
const blogPath = path.resolve(root, blogFolder);
const blogsDir = path.join(root, 'blogs');
const postMetaMap = {
  'unbundling-transaction-signature': {
    datePublished: '2026-05-19',
    description: 'How decomposing the four jobs bundled into a transaction signature makes post-quantum settlement practical without a permanent per-transaction size tax.',
    keywords: 'post-quantum blockchain, BFT finality, transaction signature, designated-verifier signatures, SILMARILS, consensus',
    about: ['Post-Quantum Blockchain', 'BFT Finality', 'Transaction Signatures', 'Designated-Verifier Signatures', 'SILMARILS'],
    authorLine: 'Dariia Porechna, cryptographer, co-founder of EternaX',
    scholarlyArticle: {
      '@type': 'ScholarlyArticle',
      name: 'SILMARILS: Information-Theoretic and Quantum-Secure Designated-Verifier Signatures',
      url: 'https://arxiv.org/abs/2605.03230',
      identifier: 'arXiv:2605.03230'
    }
  },
  'silmarils-post-quantum-authentication-without-size-tax': {
    datePublished: '2026-05-05',
    description: 'How SILMARILS combines SPHINCS+ anchoring with compact, information-theoretic records for post-quantum blockchain authentication.',
    keywords: 'SILMARILS, post-quantum authentication, designated-verifier signatures, SPHINCS+, information-theoretic security',
    about: ['SILMARILS', 'Post-Quantum Authentication', 'Designated-Verifier Signatures', 'SPHINCS+', 'Information-Theoretic Security'],
    authorLine: 'Dariia Porechna, cryptographer, co-founder of EternaX',
    scholarlyArticle: {
      '@type': 'ScholarlyArticle',
      name: 'SILMARILS: Information-Theoretic and Quantum-Secure Designated-Verifier Signatures',
      url: 'https://arxiv.org/abs/2605.03230',
      identifier: 'arXiv:2605.03230'
    }
  },
  'hiding-your-public-key-wont-save-your-coins': {
    datePublished: '2026-04-03',
    description: 'Why operational security is not a post-quantum strategy for protecting digital assets.',
    keywords: 'post-quantum security, bitcoin security, cryptographic vulnerability',
    about: ['Post-Quantum Security', 'Bitcoin Security', 'Cryptographic Vulnerability']
  },
  'all-in-one-signature-that-built-bitcoin': {
    datePublished: '2026-03-18',
    description: 'ECDSA and secp256k1 enabled Bitcoin ownership, but quantum risk changes the long-term security model.',
    keywords: 'ecdsa, bitcoin, post-quantum cryptography, secp256k1',
    about: ['ECDSA', 'Bitcoin', 'Post-Quantum Cryptography', 'Secp256k1']
  },
  'private-chains-are-not-private': {
    datePublished: '2026-03-16',
    description: 'Why private chains still carry post-quantum cryptographic exposure despite privacy-focused design.',
    keywords: 'zcash, monero, post-quantum privacy, zip-2005',
    about: ['Zcash', 'Monero', 'Post-Quantum Privacy', 'ZIP-2005']
  },
  'occ-did-not-kill-stablecoins': {
    datePublished: '2026-03-08',
    description: 'The OCC update is a market-structure and distribution signal, not a stablecoin category shutdown.',
    keywords: 'occ, genius act, stablecoin regulation',
    about: ['OCC', 'GENIUS Act', 'Stablecoin Regulation']
  },
  'the-real-migration-is-bigger-than-quantum': {
    datePublished: '2026-03-02',
    description: 'Post-quantum transition is an infrastructure migration problem, not just a cryptography patch.',
    keywords: 'post-quantum migration, blockchain infrastructure, security',
    about: ['Post-Quantum Migration', 'Blockchain Infrastructure', 'Security']
  },
  'post-quantum-is-not-enough': {
    datePublished: '2026-02-24',
    description: 'Post-quantum security alone is insufficient without resilient security assumptions and operational design.',
    keywords: 'information-theoretic security, post-quantum cryptography, ai security',
    about: ['Information-Theoretic Security', 'Post-Quantum Cryptography', 'AI Security']
  },
  'quantum-risk-is-a-cost-curve': {
    datePublished: '2026-02-20',
    description: 'Quantum migration behaves like a cost curve across blockchains, with major implications for issuance rails.',
    keywords: 'ethereum pq migration, bitcoin quantum risk, cost curve',
    about: ['Ethereum PQ Migration', 'Bitcoin Quantum Risk', 'Cost Curve']
  },
  'right-to-cryptography': {
    datePublished: '2026-02-13',
    description: 'Why strong cryptography should be treated as a foundational digital right for modern economies.',
    keywords: 'cryptography history, public-key cryptography, digital rights',
    about: ['Cryptography History', 'Public-Key Cryptography', 'Digital Rights']
  },
  'migrate-later-is-a-stablecoin-liquidity-risk': {
    datePublished: '2026-02-13',
    description: 'Delaying post-quantum migration can become a structural liquidity risk for stablecoin issuers.',
    keywords: 'stablecoin issuance, post-quantum migration, liquidity risk',
    about: ['Stablecoin Issuance', 'Post-Quantum Migration', 'Liquidity Risk']
  },
  '3-trillion-must-migrate': {
    datePublished: '2026-02-04',
    description: 'A large share of on-chain value faces eventual post-quantum migration pressure across major networks.',
    keywords: 'blockchain migration, post-quantum, bitcoin, ethereum',
    about: ['Blockchain Migration', 'Post-Quantum', 'Bitcoin', 'Ethereum']
  },
  'mint-new-dollars-onchain-on-a-post-quantum-settlement-rail': {
    datePublished: '2026-02-01',
    description: 'Why new on-chain dollar issuance should be designed for post-quantum settlement from day one.',
    keywords: 'stablecoin issuance, post-quantum settlement, rwa',
    about: ['Stablecoin Issuance', 'Post-Quantum Settlement', 'RWA']
  }
};

const relativeToBlogs = path.relative(blogsDir, blogPath);
if (relativeToBlogs.startsWith('..') || path.isAbsolute(relativeToBlogs) || relativeToBlogs === '') {
  console.error('Blog folder must be inside blogs/ (e.g. blogs/my-post)');
  process.exit(1);
}

const mdPath = path.join(blogPath, 'index.md');
if (!fs.existsSync(mdPath)) {
  console.error('No index.md found in', blogPath);
  process.exit(1);
}

let raw = fs.readFileSync(mdPath, 'utf8');
const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
let title = '';
let description = '';
let body = raw;

if (fmMatch) {
  body = fmMatch[2];
  const fm = fmMatch[1];
  const titleM = fm.match(/^title:\s*(.+)$/m);
  const descM = fm.match(/^description:\s*(.+)$/m);
  if (titleM) title = titleM[1].trim().replace(/^["']|["']$/g, '');
  if (descM) description = descM[1].trim().replace(/^["']|["']$/g, '');
}

if (!title) {
  const h1 = body.match(/^#\s+(.+)$/m);
  title = h1 ? h1[1].trim() : path.basename(blogPath);
}

const slug = path.basename(blogPath);
const postMeta = postMetaMap[slug] || {
  datePublished: new Date().toISOString().slice(0, 10),
  description: '',
  keywords: 'post-quantum cryptography, blockchain security, eternax',
  about: ['Post-Quantum Cryptography']
};

if (postMeta.description) {
  description = postMeta.description;
} else if (!description) {
  const bodyAfterTitle = body.replace(/^#.*$/m, '').trim();
  const blocks = bodyAfterTitle.split(/\n\n+/);
  const isImageBlock = (s) => /^\s*!\[[\s\S]*\]\s*\([\s\S]*\)\s*$/.test(s.trim());
  let candidate = '';
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (isImageBlock(trimmed)) continue;
    candidate = trimmed
      .replace(/\s+/g, ' ')
      .replace(/^#+\s*/, '')
      .replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, '$1$2')
      .replace(/\*([^*]+)\*|_([^_]+)_/g, '$1$2')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^>\s*/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    break;
  }
  description = candidate ? candidate.slice(0, 160).replace(/\s+\S*$/, '').trim() : '';
}

marked.setOptions({ gfm: true });
let content = marked.parse(body);
const publishedDate = new Date(`${postMeta.datePublished}T00:00:00Z`).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC'
});

const authorLine = postMeta.authorLine ? escapeHtml(postMeta.authorLine) : 'EternaX Labs';
content = content.replace(/<h1>([\s\S]*?)<\/h1>/, (match, h1Content) => {
  return `<h1>${h1Content}</h1>\n<p class="blog-date" style="color: var(--fg-70); font-size: 0.9rem; margin-top: -0.5em; margin-bottom: 0.25em;">${escapeHtml(publishedDate)}</p>\n<p class="blog-author" style="color: var(--fg-70); font-size: 0.9rem; margin-top: 0; margin-bottom: 1.5em;">Author: ${authorLine}</p>`;
});

const blogPostingExtensions =
  postMeta.scholarlyArticle && typeof postMeta.scholarlyArticle === 'object'
    ? ',\n      "isBasedOn": ' + JSON.stringify(postMeta.scholarlyArticle)
    : '';

const templatePath = path.join(__dirname, 'blog-template.html');
let html = fs.readFileSync(templatePath, 'utf8');
const base = path.relative(blogPath, root).split(path.sep).join('/') + '/';
html = html
  .replace(/\{\{base\}\}/g, base)
  .replace(/\{\{title\}\}/g, escapeHtml(title))
  .replace(/\{\{description\}\}/g, escapeHtml(description))
  .replace(/\{\{canonicalUrl\}\}/g, `https://eternax.ai/blogs/${slug}/index.html`)
  .replace(/\{\{datePublished\}\}/g, postMeta.datePublished)
  .replace(/\{\{keywords\}\}/g, escapeHtml(postMeta.keywords))
  .replace(/\{\{keywordsJson\}\}/g, JSON.stringify(postMeta.keywords))
  .replace(/\{\{aboutJson\}\}/g, JSON.stringify(postMeta.about.map((name) => ({ '@type': 'Thing', name }))))
  .replace(/\{\{blogPostingExtensions\}\}/g, blogPostingExtensions)
  .replace(/\{\{content\}\}/, content);

const outPath = path.join(blogPath, 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', path.relative(root, outPath));

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

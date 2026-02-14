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

if (!blogPath.startsWith(blogsDir) || blogPath === blogsDir) {
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

if (!description) {
  const bodyAfterTitle = body.replace(/^#.*$/m, '').trim();
  const blocks = bodyAfterTitle.split(/\n\n+/);
  const isImageBlock = (s) => /^\s*!\[[\s\S]*\]\s*\([\s\S]*\)\s*$/.test(s.trim());
  let candidate = '';
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (isImageBlock(trimmed)) continue;
    candidate = trimmed.replace(/\s+/g, ' ').replace(/^#+\s*/, '').replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, '$1$2').replace(/\*([^*]+)\*|_([^_]+)_/g, '$1$2').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/^>\s*/, '').trim();
    break;
  }
  description = candidate ? candidate.slice(0, 160) : '';
}

marked.setOptions({ gfm: true });
const content = marked.parse(body);

const templatePath = path.join(__dirname, 'blog-template.html');
let html = fs.readFileSync(templatePath, 'utf8');
const base = path.relative(blogPath, root).split(path.sep).join('/') + '/';
html = html
  .replace(/\{\{base\}\}/g, base)
  .replace(/\{\{title\}\}/g, escapeHtml(title))
  .replace(/\{\{description\}\}/g, escapeHtml(description))
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

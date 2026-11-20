// Shared post loader: used by index.html (latest strip), blog.html and post.html.
const REPO = "Npdevil007/portfolio";
const BRANCH = "main";
const POSTS_PATH = "posts";
const CACHE_KEY = "posts-cache-v1";
const CACHE_MS = 5 * 60 * 1000; // new posts can take up to 5 min to appear

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  match[1].split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
    if (key) data[key] = val;
  });
  return { data, content: match[2] };
}

function makeExcerpt(md, len = 110) {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > len ? text.slice(0, len).trimEnd() + "…" : text;
}

function formatDate(d) {
  if (!d) return "";
  const t = new Date(d);
  return isNaN(t) ? d : t.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function readCache(allowStale) {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (c && (allowStale || Date.now() - c.t < CACHE_MS)) return c.posts;
  } catch (e) {}
  return null;
}

async function fetchPosts() {
  const fresh = readCache(false);
  if (fresh) return fresh;
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${POSTS_PATH}?ref=${BRANCH}`);
    if (res.status === 404) return [];
    const files = await res.json();
    if (!Array.isArray(files)) throw new Error("Could not list posts");

    const posts = await Promise.all(
      files.filter(f => f.name.endsWith(".md")).map(async f => {
        const raw = await (await fetch(f.download_url)).text();
        const { data, content } = parseFrontmatter(raw);
        return {
          filename: f.name,
          title: data.title || "",
          date: data.date || "",
          image: data.image || "",
          excerpt: makeExcerpt(content),
        };
      })
    );

    // Newest first. Posts without a date fall back to the date in their filename.
    const key = p => (p.date ? p.date.slice(0, 10) : p.filename.slice(0, 10));
    posts.sort((a, b) => key(b).localeCompare(key(a)) || b.filename.localeCompare(a.filename));

    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), posts })); } catch (e) {}
    return posts;
  } catch (err) {
    const stale = readCache(true); // GitHub rate limit etc: show the last good copy
    if (stale) return stale;
    throw err;
  }
}

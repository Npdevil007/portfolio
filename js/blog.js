const REPO = "Npdevil007/portfolio";
const BRANCH = "main";
const POSTS_PATH = "posts";

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  match[1].split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { data, content: match[2] };
}

async function loadPosts() {
  const grid = document.getElementById("blog-grid");
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${POSTS_PATH}?ref=${BRANCH}`);
    const files = await res.json();
    if (!Array.isArray(files)) throw new Error("No posts found");

    const mdFiles = files.filter(f => f.name.endsWith(".md"));
    const posts = await Promise.all(mdFiles.map(async file => {
      const raw = await (await fetch(file.download_url)).text();
      const { data } = parseFrontmatter(raw);
      return { ...data, filename: file.name };
    }));

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = posts.length ? "" : "<p>No posts yet. Check back soon!</p>";
    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <div class="project-image" style="background-image:url('${post.image || ""}');background-size:cover;background-position:center;"></div>
        <h3>${post.title || "Untitled"}</h3>
        <p>${post.date || ""}</p>
        <a href="post.html?file=${encodeURIComponent(post.filename)}">Read Post →</a>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Unable to load posts right now.</p>";
    console.error(err);
  }
}

loadPosts();
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

async function loadPost() {
  const filename = new URLSearchParams(window.location.search).get("file");
  const container = document.getElementById("post-content");
  if (!filename) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }
  try {
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${POSTS_PATH}/${filename}`;
    const raw = await (await fetch(url)).text();
    const { data, content } = parseFrontmatter(raw);
    document.title = `${data.title || "Post"} | Sushil Nepali`;
    container.innerHTML = `
      ${data.image ? `<img src="${data.image}" alt="" class="post-image">` : ""}
      <div class="eyebrow">${data.date || ""}</div>
      <h1>${data.title || "Untitled"}</h1>
      <div>${marked.parse(content)}</div>
    `;
  } catch (err) {
    container.innerHTML = "<p>Unable to load this post.</p>";
    console.error(err);
  }
}

loadPost();
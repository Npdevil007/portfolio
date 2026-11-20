// Requires js/posts.js and marked to be loaded first.
async function loadPost() {
  const filename = new URLSearchParams(window.location.search).get("file");
  const container = document.getElementById("post-content");
  if (!filename || !/^[^/\\]+\.md$/.test(filename) || filename.includes("..")) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }
  try {
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${POSTS_PATH}/${encodeURIComponent(filename)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Post not found");
    const { data, content } = parseFrontmatter(await res.text());
    document.title = `${data.title || "Post"} | Sushil Nepali`;
    container.innerHTML = `
      ${data.image ? `<img src="${esc(data.image)}" alt="${esc(data.title)}" class="post-image">` : ""}
      ${data.date ? `<div class="eyebrow">${esc(formatDate(data.date))}</div>` : ""}
      ${data.title ? `<h1>${esc(data.title)}</h1>` : ""}
      <div>${content.trim() ? marked.parse(content) : ""}</div>
    `;
  } catch (err) {
    container.innerHTML = "<p>Unable to load this post.</p>";
    console.error(err);
  }
}

loadPost();

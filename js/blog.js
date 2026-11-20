// Requires js/posts.js to be loaded first.
async function loadPosts() {
  const grid = document.getElementById("blog-grid");
  try {
    const posts = await fetchPosts();
    grid.innerHTML = posts.length ? "" : "<p>No posts yet. Check back soon!</p>";

    posts.forEach(p => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        ${p.image ? `<div class="project-image"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"></div>` : ""}
        ${p.title ? `<h3>${esc(p.title)}</h3>` : ""}
        ${p.date ? `<p>${esc(formatDate(p.date))}</p>` : ""}
        ${!p.image && p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ""}
        <a href="post.html?file=${encodeURIComponent(p.filename)}">${p.excerpt ? "Read Post →" : "View →"}</a>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Unable to load posts right now.</p>";
    console.error(err);
  }
}

loadPosts();

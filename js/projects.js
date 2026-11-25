// Renders PROJECTS (from js/projects-data.js) into any element with data-projects.
//   data-featured  -> only projects with featured:true
//   data-limit="3" -> at most 3 cards
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  function card(p) {
    const external = /^https?:\/\//.test(p.link || "");
    return `
      <div class="project-card">
        <div class="project-image">
          ${p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
            : `<span class="project-initial">${esc((p.title || "?").trim().charAt(0))}</span>`}
        </div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${p.tags && p.tags.length ? `<div class="project-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
        ${p.link ? `<a href="${esc(p.link)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(p.linkText || "View Project →")}</a>` : ""}
      </div>`;
  }

  document.querySelectorAll("[data-projects]").forEach(grid => {
    if (typeof PROJECTS === "undefined") return;
    let list = PROJECTS.filter(p => !grid.hasAttribute("data-featured") || p.featured);
    const limit = parseInt(grid.dataset.limit || "0", 10);
    if (limit) list = list.slice(0, limit);
    grid.innerHTML = list.length ? list.map(card).join("") : "<p>Projects coming soon.</p>";
  });
})();

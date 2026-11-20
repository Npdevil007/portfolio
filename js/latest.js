// Homepage "Latest Posts" auto-scrolling strip. Requires js/posts.js first.
(async () => {
  const section = document.getElementById("latest");
  if (!section) return;
  const viewport = section.querySelector(".latest-viewport");
  const track = document.getElementById("latest-track");

  try {
    const posts = await fetchPosts();
    if (!posts.length) return; // section stays hidden

    track.innerHTML = posts.map(p => `
      <a class="latest-card ${p.image ? "has-img" : "text-only"}" href="post.html?file=${encodeURIComponent(p.filename)}">
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : ""}
        <div class="latest-meta">
          ${p.title ? `<h3>${esc(p.title)}</h3>` : ""}
          ${!p.image && p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ""}
          ${p.date ? `<span>${esc(formatDate(p.date))}</span>` : ""}
        </div>
      </a>`).join("");

    section.hidden = false;

    // Only scroll if the posts don't already fit on screen.
    if (track.scrollWidth > viewport.clientWidth) {
      [...track.children].forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
      track.style.setProperty("--dur", Math.max(15, posts.length * 5) + "s");
    } else {
      track.classList.add("static");
    }
  } catch (err) {
    console.error(err); // fail quietly: homepage just doesn't show the strip
  }
})();

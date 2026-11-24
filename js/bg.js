// Animated grid background: slow drift + a cyan glow that follows the cursor.
(function () {
  const bg = document.querySelector(".background");
  const grid = bg && bg.querySelector(".grid");
  if (!grid) return;

  const glow = document.createElement("div");
  glow.className = "grid-glow";
  bg.appendChild(glow);

  const SPEED = 6; // px per second the grid drifts (cell size is 60px)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let off = 0;
  let last = performance.now();
  let tx = innerWidth / 2, ty = innerHeight / 2; // target (mouse)
  let cx = tx, cy = ty;                          // eased position

  window.addEventListener("pointermove", e => {
    tx = e.clientX;
    ty = e.clientY;
    glow.classList.add("on");
  }, { passive: true });

  window.addEventListener("pointerup", e => {
    if (e.pointerType === "touch") glow.classList.remove("on");
  });
  document.documentElement.addEventListener("mouseleave", () => glow.classList.remove("on"));

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!reduce) off = (off + dt * SPEED) % 60;
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;

    // One shared offset keeps the glow lines exactly on top of the grid lines.
    bg.style.setProperty("--off", off.toFixed(2) + "px");
    glow.style.setProperty("--mx", cx.toFixed(1) + "px");
    glow.style.setProperty("--my", cy.toFixed(1) + "px");
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

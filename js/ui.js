(function () {
  // 1. Footer (added to every page that loads this file)
  if (!document.querySelector(".site-footer")) {
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = `
      <div class="footer-cta">Open to new projects.</div>
      <a class="footer-mail" href="mailto:sushilnpli8@gmail.com">sushilnpli8@gmail.com</a>
      <div class="footer-cols">
        <div>
          <h4>Pages</h4>
          <a href="index.html">Home</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </div>
        <div>
          <h4>Social</h4>
          <a href="https://github.com/Npdevil007" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://x.com/SushilNpli" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com/sushilnpli07" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Sushil Nepali</span>
        <span><span data-clock>--:--</span> Nepal</span>
      </div>`;
    document.body.appendChild(f);
  }

  // 2. Live Nepal clock (updates every element with data-clock)
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kathmandu"
  });
  function tick() {
    const t = fmt.format(new Date());
    document.querySelectorAll("[data-clock]").forEach(el => (el.textContent = t));
  }
  tick();
  setInterval(tick, 10000);

  // 3. Fade-up on scroll (added by JS, so nothing stays hidden if JS fails)
  const els = document.querySelectorAll(".section-title, .hero-meta-bar, .site-footer");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => { el.classList.add("reveal"); io.observe(el); });
  }
    // Keep the active nav link visible on small screens
  const activeLink = document.querySelector(".nav-links a.active");
  if (activeLink && activeLink.scrollIntoView) {
    activeLink.scrollIntoView({ inline: "center", block: "nearest" });
  }
})();

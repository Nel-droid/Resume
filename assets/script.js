// ---------- Typing role animation ----------
(function typeRoles() {
  const roles = ["Penetration Tester", "Vulnerability Researcher", "Web Developer", "CTF Player"];
  const el = document.getElementById("typed-role");
  if (!el) return;

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
})();

// ---------- Scroll reveal ----------
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
})();

// ---------- Mobile nav toggle ----------
(function nav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    })
  );
})();

// ---------- Footer local time ----------
(function footerTime() {
  const el = document.getElementById("footer-time");
  if (!el) return;
  function update() {
    const now = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Tashkent",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    el.textContent = `Tashkent — ${now}`;
  }
  update();
  setInterval(update, 30000);
})();

// ---------- Particle network background ----------
(function particles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height, particlesArr;
  const PARTICLE_COUNT_BASE = 9000; // px^2 per particle, scales with screen size
  const LINK_DIST = 130;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(120, Math.floor((width * height) / PARTICLE_COUNT_BASE));
    particlesArr = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particlesArr) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    for (let i = 0; i < particlesArr.length; i++) {
      const a = particlesArr[i];
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,43,43,0.55)";
      ctx.fill();

      for (let j = i + 1; j < particlesArr.length; j++) {
        const b = particlesArr[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(120,130,150,${(1 - dist / LINK_DIST) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  if (prefersReducedMotion) {
    step(); // draw once, static
  } else {
    requestAnimationFrame(step);
  }
})();

// ---------- Active nav highlight on scroll ----------
(function activeNav() {
  const sections = document.querySelectorAll("main .section, header#hero");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const map = {};
  links.forEach((l) => {
    const id = l.getAttribute("href").replace("#", "");
    map[id] = l;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && map[id]) {
          links.forEach((l) => l.style.color = "");
          map[id].style.color = "var(--red)";
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => observer.observe(s));
})();

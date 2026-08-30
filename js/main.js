// ---------- Scroll progress bar ----------
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = `${scrolled}%`;
}, { passive: true });

// ---------- Cursor glow (desktop, pointer:fine only) ----------
const cursorGlow = document.querySelector('.cursor-glow');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (cursorGlow && finePointer && !reducedMotion) {
  let rafId = null;
  window.addEventListener('mousemove', (e) => {
    cursorGlow.classList.add('active');
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }, { passive: true });
  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

// ---------- Magnetic buttons ----------
if (finePointer && !reducedMotion) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ---------- Number counter (stat strip) ----------
document.querySelectorAll('.stat .num[data-target]').forEach(el => {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.target.includes('.') ? el.dataset.target.split('.')[1].length : 0;
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(el);
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counterObserver.observe(el);
});

// ---------- Nav sliding indicator ----------
const navIndicator = document.querySelector('.nav-indicator');
function moveIndicator(link) {
  if (!navIndicator || !link) return;
  const container = link.parentElement;
  const containerRect = container.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  navIndicator.style.width = `${linkRect.width}px`;
  navIndicator.style.transform = `translateX(${linkRect.left - containerRect.left}px)`;
  navIndicator.style.opacity = '1';
}

// ---------- Hero AI console ----------
(function heroConsole() {
  const consoleRoot = document.querySelector('.ai-console');
  if (!consoleRoot) return;

  const typedEl = consoleRoot.querySelector('.typed-text');
  const cursorEl = consoleRoot.querySelector('.cursor-blink');
  const thinkingEl = consoleRoot.querySelector('.console-thinking');
  const outputEl = consoleRoot.querySelector('.console-output');

  const sequences = [
    { prompt: 'generate interview kit from resume + job description', chips: ['Technical Qs', 'Behavioral Qs', 'Assessment Notes'] },
    { prompt: 'sync offline changes when connection returns', chips: ['Queue: 3 actions', 'Retry: backoff', 'Status: synced'] },
    { prompt: 'optimize dashboard for Lighthouse', chips: ['Bundle -42%', 'LCP 1.2s', 'Score: 98'] }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  if (reducedMotion) {
    typedEl.textContent = sequences[0].prompt;
    thinkingEl.style.display = 'none';
    if (cursorEl) cursorEl.style.display = 'none';
    outputEl.innerHTML = sequences[0].chips.map(c => `<span class="console-chip show">${c}</span>`).join('');
    return;
  }

  async function typeText(text) {
    typedEl.textContent = '';
    for (let i = 0; i < text.length; i++) {
      typedEl.textContent += text[i];
      await wait(26);
    }
  }

  async function eraseText(text) {
    for (let len = text.length; len >= 0; len--) {
      typedEl.textContent = text.slice(0, len);
      await wait(12);
    }
  }

  async function runLoop() {
    let i = 0;
    while (true) {
      if (document.hidden) { await wait(400); continue; }
      const seq = sequences[i % sequences.length];
      outputEl.innerHTML = '';
      thinkingEl.style.display = 'none';

      await typeText(seq.prompt);
      thinkingEl.style.display = 'flex';
      await wait(650);
      thinkingEl.style.display = 'none';

      outputEl.innerHTML = seq.chips.map(c => `<span class="console-chip">${c}</span>`).join('');
      outputEl.querySelectorAll('.console-chip').forEach((chip, idx) => {
        setTimeout(() => chip.classList.add('show'), idx * 130);
      });

      await wait(2600);
      outputEl.querySelectorAll('.console-chip').forEach(chip => chip.classList.remove('show'));
      await wait(300);
      await eraseText(seq.prompt);
      await wait(300);
      i++;
    }
  }
  runLoop();
})();

// ---------- Nav scroll state ----------
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// ---------- Mobile menu ----------
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
navToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mobileMenu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
          if (isActive && link.closest('.nav-links')) moveIndicator(link);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));
}
window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-links a.active');
  if (active) moveIndicator(active);
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Project card rendering ----------
function hasRealImage(project) {
  return Boolean(project.image);
}

function projectFrameArt(project) {
  const initial = project.title.charAt(0);
  const body = hasRealImage(project)
    ? `<img src="${project.image}" alt="${project.title} screenshot" loading="lazy" style="position:absolute;top:30px;left:0;right:0;bottom:0;width:100%;height:calc(100% - 30px);object-fit:cover;object-position:top;" />`
    : `<div class="art"><span class="mark">${initial}</span></div>`;
  return `
    <div class="project-frame ${project.frameType === 'phone' ? 'phone' : ''}">
      <div class="chrome"><span></span><span></span><span></span></div>
      ${body}
    </div>`;
}

function projectActions(project) {
  const parts = [];
  if (project.liveUrl) {
    parts.push(`<a class="primary-action" href="${project.liveUrl}" target="_blank" rel="noopener">Live Demo ↗</a>`);
  }
  parts.push(`<a href="project.html?slug=${project.slug}">View Case Study →</a>`);
  parts.push(`<a href="${project.githubUrl}" target="_blank" rel="noopener">GitHub</a>`);
  return `<div class="project-actions">${parts.join('')}</div>`;
}

function renderProjectCard(project, index) {
  return `
    <article class="project-card reveal" style="--stagger-delay: ${Math.min(index * 0.1, 0.4)}s">
      ${projectFrameArt(project)}
      <div class="project-body">
        <div class="project-meta">
          <span class="cat">${project.eyebrow}</span>
          <span class="year">${project.year}</span>
        </div>
        <h3>${project.title}</h3>
        <p class="desc">${project.shortDescription}</p>
        <div class="project-tags">
          ${project.technologies.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${projectActions(project)}
      </div>
    </article>`;
}

const featuredWrap = document.querySelector('#featured-projects');
const moreWrap = document.querySelector('#more-projects');
if (featuredWrap && typeof PROJECTS !== 'undefined') {
  const featured = PROJECTS.filter(p => p.featured);
  const rest = PROJECTS.filter(p => !p.featured);
  featuredWrap.innerHTML = featured.map((p, i) => renderProjectCard(p, i)).join('');
  if (moreWrap) moreWrap.innerHTML = rest.map((p, i) => renderProjectCard(p, i)).join('');

  // Re-observe newly injected reveal elements
  document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));
  // Re-bind magnetic effect to newly injected action links styled as buttons (skip — actions are text links, not .btn)
}

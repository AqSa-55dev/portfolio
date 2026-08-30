const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');
const project = PROJECTS.find(p => p.slug === slug);
const root = document.querySelector('#case-study-root');

function isRealUrl(src) {
  return Boolean(src);
}

function shotMarkup(src) {
  return isRealUrl(src)
    ? `<img src="${src}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />`
    : `<div class="placeholder-shot">Screenshot coming soon</div>`;
}

if (!project) {
  root.innerHTML = `
    <section class="case-hero container-narrow" style="text-align:center; padding-top:6rem;">
      <p class="eyebrow" style="justify-content:center;">NOT FOUND</p>
      <h1 style="margin-top:1rem;">This case study doesn't exist.</h1>
      <a class="btn btn-primary" style="margin-top:2rem;" href="index.html#work">Back to projects</a>
    </section>`;
} else {
  document.title = `${project.title} — Aqsa Basheer`;

  const optionalSection = (title, content) => content ? `<h2>${title}</h2>${content}` : '';
  const listSection = (title, items) => items && items.length
    ? `<h2>${title}</h2><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : '';

  root.innerHTML = `
    <section class="case-hero container">
      <a class="back-link" href="index.html#work">← Back to projects</a>
      <p class="eyebrow">${project.eyebrow}</p>
      <h1>${project.title}</h1>
      <p class="desc">${project.description}</p>
      <div class="case-meta-row">
        <span class="tag">${project.category}</span>
        <span class="tag">${project.year}</span>
        <span class="tag">${project.role}</span>
      </div>
      <div class="case-actions">
        ${project.liveUrl ? `<a class="btn btn-primary" href="${project.liveUrl}" target="_blank" rel="noopener">View Live Demo ↗</a>` : ''}
        <a class="btn btn-ghost" href="${project.githubUrl}" target="_blank" rel="noopener">View on GitHub</a>
      </div>
      <div class="case-cover">${shotMarkup(project.image)}</div>
    </section>

    <section class="container">
      <div class="case-grid">
        <aside class="case-sidebar">
          <div>
            <div class="field-label">Role</div>
            <div class="field-value">${project.role}</div>
          </div>
          <div>
            <div class="field-label">Year</div>
            <div class="field-value">${project.year}</div>
          </div>
          <div>
            <div class="field-label">Stack</div>
            <div class="project-tags">${project.technologies.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
        </aside>
        <div class="case-content">
          ${optionalSection('Problem', project.problem ? `<p>${project.problem}</p>` : '')}
          ${optionalSection('Approach', project.solution ? `<p>${project.solution}</p>` : '')}
          ${listSection('Key Features', project.features)}
          ${optionalSection('Architecture', project.architectureHighlight ? `<p>${project.architectureHighlight}</p>` : '')}
          ${listSection('Security', project.security)}
          ${listSection('Accessibility', project.accessibility)}
          ${optionalSection('Outcome', project.outcome ? `<p>${project.outcome}</p>` : '')}
          ${project.screenshots && project.screenshots.length ? `
            <h2>Screenshots</h2>
            <div class="case-shots">
              ${project.screenshots.map(s => `<div class="shot">${shotMarkup(s)}</div>`).join('')}
            </div>` : ''}
        </div>
      </div>
    </section>`;

  // Fade in the injected sections
  const caseRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        caseRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.case-hero, .case-grid > *').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--stagger-delay', `${Math.min(i * 0.08, 0.3)}s`);
    caseRevealObserver.observe(el);
  });
}

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const hero = document.querySelector('.hero');
const heroAmbient = document.querySelector('.hero__ambient');
const workspace = document.querySelector('.workspace');
const workspaceScene = document.querySelector('.workspace__scene');
const workspaceSurfaces = document.querySelectorAll('.interactive-surface');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const configuredApiBaseUrl = document.querySelector('meta[name="portfolio-api-base-url"]')?.content.trim();
const isLocalFrontend = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  && window.location.port !== '5000';
const apiBaseUrl = (configuredApiBaseUrl || (isLocalFrontend
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : '')).replace(/\/+$/, '');
const apiUrl = (path) => `${apiBaseUrl}${path}`;

function closeNavigation() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });
}

const navigationLinks = Array.from(document.querySelectorAll('.site-nav__link'));
const pageSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const siteHeader = document.querySelector('.site-header');

if (navigationLinks.length && pageSections.length) {
  let navigationFrame = 0;

  const updateActiveNavigation = () => {
    navigationFrame = 0;
    const activeLine = (siteHeader?.getBoundingClientRect().bottom || 0) + 48;
    let currentSection = pageSections[0];

    pageSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activeLine) currentSection = section;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      currentSection = pageSections[pageSections.length - 1];
    }

    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${currentSection.id}`;
      link.classList.toggle('site-nav__link--active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const scheduleNavigationUpdate = () => {
    if (!navigationFrame) navigationFrame = window.requestAnimationFrame(updateActiveNavigation);
  };

  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('hashchange', scheduleNavigationUpdate);
  window.addEventListener('load', scheduleNavigationUpdate, { once: true });
  scheduleNavigationUpdate();
}

if (hero && heroAmbient && workspace && workspaceScene && finePointer.matches && !reduceMotion.matches) {
  hero.addEventListener('pointermove', (event) => {
    const heroBounds = hero.getBoundingClientRect();
    heroAmbient.style.left = `${event.clientX - heroBounds.left}px`;
    heroAmbient.style.top = `${event.clientY - heroBounds.top}px`;

    const workspaceBounds = workspace.getBoundingClientRect();
    const offsetX = ((event.clientX - workspaceBounds.left) / workspaceBounds.width - 0.5) * 2;
    const offsetY = ((event.clientY - workspaceBounds.top) / workspaceBounds.height - 0.5) * 2;
    workspaceScene.style.setProperty('--scene-x', `${-offsetX * 6}px`);
    workspaceScene.style.setProperty('--scene-y', `${-offsetY * 6}px`);

    workspaceSurfaces.forEach((surface) => {
      const bounds = surface.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      surface.style.setProperty('--tilt-x', `${-y * 2.1}deg`);
      surface.style.setProperty('--tilt-y', `${x * 2.1}deg`);
    });
  });

  workspace.addEventListener('pointerleave', () => {
    workspaceScene.style.setProperty('--scene-x', '0px');
    workspaceScene.style.setProperty('--scene-y', '0px');
    workspaceSurfaces.forEach((surface) => {
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
    });
  });
}

const editorTabs = Array.from(document.querySelectorAll('[data-editor-tab]'));
const editorCode = document.querySelector('#editor-code');
const editorCodeLines = {
  developer: [
    [['const ', 'syntax-purple'], ['developer', 'syntax-blue'], [' = ', 'syntax-muted'], ['{', 'syntax-yellow']],
    [['name', 'syntax-key'], [': ', 'syntax-muted'], ['"Yash Kumar"', 'syntax-green'], [',', 'syntax-muted']],
    [['role', 'syntax-key'], [': ', 'syntax-muted'], ['"Software Developer"', 'syntax-green'], [',', 'syntax-muted']],
    [['focus', 'syntax-key'], [': ', 'syntax-muted'], ['[', 'syntax-yellow']],
    [['  "Full Stack"', 'syntax-green'], [',', 'syntax-muted']],
    [['  "AI / ML"', 'syntax-green']],
    [[']', 'syntax-yellow']],
    [['};', 'syntax-yellow']],
    [['developer', 'syntax-blue'], ['.build()', 'syntax-cyan'], [';', 'syntax-muted']]
  ],
  projects: [
    [['const ', 'syntax-purple'], ['projects', 'syntax-blue'], [' = ', 'syntax-muted'], ['[', 'syntax-yellow']],
    [['  "AI Email Copilot"', 'syntax-green'], [',', 'syntax-muted']],
    [['  "Hospital Management System"', 'syntax-green']],
    [['];', 'syntax-yellow']]
  ],
  stack: [
    [['const ', 'syntax-purple'], ['stack', 'syntax-blue'], [' = ', 'syntax-muted'], ['[', 'syntax-yellow']],
    [['  "HTML"', 'syntax-green'], [', ', 'syntax-muted'], ['"CSS"', 'syntax-green'], [',', 'syntax-muted']],
    [['  "JavaScript"', 'syntax-green'], [', ', 'syntax-muted'], ['"Node.js"', 'syntax-green'], [',', 'syntax-muted']],
    [['  "Express.js"', 'syntax-green'], [', ', 'syntax-muted'], ['"MongoDB"', 'syntax-green']],
    [['];', 'syntax-yellow']]
  ]
};

function selectEditorTab(tab) {
  const fileLines = editorCodeLines[tab.dataset.editorTab];
  if (!fileLines || !editorCode) return;
  editorTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  editorCode.setAttribute('aria-labelledby', tab.id);
  editorCode.setAttribute('aria-label', `${tab.textContent.trim()} verified code preview`);
  const renderLines = () => fileLines.map((segments, index) => {
    const line = document.createElement('div');
    const number = document.createElement('span');
    number.className = 'line-number';
    number.textContent = String(index + 1).padStart(2, '0');
    line.append(number);
    segments.forEach(([text, className]) => {
      const segment = document.createElement('span');
      if (className) segment.className = className;
      segment.textContent = text;
      line.append(segment);
    });
    if (index === fileLines.length - 1) {
      const cursor = document.createElement('span');
      cursor.className = 'editor__cursor';
      cursor.setAttribute('aria-hidden', 'true');
      line.append(cursor);
    }
    return line;
  });
  editorCode.classList.add('is-switching');
  window.requestAnimationFrame(() => {
    editorCode.replaceChildren(...renderLines());
    editorCode.classList.remove('is-switching');
  });
}

if (editorTabs.length && editorCode) {
  editorTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectEditorTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % editorTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + editorTabs.length) % editorTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = editorTabs.length - 1;
      else return;
      event.preventDefault();
      editorTabs[nextIndex].focus();
      selectEditorTab(editorTabs[nextIndex]);
    });
  });
  selectEditorTab(editorTabs[0]);
}

const scrollProgressBar = document.querySelector('#scroll-progress-bar');
let scrollProgressFrame = 0;
function updateScrollProgress() {
  scrollProgressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  scrollProgressBar?.style.setProperty('transform', `scaleX(${progress})`);
}
function scheduleScrollProgress() {
  if (scrollProgressFrame) return;
  scrollProgressFrame = window.requestAnimationFrame(updateScrollProgress);
}
window.addEventListener('scroll', scheduleScrollProgress, { passive: true });
window.addEventListener('resize', scheduleScrollProgress, { passive: true });
updateScrollProgress();

if (finePointer.matches && !reduceMotion.matches) {
  let ambientFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (ambientFrame) return;
    ambientFrame = window.requestAnimationFrame(() => {
      ambientFrame = 0;
      document.body.style.setProperty('--ambient-x', `${pointerX}px`);
      document.body.style.setProperty('--ambient-y', `${pointerY}px`);
      document.body.classList.add('pointer-ambient-visible');
      const card = document.elementFromPoint(pointerX, pointerY)?.closest('.interactive-glow');
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${pointerX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${pointerY - bounds.top}px`);
    });
  }, { passive: true });
}

const aboutSection = document.querySelector('.about');
const journeyItems = document.querySelectorAll('.journey__item');
const journeyTriggers = document.querySelectorAll('.journey__trigger');

journeyTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const selectedItem = trigger.closest('.journey__item');
    const shouldExpand = trigger.getAttribute('aria-expanded') !== 'true';

    journeyTriggers.forEach((itemTrigger) => {
      const item = itemTrigger.closest('.journey__item');
      const panelId = itemTrigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const isSelected = item === selectedItem && shouldExpand;

      itemTrigger.setAttribute('aria-expanded', String(isSelected));
      item?.classList.toggle('is-expanded', isSelected);
      if (panel) panel.hidden = !isSelected;
    });
  });
});

if (aboutSection && journeyItems.length && !reduceMotion.matches) {
  aboutSection.classList.add('about--motion-ready');

  if ('IntersectionObserver' in window) {
    const journeyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    journeyItems.forEach((item) => journeyObserver.observe(item));
  } else {
    journeyItems.forEach((item) => item.classList.add('is-visible'));
  }
}

const skillsSection = document.querySelector('.skills');
const skillCategories = Array.from(document.querySelectorAll('.skills-category'));
const skillsPanel = document.querySelector('#skills-panel');
const skillsDisplayIndex = document.querySelector('#skills-display-index');
const skillsDisplayTitle = document.querySelector('#skills-display-title');
const skillsDisplayDescription = document.querySelector('#skills-display-description');
const skillsList = document.querySelector('#skills-list');
const skillsSkillDetail = document.querySelector('#skills-skill-detail');

const skillSets = {
  programming: {
    number: '01',
    title: 'PROGRAMMING',
    description: 'Programming languages in my toolkit.',
    skills: ['Python', 'C', 'C++', 'JavaScript']
  },
  web: {
    number: '02',
    title: 'WEB & BACKEND',
    description: 'Web technologies and backend tools in my toolkit.',
    skills: ['HTML', 'CSS', 'Node.js', 'Express.js', 'REST APIs', 'JWT', 'Mongoose']
  },
  database: {
    number: '03',
    title: 'DATABASE',
    description: 'Relational and document databases.',
    skills: ['SQL', 'MongoDB']
  },
  core: {
    number: '04',
    title: 'CORE CS',
    description: 'Foundational topics in computer science.',
    skills: ['DSA', 'DBMS', 'Operating Systems', 'OOP', 'System Design']
  },
  tools: {
    number: '05',
    title: 'TOOLS & DEPLOYMENT',
    description: 'Tools used across my development workflow.',
    skills: ['Git', 'GitHub', 'Postman', 'Render']
  }
};

const skillCategoryDescriptions = {
  programming: 'Included in my verified programming skills.',
  web: 'Included in my verified web and backend skills.',
  database: 'Included in my verified database skills.',
  core: 'Included in my verified computer science fundamentals.',
  tools: 'Included in my verified tools and deployment skills.'
};

const specificSkillDescriptions = {
  'HTML': 'USED IN: Hospital Management System.',
  'CSS': 'USED IN: Hospital Management System.',
  'JavaScript': 'USED IN: Hospital Management System.',
  'Node.js': 'USED IN: AI Email Copilot · Hospital Management System · Jindal Stainless internship.',
  'Express.js': 'USED IN: AI Email Copilot · Hospital Management System · Jindal Stainless internship.',
  'REST APIs': 'USED IN: Jindal Stainless internship.',
  'JWT': 'USED IN: Hospital Management System.',
  'Mongoose': 'USED IN: Hospital Management System · Jindal Stainless internship.',
  'MongoDB': 'USED IN: AI Email Copilot · Hospital Management System · Jindal Stainless internship.',
  'Git': 'USED IN: Jindal Stainless internship.',
  'GitHub': 'USED IN: Jindal Stainless internship.',
  'Postman': 'USED IN: Jindal Stainless internship.',
  'Render': 'USED IN: Jindal Stainless internship.'
};

function describeSkill(skillButton) {
  const activeCategory = skillCategories.find((button) => button.getAttribute('aria-selected') === 'true')?.dataset.category;
  const description = specificSkillDescriptions[skillButton.textContent.trim()]
    || skillCategoryDescriptions[activeCategory]
    || 'Included in my verified skills.';
  if (skillsSkillDetail) skillsSkillDetail.textContent = `${skillButton.textContent.trim()} — ${description}`;
}

function selectSkillCategory(categoryButton) {
  const skillSet = skillSets[categoryButton.dataset.category];
  if (!skillSet || !skillsPanel || !skillsDisplayIndex || !skillsDisplayTitle || !skillsDisplayDescription || !skillsList) return;

  skillCategories.forEach((button) => {
    const isActive = button === categoryButton;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  skillsPanel.classList.remove('is-updating');
  void skillsPanel.offsetWidth;
  skillsDisplayIndex.textContent = skillSet.number;
  skillsDisplayTitle.textContent = skillSet.title;
  skillsDisplayDescription.textContent = skillSet.description;
  skillsPanel.setAttribute('aria-labelledby', categoryButton.id);
  skillsList.setAttribute('aria-label', `${skillSet.title} skills`);
  skillsList.replaceChildren(...skillSet.skills.map((skill) => {
    const item = document.createElement('li');
    const skillButton = document.createElement('button');
    skillButton.className = 'skill-tile';
    skillButton.type = 'button';
    skillButton.textContent = skill;
    skillButton.setAttribute('aria-describedby', 'skills-skill-detail');
    item.append(skillButton);
    return item;
  }));
  if (skillsSkillDetail) skillsSkillDetail.textContent = 'Focus or hover over a skill to see resume-backed context.';
  skillsPanel.classList.add('is-updating');
}

if (skillCategories.length && skillsPanel) {
  skillCategories.forEach((button, index) => {
    button.addEventListener('click', () => selectSkillCategory(button));
    button.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % skillCategories.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + skillCategories.length) % skillCategories.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = skillCategories.length - 1;
      else return;

      event.preventDefault();
      skillCategories[nextIndex].focus();
      selectSkillCategory(skillCategories[nextIndex]);
    });
  });

  skillsList?.addEventListener('pointerover', (event) => {
    const skillButton = event.target.closest('.skill-tile');
    if (skillButton && skillsList.contains(skillButton)) describeSkill(skillButton);
  });
  skillsList?.addEventListener('focusin', (event) => {
    const skillButton = event.target.closest('.skill-tile');
    if (skillButton && skillsList.contains(skillButton)) describeSkill(skillButton);
  });
}

if (skillsSection && !reduceMotion.matches) {
  skillsSection.classList.add('skills--motion-ready');

  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      skillsSection.classList.add('skills--visible');
      observer.disconnect();
    }, { threshold: 0.12 });
    skillsObserver.observe(skillsSection);
  } else {
    skillsSection.classList.add('skills--visible');
  }
}

const experienceSection = document.querySelector('.experience');
const experienceCard = document.querySelector('.experience-card');
const experienceDetailsToggle = document.querySelector('.experience-card__toggle');
const experienceDetails = document.querySelector('#experience-details');

if (experienceDetailsToggle && experienceDetails) {
  experienceDetailsToggle.addEventListener('click', () => {
    const isExpanded = experienceDetailsToggle.getAttribute('aria-expanded') === 'true';
    experienceDetailsToggle.setAttribute('aria-expanded', String(!isExpanded));
    experienceDetails.hidden = isExpanded;
    experienceDetails.classList.toggle('is-expanded', !isExpanded);
    experienceDetailsToggle.querySelector('span')?.replaceChildren(isExpanded ? 'VIEW DETAILS' : 'HIDE DETAILS');
  });
}

if (experienceSection && experienceCard && !reduceMotion.matches) {
  experienceSection.classList.add('experience--motion-ready');

  if ('IntersectionObserver' in window) {
    const experienceObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      experienceSection.classList.add('experience--visible');
      observer.disconnect();
    }, { threshold: 0.12 });
    experienceObserver.observe(experienceCard);
  } else {
    experienceSection.classList.add('experience--visible');
  }
}

const projectsSection = document.querySelector('.projects');
const projectDialog = document.querySelector('#project-modal');
const projectModalTitle = document.querySelector('#project-modal-title');
const projectModalDescription = document.querySelector('#project-modal-description');
const projectModalKicker = document.querySelector('#project-modal-kicker');
const projectModalContent = document.querySelector('#project-modal-content');
const projectOpeners = document.querySelectorAll('[data-project-open]');
const projectCloseButton = document.querySelector('[data-project-close]');

const projectDetails = {
  email: {
    number: '01',
    name: 'AI Email Copilot',
    description: 'AI-powered email workflows connected to Gmail.',
    overview: 'An AI-powered Gmail assistant for email summarization, reply drafting, and action-item extraction.',
    scope: 'Connects Gmail read/send access with six Gemini-powered workflows for working with email.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Gmail API', 'Gemini API'],
    engineering: [
      'Modular backend routes, controllers, and services for authentication, Gmail integration, and AI workflows',
      'Google OAuth 2.0 with Passport and session authentication',
      'Gmail read and send scopes',
      'Access and refresh tokens persisted in MongoDB, with token refresh handling',
      'Secure cookies',
      'Reusable prompts for AI workflows',
      'Input validation and API error handling'
    ],
    features: ['Email Summarization', 'Reply Drafting', 'Action-Item Extraction', 'Translation', 'Tone Improvement', 'Email Composition'],
    flow: ['Gmail API', 'OAuth 2.0', 'MongoDB tokens', 'Gemini workflows']
  },
  hospital: {
    number: '02',
    name: 'Hospital Management System',
    description: 'Full-stack hospital management platform.',
    overview: 'A full-stack hospital system for managing patients, doctors, appointments, and time slots.',
    scope: 'Includes patient, doctor, admin, appointment, and slot management.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    engineering: [
      'JWT authentication, role-based access control, and protected routes',
      'bcryptjs password hashing',
      'Input validation',
      'Multer and Cloudinary'
    ],
    features: [
      'Patient Management', 'Doctor Management', 'Admin Management', 'Appointment Management', 'Slot Management',
      'Automated 30-minute slot generation',
      'Availability and slot blocking',
      'MongoDB ObjectId references and indexed queries',
      'Unique compound index to prevent duplicate slots'
    ],
    flow: ['Patients', 'API', 'MongoDB', 'Appointments', 'Slots']
  }
};

function createProjectDetailBlock(title, items, className = '') {
  const section = document.createElement('section');
  section.className = `project-modal__block ${className}`.trim();

  const heading = document.createElement('h3');
  heading.textContent = title;
  section.append(heading);

  const list = document.createElement('ul');
  items.forEach((itemText) => {
    const item = document.createElement('li');
    item.textContent = itemText;
    list.append(item);
  });
  section.append(list);
  return section;
}

function createProjectOverviewBlock(project) {
  const section = document.createElement('section');
  section.className = 'project-modal__block project-modal__overview';

  const heading = document.createElement('h3');
  heading.textContent = '01 / PROJECT PURPOSE';
  const copy = document.createElement('p');
  copy.textContent = project.overview;
  section.append(heading, copy);
  return section;
}

function createProjectScopeBlock(project) {
  const section = document.createElement('section');
  section.className = 'project-modal__block project-modal__scope';

  const heading = document.createElement('h3');
  heading.textContent = '02 / PROJECT SCOPE';
  const copy = document.createElement('p');
  copy.textContent = project.scope;
  section.append(heading, copy);
  return section;
}

function createProjectFlowBlock(project) {
  const section = document.createElement('section');
  section.className = 'project-modal__block project-modal__flow';
  const heading = document.createElement('h3');
  heading.textContent = '06 / CONCEPTUAL FLOW';
  const list = document.createElement('ul');
  list.className = 'project-modal__flow-list';
  project.flow.forEach((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    list.append(item);
  });
  section.append(heading, list);
  return section;
}

function createProjectStackBlock(project) {
  const section = document.createElement('section');
  section.className = 'project-modal__block';
  const heading = document.createElement('h3');
  heading.textContent = '05 / TECH STACK';
  const list = document.createElement('ul');
  list.className = 'project-modal__tech-list';
  project.technologies.forEach((technology) => {
    const tag = document.createElement('li');
    tag.textContent = technology;
    list.append(tag);
  });
  section.append(heading, list);
  return section;
}

function renderProjectDetails(project) {
  projectModalTitle.textContent = project.name;
  projectModalDescription.textContent = project.description;
  projectModalKicker.textContent = `PROJECT ${project.number} / ${project.name.toUpperCase()}`;
  projectModalContent.replaceChildren();

  const blocks = [
    createProjectOverviewBlock(project),
    createProjectScopeBlock(project),
    createProjectDetailBlock('03 / ENGINEERING HIGHLIGHTS', project.engineering, 'project-modal__engineering'),
    createProjectDetailBlock('04 / KEY FEATURES', project.features, 'project-modal__features'),
    createProjectStackBlock(project),
    createProjectFlowBlock(project)
  ];
  projectModalContent.append(...blocks);
}

let projectCloseTimer;
let lastProjectOpener = null;

function closeProjectDialog() {
  if (!projectDialog?.open || projectDialog.classList.contains('is-closing')) return;
  if (reduceMotion.matches) {
    projectDialog.close();
    return;
  }

  projectDialog.classList.add('is-closing');
  projectCloseTimer = window.setTimeout(() => projectDialog.close(), 260);
}

if (projectDialog && projectModalTitle && projectModalDescription && projectModalKicker && projectModalContent) {
  projectOpeners.forEach((button) => {
    button.addEventListener('click', () => {
      const project = projectDetails[button.dataset.projectOpen];
      if (!project) return;
      lastProjectOpener = button;
      renderProjectDetails(project);
      projectDialog.classList.remove('is-closing');
      projectDialog.showModal();
      document.documentElement?.classList.add('project-modal-open');
      document.body.classList.add('project-modal-open');
    });
  });

  projectCloseButton?.addEventListener('click', closeProjectDialog);
  projectDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeProjectDialog();
  });
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) closeProjectDialog();
  });
  projectDialog.addEventListener('animationend', (event) => {
    if (event.target !== projectDialog || event.animationName !== 'project-modal-out') return;
    window.clearTimeout(projectCloseTimer);
    projectDialog.close();
  });
  projectDialog.addEventListener('close', () => {
    window.clearTimeout(projectCloseTimer);
    projectDialog.classList.remove('is-closing');
    document.documentElement?.classList.remove('project-modal-open');
    document.body.classList.remove('project-modal-open');
    lastProjectOpener?.focus();
    lastProjectOpener = null;
  });
}

const resumeViewer = document.querySelector('#resume-viewer');
const resumeViewerOpen = document.querySelector('#resume-viewer-open');
const resumeViewerClose = document.querySelector('[data-resume-close]');
let lastResumeViewerOpener = null;

if (resumeViewer && resumeViewerOpen && resumeViewerClose) {
  resumeViewerOpen.addEventListener('click', () => {
    lastResumeViewerOpener = resumeViewerOpen;
    resumeViewer.showModal();
    document.documentElement.classList.add('resume-viewer-open');
    document.body.classList.add('resume-viewer-open');
  });

  resumeViewerClose.addEventListener('click', () => resumeViewer.close());
  resumeViewer.addEventListener('click', (event) => {
    if (event.target === resumeViewer) resumeViewer.close();
  });
  resumeViewer.addEventListener('close', () => {
    document.documentElement.classList.remove('resume-viewer-open');
    document.body.classList.remove('resume-viewer-open');
    lastResumeViewerOpener?.focus();
    lastResumeViewerOpener = null;
  });
}

if (projectsSection && !reduceMotion.matches) {
  projectsSection.classList.add('projects--motion-ready');

  if ('IntersectionObserver' in window) {
    const projectsObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      projectsSection.classList.add('projects--visible');
      observer.disconnect();
    }, { threshold: 0.08 });
    projectsObserver.observe(projectsSection);
  } else {
    projectsSection.classList.add('projects--visible');
  }
}

const nowSection = document.querySelector('.now-section');
if (nowSection && !reduceMotion.matches) {
  nowSection.classList.add('now-section--motion-ready');
  if ('IntersectionObserver' in window) {
    const nowObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      nowSection.classList.add('now-section--visible');
      observer.disconnect();
    }, { threshold: 0.1 });
    nowObserver.observe(nowSection);
  } else {
    nowSection.classList.add('now-section--visible');
  }
}

const workflowSteps = Array.from(document.querySelectorAll('[data-workflow-step]'));
const workflowPanel = document.querySelector('#workflow-panel');
const workflowPanelIndex = document.querySelector('#workflow-panel-index');
const workflowPanelTitle = document.querySelector('#workflow-panel-title');
const workflowPanelDescription = document.querySelector('#workflow-panel-description');
const workflowPanelList = document.querySelector('#workflow-panel-list');
const workflowDetails = {
  understand: {
    index: '01', title: 'UNDERSTAND',
    description: 'Clarify the problem, identify requirements, and define the expected outcome.',
    points: ['Understand the problem', 'Identify requirements', 'Define the expected outcome']
  },
  design: {
    index: '02', title: 'DESIGN',
    description: 'Shape the application structure before implementation.',
    points: ['API structure', 'Database models', 'Application architecture', 'Authentication flow']
  },
  build: {
    index: '03', title: 'BUILD',
    description: 'Build the interface and backend using the web stack used across the portfolio.',
    points: ['HTML / CSS / JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs']
  },
  test: {
    index: '04', title: 'TEST',
    description: 'Check API behavior, validation, edge cases, and error handling.',
    points: ['API testing with Postman', 'Input validation', 'Edge cases', 'API error handling']
  },
  deploy: {
    index: '05', title: 'DEPLOY',
    description: 'Use the project workflow and deployment tools present in the internship experience.',
    points: ['Git / GitHub', 'MongoDB Atlas', 'Render']
  }
};

function selectWorkflowStep(button) {
  const detail = workflowDetails[button.dataset.workflowStep];
  if (!detail || !workflowPanel || !workflowPanelIndex || !workflowPanelTitle || !workflowPanelDescription || !workflowPanelList) return;
  workflowSteps.forEach((step) => {
    const selected = step === button;
    step.classList.toggle('is-active', selected);
    step.setAttribute('aria-selected', String(selected));
    step.tabIndex = selected ? 0 : -1;
  });
  workflowPanelIndex.textContent = detail.index;
  workflowPanelTitle.textContent = detail.title;
  workflowPanelDescription.textContent = detail.description;
  workflowPanel.setAttribute('aria-labelledby', button.id);
  workflowPanelList.setAttribute('aria-label', `${detail.title.toLowerCase()} step details`);
  workflowPanelList.replaceChildren(...detail.points.map((point) => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  }));
  workflowPanel.classList.remove('is-updating');
  void workflowPanel.offsetWidth;
  workflowPanel.classList.add('is-updating');
}

if (workflowSteps.length && workflowPanel) {
  workflowSteps.forEach((button, index) => {
    button.addEventListener('click', () => selectWorkflowStep(button));
    button.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % workflowSteps.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + workflowSteps.length) % workflowSteps.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = workflowSteps.length - 1;
      else return;
      event.preventDefault();
      workflowSteps[nextIndex].focus();
      selectWorkflowStep(workflowSteps[nextIndex]);
    });
  });
  selectWorkflowStep(workflowSteps[0]);
}

const aboutBuildCards = document.querySelectorAll('.about-build-card');
const scrollRevealItems = document.querySelectorAll('.about__intro, .about-build-card, .skills__heading, .experience__heading, .projects__heading, .project-visual, .how-build__heading, .workflow-step, .contact__heading');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  scrollRevealItems.forEach((item) => item.classList.add('scroll-reveal'));
  const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  scrollRevealItems.forEach((item) => scrollRevealObserver.observe(item));
  aboutBuildCards.forEach((card, index) => { card.style.setProperty('--reveal-order', index); });
  workflowSteps.forEach((step, index) => { step.style.setProperty('--reveal-order', index); });
} else {
  scrollRevealItems.forEach((item) => item.classList.add('is-visible'));
}

const contactSection = document.querySelector('.contact');
const contactForm = document.querySelector('#contact-form');
const contactSuccess = document.querySelector('#contact-success');
const contactSuccessMessage = document.querySelector('#contact-success-message');
const contactFormStatus = document.querySelector('#contact-form-status');
const contactSubmit = contactForm?.querySelector('button[type="submit"]');
const contactFields = [
  {
    input: document.querySelector('#contact-name'),
    error: document.querySelector('#contact-name-error'),
    wrapper: document.querySelector('[data-field="name"]'),
    message: 'Please enter your name.'
  },
  {
    input: document.querySelector('#contact-email'),
    error: document.querySelector('#contact-email-error'),
    wrapper: document.querySelector('[data-field="email"]'),
    requiredMessage: 'Please enter your email.',
    invalidMessage: 'Please enter a valid email.',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  {
    input: document.querySelector('#contact-message'),
    error: document.querySelector('#contact-message-error'),
    wrapper: document.querySelector('[data-field="message"]'),
    message: 'Please enter a message.'
  }
];

function validateContactField(field) {
  const value = field.input.value.trim();
  const isMissing = value.length === 0;
  const isValid = !isMissing && (!field.validate || field.validate(value));
  const message = isValid ? '' : (isMissing ? (field.requiredMessage || field.message) : (field.invalidMessage || field.message));

  field.input.setAttribute('aria-invalid', String(!isValid));
  field.error.textContent = message;
  field.error.classList.toggle('is-visible', !isValid);
  field.wrapper.classList.toggle('has-error', !isValid);
  return isValid;
}

if (contactForm && contactSuccess && contactFormStatus && contactSubmit && contactFields.every((field) => field.input && field.error && field.wrapper)) {
  let isContactSubmitting = false;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isContactSubmitting || contactSubmit.disabled) return;

    const validity = contactFields.map((field) => {
      field.wrapper.dataset.touched = 'true';
      return validateContactField(field);
    });

    const firstInvalidField = contactFields[validity.indexOf(false)];
    if (firstInvalidField) {
      firstInvalidField.input.focus();
      contactSuccess.hidden = true;
      contactFormStatus.textContent = '';
      return;
    }

    contactSuccess.hidden = true;
    contactFormStatus.textContent = '';
    contactFormStatus.dataset.state = 'loading';
    contactFormStatus.textContent = 'Sending your message…';
    isContactSubmitting = true;
    contactSubmit.disabled = true;
    contactSubmit.setAttribute('aria-busy', 'true');
    contactForm.setAttribute('aria-busy', 'true');
    const originalButtonMarkup = contactSubmit.innerHTML;
    contactSubmit.textContent = 'SENDING...';

    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit your message. Please try again.');
      }

      if (contactSuccessMessage) {
        contactSuccessMessage.textContent = result.notificationSent
          ? 'Your message was saved and an email notification was submitted.'
          : 'Your message was saved, but the email notification could not be sent. You can also email me directly at yashkumar9926@gmail.com.';
      }
      contactForm.reset();
      contactFields.forEach((field) => {
        delete field.wrapper.dataset.touched;
        field.input.setAttribute('aria-invalid', 'false');
        field.error.textContent = '';
        field.error.classList.remove('is-visible');
        field.wrapper.classList.remove('has-error');
      });
      contactSuccess.hidden = false;
      contactFormStatus.textContent = '';
      contactFormStatus.dataset.state = '';
    } catch (error) {
      contactFormStatus.dataset.state = 'error';
      contactFormStatus.textContent = error instanceof TypeError
        ? 'Could not connect to the server. Please try again later.'
        : error.message;
    } finally {
      isContactSubmitting = false;
      contactSubmit.disabled = false;
      contactSubmit.removeAttribute('aria-busy');
      contactForm.removeAttribute('aria-busy');
      contactSubmit.innerHTML = originalButtonMarkup;
    }
  });

  contactFields.forEach((field) => {
    field.input.addEventListener('input', () => {
      contactSuccess.hidden = true;
      contactFormStatus.textContent = '';
      contactFormStatus.dataset.state = '';
      if (field.wrapper.dataset.touched === 'true') validateContactField(field);
    });
  });
}

if (contactSection && !reduceMotion.matches) {
  contactSection.classList.add('contact--motion-ready');

  if ('IntersectionObserver' in window) {
    const contactObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      contactSection.classList.add('contact--visible');
      observer.disconnect();
    }, { threshold: 0.12 });
    contactObserver.observe(contactSection);
  } else {
    contactSection.classList.add('contact--visible');
  }
}

const assistantPanel = document.querySelector('#ai-assistant-panel');
const assistantToggle = document.querySelector('.ai-assistant__toggle');
const assistantClose = document.querySelector('.ai-assistant__close');
const assistantForm = document.querySelector('#ai-assistant-form');
const assistantInput = document.querySelector('#ai-assistant-input');
const assistantMessages = document.querySelector('#ai-assistant-messages');
const assistantSuggestions = document.querySelector('.ai-assistant__suggestions');
const assistantSendButton = assistantForm?.querySelector('button[type="submit"]');
const assistantProtectedContent = document.querySelectorAll('main > section[id] h1, main > section[id] h2, main > section[id] h3, main > section[id] p, main > section[id] a, main > section[id] button, main > section[id] input, main > section[id] textarea, main > section[id] li, main > section[id] pre, main > section[id] dl, main > section[id] dt, main > section[id] dd, main > section[id] [role="img"], main > aside.now-section h2, main > aside.now-section h3, main > aside.now-section p, main > aside.now-section strong, main > aside.now-section li, main > aside.now-section a, main > aside.now-section .now-signal__value, .site-footer a, .site-footer p');
let assistantOverlapFrame = 0;

function updateAssistantLauncherVisibility() {
  assistantOverlapFrame = 0;
  if (!assistantToggle || !assistantPanel || !assistantPanel.hidden || document.activeElement === assistantToggle || projectDialog?.open) {
    document.body.classList.remove('ai-toggle-obstructed');
    return;
  }

  const launcher = assistantToggle.getBoundingClientRect();
  let isObstructed = false;
  for (const element of assistantProtectedContent) {
    if (element.closest('[hidden]')) continue;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const content = element.getBoundingClientRect();
    if (content.width > 0 && content.height > 0
      && content.right > launcher.left && content.left < launcher.right
      && content.bottom > launcher.top && content.top < launcher.bottom) {
      isObstructed = true;
      break;
    }
  }

  document.body.classList.toggle('ai-toggle-obstructed', isObstructed);
}

function scheduleAssistantLauncherCheck() {
  if (assistantOverlapFrame) return;
  assistantOverlapFrame = window.requestAnimationFrame(updateAssistantLauncherVisibility);
}

if (assistantToggle && assistantPanel) {
  window.addEventListener('scroll', scheduleAssistantLauncherCheck, { passive: true });
  window.addEventListener('resize', scheduleAssistantLauncherCheck, { passive: true });
  assistantToggle.addEventListener('click', scheduleAssistantLauncherCheck);
  assistantToggle.addEventListener('focusout', scheduleAssistantLauncherCheck);
  window.addEventListener('load', scheduleAssistantLauncherCheck, { once: true });
  window.setTimeout(scheduleAssistantLauncherCheck, 700);

  const assistantPanelStateObserver = new MutationObserver(scheduleAssistantLauncherCheck);
  assistantPanelStateObserver.observe(assistantPanel, { attributes: true, attributeFilter: ['hidden'] });
  if (projectDialog) {
    const projectDialogStateObserver = new MutationObserver(scheduleAssistantLauncherCheck);
    projectDialogStateObserver.observe(projectDialog, { attributes: true, attributeFilter: ['open'] });
  }

  if ('IntersectionObserver' in window) {
    const assistantContentObserver = new IntersectionObserver(scheduleAssistantLauncherCheck);
    assistantProtectedContent.forEach((element) => assistantContentObserver.observe(element));
  }
}

if (assistantPanel && assistantToggle && assistantClose && assistantForm && assistantInput && assistantMessages && assistantSuggestions && assistantSendButton) {
  let isAssistantSending = false;

  const appendFormattedText = (container, text) => {
    const segments = text.split(/(\*\*.+?\*\*|__.+?__)/g);
    segments.forEach((segment) => {
      const isBold = (segment.startsWith('**') && segment.endsWith('**'))
        || (segment.startsWith('__') && segment.endsWith('__'));

      if (isBold && segment.length > 4) {
        const strong = document.createElement('strong');
        strong.textContent = segment.slice(2, -2);
        container.append(strong);
      } else {
        container.append(document.createTextNode(segment));
      }
    });
  };

  const renderAssistantMarkdown = (container, markdown) => {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    let paragraphLines = [];
    let listElement = null;
    let listType = null;

    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      const paragraph = document.createElement('p');
      paragraphLines.forEach((line, index) => {
        if (index > 0) paragraph.append(document.createElement('br'));
        appendFormattedText(paragraph, line);
      });
      container.append(paragraph);
      paragraphLines = [];
    };

    const closeList = () => {
      listElement = null;
      listType = null;
    };

    lines.forEach((line) => {
      const numberedItem = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
      const bulletItem = line.match(/^\s*[-*+]\s+(.+)$/);
      const item = numberedItem || bulletItem;

      if (!line.trim()) {
        flushParagraph();
        closeList();
        return;
      }

      if (item) {
        flushParagraph();
        const nextListType = numberedItem ? 'ol' : 'ul';
        if (!listElement || listType !== nextListType) {
          closeList();
          listElement = document.createElement(nextListType);
          if (numberedItem) listElement.start = Number(numberedItem[1]);
          listType = nextListType;
          container.append(listElement);
        }
        const listItem = document.createElement('li');
        appendFormattedText(listItem, numberedItem ? item[2] : item[1]);
        listElement.append(listItem);
        return;
      }

      closeList();
      paragraphLines.push(line);
    });

    flushParagraph();
  };

  const appendAssistantMessage = (text, kind) => {
    const message = document.createElement('div');
    message.className = `ai-assistant__message ai-assistant__message--${kind}`;
    if (kind === 'assistant') renderAssistantMarkdown(message, text);
    else message.textContent = text;
    assistantMessages.append(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
    return message;
  };

  const openAssistant = () => {
    assistantPanel.hidden = false;
    assistantToggle.setAttribute('aria-expanded', 'true');
    assistantToggle.setAttribute('aria-label', 'Close AI portfolio assistant');
    assistantInput.focus();
  };

  const closeAssistant = () => {
    assistantPanel.hidden = true;
    assistantToggle.setAttribute('aria-expanded', 'false');
    assistantToggle.setAttribute('aria-label', 'Open AI portfolio assistant');
    assistantToggle.focus();
  };

  assistantToggle.addEventListener('click', () => {
    if (assistantPanel.hidden) openAssistant();
    else closeAssistant();
  });

  assistantClose.addEventListener('click', closeAssistant);

  assistantPanel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAssistant();
    }
  });

  assistantSuggestions.addEventListener('click', (event) => {
    const suggestion = event.target.closest('button');
    if (!suggestion || isAssistantSending) return;
    assistantInput.value = suggestion.textContent.trim();
    assistantForm.requestSubmit();
  });

  assistantForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = assistantInput.value.trim();
    if (!message || isAssistantSending) return;

    isAssistantSending = true;
    assistantInput.value = '';
    assistantInput.disabled = true;
    assistantSendButton.disabled = true;
    assistantSuggestions.hidden = true;
    appendAssistantMessage(message, 'user');

    const typing = document.createElement('div');
    typing.className = 'ai-assistant__message ai-assistant__message--assistant ai-assistant__message--typing';
    typing.setAttribute('aria-label', 'Assistant is responding');
    typing.innerHTML = '<i></i><i></i><i></i>';
    assistantMessages.append(typing);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;

    try {
      const response = await fetch(apiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json().catch(() => ({}));
      typing.remove();

      if (!response.ok) {
        throw new Error(data.reply || 'AI assistant is temporarily unavailable.');
      }
      appendAssistantMessage(data.reply || 'AI assistant is temporarily unavailable.', 'assistant');
    } catch (_error) {
      typing.remove();
      const errorMessage = _error instanceof TypeError
        ? 'AI assistant is temporarily unavailable.'
        : (_error.message || 'AI assistant is temporarily unavailable.');
      appendAssistantMessage(errorMessage, 'assistant');
    } finally {
      isAssistantSending = false;
      assistantInput.disabled = false;
      assistantSendButton.disabled = false;
      assistantInput.focus();
    }
  });
}

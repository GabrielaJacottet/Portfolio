'use strict';
const root = document.documentElement;
root.classList.add('js');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

document.getElementById('year').textContent = new Date().getFullYear();
const yearsSince = (year) => new Date().getFullYear() - year;
const yearsInTech = yearsSince(2009);
document.querySelectorAll('[data-years-since]').forEach((el) => {
  el.textContent = yearsSince(Number(el.dataset.yearsSince));
});

/* ---------- Tema ---------- */
const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const palette = {};
const readPalette = () => {
  const styles = getComputedStyle(root);
  palette.dot = styles.getPropertyValue('--dot').trim();
  palette.dot2 = styles.getPropertyValue('--dot-2').trim();
};
const applyTheme = (theme) => {
  root.dataset.theme = theme;
  themeMeta.content = theme === 'light' ? '#f5f3ee' : '#0b0e13';
  themeToggle.setAttribute('aria-label', theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro');
  readPalette();
  document.dispatchEvent(new Event('themechange'));
};
applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch {}
});

/* ---------- Header, menu e navegação ativa ---------- */
const header = document.querySelector('.header');
const menuToggle = document.getElementById('menu-toggle');
const setMenu = (open) => {
  header.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
menuToggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const navLinks = [...document.querySelectorAll('.nav a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach((section) => sectionObserver.observe(section));
}

/* ---------- Revelar ao rolar ---------- */
const revealItems = document.querySelectorAll('[data-reveal]');
revealItems.forEach((item) => {
  const group = [...item.parentElement.children].filter((child) => child.hasAttribute('data-reveal'));
  // Os marcos da trajetória aparecem um a um com a rolagem, então não precisam de atraso em cascata.
  const delay = item.matches('.role') ? 0 : Math.min(group.indexOf(item) * 0.08, 0.4);
  item.style.setProperty('--d', `${delay}s`);
});
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* ---------- Brilho do cursor e cards com inclinação 3D ---------- */
const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (!finePointer.matches) return;
  root.classList.add('has-pointer');
  cursorGlow.style.setProperty('--cx', `${event.clientX}px`);
  cursorGlow.style.setProperty('--cy', `${event.clientY}px`);
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => root.classList.remove('has-pointer'));

document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (!finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
    if (reduceMotion.matches) return;
    const strength = Math.min(1, 420 / rect.width);
    card.classList.add('is-tilting');
    card.style.setProperty('--rx', `${(0.5 - y) * 9 * strength}deg`);
    card.style.setProperty('--ry', `${(x - 0.5) * 11 * strength}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-tilting');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

/* ---------- Canvas animados ---------- */
// Cuida do tamanho, do pixel ratio e de pausar fora da tela, em aba oculta ou com movimento reduzido.
const animateCanvas = (canvas, draw) => {
  const ctx = canvas.getContext('2d');
  const state = { ctx, width: 0, height: 0 };
  const start = performance.now();
  let frame = 0;
  let running = false;
  let visible = false;
  const render = (now = performance.now()) => draw(state, reduceMotion.matches ? 4 : (now - start) / 1000);
  const loop = (now) => {
    render(now);
    frame = requestAnimationFrame(loop);
  };
  const update = () => {
    const shouldRun = visible && !document.hidden && !reduceMotion.matches;
    if (shouldRun && !running) frame = requestAnimationFrame(loop);
    if (!shouldRun && running) cancelAnimationFrame(frame);
    running = shouldRun;
  };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    render();
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  resize();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }).observe(canvas);
  } else {
    visible = true;
    update();
  }
  document.addEventListener('visibilitychange', update);
  document.addEventListener('themechange', () => render());
  reduceMotion.addEventListener('change', () => {
    update();
    render();
  });
};

// Hero: uma superfície ondulada de pontos em perspectiva, que acompanha o cursor.
const hero = document.getElementById('inicio');
const heroScene = document.querySelector('.hero-scene');
const pointer = { x: 0.5, y: 0.5, active: false };
const camera = { x: 0, y: 0, rx: 0, ry: 0 };
hero.addEventListener('pointermove', (event) => {
  if (!finePointer.matches) return;
  const rect = hero.getBoundingClientRect();
  pointer.x = (event.clientX - rect.left) / rect.width;
  pointer.y = (event.clientY - rect.top) / rect.height;
  pointer.active = true;
});
hero.addEventListener('pointerleave', () => {
  pointer.active = false;
});

animateCanvas(document.getElementById('hero-field'), ({ ctx, width, height }, time) => {
  ctx.clearRect(0, 0, width, height);
  const targetX = pointer.active ? (pointer.x - 0.5) * 1.6 : Math.sin(time * 0.2) * 0.5;
  const targetY = pointer.active ? (pointer.y - 0.5) * 0.5 : 0;
  camera.x = lerp(camera.x, targetX, 0.05);
  camera.y = lerp(camera.y, targetY, 0.05);

  const focal = Math.max(width, height) * 0.62;
  const horizon = height * 0.5;
  ctx.fillStyle = `rgb(${palette.dot})`;
  for (let row = 0; row < 38; row += 1) {
    const z = 1.4 + row * 0.24;
    const fade = 1 - row / 38;
    for (let col = -36; col <= 36; col += 1) {
      const x = col * 0.22;
      const wave = Math.sin(x * 0.55 + time * 0.7) * 0.22
        + Math.cos(z * 0.8 - time * 0.55) * 0.2
        + Math.sin((x + z) * 0.35 + time * 0.4) * 0.14;
      const y = 1.15 + wave - camera.y;
      const sx = width / 2 + ((x - camera.x) / z) * focal;
      const sy = horizon + (y / z) * focal * 0.55;
      if (sx < -4 || sx > width + 4 || sy < -4 || sy > height + 4) continue;
      const size = clamp(3.2 / z, 0.6, 2.6);
      ctx.globalAlpha = clamp(fade * (0.45 + (0.3 - wave) * 1.1), 0.06, 0.75);
      ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
    }
  }
  ctx.globalAlpha = 1;

  if (reduceMotion.matches) {
    heroScene.style.transform = '';
    return;
  }
  const targetRx = pointer.active ? (0.5 - pointer.y) * 14 : Math.cos(time * 0.4) * 4;
  const targetRy = pointer.active ? (pointer.x - 0.5) * 22 : Math.sin(time * 0.5) * 8;
  camera.rx = lerp(camera.rx, targetRx, 0.06);
  camera.ry = lerp(camera.ry, targetRy, 0.06);
  heroScene.style.transform = `rotateX(${camera.rx.toFixed(2)}deg) rotateY(${camera.ry.toFixed(2)}deg)`;
});

// Contato: uma esfera de pontos girando, com alguns nós em destaque.
const SPHERE_POINTS = 720;
const spherePoints = Array.from({ length: SPHERE_POINTS }, (_, i) => {
  const y = 1 - (i / (SPHERE_POINTS - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = i * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius, node: i % 41 === 0 };
});
const contactField = document.getElementById('contact-field');
const spin = { x: 0, target: 0 };
document.getElementById('contato').addEventListener('pointermove', (event) => {
  spin.target = (event.clientX / window.innerWidth - 0.5) * 1.2;
});

animateCanvas(contactField, ({ ctx, width, height }, time) => {
  ctx.clearRect(0, 0, width, height);
  spin.x = lerp(spin.x, spin.target, 0.04);
  const rotation = time * 0.18 + spin.x;
  const tilt = 0.38;
  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const radius = Math.min(width, height) * 0.4;
  const cx = width / 2;
  const cy = height / 2;
  spherePoints.forEach((point) => {
    const x = point.x * cosR - point.z * sinR;
    const z1 = point.x * sinR + point.z * cosR;
    const y = point.y * cosT - z1 * sinT;
    const z = point.y * sinT + z1 * cosT;
    const scale = 2.6 / (2.6 - z);
    const depth = (z + 1) / 2;
    const size = (point.node ? 3.2 : 1.6) * scale;
    ctx.globalAlpha = point.node ? 0.35 + depth * 0.65 : 0.08 + depth * 0.55;
    ctx.fillStyle = `rgb(${point.node ? palette.dot2 : palette.dot})`;
    ctx.fillRect(cx + x * radius * scale - size / 2, cy + y * radius * scale - size / 2, size, size);
  });
  ctx.globalAlpha = 1;
});

/* ---------- Scroll: progresso, método e dispositivos ---------- */
const progress = document.querySelector('.progress');
const method = document.getElementById('metodo');
const methodSticky = method.querySelector('.method-sticky');
const stack = document.getElementById('method-stack');
const stepsList = document.getElementById('steps');
const steps = [...stepsList.children];
const layers = [...stack.children];
const devices = [...document.querySelectorAll('[data-device]')];
let activeStep = -1;
let methodIsSticky = true;

const setActiveStep = (index) => {
  if (index === activeStep) return;
  activeStep = index;
  steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
  layers.forEach((layer, i) => layer.classList.toggle('is-active', i === index));
};

const updateMethod = () => {
  const rect = method.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  const p = methodIsSticky && travel > 0
    ? clamp(-rect.top / travel, 0, 1)
    : clamp((window.innerHeight * 0.6 - rect.top) / rect.height, 0, 1);
  const spread = clamp(p / 0.18, 0, 1);
  stack.style.setProperty('--p', p.toFixed(3));
  stack.style.setProperty('--spread', (spread * spread * (3 - 2 * spread)).toFixed(3));
  stepsList.style.setProperty('--p', p.toFixed(3));
  setActiveStep(Math.min(steps.length - 1, Math.floor(p * steps.length)));
};

steps.forEach((step, i) => {
  step.addEventListener('click', () => {
    if (!methodIsSticky) return;
    const travel = method.offsetHeight - window.innerHeight;
    window.scrollTo({ top: method.offsetTop + travel * ((i + 0.5) / steps.length), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
});

const updateDevices = () => {
  devices.forEach((device) => {
    if (reduceMotion.matches) {
      device.style.setProperty('--tilt', '0deg');
      device.style.setProperty('--scale', '1');
      return;
    }
    const rect = device.getBoundingClientRect();
    const t = clamp((rect.top - window.innerHeight * 0.15) / (window.innerHeight * 0.65), 0, 1);
    device.style.setProperty('--tilt', `${(t * 18).toFixed(2)}deg`);
    device.style.setProperty('--scale', (1 - t * 0.07).toFixed(3));
  });
};

// A linha da trajetória enche conforme a rolagem e acende cada marco que alcança.
const timeline = document.getElementById('timeline');
const roles = [...timeline.children];
const updateTimeline = () => {
  const rect = timeline.getBoundingClientRect();
  const fill = clamp((window.innerHeight * 0.6 - rect.top) / rect.height, 0, 1);
  timeline.style.setProperty('--fill', fill.toFixed(3));
  roles.forEach((role) => role.classList.toggle('is-reached', role.offsetTop + 32 <= fill * rect.height));
};

let scrollFrame = 0;
const onScroll = () => {
  scrollFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
  header.classList.toggle('is-scrolled', window.scrollY > 10);
  updateTimeline();
  updateMethod();
  updateDevices();
};
const requestScrollUpdate = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(onScroll);
};
const onResize = () => {
  methodIsSticky = getComputedStyle(methodSticky).position === 'sticky';
  requestScrollUpdate();
};
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', onResize);
onResize();

/* ---------- Hora local ---------- */
const localTime = document.getElementById('local-time');
const timeFormat = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const tick = () => {
  localTime.textContent = timeFormat.format(new Date());
};
tick();
setInterval(tick, 1000);

/* ---------- Terminal ---------- */
const terminal = document.getElementById('terminal');
const terminalBody = document.getElementById('terminal-body');
const terminalForm = document.getElementById('terminal-form');
const terminalField = document.getElementById('terminal-field');
const email = document.querySelector('.email').href.replace('mailto:', '');
const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
const externalLink = (href, label) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;

const commands = {
  help: () => [
    'Comandos disponíveis:',
    '  <span class="t-hi">whoami</span>         quem sou eu',
    '  <span class="t-hi">skills</span>         o que trago para o time',
    '  <span class="t-hi">trajetoria</span>     de desenvolvedora a PO',
    '  <span class="t-hi">ia</span>             como uso inteligência artificial',
    '  <span class="t-hi">certificacoes</span>  certificação, formação e idiomas',
    '  <span class="t-hi">projetos</span>       o que já está no ar',
    '  <span class="t-hi">principios</span>     como eu trabalho',
    '  <span class="t-hi">contato</span>        vamos conversar',
    '  <span class="t-hi">tema</span>           alterna entre claro e escuro',
    '  <span class="t-hi">clear</span>          limpa o terminal',
  ],
  whoami: () => [
    '<span class="t-hi">Gabriela Jacottet</span>',
    `Product Owner Sênior · CSPO · ${yearsInTech} anos em tecnologia, do código ao produto.`,
    'Bacharel em Ciência da Computação · Teresópolis, RJ',
  ],
  skills: () => [
    '<span class="t-ok">produto</span>      discovery · roadmap · OKRs · priorização · BDD · Scrum · Kanban',
    '<span class="t-ok">apis</span>         REST · JSON · Swagger · Postman · Insomnia',
    '<span class="t-ok">dados</span>        SQL avançado · T-SQL · Oracle · SQL Server · DBeaver',
    '<span class="t-ok">design</span>       Figma · Miro · Pencil · protótipos navegáveis',
    '<span class="t-ok">qualidade</span>    testes E2E · usabilidade · homologação',
    '<span class="t-ok">ferramentas</span>  Jira · Azure DevOps · Confluence',
    '<span class="t-ok">ia</span>           ChatGPT · Claude · Gemini · desenvolvimento com IA',
  ],
  trajetoria: () => [
    '<span class="t-dim">2026     </span>  <span class="t-hi">Product Owner · Front</span> · UneCont',
    '<span class="t-dim">2024–2026</span>  <span class="t-hi">Product Owner</span> · CREA-ES, app Android do zero à entrega',
    '<span class="t-dim">2024–2025</span>  <span class="t-hi">Product Owner</span> · Defensoria SP',
    '<span class="t-dim">2021–2024</span>  <span class="t-hi">Product Owner &amp; Tribe Lead</span> · Reserva',
    '<span class="t-dim">2014–2021</span>  <span class="t-hi">Coordenadora de TI</span> · Reserva',
    '<span class="t-dim">2011–2014</span>  <span class="t-hi">Analista de Sistemas e Negócios</span> · Reserva',
    '<span class="t-dim">2009–2010</span>  <span class="t-hi">Desenvolvedora de Software</span> · Softguild',
  ],
  ia: () => [
    '<span class="t-ok">rotina</span>   ChatGPT · Claude · Gemini no dia a dia',
    '<span class="t-ok">dev</span>      IA para desenvolver software, da ideia ao código',
    '<span class="t-ok">produto</span>  um dos softwares que desenvolvi tem IA embarcada',
  ],
  certificacoes: () => [
    '<span class="t-ok">✓</span> CSPO · Certified Scrum Product Owner, Scrum Alliance',
    '<span class="t-ok">✓</span> Bacharelado em Ciência da Computação, UNIFESO',
    '<span class="t-ok">✓</span> Espanhol C1 · Inglês B2',
  ],
  projetos: () => [
    `<span class="t-ok">✓</span> ${externalLink('https://gabrielajacottet.github.io/my-memory-garden/#/', 'my-memory-garden')}   memórias que viram flores, com privacidade por padrão`,
    `<span class="t-ok">✓</span> ${externalLink('https://gabrielajacottet.github.io/xeque-na-esteira/', 'xeque-na-esteira')}   xadrez com esteira e ondas para quem está começando`,
    '<span class="t-dim">…</span> próximos           saindo do backlog',
  ],
  principios: () => [
    '1. Problema antes de solução.',
    '2. Pequenos incrementos, feedback rápido.',
    '3. Qualidade faz parte do pronto.',
    '4. Dados para decidir, pessoas para entender.',
    '5. Prioridades transparentes para todo mundo.',
  ],
  contato: () => [
    `e-mail     <a href="mailto:${email}">${email}</a>`,
    `linkedin   ${externalLink('https://www.linkedin.com/in/gabriela-jacottet/', 'in/gabriela-jacottet')}`,
    `github     ${externalLink('https://github.com/GabrielaJacottet', 'github.com/GabrielaJacottet')}`,
    `instagram  ${externalLink('https://instagram.com/gjacottet', '@gjacottet')}`,
  ],
  tema: () => {
    themeToggle.click();
    return [`Tema <span class="t-hi">${root.dataset.theme === 'light' ? 'claro' : 'escuro'}</span> ativado.`];
  },
  ls: () => ['sobre.md  trajetoria.md  atuacao.md  metodo.md  <span class="t-ok">projetos/</span>  stack.json  contato.txt'],
  date: () => [new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date())],
  sudo: () => ['Permissão negada. Mas dá para negociar o escopo.'],
  echo: (args) => [escapeHtml(args)],
  clear: () => {
    terminalBody.textContent = '';
    return [];
  },
};
const aliases = {
  ajuda: 'help', sobre: 'whoami', stack: 'skills', projects: 'projetos', contact: 'contato', theme: 'tema', cls: 'clear',
  cv: 'trajetoria', experiencia: 'trajetoria', ai: 'ia', certs: 'certificacoes', formacao: 'certificacoes', idiomas: 'certificacoes',
};

const printLine = (html, className = 't-out') => {
  const line = document.createElement('p');
  line.className = className;
  line.innerHTML = html;
  terminalBody.append(line);
};
const commandHistory = [];
let historyPosition = 0;
const run = (input) => {
  const value = input.trim();
  const commandLine = document.createElement('p');
  commandLine.className = 't-cmd';
  commandLine.textContent = value;
  terminalBody.append(commandLine);
  if (value) {
    commandHistory.push(value);
    historyPosition = commandHistory.length;
    const [name, ...rest] = value.split(/\s+/);
    const key = aliases[name.toLowerCase()] || name.toLowerCase();
    const command = commands[key];
    const output = command ? command(rest.join(' ')) : [`comando não encontrado: ${escapeHtml(name)}. Digite <span class="t-hi">help</span> para ver as opções.`];
    output.forEach((line) => printLine(line));
    if (output.length) printLine('&nbsp;');
  }
  terminalBody.scrollTop = terminalBody.scrollHeight;
};

let typing = null;
const typeAndRun = (command) => {
  clearInterval(typing);
  if (reduceMotion.matches) {
    run(command);
    return;
  }
  let index = 0;
  terminalField.value = '';
  typing = setInterval(() => {
    index += 1;
    terminalField.value = command.slice(0, index);
    if (index < command.length) return;
    clearInterval(typing);
    setTimeout(() => {
      terminalField.value = '';
      run(command);
    }, 220);
  }, 55);
};

terminalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearInterval(typing);
  run(terminalField.value);
  terminalField.value = '';
});
terminalField.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    if (!commandHistory.length) return;
    event.preventDefault();
    historyPosition = clamp(historyPosition + (event.key === 'ArrowUp' ? -1 : 1), 0, commandHistory.length);
    terminalField.value = commandHistory[historyPosition] || '';
  } else if (event.key === 'Tab' && terminalField.value) {
    const match = Object.keys(commands).find((name) => name.startsWith(terminalField.value.toLowerCase()));
    if (match) {
      event.preventDefault();
      terminalField.value = match;
    }
  }
});
terminalBody.addEventListener('click', (event) => {
  if (!event.target.closest('a') && finePointer.matches && !getSelection().toString()) terminalField.focus();
});
document.querySelectorAll('[data-cmd]').forEach((button) => {
  button.addEventListener('click', () => typeAndRun(button.dataset.cmd));
});

let terminalStarted = false;
const startTerminal = () => {
  if (terminalStarted) return;
  terminalStarted = true;
  printLine('<span class="t-dim">Último login: hoje, direto do portfólio. Digite help ou use os atalhos abaixo.</span>');
  printLine('&nbsp;');
  typeAndRun('whoami');
};
if ('IntersectionObserver' in window) {
  const terminalObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    terminalObserver.disconnect();
    startTerminal();
  }, { threshold: 0.4 });
  terminalObserver.observe(terminal);
} else {
  startTerminal();
}

/* ---------- Copiar e-mail ---------- */
const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = 'E-mail copiado ✓';
    copyStatus.textContent = 'E-mail copiado para a área de transferência.';
  } catch {
    copyButton.textContent = `Copie: ${email}`;
    copyStatus.textContent = `Não foi possível copiar automaticamente. Use o endereço ${email}.`;
  }
});

/* ---------- Demos sob demanda ---------- */
const demos = document.querySelectorAll('memory-garden-demo, xeque-na-esteira-demo');
const loadDemo = (demo) => {
  const name = demo.localName;
  const script = document.createElement('script');
  script.src = `assets/${name}/${name}.js`;
  document.head.append(script);
};
if ('IntersectionObserver' in window) {
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      demoObserver.unobserve(entry.target);
      loadDemo(entry.target);
    });
  }, { rootMargin: '400px 0px' });
  demos.forEach((demo) => demoObserver.observe(demo));
} else {
  demos.forEach(loadDemo);
}

/* ---------- Vídeo ---------- */
const videoDialog = document.getElementById('video-dialog');
const videoTitle = document.getElementById('video-dialog-titulo');
const video = videoDialog.querySelector('video');
document.querySelectorAll('.video-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (typeof videoDialog.showModal !== 'function') return;
    event.preventDefault();
    const [width, height] = link.dataset.size.split('x');
    video.width = width;
    video.height = height;
    video.poster = link.dataset.poster;
    video.src = link.href;
    videoTitle.textContent = link.dataset.title;
    videoDialog.showModal();
    video.play().catch(() => {});
  });
});
videoDialog.addEventListener('click', (event) => {
  if (event.target === videoDialog) videoDialog.close();
});
videoDialog.addEventListener('close', () => video.pause());

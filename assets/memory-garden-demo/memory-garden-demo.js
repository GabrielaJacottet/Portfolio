/*!
 * My Memory Garden — demonstração animada
 * Web Component sem dependências. Todo o desenho é SVG + CSS feito à mão.
 *
 * Uso:
 *   <script src="memory-garden-demo.js" defer></script>
 *   <memory-garden-demo lang="pt"></memory-garden-demo>
 *
 * Atributos:
 *   lang="pt" | "en" | "es"   idioma (padrão: pt)
 *   no-fonts                  não carrega Fraunces/DM Sans do Google Fonts
 *                             (use se a página já carrega as fontes)
 *
 * A animação pausa sozinha fora da tela, respeita prefers-reduced-motion
 * e passa o controle para quem clicar em qualquer botão.
 */
(() => {
  const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=DM+Sans:wght@400;500;700&display=swap'

  const TEXT = {
    pt: {
      region: 'Demonstração animada do My Memory Garden',
      own: 'Seu jardim', newMemory: 'Nova memória', placeholder: 'O que você quer lembrar?',
      typed: 'Pôr do sol na serra com a turma', feel: 'Como ela fez você se sentir?',
      emotions: { joy: 'Alegria', love: 'Amor', sad: 'Saudade', wonder: 'Encanto' },
      plant: 'Plantar', startsPrivate: 'Toda memória nasce privada',
      public: 'Pública', private: 'Privada', plantedNow: 'Plantada agora',
      memories: [
        { title: 'O cheiro do café na casa da vó', when: 'Plantada há 2 anos' },
        { title: 'Carta que nunca enviei', when: 'Plantada há 1 ano' },
      ],
      viewAs: 'Ver o jardim como', you: 'Você', visitor: 'Visitante',
      count: (n) => n === 1 ? '1 memória' : `${n} memórias`,
      ownerHint: 'Você vê todas as suas flores. As privadas têm um cadeado.',
      visitorHint: 'Memórias privadas não aparecem de forma alguma, nem como contagem.',
      steps: ['Plante', 'Cuide', 'Escolha quem entra'],
      pause: 'Pausar', play: 'Reproduzir', restart: 'Recomeçar', lock: 'privada',
      makePublic: (t) => `Tornar pública: ${t}`,
    },
    en: {
      region: 'Animated demo of My Memory Garden',
      own: 'Your garden', newMemory: 'New memory', placeholder: 'What do you want to remember?',
      typed: 'Sunset in the mountains with friends', feel: 'How did it make you feel?',
      emotions: { joy: 'Joy', love: 'Love', sad: 'Longing', wonder: 'Wonder' },
      plant: 'Plant', startsPrivate: 'Every memory starts private',
      public: 'Public', private: 'Private', plantedNow: 'Planted just now',
      memories: [
        { title: 'The smell of coffee at grandma’s', when: 'Planted 2 years ago' },
        { title: 'A letter I never sent', when: 'Planted 1 year ago' },
      ],
      viewAs: 'See the garden as', you: 'You', visitor: 'Visitor',
      count: (n) => `${n} ${n === 1 ? 'memory' : 'memories'}`,
      ownerHint: 'You see every flower. Private ones carry a lock.',
      visitorHint: 'Private memories never show up, not even as a count.',
      steps: ['Plant', 'Tend', 'Choose who comes in'],
      pause: 'Pause', play: 'Play', restart: 'Restart', lock: 'private',
      makePublic: (t) => `Make public: ${t}`,
    },
    es: {
      region: 'Demostración animada de My Memory Garden',
      own: 'Tu jardín', newMemory: 'Nuevo recuerdo', placeholder: '¿Qué quieres recordar?',
      typed: 'Atardecer en la sierra con los amigos', feel: '¿Cómo te hizo sentir?',
      emotions: { joy: 'Alegría', love: 'Amor', sad: 'Nostalgia', wonder: 'Asombro' },
      plant: 'Plantar', startsPrivate: 'Todo recuerdo nace privado',
      public: 'Público', private: 'Privado', plantedNow: 'Plantado ahora',
      memories: [
        { title: 'El olor del café en casa de la abuela', when: 'Plantado hace 2 años' },
        { title: 'La carta que nunca envié', when: 'Plantado hace 1 año' },
      ],
      viewAs: 'Ver el jardín como', you: 'Tú', visitor: 'Visitante',
      count: (n) => n === 1 ? '1 recuerdo' : `${n} recuerdos`,
      ownerHint: 'Ves todas tus flores. Las privadas llevan un candado.',
      visitorHint: 'Los recuerdos privados no aparecen de ninguna forma, ni como número.',
      steps: ['Planta', 'Cuida', 'Elige quién entra'],
      pause: 'Pausar', play: 'Reproducir', restart: 'Reiniciar', lock: 'privado',
      makePublic: (t) => `Hacer público: ${t}`,
    },
  }

  /* Cores das emoções, iguais às do app */
  const EMOTIONS = { joy: '#e6ba3d', love: '#c93974', sad: '#6da0c1', wonder: '#9b7fc1' }

  /* Geometria do jardim (viewBox 440 × 340) */
  const VB = { w: 440, h: 340 }
  const PLOTS = [
    { x: 98, base: 284, tip: { x: 92, y: 172 }, r: 15, bend: -14, phase: 0.0 },
    { x: 348, base: 281, tip: { x: 354, y: 182 }, r: 14, bend: 12, phase: 2.1 },
    { x: 222, base: 290, tip: { x: 226, y: 138 }, r: 19, bend: -10, phase: 1.2 },
  ]

  const LOOP = 16400

  const ease = {
    io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t,
    back: (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) },
    lin: (t) => t,
  }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const lerp = (a, b, t) => a + (b - a) * t
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], t))).join(',')})`

  /* Um valor que anima até um alvo, medido no relógio do componente (determinístico) */
  class Val {
    constructor(v) { this.from = v; this.to = v; this.t0 = 0; this.d = 0; this.e = ease.io }
    get(now) {
      if (!this.d || now >= this.t0 + this.d) return this.to
      if (now <= this.t0) return this.from
      return lerp(this.from, this.to, this.e((now - this.t0) / this.d))
    }
    go(now, to, d = 0, e = ease.io, delay = 0) {
      this.from = this.get(now + delay); this.to = to; this.t0 = now + delay; this.d = d; this.e = e
    }
  }

  const NS = 'http://www.w3.org/2000/svg'
  const LOCK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2"/></svg>'
  const INFO = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'

  function flowerMarkup(color, r) {
    const petals = color === EMOTIONS.joy ? 8 : 5
    let s = ''
    for (let i = 0; i < petals; i++) s += `<ellipse cx="0" cy="${-r * 0.62}" rx="${r * 0.42}" ry="${r * 0.66}" fill="${color}" opacity=".95" transform="rotate(${(i * 360) / petals})"/>`
    return s + `<circle r="${r * 0.32}" fill="${color === EMOTIONS.joy ? '#7a4b2a' : '#f4d27a'}"/>`
  }
  const mini = (color) => `<svg viewBox="-20 -20 40 40" aria-hidden="true"><circle r="19" fill="currentColor" opacity=".08"/><g class="mini-head">${flowerMarkup(color, 10)}</g></svg>`

  const CSS = `
:host { display: block; container-type: inline-size; color-scheme: light;
  --paper: #f4efe4; --paper-2: #ebe3d0; --card: #fbf8f1; --ink: #1f2b22; --ink-soft: #56645a; --line: rgba(31,43,34,.13);
  --moss: #355e41; --leaf: #7fa36b; --sun: #e8c46a; --night: #16211a; --night-2: #24382b; --cream: #f1ece0;
  font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif; color: var(--ink); line-height: 1.5; -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; margin: 0; padding: 0; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
button:focus-visible, input:focus-visible { outline: 2px solid var(--moss); outline-offset: 3px; }
.stage { position: relative; border-radius: 30px; overflow: hidden; border: 1px solid var(--line); background: var(--card);
  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 24px 48px -28px rgba(31,43,34,.45); isolation: isolate; }
.grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr); }
.grid > section { min-width: 0; }
.panel-title { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; min-height: 34px; }
h4 { font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-size: 1.22rem; letter-spacing: -.01em; }
.pill { font-size: .75rem; padding: 4px 10px; border-radius: 999px; background: var(--paper-2); color: var(--ink-soft); white-space: nowrap; }

/* lado de quem cuida */
.own { padding: 28px 28px 22px; background: var(--card); }
.compose { border: 1px solid var(--line); border-radius: 20px; background: #fff; padding: 16px 16px 14px; box-shadow: 0 10px 24px -20px rgba(31,43,34,.5); }
.lab { display: block; font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; color: var(--moss); margin-bottom: 8px; }
.lab.soft { margin: 14px 0 8px; color: var(--ink-soft); letter-spacing: .02em; text-transform: none; font-weight: 500; font-size: .8rem; }
.field { position: relative; }
.field input { width: 100%; padding: 11px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--card);
  font: 400 1rem 'DM Sans', system-ui, sans-serif; color: var(--ink); }
.field input::placeholder { color: #9aa39b; }
.field.fake-focus input { border-color: var(--moss); box-shadow: 0 0 0 3px rgba(53,94,65,.15); }
.field input:focus { outline: none; border-color: var(--moss); box-shadow: 0 0 0 3px rgba(53,94,65,.15); }
.caret { position: absolute; top: 50%; width: 2px; height: 1.15em; margin-top: -.58em; background: var(--moss); border-radius: 1px; opacity: 0; pointer-events: none; }
.mirror { position: absolute; visibility: hidden; white-space: pre; font: 400 1rem 'DM Sans', system-ui, sans-serif; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px 6px 8px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); font-size: .85rem; color: var(--ink-soft); }
.chip i { width: 12px; height: 12px; border-radius: 50%; }
.chip[aria-pressed="true"] { background: var(--night); color: var(--cream); border-color: transparent; }
.actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 14px; }
.trust { display: inline-flex; align-items: center; gap: 6px; font-size: .78rem; color: var(--ink-soft); }
.plant { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: var(--night); color: var(--cream); font-weight: 500; font-size: .92rem; white-space: nowrap; }
.mems { margin-top: 8px; min-height: 174px; }
.row-wrap { overflow: hidden; }
.mem { display: flex; align-items: center; gap: 12px; height: 58px; border-bottom: 1px dashed var(--line); }
.mems > :last-child .mem { border-bottom: 0; }
.mem > svg { flex: none; width: 34px; height: 34px; color: var(--ink); }
.mem-txt { flex: 1; min-width: 0; }
.mem-txt b { display: block; font-weight: 500; font-size: .95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mem-txt small { color: var(--ink-soft); font-size: .78rem; }
.switch { flex: none; display: flex; align-items: center; gap: 8px; font-size: .8rem; color: var(--ink-soft); border-radius: 8px; }
.switch .lbl { width: 50px; text-align: right; }
.track { position: relative; width: 40px; height: 22px; border-radius: 999px; border: 1px solid var(--line); }
.knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.22); }

/* lado do jardim */
.garden { padding: 28px 28px 22px; background: var(--night); color: var(--cream); display: flex; flex-direction: column; }
.garden .pill { background: var(--night-2); color: rgba(241,236,224,.78); }
.seg { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; padding: 3px; border-radius: 999px; background: var(--night-2); font-size: .82rem; }
.seg-ind { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 999px; background: var(--cream); }
.seg button { position: relative; padding: 6px 16px; border-radius: 999px; font-weight: 500; }
.scene { position: relative; aspect-ratio: ${VB.w} / ${VB.h}; border-radius: 20px; overflow: hidden; background: #1b2a20; }
.scene svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hit { fill: transparent; pointer-events: all; cursor: pointer; }
.bubble { position: absolute; display: flex; align-items: center; gap: 8px; max-width: 72%; padding: 8px 12px; border-radius: 14px;
  background: var(--card); color: var(--ink); font-size: .8rem; font-weight: 500; line-height: 1.25; box-shadow: 0 12px 24px -12px rgba(0,0,0,.55); pointer-events: none; opacity: 0; }
.bubble::after { content: ""; position: absolute; left: 50%; bottom: -6px; width: 12px; height: 12px; margin-left: -6px; background: var(--card); transform: rotate(45deg); border-radius: 2px; }
.bubble i { flex: none; width: 10px; height: 10px; border-radius: 50%; }
.hints { display: grid; margin-top: 16px; min-height: 2.9em; }
.hint { grid-area: 1 / 1; display: flex; gap: 8px; align-items: flex-start; font-size: .82rem; color: rgba(241,236,224,.66); }
.hint svg { flex: none; margin-top: 2px; }

/* rodapé */
.foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 28px; border-top: 1px solid var(--line); background: var(--paper); }
.steps { display: flex; gap: 22px; list-style: none; font-size: .88rem; color: var(--ink-soft); flex-wrap: wrap; }
.steps li { display: flex; align-items: baseline; gap: 6px; transition: none; }
.steps i { font-family: 'Fraunces', Georgia, serif; color: var(--moss); }
.steps li.on { color: var(--ink); font-weight: 500; }
.ctrl { display: flex; gap: 6px; }
.ctrl button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line); font-size: .82rem; color: var(--ink); background: var(--card); }
.ctrl button:hover, .chip:hover, .switch:hover .track { filter: brightness(.97); }

/* cursor simulado */
.cursor { position: absolute; left: 0; top: 0; width: 26px; height: 26px; pointer-events: none; z-index: 5; opacity: 0; filter: drop-shadow(0 3px 4px rgba(0,0,0,.28)); }
.ring { position: absolute; left: 0; top: 0; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2px solid var(--sun); pointer-events: none; z-index: 4; opacity: 0; }

.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@container (max-width: 700px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .own, .garden { padding: 22px 18px 18px; }
  .foot { padding: 12px 18px; }
  .steps { gap: 14px; font-size: .82rem; }
}
@container (max-width: 380px) {
  .trust { display: none; }
  .ctrl button span { display: none; }
}
`

  class MemoryGardenDemo extends HTMLElement {
    connectedCallback() {
      if (this.root) return
      const lang = (this.getAttribute('lang') || 'pt').slice(0, 2)
      this.T = TEXT[lang] || TEXT.pt
      if (!this.hasAttribute('no-fonts') && !document.querySelector('link[data-mg-fonts]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'; link.href = FONT_HREF; link.dataset.mgFonts = ''
        document.head.appendChild(link)
      }
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      this.root = this.attachShadow({ mode: 'open' })
      this.build()
      this.setup()
      this.autoplay = !this.reduced
      if (this.reduced) this.finalState(); else this.initState()
      this.render()
      this.observe()
    }

    disconnectedCallback() { this.stopLoop(); this.io?.disconnect() }

    /* ---------- DOM ---------- */
    build() {
      const T = this.T
      const chips = Object.entries(EMOTIONS).map(([id, c]) =>
        `<button type="button" class="chip" data-e="${id}" aria-pressed="false"><i style="background:${c}"></i>${T.emotions[id]}</button>`).join('')
      const row = (i, title, when) => `
        <div class="row-wrap" data-row="${i}"><div class="mem">
          ${mini(i === 0 ? EMOTIONS.joy : i === 1 ? EMOTIONS.sad : EMOTIONS.wonder)}
          <div class="mem-txt"><b>${title}</b><small>${when}</small></div>
          <button type="button" class="switch" role="switch" aria-checked="false"><span class="lbl"></span><span class="track"><span class="knob"></span></span></button>
        </div></div>`
      const stars = Array.from({ length: 26 }, (_, i) => {
        const x = (i * 97.3 + 31) % VB.w, y = ((i * 53.7) % 150) + 10, r = (i % 3) * 0.35 + 0.6
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#f4efe4" opacity="${0.35 + (i % 4) * 0.15}"/>`
      }).join('')
      const plants = PLOTS.map((p, i) => `
        <g class="plot" data-p="${i}">
          <ellipse cx="${p.x}" cy="${p.base + 2}" rx="26" ry="6" fill="#2b4332" class="mound"/>
          <g class="body">
            <path class="stem" d="M${p.x} ${p.base} Q${p.x + p.bend} ${(p.base + p.tip.y) / 2} ${p.tip.x} ${p.tip.y}" fill="none" stroke="#7fa36b" stroke-width="3.2" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
            <g class="leaf" data-l="0"><path fill="#6f9a5f"/></g>
            <g class="leaf" data-l="1"><path fill="#6f9a5f"/></g>
            <g class="head"><g class="petals"></g></g>
            <g class="burst"></g>
            <g class="badge" opacity="0"><rect x="-34" y="-11" width="68" height="22" rx="11" fill="rgba(22,33,26,.75)" stroke="rgba(241,236,224,.45)" stroke-dasharray="3 2"/>
              <g transform="translate(-24 -6.5) scale(.54)" color="#f1ece0">${LOCK.replace('width="13" height="13"', 'width="24" height="24"')}</g>
              <text x="7" y="4" text-anchor="middle" font-size="10.5" font-family="DM Sans, system-ui, sans-serif" fill="#f1ece0">${T.lock}</text></g>
          </g>
          <circle class="hit" cx="${p.tip.x}" cy="${p.tip.y}" r="${p.r + 14}"/>
        </g>`).join('')

      this.root.innerHTML = `<style>${CSS}</style>
      <div class="stage" role="region" aria-label="${T.region}">
        <div class="grid">
          <section class="own">
            <div class="panel-title"><h4>${T.own}</h4><span class="pill own-count"></span></div>
            <div class="compose">
              <label class="lab" for="mg-input">${T.newMemory}</label>
              <div class="field"><input id="mg-input" type="text" maxlength="60" autocomplete="off" placeholder="${T.placeholder}"><span class="caret"></span><span class="mirror" aria-hidden="true"></span></div>
              <div class="lab soft" id="mg-feel">${T.feel}</div>
              <div class="chips" role="group" aria-labelledby="mg-feel">${chips}</div>
              <div class="actions"><span class="trust">${LOCK}${T.startsPrivate}</span>
                <button type="button" class="plant"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21V11M12 11C12 7 9 5 5 5c0 4 3 6 7 6Zm0 0c0-3 2-5 6-5 0 3-2 5-6 5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${T.plant}</button></div>
            </div>
            <div class="mems">${row(2, '', T.plantedNow)}${row(0, T.memories[0].title, T.memories[0].when)}${row(1, T.memories[1].title, T.memories[1].when)}</div>
          </section>
          <section class="garden">
            <div class="panel-title">
              <div class="seg" role="group" aria-label="${T.viewAs}"><span class="seg-ind"></span>
                <button type="button" data-v="owner" aria-pressed="true">${T.you}</button><button type="button" data-v="visitor" aria-pressed="false">${T.visitor}</button></div>
              <span class="pill g-count" aria-live="polite"></span>
            </div>
            <div class="scene">
              <svg viewBox="0 0 ${VB.w} ${VB.h}" aria-hidden="true">
                <defs>
                  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a20"/><stop offset=".7" stop-color="#2c4434"/><stop offset="1" stop-color="#3b5a43"/></linearGradient>
                  <radialGradient id="moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f6e3a8"/><stop offset=".55" stop-color="#e8c46a" stop-opacity=".45"/><stop offset="1" stop-color="#e8c46a" stop-opacity="0"/></radialGradient>
                </defs>
                <rect width="${VB.w}" height="${VB.h}" fill="url(#sky)"/>
                <g>${stars}</g>
                <circle cx="352" cy="72" r="70" fill="url(#moon)"/><circle cx="352" cy="72" r="21" fill="#f4e6b8"/>
                <path d="M0 252 Q110 222 220 242 T440 230 V340 H0Z" fill="#1f3326"/>
                <g class="seed-layer"><circle class="seed" r="5" fill="#c9a36a"/></g>
                ${plants}
                <path d="M0 302 Q120 288 230 300 T440 292 V340 H0Z" fill="#16211a"/>
                <g class="flies"></g>
              </svg>
              <div class="bubble"><i></i><span></span></div>
            </div>
            <div class="hints"><p class="hint h-own">${INFO}${T.ownerHint}</p><p class="hint h-vis">${INFO}${T.visitorHint}</p></div>
          </section>
        </div>
        <div class="foot">
          <ol class="steps">${T.steps.map((s, i) => `<li><i>${['i.', 'ii.', 'iii.'][i]}</i>${s}</li>`).join('')}</ol>
          <div class="ctrl">
            <button type="button" class="b-play"></button>
            <button type="button" class="b-restart"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T.restart}</span></button>
          </div>
        </div>
        <div class="ring"></div>
        <svg class="cursor" viewBox="0 0 26 26" aria-hidden="true"><path d="M4 2.5 21 13.6l-7.6 1.4 4.2 7.6-3.3 1.8-4.2-7.7L4.6 21.6Z" fill="#fff" stroke="#1f2b22" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>`

      const $ = (s) => this.root.querySelector(s)
      const $$ = (s) => [...this.root.querySelectorAll(s)]
      this.el = {
        stage: $('.stage'), input: $('input'), field: $('.field'), caret: $('.caret'), mirror: $('.mirror'),
        chips: $$('.chip'), plant: $('.plant'), ownCount: $('.own-count'), gCount: $('.g-count'),
        seg: $('.seg'), segInd: $('.seg-ind'), segBtns: $$('.seg button'), scene: $('.scene'), svg: $('.scene svg'),
        bubble: $('.bubble'), bubbleDot: $('.bubble i'), bubbleTxt: $('.bubble span'),
        hOwn: $('.h-own'), hVis: $('.h-vis'), steps: $$('.steps li'), play: $('.b-play'), restart: $('.b-restart'),
        cursor: $('.cursor'), ring: $('.ring'), seed: $('.seed'), flies: $('.flies'),
      }
      this.rows = [0, 1, 2].map((i) => {
        const wrap = $(`[data-row="${i}"]`)
        return { wrap, title: wrap.querySelector('b'), sw: wrap.querySelector('.switch'), lbl: wrap.querySelector('.lbl'),
          track: wrap.querySelector('.track'), knob: wrap.querySelector('.knob'), mini: wrap.querySelector('.mini-head') }
      })
      this.plantsEl = $$('.plot').map((g) => ({
        g, mound: g.querySelector('.mound'), body: g.querySelector('.body'), stem: g.querySelector('.stem'),
        leaves: [...g.querySelectorAll('.leaf')], head: g.querySelector('.head'), petals: g.querySelector('.petals'),
        burst: g.querySelector('.burst'), badge: g.querySelector('.badge'), hit: g.querySelector('.hit'),
      }))
      ;[0, 1].forEach((i) => { this.plantsEl[i].petals.innerHTML = flowerMarkup(i ? EMOTIONS.sad : EMOTIONS.joy, PLOTS[i].r) })
      for (let i = 0; i < 8; i++) {
        const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '2.2')
        this.plantsEl[2].burst.appendChild(c)
      }
      this.flyEls = Array.from({ length: 7 }, () => {
        const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '1.8'); c.setAttribute('fill', '#f6e3a8')
        c.style.filter = 'drop-shadow(0 0 3px #e8c46a)'; this.el.flies.appendChild(c); return c
      })
    }

    /* ---------- estado ---------- */
    setup() {
      this.clock = 0
      this.sc = 0
      this.prevSc = -1
      this.timers = []
      this.mems = [
        { title: this.T.memories[0].title, color: EMOTIONS.joy, public: true, exists: true },
        { title: this.T.memories[1].title, color: EMOTIONS.sad, public: false, exists: true },
        { title: '', color: EMOTIONS.wonder, public: false, exists: false },
      ]
      for (const m of this.mems) { m.sw = new Val(m.public ? 1 : 0); m.shown = new Val(m.exists ? 1 : 0) }
      const n = this.mems[2]
      Object.assign(this, {
        view: 'owner', viewV: new Val(0), emotion: null, typing: false, fakeFocus: false, typedV: new Val(0),
        press: new Val(0), rowV: new Val(0), seedV: new Val(0), stemV: new Val(0), leafV: new Val(0),
        bloomV: new Val(0), burstV: new Val(0), tipV: new Val(0), tipIndex: 2, step: 0,
        cur: { x: 0, y: 0, fromX: 0, fromY: 0, target: null, p: new Val(1), vis: new Val(0), click: new Val(0) },
      })
      this.setPlayLabel()
      const el = this.el
      el.chips.forEach((c) => c.addEventListener('click', (e) => { if (e.isTrusted) this.takeOver(); this.selectEmotion(c.dataset.e) }))
      el.plant.addEventListener('click', (e) => { if (e.isTrusted) this.takeOver(); this.plant() })
      el.input.addEventListener('focus', () => this.takeOver())
      el.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.plant() } })
      el.input.addEventListener('input', () => this.render())
      this.rows.forEach((r, i) => r.sw.addEventListener('click', (e) => { if (e.isTrusted) this.takeOver(); this.toggle(i) }))
      el.segBtns.forEach((b) => b.addEventListener('click', (e) => { if (e.isTrusted) this.takeOver(); this.setView(b.dataset.v) }))
      this.plantsEl.forEach((p, i) => {
        p.hit.addEventListener('pointerenter', () => { if (!this.autoplay && this.mems[i].exists && this.mems[i].shown.to) this.showTip(i, true) })
        p.hit.addEventListener('pointerleave', () => { if (!this.autoplay) this.showTip(i, false) })
      })
      el.play.addEventListener('click', () => {
        if (this.autoplay) { this.autoplay = false; this.cur.vis.go(this.clock, 0, 250) }
        else if (this.dirty) this.restart()
        else { this.autoplay = true; this.cur.vis.go(this.clock, 1, 250) }
        this.setPlayLabel(); this.wake()
      })
      el.restart.addEventListener('click', () => this.restart())
      this.ro = new ResizeObserver(() => this.render())
      this.ro.observe(this)
    }

    d(ms) { return this.reduced ? 0 : ms }
    after(ms, fn) { this.timers.push({ at: this.clock + this.d(ms), fn }); this.timers.sort((a, b) => a.at - b.at) }

    takeOver() {
      this.dirty = true
      if (!this.autoplay) return
      this.autoplay = false; this.typing = false; this.fakeFocus = false
      this.cur.vis.go(this.clock, 0, 200)
      this.setPlayLabel()
    }

    setPlayLabel() {
      const T = this.T, on = this.autoplay
      this.el.play.innerHTML = (on
        ? '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7Z" fill="currentColor"/></svg>') + `<span>${on ? T.pause : T.play}</span>`
      this.el.play.setAttribute('aria-label', on ? T.pause : T.play)
    }

    /* ---------- ações (as mesmas para autoplay e para clique real) ---------- */
    selectEmotion(id) {
      this.emotion = id
      const n = this.mems[2]
      n.color = EMOTIONS[id]
      if (n.exists) this.paintNewFlower()
      this.render()
    }

    paintNewFlower() {
      const n = this.mems[2]
      this.plantsEl[2].petals.innerHTML = flowerMarkup(n.color, PLOTS[2].r)
      this.rows[2].mini.innerHTML = flowerMarkup(n.color, 10)
      this.plantsEl[2].burst.setAttribute('fill', n.color)
    }

    plant() {
      const now = this.clock, n = this.mems[2]
      const text = (this.typing ? this.T.typed : this.el.input.value.trim()) || this.T.typed
      if (this.view !== 'owner') this.setView('owner')
      this.typing = false
      this.press.go(now, 1, this.d(90), ease.out); this.press.go(now, 0, this.d(260), ease.out, this.d(90))
      // recomeça a flor nova do zero
      for (const v of [this.seedV, this.stemV, this.leafV, this.bloomV, this.burstV]) v.go(now, 0)
      n.title = text; n.exists = true; n.public = false; n.sw.go(now, 0); n.shown.go(now, 1)
      if (!this.emotion) this.selectEmotion('wonder')
      this.paintNewFlower()
      this.rows[2].title.textContent = text
      this.after(220, () => { this.el.input.value = ''; this.fakeFocus = false })
      this.rowV.go(now, 1, this.d(480), ease.out, this.d(120))
      this.seedV.go(now, 1, this.d(700), ease.in, this.d(150))
      this.stemV.go(now, 1, this.d(1150), ease.io, this.d(900))
      this.leafV.go(now, 1, this.d(600), ease.back, this.d(1500))
      this.bloomV.go(now, 1, this.d(850), ease.back, this.d(1850))
      this.burstV.go(now, 1, this.d(950), ease.out, this.d(2000))
      this.step = 0
      this.after(850, () => { this.step = 1 })
      this.wake()
    }

    toggle(i) {
      const m = this.mems[i]
      if (!m.exists) return
      m.public = !m.public
      m.sw.go(this.clock, m.public ? 1 : 0, this.d(300), ease.back)
      this.refreshShown()
      this.step = 2
      this.wake()
    }

    setView(v) {
      this.view = v
      this.viewV.go(this.clock, v === 'visitor' ? 1 : 0, this.d(520), ease.io)
      this.refreshShown(true)
      if (v === 'visitor') this.step = 2
      if (v === 'owner') this.tipV.go(this.clock, 0, this.d(200))
      this.wake()
    }

    refreshShown(stagger) {
      this.mems.forEach((m, i) => {
        const target = m.exists && (this.view === 'owner' || m.public) ? 1 : 0
        if (target !== m.shown.to) m.shown.go(this.clock, target, this.d(700), ease.io, stagger ? this.d(i * 90) : 0)
      })
      if (this.tipV.to && !this.mems[this.tipIndex].shown.to) this.tipV.go(this.clock, 0, this.d(180))
    }

    showTip(i, on) {
      this.tipIndex = i
      this.tipV.go(this.clock, on ? 1 : 0, this.d(on ? 320 : 200), ease.out)
      this.wake()
    }

    /* ---------- estados prontos ---------- */
    initState() {
      const now = this.clock
      this.timers = []
      this.view = 'owner'; this.viewV.go(now, 0)
      this.emotion = null; this.typing = false; this.fakeFocus = false
      this.el.input.value = ''
      this.mems[0].public = true; this.mems[1].public = false
      const n = this.mems[2]; n.exists = false; n.public = false; n.title = ''; n.color = EMOTIONS.wonder
      this.mems.forEach((m) => { m.sw.go(now, m.public ? 1 : 0); m.shown.go(now, m.exists ? 1 : 0) })
      for (const v of [this.press, this.rowV, this.seedV, this.stemV, this.leafV, this.bloomV, this.burstV, this.tipV, this.typedV]) v.go(now, 0)
      this.paintNewFlower()
      this.step = 0
      this.dirty = false
    }

    finalState() {
      this.initState()
      this.selectEmotion('wonder')
      const n = this.mems[2]
      n.exists = true; n.title = this.T.typed; n.public = true
      this.rows[2].title.textContent = n.title
      for (const v of [this.rowV, this.seedV, this.stemV, this.leafV, this.bloomV, this.burstV]) v.go(this.clock, 1)
      n.sw.go(this.clock, 1); n.shown.go(this.clock, 1)
      this.paintNewFlower()
      this.step = 2
    }

    softReset() {
      const now = this.clock, n = this.mems[2]
      this.tipV.go(now, 0, 200)
      n.shown.go(now, 0, 650, ease.io)
      this.rowV.go(now, 0, 520, ease.io, 250)
      this.emotion = null; this.step = 0
      this.after(820, () => this.initState())
    }

    restart() {
      this.initState()
      this.sc = 0; this.prevSc = -1
      this.autoplay = !this.reduced
      if (this.reduced) this.finalState()
      this.setPlayLabel(); this.wake()
    }

    /* ---------- roteiro do autoplay (ms) ---------- */
    script() {
      const T = this.T, el = this.el
      return [
        [0, () => { this.initState(); this.moveCursor('rest', 0); this.cur.vis.go(this.clock, 1, 400) }],
        [450, () => this.moveCursor(el.input, 720)],
        [1200, () => { this.click(); this.fakeFocus = true; this.typing = true; this.typedV.go(this.clock, 0); this.typedV.go(this.clock, 1, 2050, ease.lin) }],
        [3450, () => this.moveCursor(el.chips.find((c) => c.dataset.e === 'wonder'), 650)],
        [4150, () => { this.click(); this.selectEmotion('wonder') }],
        [4500, () => this.moveCursor(el.plant, 620)],
        [5150, () => { this.click(); this.plant() }],
        [7900, () => this.moveCursor(this.rows[2].sw, 760)],
        [8700, () => { this.click(); this.toggle(2) }],
        [9350, () => this.moveCursor(el.segBtns[1], 700)],
        [10100, () => { this.click(); this.setView('visitor') }],
        [10850, () => this.moveCursor('flower', 760)],
        [11650, () => this.showTip(2, true)],
        [13650, () => { this.showTip(2, false); this.moveCursor(el.segBtns[0], 700) }],
        [14400, () => { this.click(); this.setView('owner') }],
        [15000, () => { this.softReset(); this.moveCursor('rest', 900) }],
        [15900, () => this.cur.vis.go(this.clock, 0, 400)],
      ]
    }

    moveCursor(target, d) {
      const c = this.cur, p = this.cursorPoint()
      c.fromX = p.x; c.fromY = p.y; c.target = target
      c.p.go(this.clock, 0); c.p.go(this.clock, 1, d, ease.io)
    }
    click() {
      this.cur.click.go(this.clock, 0); this.cur.click.go(this.clock, 1, 520, ease.out)
    }

    targetPoint(t) {
      const s = this.el.stage.getBoundingClientRect()
      if (t === 'rest') return { x: s.width * 0.5, y: s.height - 30 }
      if (t === 'flower') {
        const r = this.el.svg.getBoundingClientRect(), P = PLOTS[2]
        return { x: r.left - s.left + (P.tip.x / VB.w) * r.width + 6, y: r.top - s.top + (P.tip.y / VB.h) * r.height + 8 }
      }
      const r = t.getBoundingClientRect()
      const fx = t === this.el.input ? 0.3 : t.classList?.contains('switch') ? 0.82 : 0.5
      return { x: r.left - s.left + r.width * fx, y: r.top - s.top + r.height * 0.55 }
    }
    cursorPoint() {
      const c = this.cur
      if (!c.target) return this.targetPoint('rest')
      const to = this.targetPoint(c.target), p = c.p.get(this.clock)
      return { x: lerp(c.fromX, to.x, p), y: lerp(c.fromY, to.y, p) }
    }

    /* ---------- relógio ---------- */
    tick(dt) {
      this.clock += dt
      if (this.autoplay) {
        if (!this.events) this.events = this.script()
        this.sc += dt
        for (const [t, fn] of this.events) if (t > this.prevSc && t <= this.sc) fn()
        this.prevSc = this.sc
        if (this.sc >= LOOP) { this.sc = 0; this.prevSc = -1 }
      }
      while (this.timers.length && this.timers[0].at <= this.clock) this.timers.shift().fn()
      this.render()
    }

    observe() {
      this.visible = true
      this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; this.visible ? this.wake() : this.stopLoop() })
      this.io.observe(this)
      document.addEventListener('visibilitychange', () => (document.hidden ? this.stopLoop() : this.wake()))
      this.wake()
    }
    wake() {
      if (this.manual || this.raf || !this.visible || document.hidden) return
      let last = performance.now()
      const loop = (t) => { this.tick(Math.min(50, t - last)); last = t; this.raf = requestAnimationFrame(loop) }
      this.raf = requestAnimationFrame(loop)
    }
    stopLoop() { cancelAnimationFrame(this.raf); this.raf = 0 }

    /** Para gravar vídeo: desliga o relógio real e avança quadro a quadro. */
    capture() { this.manual = true; this.stopLoop(); this.autoplay = true; this.setPlayLabel(); this.sc = 0; this.prevSc = -1; this.clock = 0; return { advance: (ms) => this.tick(ms) } }

    /* ---------- desenho ---------- */
    render() {
      const now = this.clock, T = this.T, el = this.el, sec = now / 1000
      const sway = this.reduced ? 0 : 1

      // campo de texto + cursor de digitação
      if (this.typing) el.input.value = T.typed.slice(0, Math.round(T.typed.length * this.typedV.get(now)))
      el.field.classList.toggle('fake-focus', this.fakeFocus)
      if (this.fakeFocus) {
        el.mirror.textContent = el.input.value
        const max = el.input.clientWidth - 16
        el.caret.style.left = `${Math.min(max, 15 + el.mirror.offsetWidth)}px`
        el.caret.style.opacity = (this.typing && this.typedV.get(now) < 1) || Math.floor(now / 530) % 2 === 0 ? 1 : 0
      } else el.caret.style.opacity = 0

      el.chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.e === this.emotion)))
      el.plant.style.transform = `scale(${1 - 0.07 * this.press.get(now)})`

      // lista de memórias
      this.mems.forEach((m, i) => {
        const r = this.rows[i], s = m.sw.get(now)
        r.sw.setAttribute('aria-checked', String(m.public))
        r.sw.setAttribute('aria-label', T.makePublic(m.title || T.typed))
        r.lbl.textContent = m.public ? T.public : T.private
        r.lbl.style.color = m.public ? '#355e41' : ''
        r.track.style.background = mix('#ebe3d0', '#355e41', clamp(s))
        r.knob.style.transform = `translateX(${18 * s}px)`
      })
      const rv = this.rowV.get(now)
      this.rows[2].wrap.style.height = `${58 * rv}px`
      this.rows[2].wrap.style.opacity = rv
      this.rows[2].wrap.toggleAttribute('inert', rv < 0.5)
      const total = this.mems.filter((m) => m.exists).length
      const pub = this.mems.filter((m) => m.exists && m.public).length
      el.ownCount.textContent = T.count(total)
      el.gCount.textContent = T.count(this.view === 'owner' ? total : pub)

      // alternância Você / Visitante
      const vv = this.viewV.get(now)
      el.segInd.style.transform = `translateX(${vv * 100}%)`
      el.segBtns.forEach((b, i) => {
        const on = i === 0 ? 1 - vv : vv
        b.style.color = mix('#f1ece0', '#16211a', on)
        b.setAttribute('aria-pressed', String((i === 1) === (this.view === 'visitor')))
      })
      el.hOwn.style.opacity = 1 - vv; el.hVis.style.opacity = vv
      el.hOwn.setAttribute('aria-hidden', String(vv > 0.5)); el.hVis.setAttribute('aria-hidden', String(vv <= 0.5))

      // plantas
      PLOTS.forEach((P, i) => {
        const m = this.mems[i], pe = this.plantsEl[i]
        const isNew = i === 2
        const stem = isNew ? this.stemV.get(now) : 1
        const leaf = isNew ? this.leafV.get(now) : 1
        const bloom = isNew ? this.bloomV.get(now) : 1
        const shown = m.shown.get(now)
        const sh = ease.io(clamp(shown))
        pe.g.style.opacity = sh
        pe.g.style.display = sh <= 0.001 ? 'none' : ''
        pe.mound.style.opacity = isNew ? clamp(this.seedV.get(now) * 3) : 1
        const s = sway * Math.sin(sec * 0.9 + P.phase) * 2.2 * stem
        pe.body.setAttribute('transform', `rotate(${s.toFixed(3)} ${P.x} ${P.base}) translate(${P.x} ${P.base}) scale(${lerp(0.75, 1, sh)}) translate(${-P.x} ${-P.base})`)
        pe.stem.style.strokeDashoffset = 1 - stem
        pe.stem.style.opacity = stem > 0.01 ? 1 : 0
        ;[0.42, 0.62].forEach((t, k) => {
          const qx = (1 - t) ** 2 * P.x + 2 * (1 - t) * t * (P.x + P.bend) + t * t * P.tip.x
          const qy = (1 - t) ** 2 * P.base + 2 * (1 - t) * t * ((P.base + P.tip.y) / 2) + t * t * P.tip.y
          const side = k === 0 ? -1 : 1
          const lp = clamp((stem - t) * 4) * leaf
          pe.leaves[k].setAttribute('transform', `translate(${qx.toFixed(2)} ${qy.toFixed(2)}) scale(${lp.toFixed(3)})`)
          pe.leaves[k].firstChild.setAttribute('d', `M0 0 C${side * 14} -6 ${side * 22} -18 ${side * 20} -26 C${side * 8} -22 ${side * 2} -12 0 0Z`)
        })
        const hs = sway * Math.sin(sec * 0.75 + P.phase * 1.7) * 4
        pe.head.setAttribute('transform', `translate(${P.tip.x} ${P.tip.y}) scale(${Math.max(0, bloom).toFixed(3)})`)
        pe.petals.setAttribute('transform', `rotate(${hs.toFixed(2)})`)
        // cadeado: só para o dono, só nas privadas
        const badge = (1 - m.sw.get(now)) * (1 - vv) * clamp(bloom)
        pe.badge.setAttribute('opacity', badge.toFixed(3))
        pe.badge.setAttribute('transform', `translate(${P.tip.x} ${P.tip.y - P.r - 22})`)
      })

      // semente caindo
      const sd = this.seedV.get(now), P = PLOTS[2]
      el.seed.setAttribute('cx', P.x)
      el.seed.setAttribute('cy', lerp(-12, P.base - 3, sd))
      el.seed.style.opacity = this.mems[2].exists && sd > 0 ? clamp((1 - this.stemV.get(now) * 3)) * this.mems[2].shown.get(now) : 0

      // brilho ao florescer
      const b = this.burstV.get(now)
      ;[...this.plantsEl[2].burst.children].forEach((c, k) => {
        const a = (k / 8) * Math.PI * 2 + 0.3, dist = 14 + 30 * b
        c.setAttribute('cx', P.tip.x + Math.cos(a) * dist); c.setAttribute('cy', P.tip.y + Math.sin(a) * dist)
        c.setAttribute('opacity', b > 0 && b < 1 ? (1 - b).toFixed(3) : 0)
      })

      // vaga-lumes
      this.flyEls.forEach((f, k) => {
        const bx = 40 + k * 58, by = 190 + (k % 3) * 28
        f.setAttribute('cx', (bx + sway * Math.sin(sec * 0.4 + k) * 16).toFixed(1))
        f.setAttribute('cy', (by + sway * Math.cos(sec * 0.33 + k * 1.3) * 12).toFixed(1))
        f.setAttribute('opacity', (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(sec * 2.2 + k * 1.9))).toFixed(2))
      })

      // balão de prévia
      const tv = this.tipV.get(now), tm = this.mems[this.tipIndex], TP = PLOTS[this.tipIndex]
      el.bubble.style.opacity = tv * tm.shown.get(now)
      el.bubbleTxt.textContent = tm.title || T.typed
      el.bubbleDot.style.background = tm.color
      el.bubble.style.left = `${(TP.tip.x / VB.w) * 100}%`
      el.bubble.style.top = `${((TP.tip.y - TP.r - 12) / VB.h) * 100}%`
      el.bubble.style.transform = `translate(-50%, calc(-100% + ${(1 - tv) * 8}px))`

      // passos
      el.steps.forEach((li, i) => li.classList.toggle('on', i === this.step))

      // cursor simulado
      const cv = this.cur.vis.get(now)
      if (cv > 0) {
        const p = this.cursorPoint(), ck = this.cur.click.get(now)
        const press = ck > 0 && ck < 1 ? Math.sin(Math.min(1, ck * 3) * Math.PI) : 0
        el.cursor.style.opacity = cv
        el.cursor.style.transform = `translate(${p.x - 4}px, ${p.y - 3}px) scale(${1 - 0.14 * press})`
        el.ring.style.opacity = ck > 0 && ck < 1 ? (1 - ck) * 0.9 * cv : 0
        el.ring.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.3 + ck * 0.9})`
      } else { el.cursor.style.opacity = 0; el.ring.style.opacity = 0 }
    }
  }

  if (!customElements.get('memory-garden-demo')) customElements.define('memory-garden-demo', MemoryGardenDemo)
})()

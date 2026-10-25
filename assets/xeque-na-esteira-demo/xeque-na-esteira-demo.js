/*!
 * Xeque na Esteira — demonstração animada
 * Web Component sem dependências. Tabuleiro, esteira, setas e peças em SVG/CSS feitos à mão;
 * o desenho das peças é o mesmo do jogo (js/pecas.js).
 *
 * Uso:
 *   <script src="xeque-na-esteira-demo.js" defer></script>
 *   <xeque-na-esteira-demo lang="pt"></xeque-na-esteira-demo>
 *
 * Atributos:
 *   lang="pt" | "en"     idioma (padrão: pt)
 *   play-url="…"         link do botão "Jogar de verdade" (padrão: o jogo no GitHub Pages)
 *   no-fonts             não carrega Big Shoulders Display / IBM Plex Sans do Google Fonts
 *
 * Pausa sozinha fora da tela, respeita prefers-reduced-motion e qualquer clique
 * nos controles (setas, capítulos, pausar) assume o controle.
 */
(() => {
  const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap'
  const PLAY_URL = 'https://gabrielajacottet.github.io/xeque-na-esteira/'

  const TEXT = {
    pt: {
      region: 'Demonstração animada do jogo Xeque na Esteira',
      brand: ['Xeque na ', 'Esteira'], demo: 'Demo',
      files: 'abcdefgh',
      beltCap: ['← a da esquerda cai quando lota', 'novas peças entram pela direita'], falls: 'cai',
      wave: (n) => `Onda ${n} de 5`, turn: (n) => `Turno ${n}`, queue: 'Ainda vão entrar',
      points: 'Pontos', captures: 'Capturas', difficulty: 'Dificuldade', normal: 'Normal',
      showArrows: 'Mostrar intenção dos inimigos',
      msgs: {
        threat: 'O cavalo inimigo quer pular para f3 e dar <b>xeque</b> no seu rei.',
        pick: 'Você pegou um <b>bispo</b> da esteira. Coloque nas 3 fileiras de baixo.',
        placed: 'O bispo em d1 <b>defende f3</b>. Agora é a vez dos inimigos…',
        enemy: 'Vez dos inimigos…',
        changed: 'O cavalo mudou de plano, mas parou na <b>mira da sua torre</b>.',
        select: 'Torre selecionada: ela anda em linha reta. e4 tem captura!',
        captured: 'Captura! Cavalo vale 3 → <b>+30 pontos</b>.',
        wave: 'Onda 3! Novos inimigos entram pela linha vermelha.',
        noArrows: 'Sem as setas, como no nível <b>Mestre</b>: você prevê sozinho.',
        arrowsBack: 'Setas de volta: dá para ver o que cada inimigo vai fazer.',
      },
      bubbles: { bishop: 'Daqui eu protejo o rei!', rook: 'Peguei!' },
      chapters: ['Esteira', 'Intenções', 'Captura', 'Ondas'],
      pause: 'Pausar', play: 'Reproduzir', restart: 'Recomeçar', playReal: 'Jogar de verdade',
      chapterLabel: (s) => `Ir para: ${s}`,
      howTitle: 'Como jogar',
      how: ['Uma ação por turno: <b>coloque</b> uma peça da esteira ou <b>mova</b> uma sua.', 'Toda peça anda e captura <b>como no xadrez</b>.', 'Perde com <b>xeque-mate</b>; vence ao derrotar a 5ª onda.'],
    },
    en: {
      region: 'Animated demo of the Xeque na Esteira chess game',
      brand: ['Xeque na ', 'Esteira'], demo: 'Demo',
      files: 'abcdefgh',
      beltCap: ['← leftmost piece drops when full', 'new pieces enter on the right'], falls: 'drops',
      wave: (n) => `Wave ${n} of 5`, turn: (n) => `Turn ${n}`, queue: 'Still coming',
      points: 'Points', captures: 'Captures', difficulty: 'Difficulty', normal: 'Normal',
      showArrows: 'Show enemy intentions',
      msgs: {
        threat: 'The enemy knight wants to jump to f3 and <b>check</b> your king.',
        pick: 'You took a <b>bishop</b> from the belt. Place it on the bottom 3 ranks.',
        placed: 'The bishop on d1 <b>guards f3</b>. Now the enemies move…',
        enemy: 'Enemy turn…',
        changed: 'The knight changed plans, but landed <b>in your rook’s line</b>.',
        select: 'Rook selected: it moves in straight lines. e4 is a capture!',
        captured: 'Capture! A knight is worth 3 → <b>+30 points</b>.',
        wave: 'Wave 3! New enemies enter on the red rank.',
        noArrows: 'No arrows, like <b>Master</b> level: you predict on your own.',
        arrowsBack: 'Arrows back on: you can see what each enemy will do.',
      },
      bubbles: { bishop: 'I’ve got the king covered!', rook: 'Got you!' },
      chapters: ['Belt', 'Intentions', 'Capture', 'Waves'],
      pause: 'Pause', play: 'Play', restart: 'Restart', playReal: 'Play the real game',
      chapterLabel: (s) => `Go to: ${s}`,
      howTitle: 'How to play',
      how: ['One action per turn: <b>place</b> a piece from the belt or <b>move</b> one of yours.', 'Every piece moves and captures <b>like in chess</b>.', 'Lose to <b>checkmate</b>; win by beating the 5th wave.'],
    },
  }

  /* ---------- desenho das peças: o mesmo do jogo (js/pecas.js) ---------- */
  const PAL = {
    w: { body: '#f3ead6', shade: '#c9b996', accent: '#3a64c8', trim: '#f2c14e', skin: '#f3d2ae', hair: '#7a4a26', beard: '#f1ece2', metal: '#c3cbd6', line: '#2b2116', angry: false },
    b: { body: '#a3303f', shade: '#5d1821', accent: '#2f2a38', trim: '#cfa246', skin: '#d9ad8c', hair: '#1f1512', beard: '#55525a', metal: '#80868f', line: '#170b0d', angry: true },
  }
  function eyes(P, x1, x2, y, r = 2.6) { const L = P.line; let s = `<circle cx="${x1}" cy="${y}" r="${r}" fill="${L}" stroke="none"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${L}" stroke="none"/><circle cx="${x1 + 0.8}" cy="${y - 0.9}" r=".9" fill="#fff" stroke="none"/><circle cx="${x2 + 0.8}" cy="${y - 0.9}" r=".9" fill="#fff" stroke="none"/>`; if (P.angry) s += `<path d="M${x1 - 4.5} ${y - 6.5}L${x1 + 3} ${y - 3.5}M${x2 + 4.5} ${y - 6.5}L${x2 - 3} ${y - 3.5}" fill="none" stroke-width="2.8"/>`; return s }
  function mouth(P, x, y) { return `<path d="M${x - 4} ${y + (P.angry ? 1 : 0)}Q${x} ${y + (P.angry ? -2.5 : 3.5)} ${x + 4} ${y + (P.angry ? 1 : 0)}" fill="none" stroke-width="2"/>` }
  function pieceSVG(t, side) {
    const P = PAL[side], L = P.line; let g = ''
    if (t === 'p') g = `<path d="M33 88Q33 62 50 60Q67 62 67 88Z" fill="${P.accent}"/><line x1="73" y1="30" x2="73" y2="86" stroke-width="3.5"/><path d="M73 17L78.5 31H67.5Z" fill="${P.metal}"/><circle cx="50" cy="46" r="14" fill="${P.skin}"/><path d="M35 45Q35 27 50 27Q65 27 65 45Z" fill="${P.metal}"/><rect x="33" y="41" width="34" height="6" rx="2" fill="${P.metal}"/><circle cx="36" cy="73" r="10" fill="${P.trim}"/><circle cx="36" cy="73" r="3.5" fill="${P.accent}"/>${eyes(P, 45, 55, 52)}${mouth(P, 50, 57)}`
    if (t === 'n') {
      let h = `<path d="M34 88L36 66Q30 46 40 32L46 22Q56 22 64 30L80 46Q86 52 82 58Q78 62 72 60L64 58Q60 62 62 72L66 88Z" fill="${P.body}"/><path d="M46 22Q34 26 36 38Q28 42 32 52Q26 58 32 66L36 66Q30 46 40 32Z" fill="${P.accent}"/><path d="M48 24L46 11L56 23Z" fill="${P.body}"/><path d="M55 31L72 56" fill="none" stroke="${P.trim}" stroke-width="3.5"/><circle cx="63" cy="43" r="2.6" fill="${P.trim}" stroke="none"/><circle cx="57" cy="37" r="3.4" fill="${L}" stroke="none"/><circle cx="58" cy="36" r="1.1" fill="#fff" stroke="none"/><circle cx="78" cy="52" r="1.9" fill="${L}" stroke="none"/><path d="M70 58Q74 59.5 78 57" fill="none" stroke-width="2"/>`
      if (P.angry) h += '<path d="M51 30L62 34" fill="none" stroke-width="3"/>'
      g = side === 'b' ? `<g transform="translate(100 0) scale(-1 1)">${h}</g>` : h
    }
    if (t === 'b') g = `<path d="M32 88Q35 58 50 55Q65 58 68 88Z" fill="${P.body}"/><path d="M43 57L57 88" fill="none" stroke="${P.accent}" stroke-width="5"/><line x1="75" y1="28" x2="75" y2="86" stroke-width="3.5"/><path d="M75 30Q74 17 83 19Q88 26 81 30" fill="none" stroke="${P.trim}" stroke-width="4"/><circle cx="50" cy="45" r="11" fill="${P.skin}"/><path d="M39 47Q50 71 61 47Q56 54 50 54Q44 54 39 47Z" fill="${P.beard}"/><path d="M38 39Q37 18 50 6Q63 18 62 39Z" fill="${P.accent}"/><path d="M38.5 34H61.5" fill="none" stroke="${P.trim}" stroke-width="3"/><path d="M50 10L45 25" fill="none" stroke-width="2.5"/>${eyes(P, 46, 54, 44, 2.3)}`
    if (t === 'r') {
      g = `<line x1="50" y1="15" x2="50" y2="2" stroke-width="2.5"/><path d="M50 2L63 6.5L50 11Z" fill="${P.trim}"/><path d="M27 36V15H35V23H45V15H55V23H65V15H73V36Z" fill="${P.body}"/><rect x="31" y="34" width="38" height="54" fill="${P.body}"/><rect x="27" y="32" width="46" height="7" rx="2" fill="${P.shade}"/><path d="M31 64H69M31 77H69M44 64V77M56 77V88M38 77V88M62 64V77" fill="none" stroke="${P.shade}" stroke-width="2"/><path d="M43 88V77Q50 68 57 77V88Z" fill="${P.accent}"/><rect x="35" y="44" width="12" height="14" rx="6" fill="#fff8e8"/><rect x="53" y="44" width="12" height="14" rx="6" fill="#fff8e8"/><circle cx="42" cy="52" r="3" fill="${L}" stroke="none"/><circle cx="58" cy="52" r="3" fill="${L}" stroke="none"/>`
      if (P.angry) g += '<path d="M34 42L46 46M66 42L54 46" fill="none" stroke-width="3"/>'
    }
    if (t === 'q') g = `<path d="M35 52Q33 28 50 27Q67 28 65 52Q65 64 58 66H42Q35 64 35 52Z" fill="${P.hair}"/><path d="M28 88Q33 60 50 57Q67 60 72 88Z" fill="${P.accent}"/><path d="M50 60V88" fill="none" stroke="${P.trim}" stroke-width="2.5"/><path d="M42 60Q50 67 58 60" fill="none" stroke="${P.trim}" stroke-width="3"/><circle cx="50" cy="44" r="11" fill="${P.skin}"/><path d="M38 34L39 19L45 27L50 14L55 27L61 19L62 34Z" fill="${P.trim}"/><circle cx="50" cy="29" r="2.3" fill="${P.angry ? '#ef5b4f' : '#3a64c8'}" stroke="none"/>${eyes(P, 46, 54, 44, 2.3)}${mouth(P, 50, 50)}`
    if (t === 'k') g = `<path d="M25 88Q28 58 50 54Q72 58 75 88Z" fill="${P.accent}"/><path d="M27 80Q50 86 73 80L75 88H25Z" fill="#fbf7ef"/><circle cx="37" cy="84.5" r="1.5" fill="${L}" stroke="none"/><circle cx="50" cy="86" r="1.5" fill="${L}" stroke="none"/><circle cx="63" cy="84.5" r="1.5" fill="${L}" stroke="none"/><circle cx="50" cy="42" r="12" fill="${P.skin}"/><path d="M37 45Q50 72 63 45Q57 53 50 53Q43 53 37 45Z" fill="${P.beard}"/><path d="M36 32V17L43 24L50 13L57 24L64 17V32Z" fill="${P.trim}"/><path d="M50 3V13M45.5 7.5H54.5" fill="none" stroke-width="3"/>${eyes(P, 45, 55, 41)}`
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="50" cy="89" rx="31" ry="7.5" fill="${P.shade}"/>${g}</g></svg>`
  }

  /* ---------- posição inicial (linha 0 = 8ª fileira, onde os inimigos entram) ---------- */
  const START = [
    { id: 'wk', t: 'k', s: 'w', r: 7, c: 4 },
    { id: 'wr', t: 'r', s: 'w', r: 4, c: 0 },
    { id: 'wp1', t: 'p', s: 'w', r: 6, c: 2 },
    { id: 'wp2', t: 'p', s: 'w', r: 6, c: 7 },
    { id: 'bn', t: 'n', s: 'b', r: 3, c: 6 },
    { id: 'bp', t: 'p', s: 'b', r: 2, c: 3 },
    { id: 'bb', t: 'b', s: 'b', r: 1, c: 1 },
    { id: 'wb', t: 'b', s: 'w', r: 7, c: 3, hidden: true },
    { id: 'bp2', t: 'p', s: 'b', r: 0, c: 2, hidden: true },
    { id: 'bn2', t: 'n', s: 'b', r: 0, c: 6, hidden: true },
  ]
  const BELT_START = ['p', 'b', 'n', 'p', 'r']
  const ROOK_TARGETS = [[4, 1], [4, 2], [4, 3], [3, 0], [2, 0], [1, 0], [0, 0], [5, 0], [6, 0], [7, 0]]
  const ARROWS_1 = [[3, 6, 5, 5], [2, 3, 3, 3]]
  const ARROWS_2 = [[4, 4, 6, 5], [3, 3, 4, 3]]
  const ARROWS_3 = [[3, 3, 4, 3], [0, 6, 2, 5], [0, 2, 1, 2]]
  const LOOP = 16800
  const CHAPTERS = [0, 4300, 6900, 9700]

  const ease = {
    io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t,
    back: (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) },
    lin: (t) => t,
  }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const lerp = (a, b, t) => a + (b - a) * t

  class Val {
    constructor(v) { this.from = v; this.to = v; this.t0 = 0; this.d = 0; this.e = ease.io }
    get(now) {
      if (!this.d || now >= this.t0 + this.d) return this.to
      if (now <= this.t0) return this.from
      return lerp(this.from, this.to, this.e((now - this.t0) / this.d))
    }
    go(now, to, d = 0, e = ease.io, delay = 0) { this.from = this.get(now + delay); this.to = to; this.t0 = now + delay; this.d = d; this.e = e }
  }

  const CSS = `
:host { display: block; container-type: inline-size; color-scheme: dark;
  --bg: #141824; --panel: #1e2433; --panel-2: #272f42; --line: #343d55; --fg: #ece6d8; --muted: #9aa3b8;
  --sq-light: #e8d8b8; --sq-dark: #b48a5a; --frame: #4a3826; --danger: #ef5b4f; --safe: #4fb36a; --gold: #f2c14e;
  --belt: #2a3142; --belt-stripe: #333b50;
  --display: 'Big Shoulders Display', 'Arial Narrow', Impact, sans-serif; --body: 'IBM Plex Sans', system-ui, sans-serif;
  font-family: var(--body); font-size: 15px; line-height: 1.5; color: var(--fg); -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; margin: 0; padding: 0; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
a { color: inherit; }
button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
.stage { position: relative; background: var(--bg); border: 1px solid var(--line); border-radius: 22px; overflow: hidden; isolation: isolate;
  box-shadow: 0 24px 48px -28px rgba(0,0,0,.7); }
.inner { padding: 20px 22px 0; }
.top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
.brand { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 800; font-size: 1.5rem; text-transform: uppercase; letter-spacing: .02em; line-height: 1; }
.brand svg { width: 34px; height: 34px; }
.brand span { color: var(--gold); }
.tag { font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 3px 10px; }
.main { display: grid; grid-template-columns: minmax(0, 440px) minmax(0, 1fr); grid-template-rows: auto auto 1fr; column-gap: 22px; row-gap: 12px; align-items: start; }
.boardwrap { grid-column: 1; grid-row: 1 / 4; }
.main > .status, .main > .card { grid-column: 2; }
.main { grid-template-rows: auto auto auto 1fr; }
.boardwrap { grid-row: 1 / 5; }
.how ol { padding-left: 18px; display: flex; flex-direction: column; gap: 6px; color: var(--muted); font-size: .86rem; }
.how b { color: var(--fg); font-weight: 500; }
.boardwrap { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.frame { position: relative; background: var(--frame); padding: 8px; border-radius: 10px; }
.board { position: relative; aspect-ratio: 1; border-radius: 3px; overflow: hidden; display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); }
.sq.l { background: var(--sq-light); } .sq.d { background: var(--sq-dark); }
.spawnrow { position: absolute; left: 0; right: 0; top: 0; height: 12.5%; background-color: rgba(239,91,79,.16);
  background-image: repeating-linear-gradient(-45deg, transparent 0 8px, rgba(239,91,79,.14) 8px 14px); background-size: 40px 40px; }
.layer { position: absolute; inset: 0; pointer-events: none; }
.cellfx { position: absolute; width: 12.5%; height: 12.5%; }
.zone { position: absolute; left: 0; right: 0; top: 62.5%; height: 37.5%; background: var(--safe); opacity: 0; }
.threat { background: var(--danger); }
.sel { box-shadow: inset 0 0 0 4px var(--gold); }
.dot::after { content: ""; position: absolute; left: 35%; top: 35%; width: 30%; height: 30%; border-radius: 50%; background: var(--safe); }
.capring::after { content: ""; position: absolute; inset: 8%; border-radius: 50%; border: 4px solid var(--safe); }
.guard { position: absolute; inset: 0; width: 100%; height: 100%; }
.pc { position: absolute; left: 0; top: 0; width: 12.5%; height: 12.5%; }
.pc > div { width: 100%; height: 100%; display: grid; place-items: center; }
.pc svg { width: 92%; height: 92%; display: block; overflow: visible; filter: drop-shadow(0 2px 0 rgba(0,0,0,.3)); }
.arrows { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 3; }
.fx { position: absolute; inset: 8px; pointer-events: none; overflow: visible; }
.ring { position: absolute; width: 12.5%; height: 12.5%; border: 3px solid var(--c); border-radius: 50%; }
.shard { position: absolute; width: 7px; height: 7px; margin: -3.5px; border-radius: 2px; }
.pop { position: absolute; transform: translate(-50%, -50%); font-family: var(--display); font-weight: 800; font-size: 1.6rem; color: var(--gold); text-shadow: 0 2px 0 rgba(0,0,0,.5); white-space: nowrap; }
.banner { position: absolute; left: 50%; top: 44%; z-index: 6; background: var(--gold); color: #241c08; font-family: var(--display); font-weight: 800; font-size: 2rem; text-transform: uppercase; padding: 6px 24px; border-radius: 8px; opacity: 0; white-space: nowrap; }
.bubble { position: absolute; z-index: 7; background: #fffaf0; color: #2a1a10; border-radius: 12px; padding: 7px 12px; font-weight: 600; font-size: .84rem; line-height: 1.3; width: max-content; max-width: 200px; box-shadow: 0 6px 16px rgba(0,0,0,.4); opacity: 0; }
.bubble::after { content: ""; position: absolute; bottom: -6px; left: 22px; width: 12px; height: 12px; background: #fffaf0; transform: rotate(45deg); }
.files { display: grid; grid-template-columns: repeat(8, 1fr); font-size: .7rem; color: var(--muted); text-align: center; letter-spacing: .08em; padding: 0 8px; margin-top: -4px; }
.belt { position: relative; overflow: hidden; border-radius: 12px; padding: 10px 34px; border: 1px solid var(--line);
  background: repeating-linear-gradient(115deg, var(--belt) 0 14px, var(--belt-stripe) 14px 24px); background-size: 200% 100%; }
.wheel { position: absolute; top: 50%; width: 18px; height: 18px; margin-top: -9px; border-radius: 50%; background: conic-gradient(#5b6585 0 25%, #3a4158 0 50%, #5b6585 0 75%, #3a4158 0); }
.wheel.l { left: 9px; } .wheel.r { right: 9px; }
.track { position: relative; aspect-ratio: 5.6 / 1; }
.slot { position: absolute; left: 0; top: 0; width: calc((100% - 32px) / 5); height: 100%; border-radius: 8px; background: var(--sq-light); display: grid; place-items: center; }
.slot svg { width: 72%; height: 90%; display: block; overflow: visible; filter: drop-shadow(0 2px 0 rgba(0,0,0,.3)); }
.slot.edge { background: #d9c7a3; }
.slot .falls { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; background: var(--danger); color: #fff; padding: 1px 6px; border-radius: 999px; opacity: 0; }
.beltcap { display: flex; justify-content: space-between; gap: 12px; font-size: .74rem; color: var(--muted); }
aside { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.card h2 { font-family: var(--display); font-weight: 600; font-size: 1.3rem; letter-spacing: .03em; text-transform: uppercase; line-height: 1; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-variant-numeric: tabular-nums; }
.muted { color: var(--muted); font-size: .84rem; }
.status { position: relative; min-height: 84px; background: var(--panel-2); border-left: 4px solid var(--gold); padding: 12px 14px; }
.status p { position: absolute; inset: 12px 14px; font-size: .92rem; line-height: 1.4; }
.status b { color: var(--gold); font-weight: 600; }
.bar { height: 8px; background: var(--panel-2); border-radius: 999px; overflow: hidden; }
.bar i { display: block; height: 100%; width: 0; background: var(--gold); border-radius: 999px; }
.queue { display: flex; gap: 6px; min-height: 32px; }
.queue span { width: 32px; height: 32px; display: grid; place-items: center; background: var(--sq-light); border-radius: 8px; }
.queue svg { width: 28px; height: 28px; display: block; }
.score { display: flex; align-items: end; justify-content: space-between; gap: 12px; }
.score b { font-family: var(--display); font-weight: 800; font-size: 2.6rem; line-height: .9; color: var(--fg); font-variant-numeric: tabular-nums; }
.tg { display: flex; align-items: center; gap: 8px; font-size: .86rem; cursor: pointer; }
.tg input { accent-color: var(--gold); width: 16px; height: 16px; cursor: pointer; }
.foot { display: flex; justify-content: space-between; align-items: center; gap: 12px 16px; flex-wrap: wrap; margin-top: 18px; padding: 12px 22px; border-top: 1px solid var(--line); background: var(--panel); }
.chapters { display: flex; gap: 6px; flex-wrap: wrap; }
.chapters button { font-size: .8rem; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); }
.chapters button i { font-style: normal; font-family: var(--display); font-weight: 800; margin-right: 5px; }
.chapters button.on { color: var(--gold); border-color: currentColor; background: var(--panel-2); }
.ctrl { display: flex; gap: 6px; flex-wrap: wrap; }
.ctrl button, .ctrl a { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel-2); font-size: .84rem; font-weight: 500; text-decoration: none; }
.ctrl a { background: var(--gold); color: #241c08; border-color: transparent; }
.cursor { position: absolute; left: 0; top: 0; width: 26px; height: 26px; pointer-events: none; z-index: 20; opacity: 0; filter: drop-shadow(0 3px 4px rgba(0,0,0,.45)); }
.click { position: absolute; left: 0; top: 0; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2px solid var(--gold); pointer-events: none; z-index: 19; opacity: 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@container (max-width: 760px) {
  .main { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
  .boardwrap, .main > .status, .main > .card { grid-column: 1; grid-row: auto; }
  .main > .status { order: -1; }
  .how { display: none !important; }
  .inner { padding: 16px 14px 0; }
  .foot { padding: 12px 14px; }
  .status { min-height: 72px; }
}
@container (max-width: 420px) {
  .beltcap span:last-child { display: none; }
  .ctrl button span { display: none; }
  .brand { font-size: 1.25rem; }
}
`

  const NS = 'http://www.w3.org/2000/svg'
  const PLAY_I = '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7Z" fill="currentColor"/></svg>'
  const PAUSE_I = '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>'

  class XequeDemo extends HTMLElement {
    connectedCallback() {
      if (this.root) return
      const lang = (this.getAttribute('lang') || 'pt').slice(0, 2)
      this.T = TEXT[lang] || TEXT.pt
      if (!this.hasAttribute('no-fonts') && !document.querySelector('link[data-xne-fonts]')) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = FONT_HREF; link.dataset.xneFonts = ''
        document.head.appendChild(link)
      }
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      this.root = this.attachShadow({ mode: 'open' })
      this.build()
      this.setup()
      if (this.reduced) { this.seek(9600); this.autoplay = false; this.setPlayLabel() }
      else { this.autoplay = true; this.initState(); this.setPlayLabel() }
      this.render()
      this.observe()
    }
    disconnectedCallback() { this.stopLoop(); this.io?.disconnect() }

    /* ---------- DOM ---------- */
    build() {
      const T = this.T
      let squares = ''
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) squares += `<div class="sq ${(r + c) % 2 ? 'd' : 'l'}"></div>`
      const dots = ROOK_TARGETS.map(([r, c]) => `<div class="cellfx dot" style="left:${c * 12.5}%;top:${r * 12.5}%"></div>`).join('')
      this.root.innerHTML = `<style>${CSS}</style>
      <div class="stage" role="region" aria-label="${T.region}">
        <div class="inner">
          <div class="top">
            <div class="brand">${pieceSVG('k', 'w')}<div>${T.brand[0]}<span>${T.brand[1]}</span></div></div>
            <span class="tag">${T.demo}</span>
          </div>
          <div class="main">
            <div class="boardwrap">
              <div class="frame">
                <div class="board">${squares}
                  <div class="spawnrow"></div>
                  <div class="layer hl">
                    <div class="zone"></div>
                    <div class="cellfx threat" style="left:62.5%;top:62.5%"></div>
                    <svg class="guard" viewBox="0 0 8 8" aria-hidden="true"><line x1="3.5" y1="7.5" x2="5.5" y2="5.5" stroke="#4fb36a" stroke-width=".09" stroke-linecap="round" stroke-dasharray=".16 .1"/><circle cx="5.5" cy="5.5" r=".36" fill="none" stroke="#4fb36a" stroke-width=".07"/></svg>
                    <div class="cellfx sel"></div>
                    <div class="dots">${dots}</div>
                    <div class="cellfx capring" style="left:50%;top:50%"></div>
                  </div>
                  <svg class="arrows" viewBox="0 0 8 8" aria-hidden="true"><defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M1 1L9 5L1 9Z" fill="#ef5b4f"/></marker></defs></svg>
                  <div class="layer pieces"></div>
                </div>
                <div class="fx"><div class="banner"></div><div class="bubble"></div></div>
              </div>
              <div class="files" aria-hidden="true">${[...T.files].map((f) => `<span>${f}</span>`).join('')}</div>
              <div class="belt"><span class="wheel l"></span><span class="wheel r"></span><div class="track"></div></div>
              <div class="beltcap"><span>${T.beltCap[0]}</span><span>${T.beltCap[1]}</span></div>
            </div>
              <div class="status" aria-live="polite"><p class="m1"></p><p class="m2"></p></div>
              <div class="card">
                <div class="row"><h2 class="wave"></h2><span class="muted turn"></span></div>
                <div class="bar"><i></i></div>
                <div class="row"><span class="muted">${T.queue}</span></div>
                <div class="queue"></div>
              </div>
              <div class="card">
                <div class="score"><div><div class="muted">${T.points}</div><b class="pts"></b></div>
                  <div style="text-align:right"><div class="muted">${T.captures}</div><b class="caps" style="font-size:1.6rem"></b></div></div>
                <label class="tg"><input type="checkbox" class="opt" checked> ${T.showArrows}</label>
                <div class="row"><span class="muted">${T.difficulty}</span><span style="color:var(--gold);font-weight:600">${T.normal}</span></div>
              </div>
              <div class="card how"><h2>${T.howTitle}</h2><ol>${T.how.map((h) => `<li>${h}</li>`).join('')}</ol></div>
          </div>
        </div>
        <div class="foot">
          <div class="chapters">${T.chapters.map((s, i) => `<button type="button" data-i="${i}" aria-label="${T.chapterLabel(s)}"><i>${['i', 'ii', 'iii', 'iv'][i]}.</i>${s}</button>`).join('')}</div>
          <div class="ctrl">
            <button type="button" class="b-play"></button>
            <button type="button" class="b-restart"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${T.restart}</span></button>
            <a class="b-real" href="${this.getAttribute('play-url') || PLAY_URL}" target="_blank" rel="noopener">${T.playReal} →</a>
          </div>
        </div>
        <span class="click"></span>
        <svg class="cursor" viewBox="0 0 26 26" aria-hidden="true"><path d="M4 2.5 21 13.6l-7.6 1.4 4.2 7.6-3.3 1.8-4.2-7.7L4.6 21.6Z" fill="#fff" stroke="#141824" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>`

      const $ = (s) => this.root.querySelector(s), $$ = (s) => [...this.root.querySelectorAll(s)]
      this.el = {
        stage: $('.stage'), board: $('.board'), frame: $('.frame'), fx: $('.fx'), spawn: $('.spawnrow'),
        zone: $('.zone'), threat: $('.threat'), guard: $('.guard'), sel: $('.sel'), dots: $('.dots'), capring: $('.capring'),
        arrows: $('.arrows'), pieces: $('.pieces'), banner: $('.banner'), bubble: $('.bubble'),
        belt: $('.belt'), wheels: $$('.wheel'), track: $('.track'),
        m: [$('.m1'), $('.m2')], status: $('.status'), wave: $('.wave'), turn: $('.turn'), bar: $('.bar i'), queue: $('.queue'),
        pts: $('.pts'), caps: $('.caps'), opt: $('.opt'), chapters: $$('.chapters button'),
        play: $('.b-play'), restart: $('.b-restart'), cursor: $('.cursor'), click: $('.click'),
      }
    }

    setup() {
      this.clock = 0; this.sc = 0; this.prevSc = -1; this.timers = []; this.fxList = []
      this.pieces = START.map((p) => {
        const node = document.createElement('div'); node.className = 'pc'
        node.innerHTML = `<div>${pieceSVG(p.t, p.s)}</div>`
        this.el.pieces.appendChild(node)
        return { ...p, node, inner: node.firstChild, fr: p.r, fc: p.c, mv: new Val(1), jump: false, op: new Val(1), place: new Val(1), bounce: new Val(0) }
      })
      this.byId = Object.fromEntries(this.pieces.map((p) => [p.id, p]))
      Object.assign(this, {
        zoneV: new Val(0), threatV: new Val(0), guardV: new Val(0), selV: new Val(0), dotsV: new Val(0), capV: new Val(0),
        arrowsOn: new Val(1), bannerV: new Val(0), bubbleV: new Val(0), barV: new Val(0), ptsV: new Val(0), boardOp: new Val(1),
        msgA: new Val(1), msgIdx: 0, msgs: ['', ''], statusKind: 'warn',
        cur: { fromX: 0, fromY: 0, target: null, p: new Val(1), vis: new Val(0), click: new Val(0) },
      })
      this.el.pieces.style.zIndex = 2
      this.arrowSets = []

      this.setPlayLabel()
      this.el.opt.addEventListener('change', (e) => {
        if (e.isTrusted) this.takeOver()
        this.setArrows(this.el.opt.checked, true)
      })
      this.el.chapters.forEach((b) => b.addEventListener('click', () => {
        this.seek(CHAPTERS[+b.dataset.i]); this.autoplay = !this.reduced || this.autoplay; this.setPlayLabel(); this.wake()
      }))
      this.el.play.addEventListener('click', () => {
        if (this.autoplay) { this.autoplay = false; this.cur.vis.go(this.clock, 0, 250) }
        else if (this.dirty) { this.seek(0); this.autoplay = true }
        else { this.autoplay = true; this.cur.vis.go(this.clock, 1, 250) }
        this.setPlayLabel(); this.wake()
      })
      this.el.restart.addEventListener('click', () => { this.seek(0); this.autoplay = true; this.setPlayLabel(); this.wake() })
      this.ro = new ResizeObserver(() => this.render()); this.ro.observe(this)
    }

    setPlayLabel() {
      const on = this.autoplay
      this.el.play.innerHTML = (on ? PAUSE_I : PLAY_I) + `<span>${on ? this.T.pause : this.T.play}</span>`
      this.el.play.setAttribute('aria-label', on ? this.T.pause : this.T.play)
    }
    takeOver() {
      this.dirty = true
      if (!this.autoplay) return
      this.autoplay = false; this.cur.vis.go(this.clock, 0, 200); this.setPlayLabel()
    }
    after(ms, fn) { this.timers.push({ at: this.clock + ms, fn }); this.timers.sort((a, b) => a.at - b.at) }

    /* ---------- estado ---------- */
    initState() {
      const now = this.clock
      this.timers = []
      this.fxList.forEach((f) => f.node.remove()); this.fxList = []
      for (const p of this.pieces) {
        const s = START.find((x) => x.id === p.id)
        Object.assign(p, { r: s.r, c: s.c, fr: s.r, fc: s.c, hidden: !!s.hidden, jump: false })
        p.mv.go(now, 1); p.op.go(now, s.hidden ? 0 : 1); p.place.go(now, 1); p.bounce.go(now, 0)
      }
      this.belt = BELT_START.map((t, i) => this.makeSlot(t, i))
      this.el.track.replaceChildren(...this.belt.map((b) => b.node))
      for (const v of [this.zoneV, this.guardV, this.selV, this.dotsV, this.capV, this.bannerV, this.bubbleV]) v.go(now, 0)
      this.threatV.go(now, 1)
      this.boardOp.go(now, 1)
      this.showArrows = true; this.el.opt.checked = true; this.arrowsOn.go(now, 1)
      this.setArrowSet(ARROWS_1, true)
      this.waveN = 2; this.turnN = 6; this.barV.go(now, 0.55); this.ptsV.go(now, 120); this.capsN = 3
      this.setQueue(['p', 'p'])
      this.say('threat', 'warn', true)
      this.chapter = 0
      this.dirty = false
    }

    makeSlot(t, i) {
      const node = document.createElement('div'); node.className = 'slot'
      node.innerHTML = `${pieceSVG(t, 'w')}<span class="falls">${this.T.falls}</span>`
      return { t, node, pos: new Val(i), arrive: new Val(0), op: new Val(1), lift: new Val(0) }
    }

    setQueue(list) {
      this.el.queue.innerHTML = list.map((t) => `<span>${pieceSVG(t, 'b')}</span>`).join('')
    }

    say(key, kind, instant) {
      const now = this.clock, html = this.T.msgs[key]
      this.statusKind = kind
      const next = 1 - this.msgIdx
      this.msgs[next] = html; this.msgIdx = next
      this.el.m[next].innerHTML = html
      this.msgA.go(now, next, instant ? 0 : 320, ease.io)
    }

    setArrowSet(list, instant) {
      const now = this.clock
      for (const a of this.arrowSets) { a.op.go(now, 0, instant ? 0 : 280); a.dead = true }
      const sh = 0.28
      for (const [r1, c1, r2, c2] of list) {
        const x1 = c1 + 0.5, y1 = r1 + 0.5, x2 = c2 + 0.5, y2 = r2 + 0.5
        const ln = document.createElementNS(NS, 'line')
        ln.setAttribute('x1', x1 + (x2 - x1) * sh); ln.setAttribute('y1', y1 + (y2 - y1) * sh)
        ln.setAttribute('x2', x2 - (x2 - x1) * sh); ln.setAttribute('y2', y2 - (y2 - y1) * sh)
        ln.setAttribute('stroke', '#ef5b4f'); ln.setAttribute('stroke-width', '.09'); ln.setAttribute('stroke-linecap', 'round')
        ln.setAttribute('stroke-dasharray', '.16 .1'); ln.setAttribute('marker-end', 'url(#ah)')
        this.el.arrows.appendChild(ln)
        const op = new Val(0); op.go(now, 1, instant ? 0 : 360, ease.out, instant ? 0 : 120)
        this.arrowSets.push({ ln, op, key: `${r1}${c1}${r2}${c2}` })
      }
    }
    dropArrow(r1, c1) {
      for (const a of this.arrowSets) if (!a.dead && a.key.startsWith(`${r1}${c1}`)) { a.op.go(this.clock, 0, 250); a.dead = true }
    }
    setArrows(on, fromScript) {
      this.showArrows = on; this.el.opt.checked = on
      this.arrowsOn.go(this.clock, on ? 1 : 0, 300)
      if (fromScript) this.say(on ? 'arrowsBack' : 'noArrows', on ? 'good' : 'warn')
      this.wake()
    }

    move(id, r, c, d, jump) {
      const p = this.byId[id], now = this.clock
      const cur = this.piecePos(p)
      p.fr = cur.r; p.fc = cur.c; p.r = r; p.c = c; p.jump = !!jump
      p.mv.go(now, 0); p.mv.go(now, 1, d, jump ? ease.io : ease.out)
      p.bounce.go(now, 0); p.bounce.go(now, 1, 280, ease.out, d)
    }
    appear(id, delay = 0) {
      const p = this.byId[id], now = this.clock
      p.hidden = false
      p.op.go(now, 0); p.op.go(now, 1, 160, ease.out, delay)
      p.place.go(now, 0); p.place.go(now, 1, 460, ease.back, delay)
    }
    vanish(id, d = 220) { const p = this.byId[id]; p.op.go(this.clock, 0, d, ease.in); this.after(d, () => { p.hidden = true }) }

    fx(type, r, c, opt = {}) {
      const node = document.createElement('div'); node.className = type
      if (opt.text) node.textContent = opt.text
      if (opt.color) node.style.setProperty('--c', opt.color)
      if (type === 'shard') node.style.background = opt.color
      this.el.fx.appendChild(node)
      this.fxList.push({ type, r, c, node, t0: this.clock, life: opt.life || 600, ...opt })
    }
    burst(r, c, colors) {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + 0.2, dist = 34 + (i % 3) * 14
        this.fx('shard', r, c, { color: colors[i % colors.length], tx: Math.cos(a) * dist, ty: Math.sin(a) * dist, rot: (i * 97) % 540, life: 700 })
      }
      this.fx('ring', r, c, { color: colors[0], life: 520 })
    }

    bubble(id, key, dur) {
      this.bubbleFor = id; this.el.bubble.textContent = this.T.bubbles[key]
      this.bubbleV.go(this.clock, 1, 260, ease.back); this.bubbleV.go(this.clock, 0, 260, ease.in, dur)
    }

    /* ---------- roteiro (ms) ---------- */
    script() {
      const T = this.T, el = this.el
      const slot1 = () => this.belt[1]?.node
      return [
        [0, () => { this.initState(); this.moveCursor('rest', 0); this.cur.vis.go(this.clock, 1, 400) }],
        // i. esteira
        [700, () => this.moveCursor(slot1(), 760)],
        [1460, () => {
          this.click(); this.belt[1].lift.go(this.clock, 1, 220, ease.out)
          this.zoneV.go(this.clock, 0.16, 300); this.say('pick', 'info')
        }],
        [1800, () => this.moveCursor({ cell: [7, 3] }, 800)],
        [2600, () => {
          this.click()
          const s = this.belt.splice(1, 1)[0]
          s.op.go(this.clock, 0, 200); this.after(220, () => s.node.remove())
          this.appear('wb'); this.fx('ring', 7, 3, { color: '#4fb36a', life: 560 })
          this.zoneV.go(this.clock, 0, 250)
          this.belt.forEach((b, i) => b.pos.go(this.clock, i, 420, ease.io, 160))
          const q = this.makeSlot('q', 4); q.arrive.go(this.clock, 1.6); q.arrive.go(this.clock, 0, 480, ease.out, 420); q.op.go(this.clock, 0); q.op.go(this.clock, 1, 200, ease.out, 420)
          this.belt.push(q); el.track.appendChild(q.node)
          this.threatV.go(this.clock, 0, 400, ease.io, 300)
          this.guardV.go(this.clock, 1, 300, ease.out, 350); this.guardV.go(this.clock, 0, 400, ease.io, 1900)
          this.dropArrow(3, 6)
          this.say('placed', 'good')
          this.after(500, () => this.bubble('wb', 'bishop', 1700))
        }],
        // ii. intenções
        [4300, () => { this.chapter = 1; this.say('enemy', 'warn'); for (const a of this.arrowSets) if (!a.dead) { a.op.go(this.clock, 0, 220); a.dead = true } }],
        [4600, () => this.move('bn', 4, 4, 520, true)],
        [5150, () => this.move('bp', 3, 3, 360)],
        [5650, () => { this.turnN = 7; this.setArrowSet(ARROWS_2); this.say('changed', 'info') }],
        [6200, () => this.moveCursor({ cell: [4, 0] }, 700)],
        // iii. captura
        [6900, () => {
          this.chapter = 2; this.click()
          this.selV.go(this.clock, 1, 120); this.dotsV.go(this.clock, 1, 260, ease.out); this.capV.go(this.clock, 1, 260, ease.out)
          this.say('select', 'info')
        }],
        [7350, () => this.moveCursor({ cell: [4, 4] }, 720)],
        [8100, () => {
          this.click()
          this.selV.go(this.clock, 0, 150); this.dotsV.go(this.clock, 0, 150); this.capV.go(this.clock, 0, 150)
          this.move('wr', 4, 4, 380)
          this.after(340, () => {
            this.vanish('bn', 120); this.burst(4, 4, ['#a3303f', '#cfa246', '#f2c14e', '#5d1821'])
            this.fx('pop', 4, 4, { text: '+30', life: 1000 }); this.dropArrow(4, 4)
            this.ptsV.go(this.clock, 150, 650, ease.out); this.capsN = 4; this.turnN = 8
            this.barV.go(this.clock, 1, 600, ease.io, 200)
            this.say('captured', 'good')
          })
          this.after(650, () => this.bubble('wr', 'rook', 650))
        }],
        // iv. ondas
        [9700, () => {
          this.chapter = 3
          this.bannerV.go(this.clock, 1, 300, ease.back, 200); this.bannerV.go(this.clock, 0, 320, ease.in, 1500)
          this.waveN = 3; this.barV.go(this.clock, 0.08, 500, ease.io, 300)
          this.say('wave', 'warn')
          this.after(350, () => this.setQueue(['b', 'p', 'n', 'p']))
        }],
        [10250, () => {
          this.appear('bp2'); this.appear('bn2', 140)
          this.fx('ring', 0, 2, { color: '#ef5b4f', life: 560 }); this.after(140, () => this.fx('ring', 0, 6, { color: '#ef5b4f', life: 560 }))
        }],
        [11000, () => this.setArrowSet(ARROWS_3)],
        [11500, () => this.moveCursor(this.el.opt, 800)],
        [12300, () => { this.click(); this.setArrows(false, true) }],
        [13800, () => { this.click(); this.setArrows(true, true) }],
        [15200, () => { this.moveCursor('rest', 900); this.boardOp.go(this.clock, 0, 450, ease.io); this.arrowsOn.go(this.clock, 0, 450) }],
        [15700, () => { this.initState(); this.boardOp.go(this.clock, 0); this.boardOp.go(this.clock, 1, 500, ease.io, 250) }],
        [16300, () => this.cur.vis.go(this.clock, 0, 400)],
      ]
    }

    moveCursor(target, d) {
      const c = this.cur, p = this.cursorPoint()
      c.fromX = p.x; c.fromY = p.y; c.target = target
      c.p.go(this.clock, 0); c.p.go(this.clock, 1, d, ease.io)
    }
    click() { this.cur.click.go(this.clock, 0); this.cur.click.go(this.clock, 1, 520, ease.out) }
    targetPoint(t) {
      const s = this.el.stage.getBoundingClientRect()
      if (t === 'rest') return { x: s.width * 0.55, y: s.height - 26 }
      if (t && t.cell) {
        const b = this.el.board.getBoundingClientRect(), [r, c] = t.cell
        return { x: b.left - s.left + (c + 0.55) * b.width / 8, y: b.top - s.top + (r + 0.6) * b.height / 8 }
      }
      if (!t || !t.getBoundingClientRect) return this.targetPoint('rest')
      const r = t.getBoundingClientRect()
      return { x: r.left - s.left + r.width * 0.5, y: r.top - s.top + r.height * 0.55 }
    }
    cursorPoint() {
      const c = this.cur
      if (!c.target) return this.targetPoint('rest')
      const to = this.targetPoint(c.target), p = c.p.get(this.clock)
      return { x: lerp(c.fromX, to.x, p), y: lerp(c.fromY, to.y, p) }
    }
    piecePos(p) {
      const k = p.mv.get(this.clock)
      return { r: lerp(p.fr, p.r, k), c: lerp(p.fc, p.c, k), k }
    }

    /* ---------- relógio ---------- */
    tick(dt, draw = true) {
      this.clock += dt
      if (this.autoplay) {
        if (!this.events) this.events = this.script()
        this.sc += dt
        for (const [t, fn] of this.events) if (t > this.prevSc && t <= this.sc) fn()
        this.prevSc = this.sc
        if (this.sc >= LOOP) { this.sc = 0; this.prevSc = -1 }
      }
      while (this.timers.length && this.timers[0].at <= this.clock) this.timers.shift().fn()
      if (draw) this.render()
    }
    seek(ms) {
      const wasAuto = this.autoplay
      this.autoplay = true; this.sc = 0; this.prevSc = -1
      this.initState()
      while (this.sc < ms) this.tick(Math.min(40, ms - this.sc), false)
      this.cur.vis.go(this.clock, wasAuto || !this.reduced ? 1 : 0)
      this.autoplay = wasAuto
      this.dirty = false
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
    capture() { this.manual = true; this.stopLoop(); this.autoplay = true; this.setPlayLabel(); this.sc = 0; this.prevSc = -1; return { advance: (ms) => this.tick(ms) } }

    /* ---------- desenho ---------- */
    render() {
      const now = this.clock, el = this.el, T = this.T
      const still = this.reduced && !this.autoplay ? 0 : 1

      // esteira e faixa de entrada rodando
      el.belt.style.backgroundPosition = `${-((now * still) / 6000 % 1) * 100}% 0`
      el.wheels.forEach((w) => { w.style.transform = `rotate(${-(now * still / 1200 % 1) * 360}deg)` })
      el.spawn.style.backgroundPosition = `${(now * still / 1400 % 1) * 40}px 0`

      // fade geral do tabuleiro no fim do loop
      const bo = this.boardOp.get(now)
      el.pieces.style.opacity = bo; el.arrows.style.opacity = bo * this.arrowsOn.get(now)
      this.root.querySelector('.hl').style.opacity = bo

      // destaques
      el.zone.style.opacity = this.zoneV.get(now)
      const pulse = 0.5 + 0.5 * Math.sin(now / 260)
      el.threat.style.opacity = this.threatV.get(now) * (0.2 + 0.18 * pulse * still)
      el.guard.style.opacity = this.guardV.get(now)
      const rook = this.byId.wr, rp = this.piecePos(rook)
      el.sel.style.opacity = this.selV.get(now)
      el.sel.style.left = `${rp.c * 12.5}%`; el.sel.style.top = `${rp.r * 12.5}%`
      el.dots.style.opacity = this.dotsV.get(now); el.capring.style.opacity = this.capV.get(now)

      // setas de intenção (tracejado marchando)
      const march = -((now * still) / 600 % 1) * 0.52
      this.arrowSets = this.arrowSets.filter((a) => {
        const o = a.op.get(now)
        if (a.dead && o <= 0.001 && now > a.op.t0 + a.op.d) { a.ln.remove(); return false }
        a.ln.setAttribute('opacity', (o * 0.95).toFixed(3)); a.ln.setAttribute('stroke-dashoffset', march.toFixed(3))
        return true
      })

      // peças
      for (const p of this.pieces) {
        const op = p.op.get(now)
        if (p.hidden && op <= 0.001) { p.node.style.display = 'none'; continue }
        p.node.style.display = ''
        const { r, c, k } = this.piecePos(p)
        const moving = k > 0 && k < 1
        const arc = p.jump && moving ? -Math.sin(Math.PI * k) * 0.7 : 0
        const grow = moving ? 1 + (p.jump ? 0.4 : 0.15) * Math.sin(Math.PI * k) : 1
        const b = p.bounce.get(now), sq = b > 0 && b < 1 ? Math.sin(Math.PI * b) * 0.12 : 0
        const pl = p.place.get(now)
        p.node.style.transform = `translate(${c * 100}%, ${(r + arc) * 100}%)`
        p.node.style.zIndex = moving ? 3 : 1
        p.inner.style.transform = `translateY(${(1 - pl) * -55}%) scale(${(lerp(0.4, 1, pl) * grow * (1 + sq)).toFixed(3)}, ${(lerp(0.4, 1, pl) * grow * (1 - sq)).toFixed(3)})`
        p.node.style.opacity = op
      }

      // efeitos
      const bw = el.board.getBoundingClientRect().width || 1
      this.fxList = this.fxList.filter((f) => {
        const k = (now - f.t0) / f.life
        if (k >= 1 || k < 0) { if (k >= 1) { f.node.remove(); return false } f.node.style.opacity = 0; return true }
        const cx = (f.c + 0.5) * 12.5, cy = (f.r + 0.5) * 12.5
        if (f.type === 'ring') {
          Object.assign(f.node.style, { left: `${f.c * 12.5}%`, top: `${f.r * 12.5}%`, opacity: 1 - k, transform: `scale(${lerp(0.2, 1.6, ease.out(k))})` })
        } else if (f.type === 'shard') {
          const e = ease.out(k)
          Object.assign(f.node.style, { left: `${cx}%`, top: `${cy}%`, opacity: 1 - k, transform: `translate(${f.tx * e * bw / 440}px, ${f.ty * e * bw / 440}px) rotate(${f.rot * e}deg) scale(${1 - 0.8 * e})` })
        } else if (f.type === 'pop') {
          Object.assign(f.node.style, { left: `${cx}%`, top: `${cy}%`, opacity: k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85, marginTop: `${-48 * ease.out(k)}px` })
        }
        return true
      })

      // faixa "Onda 3"
      const bn = this.bannerV.get(now)
      el.banner.textContent = this.waveN === 3 ? (T.wave(3).split(' ').slice(0, 2).join(' ')) + '!' : ''
      el.banner.style.opacity = clamp(bn)
      el.banner.style.transform = `translate(-50%, -50%) translateY(${(1 - bn) * 14}px) scale(${lerp(0.8, 1, clamp(bn))})`

      // balão de fala
      const bv = this.bubbleV.get(now)
      el.bubble.style.opacity = clamp(bv)
      if (this.bubbleFor) {
        const p = this.byId[this.bubbleFor], pp = this.piecePos(p)
        const left = Math.min(pp.c * 12.5, 62)
        el.bubble.style.left = `${left}%`
        el.bubble.style.top = `${pp.r * 12.5}%`
        el.bubble.style.transform = `translate(-4px, calc(-100% - ${6 + (1 - bv) * 8}px)) scale(${lerp(0.7, 1, clamp(bv))})`
        el.bubble.style.transformOrigin = '20px 100%'
      }

      // painel
      const ma = this.msgA.get(now)
      el.m[0].style.opacity = 1 - ma; el.m[1].style.opacity = ma
      el.m[0].style.transform = `translateY(${ma * -6}px)`; el.m[1].style.transform = `translateY(${(1 - ma) * 6}px)`
      el.m[0].setAttribute('aria-hidden', String(ma > 0.5)); el.m[1].setAttribute('aria-hidden', String(ma <= 0.5))
      el.status.style.borderLeftColor = this.statusKind === 'warn' ? 'var(--danger)' : this.statusKind === 'good' ? 'var(--safe)' : 'var(--gold)'
      el.wave.textContent = T.wave(this.waveN); el.turn.textContent = T.turn(this.turnN)
      el.bar.style.width = `${this.barV.get(now) * 100}%`
      el.pts.textContent = Math.round(this.ptsV.get(now)); el.caps.textContent = this.capsN
      el.chapters.forEach((b, i) => { b.classList.toggle('on', i === this.chapter); b.setAttribute('aria-pressed', String(i === this.chapter)) })

      // esteira
      for (const [i, s] of (this.belt || []).entries()) {
        const pos = s.pos.get(now), lift = s.lift.get(now)
        s.node.style.transform = `translateX(calc(${pos + s.arrive.get(now)} * (100% + 8px))) translateY(${-3 * lift}px)`
        s.node.style.boxShadow = lift > 0.01 ? `0 0 0 ${3 * lift}px var(--safe)` : ''
        s.node.style.opacity = s.op.get(now)
        s.node.classList.toggle('edge', i === 0 && this.belt.length >= 5)
        s.node.querySelector('.falls').style.opacity = i === 0 && this.belt.length >= 5 ? 1 : 0
      }

      // cursor simulado
      const cv = this.cur.vis.get(now)
      if (cv > 0) {
        const p = this.cursorPoint(), ck = this.cur.click.get(now)
        const press = ck > 0 && ck < 1 ? Math.sin(Math.min(1, ck * 3) * Math.PI) : 0
        el.cursor.style.opacity = cv
        el.cursor.style.transform = `translate(${p.x - 4}px, ${p.y - 3}px) scale(${1 - 0.14 * press})`
        el.click.style.opacity = ck > 0 && ck < 1 ? (1 - ck) * 0.9 * cv : 0
        el.click.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.3 + ck * 0.9})`
      } else { el.cursor.style.opacity = 0; el.click.style.opacity = 0 }
    }
  }

  if (!customElements.get('xeque-na-esteira-demo')) customElements.define('xeque-na-esteira-demo', XequeDemo)
})()

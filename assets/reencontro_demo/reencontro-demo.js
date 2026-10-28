/*!
 * Reencontro — demonstração animada
 * Web Component sem dependências. Celular, telas do app, animais e gráficos em SVG/CSS feitos à mão.
 *
 * Uso:
 *   <script src="reencontro-demo.js" defer></script>
 *   <reencontro-demo lang="pt"></reencontro-demo>
 *
 * Atributos:
 *   lang="pt" | "en"     idioma (padrão: pt)
 *   app-url="…"          link do botão "Abrir o app" (padrão: o app no GitHub Pages)
 *   no-fonts             não carrega a fonte Nunito Sans do Google Fonts
 *
 * Pausa sozinha fora da tela, respeita prefers-reduced-motion e qualquer toque
 * no celular ou no seletor de animal passa o controle para quem clicou.
 */
(() => {
  const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,700;6..12,800&display=swap'
  const APP_URL = 'https://gabrielajacottet.github.io/reencontro/'

  const TEXT = {
    pt: {
      region: 'Demonstração animada do app Reencontro',
      demo: 'Demo', time: '18:42',
      aiBadge: 'IA embarcada', aiSub: 'roda no celular', aiTitle: 'O reconhecimento de imagens (rede DINOv2) roda no próprio celular, sem servidor de IA e funciona offline.',
      heroTitle: 'Ajude um pet a voltar para casa',
      heroText: 'Viu um animal perdido? Tire uma foto. O app compara com os pets desaparecidos e mostra os mais parecidos.',
      found: 'Encontrei um animal', foundSub: 'Toque para abrir a câmera',
      lost: 'Perdi meu pet', lostSub: 'Cadastre fotos para ele ser reconhecido',
      listTitle: 'Animais cadastrados', lostTag: 'Desaparecido', seenTag: 'Avistado agora',
      hint: 'Deixe o animal dentro do quadrado', gallery: 'Galeria',
      resTitle: 'Animal encontrado', comparing: 'Comparando…', comparingSub: 'A comparação acontece no seu celular.',
      maybe: (n) => `Pode ser ${n}!`, maybeSub: 'Confira o anúncio e as fotos antes de avisar o tutor.',
      none: 'Nenhum pet muito parecido', noneSub: (n) => `Comparado com ${n} pets desaparecidos.`,
      levels: { hi: 'Muito parecido', md: 'Parecido', lo: 'Pouco parecido' },
      reward: (v) => `Recompensa: ${v}`, seeAd: 'Ver anúncio', talk: (c) => `Falar com ${c} no WhatsApp`,
      warnTitle: 'Avisar o tutor', withLoc: 'Incluir onde estou agora no aviso',
      regTitleA: 'Não é nenhum desses?', regTitleB: 'Cadastre este animal', regBtn: 'Cadastrar como animal encontrado na rua',
      waSub: (n) => `tutora de ${n}`, today: 'Hoje', typeMsg: 'Mensagem',
      waMsg: (c, n) => `Olá, ${c}! Vi o anúncio do(a) ${n} no Reencontro e acho que encontrei. Tirei uma foto agora, neste local: maps.google.com/?q=…`,
      species: { dog: 'Cachorro', cat: 'Gato' },
      inside: 'Por dentro', insideTitle: 'O que roda no celular',
      steps: [
        ['Foto', 'A câmera captura o animal. A comparação acontece no aparelho, sem servidor de IA.'],
        ['Impressão visual', 'A rede DINOv2 roda no navegador e resume a foto em 384 números.'],
        ['Comparação', 'Esses números são comparados com as fotos de cada pet desaparecido; vale a foto mais parecida.'],
        ['Resultado e aviso', 'A partir de 60% (“Parecido”) o app sugere avisar o tutor pelo WhatsApp.'],
      ],
      onDevice: 'no aparelho', numbers: '384 números · 48 mostrados',
      scale: ['Pouco', 'Parecido', 'Muito'],
      chips: ['DINOv2 (Meta)', 'ONNX Runtime Web', 'Funciona offline'],
      note: 'Porcentagens ilustrativas desta demonstração.',
      tryIt: 'Experimente: qual animal você encontrou?',
      subjects: { dog: 'Cão caramelo', cat: 'Gata preta', gray: 'Cão cinza' },
      chapters: ['Cadastro', 'Anúncio', 'Foto', 'Comparação', 'Aviso'],
      parts: ['Perdi meu pet', 'Encontrei um animal'],
      lostTitle: 'Cadastrar pet desaparecido', photosTitle: 'Fotos do pet', photosNote: 'Quanto mais fotos, melhor: de frente, de lado, de corpo inteiro.',
      fromGallery: 'Escolher da galeria', takeNow: 'Tirar foto agora', analyzing: 'analisando…',
      fName: 'Nome do pet', isA: 'É um', other: 'Outro', fWhere: 'Bairro onde foi visto por último', fReward: 'Recompensa (opcional)',
      contactTitle: 'Contato', fContact: 'Nome para contato', fZap: 'WhatsApp (com DDD)', save: 'Salvar cadastro', saving: 'Salvando…',
      posterTitle: 'Anúncio', posterNote: 'Compartilhe nos grupos do bairro, no Instagram e no Facebook. Também dá para imprimir.',
      wanted: 'PROCURA-SE', rewardBig: 'RECOMPENSA', share: 'Compartilhar', download: 'Baixar imagem',
      lostSteps: [
        ['Fotos do pet', 'Três ou quatro fotos da galeria. Cada uma vira uma impressão visual de 384 números, no aparelho.'],
        ['Dados e contato', 'Nome, espécie, bairro, recompensa e o WhatsApp de quem procura.'],
        ['Anúncio pronto', 'O app gera a imagem do anúncio para compartilhar, e o pet passa a ser comparado com cada animal encontrado.'],
      ],
      pause: 'Pausar', play: 'Reproduzir', restart: 'Recomeçar', openApp: 'Abrir o app',
      chapterLabel: (s) => `Ir para: ${s}`, back: 'Voltar', send: 'Enviar', shutter: 'Tirar foto',
    },
    en: {
      region: 'Animated demo of the Reencontro app',
      demo: 'Demo', time: '6:42',
      aiBadge: 'On-device AI', aiSub: 'runs on the phone', aiTitle: 'Image recognition (DINOv2 network) runs on the phone itself, with no AI server, and works offline.',
      heroTitle: 'Help a pet find its way home',
      heroText: 'Spotted a lost animal? Take a photo. The app compares it with missing pets and shows the closest matches.',
      found: 'I found an animal', foundSub: 'Tap to open the camera',
      lost: 'I lost my pet', lostSub: 'Add photos so it can be recognized',
      listTitle: 'Registered animals', lostTag: 'Missing', seenTag: 'Seen just now',
      hint: 'Keep the animal inside the square', gallery: 'Gallery',
      resTitle: 'Animal found', comparing: 'Comparing…', comparingSub: 'The comparison runs on your phone.',
      maybe: (n) => `It could be ${n}!`, maybeSub: 'Check the listing and photos before contacting the owner.',
      none: 'No pet looks very similar', noneSub: (n) => `Compared with ${n} missing pets.`,
      levels: { hi: 'Very similar', md: 'Similar', lo: 'Not very similar' },
      reward: (v) => `Reward: ${v}`, seeAd: 'See listing', talk: (c) => `Message ${c} on WhatsApp`,
      warnTitle: 'Tell the owner', withLoc: 'Include my current location',
      regTitleA: 'None of these?', regTitleB: 'Register this animal', regBtn: 'Register as found on the street',
      waSub: (n) => `${n}’s owner`, today: 'Today', typeMsg: 'Message',
      waMsg: (c, n) => `Hi, ${c}! I saw ${n}’s listing on Reencontro and I think I found them. I just took a photo here: maps.google.com/?q=…`,
      species: { dog: 'Dog', cat: 'Cat' },
      inside: 'Under the hood', insideTitle: 'What runs on the phone',
      steps: [
        ['Photo', 'The camera captures the animal. Matching happens on the device, with no AI server.'],
        ['Visual fingerprint', 'The DINOv2 network runs in the browser and sums the photo up in 384 numbers.'],
        ['Comparison', 'Those numbers are compared with the photos of every missing pet; the closest photo counts.'],
        ['Result and alert', 'From 60% (“Similar”) up, the app suggests messaging the owner on WhatsApp.'],
      ],
      onDevice: 'on device', numbers: '384 numbers · 48 shown',
      scale: ['Low', 'Similar', 'Very'],
      chips: ['DINOv2 (Meta)', 'ONNX Runtime Web', 'Works offline'],
      note: 'Percentages in this demo are illustrative.',
      tryIt: 'Try it: which animal did you find?',
      subjects: { dog: 'Tan dog', cat: 'Black cat', gray: 'Gray dog' },
      chapters: ['Register', 'Listing', 'Photo', 'Comparison', 'Alert'],
      parts: ['I lost my pet', 'I found an animal'],
      lostTitle: 'Register a missing pet', photosTitle: 'Pet photos', photosNote: 'The more photos the better: front, side, full body.',
      fromGallery: 'Choose from gallery', takeNow: 'Take a photo now', analyzing: 'analyzing…',
      fName: 'Pet name', isA: 'It is a', other: 'Other', fWhere: 'Neighborhood last seen', fReward: 'Reward (optional)',
      contactTitle: 'Contact', fContact: 'Contact name', fZap: 'WhatsApp (with area code)', save: 'Save', saving: 'Saving…',
      posterTitle: 'Listing', posterNote: 'Share it in neighborhood groups, on Instagram and Facebook. You can also print it.',
      wanted: 'MISSING', rewardBig: 'REWARD', share: 'Share', download: 'Download image',
      lostSteps: [
        ['Pet photos', 'Three or four photos from the gallery. Each one becomes a 384-number visual fingerprint, on the device.'],
        ['Details and contact', 'Name, species, neighborhood, reward and the owner’s WhatsApp.'],
        ['Listing ready', 'The app makes a shareable listing image, and the pet is now compared with every animal someone finds.'],
      ],
      pause: 'Pause', play: 'Play', restart: 'Restart', openApp: 'Open the app',
      chapterLabel: (s) => `Go to: ${s}`, back: 'Back', send: 'Send', shutter: 'Take photo',
    },
  }

  /* ---------- dados de exemplo ---------- */
  const PETS = [
    { id: 'caramelo', name: 'Caramelo', sp: 'dog', art: 'caramel', bg: '#F6E3D2', when: { pt: 'há 2 dias', en: '2 days ago' }, where: 'Centro', reward: 'R$ 200', contact: 'Maria' },
    { id: 'pipoca', name: 'Pipoca', sp: 'dog', art: 'spotted', bg: '#E4ECF4', when: { pt: 'há 5 dias', en: '5 days ago' }, where: 'Jardim América', contact: 'Rafael' },
    { id: 'luna', name: 'Luna', sp: 'cat', art: 'blackcat', bg: '#EDE6F3', when: { pt: 'há 1 semana', en: '1 week ago' }, where: 'Vila Nova', contact: 'Ana' },
  ]
  const SUBJECTS = {
    dog: { art: 'caramel', tilt: -7, seed: 3, scores: { caramelo: 87, pipoca: 52, luna: 14 } },
    cat: { art: 'blackcat', tilt: 6, seed: 11, scores: { luna: 84, caramelo: 18, pipoca: 15 } },
    gray: { art: 'gray', tilt: -4, seed: 23, scores: { pipoca: 47, caramelo: 41, luna: 12 } },
  }
  const MATCH = 60, HIGH = 80
  const level = (p) => (p >= HIGH ? 'hi' : p >= MATCH ? 'md' : 'lo')

  /* ---------- animais desenhados (viewBox 0 0 100 100) ---------- */
  const EYE = (x, y) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#1d1510"/><circle cx="${x + 0.9}" cy="${y - 0.9}" r="1" fill="#fff"/>`
  const ANIMALS = {
    caramel: `<ellipse cx="50" cy="99" rx="30" ry="22" fill="#D08A43"/><ellipse cx="50" cy="95" rx="12" ry="14" fill="#F1D7B5"/>
      <path d="M31 40C20 40 15 53 18 67C22 71 28 67 32 58Z" fill="#A9652A"/><path d="M69 40C80 40 85 53 82 67C78 71 72 67 68 58Z" fill="#A9652A"/>
      <ellipse cx="50" cy="54" rx="22" ry="21" fill="#D9954A"/><path d="M50 36C46 44 46 52 50 58C54 52 54 44 50 36Z" fill="#F1D7B5" opacity=".75"/>
      <ellipse cx="50" cy="65" rx="12" ry="9" fill="#F1D7B5"/>${EYE(42, 51)}${EYE(58, 51)}
      <ellipse cx="50" cy="60.5" rx="4.6" ry="3.3" fill="#2A1E16"/><path d="M50 63.5V66.5M45.5 67.5Q50 70.5 54.5 67.5" stroke="#2A1E16" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M33 80Q50 89 67 80" stroke="#C2410C" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="50" cy="87" r="2.8" fill="#F2C14E"/>`,
    spotted: `<ellipse cx="50" cy="99" rx="30" ry="22" fill="#F4EFE8"/><ellipse cx="66" cy="94" rx="9" ry="7" fill="#3A302A"/>
      <path d="M31 38C21 40 16 52 19 66C23 70 29 66 32 57Z" fill="#3A302A"/><path d="M69 38C79 40 84 52 81 66C77 70 71 66 68 57Z" fill="#3A302A"/>
      <ellipse cx="50" cy="54" rx="21" ry="21" fill="#F7F2EB"/><ellipse cx="41.5" cy="50" rx="7.5" ry="7" fill="#3A302A"/>
      <ellipse cx="50" cy="65" rx="11.5" ry="8.5" fill="#EAE2D6"/><circle cx="42" cy="51" r="3.4" fill="#5d5049"/>${EYE(42, 51)}${EYE(58, 51)}
      <ellipse cx="50" cy="60.5" rx="4.4" ry="3.2" fill="#2A1E16"/><path d="M50 63.5V66.5M45.5 67.5Q50 70.5 54.5 67.5" stroke="#2A1E16" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M33 80Q50 89 67 80" stroke="#3A64C8" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    blackcat: `<ellipse cx="50" cy="100" rx="27" ry="22" fill="#2B2522"/>
      <path d="M29 47L31 21L47 36Z" fill="#2B2522"/><path d="M71 47L69 21L53 36Z" fill="#2B2522"/>
      <path d="M33 40L34 28L42 36Z" fill="#6a5550"/><path d="M67 40L66 28L58 36Z" fill="#6a5550"/>
      <ellipse cx="50" cy="55" rx="22" ry="19" fill="#2B2522"/>
      <ellipse cx="41.5" cy="52" rx="4" ry="3.6" fill="#C9D44A"/><ellipse cx="58.5" cy="52" rx="4" ry="3.6" fill="#C9D44A"/>
      <ellipse cx="41.5" cy="52" rx="1.2" ry="3" fill="#111"/><ellipse cx="58.5" cy="52" rx="1.2" ry="3" fill="#111"/>
      <circle cx="42.6" cy="50.8" r=".9" fill="#fff"/><circle cx="59.6" cy="50.8" r=".9" fill="#fff"/>
      <path d="M47.6 59.5H52.4L50 62.3Z" fill="#E59AA0"/><path d="M50 62.3V64.2M46.5 65.3Q50 67.5 53.5 65.3" stroke="#8b7d77" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <path d="M38 61L24 59M38 63.5L25 65M62 61L76 59M62 63.5L75 65" stroke="#8b7d77" stroke-width=".8" stroke-linecap="round"/>
      <path d="M35 78Q50 86 65 78" stroke="#E25B7A" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="50" cy="84" r="2.8" fill="#F2C14E"/>`,
    gray: `<ellipse cx="50" cy="99" rx="29" ry="22" fill="#7E8086"/>
      <path d="M30 39L45 34L35 52Z" fill="#62646A"/><path d="M70 39L55 34L65 52Z" fill="#62646A"/>
      <ellipse cx="50" cy="54" rx="20" ry="21" fill="#8E9096"/>
      <path d="M37 47Q42 42 47 47M53 47Q58 42 63 47" stroke="#D4D5D9" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      ${EYE(42, 51.5)}${EYE(58, 51.5)}
      <path d="M38 59Q37 74 50 80Q63 74 62 59Q56 62 50 62Q44 62 38 59Z" fill="#CFD0D4"/>
      <ellipse cx="50" cy="61" rx="4.6" ry="3.3" fill="#2A1E16"/><path d="M45.5 68Q50 70 54.5 68" stroke="#7a7c82" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  }
  function art(kind, { bg = '#F6E3D2', tilt = 0, scene = false, wide = false } = {}) {
    const back = scene
      ? `<rect x="-80" y="-60" width="260" height="130" fill="#D7C4AE"/><rect x="-80" y="-60" width="260" height="130" fill="url(#brick)" opacity=".35"/>
         <rect x="-80" y="68" width="260" height="100" fill="#A89782"/><path d="M-80 70H180" stroke="#8d7d6a" stroke-width="2"/><path d="M-20 70L-40 150M40 70L36 150M100 70L112 150M160 70L190 150" stroke="#97866f" stroke-width="1.2"/>
         <ellipse cx="50" cy="118" rx="36" ry="7" fill="#000" opacity=".18"/>`
      : `<rect x="-20" y="-20" width="140" height="140" fill="${bg}"/>`
    const defs = scene ? '<defs><pattern id="brick" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M0 9.5H20M10 0V9.5M0 0V5" stroke="#9c8670" stroke-width=".7" fill="none"/></pattern></defs>' : ''
    const vb = !scene ? '0 0 100 100' : wide ? '-50 -32 200 182' : '-12 4 124 124'
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${back}<g transform="rotate(${tilt} 50 70)${scene ? ' translate(0 6)' : ''}">${ANIMALS[kind]}</g></svg>`
  }

  const PAW = '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="6" cy="9" rx="2.2" ry="2.8"/><ellipse cx="10" cy="5.5" rx="2.2" ry="2.8"/><ellipse cx="14.5" cy="5.5" rx="2.2" ry="2.8"/><ellipse cx="18.5" cy="9" rx="2.2" ry="2.8"/><path d="M12 11c-3.5 0-6 4-6 6.5 0 2 1.6 2.8 3 2.5 1.2-.3 2-.9 3-.9s1.8.6 3 .9c1.4.3 3-.5 3-2.5 0-2.5-2.5-6.5-6-6.5z"/></svg>'
  const I = {
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5 21 12 3 3.5l2.2 7.1L14 12l-8.8 1.4Z" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    ticks: '<svg viewBox="0 0 18 11" aria-hidden="true"><path d="M1 6l3 3 6-7M7 9l1 1 7-8" fill="none" stroke="#53BDEB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7Z" fill="currentColor"/></svg>',
    pause: '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    restart: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }

  const LOOP = 30000
  const PART2 = 15000
  const CHAPTERS = [1400, 10400, 16100, 18350, 22100]
  const REDUCED_AT = 21900
  const LOST_PHOTOS = [{ bg: '#F6E3D2' }, { bg: '#E3EEDF', tilt: -12 }, { bg: '#F3E7C9', tilt: 9 }]
  const VALUES = { name: 'Caramelo', where: 'Centro', reward: 'R$ 200', contact: 'Maria', zap: '(21) 99999-9999' }

  const ease = {
    io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t,
    back: (t) => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) },
    lin: (t) => t,
  }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const lerp = (a, b, t) => a + (b - a) * t
  function seeded(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }

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
:host { display: block; container-type: inline-size; color-scheme: light;
  --bg: #FBF3EA; --surface: #FFFFFF; --fg: #2A1E16; --muted: #6B5A4C; --line: #E8D8C6;
  --accent: #C2410C; --accent-fg: #FFFFFF; --soft: #F6E3D2;
  --good: #1F7A4D; --good-bg: #E3F4EA; --mid: #8A5A00; --mid-bg: #FFF1CC; --low-bg: #F1ECE6;
  --rw-bg: #FFD84D; --rw-fg: #4A2E00; --wa: #1F8F55;
  font-family: "Nunito Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; font-size: 15px; line-height: 1.45; color: var(--fg); -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; margin: 0; padding: 0; }
[hidden] { display: none !important; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
a { color: inherit; }
button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
svg { display: block; }
.stage { position: relative; background: var(--bg); border: 1.5px solid var(--line); border-radius: 26px; overflow: hidden; isolation: isolate; box-shadow: 0 24px 48px -30px rgba(42,30,22,.45); }
.top { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px 24px 14px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.3rem; }
.paw { width: 36px; height: 36px; border-radius: 11px; background: var(--accent); display: grid; place-items: center; flex: none; }
.paw svg { width: 22px; height: 22px; fill: #fff; }
.tops { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.ai { display: inline-flex; align-items: center; gap: 8px; padding: 5px 13px 5px 6px; border-radius: 999px; background: #2A1E16; color: #FBF3EA; font-size: .84rem; line-height: 1.1; white-space: nowrap;
  box-shadow: 0 0 0 1.5px rgba(194,65,12,.55), 0 8px 18px -12px rgba(194,65,12,.9); }
.ai .chipi { position: relative; width: 26px; height: 26px; border-radius: 50%; background: var(--accent); display: grid; place-items: center; flex: none; }
.ai .chipi svg { width: 16px; height: 16px; }
.ai .chipi::after { content: ""; position: absolute; inset: -3px; border-radius: 50%; border: 2px solid var(--accent); opacity: var(--glow, 0); transform: scale(var(--gs, 1)); }
.ai b { font-weight: 800; letter-spacing: .01em; }
.ai span.sub { color: #E9C9AE; font-weight: 600; }
.tag { font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); border: 1.5px solid var(--line); border-radius: 999px; padding: 3px 10px; font-weight: 700; }
.main { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 28px; padding: 0 24px; align-items: start; }
.phonecol { display: flex; flex-direction: column; align-items: center; gap: 14px; min-width: 0; }

/* celular */
.phone { position: relative; width: 100%; max-width: 290px; aspect-ratio: 9 / 18.6; background: #2A1E16; border-radius: 42px; padding: 9px; container-type: inline-size;
  box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 26px 50px -24px rgba(42,30,22,.6); }
.screen { position: relative; height: 100%; border-radius: 33px; overflow: hidden; background: var(--bg); font-size: 4.62cqw; line-height: 1.4; }
.sbar { position: absolute; z-index: 30; left: 0; right: 0; top: 0; height: 2.6em; display: flex; justify-content: space-between; align-items: center; padding: .3em 1.9em 0; font-weight: 800; font-size: .92em; pointer-events: none; }
.sbar .dots { display: flex; gap: .3em; align-items: center; }
.sbar .dots i { display: block; width: .9em; height: .55em; border-radius: .15em; background: currentColor; opacity: .85; }
.sbar .dots i:first-child { width: 1.4em; }
.notch { position: absolute; z-index: 31; left: 50%; top: .55em; width: 30%; height: 1.55em; margin-left: -15%; border-radius: 1em; background: #120c08; }
.scr { position: absolute; inset: 0; padding: 3.1em 1.1em 1em; display: flex; flex-direction: column; gap: .9em; }
.scr[hidden] { display: none; }
h1.h { font-size: 1.62em; line-height: 1.12; font-weight: 800; letter-spacing: -.01em; }
.p { color: var(--muted); font-size: .95em; }
.abrand { display: flex; align-items: center; gap: .6em; font-weight: 800; font-size: 1.1em; }
.abrand .paw { width: 2em; height: 2em; border-radius: .6em; }
.abrand .paw svg { width: 1.25em; height: 1.25em; }
.big { display: flex; align-items: center; gap: .8em; min-height: 4.6em; padding: .6em 1em; border-radius: 1.1em; background: var(--accent); color: #fff; font-weight: 800; text-align: left; width: 100%; }
.big svg { width: 1.9em; height: 1.9em; flex: none; }
.big .bt { display: flex; flex-direction: column; line-height: 1.2; font-size: 1.02em; }
.big small { font-weight: 400; font-size: .76em; opacity: .9; margin-top: .2em; }
.big.sec { background: var(--surface); color: var(--fg); border: 1.5px solid var(--line); }
.panel { background: var(--surface); border: 1.5px solid var(--line); border-radius: 1.1em; padding: .85em; display: flex; flex-direction: column; gap: .6em; }
.panel h2 { font-size: 1em; font-weight: 800; }
.pet { display: flex; gap: .7em; align-items: center; }
.ph { flex: none; width: 3.2em; height: 3.2em; border-radius: .75em; overflow: hidden; background: var(--soft); }
.ph svg { width: 100%; height: 100%; }
.pet .info { flex: 1; min-width: 0; }
.pet b { display: block; font-size: .98em; line-height: 1.2; }
.pet .meta { color: var(--muted); font-size: .78em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.lv { display: inline-block; font-size: .72em; font-weight: 800; border-radius: 999px; padding: .15em .7em; margin-top: .25em; white-space: nowrap; }
.lv.lost { background: var(--soft); color: var(--accent); }
.lv.seen { background: var(--good-bg); color: var(--good); margin-left: .3em; }
.lv.hi { background: var(--good-bg); color: var(--good); }
.lv.md { background: var(--mid-bg); color: var(--mid); }
.lv.lo { background: var(--low-bg); color: var(--muted); }

/* câmera */
.cam { background: #000; color: #fff; padding: 0; }
.vf { position: absolute; inset: 0; }
.vf svg { width: 100%; height: 100%; }
.guide { position: absolute; left: 9%; right: 9%; top: 48%; aspect-ratio: 1; transform: translateY(-55%); border-radius: 1.6em; box-shadow: 0 0 0 100vmax rgba(0,0,0,.42); }
.guide i { position: absolute; width: 2.6em; height: 2.6em; border: .32em solid #fff; }
.guide i:nth-child(1) { left: -.2em; top: -.2em; border-right: 0; border-bottom: 0; border-top-left-radius: 1.6em; }
.guide i:nth-child(2) { right: -.2em; top: -.2em; border-left: 0; border-bottom: 0; border-top-right-radius: 1.6em; }
.guide i:nth-child(3) { left: -.2em; bottom: -.2em; border-right: 0; border-top: 0; border-bottom-left-radius: 1.6em; }
.guide i:nth-child(4) { right: -.2em; bottom: -.2em; border-left: 0; border-top: 0; border-bottom-right-radius: 1.6em; }
.camx { position: absolute; left: 1em; top: 3.2em; width: 3em; height: 3em; border-radius: 50%; background: rgba(0,0,0,.55); display: grid; place-items: center; }
.camx svg { width: 1.5em; height: 1.5em; }
.hint { position: absolute; left: 50%; top: 7.2em; transform: translateX(-50%); background: rgba(0,0,0,.6); border-radius: 999px; padding: .45em 1em; font-weight: 800; font-size: .88em; white-space: nowrap; }
.cambot { position: absolute; left: 0; right: 0; bottom: 0; padding: 1.2em 1.2em 1.6em; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; background: linear-gradient(transparent, rgba(0,0,0,.7)); }
.gal { justify-self: start; padding: .7em 1em; border-radius: 999px; background: rgba(0,0,0,.55); font-weight: 800; font-size: .85em; }
.shutter { width: 5em; height: 5em; border-radius: 50%; border: .38em solid #fff; background: #fff; box-shadow: inset 0 0 0 .25em #000; }
.flash { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }

/* resultado */
.res { padding: 0; }
.rs { position: absolute; left: 0; right: 0; top: 0; padding: 3.1em 1.1em 1.2em; display: flex; flex-direction: column; gap: .85em; }
.tbar { display: flex; align-items: center; gap: .7em; }
.backb { width: 2.7em; height: 2.7em; border-radius: 50%; border: 1.5px solid var(--line); background: var(--surface); display: grid; place-items: center; flex: none; }
.backb svg { width: 1.2em; height: 1.2em; }
.tbar h1 { font-size: 1.22em; font-weight: 800; }
.fnd { display: flex; gap: .8em; align-items: center; }
.fnd .ph { width: 4.6em; height: 4.6em; border-radius: .9em; }
.fnd b { display: block; font-size: 1.05em; line-height: 1.2; }
.prog { height: .6em; border-radius: .3em; background: var(--soft); overflow: hidden; }
.skel { display: flex; flex-direction: column; gap: .7em; }
.skel i { display: block; height: 5.6em; border-radius: 1.1em; background: linear-gradient(90deg, var(--surface), #F7EBDF, var(--surface)); background-size: 200% 100%; border: 1.5px solid var(--line); }
.prog i { display: block; height: 100%; width: 40%; background: var(--accent); border-radius: .3em; }
.match { background: var(--surface); border: 1.5px solid var(--line); border-radius: 1.1em; padding: .7em; display: flex; flex-direction: column; gap: .55em; }
.match.best { border: 3px solid var(--accent); }
.mh { display: flex; gap: .7em; align-items: center; }
.mh .ph { width: 3.6em; height: 3.6em; }
.mh .info { flex: 1; min-width: 0; }
.mh b { display: block; font-size: 1.05em; line-height: 1.2; }
.mh span { color: var(--muted); font-size: .76em; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pct { font-size: 1.45em; font-weight: 800; color: var(--accent); font-variant-numeric: tabular-nums; }
.bar { height: .55em; border-radius: .3em; background: var(--soft); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: .3em; background: var(--accent); width: 0; }
.reward { background: var(--rw-bg); color: var(--rw-fg); border-radius: .8em; padding: .45em .8em; font-weight: 800; text-align: center; }
.acts { display: flex; flex-direction: column; gap: .45em; }
.sbtn { display: flex; align-items: center; justify-content: center; min-height: 2.9em; padding: .3em .8em; border-radius: .9em; font-weight: 800; font-size: .9em; text-align: center; }
.sbtn.sec { background: var(--surface); border: 1.5px solid var(--line); }
.sbtn.wa { background: var(--wa); color: #fff; }
.sbtn.pri { background: var(--accent); color: #fff; }
.confirm { display: flex; gap: .5em; align-items: center; font-size: .85em; }
.confirm i { width: 1.25em; height: 1.25em; border-radius: .3em; background: var(--accent); display: grid; place-items: center; }
.confirm i::after { content: ""; width: .55em; height: .3em; border-left: .14em solid #fff; border-bottom: .14em solid #fff; transform: rotate(-45deg) translate(.05em, -.05em); }

/* WhatsApp */
.wapp { position: absolute; inset: 0; z-index: 20; background: #EFE7DD; display: flex; flex-direction: column; transform: translateY(100%); }
.wahead { background: #075E54; color: #fff; padding: 3em .9em .7em; display: flex; align-items: center; gap: .6em; }
.wahead svg { width: 1.2em; height: 1.2em; }
.wahead .av { width: 2.4em; height: 2.4em; border-radius: 50%; background: #F6E3D2; color: var(--accent); display: grid; place-items: center; font-weight: 800; }
.wahead b { display: block; line-height: 1.2; }
.wahead small { opacity: .8; font-size: .78em; }
.wabody { flex: 1; padding: .9em .8em; display: flex; flex-direction: column; align-items: flex-end; gap: .6em; overflow: hidden; }
.day { align-self: center; background: #E1F3FB; color: #3b5563; font-size: .72em; font-weight: 700; padding: .2em .8em; border-radius: .6em; }
.bub { position: relative; max-width: 86%; background: #D9FDD3; border-radius: .9em .2em .9em .9em; padding: .55em .7em 1.3em; font-size: .85em; line-height: 1.35; box-shadow: 0 1px 1px rgba(0,0,0,.08); }
.bub .ph { width: 100%; height: 6.5em; border-radius: .6em; margin-bottom: .45em; }
.bub .tk { position: absolute; right: .55em; bottom: .35em; width: 1.25em; }
.wain { display: flex; gap: .5em; align-items: flex-end; padding: .55em .6em 1.4em; }
.field { flex: 1; background: #fff; border-radius: 1.3em; padding: .55em .85em; font-size: .82em; line-height: 1.3; color: var(--fg); min-height: 2.6em; }
.field.ph0 { color: #8a8a8a; }
.sendb { width: 2.9em; height: 2.9em; border-radius: 50%; background: #00A884; color: #fff; display: grid; place-items: center; flex: none; }
.sendb svg { width: 1.3em; height: 1.3em; }

/* cadastro */
.plist { display: flex; flex-direction: column; }
.rowwrap { overflow: hidden; }
.rowwrap > .pet { padding-bottom: .6em; }
.plist > :last-child > .pet { padding-bottom: 0; }
.lost { padding: 0; }
.ls { position: absolute; left: 0; right: 0; top: 0; padding: 3.1em 1.1em 1.4em; display: flex; flex-direction: column; gap: .85em; }
.thumbs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .45em; }
.th { position: relative; aspect-ratio: 1; border-radius: .7em; overflow: hidden; background: var(--soft); }
.th svg { width: 100%; height: 100%; }
.th.empty { background: none; border: 1.5px dashed var(--line); }
.busy { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0,0,0,.45); color: #fff; font-size: .62em; font-weight: 800; }
.row2 { display: flex; gap: .5em; }
.row2 > * { flex: 1; }
.fl { display: flex; flex-direction: column; gap: .3em; font-weight: 700; font-size: .88em; }
.in { position: relative; min-height: 2.75em; border: 1.5px solid var(--line); border-radius: .75em; background: var(--bg); padding: .6em .8em; font-weight: 400; font-size: 1.05em; line-height: 1.3; }
.in.act { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(194,65,12,.14); }
.in .car { display: inline-block; width: 2px; height: 1.1em; margin-left: 1px; vertical-align: -.18em; background: var(--accent); }
.chips2 { display: flex; gap: .4em; }
.chips2 span { padding: .35em .9em; border-radius: 999px; border: 1.5px solid var(--line); background: var(--surface); font-weight: 700; }
.chips2 span.on { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.savebtn { min-height: 3.4em; font-size: 1em; border-radius: 1em; }
/* anúncio */
.poster { gap: .75em; }
.pcard { background: #fff; border: 1.5px solid var(--line); border-radius: 1em; overflow: hidden; display: flex; flex-direction: column; align-items: center; text-align: center; padding-bottom: .8em; box-shadow: 0 14px 26px -20px rgba(42,30,22,.6); }
.ptop { width: 100%; background: var(--accent); color: #fff; font-weight: 800; font-size: 1.35em; letter-spacing: .08em; padding: .3em 0; }
.pimg { width: 100%; height: 9.5em; }
.pimg svg { width: 100%; height: 100%; }
.pname { font-size: 1.6em; font-weight: 800; line-height: 1.1; margin-top: .3em; }
.pmeta { color: var(--muted); font-size: .85em; }
.prw { margin-top: .45em; background: var(--rw-bg); color: var(--rw-fg); font-weight: 800; border-radius: .6em; padding: .25em .9em; }
.pzap { margin-top: .45em; font-size: .78em; color: var(--muted); font-weight: 700; }

/* seletor */
.try { width: 100%; max-width: 300px; }
.try p { font-size: .82rem; color: var(--muted); font-weight: 700; margin-bottom: 8px; text-align: center; }
.picks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pick { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 4px; border-radius: 14px; border: 1.5px solid var(--line); background: var(--surface); font-size: .75rem; font-weight: 700; color: var(--muted); }
.pick .ph { width: 46px; height: 46px; border-radius: 12px; }
.pick[aria-pressed="true"] { border-color: var(--accent); color: var(--fg); box-shadow: 0 0 0 2px var(--accent) inset; }

/* por dentro */
.side { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.eyebrow { font-size: .74rem; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); font-weight: 800; }
.side h3 { font-size: 1.45rem; font-weight: 800; line-height: 1.1; margin-top: 2px; }
.parts { display: flex; gap: 6px; flex-wrap: wrap; }
.parts span { display: inline-flex; align-items: center; gap: 7px; padding: 4px 12px 4px 5px; border-radius: 999px; border: 1.5px solid var(--line); font-size: .84rem; font-weight: 800; color: var(--muted); background: var(--surface); }
.parts b { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--soft); color: var(--accent); font-size: .75rem; }
.parts span.on { color: var(--fg); border-color: var(--accent); }
.parts span.on b { background: var(--accent); color: #fff; }
.grps { display: grid; }
.grp { grid-area: 1 / 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.lviz { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.lv1 { display: flex; align-items: center; gap: 6px; min-width: 0; }
.lv1 .ph { width: 28px; height: 28px; border-radius: 8px; }
.lv1 svg.lb { flex: 1; min-width: 0; height: 26px; }
.step { background: var(--surface); border: 1.5px solid var(--line); border-radius: 16px; padding: 12px 14px; display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 2px 10px; opacity: .55; }
.step.on { opacity: 1; border-color: var(--accent); box-shadow: 0 10px 22px -18px rgba(194,65,12,.8); }
.step .n { grid-row: 1 / 3; width: 30px; height: 30px; border-radius: 50%; background: var(--soft); color: var(--accent); font-weight: 800; display: grid; place-items: center; font-size: .9rem; }
.step.on .n { background: var(--accent); color: #fff; }
.step h4 { font-size: 1rem; font-weight: 800; line-height: 1.25; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.step p { font-size: .86rem; color: var(--muted); line-height: 1.35; }
.viz { grid-column: 2; margin-top: 8px; }
.chip { display: inline-flex; align-items: center; gap: 4px; font-size: .7rem; font-weight: 800; color: var(--good); background: var(--good-bg); border-radius: 999px; padding: 1px 8px; }
.chip svg { width: 11px; height: 11px; }
.bars { height: 46px; }
.bars svg { width: 100%; height: 100%; }
.vcap { font-size: .72rem; color: var(--muted); margin-top: 2px; }
.crow { display: grid; grid-template-columns: 24px 74px minmax(0, 1fr) 38px; gap: 8px; align-items: center; font-size: .82rem; font-weight: 700; margin-top: 4px; }
.crow .ph { width: 24px; height: 24px; border-radius: 7px; }
.crow .m { height: 8px; border-radius: 4px; background: var(--soft); overflow: hidden; }
.crow .m i { display: block; height: 100%; width: 0; border-radius: 4px; }
.crow .v { text-align: right; font-variant-numeric: tabular-nums; }
.scale { position: relative; height: 12px; border-radius: 6px; overflow: hidden; display: grid; grid-template-columns: 60fr 20fr 20fr; }
.scale i:nth-child(1) { background: var(--low-bg); } .scale i:nth-child(2) { background: var(--mid-bg); } .scale i:nth-child(3) { background: var(--good-bg); }
.scwrap { position: relative; padding-top: 26px; }
.marker { position: absolute; top: 0; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; font-size: .72rem; font-weight: 800; color: var(--accent); white-space: nowrap; }
.marker::after { content: ""; width: 0; height: 0; border: 6px solid transparent; border-top-color: var(--accent); margin-top: 1px; }
.sclab { display: grid; grid-template-columns: 60fr 20fr 20fr; font-size: .68rem; color: var(--muted); margin-top: 3px; font-weight: 700; }
.sclab span:nth-child(2) { color: var(--mid); } .sclab span:nth-child(3) { color: var(--good); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips span { font-size: .72rem; font-weight: 700; color: var(--muted); border: 1.5px solid var(--line); border-radius: 999px; padding: 2px 9px; background: var(--surface); }
.note { font-size: .72rem; color: var(--muted); }

/* rodapé */
.foot { display: flex; justify-content: space-between; align-items: center; gap: 12px 16px; flex-wrap: wrap; margin-top: 20px; padding: 12px 24px; border-top: 1.5px solid var(--line); background: var(--surface); }
.chapters { display: flex; gap: 6px; flex-wrap: wrap; }
.chapters button { font-size: .8rem; padding: 5px 11px; border-radius: 999px; border: 1.5px solid var(--line); color: var(--muted); font-weight: 700; }
.chapters button i { font-style: normal; margin-right: 4px; color: var(--accent); }
.chapters button.on { color: var(--fg); border-color: var(--accent); background: var(--soft); }
.ctrl { display: flex; gap: 6px; flex-wrap: wrap; }
.ctrl button, .ctrl a { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--surface); font-size: .84rem; font-weight: 800; text-decoration: none; }
.ctrl a { background: var(--accent); color: #fff; border-color: transparent; }
.cursor { position: absolute; left: 0; top: 0; width: 26px; height: 26px; pointer-events: none; z-index: 40; opacity: 0; filter: drop-shadow(0 3px 4px rgba(0,0,0,.35)); }
.tap { position: absolute; left: 0; top: 0; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2.5px solid var(--accent); background: rgba(194,65,12,.12); pointer-events: none; z-index: 39; opacity: 0; }
@container (max-width: 720px) {
  .main { grid-template-columns: minmax(0, 1fr); padding: 0 14px; gap: 20px; }
  .top { padding: 14px 14px 12px; }
  .foot { padding: 12px 14px; }
}
@container (max-width: 520px) {
  .top { align-items: flex-start; }
  .ai span.sub { display: none; }
  .tops .tag { display: none; }
}
@container (max-width: 420px) {
  .ctrl button span { display: none; }
  .crow { grid-template-columns: 24px 64px minmax(0, 1fr) 34px; }
}
`

  class ReencontroDemo extends HTMLElement {
    connectedCallback() {
      if (this.root) return
      this.lang = (this.getAttribute('lang') || 'pt').slice(0, 2) === 'en' ? 'en' : 'pt'
      this.T = TEXT[this.lang]
      if (!this.hasAttribute('no-fonts') && !document.querySelector('link[data-rnc-fonts]')) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = FONT_HREF; link.dataset.rncFonts = ''
        document.head.appendChild(link)
      }
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      this.root = this.attachShadow({ mode: 'open' })
      this.build()
      this.setup()
      if (this.reduced) { this.seek(REDUCED_AT); this.paused = true }
      else this.reset()
      this.setPlayLabel()
      this.render()
      this.observe()
    }
    disconnectedCallback() { this.stopLoop(); this.io?.disconnect(); this.ro?.disconnect() }

    /* ---------- DOM ---------- */
    build() {
      const T = this.T
      const petRow = (p) => `<div class="rowwrap" data-pet="${p.id}"><div class="pet"><div class="ph">${art(p.art, { bg: p.bg })}</div>
        <div class="info"><b>${p.name}</b><span class="meta">${T.species[p.sp]} · ${p.when[this.lang]} · ${p.where}</span>
        <span class="lv lost">${T.lostTag}</span>${p.id === 'caramelo' ? `<span class="lv seen">${T.seenTag}</span>` : ''}</div></div></div>`
      const lstep = (i) => `<div class="step" data-s="${i}"><span class="n">${i + 1}</span>
        <h4>${T.lostSteps[i][0]}${i === 0 ? `<span class="chip">${I.lock}${T.onDevice}</span>` : ''}</h4><p>${T.lostSteps[i][1]}</p>
        ${i === 0 ? `<div class="viz lviz">${[0, 1, 2].map((k) => `<div class="lv1"><span class="ph">${art('caramel', LOST_PHOTOS[k])}</span><svg class="lb" viewBox="0 0 64 26" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="13" x2="64" y2="13" stroke="#E8D8C6" stroke-width="1"/><g></g></svg></div>`).join('')}</div>` : ''}
      </div>`
      const step = (i) => `<div class="step" data-s="${i}"><span class="n">${i + 1}</span>
        <h4>${T.steps[i][0]}${i === 0 || i === 1 ? `<span class="chip">${I.lock}${T.onDevice}</span>` : ''}</h4><p>${T.steps[i][1]}</p>
        ${i === 1 ? `<div class="viz"><div class="bars"><svg viewBox="0 0 480 46" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="23" x2="480" y2="23" stroke="#E8D8C6" stroke-width="1"/><g class="bg"></g></svg></div><div class="vcap">${T.numbers}</div></div>` : ''}
        ${i === 2 ? '<div class="viz crows"></div>' : ''}
        ${i === 3 ? `<div class="viz"><div class="scwrap"><div class="marker"><span class="mk"></span></div><div class="scale"><i></i><i></i><i></i></div></div><div class="sclab"><span>${T.scale[0]}</span><span>${T.scale[1]}</span><span>${T.scale[2]}</span></div></div>` : ''}
      </div>`

      this.root.innerHTML = `<style>${CSS}</style>
      <div class="stage" role="region" aria-label="${T.region}">
        <div class="top"><div class="brand"><span class="paw">${PAW}</span>Reencontro</div><span class="tops"><span class="ai" role="note" title="${T.aiTitle}" aria-label="${T.aiBadge}: ${T.aiTitle}"><span class="chipi"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 10h4v4h-4z" fill="#fff" stroke="none"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg></span><b>${T.aiBadge}</b><span class="sub">· ${T.aiSub}</span></span><span class="tag">${T.demo}</span></span></div>
        <div class="main">
          <div class="phonecol">
            <div class="phone"><div class="screen">
              <div class="notch"></div>
              <div class="sbar"><span>${T.time}</span><span class="dots"><i></i><i></i></span></div>

              <section class="scr home" data-scr="home">
                <div class="abrand"><span class="paw">${PAW}</span>Reencontro</div>
                <div><h1 class="h">${T.heroTitle}</h1><p class="p" style="margin-top:.45em">${T.heroText}</p></div>
                <button type="button" class="big go-found">${I.cam}<span class="bt"><span>${T.found}</span><small>${T.foundSub}</small></span></button>
                <button type="button" class="big sec go-lost">${I.search}<span class="bt"><span>${T.lost}</span><small>${T.lostSub}</small></span></button>
                <div class="panel"><h2>${T.listTitle}</h2><div class="plist">${PETS.map(petRow).join('')}</div></div>
              </section>

              <section class="scr lost" data-scr="lost" hidden>
                <div class="ls">
                  <div class="tbar"><button type="button" class="backb lback" aria-label="${T.back}">${I.back}</button><h1>${T.lostTitle}</h1></div>
                  <div class="panel"><h2>${T.photosTitle}</h2><p class="p" style="font-size:.8em">${T.photosNote}</p>
                    <div class="thumbs">${[0, 1, 2].map((i) => `<div class="th">${art('caramel', LOST_PHOTOS[i])}<span class="busy">${T.analyzing}</span></div>`).join('')}<div class="th empty"></div></div>
                    <div class="row2"><button type="button" class="sbtn sec galbtn">${T.fromGallery}</button><span class="sbtn sec">${T.takeNow}</span></div>
                  </div>
                  <div class="panel">
                    <div class="fl"><span>${T.fName}</span><div class="in" data-f="name"></div></div>
                    <div class="fl"><span>${T.isA}</span><div class="chips2"><span class="on">${T.species.dog}</span><span>${T.species.cat}</span><span>${T.other}</span></div></div>
                    <div class="fl"><span>${T.fWhere}</span><div class="in" data-f="where"></div></div>
                    <div class="fl"><span>${T.fReward}</span><div class="in" data-f="reward"></div></div>
                  </div>
                  <div class="panel"><h2>${T.contactTitle}</h2>
                    <div class="fl"><span>${T.fContact}</span><div class="in" data-f="contact"></div></div>
                    <div class="fl"><span>${T.fZap}</span><div class="in" data-f="zap"></div></div>
                  </div>
                  <button type="button" class="sbtn pri savebtn">${T.save}</button>
                </div>
              </section>

              <section class="scr poster" data-scr="poster" hidden>
                <div class="tbar"><button type="button" class="backb pback" aria-label="${T.back}">${I.back}</button><h1>${T.posterTitle}</h1></div>
                <p class="p" style="font-size:.82em">${T.posterNote}</p>
                <div class="pcard">
                  <div class="ptop">${T.wanted}</div>
                  <div class="pimg">${art('caramel', LOST_PHOTOS[0])}</div>
                  <div class="pname">${VALUES.name}</div>
                  <div class="pmeta">${T.species.dog} · ${VALUES.where}</div>
                  <div class="prw">${T.rewardBig} ${VALUES.reward}</div>
                  <div class="pzap">WhatsApp ${VALUES.zap} · ${VALUES.contact}</div>
                </div>
                <div class="row2"><span class="sbtn pri">${T.share}</span><span class="sbtn sec">${T.download}</span></div>
              </section>

              <section class="scr cam" data-scr="cam" hidden>
                <div class="vf"></div>
                <div class="guide" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                <span class="camx" aria-hidden="true">${I.x}</span>
                <div class="hint">${T.hint}</div>
                <div class="cambot"><span class="gal">${T.gallery}</span><button type="button" class="shutter" aria-label="${T.shutter}"></button><span></span></div>
                <div class="flash"></div>
              </section>

              <section class="scr res" data-scr="res" hidden>
                <div class="rs">
                  <div class="tbar"><button type="button" class="backb" aria-label="${T.back}">${I.back}</button><h1>${T.resTitle}</h1></div>
                  <div class="fnd"><div class="ph fimg"></div><div><b class="ftitle" aria-live="polite"></b><p class="p fsub" style="font-size:.82em;margin-top:.2em"></p></div></div>
                  <div class="prog"><i></i></div>
                  <div class="skel"><i></i><i></i><i></i></div>
                  <div class="cards" style="display:flex;flex-direction:column;gap:.7em"></div>
                  <div class="panel share"><h2>${T.warnTitle}</h2><span class="confirm"><i></i>${T.withLoc}</span></div>
                  <div class="panel reg"><h2 class="regt"></h2><span class="sbtn regb"></span></div>
                </div>
              </section>

              <section class="wapp" aria-hidden="true">
                <div class="wahead"><button type="button" class="wa-back" aria-label="${T.back}" style="color:#fff">${I.back}</button><span class="av"></span><span><b class="wan"></b><small class="was"></small></span></div>
                <div class="wabody"><span class="day">${T.today}</span><div class="bub"><span class="btxt"></span><span class="tk">${I.ticks}</span></div></div>
                <div class="wain"><div class="field"></div><button type="button" class="sendb" aria-label="${T.send}">${I.send}</button></div>
              </section>
            </div></div>

            <div class="try"><p>${T.tryIt}</p><div class="picks">
              ${Object.keys(SUBJECTS).map((k) => `<button type="button" class="pick" data-k="${k}" aria-pressed="false"><span class="ph">${art(SUBJECTS[k].art, { scene: true, tilt: SUBJECTS[k].tilt })}</span>${T.subjects[k]}</button>`).join('')}
            </div></div>
          </div>

          <div class="side">
            <div><div class="eyebrow">${T.inside}</div><h3>${T.insideTitle}</h3></div>
            <div class="parts">${T.parts.map((x, i) => `<span data-p="${i}"><b>${i + 1}</b>${x}</span>`).join('')}</div>
            <div class="grps">
              <div class="grp" data-g="0">${[0, 1, 2].map(lstep).join('')}</div>
              <div class="grp" data-g="1">${[0, 1, 2, 3].map(step).join('')}</div>
            </div>
            <div class="chips">${T.chips.map((c) => `<span>${c}</span>`).join('')}</div>
            <p class="note">${T.note}</p>
          </div>
        </div>
        <div class="foot">
          <div class="chapters">${T.chapters.map((s, i) => `<button type="button" data-i="${i}" aria-label="${T.chapterLabel(s)}"><i>${['i', 'ii', 'iii', 'iv', 'v'][i]}.</i>${s}</button>`).join('')}</div>
          <div class="ctrl">
            <button type="button" class="b-play"></button>
            <button type="button" class="b-restart">${I.restart}<span>${T.restart}</span></button>
            <a class="b-app" href="${this.getAttribute('app-url') || APP_URL}" target="_blank" rel="noopener">${T.openApp} →</a>
          </div>
        </div>
        <span class="tap"></span>
        <svg class="cursor" viewBox="0 0 26 26" aria-hidden="true"><path d="M4 2.5 21 13.6l-7.6 1.4 4.2 7.6-3.3 1.8-4.2-7.7L4.6 21.6Z" fill="#fff" stroke="#2A1E16" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>`

      const $ = (s) => this.root.querySelector(s), $$ = (s) => [...this.root.querySelectorAll(s)]
      this.el = {
        stage: $('.stage'), screen: $('.screen'), scr: Object.fromEntries($$('.scr').map((s) => [s.dataset.scr, s])), sbar: $('.sbar'),
        goFound: $('.go-found'), goLost: $('.go-lost'), seen: $('.lv.seen'), caraRow: $('.rowwrap[data-pet="caramelo"]'),
        ls: $('.ls'), lback: $('.lback'), ths: $$('.th:not(.empty)'), busy: $$('.th .busy'), galBtn: $('.galbtn'), save: $('.savebtn'),
        fields: Object.fromEntries($$('.in[data-f]').map((n) => [n.dataset.f, n])),
        pback: $('.pback'), pcard: $('.pcard'), prw: $('.prw'),
        parts: $$('.parts span'), grps: $$('.grp'), lsteps: $$('.grp[data-g="0"] .step'), lbars: $$('.lv1 svg.lb g'),
        vf: $('.vf'), hint: $('.hint'), shutter: $('.shutter'), flash: $('.flash'),
        rs: $('.rs'), back: $('.backb'), fimg: $('.fimg'), ftitle: $('.ftitle'), fsub: $('.fsub'), prog: $('.prog'), progI: $('.prog i'), skel: $('.skel'),
        cards: $('.cards'), share: $('.share'), reg: $('.reg'), regt: $('.regt'), regb: $('.regb'),
        wa: $('.wapp'), waBack: $('.wa-back'), av: $('.wapp .av'), wan: $('.wan'), was: $('.was'), bub: $('.bub'), btxt: $('.btxt'), tk: $('.tk'), field: $('.field'), send: $('.sendb'),
        picks: $$('.pick'), steps: $$('.grp[data-g="1"] .step'), barsG: $('.bars .bg'), crows: $('.crows'), marker: $('.marker'), mk: $('.mk'),
        aiDot: $('.ai .chipi'), chapters: $$('.chapters button'), play: $('.b-play'), restart: $('.b-restart'), cursor: $('.cursor'), tap: $('.tap'),
      }
      // barrinhas das 3 fotos cadastradas: padrões parecidos (mesmo cão) com pequenas diferenças
      const base = seeded(77), baseH = Array.from({ length: 14 }, () => (base() * 2 - 1) * (0.4 + base() * 0.6))
      this.lbarEls = this.el.lbars.map((g, k) => {
        const rnd = seeded(5 + k)
        return baseH.map((h0, i) => {
          const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          r.setAttribute('x', i * 4.57 + 0.6); r.setAttribute('width', 3); r.setAttribute('rx', 0.8)
          g.appendChild(r)
          return { r, h: clamp(h0 + (rnd() - 0.5) * 0.35, -1, 1) }
        })
      })
      this.barEls = Array.from({ length: 48 }, (_, i) => {
        const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        r.setAttribute('x', i * 10 + 2); r.setAttribute('width', 6); r.setAttribute('rx', 1.5)
        this.el.barsG.appendChild(r); return r
      })
    }

    setup() {
      this.clock = 0; this.sc = 0; this.prevSc = -1; this.timers = []
      this.events = null; this.loop = true; this.paused = false
      Object.assign(this, {
        scr: 'home', prevScr: null, scrV: new Val(1),
        camIn: new Val(1), flashV: new Val(0), embedV: new Val(0), cmpV: new Val(0), resV: new Val(0), scrollV: new Val(0),
        waV: new Val(0), sentV: new Val(0), seenV: new Val(0), comparing: false, step: -1, chapter: -1,
        partIdx: 0, partV: new Val(0), rowV: new Val(0), lstep: -1, lostScroll: new Val(0), posterV: new Val(0), saving: false, activeField: null,
        photoV: [0, 1, 2].map(() => new Val(0)), doneV: [0, 1, 2].map(() => new Val(0)),
        fieldV: Object.fromEntries(Object.keys(VALUES).map((k) => [k, new Val(0)])),
        cur: { fromX: 0, fromY: 0, target: null, p: new Val(1), vis: new Val(0), click: new Val(0) },
      })
      this.setSubject('dog')

      const el = this.el
      el.goFound.addEventListener('click', () => this.runManual(this.subj))
      el.goLost.addEventListener('click', () => this.runLost())
      el.lback.addEventListener('click', () => { this.manual(); this.lstep = -1; this.goScreen('home') })
      el.pback.addEventListener('click', () => { this.manual(); this.lstep = -1; this.goScreen('home'); this.rowV.go(this.clock, 1, this.d(600), ease.out, this.d(250)) })
      el.shutter.addEventListener('click', (e) => { if (e.isTrusted) this.runManual(this.subj, 900) })
      el.back.addEventListener('click', () => { this.manual(); this.step = -1; this.goScreen('home') })
      el.picks.forEach((b) => b.addEventListener('click', () => this.runManual(b.dataset.k)))
      el.cards.addEventListener('click', (e) => { if (e.target.closest('.sbtn.wa') && e.isTrusted) { this.manual(); this.openWA() } })
      el.send.addEventListener('click', (e) => { if (e.isTrusted) { this.manual(); this.sendWA() } })
      el.waBack.addEventListener('click', () => { this.manual(); this.closeWA() })
      el.chapters.forEach((b) => b.addEventListener('click', () => { this.seek(CHAPTERS[+b.dataset.i]); this.paused = false; this.setPlayLabel(); this.wake() }))
      el.play.addEventListener('click', () => {
        if (!this.loop) { this.seek(0); this.paused = false }
        else this.paused = !this.paused
        this.cur.vis.go(this.clock, this.paused ? 0 : 1, 200)
        this.setPlayLabel(); this.wake()
      })
      el.restart.addEventListener('click', () => { this.seek(0); this.paused = false; this.setPlayLabel(); this.wake() })
      this.ro = new ResizeObserver(() => this.render()); this.ro.observe(this)
    }

    d(ms) { return this.reduced && !this.loop ? 0 : ms }
    after(ms, fn) { this.timers.push({ at: this.clock + ms, fn }); this.timers.sort((a, b) => a.at - b.at) }
    setPlayLabel() {
      const on = this.loop && !this.paused
      this.el.play.innerHTML = (on ? I.pause : I.play) + `<span>${on ? this.T.pause : this.T.play}</span>`
      this.el.play.setAttribute('aria-label', on ? this.T.pause : this.T.play)
    }
    /* qualquer toque de verdade tira o autoplay */
    manual() {
      if (!this.loop) return
      this.loop = false; this.paused = false; this.events = []; this.timers = []
      this.cur.vis.go(this.clock, 0, 200); this.chapter = -1
      this.setPlayLabel(); this.wake()
    }

    /* ---------- conteúdo que depende do animal escolhido ---------- */
    setSubject(k) {
      const T = this.T, S = SUBJECTS[k]
      this.subj = k
      this.ranked = PETS.map((p) => ({ p, pct: S.scores[p.id] })).sort((a, b) => b.pct - a.pct)
      this.best = this.ranked[0]
      this.achou = this.best.pct >= MATCH
      const photo = art(S.art, { scene: true, tilt: S.tilt })
      this.el.vf.innerHTML = art(S.art, { scene: true, tilt: S.tilt, wide: true })
      this.el.fimg.innerHTML = photo
      this.el.cards.innerHTML = this.ranked.map((r, i) => {
        const p = r.p, lv = level(r.pct), best = i === 0 && this.achou
        return `<div class="match${best ? ' best' : ''}">
          <div class="mh"><div class="ph">${art(p.art, { bg: p.bg })}</div><div class="info"><b>${p.name}</b><span>${T.species[p.sp]} · ${p.when[this.lang]} · ${p.where}</span></div><div class="pct">${r.pct}%</div></div>
          <div class="bar"><i></i></div><div><span class="lv ${lv}">${T.levels[lv]}</span></div>
          ${best && p.reward ? `<div class="reward">${T.reward(p.reward)}</div>` : ''}
          ${i === 0 ? `<div class="acts"><span class="sbtn sec">${T.seeAd}</span>${r.pct >= MATCH ? `<button type="button" class="sbtn wa">${T.talk(p.contact)}</button>` : ''}</div>` : ''}
        </div>`
      }).join('')
      this.cardEls = [...this.el.cards.children]
      this.cardBars = this.cardEls.map((c) => c.querySelector('.bar i'))
      this.waBtn = this.el.cards.querySelector('.sbtn.wa')
      this.el.share.hidden = !this.achou
      this.el.regt.textContent = this.achou ? T.regTitleA : T.regTitleB
      this.el.regb.textContent = T.regBtn
      this.el.regb.className = 'sbtn ' + (this.achou ? 'sec' : 'pri')
      // painel "por dentro"
      this.el.crows.innerHTML = this.ranked.map((r) => `<div class="crow"><span class="ph">${art(r.p.art, { bg: r.p.bg })}</span><span>${r.p.name}</span><span class="m"><i style="background:${{ hi: '#1F7A4D', md: '#C28A00', lo: '#B7A898' }[level(r.pct)]}"></i></span><span class="v">0%</span></div>`).join('')
      this.crowEls = [...this.el.crows.children].map((c) => ({ m: c.querySelector('.m i'), v: c.querySelector('.v') }))
      const rnd = seeded(S.seed)
      this.barH = Array.from({ length: 48 }, () => (rnd() * 2 - 1) * (0.35 + rnd() * 0.65))
      this.el.mk.textContent = `${this.best.p.name} ${this.best.pct}%`
      // WhatsApp
      const p = this.best.p
      this.el.av.textContent = p.contact[0]; this.el.wan.textContent = p.contact; this.el.was.textContent = T.waSub(p.name)
      const msg = T.waMsg(p.contact, p.name)
      this.el.btxt.textContent = msg; this.el.field.textContent = msg
      this.el.picks.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === k)))
    }

    /* ---------- ações ---------- */
    goScreen(name, d = 450) {
      if (name === this.scr) return
      this.prevScr = this.scr; this.scr = name
      this.scrV.go(this.clock, 0); this.scrV.go(this.clock, 1, this.d(d), ease.io)
      this.wake()
    }
    resetResult() {
      const now = this.clock
      for (const v of [this.flashV, this.embedV, this.cmpV, this.resV, this.scrollV, this.waV, this.sentV]) v.go(now, 0)
      this.comparing = false
      this.el.ftitle.textContent = this.T.comparing; this.el.fsub.textContent = this.T.comparingSub
    }
    takePhoto() { this.flashV.go(this.clock, 0.9); this.flashV.go(this.clock, 0, this.d(520), ease.out) }
    startCompare() {
      this.comparing = true; this.step = 1
      this.el.ftitle.textContent = this.T.comparing; this.el.fsub.textContent = this.T.comparingSub
      this.embedV.go(this.clock, 0); this.embedV.go(this.clock, 1, this.d(1300), ease.out)
    }
    compare() { this.step = 2; this.cmpV.go(this.clock, 0); this.cmpV.go(this.clock, 1, this.d(1400), ease.io) }
    showResults() {
      const T = this.T
      this.comparing = false; this.step = 3
      this.el.ftitle.textContent = this.achou ? T.maybe(this.best.p.name) : T.none
      this.el.fsub.textContent = this.achou ? T.maybeSub : T.noneSub(PETS.length)
      this.cmpV.go(this.clock, 1)
      this.resV.go(this.clock, 0); this.resV.go(this.clock, 1, this.d(1000), ease.out)
      if (!this.achou) this.scrollV.go(this.clock, 1, this.d(800), ease.io, this.d(900))
      this.wake()
    }
    openWA() { if (!this.achou) return; this.sentV.go(this.clock, 0); this.waV.go(this.clock, 1, this.d(450), ease.out); this.el.wa.setAttribute('aria-hidden', 'false'); this.wake() }
    sendWA() { if (this.waV.to < 1) return; this.sentV.go(this.clock, 1, this.d(380), ease.back); this.wake() }
    closeWA() { this.waV.go(this.clock, 0, this.d(400), ease.io); this.el.wa.setAttribute('aria-hidden', 'true'); this.wake() }

    reset() {
      const now = this.clock
      this.timers = []
      this.setSubject('dog')
      this.resetResult()
      this.prevScr = null; this.scr = 'home'; this.scrV.go(now, 1)
      this.camIn.go(now, 1); this.seenV.go(now, 0)
      this.step = -1; this.chapter = -1
      this.resetLost()
      this.partIdx = 0; this.partV.go(now, 0); this.rowV.go(now, 0); this.lstep = -1
    }
    resetLost() {
      const now = this.clock
      for (const v of [...this.photoV, ...this.doneV, ...Object.values(this.fieldV), this.lostScroll, this.posterV]) v.go(now, 0)
      this.saving = false; this.activeField = null
    }
    setPart(i) { this.partIdx = i; this.partV.go(this.clock, i, this.d(500), ease.io) }
    addPhotos() {
      const now = this.clock
      this.photoV.forEach((v, i) => { v.go(now, 0); v.go(now, 1, this.d(320), ease.back, this.d(i * 250)) })
      this.doneV.forEach((v, i) => { v.go(now, 0); v.go(now, 1, this.d(350), ease.out, this.d(800 + i * 450)) })
    }
    fill(k, d) { this.activeField = k; this.fieldV[k].go(this.clock, 0); this.fieldV[k].go(this.clock, 1, this.d(d), ease.lin) }
    savePet() {
      this.saving = true; this.activeField = null
      this.after(this.d(450), () => { this.goScreen('poster'); this.lstep = 2; this.chapter = this.loop ? 1 : this.chapter; this.saving = false
        this.posterV.go(this.clock, 0); this.posterV.go(this.clock, 1, this.d(900), ease.out) })
    }

    /* ---------- roteiros ---------- */
    /* parte 1: perdi meu pet (cursor = true no autoplay) */
    lostEvents(cursor) {
      const el = this.el, F = el.fields
      const mv = (t, d) => () => { if (cursor) this.moveCursor(t, d) }
      const ck = () => { if (cursor) this.click() }
      return [
        [500, mv(el.goLost, 700)],
        [1300, ck],
        [1400, () => { if (cursor) this.chapter = 0; this.setPart(0); this.goScreen('lost'); this.lstep = 0 }],
        [2000, mv(el.galBtn, 600)],
        [2700, () => { ck(); this.addPhotos() }],
        [4200, mv(F.name, 500)],
        [4700, () => { ck(); this.lstep = 1; this.fill('name', 600) }],
        [5400, () => this.lostScroll.go(this.clock, 0.45, this.d(600), ease.io)],
        [5500, mv(F.where, 400)],
        [5900, () => { ck(); this.fill('where', 350) }],
        [6400, mv(F.reward, 350)],
        [6750, () => { ck(); this.fill('reward', 350) }],
        [7200, () => this.lostScroll.go(this.clock, 1, this.d(600), ease.io)],
        [7300, mv(F.contact, 400)],
        [7800, () => { ck(); this.fill('contact', 350) }],
        [8300, mv(F.zap, 350)],
        [8650, () => { ck(); this.fill('zap', 700) }],
        [9400, mv(el.save, 500)],
        [9950, () => { ck(); this.savePet() }],
      ]
    }
    script() {
      const el = this.el, P = PART2
      return [
        [0, () => { this.reset(); this.moveCursor('rest', 0); this.cur.vis.go(this.clock, 1, 400) }],
        ...this.lostEvents(true),
        [12600, () => this.moveCursor(el.pback, 600)],
        [13200, () => { this.click(); this.goScreen('home'); this.rowV.go(this.clock, 1, 600, ease.out, 300) }],
        [14000, () => { this.moveCursor('rest', 800); this.lstep = -1 }],
        // parte 2: encontrei um animal
        [P, () => { this.setPart(1); this.resetLost() }],
        [P + 300, () => this.moveCursor(el.goFound, 700)],
        [P + 1000, () => this.click()],
        [P + 1100, () => { this.chapter = 2; this.goScreen('cam'); this.step = 0; this.camIn.go(this.clock, 0); this.camIn.go(this.clock, 1, 1200, ease.out, 200) }],
        [P + 2400, () => this.moveCursor(el.shutter, 600)],
        [P + 3000, () => { this.click(); this.takePhoto() }],
        [P + 3350, () => { this.chapter = 3; this.goScreen('res'); this.startCompare() }],
        [P + 4500, () => this.compare()],
        [P + 5800, () => this.showResults()],
        [P + 7100, () => { this.chapter = 4; this.moveCursor(this.waBtn, 650) }],
        [P + 7800, () => { this.click(); this.openWA() }],
        [P + 8800, () => this.moveCursor(el.send, 600)],
        [P + 9400, () => { this.click(); this.sendWA() }],
        [P + 10900, () => this.closeWA()],
        [P + 11300, () => { this.goScreen('home'); this.seenV.go(this.clock, 1, 500, ease.back, 300); this.moveCursor('rest', 900) }],
        [P + 12000, () => { this.step = -1; for (const v of [this.embedV, this.cmpV, this.resV]) v.go(this.clock, 0, 700, ease.io) }],
        [P + 13700, () => { this.chapter = -1; this.seenV.go(this.clock, 0, 450); this.rowV.go(this.clock, 0, 600, ease.io); this.setPart(0); this.cur.vis.go(this.clock, 0, 450) }],
      ]
    }
    runLost() {
      this.manual(); this.closeWA()
      this.resetLost(); this.lostScroll.go(this.clock, 0)
      this.events = this.lostEvents(false).map(([t, fn]) => [t - 1400, fn]).filter(([t]) => t >= 0)
      this.events.unshift([0, () => { this.setPart(0); this.goScreen('lost', 350); this.lstep = 0 }])
      this.sc = 0; this.prevSc = -1
      if (this.reduced) { while (this.sc < 9000) this.tick(50, false); this.render() }
      this.wake()
    }
    manualScript(k, from) {
      return [
        [0, () => { this.setSubject(k); this.resetResult(); this.setPart(1); this.lstep = -1; this.rowV.go(this.clock, 1, this.d(300)); this.seenV.go(this.clock, 0, 200); this.goScreen('cam', 300); this.step = 0; this.camIn.go(this.clock, 0); this.camIn.go(this.clock, 1, this.d(900), ease.out) }],
        [from, () => this.takePhoto()],
        [from + 350, () => { this.goScreen('res', 350); this.startCompare() }],
        [from + 1550, () => this.compare()],
        [from + 2900, () => this.showResults()],
      ]
    }
    runManual(k, from = 1100) {
      this.manual()
      this.closeWA()
      this.events = this.manualScript(k, this.reduced ? 0 : from)
      this.sc = 0; this.prevSc = -1
      if (this.reduced) { while (this.sc < from + 3000) this.tick(50, false); this.render() }
      this.wake()
    }

    moveCursor(target, d) {
      const c = this.cur, p = this.cursorPoint()
      c.fromX = p.x; c.fromY = p.y; c.target = target
      c.p.go(this.clock, 0); c.p.go(this.clock, 1, d, ease.io)
    }
    click() { this.cur.click.go(this.clock, 0); this.cur.click.go(this.clock, 1, 520, ease.out) }
    targetPoint(t) {
      const s = this.el.stage.getBoundingClientRect()
      if (!t || t === 'rest' || !t.getBoundingClientRect) {
        const ph = this.el.screen.getBoundingClientRect()
        return { x: ph.right - s.left + 40, y: ph.top - s.top + ph.height * 0.62 }
      }
      const r = t.getBoundingClientRect()
      if (!r.width) return t._last || this.targetPoint('rest')
      return (t._last = { x: r.left - s.left + r.width * 0.55, y: r.top - s.top + r.height * 0.58 })
    }
    cursorPoint() {
      const c = this.cur
      if (!c.target) return this.targetPoint('rest')
      const to = this.targetPoint(c.target), p = c.p.get(this.clock)
      return { x: lerp(c.fromX, to.x, p), y: lerp(c.fromY, to.y, p) }
    }

    /* ---------- relógio ---------- */
    tick(dt, draw = true) {
      if (this.paused) { if (draw) this.render(); return }
      this.clock += dt
      if (this.loop && !this.events) this.events = this.script()
      if (this.events) {
        this.sc += dt
        for (const [t, fn] of this.events) if (t > this.prevSc && t <= this.sc) fn()
        this.prevSc = this.sc
        if (this.loop && this.sc >= LOOP) { this.sc = 0; this.prevSc = -1 }
      }
      while (this.timers.length && this.timers[0].at <= this.clock) this.timers.shift().fn()
      if (draw) this.render()
    }
    seek(ms) {
      this.loop = true; this.paused = false; this.events = this.script()
      this.sc = 0; this.prevSc = -1
      while (this.sc < ms) this.tick(Math.min(40, ms - this.sc), true)
      if (ms === 0) this.tick(0)
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
      if (this.capturing || this.raf || !this.visible || document.hidden) return
      let last = performance.now()
      const loop = (t) => { this.tick(Math.min(50, t - last)); last = t; this.raf = requestAnimationFrame(loop) }
      this.raf = requestAnimationFrame(loop)
    }
    stopLoop() { cancelAnimationFrame(this.raf); this.raf = 0 }
    /** Para gravar vídeo: desliga o relógio real e avança quadro a quadro. */
    capture() {
      this.capturing = true; this.stopLoop()
      this.loop = true; this.paused = false; this.events = this.script(); this.sc = 0; this.prevSc = -1
      this.setPlayLabel()
      return { advance: (ms) => this.tick(ms) }
    }

    /* ---------- desenho ---------- */
    render() {
      const now = this.clock, el = this.el
      const sv = this.scrV.get(now)

      // telas
      for (const [name, node] of Object.entries(el.scr)) {
        let o = 0
        if (name === this.scr) o = sv
        else if (name === this.prevScr) o = 1 - sv
        node.hidden = o <= 0.001
        node.style.opacity = o
        node.style.transform = name === this.scr ? `translateX(${(1 - sv) * 6}%)` : `translateX(${-(sv) * 4}%)`
        node.style.pointerEvents = name === this.scr ? '' : 'none'
        node.toggleAttribute('inert', name !== this.scr)
      }
      const dark = (this.scr === 'cam' ? sv : 0) + (this.prevScr === 'cam' ? 1 - sv : 0)
      const onDark = dark > 0.5 || this.waV.get(now) > 0.5
      el.sbar.style.color = onDark ? '#fff' : '#2A1E16'
      el.sbar.style.background = onDark ? 'transparent' : 'var(--bg)'

      // câmera
      const ci = this.camIn.get(now), wob = Math.sin(now / 420) * 2 * (this.reduced ? 0 : 1)
      el.vf.style.transform = `translate(${(1 - ci) * 26 + wob}px, ${Math.cos(now / 530) * 1.5}px) scale(${1.14 - 0.14 * ci})`
      el.hint.style.opacity = clamp(ci * 1.4)
      el.flash.style.opacity = this.flashV.get(now)

      // resultado
      const rv = this.resV.get(now)
      el.prog.style.opacity = this.comparing ? 1 : 1 - clamp(rv * 3)
      el.prog.style.height = this.comparing || rv < 0.34 ? '' : '0'
      el.skel.style.display = this.comparing ? '' : 'none'
      el.cards.style.display = this.comparing ? 'none' : 'flex'
      for (const b of el.skel.children) b.style.backgroundPosition = `${-((now / 900) % 1) * 200}% 0`
      el.progI.style.transform = `translateX(${(((now / 1100) % 1) * 350) - 100}%)`
      this.cardEls.forEach((c, i) => {
        const k = clamp(rv * 1.7 - i * 0.32)
        c.style.opacity = ease.out(k)
        c.style.transform = `translateY(${(1 - ease.out(k)) * 14}px)`
        this.cardBars[i].style.width = `${this.ranked[i].pct * ease.io(clamp(k * 1.2))}%`
      })
      for (const b of [el.share, el.reg]) b.style.opacity = clamp(rv * 1.7 - 0.9)
      const view = el.scr.res.clientHeight, full = el.rs.scrollHeight
      el.rs.style.transform = `translateY(${-Math.max(0, full - view) * this.scrollV.get(now)}px)`

      // WhatsApp
      const wv = this.waV.get(now), st = this.sentV.get(now)
      el.wa.style.transform = `translateY(${(1 - wv) * 100}%)`
      el.wa.style.visibility = wv <= 0.001 ? 'hidden' : ''
      el.bub.style.opacity = clamp(st)
      el.bub.style.transform = `translateY(${(1 - clamp(st)) * 30}px) scale(${lerp(0.92, 1, clamp(st))})`
      el.tk.style.opacity = clamp(st * 2 - 1)
      el.field.textContent = st > 0.05 ? this.T.typeMsg : el.btxt.textContent
      el.field.classList.toggle('ph0', st > 0.05)

      // cadastro
      const rw = this.rowV.get(now)
      el.caraRow.style.maxHeight = `${rw * 4.6}em`; el.caraRow.style.opacity = rw
      el.caraRow.style.display = rw <= 0.001 ? 'none' : ''
      el.ths.forEach((t, i) => { const v = this.photoV[i].get(now); t.style.opacity = clamp(v); t.style.transform = `scale(${lerp(0.6, 1, v)})` })
      el.busy.forEach((b, i) => { b.style.opacity = 1 - this.doneV[i].get(now) })
      for (const [k, n] of Object.entries(el.fields)) {
        const v = this.fieldV[k].get(now), txt = VALUES[k].slice(0, Math.round(VALUES[k].length * v))
        const act = this.activeField === k
        n.classList.toggle('act', act)
        const blink = act && (v < 1 || Math.floor(now / 530) % 2 === 0)
        if (n._t !== txt + blink) { n.textContent = txt; if (blink) n.insertAdjacentHTML('beforeend', '<span class="car"></span>'); n._t = txt + blink }
      }
      const lview = el.scr.lost.clientHeight, lfull = el.ls.scrollHeight
      el.ls.style.transform = `translateY(${-Math.max(0, lfull - lview) * this.lostScroll.get(now)}px)`
      el.save.textContent = this.saving ? this.T.saving : this.T.save
      el.save.style.opacity = this.saving ? 0.6 : 1
      const pv = this.posterV.get(now)
      el.pcard.style.opacity = clamp(pv * 1.3)
      el.pcard.style.transform = `translateY(${(1 - pv) * 18}px) scale(${lerp(0.94, 1, pv)})`
      el.prw.style.transform = `scale(${lerp(0.6, 1, ease.back(clamp(pv * 1.4 - 0.4)))})`

      // início
      el.seen.style.opacity = this.seenV.get(now)
      el.seen.style.display = this.seenV.get(now) <= 0.001 ? 'none' : ''

      // painel "por dentro"
      const pt = this.partV.get(now)
      el.grps[0].style.opacity = clamp(1 - pt * 2); el.grps[1].style.opacity = clamp(pt * 2 - 1)
      el.grps[0].style.visibility = pt >= 0.999 ? 'hidden' : ''; el.grps[1].style.visibility = pt <= 0.001 ? 'hidden' : ''
      el.grps[0].toggleAttribute('inert', this.partIdx !== 0); el.grps[1].toggleAttribute('inert', this.partIdx !== 1)
      el.parts.forEach((x, i) => x.classList.toggle('on', i === this.partIdx))
      el.lsteps.forEach((x, i) => x.classList.toggle('on', i === this.lstep))
      this.lbarEls.forEach((bars, k) => {
        const dv = this.doneV[k].get(now)
        bars.forEach(({ r, h }, i) => {
          const hh = h * 11 * ease.out(clamp(dv * 1.5 - (i / 14) * 0.5))
          r.setAttribute('y', hh >= 0 ? 13 - hh : 13); r.setAttribute('height', Math.max(0.01, Math.abs(hh)))
          r.setAttribute('fill', hh >= 0 ? '#C2410C' : '#E9A27C')
        })
      })
      el.steps.forEach((s, i) => s.classList.toggle('on', i === this.step))
      const ev = this.embedV.get(now)
      this.barEls.forEach((r, i) => {
        const k = clamp(ev * 1.6 - (i / 48) * 0.6)
        const h = this.barH[i] * 21 * ease.out(k)
        r.setAttribute('y', h >= 0 ? 23 - h : 23); r.setAttribute('height', Math.max(0.01, Math.abs(h)))
        r.setAttribute('fill', h >= 0 ? '#C2410C' : '#E9A27C')
      })
      const cv = this.cmpV.get(now)
      this.crowEls.forEach((c, i) => {
        const k = clamp(cv * 1.5 - i * 0.25), pct = this.ranked[i].pct * ease.io(k)
        c.m.style.width = `${pct}%`; c.v.textContent = `${Math.round(pct)}%`
      })
      el.marker.style.left = `${this.best.pct * ease.out(clamp(rv))}%`
      el.marker.style.opacity = clamp(rv * 2)

      const busyAI = Math.max(this.embedV.get(now) < 1 && this.comparing ? 1 : 0, this.doneV.some((v) => { const x = v.get(now); return x > 0 && x < 1 }) ? 1 : 0)
      const ph = (now % 900) / 900
      el.aiDot.style.setProperty('--glow', busyAI && !this.reduced ? (1 - ph).toFixed(3) : 0)
      el.aiDot.style.setProperty('--gs', (1 + ph * 0.6).toFixed(3))
      el.chapters.forEach((b, i) => { b.classList.toggle('on', i === this.chapter); b.setAttribute('aria-pressed', String(i === this.chapter)) })

      // cursor simulado
      const vis = this.cur.vis.get(now)
      if (vis > 0) {
        const p = this.cursorPoint(), ck = this.cur.click.get(now)
        const press = ck > 0 && ck < 1 ? Math.sin(Math.min(1, ck * 3) * Math.PI) : 0
        el.cursor.style.opacity = vis
        el.cursor.style.transform = `translate(${p.x - 4}px, ${p.y - 3}px) scale(${1 - 0.14 * press})`
        el.tap.style.opacity = ck > 0 && ck < 1 ? (1 - ck) * 0.9 * vis : 0
        el.tap.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.3 + ck * 0.9})`
      } else { el.cursor.style.opacity = 0; el.tap.style.opacity = 0 }
    }
  }

  if (!customElements.get('reencontro-demo')) customElements.define('reencontro-demo', ReencontroDemo)
})()

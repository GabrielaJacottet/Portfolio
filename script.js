'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const email = document.querySelector('.email').href.replace('mailto:', '');
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

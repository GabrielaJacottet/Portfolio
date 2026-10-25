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

const demo = document.querySelector('memory-garden-demo');
const loadDemo = () => {
  const script = document.createElement('script');
  script.src = 'assets/memory-garden-demo/memory-garden-demo.js';
  document.head.append(script);
};
if ('IntersectionObserver' in window) {
  const demoObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      demoObserver.disconnect();
      loadDemo();
    }
  }, { rootMargin: '400px 0px' });
  demoObserver.observe(demo);
} else {
  loadDemo();
}

const videoLink = document.getElementById('open-video');
const videoDialog = document.getElementById('video-dialog');
const video = videoDialog.querySelector('video');
videoLink.addEventListener('click', (event) => {
  if (typeof videoDialog.showModal !== 'function') return;
  event.preventDefault();
  videoDialog.showModal();
  video.play().catch(() => {});
});
videoDialog.addEventListener('click', (event) => {
  if (event.target === videoDialog) videoDialog.close();
});
videoDialog.addEventListener('close', () => video.pause());

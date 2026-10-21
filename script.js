'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('gjacottet@gmail.com');
    copyButton.textContent = 'E-mail copiado ✓';
    copyStatus.textContent = 'E-mail copiado para a área de transferência.';
  } catch {
    copyButton.textContent = 'Copie: gjacottet@gmail.com';
    copyStatus.textContent = 'Não foi possível copiar automaticamente. Use o endereço gjacottet@gmail.com.';
  }
});

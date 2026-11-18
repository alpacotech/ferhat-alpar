'use strict';

const cardUrl = 'https://alpacotech.github.io/ferhat-alpar/';
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}

async function copyText(text, successMessage) {
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      copied = true;
    }
  } catch { /* Try the compatible clipboard method below. */ }
  if (!copied) {
    const previousFocus = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('aria-label', 'Kopyalanacak bilgi');
    field.style.cssText = 'position:fixed;top:-9999px;opacity:0';
    document.body.appendChild(field);
    field.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    field.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }
  if (copied) {
    showToast(successMessage);
  }
  return copied;
}

document.getElementById('extension-button').addEventListener('click', async () => {
  if (!await copyText('1466', 'Dahili numara kopyalandı: 1466')) showToast('Dahili numara: 1466');
});
document.getElementById('share-button').addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Ferhat Alpar · Haliç Üniversitesi', text: 'Dijital İletişim Müdürü · Dijital kartvizit', url: cardUrl });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  if (!await copyText(cardUrl, 'Kartvizit bağlantısı kopyalandı.')) {
    document.getElementById('share-fallback').hidden = false;
    qrDialog.showModal();
    document.getElementById('share-url').select();
  }
});

const qrDialog = document.getElementById('qr-dialog');
document.getElementById('qr-button').addEventListener('click', () => qrDialog.showModal());
document.getElementById('close-dialog').addEventListener('click', () => qrDialog.close());
qrDialog.addEventListener('click', event => {
  if (event.target !== qrDialog) return;
  const bounds = qrDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) qrDialog.close();
});
qrDialog.addEventListener('close', () => document.getElementById('qr-button').focus());

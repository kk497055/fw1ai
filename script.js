const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
const form = document.querySelector('#contactForm');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button');
  const status = document.querySelector('#formStatus');
  button.disabled = true;
  status.textContent = 'Sending your brief…';
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    status.textContent = 'Thank you. Your project brief has been sent.';
    form.reset();
  } catch {
    status.textContent = 'Your brief could not be sent. Please email info@fw1ai.com directly.';
  } finally {
    button.disabled = false;
  }
});

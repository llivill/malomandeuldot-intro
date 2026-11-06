(() => {
  const root = document.getElementById('dot-video-start');
  const video = root.querySelector('#intro-video');
  const actions = root.querySelector('#intro-actions');
  const phone = root.querySelector('.intro-phone');
  const button = root.querySelector('.intro-create');
  const letters = root.querySelector('.intro-letters');
  const label = letters.textContent;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  letters.replaceChildren(...Array.from(label, (character, index) => {
    const letter = document.createElement('span');
    letter.className = 'intro-letter';
    letter.style.setProperty('--letter-index', index);
    letter.textContent = character;
    return letter;
  }));

  let shown = false;
  const show = () => {
    if (shown) return;
    shown = true;
    actions.classList.add('is-visible');
  };
  button.addEventListener('click', () => {
    phone.classList.remove('is-sparking');
    void phone.offsetWidth;
    phone.classList.add('is-sparking');
  });
  if (reduced) {
    video.removeAttribute('autoplay');
    video.pause();
    show();
  } else {
    video.addEventListener('playing', () => setTimeout(show, 1800), { once: true });
    video.addEventListener('error', show, { once: true });
    setTimeout(show, 3500);
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(show);
  }
})();

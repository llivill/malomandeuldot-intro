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

(() => {
  const root = document.getElementById('dot-video-start');
  const intro = root.querySelector('.intro-phone');
  const home = document.getElementById('adult-home');
  const board = document.getElementById('adult-board');
  const connect = document.getElementById('adult-connect');
  const idea = document.getElementById('adult-idea');
  const clarify = document.getElementById('adult-clarify');
  const review = document.getElementById('adult-review');
  const screens = [intro, home, board, connect, idea, clarify, review];
  const ideaText = document.getElementById('adult-idea-text');
  const titleInput = document.getElementById('adult-project-title');
  const monitorStatus = document.getElementById('adult-home-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let selectedModel = '';
  let opening = false;

  function showScreen(screen) {
    screens.forEach(item => { item.hidden = item !== screen; });
    const back = screen.querySelector('.adult-back');
    if (back) back.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function showHome(message = '') {
    showScreen(home);
    monitorStatus.textContent = message;
  }
  function showBoard() { showScreen(board); }
  function showIdea() { showScreen(selectedModel ? idea : board); }

  root.querySelector('.intro-create').addEventListener('click', () => {
    if (opening) return;
    opening = true;
    window.setTimeout(() => {
      root.querySelector('#intro-video').pause();
      showHome();
      opening = false;
    }, reduced ? 0 : 450);
  });
  home.querySelector('.home-start').addEventListener('click', showBoard);
  home.querySelector('.home-nav-create').addEventListener('click', showBoard);
  home.querySelector('.home-device').addEventListener('click', showBoard);
  home.querySelector('.home-settings').addEventListener('click', () => showScreen(selectedModel ? connect : board));
  home.querySelector('.home-nav-home').addEventListener('click', () => showHome());
  home.querySelector('.home-monitor').addEventListener('click', () => showHome('모니터링 화면은 아직 준비 중이에요.'));

  board.querySelectorAll('.board-choice').forEach(button => button.addEventListener('click', () => {
    selectedModel = button.dataset.model;
    board.querySelectorAll('.board-choice').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    root.querySelectorAll('[data-selected-board]').forEach(item => { item.textContent = selectedModel; });
    board.querySelector('.board-next').disabled = false;
  }));
  board.querySelector('.flow-back-board').addEventListener('click', () => showHome());
  board.querySelector('.board-next').addEventListener('click', () => { if (selectedModel) showScreen(connect); });
  connect.querySelector('.flow-back-connect').addEventListener('click', showBoard);
  connect.querySelector('.connect-next').addEventListener('click', showIdea);
  idea.querySelector('.flow-back-idea').addEventListener('click', () => showScreen(connect));
  const ideaNext = idea.querySelector('.idea-next');
  function updateIdea() { ideaNext.disabled = !ideaText.value.trim(); }
  ideaText.addEventListener('input', updateIdea);
  idea.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    ideaText.value = button.dataset.example;
    updateIdea();
    ideaText.focus();
  }));
  ideaNext.addEventListener('click', () => {
    if (!ideaText.value.trim()) return;
    root.querySelectorAll('[data-selected-idea]').forEach(item => { item.textContent = ideaText.value.trim(); });
    root.querySelectorAll('[data-selected-title]').forEach(item => { item.textContent = titleInput.value.trim() || '나의 프로젝트'; });
    showScreen(clarify);
  });
  clarify.querySelector('.clarify-back').addEventListener('click', showIdea);
  const clarifyNext = clarify.querySelector('.clarify-next');
  clarify.querySelectorAll('input[name="adult-trigger"]').forEach(input => {
    input.addEventListener('change', () => { clarifyNext.disabled = false; });
  });
  clarifyNext.addEventListener('click', () => {
    const selected = clarify.querySelector('input[name="adult-trigger"]:checked');
    if (!selected) return;
    root.querySelectorAll('[data-selected-trigger]').forEach(item => { item.textContent = selected.value; });
    document.getElementById('adult-review-status').textContent = '';
    showScreen(review);
  });
  review.querySelector('.review-back').addEventListener('click', () => showScreen(clarify));
  review.querySelector('.review-submit').addEventListener('click', () => {
    document.getElementById('adult-review-status').textContent = '요청을 확인했어요. 분석과 설계 화면은 준비 중이에요.';
  });
  root.querySelectorAll('[data-adult-nav]').forEach(button => button.addEventListener('click', () => {
    switch (button.dataset.adultNav) {
      case 'home': showHome(); break;
      case 'board': showBoard(); break;
      case 'idea': showIdea(); break;
      case 'monitor': showHome('모니터링 화면은 아직 준비 중이에요.'); break;
    }
  }));
})();

(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  const current = document.getElementById('currentSlide');
  const total = document.getElementById('totalSlides');
  const progress = document.getElementById('progressBar');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const toc = document.getElementById('toc');
  const sidebar = document.getElementById('sidebar');
  const menu = document.getElementById('menuBtn');
  let index = 0;
  total.textContent = slides.length;

  slides.forEach((slide, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${String(i+1).padStart(2,'0')} · ${slide.dataset.title || 'Slide'}`;
    button.addEventListener('click', () => { go(i); sidebar.classList.remove('open'); });
    toc.appendChild(button);
  });

  function go(i){
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((slide, n) => slide.classList.toggle('active', n === index));
    Array.from(toc.children).forEach((btn, n) => btn.classList.toggle('active', n === index));
    current.textContent = index + 1;
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    history.replaceState(null, '', `#${index + 1}`);
  }
  function step(delta){ go(index + delta); }
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  menu.addEventListener('click', () => sidebar.classList.toggle('open'));

  window.addEventListener('keydown', (e) => {
    if(['ArrowRight','PageDown',' '].includes(e.key)){ e.preventDefault(); step(1); }
    if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){ e.preventDefault(); step(-1); }
    if(e.key === 'Home') go(0);
    if(e.key === 'End') go(slides.length - 1);
    if(e.key.toLowerCase() === 'm') sidebar.classList.toggle('open');
    if(e.key.toLowerCase() === 'f') {
      if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
  });

  let startX = null;
  window.addEventListener('pointerdown', e => startX = e.clientX);
  window.addEventListener('pointerup', e => {
    if(startX === null) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
    startX = null;
  });

  const initial = parseInt(location.hash.replace('#',''), 10);
  go(Number.isFinite(initial) ? initial - 1 : 0);
})();

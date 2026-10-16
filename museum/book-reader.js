(() => {
  'use strict';
  let size = 20;
  const smaller = document.getElementById('text-smaller');
  const larger = document.getElementById('text-larger');
  const label = document.getElementById('text-size');
  if (!smaller || !larger || !label) return;
  const update = () => {
    document.documentElement.style.setProperty('--reading-size', `${size}px`);
    label.value = `${size} px`;
    smaller.disabled = size <= 18;
    larger.disabled = size >= 28;
  };
  smaller.addEventListener('click', () => { size = Math.max(18, size - 2); update(); });
  larger.addEventListener('click', () => { size = Math.min(28, size + 2); update(); });
  update();
})();

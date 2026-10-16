(() => {
  'use strict';
  const videos = [...document.querySelectorAll('#videos video')];
  if (!videos.length) return;
  const section = document.getElementById('videos');
  const toolbar = document.createElement('div');
  toolbar.className = 'video-toolbar';
  const status = document.createElement('p');
  status.className = 'player-status';
  status.setAttribute('role', 'status');
  status.textContent = '选择原片播放；可用上一集、下一集切换。 / Elektu filmon por ludi.';
  const pauseAll = document.createElement('button');
  pauseAll.type = 'button';
  pauseAll.textContent = '暂停全部 / Paŭzi ĉiujn';
  toolbar.append(status, pauseAll);
  section.querySelector('.video-grid').before(toolbar);
  let active = null;
  const episode = index => String(index + 1).padStart(2, '0');
  const announce = (index, text, eo) => {
    status.textContent = `第${episode(index)}集 / Epizodo ${index + 1} · ${text} / ${eo}`;
  };
  const pauseOthers = current => {
    videos.forEach(video => { if (video !== current) video.pause(); });
  };
  function choose(index) {
    const video = videos[index];
    if (!video) return;
    pauseOthers(video);
    active = video;
    announce(index, '正在准备播放', 'Preparante');
    video.scrollIntoView({ behavior: 'auto', block: 'center' });
    video.focus({ preventScroll: true });
    if (video.ended) video.currentTime = 0;
    const attempt = video.play();
    if (attempt) attempt.catch(() => {
      if (active === video) announce(index, '请点击画面中的播放按钮继续', 'Premu la ludbutonon');
    });
  }
  videos.forEach((video, index) => {
    const card = video.closest('article');
    card.id = `episode-${episode(index)}`;
    const controls = document.createElement('div');
    controls.className = 'episode-controls';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.textContent = '← 上一集 / Antaŭa';
    previous.disabled = index === 0;
    previous.setAttribute('aria-label', index ? `播放第${episode(index - 1)}集 / Ludi epizodon ${index}` : '已是第一集 / Unua epizodo');
    previous.addEventListener('click', () => choose(index - 1));
    const next = document.createElement('button');
    next.type = 'button';
    next.textContent = '下一集 / Sekva →';
    next.disabled = index === videos.length - 1;
    next.setAttribute('aria-label', index + 1 < videos.length ? `播放第${episode(index + 1)}集 / Ludi epizodon ${index + 2}` : '已是最后一集 / Lasta epizodo');
    next.addEventListener('click', () => choose(index + 1));
    controls.append(previous, next);
    card.querySelector('.details').append(controls);
    video.addEventListener('play', () => {
      active = video;
      pauseOthers(video);
      videos.forEach(other => other.closest('article').classList.toggle('is-playing', other === video));
      announce(index, '正在加载', 'Ŝargante');
    });
    video.addEventListener('playing', () => {
      if (active === video) announce(index, '正在播放', 'Ludante');
    });
    video.addEventListener('pause', () => {
      if (active === video && !video.ended) announce(index, '已暂停', 'Paŭzita');
      card.classList.remove('is-playing');
    });
    video.addEventListener('ended', () => {
      if (active === video) announce(index, '播放结束，可选择下一集或重播', 'Finita; elektu alian aŭ reludu');
      card.classList.remove('is-playing');
    });
    video.addEventListener('error', () => {
      if (active === video) announce(index, '暂时无法播放，请打开原片重试', 'Malfermu la originalan filmon');
    });
  });
  pauseAll.addEventListener('click', () => {
    videos.forEach(video => video.pause());
    status.textContent = '全部视频已暂停。 / Ĉiuj filmoj estas paŭzigitaj.';
  });
})();

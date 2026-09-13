(() => {
  'use strict';

  const state = { teachers: [], regular: [], parallel: [], group: [], index: 0, lastTrigger: null };
  const filters = [
    ['all','ALL'],['management','管理職'],['business','商業'],['english','英語'],['japanese','国語'],
    ['math','数学'],['science','理科'],['social','地歴公民'],['pe','保健体育'],['inquiry','探究'],['home','家庭'],['health','養護']
  ];

  const el = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initial = name => String(name || '').replace(/\s/g,'').slice(0,1) || 'T';
  const clean = value => String(value ?? '').trim();

  function imageMarkup(t, mode='card') {
    if (!t.image) return '';
    const pos = mode === 'profile' ? t.profileImagePosition : t.cardImagePosition;
    return `<img src="${esc(t.image)}" alt="${esc(t.name)}" loading="lazy" decoding="async" style="object-position:${esc(pos || '50% 50%')}">`;
  }

  function hashtagsMarkup(tags, className='hashtag') {
    return (tags || []).filter(Boolean).map(tag => `<span class="${className}">#${esc(tag)}</span>`).join('');
  }

  function regularCard(t, i) {
    const eager = i < 4 ? 'eager' : 'lazy';
    const image = t.image ? `<img src="${esc(t.image)}" alt="${esc(t.name)}" loading="${eager}" decoding="async" style="object-position:${esc(t.cardImagePosition || '50% 50%')}">` : '';
    return `<article class="teacher-card profile-trigger" tabindex="0" role="button" data-name="${esc(t.name)}" data-dept="${esc(t.department)}" aria-label="${esc(t.name)}のプロフィールを見る">
      <div class="teacher-card__media" data-initial="${esc(initial(t.name))}">
        ${image}<div class="teacher-card__shade"></div>
        <span class="teacher-card__category">${esc(t.category)}</span>
        <span class="teacher-card__arrow" aria-hidden="true">↗</span>
        <div class="teacher-card__body">
          <div class="teacher-card__role">${esc(t.position || t.roleEn || '')}</div>
          <h3 class="teacher-card__name">${esc(t.name)}</h3>
          <div class="teacher-card__name-en">${esc(t.nameEn)}</div>
          ${t.tagline ? `<p class="teacher-card__tagline">${esc(t.tagline)}</p>` : ''}
          <div class="hashtags">${hashtagsMarkup(t.hashtags)}</div>
        </div>
      </div>
    </article>`;
  }

  function parallelCard(t) {
    return `<article class="parallel-card profile-trigger" tabindex="0" role="button" data-name="${esc(t.name)}" aria-label="${esc(t.name)}のプロフィールを見る">
      <div class="parallel-card__visual" data-initial="${esc(initial(t.name))}">${imageMarkup(t)}</div>
      <div class="parallel-card__body">
        <div class="parallel-card__role">${esc(t.position || t.roleEn || 'PARALLEL TEACHER')}</div>
        <h3 class="parallel-card__name">${esc(t.name)}</h3>
        <div class="parallel-card__name-en">${esc(t.nameEn)}</div>
        ${t.tagline ? `<p class="parallel-card__tagline">${esc(t.tagline)}</p>` : ''}
        <div class="hashtags">${hashtagsMarkup(t.hashtags)}</div>
      </div>
    </article>`;
  }

  function renderDirectory() {
    el('filters').innerHTML = filters.map(([key,label],i) => `<button type="button" class="filter${i===0?' is-active':''}" data-filter="${key}">${label}</button>`).join('');
    el('teacherGrid').innerHTML = state.regular.map(regularCard).join('');
    el('parallelGrid').innerHTML = state.parallel.map(parallelCard).join('');
    el('visibleCount').textContent = state.regular.length;
    el('parallelCount').textContent = state.parallel.length;
  }

  function setProfileBlock(field, value) {
    const block = document.querySelector(`.profile-block[data-field="${field}"]`);
    const body = block.querySelector('.profile-block__body');
    const text = clean(value);
    block.hidden = !text;
    body.textContent = text;
    return Boolean(text);
  }

  function renderExtras(t) {
    el('profileExtra').innerHTML = (t.extras || []).map(item => {
      const heading = clean(item.heading);
      const description = clean(item.description);
      const body = clean(item.body);
      if (!heading && !description && !body) return '';
      return `<section class="extra-block">
        <div class="extra-block__heading">${heading ? `<strong>${esc(heading)}</strong>` : ''}${description ? `<span>${esc(description)}</span>` : ''}</div>
        <div class="extra-block__body">${esc(body)}</div>
      </section>`;
    }).join('');
  }

  function renderLinks(t) {
    const links = (t.links || []).filter(x => x.label && x.url);
    el('profileLinks').innerHTML = links.length ? `<h3 class="profile-links__title">RELATED LINKS</h3><div class="profile-links__list">${links.map(link => `<a class="profile-link" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>` : '';
  }

  function loadProfile(t) {
    const modal = el('profileModal');
    const isParallel = t.department === 'specials';
    modal.classList.toggle('is-parallel', isParallel);

    el('profileMedia').dataset.initial = initial(t.name);
    el('profileRole').textContent = [t.category, t.position || t.roleEn].filter(Boolean).join(' / ');
    el('profileName').textContent = t.name || '';
    el('profileNameEn').textContent = t.nameEn || '';
    el('profileTagline').textContent = t.tagline || '';
    el('profileHashtags').innerHTML = (t.hashtags || []).filter(Boolean).map(tag => `<span>#${esc(tag)}</span>`).join('');

    const img = el('profileImage');
    if (t.image) {
      img.hidden = false;
      img.src = t.image;
      img.alt = t.name || '';
      img.style.objectPosition = t.profileImagePosition || '50% 50%';
      img.onerror = () => { img.hidden = true; };
    } else {
      img.hidden = true;
      img.removeAttribute('src');
    }

    const hasDefault = [
      setProfileBlock('whyITeach', t.whyITeach),
      setProfileBlock('myChallenge', t.myChallenge),
      setProfileBlock('myFavorite', t.myFavorite),
      setProfileBlock('myMotto', t.myMotto)
    ].some(Boolean);

    renderExtras(t);
    renderLinks(t);
    const hasExtras = (t.extras || []).some(x => clean(x.heading) || clean(x.description) || clean(x.body));
    const hasLinks = (t.links || []).some(x => x.label && x.url);
    el('profileEmpty').hidden = hasDefault || hasExtras || hasLinks;

    el('profilePrev').setAttribute('aria-label', `${state.group[(state.index - 1 + state.group.length) % state.group.length]?.name || ''}へ`);
    el('profileNext').setAttribute('aria-label', `${state.group[(state.index + 1) % state.group.length]?.name || ''}へ`);
  }

  function openProfile(t, trigger, updateHash=true) {
    state.lastTrigger = trigger || document.activeElement;
    state.group = t.department === 'specials' ? state.parallel : state.regular;
    state.index = Math.max(0, state.group.findIndex(x => x.name === t.name));
    loadProfile(t);
    const modal = el('profileModal');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    if (updateHash) history.replaceState(null, '', `#teacher=${encodeURIComponent(t.name)}`);
    modal.querySelector('.profile-modal__close').focus({preventScroll:true});
  }

  function closeProfile(updateHash=true) {
    const modal = el('profileModal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if (updateHash && location.hash.startsWith('#teacher=')) history.replaceState(null, '', location.pathname + location.search);
    if (state.lastTrigger?.focus) state.lastTrigger.focus({preventScroll:true});
  }

  function moveProfile(delta) {
    state.index = (state.index + delta + state.group.length) % state.group.length;
    const t = state.group[state.index];
    loadProfile(t);
    el('profileContent').scrollTop = 0;
    history.replaceState(null, '', `#teacher=${encodeURIComponent(t.name)}`);
  }

  function bindEvents() {
    el('filters').addEventListener('click', event => {
      const button = event.target.closest('.filter');
      if (!button) return;
      document.querySelectorAll('.filter').forEach(x => x.classList.toggle('is-active', x === button));
      const key = button.dataset.filter;
      let count = 0;
      document.querySelectorAll('.teacher-card').forEach(card => {
        const show = key === 'all' || card.dataset.dept === key;
        card.hidden = !show;
        if (show) count++;
      });
      el('visibleCount').textContent = count;
    });

    document.addEventListener('click', event => {
      const trigger = event.target.closest('.profile-trigger');
      if (trigger) {
        const teacher = state.teachers.find(x => x.name === trigger.dataset.name);
        if (teacher) openProfile(teacher, trigger);
        return;
      }
      if (event.target.closest('[data-close]')) closeProfile();
    });

    document.addEventListener('keydown', event => {
      const trigger = event.target.closest?.('.profile-trigger');
      if (trigger && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const teacher = state.teachers.find(x => x.name === trigger.dataset.name);
        if (teacher) openProfile(teacher, trigger);
        return;
      }
      if (!el('profileModal').classList.contains('is-open')) return;
      if (event.key === 'Escape') closeProfile();
      if (event.key === 'ArrowLeft') moveProfile(-1);
      if (event.key === 'ArrowRight') moveProfile(1);
    });

    el('profilePrev').addEventListener('click', () => moveProfile(-1));
    el('profileNext').addEventListener('click', () => moveProfile(1));
  }

  function openFromHash() {
    if (!location.hash.startsWith('#teacher=')) return;
    const name = decodeURIComponent(location.hash.slice('#teacher='.length));
    const teacher = state.teachers.find(x => x.name === name);
    if (teacher) openProfile(teacher, null, false);
  }

  async function init() {
    try {
      const response = await fetch('./data/teachers.json', {cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.teachers = (await response.json()).filter(t => t.active).sort((a,b) => a.sort - b.sort);
      state.regular = state.teachers.filter(t => t.department !== 'specials');
      state.parallel = state.teachers.filter(t => t.department === 'specials');
      renderDirectory();
      bindEvents();
      openFromHash();
    } catch (error) {
      console.error(error);
      el('teacherGrid').innerHTML = `<p>データの読み込みに失敗しました。GitHub Pages上で開いてください。</p>`;
    }
  }

  init();
})();

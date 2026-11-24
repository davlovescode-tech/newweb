/* =====================================================================
   PAGE LOGIC
   Builds every section from js/config.js, runs the animation loop and
   wires up all interactions. You normally don't need to edit this file.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.DANCE, S = window.SITE, TH = window.THEMES, BASE = window.BASE_THEMES;
  var BEAT = D.BEAT;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var wideMQ = matchMedia('(min-width: 901px)');
  var P = S.projects || [];
  var N = P.length;

  /* ---------------- 3D stage ---------------- */
  var stage = null;
  try { stage = D.createStage($('#gl')); } catch (err) { stage = null; if (window.console) console.warn('3D stage unavailable:', err && err.message); }
  if (stage) stage.lost(function () { stage = null; root.classList.add('nogl'); });
  root.classList.toggle('nogl', !stage);
  root.setAttribute('data-gl', stage ? 'on' : 'off');
  BEAT.amp = reduce ? 0 : 0.4;

  /* ---------------- themes ---------------- */
  var userIdx = 0, curTheme = null;
  function theme(k) { return TH[k] || TH.cobalt; }
  function applyTheme(t, instant) {
    if (curTheme === t) return;
    curTheme = t;
    var st = root.style;
    st.setProperty('--bg', t.bg); st.setProperty('--ink', t.ink); st.setProperty('--a1', t.a1); st.setProperty('--a2', t.a2); st.setProperty('--on1', t.on1);
    if (stage) stage.palette(t, instant);
  }

  /* ---------------- content ---------------- */
  var built = P.filter(function (p) { return p.type !== 'soon'; }).length;
  function count(type) { return P.filter(function (p) { return p.type === type; }).length; }
  function fill(str) { return String(str || '').replace('{total}', N).replace('{shipped}', built).replace('{bots}', count('bot')).replace('{games}', count('game')); }

  var SHAPES = [
    [{ x: 10, y: 20, w: 36, ar: 1, br: '28%', rot: -8, c: '#FFFFFF' }, { x: 56, y: 10, w: 26, ar: 1, br: '50%', rot: 0, c: '#12102A' }, { x: 66, y: 52, w: 20, ar: .5, br: '999px', rot: 16, c: 'C3' }],
    [{ x: 56, y: 16, w: 32, ar: 1, br: '50%', rot: 0, c: '#FFFFFF' }, { x: 12, y: 14, w: 24, ar: .8, br: '24%', rot: -12, c: '#12102A' }, { x: 20, y: 56, w: 30, ar: .5, br: '999px', rot: -18, c: 'C3' }],
    [{ x: 14, y: 46, w: 38, ar: 1, br: '24%', rot: 10, c: 'C3' }, { x: 58, y: 12, w: 28, ar: 1, br: '50%', rot: 0, c: '#FFFFFF' }, { x: 68, y: 56, w: 20, ar: .8, br: '22%', rot: -10, c: '#12102A' }]
  ];
  function artHTML(p, i) {
    var th = theme(p.theme);
    return '<div class="art far" style="--c1:' + th.bg + ';--c2:' + th.a1 + '">' + SHAPES[i % 3].map(function (s, k) {
      return '<div class="s" style="--x:' + s.x + '%;--y:' + s.y + '%;--w:' + s.w + ';--ar:' + s.ar + ';--br:' + s.br + ';--rot:' + s.rot + 'deg;--c:' + (s.c === 'C3' ? th.a2 : s.c) + ';--t:' + (5 + ((i + k) % 3)) + 's;--dl:-' + (k * 1.3) + 's"></div>';
    }).join('') + '<small class="mono">' + esc(p.kind) + '</small></div>';
  }
  function imgsHTML(p) {
    var list = [p.image].concat(p.gallery || []).filter(Boolean);
    return list.map(function (u, k) { return '<img class="gal' + (k === 0 ? ' on' : '') + '" data-fb src="' + esc(u) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async">'; }).join('');
  }
  function mediaHTML(p, i) { return artHTML(p, i) + (p.video ? '<video data-src="' + esc(p.video) + '" muted loop playsinline preload="none"></video>' : '') + imgsHTML(p); }

  function frameHTML(p, i) {
    if (p.type === 'soon') return '<div class="frame frame--soon"><div class="frame__media"><span class="soonq">?</span><div class="soon-bar"></div></div><div class="frame__gloss"></div></div>';
    var host = '';
    if (p.type === 'web' && p.links && p.links[0]) { try { host = new URL(p.links[0].href).host; } catch (e) {} }
    var bar = p.type === 'web' ? '<div class="bar"><i></i><i></i><i></i><span>' + esc(host || 'your-site.com') + '</span></div>' : '';
    return '<div class="frame">' + bar + '<div class="frame__media">' + mediaHTML(p, i) + '</div><div class="frame__gloss"></div></div>';
  }

  function build() {
    document.title = S.siteTitle || (S.first + ' ' + S.last + ' Portfolio').replace(/\s+/g, ' ');
    $('#logo').textContent = S.initials;
    $('#cityLab').textContent = S.city;
    $('#bpmLab').textContent = (S.bpm || 118) + ' BPM';
    $('#lede').textContent = S.lede;
    $('#emailT').textContent = S.email;
    $('#workHint').textContent = '(' + pad2(N) + ') ' + (fine ? 'Hover a row' : 'Tap a row');
    $('#foot').textContent = '© ' + new Date().getFullYear() + ' ' + [S.first, S.last].join(' ').trim() + '.';

    /* hero name */
    var lines = [S.first, S.last].filter(Boolean), li = 0;
    $('#name').setAttribute('aria-label', lines.join(' '));
    $('#name').innerHTML = lines.map(function (w, wi) {
      return '<span class="ln" aria-hidden="true">' + w.split('').map(function (ch) {
        var d = (0.25 + (li++) * 0.06).toFixed(2);
        return '<span class="l' + (wi === lines.length - 1 && lines.length > 1 ? ' a1' : '') + '"><i style="--d:' + d + 's">' + esc(ch) + '</i></span>';
      }).join('') + '</span>';
    }).join('');
    $('#mega').innerHTML = '<span class="ln">Let’s make</span><span class="ln">something</span><span class="ln"><em>dance.</em></span>';

    /* marquee */
    function band(words) { return words.map(function (w) { return '<span>' + esc(w) + '</span><i class="sep"></i>'; }).join(''); }
    $('#rowA').innerHTML = band(S.marquee); $('#rowB').innerHTML = band(S.marquee.slice().reverse());

    /* manifesto */
    $('#mani').innerHTML = fill(S.manifesto).split(' ').map(function (w) { return '<span class="word">' + esc(w) + '</span>'; }).join(' ');

    /* stats (all numbers come from the project list) */
    var stats = [[built, 'Projects built'], [count('bot'), 'Bots'], [count('game'), 'Games'], [count('web'), 'Websites'], [count('script'), 'Script collections'], [count('soon'), 'On the way']]
      .filter(function (s) { return s[0] > 0; });
    $('#statsGrid').innerHTML = stats.map(function (s) { return '<div class="stat rv"><b data-n="' + s[0] + '">0</b><span class="mono">' + esc(s[1]) + '</span></div>'; }).join('');

    /* index list */
    $('#list').innerHTML = P.map(function (p, i) {
      return '<li><a class="proj" data-i="' + i + '" data-cursor="view" href="#p-' + esc(p.id) + '">' +
        '<span class="proj__no mono">' + pad2(i + 1) + '</span><span class="proj__t">' + esc(p.title) + '</span>' +
        '<span class="proj__m mono">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><span class="proj__a" aria-hidden="true">↓</span>' +
        '<div class="proj__art">' + (p.type === 'soon' ? '<div class="art far" style="--c1:' + theme(p.theme).bg + ';--c2:' + theme(p.theme).a1 + '"><small class="mono">???</small></div>' : mediaHTML(p, i)) + '</div></a></li>';
    }).join('');
    $('#peek').innerHTML = P.map(function (p, i) { return '<div class="peek__art">' + (p.type === 'soon' ? '<div class="art far" style="--c1:' + theme(p.theme).bg + ';--c2:' + theme(p.theme).a1 + '"><small class="mono">???</small></div>' : mediaHTML(p, i)) + '</div>'; }).join('');

    /* chapters */
    $('#chapters').innerHTML = P.map(function (p, i) {
      var words = p.title.split(' ').map(function (w, k) { return '<span class="w"><i style="--d:' + (k * 0.09).toFixed(2) + 's">' + esc(w) + '</i></span>'; }).join('');
      var links = (p.links || []).filter(function (l) { return l && l.href; }).map(function (l) {
        return '<a class="btn' + (i === 0 ? ' btn--solid' : '') + '" href="' + esc(l.href) + '" target="_blank" rel="noopener" data-magnet data-cursor="link">' + esc(l.label || 'Open') + ' ↗</a>';
      }).join('');
      var cd = p.type === 'soon' ? '<p class="count mono" id="cd">' + (p.releaseAt ? '' : 'Date to be announced') + '</p>' : '';
      return '<section class="chap far' + (i % 2 ? ' flip' : '') + (p.type === 'soon' ? ' soon' : '') + '" id="p-' + esc(p.id) + '" data-i="' + i + '">' +
        '<div class="chap__in"><span class="chap__no" aria-hidden="true">' + pad2(i + 1) + '</span>' +
        '<div class="chap__text"><p class="chap__meta mono"><span>' + pad2(i + 1) + ' / ' + pad2(N) + '</span><b>' + esc(p.kind) + '</b>' + (p.year ? '<span>' + esc(p.year) + '</span>' : '') + (p.status ? '<span class="badge">' + esc(p.status) + '</span>' : '') + '</p>' +
        '<h2 class="chap__title" aria-label="' + esc(p.title) + '">' + words + '</h2>' +
        '<p class="chap__desc">' + esc(p.desc) + '</p>' + cd +
        ((p.tags && p.tags.length) ? '<ul class="chips">' + p.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        (links ? '<div class="chap__cta">' + links + '</div>' : '') + '</div>' +
        '<div class="chap__vis">' + frameHTML(p, i) + '</div></div></section>';
    }).join('');

    /* rail */
    $('#rail').innerHTML = P.map(function (p, i) { return '<a href="#p-' + esc(p.id) + '" data-i="' + i + '" aria-label="' + esc(p.title) + '"><span>' + esc(p.title) + '</span></a>'; }).join('');

    /* horizontal gallery: one card per project type, built from the list */
    var TYPES = [['bot', 'Bots'], ['game', 'Games'], ['script', 'Scripts'], ['web', 'Websites']].filter(function (t) { return count(t[0]) > 0; });
    var cls = ['hcard--ink', 'hcard--a1', 'hcard--line'];
    var miniSets = [
      [['10', '18', 40, 1, '28%', -8, 'var(--a2)'], ['52', '8', 26, 1, '50%', 0, 'var(--bg)'], ['58', '54', 20, .5, '999px', 16, 'var(--a1)']],
      [['52', '14', 34, 1, '50%', 0, 'var(--bg)'], ['12', '12', 24, .8, '24%', -12, 'var(--a2)'], ['18', '56', 30, .5, '999px', -18, 'var(--ink)']],
      [['14', '44', 38, 1, '24%', 10, 'var(--a1)'], ['56', '10', 28, 1, '50%', 0, 'var(--a2)'], ['66', '56', 20, .8, '22%', -10, 'var(--ink)']]
    ];
    var soon = P.filter(function (p) { return p.type === 'soon'; })[0];
    var cards = ['<div class="hcard hcard--intro"><p class="mono">What I build</p><h2 class="hcard__title">What<br>I build</h2><p class="mono">Keep scrolling →</p></div>'];
    TYPES.forEach(function (t, k) {
      var items = P.map(function (p, i) { return [p, i]; }).filter(function (x) { return x[0].type === t[0]; });
      cards.push('<div class="hcard ' + cls[k % 3] + '"><div class="mini" aria-hidden="true">' + miniSets[k % 3].map(function (s, q) {
        return '<div class="s" style="--x:' + s[0] + '%;--y:' + s[1] + '%;--w:' + s[2] + ';--ar:' + s[3] + ';--br:' + s[4] + ';--rot:' + s[5] + 'deg;--c:' + s[6] + ';--t:' + (5 + q) + 's;--dl:-' + (q * 1.2) + 's"></div>';
      }).join('') + '</div><div class="hcard__top mono"><span>' + esc(t[1]) + '</span><span>' + pad2(items.length) + '</span></div>' +
        '<div><h3 class="hcard__title">' + esc(t[1]) + '</h3></div><div class="hcard__list">' +
        items.map(function (x) { return '<a href="#p-' + esc(x[0].id) + '" data-cursor="link"><span>' + esc(x[0].title) + '</span><span>↗</span></a>'; }).join('') + '</div></div>');
    });
    if (soon) cards.push('<a class="hcard hcard--a1" href="#p-' + esc(soon.id) + '" data-cursor="link" style="text-decoration:none"><div class="hcard__top mono"><span>One more thing</span><span>' + pad2(N) + '</span></div><h3 class="hcard__title">Coming<br>soon</h3><p class="mono">See what is next →</p></a>');
    $('#hzTrack').innerHTML = cards.join('');

    /* timeline */
    $('#tl').insertAdjacentHTML('beforeend', P.map(function (p, i) {
      return '<li class="rv"><span class="tl__when mono">Project ' + pad2(i + 1) + (p.year ? ' · ' + esc(p.year) : '') + '</span><div><h3><a href="#p-' + esc(p.id) + '" data-cursor="link">' + esc(p.title) + '</a></h3><p>' + esc(p.short || p.desc) + '</p></div></li>';
    }).join(''));

    /* about + contact */
    $('#aboutBig').innerHTML = String(S.about || '').split(' ').map(function (w) { return '<span class="word">' + esc(w) + '</span>'; }).join(' ');
    $('#tools').innerHTML = (S.toolbox || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    $('#now').innerHTML = (S.now || []).map(function (e) { return '<li><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></li>'; }).join('');
    var socials = (S.socials || []).filter(function (s) { return s && s[1]; });
    $('#links').innerHTML = socials.map(function (s) { return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener" data-cursor="link">' + esc(s[0]) + '<span>↗</span></a></li>'; }).join('');
    $('#socials').innerHTML = socials.map(function (s) { return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener" data-magnet data-cursor="link">' + esc(s[0]) + '</a></li>'; }).join('');
  }
  build();

  /* images that fail to load disappear, leaving the built-in artwork underneath */
  function ensureOn(media) {
    var imgs = $$('img.gal', media);
    if (imgs.length && !imgs.some(function (i) { return i.classList.contains('on'); })) imgs[0].classList.add('on');
  }
  $$('img[data-fb]').forEach(function (img) {
    img.addEventListener('error', function () { var m = img.parentNode; img.remove(); if (m) ensureOn(m); });
  });
  $$('video[data-src]').forEach(function (v) { v.addEventListener('error', function () { v.remove(); }); });
  setInterval(function () {
    $$('.frame__media').forEach(function (m) {
      var imgs = $$('img.gal', m); if (imgs.length < 2) return;
      var k = imgs.findIndex(function (i) { return i.classList.contains('on'); });
      imgs.forEach(function (i, q) { i.classList.toggle('on', q === (k + 1) % imgs.length); });
    });
  }, 3400);

  /* ---------------- element handles ---------------- */
  var homeEl = $('#home'), maniEl = $('#manifesto'), statsEl = $('#stats'), workEl = $('#work'), hzEl = $('#gallery'), tlEl = $('#tl'), tlSec = $('#timeline'), aboutEl = $('#about'), contactEl = $('#contact');
  var chaps = $$('.chap').map(function (el, i) {
    return { el: el, i: i, near: false, e: 0, p: 0, rx: 0, ry: 0, vid: $('video[data-src]', el), frame: $('.frame', el), title: $('.chap__title', el), text: $('.chap__text', el) };
  });
  var maniWords = $$('.word', $('#mani')), aboutWords = $$('.word', $('#aboutBig'));
  var hzTrack = $('#hzTrack'), hzMax = 0;
  var tlItems = $$('li', tlEl), tlFill = $('#tlFill');
  var progEl = $('#prog'), flashEl = $('#flash'), railEl = $('#rail'), railLinks = $$('#rail a'), chapLab = $('#chapLab'), hudSq = $$('#hud i');

  /* the 3D stage needs to know where each section starts, and which arrangement it wants */
  var stageEls = [[homeEl, 'home', 0], [maniEl, 'manifesto', 0], [statsEl, 'stats', 0], [workEl, 'work', 1]]
    .concat(chaps.map(function (c) { return [c.el, c.i % 2 ? 'chapB' : 'chapA', 1]; }))
    .concat([[hzEl, 'stats', 1], [tlSec, 'stats', 1], [aboutEl, 'about', 2], [contactEl, 'contact', 3]]);
  function measure() {
    if (!stage) return;
    stage.setSections(stageEls.map(function (e) { return { top: e[0].getBoundingClientRect().top + window.scrollY, key: e[1] }; }));
  }

  /* ---------------- fitting giant type ---------------- */
  function fitLines(el, maxFrac) {
    var lines = $$('.ln', el); if (!lines.length) return;
    el.style.fontSize = '100px';
    var w = 0; lines.forEach(function (l) { w = Math.max(w, l.scrollWidth); });
    var fs = 100 * el.parentElement.clientWidth / Math.max(1, w) * 0.985;
    if (maxFrac) fs = Math.min(fs, innerHeight * maxFrac);
    el.style.fontSize = Math.max(28, fs) + 'px';
  }
  function fitTitle(t) {
    var el = t.title; el.style.fontSize = '100px';
    var w = 0; $$('.w', el).forEach(function (x) { w = Math.max(w, x.scrollWidth); });
    var avail = el.parentElement.clientWidth, cap = wideMQ.matches ? Math.min(88, innerHeight * 0.13) : 52;
    el.style.fontSize = clamp(100 * avail / Math.max(1, w) * 0.98, 24, cap) + 'px';
  }
  var bands = [{ row: $('#rowA'), x: 0, dir: -1, sp: 70, w: 0 }, { row: $('#rowB'), x: 0, dir: 1, sp: 55, w: 0 }];
  function fillBands() {
    bands.forEach(function (b) {
      var base = b.row.dataset.base || (b.row.dataset.base = b.row.innerHTML); b.row.innerHTML = base;
      var w = b.row.scrollWidth || 1, need = Math.ceil(innerWidth * 1.4 / w) + 1;
      b.row.innerHTML = new Array(need + 1).join(base); b.w = b.row.scrollWidth / need; b.x = b.dir < 0 ? 0 : -b.w;
    });
  }
  function layout() {
    fitLines($('#name'), innerWidth < 700 ? 0.2 : 0.27); fitLines($('#mega'), 0.2);
    chaps.forEach(fitTitle);
    fillBands();
    hzMax = Math.max(0, hzTrack.scrollWidth - innerWidth);
    hzEl.style.height = (hzMax + innerHeight) + 'px';
    movePill(); measure();
  }

  /* ---------------- scramble, clock, toast ---------------- */
  function scramble(el, text) {
    var chars = '!<>-_/[]{}=+*^?#', from = el.textContent, n = Math.max(from.length, text.length), q = [], i, fr = 0;
    for (i = 0; i < n; i++) q.push({ f: from[i] || '', t: text[i] || '', s: Math.floor(Math.random() * 10), e: 10 + Math.floor(Math.random() * 14), c: '' });
    (function run() {
      var out = '', done = 0;
      q.forEach(function (o) {
        if (fr >= o.e) { done++; out += o.t; }
        else if (fr >= o.s) { if (!o.c || Math.random() < 0.3) o.c = chars[Math.floor(Math.random() * chars.length)]; out += o.c; }
        else out += o.f;
      });
      el.textContent = out; if (done < q.length) { fr++; setTimeout(run, 28); }
    })();
  }
  var roleI = 0, roleEl = $('#role'); roleEl.textContent = (S.roles || [''])[0];
  if ((S.roles || []).length > 1) setInterval(function () { roleI = (roleI + 1) % S.roles.length; scramble(roleEl, S.roles[roleI]); }, 2800);
  function clock() {
    var s; try { s = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: S.tz }).format(new Date()); } catch (e) { s = new Date().toLocaleTimeString('en-GB'); }
    $('#clock').textContent = s + ' local';
  }
  clock(); setInterval(clock, 1000);
  var toastT; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200); }

  /* countdown for the "coming soon" chapter (only if releaseAt is set) */
  var soonP = P.filter(function (p) { return p.type === 'soon' && p.releaseAt; })[0], cdEl = $('#cd');
  if (soonP && cdEl) {
    var tgt = Date.parse(soonP.releaseAt);
    if (!isNaN(tgt)) (function tickCd() {
      var d = tgt - Date.now();
      if (d <= 0) cdEl.textContent = 'Out now'; else {
        var s = Math.floor(d / 1000);
        cdEl.textContent = Math.floor(s / 86400) + 'd ' + pad2(Math.floor(s % 86400 / 3600)) + 'h ' + pad2(Math.floor(s % 3600 / 60)) + 'm ' + pad2(s % 60) + 's';
        setTimeout(tickCd, 1000);
      }
    })();
  }

  /* ---------------- colour + chapter theme ---------------- */
  var chapIdx = -2;
  function setChapter(idx) {
    if (idx === chapIdx) return;
    chapIdx = idx;
    applyTheme(idx >= 0 ? theme(P[idx].theme) : theme(BASE[userIdx]));
    if (stage) stage.kickAll(1.2);
    railEl.classList.toggle('on', idx >= 0);
    railLinks.forEach(function (a, k) { a.classList.toggle('on', k === idx); });
    chapLab.textContent = idx >= 0 ? 'Chapter ' + pad2(idx + 1) + '/' + pad2(N) : '';
    if (idx >= 0) D.audio.sfx('whoosh');
  }
  function cycleColor() {
    userIdx = (userIdx + 1) % BASE.length;
    var t = theme(BASE[userIdx]);
    applyTheme(t); $('#cwName').textContent = t.name;
    if (stage) stage.kickAll(1.4);
    toast(t.name);
    D.audio.sfx('click');
  }
  $('#cwBtn').addEventListener('click', cycleColor);

  /* ---------------- sound ---------------- */
  function soundUI(on) {
    BEAT.amp = reduce ? 0 : (on ? 1 : 0.4);
    root.classList.toggle('snd-on', on);
    $('#sndBtn').setAttribute('aria-pressed', on ? 'true' : 'false');
    $('#sndTxt').textContent = on ? 'Sound on' : 'Sound off';
    $('#playTxt').textContent = on ? 'Pause the beat' : 'Play the beat';
  }
  function setSound(on) {
    if (!on) { D.audio.stop(); soundUI(false); return; }
    $('#sndTxt').textContent = 'Loading…';
    D.audio.start().then(function (ok) {
      if (!ok) { soundUI(false); if (!D.audio.ctx) toast('Audio is not supported here'); return; }
      soundUI(true); toast(D.audio.mode === 'track' ? 'Playing your track' : 'Turn it up');
    });
  }
  $('#sndBtn').addEventListener('click', function () { setSound(!D.audio.on); });
  $('#playBtn').addEventListener('click', function () { setSound(!D.audio.on); });
  window.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'c' || e.key === 'C') cycleColor();
    if (e.key === 's' || e.key === 'S') setSound(!D.audio.on);
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) D.audio.suspend(); else D.audio.resume(); });
  D.onBeat = function (s) {
    var q = (s >> 2) & 3; hudSq.forEach(function (e, i) { e.classList.toggle('on', i === q); });
    if (stage && BEAT.amp > 0.9 && (s & 15) === 0) stage.kickAll(0.9);
  };
  document.addEventListener('pointerdown', function (e) { if (e.target.closest && e.target.closest('a,button')) D.audio.sfx('click'); });
  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest ? e.target.closest('.dock a,.rail a,.proj,.hcard__list a') : null;
    if (t && t !== document._lastHov) { document._lastHov = t; D.audio.sfx('hover', t.dataset.i ? +t.dataset.i : 0); }
  });

  /* ---------------- copy email ---------------- */
  var cbtn = $('#copyBtn'), cs = $('#copyS'), cT;
  function burst() {
    var t = curTheme || theme('cobalt'), cols = [t.a1, t.a2, t.ink, t.on1];
    for (var i = 0; i < 22; i++) {
      var d = document.createElement('i'), a = Math.random() * 6.283, r = 90 + Math.random() * 150;
      d.className = 'pf'; d.style.setProperty('--dx', Math.cos(a) * r + 'px'); d.style.setProperty('--dy', Math.sin(a) * r + 'px');
      d.style.setProperty('--dr', (Math.random() * 720 - 360) + 'deg'); d.style.setProperty('--pc', cols[i % cols.length]);
      cbtn.appendChild(d); (function (n) { setTimeout(function () { n.remove(); }, 950); })(d);
    }
  }
  function copied() {
    try { getSelection().removeAllRanges(); } catch (e) {}
    cs.textContent = 'Copied'; toast('Email copied'); D.audio.sfx('copy');
    if (!reduce) burst(); if (stage) stage.kickAll(1.6);
    clearTimeout(cT); cT = setTimeout(function () { cs.textContent = 'Copy'; }, 2200);
  }
  cbtn.addEventListener('click', function () {
    var p = (navigator.clipboard && navigator.clipboard.writeText) ? navigator.clipboard.writeText(S.email) : Promise.reject();
    p.then(copied).catch(function () {
      try { var r = document.createRange(); r.selectNodeContents($('#emailT')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      if (ok) copied(); else toast('Press and hold to copy');
    });
  });

  /* ---------------- project index: hover preview ---------------- */
  var list = $('#list'), peek = $('#peek'), layers = $$('.peek__art', peek), zc = 1, PK = { x: 0, y: 0, r: 0 };
  if (fine) {
    $$('.proj').forEach(function (a) {
      a.addEventListener('pointerenter', function () {
        var i = +a.dataset.i; list.classList.add('hov');
        $$('.proj').forEach(function (x) { x.classList.toggle('act', x === a); });
        peek.classList.add('on'); layers.forEach(function (l, k) { l.classList.toggle('on', k === i); if (k === i) l.style.zIndex = ++zc; });
      });
    });
    list.addEventListener('pointerleave', function () {
      list.classList.remove('hov'); $$('.proj').forEach(function (x) { x.classList.remove('act'); });
      peek.classList.remove('on'); layers.forEach(function (l) { l.classList.remove('on'); });
    });
  }

  /* ---------------- pointer, magnets, cursor ---------------- */
  var PT = { x: -999, y: -999, px: 0, py: 0, vx: 0, vy: 0, on: false, moved: false }, cursorMode = '', cursorOn = false, cx = -100, cy = -100, cur = $('#cur');
  window.addEventListener('pointermove', function (e) {
    PT.x = e.clientX; PT.y = e.clientY; PT.on = true; PT.moved = true;
    var t = e.target && e.target.closest ? e.target.closest('[data-cursor]') : null; cursorMode = t ? t.getAttribute('data-cursor') : '';
  }, { passive: true });
  document.addEventListener('pointerleave', function () { PT.on = false; cursorOn = false; });
  window.addEventListener('pointerdown', function (e) {
    if (stage && !(e.target.closest && e.target.closest('a,button,.proj'))) stage.poke(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1), 1.1);
  }, { passive: true });
  var mags = [];
  function collectMagnets() { mags = $$('[data-magnet]').map(function (el) { return { el: el, x: 0, y: 0, tx: 0, ty: 0 }; }); }
  collectMagnets();

  /* ---------------- dock ---------------- */
  var dockLinks = $$('#dockIn a'), dockPill = $('#dockPill'), dockAct = -1;
  function movePill() { var a = dockLinks[Math.max(0, dockAct)]; if (!a) return; dockPill.style.width = a.offsetWidth + 'px'; dockPill.style.transform = 'translateX(' + a.offsetLeft + 'px)'; }
  function setDock(i) { if (i === dockAct) return; dockAct = i; dockLinks.forEach(function (a, k) { a.classList.toggle('on', k === i); }); movePill(); }

  /* ---------------- reveal-on-scroll (only for things that start below the fold) ---------------- */
  var rvEls = $$('.rv');
  rvEls.forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight * 0.95) el.classList.add('pre'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    rvEls.forEach(function (el) { if (el.classList.contains('pre')) io.observe(el); });
    /* count-up numbers */
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var n = +e.target.dataset.n, t0 = performance.now();
        (function step(now) { var k = clamp((now - t0) / 1400, 0, 1), v = 1 - Math.pow(1 - k, 3); e.target.textContent = Math.round(n * v); if (k < 1) requestAnimationFrame(step); })(t0);
      });
    }, { threshold: 0.4 });
    $$('.stat b').forEach(function (b) { cio.observe(b); });
  } else { rvEls.forEach(function (el) { el.classList.remove('pre'); }); $$('.stat b').forEach(function (b) { b.textContent = b.dataset.n; }); }

  /* ---------------- main loop ---------------- */
  var letters = $$('#name .l'), lState = letters.map(function () { return { lift: 0, dy: 0 }; });
  var last = performance.now(), sLast = window.scrollY, svel = 0, wordsLit = -1, aWordsLit = -1;
  function mediaState(c) {
    if (!c.vid) return;
    if (c.near) { if (!c.vid.src) c.vid.src = c.vid.dataset.src; var pr = c.vid.play(); if (pr && pr.catch) pr.catch(function () {}); } else c.vid.pause();
  }
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    D.audio.tick(now);
    var amp = BEAT.amp;
    BEAT.kick *= Math.exp(-dt * 7); BEAT.snare *= Math.exp(-dt * 7); BEAT.hat *= Math.exp(-dt * 12);

    var sy = window.scrollY, vh = innerHeight, vw = innerWidth;
    var v = (sy - sLast) / Math.max(dt, 0.001); sLast = sy; svel += (v - svel) * Math.min(1, dt * 7);

    /* pointer */
    var nx = PT.x / vw * 2 - 1, ny = -(PT.y / vh * 2 - 1);
    if (PT.moved) { PT.vx = (nx - PT.px) / Math.max(dt, 0.001) * 0.12; PT.vy = (ny - PT.py) / Math.max(dt, 0.001) * 0.12; PT.px = nx; PT.py = ny; PT.moved = false; }
    else { PT.vx *= 0.85; PT.vy *= 0.85; }
    if (stage) {
      var sp = stage.pointer; sp.x = nx; sp.y = ny; sp.vx = clamp(PT.vx, -6, 6); sp.vy = clamp(PT.vy, -6, 6); sp.on = !!(PT.on && fine);
      stage.tick(dt); stage.frame(dt, sy, svel, amp, BEAT);
    }

    /* beat-driven css */
    var k = BEAT.kick * amp;
    flashEl.style.opacity = (D.audio.on ? k * 0.06 : 0).toFixed(3);
    var kk = k.toFixed(3); $('#logo').style.setProperty('--k', kk); $('.mega').style.setProperty('--k', kk);

    /* scroll progress */
    var docH = root.scrollHeight - vh; progEl.style.transform = 'scaleX(' + (docH > 0 ? clamp(sy / docH, 0, 1) : 0).toFixed(4) + ')';

    /* hero letters hop on the beat and lift near the pointer */
    if (!reduce && sy < vh * 1.2) {
      var age = performance.now() / 1000 - BEAT.kickAt, rects = letters.map(function (l) { return l.getBoundingClientRect(); }), fsz = parseFloat($('#name').style.fontSize) || 100;
      letters.forEach(function (l, i) {
        var a = Math.max(0, age - i * 0.022), hop = (age >= i * 0.022 ? Math.exp(-a * 9) : 0) * amp;
        var r = rects[i], lx = r.left + r.width / 2, ly = r.top + r.height / 2 - lState[i].dy;
        var dd = Math.hypot(PT.x - lx, PT.y - ly), near = PT.on && fine ? clamp(1 - dd / (fsz * 1.1), 0, 1) : 0;
        lState[i].lift += (near - lState[i].lift) * Math.min(1, dt * 10);
        var dy = -(hop * fsz * 0.1 + lState[i].lift * fsz * 0.16), rot = (i % 2 ? 1 : -1) * (hop * 4 + lState[i].lift * 7);
        lState[i].dy = dy;
        l.style.transform = 'translate3d(0,' + dy.toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + (1 + lState[i].lift * 0.06).toFixed(3) + ')';
      });
      var par = fine ? PT.px * -14 : 0; $$('#name .ln').forEach(function (ln, i) { ln.style.translate = (par * (i ? -1 : 1)).toFixed(1) + 'px 0'; });
    }

    /* marquee bands (faster while you scroll fast) */
    bands.forEach(function (b) {
      if (!b.w) return;
      b.x += b.dir * (b.sp + Math.abs(svel) * 0.35) * dt * (reduce ? 0 : 1) * (1 + BEAT.kick * amp * 0.15);
      if (b.dir < 0 && b.x <= -b.w) b.x += b.w; if (b.dir > 0 && b.x >= 0) b.x -= b.w;
      b.row.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,0,0)';
    });

    /* manifesto words */
    var mr = maniEl.getBoundingClientRect();
    if (mr.bottom > -vh && mr.top < vh * 2) {
      var mp = clamp(-mr.top / Math.max(1, mr.height - vh), 0, 1), nW = Math.round(clamp(mp * 1.2, 0, 1) * maniWords.length);
      if (nW !== wordsLit) { wordsLit = nW; maniWords.forEach(function (w, i) { w.classList.toggle('lit', i < nW); }); }
    }

    /* chapters */
    var sticky = wideMQ.matches, act = -1;
    chaps.forEach(function (c) {
      var r = c.el.getBoundingClientRect(), near = r.bottom > -vh * 0.25 && r.top < vh * 1.25;
      if (near !== c.near) { c.near = near; c.el.classList.toggle('far', !near); $$('.art', c.el).forEach(function (a) { a.classList.toggle('far', !near); }); mediaState(c); }
      if (!near) return;
      var e, p;
      if (sticky) { e = clamp(1 - r.top / (vh * 0.9), 0, 1); p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1); }
      else { e = clamp((vh * 0.95 - r.top) / (vh * 0.55), 0, 1); p = clamp((vh - r.top) / (r.height + vh), 0, 1); }
      c.el.style.setProperty('--e', reduce ? '1' : e.toFixed(3)); c.el.style.setProperty('--p', p.toFixed(3));
      c.el.classList.toggle('is-in', e > 0.5);
      if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) act = c.i;
      /* tilt + glare follow the pointer */
      if (c.frame && fine && !reduce) {
        var fr = c.frame.getBoundingClientRect(), tx = 0, ty = 0, gx = 30, gy = 20;
        if (PT.on && PT.x > fr.left - 60 && PT.x < fr.right + 60 && PT.y > fr.top - 60 && PT.y < fr.bottom + 60) {
          var ux = clamp((PT.x - (fr.left + fr.width / 2)) / (fr.width / 2), -1, 1), uy = clamp((PT.y - (fr.top + fr.height / 2)) / (fr.height / 2), -1, 1);
          tx = uy * -6; ty = ux * 8; gx = (ux * 0.5 + 0.5) * 100; gy = (uy * 0.5 + 0.5) * 100;
        }
        c.rx += (tx - c.rx) * Math.min(1, dt * 8); c.ry += (ty - c.ry) * Math.min(1, dt * 8);
        c.frame.style.setProperty('--rx', c.rx.toFixed(2) + 'deg'); c.frame.style.setProperty('--ry', c.ry.toFixed(2) + 'deg');
        c.frame.style.setProperty('--gx', gx.toFixed(0) + '%'); c.frame.style.setProperty('--gy', gy.toFixed(0) + '%');
      }
    });
    setChapter(act);

    /* horizontal gallery */
    var hr = hzEl.getBoundingClientRect();
    if (hr.bottom > -vh && hr.top < vh * 2) {
      var hp = clamp(-hr.top / Math.max(1, hr.height - vh), 0, 1);
      hzTrack.style.transform = 'translate3d(' + (-hp * hzMax).toFixed(1) + 'px,0,0)';
    }

    /* timeline */
    var tr = tlEl.getBoundingClientRect();
    if (tr.bottom > -vh && tr.top < vh * 1.5) {
      tlFill.style.setProperty('--tp', clamp((vh * 0.62 - tr.top) / Math.max(1, tr.height), 0, 1).toFixed(3));
      tlItems.forEach(function (li) { li.classList.toggle('lit', li.getBoundingClientRect().top < vh * 0.62); });
    }

    /* about words */
    var ar = $('#aboutBig').getBoundingClientRect();
    if (ar.bottom > -vh && ar.top < vh * 1.5) {
      var an = Math.round(clamp((vh * 0.8 - ar.top) / (ar.height + vh * 0.15), 0, 1) * aboutWords.length);
      if (an !== aWordsLit) { aWordsLit = an; aboutWords.forEach(function (w, i) { w.classList.toggle('lit', i < an); }); }
    }

    /* project preview follows the cursor */
    if (fine && peek.classList.contains('on')) {
      PK.x += (PT.x - PK.x) * Math.min(1, dt * 10); PK.y += (PT.y - PK.y) * Math.min(1, dt * 10);
      PK.r += (clamp((PT.x - PK.x) * 0.07, -16, 16) - PK.r) * Math.min(1, dt * 10);
      peek.style.transform = 'translate3d(' + (PK.x - peek.offsetWidth / 2).toFixed(1) + 'px,' + (PK.y - peek.offsetHeight / 2).toFixed(1) + 'px,0) rotate(' + PK.r.toFixed(2) + 'deg)';
    } else { PK.x = PT.x; PK.y = PT.y; }

    /* cursor */
    if (fine) {
      if (PT.on && !cursorOn) { cursorOn = true; cx = PT.x; cy = PT.y; cur.classList.add('on'); }
      if (!PT.on && cursorOn) { cursorOn = false; cur.classList.remove('on'); }
      cx += (PT.x - cx) * Math.min(1, dt * 18); cy += (PT.y - cy) * Math.min(1, dt * 18);
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      var m = cursorMode === 'view' ? 'view' : cursorMode ? 'link' : '';
      if (cur.dataset.m !== m) { cur.dataset.m = m; $('span', cur).textContent = m === 'view' ? 'View' : ''; }
    }

    /* magnets */
    mags.forEach(function (m) {
      var r = m.el.getBoundingClientRect(), cxm = r.left + r.width / 2 - m.x, cym = r.top + r.height / 2 - m.y;
      var dx = PT.x - cxm, dy = PT.y - cym, hw = r.width / 2 + 36, hh = r.height / 2 + 36;
      /* only pull while the pointer is on or right next to the element, and never by more than a few px, so wide pills can't slide off screen */
      if (fine && PT.on && Math.abs(dx) < hw && Math.abs(dy) < hh) { m.tx = Math.max(-1, Math.min(1, dx / hw)) * 14; m.ty = Math.max(-1, Math.min(1, dy / hh)) * 10; } else { m.tx = 0; m.ty = 0; }
      m.x += (m.tx - m.x) * Math.min(1, dt * 12); m.y += (m.ty - m.y) * Math.min(1, dt * 12);
      if (Math.abs(m.x) + Math.abs(m.y) > 0.05 || Math.abs(m.tx) + Math.abs(m.ty) > 0) m.el.style.translate = m.x.toFixed(1) + 'px ' + m.y.toFixed(1) + 'px'; else m.el.style.translate = '';
    });

    /* dock follows where you are */
    var mid = sy + vh * 0.45, di = 0;
    for (var q = 0; q < stageEls.length; q++) { if (stageEls[q][0].getBoundingClientRect().top + sy <= mid) di = stageEls[q][2]; }
    setDock(di);

    requestAnimationFrame(loop);
  }

  /* ---------------- boot ---------------- */
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('load', function () { layout(); setTimeout(layout, 500); });
  layout();
  if (reduce) { maniWords.concat(aboutWords).forEach(function (w) { w.classList.add('lit'); }); $('#mani').classList.add('nojs-lit'); $('#aboutBig').classList.add('nojs-lit'); }
  applyTheme(theme(BASE[0]), true);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('loaded'); if (stage) stage.start(); setTimeout(function () { dockPill.classList.add('rdy'); }, 60); });
  });
  requestAnimationFrame(loop);
})();

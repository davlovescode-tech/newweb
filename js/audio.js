/* =====================================================================
   AUDIO
   - Built-in disco loop (synthesised in the browser, no files needed)
   - OR your own track from assets/audio/track.mp3 (beats detected live)
   - Small UI sound effects (built-in blips, or your own files)
   - Drives window.DANCE.BEAT, which the visuals read every frame
   ===================================================================== */
(function () {
  'use strict';
  var D = window.DANCE = window.DANCE || {};
  var CFG = window.SITE || {};
  var AC = CFG.audio || {};
  var bpm = CFG.bpm || 118;

  var BEAT = D.BEAT = { kick: 0, snare: 0, hat: 0, kickAt: -9, amp: 0.4, step: 0 };
  var A = D.audio = { on: false, ctx: null, mode: 'synth', loading: false };

  var ROOTS = [55, 43.65, 65.41, 49];
  var CHORDS = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]];
  var S = {
    master: null, delay: null, noise: null, timer: null, nextT: 0, step: 0, events: [],
    vNext: 0, vStep: 0, trackTried: false, trackBuf: null, trackSrc: null, trackGain: null,
    analyser: null, fd: null, avg: { b: 0, m: 0, h: 0 }, lastKick: 0, lastSnare: 0, lastHat: 0,
    trackStep: 0, sfx: {}
  };

  function vol() { return Math.min(1, Math.max(0, AC.volume == null ? 0.7 : AC.volume)) * 0.85; }

  /* ---------- beat state (shared with the visuals) ---------- */
  function onStep(s) {
    BEAT.step = s;
    var si = s & 15;
    if (si % 4 === 0) { BEAT.kick = 1; BEAT.kickAt = performance.now() / 1000; }
    if (si === 4 || si === 12) BEAT.snare = 1;
    if (si % 4 === 2) BEAT.hat = 1;
    if (D.onBeat) D.onBeat(s);
  }

  /* ---------- graph ---------- */
  function init() {
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    var c = A.ctx = new Ctor();
    var comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 5;
    S.master = c.createGain(); S.master.gain.value = 0; S.master.connect(comp); comp.connect(c.destination);
    S.delay = c.createDelay(1); S.delay.delayTime.value = 60 / bpm * 0.75;
    var fb = c.createGain(); fb.gain.value = 0.36;
    var dl = c.createGain(); dl.gain.value = 0.3;
    S.delay.connect(fb); fb.connect(S.delay); S.delay.connect(dl); dl.connect(S.master);
    var len = c.sampleRate, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    S.noise = buf;
    S.trackGain = c.createGain(); S.trackGain.connect(S.master);
    S.analyser = c.createAnalyser(); S.analyser.fftSize = 512; S.analyser.smoothingTimeConstant = 0.15;
    S.trackGain.connect(S.analyser);
    S.fd = new Uint8Array(S.analyser.frequencyBinCount);
    return true;
  }

  function env(g, t, a, peak, dec) {
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
  }
  function osc(type, f, t, dur, peak, a, dest, filt, send) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f;
    if (filt) {
      var fl = c.createBiquadFilter(); fl.type = 'lowpass';
      fl.frequency.setValueAtTime(filt[0], t); fl.frequency.exponentialRampToValueAtTime(filt[1], t + dur);
      o.connect(fl); fl.connect(g);
    } else o.connect(g);
    env(g, t, a, peak, dur); g.connect(dest);
    if (send) { var sg = c.createGain(); sg.gain.value = send; g.connect(sg); sg.connect(S.delay); }
    o.start(t); o.stop(t + dur + a + 0.05);
  }
  function noiseHit(t, dur, peak, type, freq, dest) {
    var c = A.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = S.noise; f.type = type; f.frequency.value = freq;
    s.connect(f); f.connect(g); g.connect(dest); env(g, t, 0.002, peak, dur);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  /* ---------- built-in loop ---------- */
  function playStep(s, t) {
    var c = A.ctx, bar = (s >> 4) & 3, si = s & 15, m = S.master;
    if (si % 4 === 0) {
      var o = c.createOscillator(), g = c.createGain();
      o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
      o.connect(g); g.connect(m); env(g, t, 0.002, 0.95, 0.26); o.start(t); o.stop(t + 0.3);
    }
    if (si === 4 || si === 12) { noiseHit(t, 0.14, 0.34, 'bandpass', 1900, m); osc('triangle', 190, t, 0.1, 0.2, 0.001, m); }
    if (si % 4 === 2) noiseHit(t, 0.07, 0.15, 'highpass', 7500, m);
    else if (si % 2 === 1) noiseHit(t, 0.03, 0.05, 'highpass', 9000, m);
    var low = ROOTS[bar], f = (si % 2 === 0) ? low : low * 2;
    osc('sawtooth', f, t, 0.13, si % 4 === 0 ? 0.22 : 0.3, 0.004, m, [900, 260]);
    if (si % 2 === 0) {
      var ch = CHORDS[bar], pat = [0, 1, 2, 3, 2, 1, 2, 1][(si >> 1) & 7], nf = (pat === 3 ? ch[0] * 2 : ch[pat]) * 2;
      osc('sawtooth', nf, t, 0.2, 0.12, 0.003, m, [3600, 700], 0.55);
      osc('square', nf * 1.004, t, 0.2, 0.04, 0.003, m, [2800, 600], 0.4);
    }
    if (si === 0) {
      CHORDS[bar].forEach(function (f0) {
        [-6, 6].forEach(function (dt) {
          var oo = c.createOscillator(), gg = c.createGain(), fl = c.createBiquadFilter();
          oo.type = 'sawtooth'; oo.frequency.value = f0; oo.detune.value = dt; fl.type = 'lowpass'; fl.frequency.value = 1100;
          oo.connect(fl); fl.connect(gg); gg.connect(m);
          gg.gain.setValueAtTime(0, t); gg.gain.linearRampToValueAtTime(0.035, t + 0.35);
          gg.gain.linearRampToValueAtTime(0.0001, t + 4 * 60 / bpm * 0.98);
          oo.start(t); oo.stop(t + 4 * 60 / bpm);
        });
      });
    }
  }
  function sched() {
    var c = A.ctx, sd = 60 / bpm / 4;
    while (S.nextT < c.currentTime + 0.16) {
      playStep(S.step, S.nextT); S.events.push({ t: S.nextT, s: S.step });
      S.step = (S.step + 1) % 64; S.nextT += sd;
    }
  }
  function startSynth() {
    S.step = 0; S.events.length = 0; S.nextT = A.ctx.currentTime + 0.1;
    sched(); clearInterval(S.timer); S.timer = setInterval(sched, 30);
  }
  function stopSynth() { clearInterval(S.timer); S.events.length = 0; }

  /* ---------- your own track ---------- */
  function loadTrack(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); })
      .then(function (b) { return new Promise(function (res, rej) { A.ctx.decodeAudioData(b, res, rej); }); });
  }
  function startTrack() {
    stopTrack();
    var src = A.ctx.createBufferSource(); src.buffer = S.trackBuf; src.loop = true;
    src.connect(S.trackGain); src.start(0); S.trackSrc = src;
    S.avg = { b: 0, m: 0, h: 0 }; S.lastKick = performance.now();
  }
  function stopTrack() { if (S.trackSrc) { try { S.trackSrc.stop(); } catch (e) {} S.trackSrc = null; } }
  function bins(a, b) { var s = 0; for (var i = a; i <= b; i++) s += S.fd[i]; return s / (b - a + 1); }

  /* ---------- public API ---------- */
  A.start = function () {
    if (!S.master && !init()) return Promise.resolve(false);
    A.ctx.resume(); A.on = true;
    var p = Promise.resolve();
    if (AC.track && !S.trackTried) {
      S.trackTried = true; A.loading = true;
      p = loadTrack(AC.track).then(function (b) { S.trackBuf = b; }, function () { S.trackBuf = null; })
        .then(function () { A.loading = false; });
    }
    return p.then(function () {
      if (!A.on) return false;
      var c = A.ctx, t = c.currentTime;
      S.master.gain.cancelScheduledValues(t); S.master.gain.setValueAtTime(S.master.gain.value, t);
      S.master.gain.linearRampToValueAtTime(vol(), t + 0.25);
      if (S.trackBuf) { A.mode = 'track'; startTrack(); } else { A.mode = 'synth'; startSynth(); }
      return true;
    });
  };
  A.stop = function () {
    A.on = false; stopSynth(); stopTrack();
    if (A.ctx) {
      var t = A.ctx.currentTime;
      S.master.gain.cancelScheduledValues(t); S.master.gain.setValueAtTime(S.master.gain.value, t);
      S.master.gain.linearRampToValueAtTime(0, t + 0.2);
      setTimeout(function () { if (!A.on && A.ctx) A.ctx.suspend(); }, 350);
    }
  };
  A.suspend = function () { if (A.ctx) A.ctx.suspend(); };
  A.resume = function () { if (A.ctx && A.on) A.ctx.resume(); };

  function virtualTick(tNow) {
    var sd = 60 / bpm / 4;
    if (!S.vNext || tNow - S.vNext > 1) S.vNext = tNow;
    while (S.vNext <= tNow) { onStep(S.vStep); S.vStep = (S.vStep + 1) % 64; S.vNext += sd; }
  }
  /* call once per frame */
  A.tick = function (now) {
    if (A.on && A.ctx && A.mode === 'synth') {
      while (S.events.length && S.events[0].t <= A.ctx.currentTime) onStep(S.events.shift().s);
      return;
    }
    if (A.on && A.ctx && A.mode === 'track' && S.analyser) {
      S.analyser.getByteFrequencyData(S.fd);
      var b = bins(1, 3), m = bins(6, 14), h = bins(40, 90);
      S.avg.b += (b - S.avg.b) * 0.04; S.avg.m += (m - S.avg.m) * 0.04; S.avg.h += (h - S.avg.h) * 0.04;
      if (b > S.avg.b * 1.22 + 8 && b > 90 && now - S.lastKick > 260) { S.lastKick = now; S.trackStep = (S.trackStep + 4) % 64; onStep(S.trackStep); }
      if (m > S.avg.m * 1.28 + 8 && m > 70 && now - S.lastSnare > 220) { S.lastSnare = now; BEAT.snare = 1; }
      if (h > S.avg.h * 1.35 + 8 && h > 60 && now - S.lastHat > 120) { S.lastHat = now; BEAT.hat = 1; }
      if (now - S.lastKick < 2600) return;       // detection is working
    }
    virtualTick(now / 1000);                      // silent idle clock (or fallback if no beats found)
  };

  /* ---------- sound effects ---------- */
  function playFile(name, url) {
    if (!S.sfx[name]) {
      S.sfx[name] = fetch(url).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (b) { return new Promise(function (res, rej) { A.ctx.decodeAudioData(b, res, rej); }); })
        .catch(function () { return null; });
    }
    S.sfx[name].then(function (buf) {
      if (!buf || !A.on) return;
      var s = A.ctx.createBufferSource(), g = A.ctx.createGain(); s.buffer = buf; g.gain.value = 0.9;
      s.connect(g); g.connect(S.master); s.start();
    });
  }
  A.sfx = function (name, n) {
    if (!A.on || !A.ctx || !S.master) return;
    var url = AC.sfx && AC.sfx[name];
    if (url) { playFile(name, url); return; }
    var c = A.ctx, t = c.currentTime, m = S.master; n = n || 0;
    if (name === 'hover') osc('triangle', 520 * Math.pow(1.0595, (n % 7) * 2), t, 0.07, 0.09, 0.002, m);
    else if (name === 'click') { osc('square', 240, t, 0.09, 0.12, 0.002, m, [1800, 300]); }
    else if (name === 'whoosh') {
      var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = S.noise; f.type = 'bandpass'; f.Q.value = 0.8;
      f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.5);
      s.connect(f); f.connect(g); g.connect(m); env(g, t, 0.18, 0.16, 0.4); s.start(t); s.stop(t + 0.7);
    } else if (name === 'copy') {
      osc('triangle', 880, t, 0.16, 0.14, 0.002, m, null, 0.3); osc('triangle', 1318.5, t + 0.07, 0.22, 0.14, 0.002, m, null, 0.3);
    }
  };
})();

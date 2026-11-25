/* =====================================================================
   3D STAGE
   A hand-written WebGL scene (no libraries): nine glossy toys that
   float behind the page, dance to the beat, dodge the cursor and fly
   to a new arrangement in every section.

   Layouts below are [x, y, depth, size, tiltX, tiltY, tiltZ]
   x and y are screen positions from -1 to 1. Order of the toys:
   0 handheld  1 big ball  2 big pill  3 donut  4 record  5 mirror ball  6 cube  7 small ball  8 small pill
   ===================================================================== */
(function () {
  'use strict';
  var D = window.DANCE = window.DANCE || {};
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var sstep = function (a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  function hexLin(h) { var n = parseInt(h.slice(1), 16); return [Math.pow((n >> 16 & 255) / 255, 2.2), Math.pow((n >> 8 & 255) / 255, 2.2), Math.pow((n & 255) / 255, 2.2)]; }

  /* ---------------- layouts ---------------- */
  var LAND = {
    home: [[.72, .1, 1.5, 1.4, .25, -.5, -.12], [.4, .7, -2.5, 1.05, 0, 0, 0], [.93, -.55, 0, 1, 0, 0, .75], [-.4, .8, -3, 1.05, 1, .3, 0], [.93, .8, -2, 1.1, 1.15, 0, .2],
      [.5, -.42, 2.5, .95, 0, 0, 0], [.0, .88, -1, .62, .4, .6, .2], [.16, .44, 0, .55, 0, 0, 0], [-.9, .58, 0, .62, 0, 0, -.6]],
    manifesto: [[.86, .7, -1, 1, .3, -.4, .1], [-.9, -.7, -1, 1.1, 0, 0, 0], [.9, -.72, -1, .9, 0, 0, -.6], [-.86, .74, -2, 1.1, 1, .4, 0], [.05, -1.06, -2, 1.2, 1.2, 0, 0],
      [.02, 1.04, -2, 1, 0, 0, 0], [.92, .32, -2, .6, .3, .5, .2], [.97, .05, -2, .5, 0, 0, 0], [.52, .97, -2, .5, 0, 0, .6]],
    stats: [[-.9, .88, -2, .8, .2, .5, .1], [.9, .86, -2, .8, 0, 0, 0], [-.96, -.8, -2, .8, 0, 0, .6], [.92, -.86, -2, .9, .9, .3, 0], [0, 1.06, -3, 1, 1.1, 0, 0],
      [0, -1.06, -2, .9, 0, 0, 0], [-.5, .96, -3, .5, .3, .4, .2], [.5, -.96, -3, .5, 0, 0, 0], [.5, .96, -3, .5, 0, 0, .6]],
    work: [[-1.02, .5, -3, .62, .2, .6, .1], [.38, .62, -1, .9, 0, 0, 0], [1.04, -.1, -1, .62, 0, 0, .4], [-1.03, -.42, -2, .7, .9, .4, 0], [.4, -.55, -2, .95, 1.2, 0, .3],
      [.46, .04, -1, .72, 0, 0, 0], [.82, .84, -2, .5, .3, .4, .2], [-.96, -.88, -2, .45, 0, 0, 0], [1, -.86, -2, .5, 0, 0, .9]],
    chapA: [[-1.03, .1, -2, .8, .3, .6, .1], [-.25, .99, -3, .9, 0, 0, 0], [1.03, .4, -2, .8, 0, 0, .5], [.55, -1, -3, 1, .9, 0, 0], [-.6, -1, -3, 1, 1.2, 0, .2],
      [.96, .95, -2, .8, 0, 0, 0], [-.95, .9, -3, .5, .3, .4, .2], [1.02, -.5, -3, .4, 0, 0, 0], [.05, -.98, -3, .5, 0, 0, .6]],
    about: [[.9, .86, -2, .8, .2, -.6, .1], [-1.04, -.97, -2, .7, 0, 0, 0], [.5, .98, -2, .7, 0, 0, -.5], [1.04, -.35, -2, .9, .8, .2, 0], [-.3, .97, -3, .9, 1.1, 0, -.2],
      [-.62, -.98, -1, .8, 0, 0, 0], [.2, -.98, -2, .5, .4, .5, .2], [.96, .3, -2, .4, 0, 0, 0], [-.98, .55, -2, .45, 0, 0, .5]],
    contact: [[-.55, -.74, 0, 1.2, .1, .5, .1], [.1, -.86, 1, 1.15, 0, 0, 0], [.74, -.7, 0, 1, 0, 0, 1.25], [-.92, -.82, 0, 1, 1.45, 0, 0], [.36, -.58, -1, 1.1, 1.3, 0, .1],
      [-.16, -.55, .5, 1, 0, 0, 0], [.92, -.95, 1, .7, .2, .6, .3], [-.78, -.48, 0, .6, 0, 0, 0], [.55, -.95, 1, .7, 0, 0, -.8]]
  };
  LAND.chapB = LAND.chapA.map(function (e) { return [-e[0], e[1], e[2], e[3], e[4], -e[5], -e[6]]; });
  var PORT = {
    home: [[.58, .62, 1, 1.35, .25, -.5, -.12], [-.62, .8, -2, 1.1, 0, 0, 0], [.92, .1, -1, 1, 0, 0, .75], [-.88, .34, -3, 1.1, 1, .3, 0], [.1, .93, -3, 1.05, 1.15, 0, .2],
      [-.4, .46, 2, 1, 0, 0, 0], [.92, .4, -1, .7, .4, .6, .2], [-.9, -.1, 0, .6, 0, 0, 0], [.78, -.92, 0, .6, 0, 0, -.6]]
  };
  /* phone chapters: the text sits in the middle of the screen, so keep the toys on the top and bottom edges (or hidden behind the picture) */
  PORT.chapA = [[-1, .5, -3, .75, .3, .6, .1], [.1, 1.0, -3, .8, 0, 0, 0], [1, .6, -3, .75, 0, 0, .5], [.72, -1, -3, .95, .9, 0, 0], [-.72, -1, -3, .95, 1.2, 0, .2],
    [0, -1.1, -3, .8, 0, 0, 0], [-.95, .98, -3, .5, .3, .4, .2], [1, 1, -3, .4, 0, 0, 0], [.05, -.78, -3, .4, 0, 0, .6]];
  PORT.chapB = PORT.chapA;
  Object.keys(LAND).forEach(function (k) {
    if (PORT[k]) return;
    PORT[k] = LAND[k].map(function (e) { return [clamp(e[0] * .92, -1.04, 1.04), e[1], e[2], e[3] * 1.3, e[4], e[5], e[6]]; });
  });

  D.createStage = function (canvas) {
    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) return null;

    /* ---------------- shaders ---------------- */
    var VS = 'attribute vec3 aPos;attribute vec3 aNrm;uniform mat4 uVP;uniform vec3 uT;uniform vec3 uS;uniform mat3 uR;' +
      'varying vec3 vN;varying vec3 vW;varying vec3 vO;' +
      'void main(){vec3 p=uR*(aPos*uS)+uT;vN=normalize(uR*(aNrm/uS));vW=p;vO=aPos;gl_Position=uVP*vec4(p,1.0);}';
    var FS = [
      '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', '#else', 'precision mediump float;', '#endif',
      'varying vec3 vN;varying vec3 vW;varying vec3 vO;',
      'uniform vec3 uCam;uniform vec3 uColor;uniform vec3 uSky;uniform vec3 uGround;uniform vec3 uBounce;uniform vec3 uSpot;',
      'uniform vec4 uMat;uniform float uTime;uniform float uPulse;',
      'float bx(vec3 d,vec3 dir,float c,float s){return smoothstep(c-s,c+s,dot(d,dir));}',
      'vec3 env(vec3 d,float r){',
      '  float s=.03+r*.55; float k=mix(1.,.45,r);',
      '  vec3 col=mix(uGround,uSky,smoothstep(-.7,.8,d.y));',
      '  col+=vec3(3.4)*k*bx(d,normalize(vec3(-.45,.85,.55)),.86,s);',
      '  col+=vec3(2.0,2.0,2.3)*k*bx(d,normalize(vec3(.95,.25,-.15)),.93,s*.8);',
      '  col+=vec3(1.2)*k*bx(d,normalize(vec3(-1.,.0,.25)),.965,s*.7);',
      '  col+=uBounce*.9*(1.-smoothstep(-.95,-.2,d.y));',
      '  vec3 sp=normalize(vec3(cos(uTime*.7),.25,sin(uTime*.7)));',
      '  col+=uSpot*2.6*k*bx(d,sp,.962,s*.6);',
      '  return col;}',
      'void main(){',
      '  vec3 N=normalize(vN); vec3 V=normalize(uCam-vW);',
      '  if(dot(N,V)<0.) N=-N;',
      '  vec3 R=reflect(-V,N);',
      '  float ndv=clamp(dot(N,V),0.,1.); float fres=pow(1.-ndv,4.);',
      '  float metal=uMat.x; float rough=uMat.y; float kind=uMat.z;',
      '  vec3 base=uColor; float groove=1.; vec3 extra=vec3(0.);',
      '  if(kind>1.5&&kind<2.5){',
      '    float rr=length(vO.xz); groove=.62+.38*(.5+.5*sin(rr*170.));',
      '    float a=atan(vO.z,vO.x);',
      '    extra+=vec3(.8)*pow(abs(cos(a*2.+uTime*.4)),18.)*groove*.4*step(.5,abs(N.y));',
      '  }',
      '  if(kind>2.5){',
      '    float sl=.62+.38*sin(vO.y*110.+uTime*3.);',
      '    extra+=uColor*uMat.w*sl*(.85+.15*sin(uTime*2.));',
      '    base=uColor*.25;',
      '  }',
      '  vec3 F0=mix(vec3(.045),base,metal);',
      '  vec3 F=F0+(vec3(1.)-F0)*fres;',
      '  vec3 spec=env(R,rough)*F*groove;',
      '  float nl=max(dot(N,normalize(vec3(-.45,.8,.55))),0.);',
      '  vec3 diff=base*(1.-metal)*(env(N,1.)*.35+.22+.7*nl);',
      '  vec3 col=diff+spec+extra;',
      '  if(kind>.5&&kind<1.5){',
      '    float h=fract(sin(dot(floor(N*9.+.5),vec3(12.9898,78.233,37.719)))*43758.5453);',
      '    col*=.78+.44*h;',
      '    col+=vec3(2.8)*step(.965,fract(h*5.+uTime*.22))*(.4+.6*ndv);',
      '  }',
      '  col+=uPulse*(.2+base)*(.2+fres*2.2);',
      '  col=(col*(2.51*col+.03))/(col*(2.43*col+.59)+.14);',
      '  col=pow(clamp(col,0.,1.),vec3(1./2.2));',
      '  gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');

    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(s));
      return s;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    var A = { pos: gl.getAttribLocation(prog, 'aPos'), nrm: gl.getAttribLocation(prog, 'aNrm') };
    var U = {};
    ['uVP', 'uT', 'uS', 'uR', 'uCam', 'uColor', 'uSky', 'uGround', 'uBounce', 'uSpot', 'uMat', 'uTime', 'uPulse'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.enableVertexAttribArray(A.pos); gl.enableVertexAttribArray(A.nrm);
    gl.enable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);

    /* ---------------- geometry ---------------- */
    function mk(pos, nrm, idx) {
      var n = pos.length / 3, buf = new Float32Array(n * 6);
      for (var i = 0; i < n; i++) {
        buf[i * 6] = pos[i * 3]; buf[i * 6 + 1] = pos[i * 3 + 1]; buf[i * 6 + 2] = pos[i * 3 + 2];
        buf[i * 6 + 3] = nrm[i * 3]; buf[i * 6 + 4] = nrm[i * 3 + 1]; buf[i * 6 + 5] = nrm[i * 3 + 2];
      }
      var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);
      var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
      return { vb: vb, ib: ib, n: idx.length };
    }
    function grid(P, N, I, rings, lon, fn) {
      var base = P.length / 3;
      for (var i = 0; i < rings; i++) for (var j = 0; j <= lon; j++) { var v = fn(i, j); P.push(v[0], v[1], v[2]); N.push(v[3], v[4], v[5]); }
      for (var a = 0; a < rings - 1; a++) for (var b = 0; b < lon; b++) {
        var q = base + a * (lon + 1) + b, r = q + lon + 1; I.push(q, r, q + 1, r, r + 1, q + 1);
      }
    }
    function sphere(lat, lon) {
      var P = [], N = [], I = [];
      grid(P, N, I, lat + 1, lon, function (i, j) { var t = i / lat * Math.PI, u = j / lon * Math.PI * 2, y = Math.cos(t), r = Math.sin(t), x = r * Math.cos(u), z = r * Math.sin(u); return [x, y, z, x, y, z]; });
      return mk(P, N, I);
    }
    function facetBall(lat, lon) {
      var P = [], N = [], I = [], n = 0;
      function pt(i, j) { var t = i / lat * Math.PI, u = j / lon * Math.PI * 2; return [Math.sin(t) * Math.cos(u), Math.cos(t), Math.sin(t) * Math.sin(u)]; }
      for (var i = 0; i < lat; i++) for (var j = 0; j < lon; j++) {
        var p00 = pt(i, j), p10 = pt(i + 1, j), p01 = pt(i, j + 1), p11 = pt(i + 1, j + 1);
        var cx = p00[0] + p10[0] + p01[0] + p11[0], cy = p00[1] + p10[1] + p01[1] + p11[1], cz = p00[2] + p10[2] + p01[2] + p11[2], l = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
        cx /= l; cy /= l; cz /= l;
        [p00, p10, p01, p10, p11, p01].forEach(function (p) { P.push(p[0], p[1], p[2]); N.push(cx, cy, cz); I.push(n++); });
      }
      return mk(P, N, I);
    }
    function torus(R, r, sa, sb) {
      var P = [], N = [], I = [];
      grid(P, N, I, sb + 1, sa, function (i, j) {
        var v = i / sb * Math.PI * 2, u = j / sa * Math.PI * 2, cv = Math.cos(v), sv = Math.sin(v);
        return [(R + r * cv) * Math.cos(u), r * sv, (R + r * cv) * Math.sin(u), cv * Math.cos(u), sv, cv * Math.sin(u)];
      });
      return mk(P, N, I);
    }
    function capsule(rad, half, lon, cap) {
      var P = [], N = [], I = [], ph = [], k;
      for (k = 0; k <= cap; k++) ph.push([Math.PI / 2 * (1 - k / cap), half]);
      for (k = 0; k <= cap; k++) ph.push([-Math.PI / 2 * (k / cap), -half]);
      grid(P, N, I, ph.length, lon, function (i, j) {
        var f = ph[i][0], h = ph[i][1], u = j / lon * Math.PI * 2, c = Math.cos(f);
        return [rad * c * Math.cos(u), h + rad * Math.sin(f), rad * c * Math.sin(u), c * Math.cos(u), Math.sin(f), c * Math.sin(u)];
      });
      return mk(P, N, I);
    }
    function disc(rad, h, seg) {
      var P = [], N = [], I = [], b;
      [[1, h], [-1, -h]].forEach(function (s) {
        b = P.length / 3; P.push(0, s[1], 0); N.push(0, s[0], 0);
        for (var j = 0; j <= seg; j++) { var u = j / seg * Math.PI * 2; P.push(rad * Math.cos(u), s[1], rad * Math.sin(u)); N.push(0, s[0], 0); }
        for (j = 0; j < seg; j++) I.push(b, b + 1 + j, b + 2 + j);
      });
      b = P.length / 3;
      for (var j = 0; j <= seg; j++) { var u = j / seg * Math.PI * 2, c = Math.cos(u), s = Math.sin(u); P.push(rad * c, h, rad * s, rad * c, -h, rad * s); N.push(c, 0, s, c, 0, s); }
      for (j = 0; j < seg; j++) { var q = b + j * 2; I.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
      return mk(P, N, I);
    }
    function rbox(hx, hy, hz, r, m) {
      var P = [], N = [], I = [], h = [hx, hy, hz];
      function vals(hh) {
        var a = [], j, t;
        for (j = 0; j <= m; j++) { t = Math.PI / 4 * (1 - j / m); a.push(-(hh - r) - r * Math.tan(t)); }
        for (j = 0; j <= m; j++) { t = Math.PI / 4 * (j / m); a.push((hh - r) + r * Math.tan(t)); }
        return a;
      }
      var vv = [vals(hx), vals(hy), vals(hz)];
      for (var ax = 0; ax < 3; ax++) for (var sg = -1; sg <= 1; sg += 2) {
        var t1 = (ax + 1) % 3, t2 = (ax + 2) % 3, base = P.length / 3, i, j;
        for (i = 0; i < vv[t1].length; i++) for (j = 0; j < vv[t2].length; j++) {
          var p = [0, 0, 0]; p[ax] = sg * h[ax]; p[t1] = vv[t1][i]; p[t2] = vv[t2][j];
          var d = [0, 0, 0], L = 0, k;
          for (k = 0; k < 3; k++) { var inn = clamp(p[k], -(h[k] - r), h[k] - r); d[k] = p[k] - inn; p[k] = inn; L += d[k] * d[k]; }
          L = Math.sqrt(L) || 1;
          P.push(p[0] + d[0] / L * r, p[1] + d[1] / L * r, p[2] + d[2] / L * r); N.push(d[0] / L, d[1] / L, d[2] / L);
        }
        var n1 = vv[t1].length, n2 = vv[t2].length;
        for (i = 0; i < n1 - 1; i++) for (j = 0; j < n2 - 1; j++) { var a = base + i * n2 + j, b2 = a + 1, c = a + n2, e = a + n2 + 1; I.push(a, c, b2, b2, c, e); }
      }
      return mk(P, N, I);
    }
    var M = {
      cons: rbox(.78, .98, .45, .26, 5), scr: rbox(.5, .4, .07, .05, 3), sph: sphere(28, 40), dot: sphere(14, 20),
      pill: capsule(.42, .55, 28, 10), tor: torus(.95, .4, 44, 22), disc: disc(1.3, .05, 72), lab: disc(.46, .065, 40),
      ball: facetBall(14, 28), cube: rbox(.55, .55, .55, .2, 5)
    };

    /* ---------------- math ---------------- */
    function m3(a, b) { var o = new Array(9); for (var c = 0; c < 3; c++) for (var r = 0; r < 3; r++) { var s = 0; for (var k = 0; k < 3; k++) s += a[k * 3 + r] * b[c * 3 + k]; o[c * 3 + r] = s; } return o; }
    function rX(a) { var c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, s, 0, -s, c]; }
    function rY(a) { var c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 1, 0, s, 0, c]; }
    function rZ(a) { var c = Math.cos(a), s = Math.sin(a); return [c, s, 0, -s, c, 0, 0, 0, 1]; }
    function euler(x, y, z) { return m3(rZ(z), m3(rX(x), rY(y))); }
    var FOV = 32 * Math.PI / 180, CAMZ = 16, NEAR = 1, FAR = 60;
    var VP = new Float32Array(16);
    function setVP(aspect) {
      var t = 1 / Math.tan(FOV / 2), nf = 1 / (NEAR - FAR);
      var P = [t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (FAR + NEAR) * nf, -1, 0, 0, 2 * FAR * NEAR * nf, 0];
      for (var i = 0; i < 12; i++) VP[i] = P[i];
      VP[12] = 0; VP[13] = 0; VP[14] = P[10] * (-CAMZ) + P[14]; VP[15] = P[11] * (-CAMZ) + P[15];
    }

    /* ---------------- toys ---------------- */
    var PL = [0, .16, 0, 0], CH = [1, .07, 1, 0], VI = [.25, .4, 2, 0], SC = [0, .1, 3, 1.1];
    var TOYS = [
      { rad: 1.3, bs: 1, spin: 1, sp: .4, parts: [{ m: 'cons', c: 0, mat: PL, o: [0, 0, 0], s: 1 }, { m: 'scr', c: 'scr', mat: SC, o: [0, .3, .46], s: 1 }, { m: 'dot', c: 4, mat: PL, o: [-.3, -.52, .47], s: .12 }, { m: 'dot', c: 7, mat: PL, o: [.06, -.52, .47], s: .12 }] },
      { rad: 1, bs: 1, spin: 1, sp: .3, parts: [{ m: 'sph', c: 1, mat: PL, o: [0, 0, 0], s: 1 }] },
      { rad: 1, bs: 1, spin: 2, sp: .5, parts: [{ m: 'pill', c: 2, mat: PL, o: [0, 0, 0], s: 1 }] },
      { rad: 1.35, bs: 1, spin: 0, sp: .8, parts: [{ m: 'tor', c: 3, mat: PL, o: [0, 0, 0], s: 1 }] },
      { rad: 1.3, bs: 1, spin: 1, sp: 1.1, parts: [{ m: 'disc', c: 'dark', mat: VI, o: [0, 0, 0], s: 1 }, { m: 'lab', c: 4, mat: PL, o: [0, 0, 0], s: 1 }] },
      { rad: 1.05, bs: 1.05, spin: 1, sp: .45, parts: [{ m: 'ball', c: 'ball', mat: CH, o: [0, 0, 0], s: 1 }] },
      { rad: 1, bs: 1, spin: 1, sp: .6, parts: [{ m: 'cube', c: 5, mat: PL, o: [0, 0, 0], s: 1 }] },
      { rad: 1, bs: .55, spin: 1, sp: .3, parts: [{ m: 'sph', c: 6, mat: PL, o: [0, 0, 0], s: 1 }] },
      { rad: 1, bs: .62, spin: 2, sp: .7, parts: [{ m: 'pill', c: 7, mat: PL, o: [0, 0, 0], s: 1 }] }
    ];
    var OB = TOYS.map(function (t, i) { return { x: 0, y: 3, vx: 0, vy: 0, rx: 0, ry: 0, rz: 0, spin: 0, spinV: t.sp, sy: 1, pulse: 0, rel: .25 + i * .085 }; });

    /* ---------------- palette ---------------- */
    var colors = { cur: [], tgt: [] };
    function setPalette(t, instant) {
      var list = t.toy.concat([t.dark, t.scr, '#FFFFFF', t.bg, t.spot, t.bounce]).map(hexLin);
      colors.tgt = list;
      if (instant || !colors.cur.length) colors.cur = list.map(function (c) { return c.slice(); });
    }
    function colorFor(c) { if (typeof c === 'number') return colors.cur[c]; return c === 'dark' ? colors.cur[8] : c === 'scr' ? colors.cur[9] : colors.cur[10]; }

    /* ---------------- state ---------------- */
    var W = 0, H = 0, DPR = 1, introT = -1, tm = 0, REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pointer = { x: 0, y: 0, vx: 0, vy: 0, on: false };
    var sections = [{ top: 0, key: 'home' }];

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, innerWidth < 700 ? 1.75 : 2);
      var w = Math.round(innerWidth * DPR), h = Math.round(innerHeight * DPR);
      if (w !== W || h !== H) { W = w; H = h; canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H); }
    }
    function blend(portrait, sy) {
      var set = portrait ? PORT : LAND, mid = sy + innerHeight * .5, i = 0, n = sections.length;
      for (var k = 0; k < n; k++) if (mid >= sections[k].top) i = k;
      var j = Math.min(n - 1, i + 1), t = 0;
      if (j !== i) {
        var span = sections[j].top - sections[i].top, w = Math.min(innerHeight * .55, span * .9);
        t = sstep(sections[j].top - w, sections[j].top, mid);
      }
      var A0 = set[sections[i].key] || set.home, B0 = set[sections[j].key] || set.home, out = [];
      for (var q = 0; q < A0.length; q++) { var o = []; for (var z = 0; z < 7; z++) o.push(lerp(A0[q][z], B0[q][z], t)); out.push(o); }
      return out;
    }

    function frame(dt, sy, svel, amp, BEAT) {
      resize(); tm += dt;
      var aspect = W / H, portrait = aspect < .85;
      setVP(aspect);
      var halfH0 = Math.tan(FOV / 2) * CAMZ, halfW0 = halfH0 * aspect;
      var ku = Math.min(halfH0, halfW0 * (portrait ? .92 : .62)) / 4.59;
      var L = blend(portrait, sy);
      for (var ci = 0; ci < colors.cur.length; ci++) for (var cj = 0; cj < 3; cj++) colors.cur[ci][cj] += (colors.tgt[ci][cj] - colors.cur[ci][cj]) * Math.min(1, dt * 4);
      var bg = colors.cur[11], spot = colors.cur[12], bounce = colors.cur[13];
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(U.uVP, false, VP);
      gl.uniform3f(U.uCam, 0, 0, CAMZ);
      gl.uniform1f(U.uTime, tm);
      gl.uniform3f(U.uSky, bg[0] * .75 + .05, bg[1] * .75 + .05, bg[2] * .75 + .05);
      gl.uniform3f(U.uGround, bg[0] * .16, bg[1] * .16, bg[2] * .16);
      gl.uniform3f(U.uSpot, spot[0], spot[1], spot[2]);
      gl.uniform3f(U.uBounce, bounce[0] * .7, bounce[1] * .7, bounce[2] * .7);

      var h = dt / 2;
      for (var i = 0; i < TOYS.length; i++) {
        var T = TOYS[i], o = OB[i], tg = L[i];
        var z = tg[2], hz = Math.tan(FOV / 2) * (CAMZ - z);
        var tx = tg[0], ty = tg[1] + svel * .00006 * (1 + (z + 4) * .12);
        var nr = (tg[3] * T.rad * T.bs * ku) / hz;
        if (introT < o.rel) { o.x = tx; o.y = ty + 2.8; o.vx = 0; o.vy = 0; }
        else {
          for (var s = 0; s < 2; s++) {
            var ax = 40 * (tx - o.x) - 7 * o.vx, ay = 40 * (ty - o.y) - 7 * o.vy;
            if (pointer.on) {
              var dx = (o.x - pointer.x) * aspect, dy = o.y - pointer.y, d = Math.sqrt(dx * dx + dy * dy) + 1e-4, R = .34 + nr * 1.15;
              if (d < R) { var f = 1 - d / R; f *= f; ax += dx / d / aspect * f * 34 + pointer.vx * f * 16; ay += dy / d * f * 34 + pointer.vy * f * 16; o.spinV += f * dt * 6; }
            }
            o.vx += ax * h; o.vy += ay * h; o.x += o.vx * h; o.y += o.vy * h;
          }
        }
        var pu = (i % 2 === 0 ? BEAT.kick : BEAT.snare) * amp; if (i === 5) pu = Math.max(pu, BEAT.hat * amp * .6);
        o.pulse += (pu - o.pulse) * Math.min(1, dt * 30);
        var stretch = 1 + .2 * o.pulse + clamp(Math.abs(o.vy) * .035, 0, .18);
        o.sy += (stretch - o.sy) * Math.min(1, dt * 16);
        var sx = 1 / Math.sqrt(o.sy);
        o.spinV += (T.sp * (.4 + .6 * amp) - o.spinV) * Math.min(1, dt * 1.8);
        o.spin += o.spinV * dt * (REDUCE ? 0 : 1) + o.pulse * dt * 1.2;
        var rx = lerp(o.rx, tg[4], Math.min(1, dt * 5)), ry = lerp(o.ry, tg[5], Math.min(1, dt * 5)), rz = lerp(o.rz, tg[6], Math.min(1, dt * 5));
        o.rx = rx; o.ry = ry; o.rz = rz;
        var ex = rx - pointer.y * .28, ey = ry + pointer.x * .4, ez = rz;
        if (T.spin === 0) ex += o.spin; else if (T.spin === 1) ey += o.spin; else ez += o.spin;
        var R3 = euler(ex, ey, ez), wx = o.x * hz * aspect, wy = o.y * hz, sc = tg[3] * T.bs * ku;
        for (var p = 0; p < T.parts.length; p++) {
          var P = T.parts[p], m = M[P.m];
          var lo = [P.o[0] * sc * sx, P.o[1] * sc * o.sy, P.o[2] * sc * sx];
          var ox = R3[0] * lo[0] + R3[3] * lo[1] + R3[6] * lo[2], oy = R3[1] * lo[0] + R3[4] * lo[1] + R3[7] * lo[2], oz = R3[2] * lo[0] + R3[5] * lo[1] + R3[8] * lo[2];
          var col = colorFor(P.c);
          gl.uniform3f(U.uT, wx + ox, wy + oy, z + oz);
          gl.uniform3f(U.uS, sc * sx * P.s, sc * o.sy * P.s, sc * sx * P.s);
          gl.uniformMatrix3fv(U.uR, false, new Float32Array(R3));
          gl.uniform3f(U.uColor, col[0], col[1], col[2]);
          gl.uniform4f(U.uMat, P.mat[0], P.mat[1], P.mat[2], P.mat[3]);
          gl.uniform1f(U.uPulse, o.pulse * .5);
          gl.bindBuffer(gl.ARRAY_BUFFER, m.vb);
          gl.vertexAttribPointer(A.pos, 3, gl.FLOAT, false, 24, 0); gl.vertexAttribPointer(A.nrm, 3, gl.FLOAT, false, 24, 12);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib);
          gl.drawElements(gl.TRIANGLES, m.n, gl.UNSIGNED_SHORT, 0);
        }
      }
    }
    function poke(nx, ny, power) {
      var asp = W / H;
      OB.forEach(function (o) {
        var dx = (o.x - nx) * asp, dy = o.y - ny, d = Math.sqrt(dx * dx + dy * dy) + .08, f = power / (d * d + .3);
        o.vx += dx / d / asp * f * 1.2; o.vy += dy / d * f * 1.2 + power * .8; o.spinV += f * 2;
      });
    }
    function kickAll(p) { OB.forEach(function (o) { o.vy += p * (1 + Math.random()); o.spinV += p * 3; }); }

    resize();
    return {
      frame: frame, poke: poke, kickAll: kickAll, pointer: pointer,
      palette: setPalette,
      setSections: function (list) { sections = list.slice().sort(function (a, b) { return a.top - b.top; }); },
      start: function () { introT = REDUCE ? 99 : 0; },
      tick: function (dt) { if (introT >= 0) introT += dt; },
      lost: function (fn) { canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); fn(); }); }
    };
  };
})();

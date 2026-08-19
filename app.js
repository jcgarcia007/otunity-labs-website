/* Otunity Labs — interface + WebGL chamber. 6 specimens. */
window.OL = (function () {
  var lang = "en";
  var D = {
    en: {
      title: "Otunity Labs — AI systems laboratory",
      desc: "Otunity Labs LLC. Voice agents, sales bots, workflow automation, multi-agent orchestration, custom AI software and data intelligence — built around your stack.",
      assembling: "Assembling", stable: "Stable",
      spec: ["Voice Agents", "Sales Bots", "n8n Workflows", "Agent Orchestration", "Custom AI Software", "Data Intelligence"],
      subject: "Analysis request",
      flabel: ["Name", "Email", "Company", "Service"],
      sent: "Opening your mail client with the request ready to send.",
      toggle: "Cambiar a español", other: "Español"
    },
    es: {
      title: "Otunity Labs — Laboratorio de sistemas de IA",
      desc: "Otunity Labs LLC. Agentes de voz, bots de ventas, automatización de flujos, orquestación multiagente, software de IA a medida e inteligencia de datos — hechos a la medida de tu stack.",
      assembling: "Ensamblando", stable: "Estable",
      spec: ["Agentes de voz", "Bots de ventas", "Flujos n8n", "Orquestación de agentes", "Software de IA a medida", "Inteligencia de datos"],
      subject: "Solicitud de análisis",
      flabel: ["Nombre", "Email", "Empresa", "Servicio"],
      sent: "Abriendo tu cliente de correo con la solicitud lista para enviar.",
      toggle: "Switch to English", other: "English"
    }
  };
  function firstText(el) {
    for (var k = 0; k < el.childNodes.length; k++) {
      var n = el.childNodes[k];
      if (n.nodeType === 3 && n.nodeValue.trim()) return n;
    }
    return null;
  }
  function set(next) {
    var es = next === "es";
    [].forEach.call(document.querySelectorAll("[data-es],[data-es-html],[data-es-ph]"), function (el) {
      if (el.hasAttribute("data-es-html")) {
        if (!el.hasAttribute("data-en-html")) el.setAttribute("data-en-html", el.innerHTML);
        el.innerHTML = es ? el.getAttribute("data-es-html") : el.getAttribute("data-en-html");
      } else if (el.hasAttribute("data-es")) {
        if (!el.hasAttribute("data-en")) {
          var t = firstText(el);
          el.setAttribute("data-en", t ? t.nodeValue.trim() : el.textContent.trim());
        }
        (function (node, val) {
          var t = firstText(node);
          if (t) t.nodeValue = t.nodeValue.match(/^\s*/)[0] + val + t.nodeValue.match(/\s*$/)[0];
          else node.textContent = val;
        })(el, es ? el.getAttribute("data-es") : el.getAttribute("data-en"));
      }
      if (el.hasAttribute("data-es-ph")) {
        if (!el.hasAttribute("data-en-ph")) el.setAttribute("data-en-ph", el.placeholder || "");
        el.placeholder = es ? el.getAttribute("data-es-ph") : el.getAttribute("data-en-ph");
      }
    });
    lang = next;
    var t = D[lang];
    document.documentElement.lang = lang;
    document.title = t.title;
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", t.desc);
    var b = document.getElementById("lang");
    if (b) {
      b.setAttribute("aria-label", t.toggle); b.title = t.other;
      var sp = b.querySelectorAll(".lang__i");
      sp[0].classList.toggle("is-on", lang === "en");
      sp[1].classList.toggle("is-on", lang === "es");
    }
    if (window.__chamberRefresh) window.__chamberRefresh();
  }
  return {
    get lang() { return lang; },
    t: function () { return D[lang]; },
    set: set,
    toggle: function () { set(lang === "en" ? "es" : "en"); }
  };
})();

/* interface: language button, reveal-on-scroll, year, mailto form */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var btn = document.getElementById("lang");
  if (btn) btn.addEventListener("click", function () { window.OL.toggle(); });
  (navigator.language || "").toLowerCase().indexOf("es") === 0 ? window.OL.set("es") : window.OL.set("en");

  var rv = document.querySelectorAll(".rv");
  if (reduce || !("IntersectionObserver" in window)) {
    [].forEach.call(rv, function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: .06 });
    [].forEach.call(rv, function (e, k) { e.style.transitionDelay = (k % 4) * 70 + "ms"; io.observe(e); });
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = (new Date).getFullYear();

  var form = document.getElementById("form");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var fd = new FormData(form), t = window.OL.t(), L = t.flabel;
    var body = L[0] + ": " + fd.get("name") + "\n" + L[1] + ": " + fd.get("email") + "\n" +
      L[2] + ": " + (fd.get("company") || "-") + "\n" + L[3] + ": " + fd.get("specimen") + "\n\n" + fd.get("message");
    window.location.href = "mailto:jgarcia@otunitylabs.com?subject=" +
      encodeURIComponent(t.subject + " — " + fd.get("name")) + "&body=" + encodeURIComponent(body);
    document.getElementById("fine").textContent = t.sent;
  });
})();

/* WebGL culture chamber — six specimens, morph between any two */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cap = /[?&]cap=1/.test(location.search);
  var HOLD = 2.6, MORPH = 1.4, SEG = HOLD + MORPH;
  var IDS = [{ id: "SPC-01" }, { id: "SPC-02" }, { id: "SPC-03" }, { id: "SPC-04" }, { id: "SPC-05" }, { id: "SPC-06" }];
  var N = 6, PTS = 5200;

  function hash(t) { t = 43758.5453 * Math.sin(127.1 * t); return t - Math.floor(t); }

  /* point-cloud generators: (index) -> [x,y,z] */
  var pointGen = [
    function (t) { // 0 geodesic sphere
      var phi = (1 + Math.sqrt(5)) / 2, a = t / PTS, n = Math.acos(1 - 2 * a), o = 2 * Math.PI * t / phi,
        u = 1.42 + .05 * (hash(1.7 * t) - .5), s = Math.round(n / Math.PI * 19) / 19 * Math.PI;
      n = .12 * n + .88 * s;
      var c = Math.max(3, Math.round(34 * Math.sin(s)));
      o = Math.round(o / (2 * Math.PI) * c) / c * Math.PI * 2 + .05 * (hash(9.1 * t) - .5);
      return [u * Math.sin(n) * Math.cos(o), u * Math.cos(n), u * Math.sin(n) * Math.sin(o)];
    },
    function (t) { // 1 torus knot
      var e = t / PTS * Math.PI * 2 * 3, a = 1.24 * (2 + Math.cos(3 * e / 2)) * .46,
        n = a * Math.cos(e), o = a * Math.sin(e), u = 1.24 * Math.sin(3 * e / 2) * .62,
        s = hash(3.3 * t) * Math.PI * 2, c = .27 * Math.sqrt(hash(5.1 * t));
      return [n + Math.cos(s) * c, o + Math.sin(s) * c * .7, u + Math.sin(s) * c];
    },
    function (t) { // 2 double helix
      var e = t / PTS, a = t % 3, n = e * Math.PI * 2 * 3.1, o = 2.95 * (e - .5), u = .88;
      if (a < 2) { var s = a * Math.PI, c = .055 * (hash(2.9 * t) - .5); return [Math.cos(n + s) * u + c, o, Math.sin(n + s) * u + c]; }
      var l = hash(7.7 * t), d = Math.cos(n) * u, f = Math.cos(n + Math.PI) * u, h = Math.sin(n) * u;
      return [d + (f - d) * l, o, h + (Math.sin(n + Math.PI) * u - h) * l];
    },
    function (t) { // 3 cubic lattice
      var e = Math.floor(3 * hash(11.3 * t)), a = .5 * Math.floor(6 * hash(13.7 * t)) - 1.05,
        n = .5 * Math.floor(6 * hash(17.1 * t)) - 1.05, r = 2.1 * hash(19.9 * t) - 1.05, o = .022 * (hash(23.3 * t) - .5);
      return e === 0 ? [r + o, a + o, n + o] : e === 1 ? [a + o, r + o, n + o] : [a + o, n + o, r + o];
    },
    function (t) { // 4 spiral galaxy (three arms, in x-y plane)
      var a = t / PTS, arm = t % 3, ang = a * Math.PI * 4 + arm * (2 * Math.PI / 3),
        rad = .26 + a * 1.34, jit = .10 * (hash(3.1 * t) - .5);
      return [Math.cos(ang) * (rad + jit), Math.sin(ang) * (rad + jit), .16 * (hash(5.7 * t) - .5) * (1.3 - a)];
    },
    function (t) { // 5 torus ring (donut in x-z plane)
      var R = 1.02, rr = .44, u = t / PTS * Math.PI * 2 * 9, v = hash(2.3 * t) * Math.PI * 2, rim = R + rr * Math.cos(v);
      return [rim * Math.cos(u), rr * Math.sin(v), rim * Math.sin(u)];
    }
  ];

  /* line-set generators: () -> [ [ [x,y,z],[x,y,z] ], ... ] */
  var lineGen = [
    function () { var R = 1.42, seg = []; function P(a, b) { return [R * Math.sin(a) * Math.cos(b), R * Math.cos(a), R * Math.sin(a) * Math.sin(b)]; }
      for (var i = 1; i <= 11; i++) for (var a = i / 12 * Math.PI, j = 0; j < 40; j++) seg.push([P(a, j / 40 * 6.28318), P(a, (j + 1) / 40 * 6.28318)]);
      for (var m = 0; m < 18; m++) for (var b = m / 18 * 6.28318, s = 0; s <= 11; s++) seg.push([P(s / 12 * Math.PI, b), P((s + 1) / 12 * Math.PI, b)]); return seg; }(),
    function () { var seg = []; function P(t, e) { var a = 1.24 * (2 + Math.cos(3 * t / 2)) * .46, n = e / 6 * 6.28318 + .42 * t, r = .26;
        return [a * Math.cos(t) + Math.cos(n) * r, a * Math.sin(t) + Math.sin(n) * r * .82, 1.24 * Math.sin(3 * t / 2) * .62 + Math.sin(n + 1.1) * r]; }
      for (var a = 0; a < 6; a++) for (var n = 0; n < 200; n++) seg.push([P(n / 200 * 12.56637, a), P((n + 1) / 200 * 12.56637, a)]); return seg; }(),
    function () { var seg = []; function P(t, e) { var a = 6.28318 * t * 3.1; return [.88 * Math.cos(a + e), 2.95 * (t - .5), .88 * Math.sin(a + e)]; }
      for (var a = 0; a < 2; a++) for (var n = 0; n < 240; n++) seg.push([P(n / 240, a * Math.PI), P((n + 1) / 240, a * Math.PI)]);
      for (var r = 0; r < 62; r++) { var i = r / 61; seg.push([P(i, 0), P(i, Math.PI)]); } return seg; }(),
    function () { for (var t = 2.1 / 5, e = -1.05, seg = [], n = 0; n < 3; n++) for (var r = 0; r <= 5; r++) for (var i = 0; i <= 5; i++) for (var o = 0; o < 5; o++) {
        var u = e + r * t, s = e + i * t, c = e + o * t, l = e + (o + 1) * t;
        n === 0 ? seg.push([[c, u, s], [l, u, s]]) : n === 1 ? seg.push([[u, c, s], [u, l, s]]) : seg.push([[u, s, c], [u, s, l]]); } return seg; }(),
    function () { var seg = []; for (var arm = 0; arm < 3; arm++) { var prev = null; for (var s = 0; s <= 96; s++) {
        var a = s / 96, ang = a * Math.PI * 4 + arm * (2 * Math.PI / 3), rad = .26 + a * 1.34, pt = [Math.cos(ang) * rad, Math.sin(ang) * rad, 0];
        if (prev) seg.push([prev, pt]); prev = pt; } } return seg; }(),
    function () { var seg = [], R = 1.02, rr = .44; function P(u, v) { var rim = R + rr * Math.cos(v); return [rim * Math.cos(u), rr * Math.sin(v), rim * Math.sin(u)]; }
      for (var i = 0; i < 22; i++) { var u = i / 22 * 6.28318; for (var j = 0; j < 16; j++) seg.push([P(u, j / 16 * 6.28318), P(u, (j + 1) / 16 * 6.28318)]); }
      for (var m = 0; m < 13; m++) { var v = m / 13 * 6.28318; for (var k = 0; k < 30; k++) seg.push([P(k / 30 * 6.28318, v), P((k + 1) / 30 * 6.28318, v)]); } return seg; }()
  ];

  var maxSeg = 0; lineGen.forEach(function (g) { maxSeg = Math.max(maxSeg, g.length); });
  var LINE_VERTS = maxSeg * 2;

  var VERT = [
    "attribute vec3 aFrom,aTo; attribute vec2 aS;",
    "uniform float uT,uTime,uDpr,uPS; uniform mat4 uP,uV;",
    "varying float vD,vS;",
    "void main(){",
    "  float s=aS.x;",
    "  float st=clamp((uT-0.30*fract(s*29.13))/0.70,0.0,1.0);",
    "  st=st*st*(3.0-2.0*st);",
    "  vec3 p=mix(aFrom,aTo,st);",
    "  p+=0.034*vec3(sin(uTime*0.7854+p.y*2.3+p.z*1.6),cos(uTime*1.1781+p.x*2.1+p.z*1.1),sin(uTime*0.3927+p.y*1.9+p.x*1.4));",
    "  vec3 ch=normalize(vec3(sin(s*57.1),cos(s*31.7),sin(s*19.3))+0.001)*(1.5+1.9*fract(s*97.7));",
    "  float sc=sin(st*3.14159)*0.92*step(0.001,uT)*(1.0-step(0.999,uT));",
    "  p=mix(p,ch,sc*(0.45+0.55*fract(s*43.1)));",
    "  vec4 mv=uV*vec4(p,1.0);",
    "  vD=-mv.z; vS=s;",
    "  gl_Position=uP*mv;",
    "  gl_PointSize=max(1.0,(aS.y*uPS/max(vD,0.2))*uDpr);",
    "}"
  ].join("\n");
  var FRAG = [
    "precision mediump float;",
    "varying float vD,vS;",
    "uniform vec3 uCul,uRea; uniform float uA,uLine;",
    "void main(){",
    "  float a;",
    "  if(uLine>0.5){ a=1.0; }",
    "  else { vec2 d=gl_PointCoord-0.5; float r=length(d); if(r>0.5) discard; a=smoothstep(0.5,0.0,r); a*=a; }",
    "  float fog=clamp((7.6-vD)/4.6,0.05,1.0);",
    "  vec3 c=mix(uCul,uRea,step(0.945,fract(vS*13.73)));",
    "  c=mix(c,vec3(0.88,0.99,1.0),clamp((3.6-vD)/2.6,0.0,1.0)*0.5);",
    "  gl_FragColor=vec4(c*a*fog*1.75*uA,a*fog*uA);",
    "}"
  ].join("\n");

  var canvas = document.getElementById("gl");
  var video = document.getElementById("vid");
  if (!canvas) { window.__chamberFail = true; return; }
  var gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }) || canvas.getContext("experimental-webgl");
  if (!gl) { window.__chamberFail = true; return; }

  function shader(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (console.error(gl.getShaderInfoLog(s)), null); }
  var vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { window.__chamberFail = true; return; }
  var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { window.__chamberFail = true; return; }
  gl.useProgram(prog);

  var aFrom = gl.getAttribLocation(prog, "aFrom"), aTo = gl.getAttribLocation(prog, "aTo"), aS = gl.getAttribLocation(prog, "aS");
  var U = {}; ["uT", "uTime", "uDpr", "uPS", "uA", "uLine", "uP", "uV", "uCul", "uRea"].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });

  function buffer(arr) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); return b; }

  /* point buffers: one per shape + shared seed (size/colour) */
  var pointBufs = [], k, p2;
  for (k = 0; k < N; k++) {
    var pa = new Float32Array(3 * PTS);
    for (p2 = 0; p2 < PTS; p2++) { var v = pointGen[k](p2); pa[3 * p2] = v[0]; pa[3 * p2 + 1] = v[1]; pa[3 * p2 + 2] = v[2]; }
    pointBufs.push(buffer(pa));
  }
  var seedPts = (function () { var a = new Float32Array(2 * PTS); for (var t = 0; t < PTS; t++) { a[2 * t] = 100 * hash(1.13 * t); a[2 * t + 1] = .03 + .07 * Math.pow(hash(3.71 * t), 2.2); } return buffer(a); })();

  /* line buffers: one per shape (padded to LINE_VERTS via modulo wrap) + shared seed */
  var lineBufs = [];
  for (k = 0; k < N; k++) {
    var segs = lineGen[k], la = new Float32Array(3 * LINE_VERTS);
    for (var e = 0; e < LINE_VERTS; e++) { var v2 = segs[(e >> 1) % segs.length][e & 1]; la[3 * e] = v2[0]; la[3 * e + 1] = v2[1]; la[3 * e + 2] = v2[2]; }
    lineBufs.push(buffer(la));
  }
  var seedLines = (function () { var a = new Float32Array(2 * LINE_VERTS); for (var e = 0; e < LINE_VERTS; e++) { a[2 * e] = 100 * hash(1.77 * (e >> 1)); a[2 * e + 1] = .03; } return buffer(a); })();

  gl.uniform3f(U.uCul, .184, .827, .722);
  gl.uniform3f(U.uRea, 1, .416, .239);
  gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.clearColor(0, 0, 0, 0);

  function bindPair(fromB, toB, seedB) {
    gl.bindBuffer(gl.ARRAY_BUFFER, fromB); gl.enableVertexAttribArray(aFrom); gl.vertexAttribPointer(aFrom, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, toB); gl.enableVertexAttribArray(aTo); gl.vertexAttribPointer(aTo, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, seedB); gl.enableVertexAttribArray(aS); gl.vertexAttribPointer(aS, 2, gl.FLOAT, false, 0, 0);
  }

  var dpr = 1, W = 0, H = 0, cam = { dz: 4.75, ox: .92, oy: .12 };
  function resize() {
    var w = window.innerWidth;
    cam = w < 720 ? { dz: 4.7, ox: 0, oy: .22 } : w < 1040 ? { dz: 5.6, ox: .34, oy: -.3 } : { dz: 4.75, ox: .92, oy: .12 };
    dpr = Math.min(window.devicePixelRatio || 1, cap ? 1 : 1.6);
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
    canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
    var fov = 1, asp = r.width / Math.max(r.height, 1), near = .1, far = 40, f = 1 / Math.tan(fov / 2), P = new Float32Array(16);
    P[0] = f / asp; P[5] = f; P[10] = (far + near) / (near - far); P[11] = -1; P[14] = 2 * far * near / (near - far);
    gl.uniformMatrix4fv(U.uP, false, P);
    gl.uniform1f(U.uDpr, dpr);
  }
  window.addEventListener("resize", resize);

  function view(pitch, yaw, dz, ox, oy) {
    var cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw), m = new Float32Array(16);
    m[0] = cy; m[1] = sp * sy; m[2] = -cp * sy; m[3] = 0; m[4] = 0; m[5] = cp; m[6] = sp; m[7] = 0;
    m[8] = sy; m[9] = -sp * cy; m[10] = cp * cy; m[11] = 0; m[12] = ox; m[13] = oy; m[14] = -dz; m[15] = 1; return m;
  }

  var rid = document.getElementById("rid"), rnm = document.getElementById("rnm"), rbar = document.getElementById("rbar"),
    rst = document.getElementById("rst"), rct = document.getElementById("rct"),
    specs = [].slice.call(document.querySelectorAll(".spec")), shown = -1;
  window.__chamberRefresh = function () { shown = -1; };

  function readout(idx, assembling, prog) {
    var t = (window.OL && window.OL.t()) || {};
    if (idx !== shown && rid) {
      shown = idx;
      rid.textContent = IDS[idx].id;
      rnm.textContent = (t.spec && t.spec[idx]) || "";
      rct.textContent = "0" + (idx + 1) + " / 0" + N;
      specs.forEach(function (el, i) { el.setAttribute("aria-current", i === idx ? "true" : "false"); });
    }
    if (rst) rst.textContent = assembling ? (t.assembling || "") : (t.stable || "");
    if (rbar) rbar.style.width = (100 * prog).toFixed(1) + "%";
  }

  var px = 0, py = 0, tx = 0, ty = 0;
  if (!reduce && !cap) window.addEventListener("pointermove", function (e) {
    tx = 2 * (e.clientX / window.innerWidth - .5); ty = 2 * (e.clientY / window.innerHeight - .5);
  }, { passive: true });

  var SPIN = 2 * Math.PI / 16, clock = 0, last = null, mode = "auto", jumpFrom = 0, jumpTo = 0, jumpP = 0, inView = true, visible = true;
  var hero = document.querySelector(".hero");
  if ("IntersectionObserver" in window && hero) new IntersectionObserver(function (e) { inView = e[0].isIntersecting; }, { threshold: .01 }).observe(hero);
  document.addEventListener("visibilitychange", function () { visible = !document.hidden; });
  specs.forEach(function (el) {
    el.addEventListener("click", function () {
      var to = +el.getAttribute("data-i");
      if (mode !== "jump" && to !== shown) { jumpFrom = shown < 0 ? 0 : shown; jumpTo = to; jumpP = 0; mode = "jump"; }
    });
  });

  resize();
  requestAnimationFrame(function frame(now) {
    requestAnimationFrame(frame);
    var dt;
    if (cap) { clock = (window.__f || 0) / 24; dt = 1 / 24; }
    else { if (last === null) last = now; dt = Math.min((now - last) / 1e3, .05); last = now; if (!inView || !visible) return; if (mode === "auto") clock += dt; }

    var from = 0, to = 1, prog = 0, assembling = false;
    if (reduce) { from = 0; to = 0; prog = 0; }
    else if (mode === "jump") {
      jumpP = Math.min(jumpP + dt / MORPH, 1);
      from = jumpFrom; to = jumpTo; prog = jumpP; assembling = true;
      if (jumpP >= 1) { clock = SEG * jumpTo; mode = "auto"; }
    } else {
      var d = clock / SEG, idx = Math.floor(d) % N, localt = SEG * (d - Math.floor(d));
      from = idx; to = (idx + 1) % N;
      if (localt <= HOLD) { prog = 0; assembling = false; }
      else { prog = (localt - HOLD) / MORPH; assembling = true; }
    }

    gl.uniform1f(U.uT, reduce ? 0 : prog);
    gl.uniform1f(U.uTime, cap ? 0 : clock);
    var yaw = (reduce ? .6 : clock * SPIN) + .32 * (px += .05 * (tx - px));
    var pitch = .19 * (py += .05 * (ty - py)) - .15;
    gl.uniformMatrix4fv(U.uV, false, view(pitch, yaw, cam.dz, cam.ox, cam.oy));
    gl.clear(gl.COLOR_BUFFER_BIT);

    bindPair(lineBufs[from], lineBufs[to], seedLines);
    gl.uniform1f(U.uLine, 1); gl.uniform1f(U.uA, 1.15); gl.uniform1f(U.uPS, 150);
    gl.drawArrays(gl.LINES, 0, LINE_VERTS);

    bindPair(pointBufs[from], pointBufs[to], seedPts);
    gl.uniform1f(U.uLine, 0); gl.uniform1f(U.uA, .62); gl.uniform1f(U.uPS, 170);
    gl.drawArrays(gl.POINTS, 0, PTS);

    readout(prog > .5 ? to : from, assembling, prog);
  });

  canvas.classList.add("on");
  if (video) setTimeout(function () { video.classList.add("off"); }, 950);
  window.__chamberReady = true;
})();

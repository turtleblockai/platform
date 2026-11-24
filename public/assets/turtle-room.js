/* TurtleBlock AI: the Turtle Room. One full-viewport, no-scroll view on / and /try/.
   DRAW: live Logo. TALK: build a Minecraft world with Turtle (/api/turtle/converse).
   The five companion moves (NOTICE, KNOCK, ENTER, RETREAT, ROAM) are always on screen. */
(function () {
  "use strict";
  var STARTER = "repeat 4 [fd 70 rt 90]";
  var YOU = "#00635f", TURTLE = "#b5651d";
  var COLORS = { black: "#121010", teal: "#00635f", red: "#b3261e", blue: "#1f4e9a", green: "#2e7d32", orange: "#c75b12", purple: "#6a3d9a", gold: "#b5891d", pink: "#c2185b", gray: "#6b6259" };
  var PALETTE = ["#121010", "#1f4e9a", "#b3261e", "#2e7d32", "#00635f", "#6a3d9a", "#c75b12", "#c2185b", "#b5891d", "#6b6259"];
  var MOVES = { NOTICE: "look quietly", KNOCK: "offer one idea", ENTER: "come help", RETREAT: "step back", ROAM: "make its own" };
  var NAV = [["About", "/about/"], ["WorldSpec", "/worldspec/"], ["Charter", "/charter/"], ["Research", "/research/"], ["Library", "/research/library/"], ["Build Log", "/build/"], ["Terraria", "/terraria/"], ["STEAMHAMLET", "/steamhamlet/"], ["RE/EDUCATION", "/reeducation/"]];
  var IDEAS = {
    "Abandoned village": "I want to make an abandoned village that has clear structures that are in disarray but were once nice, and then in the corner somewhere of the village a little shining light of hope of rebirth.",
    "Glowing river": "Let's make a river that has glowing deep depths and a fishing pier with a hamburger stand.",
    "Cliffside library": "I want to make a library on a cliff where every floor holds a different season."
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- tiny Logo ---------- */
  function tokenize(src) {
    var out = [], re = /\s*(\[|\]|\(|\)|\+|-|\*|\/|[0-9]*\.?[0-9]+|"?[A-Za-z_][A-Za-z0-9_.?]*|\S)/g, m;
    while ((m = re.exec(src)) && m[0].length) { if (m[1]) out.push(m[1]); }
    return out;
  }
  function parseBlock(toks, i) { // returns [list, nextIndex]; toks[i] === "["
    var depth = 0, start = i + 1;
    for (var j = i; j < toks.length; j++) {
      if (toks[j] === "[") depth++;
      else if (toks[j] === "]") { depth--; if (depth === 0) return [toks.slice(start, j), j + 1]; }
    }
    throw new Error("I see a [ without its ].");
  }
  var CMD1 = { FD: 1, FORWARD: 1, BK: 1, BACK: 1, RT: 1, RIGHT: 1, LT: 1, LEFT: 1, SETPC: 1, SETPENCOLOR: 1, SETCOLOR: 1, SETH: 1, SETHEADING: 1 };
  var CMD0 = { PU: 1, PENUP: 1, PD: 1, PENDOWN: 1, CS: 1, CLEARSCREEN: 1, CLEAN: 1, HOME: 1, HT: 1, HIDETURTLE: 1, ST: 1, SHOWTURTLE: 1 };

  function run(toks, ctx, ops) {
    var i = 0;
    function expr() {
      var v = term();
      while (toks[i] === "+" || toks[i] === "-") { var op = toks[i++], r = term(); v = op === "+" ? v + r : v - r; }
      return v;
    }
    function term() {
      var v = factor();
      while (toks[i] === "*" || toks[i] === "/") { var op = toks[i++], r = factor(); v = op === "*" ? v * r : (r === 0 ? 0 : v / r); }
      return v;
    }
    function factor() {
      var t = toks[i];
      if (t === undefined) throw new Error("That command needs a number after it.");
      if (t === "-") { i++; return -factor(); }
      if (t === "(") { i++; var v = expr(); if (toks[i] !== ")") throw new Error("I see a ( without its )."); i++; return v; }
      if (/^[0-9.]+$/.test(t)) { i++; return parseFloat(t); }
      var u = t.toUpperCase();
      if (u === "REPCOUNT") { i++; return ctx.rep[ctx.rep.length - 1] || 0; }
      if (u === "RANDOM") { i++; var n = factor(); return Math.floor(Math.random() * Math.max(1, n)); }
      throw new Error("I expected a number, not " + t + ".");
    }
    while (i < toks.length) {
      if (++ctx.steps > 20000) throw new Error("That's a lot of steps. I stopped at 20,000.");
      var t = toks[i], u = t.toUpperCase().replace(/^"/, "");
      if (u === "REPEAT") {
        i++; var n = Math.max(0, Math.floor(expr()));
        if (toks[i] !== "[") throw new Error("REPEAT needs a [list] to repeat.");
        var b = parseBlock(toks, i); i = b[1];
        for (var k = 1; k <= Math.min(n, 2000); k++) { ctx.rep.push(k); run(b[0], ctx, ops); ctx.rep.pop(); }
      } else if (CMD1[u]) {
        i++;
        if (u === "SETPC" || u === "SETPENCOLOR" || u === "SETCOLOR") {
          var c = toks[i] || "", cu = c.replace(/^"/, "").toLowerCase();
          if (COLORS[cu]) { i++; ops.push({ k: "pc", v: COLORS[cu] }); }
          else { var num = Math.floor(expr()); ops.push({ k: "pc", v: PALETTE[((num % 10) + 10) % 10] }); }
        } else {
          var v = expr();
          if (u === "FD" || u === "FORWARD") ops.push({ k: "fd", v: v });
          else if (u === "BK" || u === "BACK") ops.push({ k: "fd", v: -v });
          else if (u === "RT" || u === "RIGHT") ops.push({ k: "rt", v: v });
          else if (u === "LT" || u === "LEFT") ops.push({ k: "rt", v: -v });
          else ops.push({ k: "seth", v: v });
        }
      } else if (CMD0[u]) {
        i++;
        var map = { PU: "pu", PENUP: "pu", PD: "pd", PENDOWN: "pd", CS: "cs", CLEARSCREEN: "cs", CLEAN: "clean", HOME: "home", HT: "ht", HIDETURTLE: "ht", ST: "st", SHOWTURTLE: "st" };
        ops.push({ k: map[u] });
      } else if (MOVES[u]) {
        i++; ops.push({ k: "move", v: u });
      } else if (t === "[" || t === "]") {
        throw new Error("A [list] has to follow REPEAT.");
      } else {
        throw new Error("I don't know how to " + t.toUpperCase() + " yet. Try FD, RT, LT, or REPEAT.");
      }
    }
  }


  function chip(cmd, label) { return '<button type="button" class="tr-chip" data-cmd="' + esc(cmd) + '">' + label + "</button>"; }

  function build() {
    var el = document.createElement("div");
    el.className = "troom"; el.id = "troom";
    el.setAttribute("role", "application"); el.setAttribute("aria-label", "The Turtle Room");
    el.innerHTML =
      '<div class="tr-top"><a class="tr-brand" href="/" aria-label="TurtleBlock AI home"><img src="/assets/turtleblock-mark.svg" alt=""><span>TurtleBlock AI</span></a>' +
      '<nav class="tr-nav" aria-label="Site">' + NAV.map(function (n) { return '<a href="' + n[1] + '">' + n[0] + "</a>"; }).join("") + "</nav></div>" +
      '<div class="tr-head"><p class="tr-hello">Meet the turtle. Tell it where to go<span class="long">, then teach it to be a good companion</span>.</p>' +
      '<div class="tr-modes" role="tablist" aria-label="Mode"><button type="button" role="tab" data-mode="draw" aria-selected="true">Draw</button><button type="button" role="tab" data-mode="talk" aria-selected="false">Talk</button></div></div>' +
      '<div class="tr-stage">' +
      '<canvas class="tr-canvas" aria-label="Turtle drawing area"></canvas>' +
      '<div class="tr-say" aria-live="polite"></div>' +
      '<div class="tr-knock" hidden></div>' +
      '<div class="tr-studio" hidden><span>Turtle\'s studio. It never touches your page.</span><canvas aria-label="The turtle\'s own studio"></canvas></div>' +
      '<button type="button" class="tr-ledger-btn" aria-expanded="false">Who did what</button>' +
      '<div class="tr-ledger" hidden><ol></ol></div>' +
      '<section class="tr-talk" hidden aria-label="Talk with Turtle">' +
      '<div class="tr-turn turtle"><b>Turtle</b>What kind of place are you thinking about making in Minecraft? We can talk through what it means and what should matter before we place blocks, then build a version you can enter, inspect, and change.</div>' +
      '<label class="tr-consent"><input type="checkbox"><span>I understand that my submissions may be retained and used for TurtleBlock AI research, evaluation, improvement, and future training/evaluation datasets under the <a href="/privacy/">Privacy Notice v0.1</a>. I will not submit personal or sensitive information. I\'m 13 or up, or working with a teacher or parent.</span></label>' +
      '<div class="tr-convo"></div><p class="tr-meta"></p>' +
      '<details class="tr-spec" hidden><summary>Inspect the current WorldSpec</summary><pre></pre></details>' +
      "</section>" +
      "</div>" +
      '<div class="tr-moves" role="group" aria-label="Companion moves">' +
      Object.keys(MOVES).map(function (m) { return '<button type="button" class="tr-move" data-move="' + m + '"><b>' + m + "</b><span>" + MOVES[m] + "</span></button>"; }).join("") + "</div>" +
      '<form class="tr-prompt" autocomplete="off"><label class="tr-q" for="tr-in">?</label>' +
      '<div class="tr-line"><input id="tr-in" class="tr-in" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" enterkeyhint="go" aria-label="Logo command" value="' + STARTER + '">' +
      '<span class="tr-ghost" aria-hidden="true"><span class="tr-mirror"></span><span class="tr-cursor"></span></span></div>' +
      '<button class="tr-run" type="submit">RUN ↵</button></form>' +
      '<div class="tr-chips draw" role="group" aria-label="First moves">' +
      chip("repeat 5 [fd 90 rt 144]", "Star") + chip("repeat 90 [fd repcount / 1.5 rt 31]", "Spiral") +
      chip("repeat 12 [repeat 4 [fd 50 rt 90] rt 30]", "Flower") + chip("repeat 36 [fd 8 rt 10] rt 90 fd 30", "Wander") + chip("cs", "Clear") +
      '<a class="tr-chip ghost" href="https://bryansanders.com/make/" target="_blank" rel="noopener">Disks ↗</a></div>' +
      '<div class="tr-chips talk" role="group" aria-label="World ideas" hidden>' +
      Object.keys(IDEAS).map(function (k) { return '<button type="button" class="tr-chip" data-idea="' + esc(k) + '">' + k + "</button>"; }).join("") + "</div>" +
      '<div class="tr-foot" role="contentinfo"><span>A <a href="https://culvercitystudioworks.com/" target="_blank" rel="noopener noreferrer">Culver City Studio Works</a> project, led by <a href="https://read.bryansanders.com" target="_blank" rel="noopener noreferrer">Dr. Bryan P. Sanders</a></span>' +
      '<span class="tr-dot">•</span><a href="https://github.com/turtleblockai" target="_blank" rel="noopener noreferrer">GitHub</a><span class="tr-dot">•</span><a href="https://orcid.org/0000-0001-6866-7280" target="_blank" rel="me noopener noreferrer">ORCID</a><span class="tr-dot">•</span><a href="https://www.linkedin.com/in/nayrbgo/" target="_blank" rel="me noopener noreferrer">LinkedIn</a><span class="tr-dot">•</span><a href="/privacy/">Privacy</a></div>';
    return el;
  }

  function mount(root, startMode) {
    var $ = function (q) { return root.querySelector(q); };
    var cv = $(".tr-canvas"), g = cv.getContext("2d");
    var sc = $(".tr-studio canvas"), sg = sc.getContext("2d");
    var say = $(".tr-say"), form = $(".tr-prompt"), input = $(".tr-in"), runBtn = $(".tr-run");
    var mirror = $(".tr-mirror"), ghost = $(".tr-ghost");
    var knockBox = $(".tr-knock"), studio = $(".tr-studio"), ledgerBox = $(".tr-ledger"), ledgerList = $(".tr-ledger ol"), ledgerBtn = $(".tr-ledger-btn");
    var talk = $(".tr-talk"), convo = $(".tr-convo"), consent = $(".tr-consent input"), meta = $(".tr-meta"), spec = $(".tr-spec"), specPre = $(".tr-spec pre");

    var S = { x: 0, y: 0, h: 0, pen: true, color: YOU, shown: true };
    var strokes = [], marks = [], busy = false, firstDone = false, retreated = false, movesTried = {};
    var lastCmd = "", hist = [], hIdx = 0, never = {}, pendingOffer = null, knockedOn = "", mode = "draw", drawDraft = STARTER, talkDraft = "", talking = false;
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)), W = 0, H = 0, scale = 1;

    function size() {
      var r = cv.getBoundingClientRect(); W = Math.max(120, r.width); H = Math.max(100, r.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      scale = Math.min(W, H) / 280; draw();
    }
    function P(x, y) { return [W / 2 + x * scale, H / 2 - y * scale]; }
    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      g.strokeStyle = "rgba(143,131,112,.16)"; g.lineWidth = 1;
      for (var gx = (W / 2) % 28; gx < W; gx += 28) { g.beginPath(); g.moveTo(gx, 0); g.lineTo(gx, H); g.stroke(); }
      for (var gy = (H / 2) % 28; gy < H; gy += 28) { g.beginPath(); g.moveTo(0, gy); g.lineTo(W, gy); g.stroke(); }
      g.lineCap = "round"; g.lineJoin = "round";
      strokes.forEach(function (s) {
        var a = P(s[0], s[1]), b = P(s[2], s[3]);
        g.strokeStyle = s[4]; g.lineWidth = s[5] === "turtle" ? 2 : 2.4;
        g.setLineDash(s[5] === "turtle" ? [6, 4] : []);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      });
      g.setLineDash([]);
      marks.forEach(function (m) { var p = P(m[0], m[1]); g.fillStyle = "rgba(181,101,29,.6)"; g.beginPath(); g.arc(p[0], p[1], 4, 0, 7); g.fill(); });
      if (S.shown) turtle(g, P(S.x, S.y), S.h, retreated ? 0.45 : 1, retreated ? 0.7 : 1);
    }
    function turtle(ctx, p, h, alpha, k) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(p[0], p[1]); ctx.rotate(h * Math.PI / 180); ctx.scale(k, k);
      ctx.fillStyle = "#00635f"; ctx.strokeStyle = "#004946"; ctx.lineWidth = 1.5;
      [[-7, -4], [7, -4], [-7, 7], [7, 7]].forEach(function (f) { ctx.beginPath(); ctx.ellipse(f[0], f[1], 3.2, 2.4, 0, 0, 7); ctx.fill(); });
      ctx.beginPath(); ctx.ellipse(0, -12, 3.6, 4.2, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 1, 7.5, 9.5, 0, 0, 7); ctx.fillStyle = "#bde8e4"; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 10); ctx.moveTo(-7, 1); ctx.lineTo(7, 1); ctx.strokeStyle = "rgba(0,73,70,.5)"; ctx.stroke();
      ctx.restore();
    }
    function speak(t) { say.textContent = t; say.classList.toggle("on", !!t); }
    function ledger(who, what) {
      var li = document.createElement("li"); li.innerHTML = '<span class="tr-who ' + who + '">' + who + "</span> " + esc(what);
      ledgerList.appendChild(li); while (ledgerList.children.length > 14) ledgerList.removeChild(ledgerList.firstChild);
    }
    function ghostSync() { mirror.textContent = input.value; ghost.hidden = mode !== "draw" || document.activeElement === input || !input.value; }

    function animate(ops, author, color, done) {
      busy = true;
      var total = ops.reduce(function (a, o) { return a + (o.k === "fd" ? Math.abs(o.v) : o.k === "rt" ? Math.abs(o.v) / 4 : 0); }, 0);
      var perFrame = Math.max(4, total / 110), idx = 0, prog = 0, col = color;
      var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      function step() {
        var budget = reduce ? Infinity : perFrame;
        while (idx < ops.length && budget > 0) {
          var o = ops[idx];
          if (o.k === "fd") {
            var left = Math.abs(o.v) - prog, take = Math.min(left, budget), dir = o.v < 0 ? -1 : 1;
            var rad = S.h * Math.PI / 180, nx = S.x + Math.sin(rad) * take * dir, ny = S.y + Math.cos(rad) * take * dir;
            if (S.pen && take > 0) strokes.push([S.x, S.y, nx, ny, col, author]);
            S.x = nx; S.y = ny; prog += take; budget -= take;
            if (prog >= Math.abs(o.v) - 1e-9) { idx++; prog = 0; }
          } else if (o.k === "rt") {
            var leftA = Math.abs(o.v) - prog, takeA = Math.min(leftA, budget * 4);
            S.h += takeA * (o.v < 0 ? -1 : 1); prog += takeA; budget -= takeA / 4;
            if (prog >= Math.abs(o.v) - 1e-9) { idx++; prog = 0; }
          } else {
            if (o.k === "pu") S.pen = false; else if (o.k === "pd") S.pen = true;
            else if (o.k === "pc") col = o.v;
            else if (o.k === "seth") S.h = o.v;
            else if (o.k === "home") { S.x = 0; S.y = 0; S.h = 0; }
            else if (o.k === "cs") { strokes = []; marks = []; S.x = 0; S.y = 0; S.h = 0; }
            else if (o.k === "clean") { strokes = []; marks = []; }
            else if (o.k === "ht") S.shown = false; else if (o.k === "st") S.shown = true;
            idx++;
          }
        }
        draw();
        if (idx < ops.length) requestAnimationFrame(step); else { busy = false; S.h = ((S.h % 360) + 360) % 360; if (done) done(); }
      }
      requestAnimationFrame(step);
    }

    function notice() {
      var mine = strokes.filter(function (s) { return s[5] === "you"; });
      if (!mine.length) return null;
      var pts = [], corners = 0, rights = 0, lefts = 0, closed = 0, len = 0;
      for (var i = 0; i < mine.length; i++) {
        var s = mine[i]; len += Math.hypot(s[2] - s[0], s[3] - s[1]);
        if (i > 0) {
          var p = mine[i - 1], a1 = Math.atan2(p[3] - p[1], p[2] - p[0]), a2 = Math.atan2(s[3] - s[1], s[2] - s[0]);
          var d = ((a2 - a1) * 180 / Math.PI + 540) % 360 - 180, joined = Math.hypot(p[2] - s[0], p[3] - s[1]) < 0.5;
          if (joined && Math.abs(d) > 25) { corners++; pts.push([s[0], s[1]]); if (d < 0) rights++; else lefts++; }
        }
      }
      var st = [mine[0][0], mine[0][1]];
      mine.forEach(function (s) { if (Math.hypot(s[2] - st[0], s[3] - st[1]) < 1 && Math.hypot(s[0] - st[0], s[1] - st[1]) > 1) closed = 1; });
      return { corners: corners, rights: rights, lefts: lefts, closed: closed, len: Math.round(len), pts: pts.slice(0, 40), sig: mine.length + ":" + Math.round(len) };
    }
    function offerFor(n) {
      if (n.closed && !never.spin) return { kind: "spin", text: "You closed a shape. Want me to spin a copy around it, six times?", why: "You came back to where you started, and shapes that close love company.", cmd: lastCmd ? "repeat 6 [" + lastCmd.replace(/\bcs\b/gi, "") + " rt 60]" : "repeat 6 [repeat 4 [fd 40 rt 90] rt 60]" };
      if (n.corners && (n.rights === 0 || n.lefts === 0) && !never.mirror) return { kind: "mirror", text: "You turned " + (n.lefts ? "left" : "right") + " every time. Want me to try the other way, as a mirror?", why: "All your turns went one direction, so the other direction is still unexplored.", cmd: (lastCmd || "fd 50 rt 90 fd 50").replace(/\brt\b/gi, "@@").replace(/\blt\b/gi, "rt").replace(/@@/g, "lt") };
      if (!never.grow) return { kind: "grow", text: "Want me to draw it again, half as big, tucked inside?", why: "Your drawing is " + n.len + " steps long. Smaller copies show the pattern underneath.", cmd: (lastCmd || "fd 50").replace(/(fd|forward|bk|back)\s+([0-9.]+)/gi, function (m, c, v) { return c + " " + (parseFloat(v) / 2); }) };
      return null;
    }
    function spark() {
      if (Object.keys(movesTried).length >= 3 && !movesTried._sparked) {
        movesTried._sparked = 1;
        setTimeout(function () { if (!knockBox.hidden) return; speak("Your turn to decide. What should a turtle be allowed to notice about you? When should it knock, and when should it leave you alone? The Charter is where we're writing that down."); }, 3800);
      }
    }

    function doMove(m) {
      if (mode !== "draw") setMode("draw");
      movesTried[m] = 1;
      root.querySelectorAll(".tr-move").forEach(function (b) { b.classList.toggle("on", b.dataset.move === m); });
      ledger("you", m);
      knockBox.hidden = true;
      if (m === "NOTICE") {
        if (retreated) { speak("I'm in retreat. Say ENTER when you want me back."); return; }
        var n = notice();
        if (!n) { speak("Nothing to notice yet. Press RUN and draw something first."); return; }
        marks = n.pts; draw();
        speak("I noticed " + n.corners + " corner" + (n.corners === 1 ? "" : "s") + " and " + (n.closed ? "a shape that closes" : "a path that stays open") + ". I'm keeping it to myself. KNOCK if you want to hear what I'd offer.");
        ledger("turtle", "noticed, said nothing more");
        setTimeout(function () { marks = []; draw(); }, 2600);
      } else if (m === "KNOCK") {
        if (retreated) { speak("I'm in retreat. Say ENTER when you want me back."); return; }
        var nn = notice(); if (!nn) { speak("I have nothing to knock about yet. Draw something first."); return; }
        if (knockedOn === nn.sig && !pendingOffer) { speak("I already knocked about this one. I won't knock again until you draw something new."); ledger("turtle", "didn't re-knock"); return; }
        var off = offerFor(nn);
        if (!off) { speak("You told me never for every kind of offer I have. I'll stay quiet."); return; }
        pendingOffer = off; knockedOn = nn.sig; speak("");
        knockBox.innerHTML = '<p><b>Knock, knock.</b> ' + esc(off.text) + '</p><p class="tr-why">Why: ' + esc(off.why) + '</p>' +
          '<div class="tr-answers"><button type="button" data-a="yes">Come in</button><button type="button" data-a="later">Not now</button><button type="button" data-a="never">Never this kind</button></div>';
        knockBox.hidden = false;
        ledger("turtle", "knocked: " + off.kind);
      } else if (m === "ENTER") {
        if (retreated) { retreated = false; draw(); speak("I'm back. Your page is still yours. Where should it go next?"); ledger("turtle", "came back when called"); }
        else if (pendingOffer) { accept(); return; }
        else { speak("You opened the door, but nothing's on the table. So I'll just ask: what is this drawing trying to become?"); ledger("turtle", "entered at question depth"); }
      } else if (m === "RETREAT") {
        retreated = true; pendingOffer = null; draw();
        speak("Stepping back. Your lines stay yours, mine stay signed, and I'll wait here until you call.");
        ledger("turtle", "retreated, kept the trace");
      } else if (m === "ROAM") {
        studio.hidden = false; roam();
        speak("That's my studio, up in the corner. Nothing I make there lands on your page unless I KNOCK and you let me in.");
        ledger("turtle", "roamed in its own studio");
      }
      spark();
    }
    function accept() {
      var off = pendingOffer; pendingOffer = null; knockBox.hidden = true;
      var ops = [];
      try { run(tokenize(off.cmd), { rep: [], steps: 0 }, ops); } catch (e) { speak("I tripped on my own idea. Never mind."); return; }
      ledger("you", "let it in");
      speak("Coming in. My lines are dashed and orange, so you can always tell whose is whose.");
      animate(ops, "turtle", TURTLE, function () { ledger("turtle", "drew " + off.kind + ", signed"); spark(); });
    }
    knockBox.addEventListener("click", function (e) {
      var a = e.target.closest("[data-a]"); if (!a || !pendingOffer) return;
      var k = a.dataset.a;
      if (k === "yes") { accept(); return; }
      knockBox.hidden = true;
      if (k === "later") { ledger("you", "not now"); speak("Okay. I won't knock on this one again."); }
      else { never[pendingOffer.kind] = 1; ledger("you", "never this kind"); speak("Got it. No more " + pendingOffer.kind + " offers. That's about this kind of idea, not about you."); }
      pendingOffer = null;
    });
    function roam() {
      var r = sc.getBoundingClientRect(), w = Math.max(80, r.width), h = Math.max(60, r.height);
      sc.width = Math.round(w * dpr); sc.height = Math.round(h * dpr); sg.setTransform(dpr, 0, 0, dpr, 0, 0);
      sg.clearRect(0, 0, w, h); sg.strokeStyle = TURTLE; sg.lineWidth = 1.4; sg.setLineDash([4, 3]);
      var petals = 5 + Math.floor(Math.random() * 8), side = Math.min(w, h) * 0.3, hd = Math.random() * 360;
      sg.beginPath();
      for (var p = 0; p < petals; p++) {
        var x = w / 2, y = h / 2, hh = hd + p * 360 / petals; sg.moveTo(x, y);
        for (var q = 0; q < 4; q++) { var rad = hh * Math.PI / 180; x += Math.sin(rad) * side; y -= Math.cos(rad) * side; sg.lineTo(x, y); hh += 90; }
      }
      sg.stroke();
    }

    function submitDraw(cmd) {
      cmd = (cmd || "").trim(); if (!cmd || busy) return;
      var ops = [];
      try { run(tokenize(cmd), { rep: [], steps: 0 }, ops); }
      catch (e) { speak(e.message); return; }
      hist.push(cmd); hIdx = hist.length;
      var moves = ops.filter(function (o) { return o.k === "move"; });
      var drawOps = ops.filter(function (o) { return o.k !== "move"; });
      if (drawOps.some(function (o) { return o.k === "fd"; })) lastCmd = cmd.replace(/\b(notice|knock|enter|retreat|roam)\b/gi, "").trim();
      if (drawOps.length) ledger("you", cmd.length > 40 ? cmd.slice(0, 40) + "…" : cmd);
      input.value = ""; input.placeholder = "try: rt 45 fd 80"; ghostSync(); speak("");
      animate(drawOps, "you", S.color, function () {
        moves.forEach(function (m) { doMove(m.v); });
        if (!firstDone && strokes.some(function (s) { return s[5] === "you"; })) {
          firstDone = true; root.classList.add("drawn");
          speak("You did that. Now try a companion move: NOTICE, KNOCK, ENTER, RETREAT, or ROAM.");
        }
      });
    }

    /* TALK */
    function sessionId() { var id = localStorage.getItem("turtleblock_session"); if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()); localStorage.setItem("turtleblock_session", id); } return id; }
    function addTurn(who, text) {
      var d = document.createElement("div"); d.className = "tr-turn " + who;
      d.innerHTML = "<b>" + (who === "learner" ? "You" : "Turtle") + "</b>"; d.appendChild(document.createTextNode(text));
      convo.appendChild(d); d.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    function talkSync() { runBtn.disabled = mode === "talk" && (!consent.checked || input.value.trim().length < 3 || talking); }
    async function submitTalk(text) {
      text = (text || "").trim(); if (!text || !consent.checked || talking) return;
      talking = true; addTurn("learner", text); input.value = ""; runBtn.textContent = "…"; talkSync();
      try {
        var r = await fetch("/api/turtle/converse", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ utterance: text, anonymous_session_id: sessionId(), consent_version: "0.1", worldspec_version: "0.1" }) });
        var data = await r.json(); if (!r.ok) throw new Error(data.error || "Request failed");
        addTurn("turtle", data.turtle);
        meta.textContent = "Session " + data.session_id + " · WorldSpec " + data.worldspec_id + " · revision " + String(data.revision).padStart(4, "0");
        specPre.textContent = JSON.stringify(data.worldspec, null, 2); spec.hidden = false;
      } catch (e) { addTurn("turtle", "I hit a system error instead of losing the thread: " + e.message); }
      finally { talking = false; runBtn.textContent = "SEND ↵"; talkSync(); }
    }

    function setMode(m) {
      if (m === mode) return;
      if (mode === "draw") drawDraft = input.value; else talkDraft = input.value;
      mode = m; root.dataset.mode = m;
      root.querySelectorAll("[data-mode]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.mode === m)); });
      talk.hidden = m !== "talk"; $(".tr-chips.draw").hidden = m !== "draw"; $(".tr-chips.talk").hidden = m !== "talk";
      input.value = m === "draw" ? drawDraft : talkDraft;
      input.placeholder = m === "draw" ? "try: rt 45 fd 80" : "Describe a place to build in Minecraft…";
      input.setAttribute("aria-label", m === "draw" ? "Logo command" : "Describe a place to build");
      input.setAttribute("autocapitalize", m === "draw" ? "off" : "sentences");
      $(".tr-q").textContent = m === "draw" ? "?" : ">";
      runBtn.textContent = m === "draw" ? "RUN ↵" : "SEND ↵"; runBtn.disabled = false;
      knockBox.hidden = true; speak(m === "talk" ? "" : say.textContent);
      var want = m === "talk" ? "/try/" : "/";
      if (location.pathname !== want) history.replaceState(history.state, "", want);
      document.title = m === "talk" ? "Talk with Turtle — TurtleBlock AI" : "TurtleBlock AI";
      talkSync(); ghostSync();
      if (m === "draw") requestAnimationFrame(size);
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); if (mode === "draw") submitDraw(input.value); else submitTalk(input.value); });
    input.addEventListener("keydown", function (e) {
      if (mode !== "draw" || !hist.length) return;
      if (e.key === "ArrowUp") { hIdx = Math.max(0, hIdx - 1); input.value = hist[hIdx]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { hIdx = Math.min(hist.length, hIdx + 1); input.value = hist[hIdx] || ""; e.preventDefault(); }
    });
    ["input", "focus", "blur"].forEach(function (ev) { input.addEventListener(ev, function () { ghostSync(); talkSync(); }); });
    consent.addEventListener("change", talkSync);
    $(".tr-chips.draw").addEventListener("click", function (e) { var c = e.target.closest("[data-cmd]"); if (c) submitDraw(c.dataset.cmd); });
    $(".tr-chips.talk").addEventListener("click", function (e) { var c = e.target.closest("[data-idea]"); if (c) { input.value = IDEAS[c.dataset.idea]; talkSync(); input.focus(); } });
    $(".tr-moves").addEventListener("click", function (e) { var b = e.target.closest("[data-move]"); if (b && !busy) doMove(b.dataset.move); });
    $(".tr-modes").addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) setMode(b.dataset.mode); });
    ledgerBtn.addEventListener("click", function () { ledgerBox.hidden = !ledgerBox.hidden; ledgerBtn.setAttribute("aria-expanded", String(!ledgerBox.hidden)); });
    window.addEventListener("resize", function () { if (root.isConnected && mode === "draw") size(); });
    size(); ghostSync();
    if (startMode === "talk") setMode("talk");
    else if (window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      try { input.focus({ preventScroll: true }); input.setSelectionRange(input.value.length, input.value.length); } catch (e) {}
    }
  }

  function wanted() { var p = location.pathname.replace(/\/+$/, "/"); return p === "/" ? "draw" : (p === "/try/" || p === "/try") ? "talk" : null; }
  var room = null;
  function sync() {
    var m = wanted();
    if (m && !room) { room = build(); document.body.appendChild(room); document.documentElement.classList.add("troom-on"); mount(room, m); }
    else if (room) { room.hidden = !m; document.documentElement.classList.toggle("troom-on", !!m); }
  }
  function start() {
    sync();
    var c = document.getElementById("content");
    if (c && "MutationObserver" in window) new MutationObserver(sync).observe(c, { childList: true });
    window.addEventListener("popstate", sync);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

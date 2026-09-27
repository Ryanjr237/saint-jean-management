// Saint Jean School of Management — comportements & motion design du site
document.addEventListener('DOMContentLoaded', function () {

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Petit écran : on allège les effets pensés pour la souris et les grands écrans
  var smallScreen = window.matchMedia('(max-width: 720px)').matches;
  var siteHeader = document.querySelector('.site-header');

  // ---------------------------------------------------------------------------
  // Séquence d'ouverture : rideau de marque (1ʳᵉ visite de la session) puis héros
  // ---------------------------------------------------------------------------
  var startIntro = function () { document.body.classList.add('is-loaded'); };
  var firstVisit = false;
  try { firstVisit = !sessionStorage.getItem('sjm-intro'); sessionStorage.setItem('sjm-intro', '1'); } catch (e) {}

  if (firstVisit && !reduceMotion && !smallScreen && document.body.classList.contains('page-home')) {
    var curtain = document.createElement('div');
    curtain.className = 'intro-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = '<img src="assets/img/emblem-sjm-white.png" alt="">';
    document.body.appendChild(curtain);
    setTimeout(function () {
      curtain.classList.add('done');
      setTimeout(startIntro, 250);
      setTimeout(function () { curtain.remove(); }, 1100);
    }, 650);
  } else {
    requestAnimationFrame(function () { requestAnimationFrame(startIntro); });
  }

  // ---------------------------------------------------------------------------
  // Menu mobile
  // ---------------------------------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var setMenu = function (open) {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    siteHeader.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('menu-is-open', open);
  };
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1060 && nav.classList.contains('open')) setMenu(false);
    });
  }

  // Sous-menus (survol sur desktop, clic sur mobile/tactile)
  document.querySelectorAll('.nav-caret-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item = btn.closest('.nav-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.nav-caret-btn').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Lien de navigation actif selon l'URL courante
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a.nav-top-link[href]').forEach(function (a) {
    if (a.getAttribute('href') === here) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // ---------------------------------------------------------------------------
  // Éléments d'interface injectés : barre de progression, retour en haut
  // ---------------------------------------------------------------------------
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Retourner en haut de la page');
  backToTop.innerHTML = '<svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24.5"/></svg>' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);
  var ring = backToTop.querySelector('.ring circle');
  var ringLen = 2 * Math.PI * 24.5;
  ring.style.strokeDasharray = ringLen;
  ring.style.strokeDashoffset = ringLen;
  // Barre d'action mobile : les trois gestes clés toujours à portée de pouce
  var mobileBar = document.createElement('nav');
  mobileBar.className = 'mobile-bar';
  mobileBar.setAttribute('aria-label', 'Actions rapides');
  mobileBar.innerHTML =
    '<a href="tel:+237695770000" class="mb-call"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.1a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.6 2Z"/></svg>Appeler</a>' +
    '<a href="https://wa.me/237695770000" class="mb-wa" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>WhatsApp</a>' +
    '<a href="admissions.html" class="mb-apply">Admissions<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
  document.body.appendChild(mobileBar);
  document.body.classList.add('has-mobile-bar');
  var mobileBarThreshold = document.body.classList.contains('page-home') ? 520 : 260;

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // ---------------------------------------------------------------------------
  // Découpage typographique : titres révélés mot par mot (masque)
  // ---------------------------------------------------------------------------
  var splitWords = function (el, wrap) {
    var index = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          // espaces ordinaires uniquement : les insécables (typo française) restent collés
          var parts = child.textContent.split(/([ \t\n\r]+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^[ \t\n\r]+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            frag.appendChild(wrap(part, index++));
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    return index;
  };

  if (!reduceMotion) {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      splitWords(el, function (word, i) {
        var outer = document.createElement('span');
        outer.className = 'split-word';
        var inner = document.createElement('span');
        inner.textContent = word;
        inner.style.transitionDelay = (i * 0.045) + 's';
        outer.appendChild(inner);
        return outer;
      });
    });
  }

  var words = [];
  var manifesto = document.querySelector('[data-words]');
  if (manifesto && !reduceMotion && !smallScreen) {
    splitWords(manifesto, function (word) {
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = word;
      words.push(s);
      return s;
    });
  }

  // ---------------------------------------------------------------------------
  // Apparition au scroll
  // ---------------------------------------------------------------------------
  var revealTargets = document.querySelectorAll('[data-animate], [data-reveal], [data-split], .timeline-item, .step');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // Un élément entièrement masqué par clip-path n'intersecte jamais :
    // pour les rideaux [data-reveal], on observe le conteneur parent.
    var revealMap = new Map();
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          (revealMap.get(entry.target) || [entry.target]).forEach(function (el) { el.classList.add('in'); });
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: smallScreen ? 0.05 : 0.12, rootMargin: smallScreen ? '0px 0px 8% 0px' : '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) {
      var watched = el.hasAttribute('data-reveal') ? el.parentElement : el;
      if (!revealMap.has(watched)) revealMap.set(watched, []);
      revealMap.get(watched).push(el);
      revealObserver.observe(watched);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  // Compteurs animés (chiffres clés)
  var counters = document.querySelectorAll('[data-count]');
  var formatCount = function (n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' '); };
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = formatCount(target) + suffix; return; }
    var duration = 2000;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = formatCount(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { counterObserver.observe(c); });
    } else {
      counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
    }
  }

  // Ligne de progression de la frise chronologique
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    var tlLine = document.createElement('span');
    tlLine.className = 'timeline-progress';
    tlLine.setAttribute('aria-hidden', 'true');
    timeline.prepend(tlLine);
  }

  // ---------------------------------------------------------------------------
  // Boucle de scroll unique (rAF) : header, progression, parallaxe, manifeste,
  // bandeau défilant sensible à la vitesse
  // ---------------------------------------------------------------------------
  var parallaxEls = (reduceMotion || smallScreen) ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var pageHero = document.querySelector('.page-hero');
  var marqueeTrack = document.querySelector('[data-velocity-marquee]');
  var marqueeX = 0, marqueeWidth = 0, marqueeDir = 1, velocity = 0;

  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
    var measureMarquee = function () { marqueeWidth = marqueeTrack.scrollWidth / 2; };
    measureMarquee();
    window.addEventListener('resize', measureMarquee);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureMarquee);
  }

  var lastY = window.scrollY;
  var ticking = false;
  var vh = window.innerHeight;
  window.addEventListener('resize', function () { vh = window.innerHeight; requestTick(); });

  var onScroll = function () {
    var y = window.scrollY;
    var delta = y - lastY;
    var docH = document.documentElement.scrollHeight - vh;
    var progress = docH > 0 ? Math.min(y / docH, 1) : 0;

    // Header : verre dépoli au scroll, masqué en descendant, visible en remontant
    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', y > 24);
      if (!siteHeader.classList.contains('menu-open')) {
        if (delta > 6 && y > 480) siteHeader.classList.add('is-hidden');
        else if (delta < -6 || y < 480) siteHeader.classList.remove('is-hidden');
      }
    }

    progressBar.style.transform = 'scaleX(' + progress + ')';
    backToTop.classList.toggle('visible', y > 700);
    mobileBar.classList.toggle('visible', y > mobileBarThreshold);
    ring.style.strokeDashoffset = ringLen * (1 - progress);

    // Parallaxe
    parallaxEls.forEach(function (el) {
      var factor = parseFloat(el.getAttribute('data-parallax')) || 0;
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var offset = (box.top + box.height / 2 - vh / 2) * factor;
      el.style.setProperty('--py', offset.toFixed(1) + 'px');
    });
    if (pageHero && !reduceMotion && y < vh * 1.2) {
      pageHero.style.setProperty('--py', (y * 0.3).toFixed(1) + 'px');
    }

    // Manifeste : les mots s'allument au fil de la lecture
    if (words.length) {
      var r = manifesto.getBoundingClientRect();
      var start = vh * 0.82, end = vh * 0.38;
      var p = (start - r.top) / ((start - end) + r.height * 0.6);
      p = Math.max(0, Math.min(1, p));
      var lit = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < lit);
    }

    // Timeline
    if (timeline) {
      var tr = timeline.getBoundingClientRect();
      var tp = (vh * 0.6 - tr.top) / tr.height;
      timeline.style.setProperty('--tl', Math.max(0, Math.min(1, tp)).toFixed(3));
    }

    if (delta !== 0) {
      velocity = Math.max(-60, Math.min(60, delta));
      marqueeDir = delta > 0 ? 1 : -1;
    }
    lastY = y;
    ticking = false;
  };
  var requestTick = function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  };
  window.addEventListener('scroll', requestTick, { passive: true });
  onScroll();

  // Bandeau typographique : défilement continu, accéléré par la vitesse de scroll
  if (marqueeTrack && !reduceMotion) {
    var marqueeVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        marqueeVisible = entries[0].isIntersecting;
      }).observe(marqueeTrack);
    }
    var lastT = null;
    var loop = function (t) {
      if (lastT === null) lastT = t;
      var dt = Math.min(t - lastT, 50);
      lastT = t;
      if (marqueeVisible && marqueeWidth) {
        var speed = (0.045 + Math.abs(velocity) * 0.012) * marqueeDir;
        marqueeX -= speed * dt;
        if (marqueeX <= -marqueeWidth) marqueeX += marqueeWidth;
        if (marqueeX > 0) marqueeX -= marqueeWidth;
        marqueeTrack.style.transform = 'translate3d(' + marqueeX.toFixed(2) + 'px,0,0)';
      }
      velocity *= 0.92;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------------------------
  // Boutons magnétiques (souris uniquement)
  // ---------------------------------------------------------------------------
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  // ---------------------------------------------------------------------------
  // Transitions entre les pages (souris uniquement : au doigt, chaque clic doit être instantané)
  // ---------------------------------------------------------------------------
  if (!reduceMotion && finePointer) {
    var leave = document.createElement('div');
    leave.className = 'page-leave';
    leave.setAttribute('aria-hidden', 'true');
    document.body.appendChild(leave);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/i.test(href)) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      leave.classList.add('active');
      setTimeout(function () { location.href = a.href; }, 280);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        leave.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Accordéon (page Admissions / FAQ)
  // ---------------------------------------------------------------------------
  var closeItem = function (item) {
    item.classList.remove('open');
    item.querySelector('.accordion-panel').style.maxHeight = null;
    item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
  };
  var openItem = function (item) {
    var panel = item.querySelector('.accordion-panel');
    item.classList.add('open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
  };
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    var item = trigger.closest('.accordion-item');
    trigger.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    if (item.classList.contains('open')) {
      var p = item.querySelector('.accordion-panel');
      p.style.maxHeight = p.scrollHeight + 'px';
    }
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item.open').forEach(function (o) {
        if (o !== item) closeItem(o);
      });
      if (isOpen) closeItem(item); else openItem(item);
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.accordion-item.open .accordion-panel').forEach(function (p) {
      p.style.maxHeight = p.scrollHeight + 'px';
    });
  });
  if (location.hash) {
    var targetAccordion = document.querySelector('.accordion-item#' + CSS.escape(location.hash.slice(1)));
    if (targetAccordion) {
      document.querySelectorAll('.accordion-item.open').forEach(function (o) {
        if (o !== targetAccordion) closeItem(o);
      });
      openItem(targetAccordion);
    }
  }

  // Onglets (écoles diplômantes / classes prépa)
  document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
    var buttons = tabGroup.querySelectorAll('[data-tab-btn]');
    var panels = tabGroup.querySelectorAll('[data-tab-panel]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab-btn');
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) {
          p.style.display = (p.getAttribute('data-tab-panel') === target) ? 'block' : 'none';
        });
        btn.classList.add('active');
      });
    });
  });

  // Année courante dans le footer
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------------------------------------------------------
  // Bannières rouges : fluide WebGL (soie liquide) qui réagit au curseur
  // Repli : le dégradé CSS reste affiché sans WebGL ou en « réduire les animations »
  // ---------------------------------------------------------------------------
  var FLUID_VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  var FLUID_FS = [
    'precision mediump float;',
    'varying vec2 v;',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uHover;',
    'uniform vec4 uTrail[10];',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
    '  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}',
    'float fbm(vec2 p){float s=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);',
    '  for(int i=0;i<5;i++){s+=a*noise(p);p=m*p;a*=.5;}return s;}',
    'void main(){',
    '  float asp=uRes.x/uRes.y;',
    '  vec2 p=vec2(v.x*asp,v.y);',
    // sillage du curseur : entraînement dans le sens du geste + tourbillon
    '  vec2 sw=vec2(0.);',
    '  for(int i=0;i<10;i++){vec4 t=uTrail[i];vec2 d=p-vec2(t.x*asp,t.y);float g=exp(-dot(d,d)*6.);',
    '    sw+=-t.zw*g*.9+vec2(-d.y,d.x)*g*length(t.zw)*.45;}',
    '  float tm=uTime*.06;',
    '  vec2 q=p*1.15+sw;',
    '  vec2 a=vec2(fbm(q+vec2(0.,tm)),fbm(q+vec2(5.2,1.3)-tm));',
    '  vec2 b=vec2(fbm(q+3.*a+vec2(1.7,9.2)+tm*1.3),fbm(q+3.*a+vec2(8.3,2.8)-tm));',
    '  float f=fbm(q+3.5*b);',
    // palette de marque : bordeaux profond -> rouge SJM -> rouge vif -> reflets rosés
    '  vec3 deep=vec3(.36,.035,.086),red=vec3(.682,.082,.176),bright=vec3(.80,.13,.24),rose=vec3(.97,.76,.79);',
    '  vec3 col=mix(deep,red,smoothstep(.2,.62,f));',
    '  col=mix(col,bright,smoothstep(.55,.82,f)*.75);',
    '  col+=rose*smoothstep(.7,.95,f)*.16*(.5+length(b));',
    // plus sombre à gauche (zone de texte), plus lumineux à droite
    '  col*=mix(.7,1.06,smoothstep(0.,1.,v.x));',
    '  vec2 md=p-vec2(uMouse.x*asp,uMouse.y);',
    '  col+=rose*exp(-dot(md,md)*9.)*.1*uHover;',
    '  gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  var initFluid = function (host) {
    var canvas = document.createElement('canvas');
    canvas.className = 'fluid-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    var compile = function (type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    var vs = compile(gl.VERTEX_SHADER, FLUID_VS);
    var fs = compile(gl.FRAGMENT_SHADER, FLUID_FS);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(prog, 'uRes');
    var uTime = gl.getUniformLocation(prog, 'uTime');
    var uMouse = gl.getUniformLocation(prog, 'uMouse');
    var uHover = gl.getUniformLocation(prog, 'uHover');
    var uTrail = gl.getUniformLocation(prog, 'uTrail');

    host.prepend(canvas);

    var TRAIL = 10;
    var trail = new Float32Array(TRAIL * 4);
    var head = 0;
    var mouse = { x: 0.75, y: 0.5, tx: 0.75, ty: 0.5 };
    var hover = 0, hoverTarget = 0;
    var last = null;
    var w = 0, h = 0;

    var resize = function () {
      var r = host.getBoundingClientRect();
      var scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6; // rendu allégé : le fluide supporte le flou
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = 1 - (e.clientY - r.top) / r.height;
      mouse.tx = x; mouse.ty = y;
      hoverTarget = 1;
      if (last) {
        var vx = (x - last.x) * (r.width / r.height) * 9;
        var vy = (y - last.y) * 9;
        var len = Math.sqrt(vx * vx + vy * vy);
        if (len > 1) { vx /= len; vy /= len; }
        if (len > 0.004) {
          trail[head * 4] = x; trail[head * 4 + 1] = y;
          trail[head * 4 + 2] = vx; trail[head * 4 + 3] = vy;
          head = (head + 1) % TRAIL;
        }
      }
      last = { x: x, y: y };
    });
    host.addEventListener('pointerleave', function () { hoverTarget = 0; last = null; });

    var running = false, visible = false, start = performance.now();
    var frame = function (now) {
      if (!running) return;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      hover += (hoverTarget - hover) * 0.05;
      for (var i = 0; i < TRAIL; i++) { trail[i * 4 + 2] *= 0.945; trail[i * 4 + 3] *= 0.945; }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, hover);
      gl.uniform4fv(uTrail, trail);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(frame);
    };
    var update = function () {
      var should = visible && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(frame); }
      else if (!should) running = false;
    };
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) resize();
      update();
    }).observe(host);
    document.addEventListener('visibilitychange', update);
    requestAnimationFrame(function () { host.classList.add('fluid-ready'); });
  };

  // Fluide réservé aux écrans ≥ 721 px : sur mobile, le dégradé CSS préserve la batterie
  if (!reduceMotion && !smallScreen && 'IntersectionObserver' in window) {
    document.querySelectorAll('.cta-banner').forEach(initFluid);
  }

  // ---------------------------------------------------------------------------
  // Carrousel de citations : snap + compteur + boutons désactivés en bout de course
  // ---------------------------------------------------------------------------
  var track = document.querySelector('.testimonial-track');
  if (track) {
    var prevBtn = document.querySelector('[data-carousel-prev]');
    var nextBtn = document.querySelector('[data-carousel-next]');
    var currentEl = document.querySelector('[data-carousel-current]');
    var totalEl = document.querySelector('[data-carousel-total]');
    var slides = track.children.length;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    if (totalEl) totalEl.textContent = pad(slides);
    var updateCarousel = function () {
      var max = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= max - 4;
      if (currentEl) currentEl.textContent = pad(Math.round(track.scrollLeft / (track.clientWidth + 24)) + 1);
    };
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -(track.clientWidth + 24), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: track.clientWidth + 24, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    track.addEventListener('scroll', function () { requestAnimationFrame(updateCarousel); }, { passive: true });
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  // ---------------------------------------------------------------------------
  // Galerie photo : lightbox plein écran avec navigation clavier (flèches / Echap)
  // ---------------------------------------------------------------------------
  var galleryImages = Array.prototype.slice.call(document.querySelectorAll('.gallery-img'));
  if (galleryImages.length) {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visionneuse de photo');
    lightbox.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Photo précédente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Photo suivante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption class="lightbox-caption"></figcaption></figure>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');
    var currentIndex = 0;
    var lastFocus = null;

    var showImage = function (index) {
      currentIndex = (index + galleryImages.length) % galleryImages.length;
      var target = galleryImages[currentIndex];
      lbImg.src = target.currentSrc || target.src;
      lbImg.alt = target.alt || '';
      lbCaption.textContent = target.alt || '';
    };
    var openLightbox = function (index) {
      lastFocus = document.activeElement;
      showImage(index);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };
    var closeLightbox = function () {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    galleryImages.forEach(function (img, index) {
      img.addEventListener('click', function (e) { e.preventDefault(); openLightbox(index); });
    });
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
    lbNext.addEventListener('click', function () { showImage(currentIndex + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
});

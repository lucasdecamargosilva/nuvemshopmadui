/**
 * Madui Stories Widget
 * Botão flutuante no canto superior esquerdo da imagem do produto.
 * Ao clicar, abre player vertical fullscreen estilo Instagram Stories
 * com barra de progresso, tap pra pausar/play, X pra fechar.
 *
 * Pra adicionar novo vídeo:
 *   1. Upload no Cloudinary (cloud_name: dw4tcszv6)
 *   2. Adicionar entry em MAPPING abaixo com public_id + matches
 */
(function () {

    // ─── SEO BACKLINK BADGE (mini logo discreto pro crawler do Google) ───
    (function() {
        function injectPLBadge() {
            try {
                if (document.querySelector('.pl-seo-badge')) return;
                var path = window.location.pathname;
                var isProduct = path.includes('/produto/') || path.includes('/produtos/') || path.includes('/products/') || path.includes('/p/') || document.querySelector('meta[property="og:type"][content="product"]');
                if (!isProduct) return;
                var b = document.createElement('div');
                b.className = 'pl-seo-badge';
                b.style.cssText = 'text-align:center;padding:4px 0;margin:0;opacity:0.5;line-height:1;';
                var a = document.createElement('a');
                a.href = 'https://provoulevou.com.br?utm_source=widget&utm_medium=lojista&utm_campaign=madui';
                a.target = '_blank';
                a.rel = 'noopener';
                a.title = 'Provador Virtual com IA por Provou Levou';
                a.style.cssText = 'display:inline-block;text-decoration:none;border:0;outline:0;';
                var img = document.createElement('img');
                img.src = 'https://i.ibb.co/MD3B4FQf/Logo-provou-preto-1.png';
                img.alt = 'Provador Virtual com IA por Provou Levou';
                img.style.cssText = 'height:12px;width:auto;border:0;display:block;';
                a.appendChild(img);
                b.appendChild(a);
                document.body.appendChild(b);
            } catch(e) {}
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectPLBadge);
        else injectPLBadge();
        setTimeout(injectPLBadge, 2500);
    })();


  'use strict';

  if (window.__MADUI_STORIES__) return;
  window.__MADUI_STORIES__ = true;

  var CLOUD_NAME = 'dw4tcszv6';

  // ======== MAPPING (1 item por vídeo, multiplos `matches` se 1 vídeo serve vários produtos) ========
  var MAPPING = [
    {
      public_id: 'Conjunto_Equilíbrio_Chocolate_1_mdgi4p',
      label: 'Conjunto Equilíbrio Chocolate',
      matches: [
        'calça legging sculpt cintura alta - chocolate',
        'top recorte sculpt chocolate'
      ]
    }
  ];

  // ============ Helpers ============
  function normalize(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Cloudinary transformations:
  //   bolinha = preview pequeno em loop (240px de largura, qualidade eco) -> ~0.7MB
  //   fullscreen = vídeo principal (720px, qualidade boa)                -> ~3MB
  // Original sem transformação tem ~71MB; jamais usar.
  function videoUrl(publicId, variant) {
    var encoded = encodeURIComponent(publicId).replace(/%2F/g, '/');
    var transform = variant === 'thumb'
      ? 'f_auto,q_auto:eco,w_240'
      : 'f_auto,q_auto:good,w_720';
    return 'https://res.cloudinary.com/' + CLOUD_NAME + '/video/upload/' + transform + '/' + encoded + '.mp4';
  }

  function isProductPage() {
    return !!document.querySelector('h1.js-product-name');
  }

  function findMatch() {
    var h1 = document.querySelector('h1.js-product-name');
    if (!h1) return null;
    var title = normalize(h1.textContent);
    for (var i = 0; i < MAPPING.length; i++) {
      var entry = MAPPING[i];
      for (var j = 0; j < entry.matches.length; j++) {
        if (title.indexOf(normalize(entry.matches[j])) !== -1) return entry;
      }
    }
    return null;
  }

  // Tiny DOM helper: el('div.foo', {attr:val}, [children])
  function el(tag, attrs, children) {
    var parts = tag.split('.');
    var node = document.createElementNS(parts[0] === 'svg' || parts[0] === 'use' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml', parts[0]);
    for (var i = 1; i < parts.length; i++) node.classList.add(parts[i]);
    if (attrs) {
      for (var k in attrs) {
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'on') for (var ev in attrs.on) node.addEventListener(ev, attrs.on[ev]);
        else node.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      for (var c = 0; c < children.length; c++) {
        if (children[c]) node.appendChild(children[c]);
      }
    }
    return node;
  }

  function svg(attrs, paths) {
    var s = el('svg', Object.assign({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs || {}));
    for (var i = 0; i < paths.length; i++) {
      var p = paths[i];
      var node = el(p.tag);
      for (var a in p.attrs) node.setAttribute(a, p.attrs[a]);
      s.appendChild(node);
    }
    return s;
  }

  // ============ Styles ============
  function injectStyles() {
    if (document.getElementById('madui-stories-style')) return;
    var css = `
      .ms-trigger {
        position: absolute; top: 16px; left: 16px; z-index: 50;
        width: 96px; height: 96px; border-radius: 50%; padding: 3px;
        background: linear-gradient(135deg, #d97757 0%, #b54a3e 50%, #6b2a1f 100%);
        cursor: pointer; box-shadow: 0 6px 22px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
        animation: ms-pulse 2.6s infinite ease-out;
        border: none;
      }
      @keyframes ms-pulse {
        0%,100% { transform: scale(1); box-shadow: 0 6px 22px rgba(0,0,0,0.25); }
        50% { transform: scale(1.05); box-shadow: 0 8px 28px rgba(217, 119, 87, 0.45); }
      }
      .ms-trigger-inner {
        width: 100%; height: 100%; border-radius: 50%; background: #000;
        display: block; overflow: hidden; position: relative;
      }
      .ms-trigger-video {
        position: absolute; inset: 0;
        width: 100%; height: 100%; object-fit: cover;
        background: #000; display: block;
      }
      .ms-trigger-audio-badge {
        position: absolute; bottom: 4px; right: 4px;
        width: 24px; height: 24px; border-radius: 50%;
        background: rgba(0,0,0,0.55);
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
      }
      .ms-trigger-audio-badge svg {
        width: 13px; height: 13px; color: #fff;
        fill: none; stroke: currentColor;
      }
      .ms-trigger-label {
        position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
        margin-top: 8px; font-size: 10px; font-weight: 600; color: #6b2a1f;
        text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap;
        background: rgba(255,255,255,0.92); padding: 3px 10px; border-radius: 999px;
        pointer-events: none;
      }
      .ms-overlay {
        position: fixed; inset: 0; z-index: 999999;
        background: #000; display: none;
        animation: ms-fade-in .25s ease-out;
      }
      .ms-overlay.open { display: block; }
      @keyframes ms-fade-in { from{opacity:0} to{opacity:1} }
      .ms-stage {
        position: relative; width: 100%; height: 100%;
        max-width: 480px; margin: 0 auto;
        background: #000; overflow: hidden;
        display: flex; align-items: center; justify-content: center;
      }
      .ms-video {
        width: 100%; height: 100%; object-fit: cover; background: #000;
      }
      .ms-progress {
        position: absolute; top: 10px; left: 12px; right: 12px;
        height: 3px; background: rgba(255,255,255,0.3);
        border-radius: 2px; overflow: hidden; z-index: 5;
      }
      .ms-progress-fill {
        height: 100%; width: 0%; background: #fff;
        transition: width 0.1s linear;
      }
      .ms-header {
        position: absolute; top: 22px; left: 12px; right: 12px;
        z-index: 5; display: flex; align-items: center; gap: 10px;
        color: #fff; pointer-events: none;
      }
      .ms-header-title {
        font-size: 13px; font-weight: 600;
        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
      }
      .ms-close {
        position: absolute; top: 18px; right: 14px; z-index: 6;
        width: 36px; height: 36px; border-radius: 50%;
        background: rgba(0,0,0,0.4); border: none; color: #fff;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        font-size: 22px; line-height: 1;
      }
      .ms-close:hover { background: rgba(0,0,0,0.65); }
      .ms-mute-toggle {
        position: absolute; bottom: 26px; right: 16px; z-index: 6;
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(0,0,0,0.5); border: none; color: #fff;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
      }
      .ms-mute-toggle svg { width: 20px; height: 20px; }
      .ms-mute-hint {
        position: absolute; bottom: 78px; right: 16px; z-index: 6;
        background: rgba(0,0,0,0.6); color: #fff;
        font-size: 11px; padding: 6px 10px; border-radius: 6px;
        pointer-events: none;
        animation: ms-hint-fade 3.2s forwards;
      }
      @keyframes ms-hint-fade {
        0% { opacity: 0; transform: translateY(6px); }
        15%,80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-4px); }
      }
      .ms-tap-zone {
        position: absolute; top: 0; bottom: 0; width: 33%; z-index: 4;
      }
      .ms-tap-left  { left: 0; }
      .ms-tap-right { right: 0; }
      .ms-tap-center{ left: 33%; right: 33%; }
      .ms-paused-icon {
        position: absolute; inset: 0; z-index: 5;
        display: none; align-items: center; justify-content: center;
        pointer-events: none;
      }
      .ms-overlay.is-paused .ms-paused-icon { display: flex; }
      .ms-paused-icon svg {
        width: 64px; height: 64px;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
        color: rgba(255,255,255,0.85);
        fill: currentColor;
      }
    `;
    var s = document.createElement('style');
    s.id = 'madui-stories-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ============ Trigger ============
  function injectTrigger(matchedEntry) {
    var gallery = document.querySelector('.product-images-slider');
    if (!gallery) return;
    if (gallery.querySelector('.ms-trigger')) return;
    if (getComputedStyle(gallery).position === 'static') {
      gallery.style.position = 'relative';
    }

    var loopVideo = el('video.ms-trigger-video', {
      src: videoUrl(matchedEntry.public_id, 'thumb'),
      autoplay: '', muted: '', loop: '', playsinline: '',
      'webkit-playsinline': '',
      preload: 'auto'
    });
    loopVideo.muted = true;
    loopVideo.defaultMuted = true;

    var inner = el('span.ms-trigger-inner', null, [loopVideo]);
    var label = el('span.ms-trigger-label', { text: 'Ver vídeo' });
    var btn = el('button.ms-trigger', {
      type: 'button',
      'aria-label': 'Ver vídeo do produto',
      on: { click: function () { openStory(matchedEntry); } }
    }, [inner, label]);
    gallery.appendChild(btn);

    // Some browsers need explicit play() call to start autoplay
    var p = loopVideo.play();
    if (p && p.catch) p.catch(function () {});
  }

  // ============ Story Player ============
  var overlay, video, progressFill, muteBtn, hintEl, headerTitleEl, stageEl;

  function makeMuteIcon(isMuted) {
    if (isMuted) {
      return svg({}, [
        { tag: 'polygon', attrs: { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' } },
        { tag: 'line', attrs: { x1: '23', y1: '9', x2: '17', y2: '15' } },
        { tag: 'line', attrs: { x1: '17', y1: '9', x2: '23', y2: '15' } }
      ]);
    }
    return svg({}, [
      { tag: 'polygon', attrs: { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' } },
      { tag: 'path', attrs: { d: 'M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07' } }
    ]);
  }

  function setMuteIcon(isMuted) {
    if (!muteBtn) return;
    while (muteBtn.firstChild) muteBtn.removeChild(muteBtn.firstChild);
    muteBtn.appendChild(makeMuteIcon(isMuted));
    muteBtn.setAttribute('aria-label', isMuted ? 'Ativar som' : 'Mutar');
  }

  function buildOverlay() {
    if (overlay) return;

    progressFill = el('div.ms-progress-fill');
    var progress = el('div.ms-progress', null, [progressFill]);

    headerTitleEl = el('span.ms-header-title');
    var header = el('div.ms-header', null, [headerTitleEl]);

    var closeBtn = el('button.ms-close', {
      'aria-label': 'Fechar', text: '×',
      on: { click: closeStory }
    });

    video = el('video.ms-video', { playsinline: '', muted: '', preload: 'none' });

    var pausedIconSvg = svg({}, [{ tag: 'polygon', attrs: { points: '6 4 20 12 6 20 6 4' } }]);
    var pausedIcon = el('div.ms-paused-icon', null, [pausedIconSvg]);

    muteBtn = el('button.ms-mute-toggle', {
      'aria-label': 'Ativar som',
      on: { click: toggleMute }
    });
    setMuteIcon(true);

    var tapLeft = el('div.ms-tap-zone.ms-tap-left', {
      on: { click: function () { video.currentTime = Math.max(0, video.currentTime - 5); } }
    });
    var tapCenter = el('div.ms-tap-zone.ms-tap-center', { on: { click: togglePlay } });
    var tapRight = el('div.ms-tap-zone.ms-tap-right', {
      on: { click: function () {
        if (video.duration && video.currentTime < video.duration - 0.5) {
          video.currentTime = Math.min(video.duration, video.currentTime + 5);
        } else {
          closeStory();
        }
      } }
    });

    stageEl = el('div.ms-stage', null, [
      progress, header, closeBtn, video, pausedIcon, muteBtn, tapLeft, tapCenter, tapRight
    ]);
    overlay = el('div.ms-overlay', null, [stageEl]);
    document.body.appendChild(overlay);

    video.addEventListener('ended', closeStory);
    video.addEventListener('timeupdate', updateProgress);

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeStory();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    });
  }

  function openStory(entry) {
    buildOverlay();
    headerTitleEl.textContent = entry.label || '';
    video.src = videoUrl(entry.public_id);
    video.muted = true;
    progressFill.style.width = '0%';
    overlay.classList.add('open');
    overlay.classList.remove('is-paused');
    document.body.style.overflow = 'hidden';
    showHint('Toque pra ativar o som');
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    setMuteIcon(true);
  }

  function closeStory() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.classList.remove('is-paused');
    document.body.style.overflow = '';
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
  }

  function togglePlay() {
    if (!video) return;
    if (video.paused) {
      video.play();
      overlay.classList.remove('is-paused');
    } else {
      video.pause();
      overlay.classList.add('is-paused');
    }
  }

  function toggleMute() {
    video.muted = !video.muted;
    setMuteIcon(video.muted);
  }

  function showHint(text) {
    if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
    hintEl = el('div.ms-mute-hint', { text: text });
    stageEl.appendChild(hintEl);
    setTimeout(function () {
      if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
    }, 3300);
  }

  function updateProgress() {
    if (!video.duration) return;
    var pct = (video.currentTime / video.duration) * 100;
    progressFill.style.width = pct + '%';
  }

  // ============ Boot ============
  function boot() {
    if (!isProductPage()) return;
    var entry = findMatch();
    if (!entry) return;
    injectStyles();
    injectTrigger(entry);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  var mo = new MutationObserver(function () {
    if (isProductPage() && !document.querySelector('.ms-trigger')) {
      var entry = findMatch();
      if (entry) injectTrigger(entry);
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

(function () {
    function isValidBRPhone(nums) {
        function setErr(msg) {
            var el = document.getElementById('q-phone-error');
            if (el) el.textContent = msg;
        }
        if (nums.length < 10) { setErr('N\u00famero incompleto — informe DDD + n\u00famero'); return false; }
        if (nums.length > 11) { setErr('N\u00famero longo demais'); return false; }
        if (!/^[1-9][1-9]/.test(nums)) { setErr('DDD inv\u00e1lido'); return false; }
        if (nums.length === 11 && nums[2] !== '9') { setErr('Celular deve come\u00e7ar com 9 ap\u00f3s o DDD'); return false; }
        var local = nums.length === 11 ? nums.slice(3) : nums.slice(2);
        if (/^(\d)\1+$/.test(local)) { setErr('N\u00famero n\u00e3o parece real — confira'); return false; }
        if (/(\d)\1{5,}/.test(local)) { setErr('N\u00famero n\u00e3o parece real — confira'); return false; }
        if (/^(?:01234567|12345678|23456789|34567890|98765432|87654321|76543210|0123456789|1234567890)/.test(local)) { setErr('N\u00famero n\u00e3o parece real — confira'); return false; }
        return true;
    }


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
                a.title = 'Provador Virtual de Roupas — Provou Levou';
                a.style.cssText = 'display:inline-block;text-decoration:none;border:0;outline:0;';
                var img = document.createElement('img');
                img.src = 'https://i.ibb.co/MD3B4FQf/Logo-provou-preto-1.png';
                img.alt = 'Provador Virtual de Roupas — Provou Levou';
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


    // ─── LOG HELPER ───────────────────────────────────────────────────────────────
    const LOG = {
        info: (...a) => console.log('[PL]', ...a),
        ok: (...a) => console.log('[PL✓]', ...a),
        warn: (...a) => console.warn('[PL⚠]', ...a),
        error: (...a) => console.error('[PL✗]', ...a),
        group: (...a) => console.group('[PL]', ...a),
        end: () => console.groupEnd(),
    };

    // ===============================================
    // 0. CHUMBAR A API KEY AQUI DIRETO NO CÓDIGO
    // ===============================================
    const apiKey = "pl_live_fe5eeec96552b88148c104c106ec51ff7d07e65411e9a11874b66fcf0ea342a7";
    window.PROVOU_LEVOU_API_KEY = apiKey;

    const WEBHOOK_PROVA = 'https://n8n.segredosdodrop.com/webhook/quantic-materialize';
    const LOGO_URL = 'https://acdn-us.mitiendanube.com/stores/005/736/640/themes/common/logo-164572917-1751035330-b4cfebbd24f987283d6cc623102b30db1751035330-640-0.webp';

    const WEBHOOK_LIMITE = 'https://n8n.segredosdodrop.com/webhook/limite-provas';
    const DAILY_LIMIT = 3;

    LOG.info('Script carregado — Provador Virtual MADUI (Tray)');

    // ─── TABELAS DE TAMANHOS ──────────────────────────────────────────────────────

    const SIZES_TOP = ['XXP', 'XP', 'P', 'M', 'G', 'XG', 'XXG', '3XG', '4XG', '5XG'];
    const SIZES_BOTTOM = ['36/XXP', '38/XP', '40/P', '42/M', '44/G', '46/XG', '48/XXG', '50/3XG', '52/4XG', '54/5XG'];
    const SIZES_BOTTOM_SW = ['XXP', 'XP', 'P', 'M', 'G', 'XG', 'XXG', '3XG', '4XG', '5XG'];

    const GRADE = {
        regular: [49, 51, 54, 57, 61, 62, 64, 66, 70, 73],
        oversized: [58, 60, 62, 64, 66, 70, 73, 76, 79, 83],
        oversizedSS: [58, 61, 63, 67, 70, 74, 78, 82, 87, 92],
        hoodie: [50, 53, 55, 58, 62, 65, 69, 74, 79, 83],
        boxyHoodie: [61, 77, 78, 79, 80, 81, 82, 83, 84, 85],
        puffer: [53, 56, 59, 61, 70, 74, 78, 82, 86, 90],
        vest: [52, 55, 57, 59, 63, 66, 70, 72, 76, 82],
        boxyHenley: [54, 56, 58, 64, 66, 68, 70, 76, 78, 84],
        bottomTailoring: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        bottomSweat: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        underwear: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        quadrilTailoring: [48, 50, 52, 56, 58, 60, 62, 64, 66, 68],
        quadrilSweat: [48, 50, 52, 54, 56, 58, 60, 62, 64, 66],
        quadrilUnderwear: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
    };

    // ─── ESTIMATIVA DE MEDIDAS FEMININAS (PESO/ALTURA → CINTURA/BUSTO/QUADRIL) ─
    function estimarMedidasFemininas(altura, peso) {
        if (altura < 3) altura *= 100;
        const imc = peso / Math.pow(altura / 100, 2);
        const dh = altura - 165; // diferença da altura média
        const cintura = 2.1 * imc + 0.05 * dh + 24;
        const busto = 2.05 * imc + 0.08 * dh + 43;
        const quadril = 1.8 * imc + 0.06 * dh + 58;
        LOG.info('Estimativa feminina: IMC=' + imc.toFixed(1) + ' → cintura=' + cintura.toFixed(1) + ' busto=' + busto.toFixed(1) + ' quadril=' + quadril.toFixed(1));
        return { cintura, busto, quadril };
    }

    // ─── TABELA DE MEDIDAS MADUI (CALÇAS) ─────────────────────────────
    // Cada entrada: { label, cintura: [min, max], quadril: [min, max] }
    const MADUI_CALCA_SIZES = [
        { label: 'P (38/40)', cintura: [68, 82], quadril: [95, 104] },
        { label: 'M (42)', cintura: [83, 94], quadril: [105, 116] },
        { label: 'G (44/46)', cintura: [95, 106], quadril: [117, 122] },
        { label: 'GG (46/48)', cintura: [107, 114], quadril: [122, 125] },
    ];

    function calcMaduiCalca(cintura, quadril) {
        function findIdx(table, field, val) {
            for (let i = 0; i < table.length; i++) {
                if (val >= table[i][field][0] && val <= table[i][field][1]) return i;
            }
            return val < table[0][field][0] ? 0 : table.length - 1;
        }
        const idxC = findIdx(MADUI_CALCA_SIZES, 'cintura', cintura);
        const idxQ = findIdx(MADUI_CALCA_SIZES, 'quadril', quadril);
        const finalSize = MADUI_CALCA_SIZES[Math.max(idxC, idxQ)];
        LOG.info('Recomendação calça MADUI: cintura=' + cintura + '(idx' + idxC + ') quadril=' + quadril + '(idx' + idxQ + ') → final: ' + finalSize.label);
        return finalSize.label;
    }

    // ─── TABELA DE MEDIDAS MADUI (BLUSAS / BODY) ────────────────────
    const MADUI_BLUSA_SIZES = [
        { label: 'P (38/40)', cintura: [68, 78], busto: [86, 92], quadril: [99, 106] },
        { label: 'M (42)', cintura: [79, 87], busto: [93, 107], quadril: [107, 114] },
        { label: 'G (44/46)', cintura: [88, 96], busto: [108, 118], quadril: [115, 122] },
        { label: 'GG (46/48)', cintura: [97, 108], busto: [119, 125], quadril: [123, 130] },
    ];

    function calcMaduiBlusa(altura, peso) {
        const med = estimarMedidasFemininas(altura, peso);
        function findIdx(table, field, val) {
            for (let i = 0; i < table.length; i++) {
                if (val >= table[i][field][0] && val <= table[i][field][1]) return i;
            }
            return val < table[0][field][0] ? 0 : table.length - 1;
        }
        const idxC = findIdx(MADUI_BLUSA_SIZES, 'cintura', med.cintura);
        const idxB = findIdx(MADUI_BLUSA_SIZES, 'busto', med.busto);
        const idxQ = findIdx(MADUI_BLUSA_SIZES, 'quadril', med.quadril);
        const finalIdx = Math.max(idxC, idxB, idxQ);
        const finalSize = MADUI_BLUSA_SIZES[finalIdx];
        LOG.info('Recomendação blusa MADUI: cintura=' + med.cintura.toFixed(1) + '(idx' + idxC + ') busto=' + med.busto.toFixed(1) + '(idx' + idxB + ') quadril=' + med.quadril.toFixed(1) + '(idx' + idxQ + ') → final: ' + finalSize.label);
        return finalSize.label;
    }

    // Tipo de produto detectado: 'calca', 'blusa' ou null
    let marianaType = null;

    // ─── DETECÇÃO DO PRODUTO ──────────────────────────────────────────────────────

    function detectProduct(name) {
        const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const n = norm(name);
        LOG.group('Detecção de produto');
        LOG.info('Nome: "' + name + '" → "' + n + '"');

        // Pega categoria da Tray via dataLayer (ex: "Jaqueta", "Calça", "Blusas")
        let cat = '';
        try {
            if (window.dataLayer) {
                for (let i = 0; i < window.dataLayer.length; i++) {
                    if (window.dataLayer[i] && window.dataLayer[i].category) {
                        cat = norm(window.dataLayer[i].category);
                        break;
                    }
                }
            }
        } catch (e) { }
        LOG.info('Categoria Tray: "' + (cat || '(não encontrada)') + '"');

        // Concatena categoria + nome para busca
        const txt = cat + ' ' + n;
        LOG.info('Texto para match: "' + txt + '"');

        let result;
        // Calça, Legging, Bermuda, Short → cintura e quadril
        if (/\bcalca|legging|flare|skinny|pantalona|wide.?leg|jogger|bermuda|shorts?\b/.test(txt)) {
            result = { category: 'bottom', fit: 'mariana_calca' };
        }
        // Tudo que não é calça → peso e altura (Jaqueta, Blusas, Body, Vestidos, Macações, etc.)
        else {
            result = { category: 'top', fit: 'mariana_blusa' };
        }
        LOG.ok('Resultado:', JSON.stringify(result), '→ marianaType será:', result.fit === 'mariana_calca' ? 'calca' : 'blusa');
        LOG.end();
        return result;
    }

    // ─── CÁLCULOS DE MEDIDAS ──────────────────────────────────────────────────────

    function estimarTorax(altura, peso) {
        if (altura < 3) altura *= 100;
        let circ = 0.65 * peso + 56;
        const imc = peso / Math.pow(altura / 100, 2);
        if (imc > 30) circ += 4; else if (imc > 25) circ += 2;
        LOG.info('Tórax estimado: ' + circ.toFixed(1) + 'cm  |  IMC: ' + imc.toFixed(1));
        return circ;
    }

    function findClosest(arr, val) {
        let idx = 0, minDiff = Infinity;
        arr.forEach((v, i) => { const d = Math.abs(v - val); if (d < minDiff) { minDiff = d; idx = i; } });
        return idx;
    }

    let recommendedSize = 'M';
    let currentProduct = { category: 'top', fit: 'regular' };

    function calcTop(fit) {
        const altura = parseFloat(document.getElementById('q-h-val').value);
        const peso = parseFloat(document.getElementById('q-w-val').value);
        if (!altura || !peso) return;
        const torax = estimarTorax(altura, peso);
        const folga = { regular: 4, oversized: 8, oversizedSS: 8, hoodie: 6, boxyHoodie: 12, puffer: 10, vest: 5, boxyHenley: 9 };
        const larguraAlvo = torax / 2 + (folga[fit] || 4);
        recommendedSize = SIZES_TOP[findClosest(GRADE[fit], larguraAlvo)];
        LOG.group('Cálculo de tamanho (top)');
        LOG.info('Fit: ' + fit + '  |  Folga: ' + (folga[fit] || 4) + 'cm');
        LOG.info('Largura alvo (meia-tórax + folga): ' + larguraAlvo.toFixed(1) + 'cm');
        LOG.ok('Tamanho recomendado: ' + recommendedSize);
        LOG.end();
        // if (document.getElementById('q-res-letter')) document.getElementById('q-res-letter').innerText = recommendedSize;
    }

    function calcBottom(fit) {
        const cintura = parseFloat(document.getElementById('q-cin-val').value);
        const quadril = parseFloat(document.getElementById('q-quad-val').value);
        if (!cintura || !quadril) return;
        let gradeC, gradeQ, sizes;
        if (fit === 'tailoring') { gradeC = GRADE.bottomTailoring; gradeQ = GRADE.quadrilTailoring; sizes = SIZES_BOTTOM; }
        else if (fit === 'underwear') { gradeC = GRADE.underwear; gradeQ = GRADE.quadrilUnderwear; sizes = SIZES_BOTTOM_SW; }
        else { gradeC = GRADE.bottomSweat; gradeQ = GRADE.quadrilSweat; sizes = SIZES_BOTTOM_SW; }
        const idxC = findClosest(gradeC, cintura / 2);
        const idxQ = findClosest(gradeQ, quadril / 2);
        recommendedSize = sizes[Math.max(idxC, idxQ)];
        LOG.group('Cálculo de tamanho (bottom)');
        LOG.info('Fit: ' + fit + '  |  Cintura: ' + cintura + 'cm  |  Quadril: ' + quadril + 'cm');
        LOG.info('Índice cintura: ' + idxC + '  |  Índice quadril: ' + idxQ + '  →  usado: ' + Math.max(idxC, idxQ));
        LOG.ok('Tamanho recomendado: ' + recommendedSize);
        LOG.end();
        // if (document.getElementById('q-res-letter')) document.getElementById('q-res-letter').innerText = recommendedSize;
    }

    function calculateFinalSize() {
        if (marianaType === 'calca') {
            const cintura = parseFloat(document.getElementById('q-cin-val')?.value);
            const quadril = parseFloat(document.getElementById('q-quad-val')?.value);
            if (!cintura || !quadril) return null;
            recommendedSize = calcMaduiCalca(cintura, quadril);
            return recommendedSize;
        }
        if (marianaType === 'blusa') {
            const altura = parseFloat(document.getElementById('q-blusa-h-val')?.value);
            const peso = parseFloat(document.getElementById('q-blusa-w-val')?.value);
            if (!altura || !peso) return null;
            recommendedSize = calcMaduiBlusa(altura, peso);
            return recommendedSize;
        }
        return null;
    }

    // ─── LOCK / UNLOCK SCROLL DA PÁGINA ──────────────────────────────────────────

    let scrollY = 0;

    function lockBodyScroll() {
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflowY = 'scroll';
    }

    function unlockBodyScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
    }

    // ─── ESTILOS ──────────────────────────────────────────────────────────────────

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        :root {
            --c-primary: #000000;
            --c-bg: #ffffff;
            --c-border: #000000;
            --c-gray: #fafafa;
            --c-text: #000000;
            --c-text-light: #888888;
            --c-gold: #000000;
            --font-display: 'Bebas Neue', sans-serif;
            --font-body: 'DM Sans', sans-serif;
        }

        @keyframes q-shake { 0%,50%,100%{transform:rotate(0deg)} 10%,30%{transform:rotate(-10deg)} 20%,40%{transform:rotate(10deg)} }
        .q-btn-trigger-ia {
            position: absolute; top: 60px; left: 15px; z-index: 10;
            background: none; border: none; padding: 0; cursor: pointer;
            width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.18));
            animation: q-shake 3s infinite;
        }
        .q-btn-trigger-ia:hover { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.28)); animation-play-state: paused; transform: scale(1.1) !important; }
        .q-btn-trigger-ia img { width: 100%; height: 100%; object-fit: contain; }

        .pl-buy-btn-container { width: 100%; position: relative; margin: 35px auto 15px; max-width: 200px; }
        .pl-btn-provador-buy {
            display: flex !important; align-items: center !important; justify-content: center !important; gap: 10px !important;
            width: 100% !important; height: 45px !important;
            background-color: #ffffff !important; color: #000000 !important;
            border: 1px solid #000000 !important; border-radius: 0 !important;
            font-family: 'Work Sans', sans-serif !important; font-size: 10px !important;
            font-weight: 700 !important; text-transform: uppercase !important;
            letter-spacing: 2px !important; cursor: pointer !important; transition: all 0.3s ease !important;
        }
        .pl-btn-provador-buy:hover { background-color: #000000 !important; color: #ffffff !important; }

        @keyframes q-modal-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        #q-modal-ia {
            display: none; position: fixed; inset: 0;
            background: rgba(240,238,235,0.96);
            z-index: 999999; align-items: center; justify-content: center;
            font-family: var(--font-body);
        }
        .q-card-ia {
            background: var(--c-bg); width: 100%; max-width: 480px;
            padding: 0; position: relative; color: var(--c-text);
            border: none; max-height: 94vh;
            display: flex; flex-direction: column; overflow: hidden;
            box-shadow: 0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
            animation: q-modal-in 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .q-content-scroll { padding: 28px 28px 32px; overflow-y: auto; flex: 1; text-align: center; display: flex; flex-direction: column; gap: 20px; }
        .q-close-ia {
            position: absolute; top: 18px; right: 18px;
            background: none; border: none; color: var(--c-text-light);
            cursor: pointer; font-size: 26px; z-index: 100; font-weight: 300; line-height: 1; padding: 4px 6px;
        }
        .q-close-ia:hover { color: var(--c-text); }

        #q-header-provador { text-align: center; display: flex; flex-direction: column; gap: 10px; align-items: center; border-bottom: 1px solid var(--c-gold); padding-bottom: 20px; }
        #q-header-provador h1 { margin: 0; font-family: var(--font-display); font-size: 26px; letter-spacing: 4px; text-transform: uppercase; color: var(--c-text); font-weight: 400; line-height: 1; }

        #q-step-upload { display: flex; flex-direction: column; gap: 16px; }

        .q-lead-form { display: flex; flex-direction: column; gap: 16px; }
        .q-group { flex: 1; }
        .q-group label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--c-text-light); margin-bottom: 8px; }
        .q-input-row { display: flex; gap: 12px; }
        .q-lead-form .q-input,
        .q-lead-form input[type="text"].q-input,
        .q-lead-form input[type="tel"].q-input,
        .q-lead-form input[type="number"].q-input {
            width: 100% !important; height: 52px !important; padding: 0 16px !important;
            border: none !important; border-bottom: 1.5px solid #e8e8e8 !important;
            font-size: 16px !important; font-family: var(--font-body) !important;
            background: var(--c-gray) !important; color: var(--c-text) !important;
            outline: none !important; box-sizing: border-box !important;
            border-radius: 0 !important; -webkit-appearance: none !important; appearance: none !important;
            margin: 0 !important; text-align: center !important;
        }
        .q-lead-form .q-input:focus { border-bottom-color: var(--c-gold) !important; background: #fff !important; }
        .q-input-hint { font-size: 10px; color: var(--c-text-light); margin-top: 4px; }
        .q-status-msg { display: none; font-size: 10px; color: #ef4444; font-weight: 600; margin-top: 4px; }

        .q-provas-msg:empty { display: none; }
        .q-provas-msg {
            font-size: 13px; margin-top: 10px; letter-spacing: 0.3px;
            color: var(--c-text, #1a1a1a); font-weight: 500;
            background: var(--c-surface, #f7f6f4);
            border: 1px solid var(--c-border, #e8e8e8);
            border-radius: 6px;
            padding: 10px 14px;
            text-align: center;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .q-provas-msg.is-warn {
            color: #ef4444;
            background: rgba(239,68,68,0.08);
            border-color: rgba(239,68,68,0.3);
            font-weight: 600;
        }


        .q-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 16px 0; border-top: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; }
        .q-tip-item { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--c-text-light); }
        .q-tip-item i { color: var(--c-gold); font-size: 20px; }

        #q-trigger-upload { width: 120px; height: 160px; border: 2px dashed #e8e8e8; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: var(--c-gray); transition: 0.2s; }
        #q-trigger-upload:hover { border-color: var(--c-gold); }
        #q-trigger-upload i { font-size: 32px; color: var(--c-gold); margin-bottom: 8px; }
        #q-trigger-upload span { font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
        #q-pre-view { width: 120px; height: 160px; overflow: hidden; border: 1px solid #e8e8e8; border-radius: 4px; }
        #q-pre-img { width: 100%; height: 100%; object-fit: cover; }


        .q-btn-black {
            background: var(--c-text); color: var(--c-bg);
            border: none; width: 100%; padding: 16px;
            font-family: var(--font-display); font-size: 18px; font-weight: 400;
            letter-spacing: 3px; text-transform: uppercase; cursor: pointer; margin-top: 4px; transition: 0.3s; box-sizing: border-box;
        }
        .q-btn-black:disabled { background: #ccc; cursor: not-allowed; }
        .q-btn-black:not(:disabled):hover { opacity: 0.82; }
        .q-btn-buy { background: var(--c-text); color: var(--c-bg); border: none; width: 100%; padding: 18px; font-family: var(--font-display); font-size: 18px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; margin-bottom: 12px; transition: 0.3s; }
        .q-btn-buy:hover { opacity: 0.82; }
        .q-btn-outline { background: var(--c-bg); color: var(--c-text); border: 1.5px solid #e8e8e8; width: 100%; padding: 16px; font-family: var(--font-display); font-size: 18px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: 0.3s; box-sizing: border-box; }
        .q-btn-outline:hover { border-color: var(--c-text); }

        .q-powered-footer { background: var(--c-gray); padding: 14px 20px; display: flex; align-items: center; justify-content: center; gap: 9px; flex-shrink: 0; border-top: 1px solid var(--c-gold); text-decoration: none; }
        .q-powered-footer span { font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--c-text-light); }
        .q-quantic-logo { height: 22px; opacity: 0.7; }

        @keyframes q-slide { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        @keyframes q-pulse-text { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes q-alt-show { 0%,5%{opacity:0;transform:translateY(6px)} 15%,45%{opacity:1;transform:translateY(0)} 55%,100%{opacity:0;transform:translateY(-6px)} }
        @keyframes q-alt-hide { 0%,55%{opacity:0;transform:translateY(6px)} 65%,95%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }

        #q-step-confirm { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 200; display: none; align-items: center; justify-content: center; padding: 20px; }
        .q-confirm-box { background: #fff; width: 100%; max-width: 380px; padding: 40px 30px; border: 1px solid #e8e8e8; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2); border-radius: 4px; }

        @media (max-width: 767px) {
            .q-warning-back-front { font-size: 11px !important; padding: 10px 8px !important; line-height: 1.45 !important; }
        }

        /* ── Result (mobile-first, layout Cacife) ── */
        #q-step-result { display: none; flex-direction: column; gap: 0; align-items: stretch; }
        .q-res-title { display: block !important; font-family: var(--font-display); font-size: 18px; letter-spacing: 3px; text-transform: uppercase; color: var(--c-text); padding: 18px 28px 14px; margin: 0; border-bottom: 1px solid var(--c-gold); text-align: center; }
        #q-result-img-col { width: 100%; max-height: 65vh; background: var(--c-gray); overflow: hidden; display: flex; align-items: center; justify-content: center; border: none !important; margin: 0 !important; }
        #q-result-img-col img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        #q-result-actions-col { display: flex; flex-direction: column; gap: 12px; padding: 20px 28px 0; }
        #q-size-recommendation { text-align: center; padding: 14px 16px; border: 1px solid var(--c-gold); background: #fffaf0; }
        #q-size-recommendation p:first-child { margin: 0 0 4px; font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--c-text-light); }
        #q-rec-size-label { margin: 0; font-family: var(--font-display); font-size: 22px; letter-spacing: 3px; color: var(--c-text); }
        #q-rec-size-desc { margin: 4px 0 0; font-size: 10px; color: var(--c-text-light); line-height: 1.4; }
        .q-res-mobile-only { margin: 0; }

        /* Related products */
        #q-related-products { padding: 0 28px 24px; }
        #q-related-products h4 { font-family: var(--font-display); font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: var(--c-text-light); margin: 18px 0 12px; font-weight: 400; }
        .q-related-grid { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; justify-content: flex-start; }
        .q-related-grid::-webkit-scrollbar { display: none; }
        .q-related-card { flex: 0 0 calc(33% - 7px); min-width: 80px; max-width: 110px; text-decoration: none; color: var(--c-text); display: flex; flex-direction: column; gap: 5px; }
        .q-related-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border: 1px solid #e8e8e8; display: block; }
        .q-related-card-name { font-size: 9.5px; font-weight: 500; line-height: 1.4; color: var(--c-text); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .q-related-card-price { font-size: 10px; font-weight: 700; color: var(--c-gold); }

        @media (min-width: 768px) {
            .q-card-ia.is-result { width: 780px !important; max-width: 90vw !important; max-height: 92vh !important; height: auto !important; }
            .q-card-ia.is-result #q-header-provador { display: none !important; }
            .q-card-ia.is-result .q-content-scroll { padding: 0 !important; overflow-y: auto !important; display: flex !important; flex-direction: column !important; gap: 0 !important; }
            .q-card-ia.is-result #q-step-result { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; width: 100%; align-items: stretch; gap: 0; }
            .q-card-ia.is-result .q-res-title { flex-basis: 100%; order: -1; font-size: 16px; padding: 16px 24px; }
            .q-card-ia.is-result #q-result-img-col { width: 44% !important; min-height: 380px !important; max-height: 80vh !important; border-right: 1px solid var(--c-gold) !important; flex-shrink: 0; }
            .q-card-ia.is-result #q-result-actions-col { width: 56% !important; padding: 28px 24px !important; gap: 12px; overflow-y: auto; }
            .q-card-ia.is-result .q-res-mobile-only { display: flex !important; align-items: center; justify-content: center; gap: 8px; }
            .q-card-ia.is-result .q-close-ia { top: 12px; right: 12px; z-index: 10; }
        }
        #q-step-error { display: none; flex-direction: column; gap: 24px; align-items: center; text-align: center; padding: 52px 28px; }
        #q-step-error h2 { font-family: var(--font-display); font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0; font-weight: 400; }
        #q-step-error p { font-size: 13px; color: var(--c-text-light); margin: 0; line-height: 1.6; }
    `
    const stampImageHTML = `<img src="https://i.ibb.co/4wFQF9pb/provador-tag.webp" alt="Provador Virtual" style="width:100%;height:100%;object-fit:contain;">`;


    const html = `
        <div id="q-modal-ia">
            <div class="q-card-ia">
                <button type="button" class="q-close-ia" id="q-close-btn">&times;</button>
                <div class="q-content-scroll">
                    <div id="q-header-provador">
                        <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Provador Virtual</h1>
                        <div style="margin:0 0 4px;text-align:center;">
                            <img src="${LOGO_URL}" alt="MADUI" style="height:32px;width:auto;display:inline-block;object-fit:contain;" onerror="this.style.display='none'"/>
                        </div>
                    </div>
                    <div id="q-step-upload">
                        <div class="q-lead-form" style="margin-bottom:0;">
                            <div class="q-group">
                                <label>SEU CELULAR</label>
                                <input type="tel" id="q-phone" class="q-input" placeholder="(11) 99999-9999" maxlength="15">
                                <div id="q-phone-error" class="q-status-msg">Insira um n\u00famero v\u00e1lido</div>
                                <div id="q-provas-restantes" class="q-provas-msg"></div>
                            </div>
                            <div id="q-calca-fields">
                                <p style="margin:0 0 8px;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--c-text-light);text-align:center;">Suas medidas (recomenda\u00e7\u00e3o de tamanho)</p>
                                <div style="display:flex;gap:12px;">
                                    <div class="q-group" style="flex:1;">
                                        <label style="font-size:11px;font-weight:600;margin-bottom:4px;display:block;">Cintura (cm)</label>
                                        <input type="number" id="q-cin-val" class="q-input" placeholder="Ex: 78" min="50" max="150" style="text-align:center;">
                                    </div>
                                    <div class="q-group" style="flex:1;">
                                        <label style="font-size:11px;font-weight:600;margin-bottom:4px;display:block;">Quadril (cm)</label>
                                        <input type="number" id="q-quad-val" class="q-input" placeholder="Ex: 102" min="60" max="160" style="text-align:center;">
                                    </div>
                                </div>
                            </div>
                            <div id="q-blusa-fields">
                                <div style="display:flex;gap:12px;">
                                    <div class="q-group" style="flex:1;">
                                        <label style="font-size:11px;font-weight:600;margin-bottom:4px;display:block;">Altura (cm)</label>
                                        <input type="number" id="q-blusa-h-val" class="q-input" placeholder="Ex: 165" min="140" max="210" style="text-align:center;">
                                    </div>
                                    <div class="q-group" style="flex:1;">
                                        <label style="font-size:11px;font-weight:600;margin-bottom:4px;display:block;">Peso (kg)</label>
                                        <input type="number" id="q-blusa-w-val" class="q-input" placeholder="Ex: 65" min="35" max="200" style="text-align:center;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p style="margin:20px 0 10px;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--c-text-light);text-align:center;">Sua foto deve seguir estes requisitos:</p>
                        <div class="q-tips-grid" style="margin-top:0;">
                            <div class="q-tip-item"><i class="ph ph-t-shirt"></i><span>Com Roupa</span></div>
                            <div class="q-tip-item"><i class="ph ph-person"></i><span>Corpo Inteiro</span></div>
                            <div class="q-tip-item"><i class="ph ph-sun"></i><span>Boa Luz</span></div>
                        </div>
                        <div class="q-warning-back-front" style="display:block !important;visibility:visible !important;margin:14px 0 0;font-size:13px;color:#444;text-align:center;line-height:1.6;padding:14px 12px;background:#fff8e6;border:1px solid #f0d77a;border-radius:4px;font-weight:500;">&#9888;&#65039; Se voc&#234; escolheu a foto de costas, envie uma foto sua tamb&#233;m de costas. Se escolheu a frente, envie de frente.</div>
                        <div style="display:flex;gap:20px;justify-content:center;margin-top:20px;">



                            <div id="q-trigger-upload" style="width:120px;height:160px;border:1px solid var(--c-border);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--c-gray);transition:0.3s;">
                                <i class="ph ph-camera-plus" style="font-size:32px;color:var(--c-primary);margin-bottom:10px;"></i>
                                <span style="font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Enviar Foto</span>
                                <input type="file" id="q-real-input" accept="image/*" style="display:none">
                            </div>
                            <div id="q-pre-view" style="display:none;width:120px;height:160px;overflow:hidden;border:1px solid var(--c-border);">
                                <img id="q-pre-img" style="width:100%;height:100%;object-fit:cover;">
                            </div>
                        </div>
                        <div id="q-terms-row" style="display:block;margin:14px 0 0;font-size:13px;color:#444;text-align:center;line-height:1.6;cursor:pointer;opacity:0.6;user-select:none;">
                            <span id="q-terms-icon" style="font-size:18px;vertical-align:middle;margin-right:6px;">&#9744;</span><span>Concordo com os <a href="http://provoulevou.com.br/termos.html" target="_blank" onclick="event.stopPropagation()" style="color:var(--c-gold);text-decoration:underline;">Termos e Condi&#231;&#245;es</a></span>
                        </div>
                        <button class="q-btn-black" id="q-btn-generate" disabled style="margin-bottom:24px;">Ver no meu corpo</button>
                    </div>

                    <!-- PASSO DE CONFIRMAÇÃO (oculto - mantido para compatibilidade) -->
                    <div id="q-step-confirm" style="display:none !important;">
                        <button id="q-btn-confirm-yes" style="display:none;"></button>
                        <button id="q-btn-confirm-no" style="display:none;"></button>
                    </div>


                    <div id="q-loading-box" style="display:none;padding:60px 28px;text-align:center;flex-direction:column;align-items:center;justify-content:center;min-height:240px;">
                        <div class="q-loading-texts" style="position:relative;height:36px;width:100%;display:flex;align-items:center;justify-content:center;margin-bottom:24px;">
                            <div class="q-loading-t1" style="position:absolute;width:100%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:18px;letter-spacing:4px;text-transform:uppercase;color:var(--c-text);animation: q-alt-show 3.6s ease-in-out infinite;">Gerando Prova Virtual</div>
                            <a href="https://provoulevou.com.br?utm_source=widget&utm_medium=lojista&utm_campaign=madui" target="_blank" class="q-loading-t2" style="position:absolute;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;opacity:0;animation: q-alt-hide 3.6s ease-in-out infinite;">
                                <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--c-text-light);font-family:var(--font-body);">Powered by</span>
                                <img src="https://i.ibb.co/MD3B4FQf/Logo-provou-preto-1.png" alt="Provou Levou" style="height:16px;width:auto;opacity:0.8;">
                            </a>
                        </div>
                        <div style="height:1px;background:#e8e8e8;width:100%;position:relative;overflow:hidden;">
                            <div style="position:absolute;top:0;left:0;height:100%;width:30%;background:var(--c-text);animation: q-slide 1.5s infinite linear;"></div>
                        </div>
                    </div>
                    <div id="q-step-result">
                        <span class="q-res-title">Veja como ficou em voc&ecirc; &#x2728;</span>
                        <div id="q-result-img-col">
                            <img id="q-final-view-img">
                        </div>
                        <div id="q-result-actions-col">
                            <div id="q-size-recommendation" style="display:none;">
                                <p>Tamanho Recomendado</p>
                                <p id="q-rec-size-label"></p>
                                <p id="q-rec-size-desc"></p>
                            </div>
                            <div id="q-provas-restantes-result" class="q-provas-msg" style="text-align:center;margin-bottom:8px;"></div>
                            <button class="q-btn-outline" id="q-btn-back">Voltar ao Produto</button>
                            <button class="q-btn-black q-res-mobile-only" id="q-retry-btn" style="display:flex;align-items:center;justify-content:center;gap:8px;">
                                <i class="ph ph-camera"></i> Tentar outra foto
                            </button>
                            <div id="q-related-products" style="display:none;">
                                <h4>Veja tamb&eacute;m</h4>
                                <div class="q-related-grid" id="q-related-grid"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="https://provoulevou.com.br?utm_source=widget&utm_medium=lojista&utm_campaign=madui" target="_blank" class="q-powered-footer" style="text-decoration:none;">
                    <span style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--c-text-light);">Powered by</span>
                    <img src="https://i.ibb.co/MD3B4FQf/Logo-provou-preto-1.png" class="q-quantic-logo" alt="Provou Levou">
                </a>
            </div>
        </div>
    `;

    // ─── INIT ─────────────────────────────────────────────────────────────────────

    function init() {
        LOG.info('Iniciando provador...');

        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        if (!window.phosphorIconsLoaded) {
            const ph = document.createElement('script');
            ph.src = 'https://unpkg.com/@phosphor-icons/web';
            document.head.appendChild(ph);
            window.phosphorIconsLoaded = true;
            LOG.info('Phosphor Icons carregado');
        }

        const styleTag = document.createElement('style');
        styleTag.innerHTML = styles;
        document.head.appendChild(styleTag);
        LOG.ok('Estilos injetados');

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer);
        LOG.ok('Modal HTML injetado no DOM');

        // ── Pop-up de erro bonito ──
        window.showErrorPopup = function () {
            if (document.getElementById('q-error-popup')) return;
            const ov = document.createElement('div');
            ov.id = 'q-error-popup';
            ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000000;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,sans-serif;';
            const box = document.createElement('div');
            box.style.cssText = 'background:#fff;max-width:380px;width:100%;padding:36px 28px;text-align:center;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
            box.innerHTML = '<div style="font-size:48px;margin-bottom:12px;">&#128679;</div><h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#111;letter-spacing:0.5px;">Provador fora do ar</h2><p style="margin:0 0 24px;font-size:13px;color:#666;line-height:1.5;">Estamos passando por uma manuten&#231;&#227;o r&#225;pida. Voltamos em breve!</p><button id="q-error-close" style="background:#111;color:#fff;border:none;padding:12px 28px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;border-radius:4px;">Fechar</button>';
            ov.appendChild(box);
            document.body.appendChild(ov);
            document.getElementById('q-error-close').onclick = () => ov.remove();
            ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
        };

        // Pré-detecta tipo de produto para garantir que os campos corretos apareçam
        const _initProd = document.querySelector('h1.product-name, h1.product__title, .product-single__title, h1')?.innerText || document.title;
        applyProduct(detectProduct(_initProd));

        // ── Botão trigger acima da foto ──
        const openBtn = document.createElement('button');
        openBtn.className = 'q-btn-trigger-ia';
        openBtn.id = 'q-open-ia';
        openBtn.setAttribute('aria-label', 'Abrir Provador Virtual');
        openBtn.innerHTML = stampImageHTML;

        // Nuvemshop primeiro (Madui), depois Tray (compat), depois genéricos
        const trayImgContainers = [
            '.js-product-slide', '.js-swiper-product',
            '[data-store^="product-image-"]', '.product-image-main',
            '.js-product-slide-img', '.product-slider-image',
            '.image-show', '.box-gallery', '.product-colum-left'
        ];
        const fallbackContainers = [
            '.product__media-wrapper', '.product-gallery__media', '.product__media',
            '.product-media-container', '[data-media-id]',
            '.product__media-item', '.product-gallery', '.product-single__media', '.media-gallery'
        ];

        let placed = false;
        for (const sel of [...trayImgContainers, ...fallbackContainers]) {
            const el = document.querySelector(sel);
            if (el) {
                const isMobile = window.innerWidth < 768;
                const btnSize = isMobile ? '80px' : '70px';
                document.body.appendChild(openBtn);
                openBtn.style.position = 'fixed';
                openBtn.style.zIndex = '50';
                openBtn.style.width = btnSize;
                openBtn.style.height = btnSize;

                function positionBtn() {
                    const rect = el.getBoundingClientRect();
                    const btnTop = rect.top + (isMobile ? 70 : 15);
                    const threshold = isMobile ? 80 : 120;
                    if (btnTop < threshold || rect.bottom < 0) {
                        openBtn.style.visibility = 'hidden';
                    } else {
                        openBtn.style.visibility = 'visible';
                        openBtn.style.top = btnTop + 'px';
                        openBtn.style.left = (rect.right - (isMobile ? 100 : 180)) + 'px';
                    }
                }
                positionBtn();
                window.addEventListener('scroll', positionBtn);
                window.addEventListener('resize', positionBtn);
                placed = true;
                LOG.ok('Botão posicionado (' + (isMobile ? 'mobile' : 'desktop') + ') sobre: "' + sel + '"');
                break;
            }
        }
        if (!placed) {
            document.body.appendChild(openBtn);
            openBtn.style.cssText = 'position:fixed;bottom:100px;left:20px;z-index:50;width:60px;height:60px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none;padding:0;';
            LOG.warn('Nenhum container encontrado — botão fixado no canto (fallback)');
        }

        const modal = document.getElementById('q-modal-ia');
        const genBtn = document.getElementById('q-btn-generate');
        const confirmStep = document.getElementById('q-step-confirm');
        const confirmBtnYes = document.getElementById('q-btn-confirm-yes');
        const confirmBtnNo = document.getElementById('q-btn-confirm-no');
        const confirmImg = document.getElementById('q-confirm-img');
        const uploadStep = document.getElementById('q-step-upload');

        const closeBtn = document.getElementById('q-close-btn');
        const backBtn = document.getElementById('q-btn-back');
        const retryBtn = document.getElementById('q-retry-btn');
        const realInput = document.getElementById('q-real-input');
        const triggerUpload = document.getElementById('q-trigger-upload');
        const phoneInput = document.getElementById('q-phone');

        let userPhoto = null;

        function openModal() {

            LOG.info('Modal aberto');
            modal.style.display = 'flex';
            lockBodyScroll();
        }

        function closeModal() {
            LOG.info('Modal fechado');
            modal.style.display = 'none';
            unlockBodyScroll();
        }

        function applyProduct(product) {
            currentProduct = product;
            marianaType = product.fit === 'mariana_calca' ? 'calca' : product.fit === 'mariana_blusa' ? 'blusa' : null;
            const calcaFields = document.getElementById('q-calca-fields');
            const blusaFields = document.getElementById('q-blusa-fields');
            if (calcaFields) calcaFields.style.display = marianaType === 'calca' ? 'block' : 'none';
            if (blusaFields) blusaFields.style.display = marianaType === 'blusa' ? 'block' : 'none';
            LOG.info('Categoria: ' + product.category + ' | Fit: ' + product.fit + ' | marianaType: ' + marianaType);
        }


        openBtn.onclick = () => {

            const prodName = document.querySelector('h1.product-name, h1.product__title, .product-single__title, h1')?.innerText || document.title;
            LOG.info('Botão clicado — produto: "' + prodName + '"');
            applyProduct(detectProduct(prodName));
            openModal();
        };

        closeBtn.onclick = () => { LOG.info('Botão fechar clicado'); closeModal(); };
        backBtn.onclick = () => { LOG.info('Botão "Voltar ao produto" clicado'); closeModal(); };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) { LOG.info('Clique fora do card — fechando modal'); closeModal(); }
        });

        retryBtn.onclick = () => {
            LOG.info('Tentar outra foto — resetando fluxo');
            document.getElementById('q-step-result').style.display = 'none';
            document.getElementById('q-step-upload').style.display = 'block';
            document.querySelector('.q-card-ia').classList.remove('is-result');
            const recBox = document.getElementById('q-size-recommendation');
            if (recBox) recBox.style.display = 'none';
            userPhoto = null;
            document.getElementById('q-pre-view').style.display = 'none';
            checkFields();
        };

        triggerUpload.onclick = () => { LOG.info('Abrindo seletor de arquivo...'); realInput.click(); };

        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            checkFields();
        });

        // ── Contador de provas restantes (debounced) ──
        let _mcProvasDebounce;
        async function _mcCheckProvasRestantes() {
            const _mcEls = document.querySelectorAll('.q-provas-msg');
            if (!_mcEls.length) return;
            const nums = phoneInput.value.replace(/\D/g, '');
            const phoneOk = isValidBRPhone(nums);
            if (!phoneOk) { _mcEls.forEach(el => { el.textContent = ''; el.classList.remove('is-warn'); }); return; }
            try {
                const phone = '55' + nums;
                const r = await fetch(WEBHOOK_LIMITE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone, body: { phone } })
                });
                const d = await r.json();
                const used = Math.max(d.count || 0, d.phone_count || 0, d.ip_count || 0);
                const restantes = Math.max(0, DAILY_LIMIT - used);
                if (restantes > 0) {
                    _mcEls.forEach(el => el.textContent = restantes + (restantes === 1 ? ' prova restante hoje' : ' provas restantes hoje'));
                    _mcEls.forEach(el => el.classList.remove('is-warn'));
                } else {
                    _mcEls.forEach(el => el.textContent = 'Limite de ' + DAILY_LIMIT + ' provas atingido — volte amanhã.');
                    _mcEls.forEach(el => el.classList.add('is-warn'));
                }
            } catch(_) { _mcEls.forEach(el => el.textContent = ''); _mcEls.forEach(el => el.classList.remove('is-warn')); }
        }

        phoneInput.addEventListener('input', () => {
            clearTimeout(_mcProvasDebounce);
            _mcProvasDebounce = setTimeout(_mcCheckProvasRestantes, 600);
        });


        function checkFields() {
            const nums = phoneInput.value.replace(/\D/g, '');
            const phoneOk = isValidBRPhone(nums);
            document.getElementById('q-phone-error').style.display = (phoneInput.value.length > 0 && !phoneOk) ? 'block' : 'none';
            phoneInput.style.borderColor = (phoneInput.value.length > 0 && !phoneOk) ? '#ef4444' : 'var(--c-border)';
            const allOk = !!userPhoto && !!window._mcTerms && phoneOk;
            genBtn.disabled = !allOk;
            LOG.info('Validação campos — phone:' + phoneOk + ' foto:' + !!userPhoto + ' termos:' + !!window._mcTerms + ' → botão ' + (allOk ? 'HABILITADO' : 'desabilitado'));
        }

        ['q-h-val', 'q-w-val', 'q-cin-val', 'q-quad-val', 'q-blusa-h-val', 'q-blusa-w-val'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', checkFields);
        });

        // Terms row click — toggle e revalida
        const termsRow = document.getElementById('q-terms-row');
        if (termsRow) {
            termsRow.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return; // não toggle se clicar no link de termos
                window._mcTerms = !window._mcTerms;
                const icon = document.getElementById('q-terms-icon');
                if (icon) icon.textContent = window._mcTerms ? '☑' : '☐';
                termsRow.style.opacity = window._mcTerms ? '1' : '0.6';
                LOG.info('Termos: ' + window._mcTerms);
                checkFields();
            });
        }


        realInput.onchange = (e) => {
            userPhoto = e.target.files[0];
            window._mcPhoto = userPhoto;
            if (userPhoto) {
                LOG.ok('Foto selecionada: "' + userPhoto.name + '" (' + (userPhoto.size / 1024).toFixed(0) + 'KB, ' + userPhoto.type + ')');
                const rd = new FileReader();
                rd.onload = ev => {
                    document.getElementById('q-pre-img').src = ev.target.result;
                    document.getElementById('q-pre-view').style.display = 'block';
                    checkFields();
                };
                rd.readAsDataURL(userPhoto);
            }
        };

        genBtn.onclick = () => {
            LOG.info('Botão "Ver no meu corpo" clicado');
            if (!userPhoto) {
                LOG.warn('Tentativa de gerar sem foto selecionada');
                return;
            }
            if (!window._mcTerms) {
                LOG.warn('Termos não aceitos');
                return;
            }
            const _gNums = (phoneInput.value || '').replace(/\D/g, '');
            const _gPhoneOk = (_gNums.length === 10 || _gNums.length === 11) && /^[1-9][1-9]/.test(_gNums) && (_gNums.length === 10 || _gNums[2] === '9');
            if (!_gPhoneOk) {
                LOG.warn('Telefone vazio ou inválido — bloqueia envio');
                document.getElementById('q-phone-error').style.display = 'block';
                phoneInput.style.borderColor = '#ef4444';
                phoneInput.focus();
                return;
            }
            // Pula a etapa de confirmação e dispara o gerar diretamente
            if (confirmBtnYes) confirmBtnYes.click();
        };



        confirmBtnNo.onclick = () => {
            LOG.info('Botão "Não, quero trocar" clicado');
            if (confirmStep) confirmStep.style.display = 'none';
            if (uploadStep) uploadStep.style.display = 'block';
        };


        confirmBtnYes.onclick = async () => {



            if (window._provouLevouBusy) return;



            window._provouLevouBusy = true;



            try {
                LOG.info('Botão "Sim, gerar foto" clicado');

                // 🚨 LIMITE DE USO DIÁRIO — Supabase + localStorage 🚨
                const today = new Date().toISOString().slice(0, 10);
                const storageKey = 'pl_usage_' + today;
                const localUsed = parseInt(localStorage.getItem(storageKey) || '0', 10);

                // Consulta servidor para contar provas do telefone hoje (sem expor credenciais)
                let dbUsed = 0;
                let bypassActive = false;
                const phoneNorm = phoneInput.value.replace(/\D/g, '');
                try {
                    const dbRes = await fetch(WEBHOOK_LIMITE, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            telefone: phoneNorm,
                            origin: 'usemarianacardoso.com.br'
                        })
                    });
                    if (dbRes.ok) {
                        const data = await dbRes.json();
                        dbUsed = data.count || 0;
                        bypassActive = data.bypass === true;
                        LOG.info('Provas no banco hoje: ' + dbUsed + (bypassActive ? ' (bypass IP)' : ''));
                        if (bypassActive) {
                            // limpa contador local também
                            localStorage.removeItem(storageKey);
                        }
                    }
                } catch (e) {
                    LOG.warn('Falha ao consultar limite no servidor — usando localStorage');
                }

                const usedToday = bypassActive ? 0 : Math.max(localUsed, dbUsed);
                if (usedToday >= DAILY_LIMIT) {
                    if (confirmStep) confirmStep.style.display = 'none';
                    if (uploadStep) uploadStep.style.display = 'none';
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-step-result').style.display = 'none';

                    let limitMsg = document.getElementById('q-limit-msg');
                    if (!limitMsg) {
                        limitMsg = document.createElement('div');
                        limitMsg.id = 'q-limit-msg';
                        limitMsg.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 30px;';

                        const icon = document.createElement('i');
                        icon.className = 'ph ph-clock';
                        icon.style.cssText = 'font-size:48px;color:var(--c-primary);margin-bottom:20px;';

                        const title = document.createElement('h2');
                        title.style.cssText = 'margin:0 0 12px;font-size:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;';
                        title.textContent = 'Limite atingido';

                        const desc = document.createElement('p');
                        desc.style.cssText = 'margin:0 0 30px;font-size:12px;color:var(--c-text-light);letter-spacing:0.5px;line-height:1.6;';
                        desc.textContent = 'Voc\u00ea j\u00e1 usou suas ' + DAILY_LIMIT + ' provas virtuais de hoje. Volte amanh\u00e3 para experimentar mais looks!';

                        const btn = document.createElement('button');
                        btn.className = 'q-btn-outline';
                        btn.id = 'q-limit-close';
                        btn.style.maxWidth = '280px';
                        btn.textContent = 'Voltar ao Produto';
                        btn.onclick = () => {
                            modal.style.display = 'none';
                            unlockBodyScroll();
                            limitMsg.style.display = 'none';
                            if (uploadStep) uploadStep.style.display = 'block';
                        };

                        limitMsg.appendChild(icon);
                        limitMsg.appendChild(title);
                        limitMsg.appendChild(desc);
                        limitMsg.appendChild(btn);
                        document.querySelector('.q-content-scroll').appendChild(limitMsg);
                    }
                    limitMsg.style.display = 'flex';
                    return;
                }

                if (confirmStep) confirmStep.style.display = 'none';
                if (uploadStep) uploadStep.style.display = 'none';
                const loadingBox = document.getElementById('q-loading-box');
                if (loadingBox) loadingBox.style.display = 'block';


                // 🚨 VALIDAÇÃO BÁSICA NO FRONT 🚨
                const keyToUse = window.PROVOU_LEVOU_API_KEY;
                if (!keyToUse || keyToUse.includes("COLOQUE_A_CHAVE_AQUI")) {
                    window.showErrorPopup();
                    return;
                }

                const prodImgTag = document.querySelector(
                    '.image-show .box-img.active .zoom img, ' +
                    '.image-show .box-img .zoom img, ' +
                    '.image-show img, ' +
                    '.product__media img, ' +
                    'img.product-featured-media, ' +
                    '.product-single__photo'
                );
                const prodImg = prodImgTag
                    ? (prodImgTag.dataset.src || prodImgTag.dataset.lazy || prodImgTag.src)
                    : (document.querySelector('meta[property="og:image"]')?.content || '');
                const prodName = document.querySelector('h1.product-name, h1.product__title, .product-single__title, h1')?.innerText || document.title;



                LOG.group('Enviando para webhook');
                LOG.info('Produto: ' + prodName);
                LOG.info('Imagem do produto: ' + (prodImg || '(não encontrada)'));
                LOG.info('WhatsApp: informado');
                LOG.info('Categoria: ' + currentProduct.category + '  |  Fit: ' + currentProduct.fit);

                document.getElementById('q-step-upload').style.display = 'none';
                document.getElementById('q-loading-box').style.display = 'flex';

                try {
                    const fd = new FormData();
                    fd.append('person_image', userPhoto);
                    fd.append('whatsapp', '55' + phoneInput.value.replace(/\D/g, ''));
                    fd.append('phone_raw', phoneInput.value);
                    fd.append('product_name', prodName);
                    fd.append('product_type', currentProduct.category);
                    fd.append('product_fit', currentProduct.fit);

                    // 👉 INJETA A CHAVE NO FORM DATA PRO N8N LER
                    fd.append('api_key', keyToUse);

                    if (marianaType === 'calca') {
                        const cinVal = document.getElementById('q-cin-val')?.value || '';
                        const quadVal = document.getElementById('q-quad-val')?.value || '';
                        fd.append('height', '');
                        fd.append('weight', '');
                        fd.append('cintura', cinVal);
                        fd.append('quadril', quadVal);
                        LOG.info('Medidas calça: cintura=' + cinVal + ' quadril=' + quadVal);
                    } else if (marianaType === 'blusa') {
                        const hVal = document.getElementById('q-blusa-h-val')?.value || '';
                        const wVal = document.getElementById('q-blusa-w-val')?.value || '';
                        fd.append('height', hVal);
                        fd.append('weight', wVal);
                        fd.append('cintura', '');
                        fd.append('quadril', '');
                        LOG.info('Medidas blusa: altura=' + hVal + ' peso=' + wVal);
                    } else {
                        fd.append('height', '');
                        fd.append('weight', '');
                        fd.append('cintura', '');
                        fd.append('quadril', '');
                        LOG.info('Produto sem tabela MADUI — medidas enviadas vazias');
                    }

                    if (prodImg) {
                        try {
                            LOG.info('Baixando imagem do produto para anexar...');
                            const b = await fetch(prodImg).then(r => r.blob());
                            fd.append('product_image', b, 'p.png');
                            LOG.ok('Imagem do produto anexada (' + (b.size / 1024).toFixed(0) + 'KB)');
                        } catch (imgErr) {
                            LOG.warn('Não foi possível baixar imagem do produto: ' + imgErr.message);
                        }
                    } else {
                        LOG.warn('Imagem do produto não encontrada no DOM — enviando sem ela');
                    }

                    calculateFinalSize();
                    LOG.info('Enviando POST para webhook: ' + WEBHOOK_PROVA);
                    const t0 = Date.now();

                    const res = await fetch(WEBHOOK_PROVA, { method: 'POST', body: fd });
                    const elapsed = Date.now() - t0;
                    LOG.info('Resposta recebida em ' + elapsed + 'ms — status: ' + res.status + ' ' + res.statusText);

                    const contentType = res.headers.get("content-type") || "";
                    if (contentType.includes("application/json")) {
                        const data = await res.json();
                        if (data.error) {
                            LOG.error('Erro da API retornado via JSON:', data.error);
                            LOG.end();
                            document.getElementById('q-loading-box').style.display = 'none';
                            document.getElementById('q-step-upload').style.display = 'block';
                            if (data.error === "Chave invalida, vencida ou inativa." || data.error.includes("vencida ou inativa")) {
                                window.showErrorPopup();
                            } else {
                                window.showErrorPopup();
                            }
                            return;
                        }
                    }

                    if (res.ok) {
                        // Incrementa contador de uso diário
                        localStorage.setItem(storageKey, String(usedToday + 1));

                        const blob = await res.blob();
                        LOG.ok('Imagem gerada com sucesso! (' + (blob.size / 1024).toFixed(0) + 'KB, ' + blob.type + ')');
                        LOG.end();

                        document.getElementById('q-loading-box').style.display = 'none';
                        document.getElementById('q-final-view-img').src = URL.createObjectURL(blob);

                        // Exibe recomendação de tamanho se for calça e medidas foram informadas
                        const recSize = calculateFinalSize();
                        const recBox = document.getElementById('q-size-recommendation');
                        if (recSize && recBox) {
                            document.getElementById('q-rec-size-label').textContent = recSize;
                            document.getElementById('q-rec-size-desc').textContent = marianaType === 'calca' ? 'Baseado nas suas medidas de cintura e quadril' : 'Baseado no seu peso e altura';
                            recBox.style.display = 'block';
                        } else if (recBox) {
                            recBox.style.display = 'none';
                        }

                        document.querySelector('.q-card-ia').classList.add('is-result');
                        document.getElementById('q-step-result').style.display = 'flex';
                        if (typeof _mcCheckProvasRestantes === 'function') _mcCheckProvasRestantes();
                        loadRelatedProducts();
                        LOG.ok('Resultado exibido.' + (recSize ? ' Tamanho recomendado: ' + recSize : ''));

                    } else if (res.status === 401 || res.status === 403) {
                        LOG.error('Webhook retornou erro de permissão: ' + res.status);
                        LOG.end();
                        document.getElementById('q-loading-box').style.display = 'none';
                        document.getElementById('q-step-upload').style.display = 'block';
                        window.showErrorPopup();
                    } else {
                        LOG.error('Webhook retornou erro: ' + res.status);
                        LOG.end();
                        throw new Error('HTTP ' + res.status);
                    }
                } catch (e) {
                    console.error('------- ERRO DETALHADO capturado no CATCH -------');
                    console.error('Nome:', e.name);
                    console.error('Mensagem:', e.message);
                    console.error('Stack:', e.stack);
                    console.error('-------------------------------------------------');
                    LOG.error('Falha no fluxo de geração: ' + e.message, e);
                    LOG.end();
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-step-upload').style.display = 'block';
                    window.showErrorPopup();
                }
        



            } finally {



                window._provouLevouBusy = false;



            }}



        ;

        // Funcionalidade de adicionar ao carrinho removida conforme solicitado




        function loadRelatedProducts() {
            var grid = document.getElementById('q-related-grid');
            var section = document.getElementById('q-related-products');
            if (!grid || !section) return;

            // Seletores Tray MADUI
            var items = document.querySelectorAll('.product-related .item.swiper-slide');
            if (!items.length) items = document.querySelectorAll('.product-related .product');
            if (!items.length) items = document.querySelectorAll('.list-product .swiper-slide .product');
            if (!items.length) {
                LOG.warn('Nenhum produto relacionado encontrado');
                return;
            }

            var products = [];
            items.forEach(function(item) {
                if (products.length >= 3) return;
                try {
                    var imgEl = item.querySelector('img[data-src], img[src]');
                    var nameEl = item.querySelector('.product-name');
                    var priceOff = item.querySelector('.price-off');
                    var priceLine = item.querySelector('.line-price');
                    var linkEl = item.querySelector('a.info-product, a[href*="/"]');

                    var img = imgEl ? (imgEl.getAttribute('data-src') || imgEl.src) : '';
                    var name = nameEl ? nameEl.textContent.trim() : (imgEl && imgEl.alt ? imgEl.alt.trim() : '');
                    var price = '';
                    if (priceOff) price = priceOff.textContent.trim().replace(/\s+/g, ' ');
                    else if (priceLine) price = priceLine.textContent.trim().replace(/\s+/g, ' ');
                    var link = linkEl ? linkEl.getAttribute('href') : '';

                    if (img && (name || price)) {
                        products.push({ name: name, img: img, price: price, link: link });
                    }
                } catch(e) {}
            });

            if (!products.length) return;
            while (grid.firstChild) grid.removeChild(grid.firstChild);
            products.forEach(function(p) {
                var a = document.createElement('a');
                a.className = 'q-related-card';
                a.href = p.link || '#';
                a.target = '_blank';
                var img = document.createElement('img');
                img.src = p.img;
                img.alt = p.name;
                img.loading = 'lazy';
                var nameEl = document.createElement('span');
                nameEl.className = 'q-related-card-name';
                nameEl.textContent = p.name;
                a.appendChild(img);
                a.appendChild(nameEl);
                if (p.price) {
                    var priceEl = document.createElement('span');
                    priceEl.className = 'q-related-card-price';
                    priceEl.textContent = p.price;
                    a.appendChild(priceEl);
                }
                grid.appendChild(a);
            });
            section.style.display = 'block';
            LOG.ok('Related products carregados: ' + products.length);
        }

        LOG.ok('Provador inicializado com sucesso!');
    }

    // ─── DETECÇÃO DE PÁGINA DE PRODUTO ───────────────────────────────────────────

    // ── Detecção sempre dentro do DOMContentLoaded para garantir que
    // os elementos existam no DOM (script pode ser carregado async)
    function runWhenReady() {
        const path = window.location.pathname;
        const isProductPage =
            window.__MC_FORCE_INIT__ === true ||
            path.includes('/produto/') ||
            path.includes('/produtos/') ||
            path.includes('/p/') ||
            path.includes('/products/') ||
            document.getElementById('product-container') !== null ||
            document.getElementById('form_comprar') !== null ||
            document.querySelector('.box-gallery') !== null ||
            // Nuvemshop signals
            document.querySelector('.js-product-slide') !== null ||
            document.querySelector('[data-store^="product-image-"]') !== null ||
            document.querySelector('input[name="variation_id"]') !== null;

        LOG.info('Página atual: "' + path + '"  →  é página de produto: ' + isProductPage);

        if (isProductPage) {
            init();
        } else {
            LOG.warn('Página não é de produto — script não inicializado');
        }
    }

    if (document.readyState === 'loading') {
        LOG.info('DOM ainda carregando — aguardando DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', runWhenReady);
    } else {
        runWhenReady();
    }

})();

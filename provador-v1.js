(function () {
    const apiKey = "pl_live_fe5eeec96552b88148c104c106ec51ff7d07e65411e9a11874b66fcf0ea342a7";
    window.PROVOU_LEVOU_API_KEY = apiKey;

    const WEBHOOK_URL = 'https://n8n.segredosdodrop.com/webhook/quantic-materialize';


    // ─── LOCK / UNLOCK SCROLL ────────────────────────────────────────────────────


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
        :root {
            --q-primary: #000000; --q-bg: #ffffff;
            --q-border: #000000; --q-gray: #f5f5f5;
            --q-text: #000000; --q-text-light: #666666;
        }

        @keyframes q-shake {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(-10deg); }
            20% { transform: rotate(10deg); }
            30% { transform: rotate(-10deg); }
            40% { transform: rotate(10deg); }
            50% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
        }
        .q-btn-trigger-ia {
            position: absolute; top: 15px; right: 15px; z-index: 100;
            background: transparent !important; border: none; padding: 0; cursor: pointer;
            width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s ease;
            animation: q-shake 3s infinite;
            pointer-events: auto;
        }
        .q-btn-trigger-ia:hover {
            animation-play-state: paused; transform: scale(1.1) !important;
        }

        #q-modal-ia { display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.98); z-index: 999999; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; }
        .q-card-ia { background: var(--q-bg); width: 100%; max-width: 480px; padding: 0; position: relative; color: var(--q-text); border: 1px solid var(--q-border); max-height: 94vh; display: flex; flex-direction: column; overflow: hidden; }
        .q-content-scroll { padding: 25px 20px; overflow-y: auto; flex: 1; text-align: center; }
        .q-close-ia { position: absolute; top: 12px; right: 12px; background: none; border: none; color: var(--q-text); cursor: pointer; font-size: 22px; z-index: 300; font-weight: 300; }
        .q-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px 0; margin: 12px 0; border-top: 1px solid var(--q-gray); border-bottom: 1px solid var(--q-gray); }
        .q-tip-item { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 8px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-light); }
        .q-tip-item i { color: var(--q-primary); font-size: 18px; }
        .q-lead-form { margin: 15px 0 10px; display: flex; flex-direction: column; gap: 12px; text-align: left; }
        .q-group { flex: 1; }
        .q-group label { display: block; font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: var(--q-text); margin-bottom: 6px; text-transform: uppercase; }
        .q-input { width: 100%; padding: 14px 14px; border: 1px solid var(--q-border); font-size: 16px !important; font-family: 'Inter', sans-serif; background: transparent; color: var(--q-text); outline: none; box-sizing: border-box; -webkit-text-size-adjust: 100%; }
        .q-input:focus { border-width: 2px; padding: 13px; font-size: 16px !important; }
        .q-btn-black { background: var(--q-primary); color: var(--q-bg); border: 1px solid var(--q-primary); width: 100%; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-top: 12px; transition: 0.3s; }
        .q-btn-black:disabled { background: var(--q-gray); color: #999; border-color: var(--q-gray); cursor: not-allowed; }
        .q-btn-black:not(:disabled):hover { background: var(--q-bg); color: var(--q-primary); }
        .q-btn-buy { background: var(--q-primary); color: var(--q-bg); border: 1px solid var(--q-primary); width: 100%; padding: 16px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-bottom: 10px; transition: 0.3s; }
        .q-btn-buy:hover { background: var(--q-bg); color: var(--q-primary); }
        .q-btn-outline { background: var(--q-bg); color: var(--q-primary); border: 1px solid var(--q-border); width: 100%; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
        .q-btn-outline:hover { background: var(--q-primary); color: var(--q-bg); }
        .q-powered-footer { background: var(--q-bg); padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0; border-top: 1px solid var(--q-gray); }
        .q-quantic-logo { height: 20px; filter: brightness(0); }
        .q-status-msg { display:none; font-size: 9px; letter-spacing: 1px; color: #ef4444; margin-top: 8px; font-weight: 600; text-align: left; text-transform: uppercase; }

        /* RECOMENDACAO DE TAMANHO */
        .q-size-group { display: flex; gap: 10px; }
        .q-size-group .q-group { flex: 1; }
        .q-size-result {
            display: none; margin-top: 12px; padding: 14px; border: 2px solid var(--q-primary);
            text-align: center; font-family: 'Inter', sans-serif;
        }
        .q-size-result strong {
            font-size: 22px; letter-spacing: 2px; display: block; margin-bottom: 2px;
        }
        .q-size-result span {
            font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-light);
        }

        /* SELETOR DE IMAGEM DO PRODUTO */
        .q-content-scroll::-webkit-scrollbar { width: 4px; }
        .q-content-scroll::-webkit-scrollbar-thumb { background: #e5e5e5; }

        /* BOTAO INLINE ACIMA DO CARRINHO */
        .q-inline-wrapper {
            position: relative !important; width: 100% !important; margin-top: 24px !important; margin-bottom: 16px !important;
        }
        .q-btn-inline-provador {
            display: flex !important; align-items: center !important; justify-content: center !important;
            gap: 10px !important; width: 100% !important; padding: 12px 20px !important;
            background: var(--q-bg) !important; color: var(--q-primary) !important;
            border: 1px solid var(--q-primary) !important; border-radius: 8px !important;
            font-family: 'Inter', sans-serif !important; font-size: 11px !important;
            font-weight: 600 !important; text-transform: uppercase !important;
            letter-spacing: 2px !important; cursor: pointer !important;
            transition: all 0.3s ease !important; text-decoration: none !important;
            box-sizing: border-box !important;
        }
        .q-btn-inline-provador:hover {
            background: var(--q-primary) !important; color: var(--q-bg) !important;
        }
        @keyframes q-float-badge { 0%, 100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-5px) rotate(-1deg); } }
        .q-badge-novidade {
            position: absolute; top: -14px; right: 10px; background: #000; color: #fff;
            padding: 4px 12px; border-radius: 20px; font-size: 9px; font-weight: 800;
            text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; z-index: 2;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15); font-family: 'Inter', sans-serif;
            animation: q-float-badge 3s ease-in-out infinite;
        }
        @keyframes q-slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes q-pulse-text { 0%, 100% { opacity: 0.4; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } }

        #q-step-confirm {
            position: absolute; inset: 0; background: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px); z-index: 200; display: none;
            align-items: center; justify-content: center; padding: 20px;
        }
        .q-confirm-box {
            background: #ffffff; width: 100%; max-width: 380px; padding: 40px 30px;
            border: 1px solid #000; text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: q-popup-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes q-popup-zoom { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        @media (min-width: 768px) {
            .q-card-ia.is-result {
                width: 820px !important; max-width: 90vw !important;
                height: 560px !important;
            }
            .q-card-ia.is-result #q-header-provador,
            .q-card-ia.is-result .q-powered-footer { display: none !important; }
            .q-card-ia.is-result .q-content-scroll {
                padding: 0 !important; height: 100% !important;
                overflow: hidden !important; display: flex !important; flex-direction: column !important;
            }
            .q-card-ia.is-result #q-step-result {
                display: flex !important; flex-direction: row !important;
                width: 100%; height: 100%; align-items: stretch;
            }
            .q-card-ia.is-result #q-result-img-col {
                width: 50% !important; height: 100% !important; margin: 0 !important;
                border: none !important; border-right: 1px solid var(--q-border) !important;
                position: relative !important; flex-shrink: 0;
            }
            .q-card-ia.is-result #q-result-img-col img {
                position: absolute !important; top: 0; left: 0;
                width: 100% !important; height: 100% !important;
                object-fit: contain !important; object-position: center center !important;
            }
            .q-card-ia.is-result #q-result-actions-col {
                width: 50% !important; height: 100% !important; padding: 40px !important;
                display: flex !important; flex-direction: column; justify-content: center;
                box-sizing: border-box; overflow-y: auto;
            }
            .q-card-ia.is-result .q-res-title { display: block !important; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--q-text); margin-bottom: 4px; }
            .q-card-ia.is-result .q-res-subtitle { display: block !important; font-size: 11px; color: var(--q-text-light); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 30px; }
            .q-card-ia.is-result .q-btn-buy,
            .q-card-ia.is-result .q-btn-outline {
                display: flex; align-items: center; justify-content: center; gap: 8px;
                font-size: 11px !important; padding: 18px !important;
                font-weight: 600; letter-spacing: 2px !important; text-transform: uppercase !important;
            }
            .q-card-ia.is-result .q-btn-buy { margin-bottom: 12px; }
            .q-card-ia.is-result .q-close-ia { top: 16px; right: 16px; color: var(--q-text); z-index: 300; position: absolute; }
        }
    `;


    const stampImageHTML = `<img src="https://cdn.shopify.com/s/files/1/0636/6334/1746/files/logo_provador.png?v=1772494793" alt="Provador Virtual" style="width:100%;height:100%;object-fit:contain;">`;


    const html = `
        <div id="q-modal-ia">
            <div class="q-card-ia">
                <button type="button" class="q-close-ia" id="q-close-btn">&times;</button>
                <div class="q-content-scroll">
                    <div id="q-header-provador">
                        <h1 style="margin:0 0 6px 0;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Provador Virtual</h1>
                        <div style="margin:0;text-align:center;">
                            <img src="https://acdn-us.mitiendanube.com/stores/005/736/640/themes/common/logo-164572917-1751035330-b4cfebbd24f987283d6cc623102b30db1751035330-640-0.webp" alt="MADUI" style="height:75px;width:auto;display:inline-block;">
                        </div>
                    </div>
                    <div id="q-step-upload">
                        <div class="q-lead-form">
                            <div class="q-group">
                                <label>Seu Celular</label>
                                <input type="tel" id="q-phone" class="q-input" placeholder="(11) 99999-9999" maxlength="15">
                                <div id="q-phone-error" class="q-status-msg">Insira um numero valido</div>
                            </div>
                            <div id="q-size-fields" style="display:none;">
                                <div class="q-size-group">
                                    <div class="q-group">
                                        <label>Altura (cm)</label>
                                        <input type="number" id="q-height" class="q-input" placeholder="175" min="140" max="220">
                                    </div>
                                    <div class="q-group">
                                        <label>Peso (kg)</label>
                                        <input type="number" id="q-weight" class="q-input" placeholder="70" min="30" max="200">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="q-photo-selector-group" style="display:none;">
                            <div id="q-product-images-container"></div>
                        </div>
                        <p style="margin:15px 0 5px;font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--q-text-light);text-align:center;">Sua foto deve seguir estes requisitos:</p>
                        <div class="q-tips-grid" style="margin-top:0;">
                            <div class="q-tip-item"><i class="ph ph-t-shirt"></i><span>Com Roupa</span></div>
                            <div class="q-tip-item"><i class="ph ph-person"></i><span>Corpo Inteiro</span></div>
                            <div class="q-tip-item"><i class="ph ph-sun"></i><span>Boa Luz</span></div>
                        </div>
                        <div style="display:flex;gap:15px;justify-content:center;margin-top:15px;">
                            <div id="q-trigger-upload" style="width:90px;height:120px;border:1px solid var(--q-border);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--q-gray);transition:0.3s;">
                                <i class="ph ph-camera-plus" style="font-size:26px;color:var(--q-primary);margin-bottom:6px;"></i>
                                <span style="font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Enviar Foto</span>
                                <input type="file" id="q-real-input" accept="image/*" style="display:none">
                            </div>
                            <div id="q-pre-view" style="display:none;width:90px;height:120px;overflow:hidden;border:1px solid var(--q-border);">
                                <img id="q-pre-img" style="width:100%;height:100%;object-fit:cover;">
                            </div>
                        </div>
                        <label style="display:flex;align-items:flex-start;gap:8px;margin-top:10px;cursor:pointer;font-size:11px;line-height:1.4;color:#64748b;justify-content:center;text-align:center;">
                            <input type="checkbox" id="q-accept-terms" style="margin-top:2px;cursor:pointer;accent-color:#000;">
                            Ao continuar, concordo com os <a href="http://provoulevou.com.br/termos.html" target="_blank" style="color:#000;text-decoration:underline;">Termos e Condicoes</a>
                        </label>
                        <button class="q-btn-black" id="q-btn-generate" disabled>Ver no meu corpo</button>
                    </div>

                    <div id="q-step-confirm" style="display:none;pointer-events:none;">
                        <div class="q-confirm-box">
                            <h2 style="margin:0 0 30px 0;font-size:16px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#000;line-height:1.4;">Sua foto segue estes requisitos?</h2>
                            <div class="q-tips-grid" style="margin-bottom:35px;border-top:none;border-bottom:none;padding:0;">
                                <div class="q-tip-item"><i class="ph ph-t-shirt" style="font-size:24px;"></i><span style="font-size:8px;">Com Roupa</span></div>
                                <div class="q-tip-item"><i class="ph ph-person" style="font-size:24px;"></i><span style="font-size:8px;">Corpo Inteiro</span></div>
                                <div class="q-tip-item"><i class="ph ph-sun" style="font-size:24px;"></i><span style="font-size:8px;">Boa Luz</span></div>
                            </div>
                            <button class="q-btn-black" id="q-btn-confirm-yes" style="margin-top:0;padding:20px 0;">SIM, GERAR FOTO</button>
                            <button class="q-btn-outline" id="q-btn-confirm-no" style="margin-top:15px;border-color:#ef4444;color:#ef4444;padding:18px 0;background:none;">NAO, QUERO TROCAR</button>
                        </div>
                    </div>

                    <div style="display:none;padding:60px 0;text-align:center;" id="q-loading-box">
                        <div style="font-weight:600;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;animation:q-pulse-text 1.5s infinite ease-in-out;">Gerando Prova Virtual...</div>
                        <div style="height:1px;background:var(--q-gray);width:100%;position:relative;overflow:hidden;">
                            <div style="position:absolute;top:0;left:0;height:100%;width:30%;background:var(--q-primary);animation:q-slide 1.5s infinite linear;"></div>
                        </div>
                    </div>

                    <div id="q-step-result" style="display:none;flex-direction:column;align-items:center;">
                        <div id="q-result-img-col" style="width:100%;border:1px solid var(--q-border);margin-bottom:30px;background:var(--q-gray);">
                            <img id="q-final-view-img" style="width:100%;height:auto;display:block;">
                        </div>
                        <div id="q-result-actions-col" style="width:100%;">
                            <span class="q-res-title" style="display:none;">Provador Virtual</span>
                            <span class="q-res-subtitle" style="display:none;">Visualize como a peca fica em voce</span>
                            <div id="q-size-result" class="q-size-result" style="display:none;margin-bottom:20px;">
                                <span>Tamanho recomendado</span>
                                <strong id="q-size-value"></strong>
                            </div>
                            <button class="q-btn-buy" id="q-btn-back">Voltar ao Produto</button>
                            <p style="margin-top:20px;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--q-text-light);cursor:pointer;text-decoration:underline;text-underline-offset:4px;" id="q-retry-btn">Tentar outra foto</p>
                        </div>
                    </div>
                </div>
                <a href="https://provoulevou.com.br" target="_blank" class="q-powered-footer" style="text-decoration:none;">
                    <span style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--q-text-light);">Powered by</span>
                    <img src="https://provoulevou.com.br/assets/provoulevou-logo.png" class="q-quantic-logo">
                </a>
            </div>
        </div>
    `;


    function init() {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        if (!window.phosphorIconsLoaded) {
            const ph = document.createElement('script');
            ph.src = 'https://unpkg.com/@phosphor-icons/web';
            document.head.appendChild(ph);
            window.phosphorIconsLoaded = true;
        }

        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);

        const modalContainer = document.createElement('div');
        modalContainer.insertAdjacentHTML('afterbegin', html);
        document.body.appendChild(modalContainer);

        const openBtn = document.createElement('button');
        openBtn.className = 'q-btn-trigger-ia';
        openBtn.id = 'q-open-ia';
        openBtn.setAttribute('aria-label', 'Abrir Provador Virtual');
        openBtn.insertAdjacentHTML('afterbegin', stampImageHTML);

        // Nuvemshop: usar APENAS o container externo .product-images
        // (NAO mexer no .product-images-slider/Swiper interno — quebra o carrossel)
        const galleryEl = document.querySelector('.product-images');
        if (galleryEl) {
            if (window.getComputedStyle(galleryEl).position === 'static') galleryEl.style.position = 'relative';
            // .product-images nao tem overflow:hidden por padrao, entao o selo aparece sem precisar mexer
            openBtn.style.zIndex = '999';
            galleryEl.appendChild(openBtn);
        } else {
            openBtn.style.cssText = 'position:fixed;bottom:100px;right:15px;z-index:9999;width:70px;height:70px;';
            document.body.appendChild(openBtn);
        }

        // ── Botao inline ──
        const inlineWrapper = document.createElement('div');
        inlineWrapper.className = 'q-inline-wrapper';
        inlineWrapper.insertAdjacentHTML('afterbegin', '<div class="q-badge-novidade">Novidade!</div><button type="button" class="q-btn-inline-provador">PROVADOR VIRTUAL</button>');
        const inlineBtn = inlineWrapper.querySelector('.q-btn-inline-provador');

        // Madui: o botao Comprar fica em CSS Grid (.grid grid-auto-1), entao
        // inserir antes dele quebra o layout. Solucao: colocar abaixo do "Guia de Medidas"
        const sizeGuideLink = document.querySelector('a[data-target="#size-guide-modal"], a[data-modal-url="modal-fullscreen-size-guide"]');
        if (sizeGuideLink) {
            sizeGuideLink.parentElement.insertBefore(inlineWrapper, sizeGuideLink.nextSibling);
        }

        const modal = document.getElementById('q-modal-ia');
        const genBtn = document.getElementById('q-btn-generate');
        const confirmStep = document.getElementById('q-step-confirm');
        const confirmBtnYes = document.getElementById('q-btn-confirm-yes');
        const confirmBtnNo = document.getElementById('q-btn-confirm-no');
        const uploadStep = document.getElementById('q-step-upload');
        const closeBtn = document.getElementById('q-close-btn');
        const backBtn = document.getElementById('q-btn-back');
        const retryBtn = document.getElementById('q-retry-btn');
        const realInput = document.getElementById('q-real-input');
        const triggerUpload = document.getElementById('q-trigger-upload');
        const phoneInput = document.getElementById('q-phone');
        const heightInput = document.getElementById('q-height');
        const weightInput = document.getElementById('q-weight');

        // Detecta se e pagina de kit pela URL ou titulo do produto
        const prodTitle = (document.querySelector('.js-product-name, h1.js-product-name, h1')?.innerText || '').toLowerCase();
        // Recomendacao de tamanho desativada na Madui (sem tabela mapeada)
        const isKit = false;

        function recommendSize(height, weight) {
            const h = parseInt(height);
            const w = parseInt(weight);
            if (!h || !w) return '';
            // Calcula score baseado em altura e peso
            // Tabela: P(165-170, 55-60), M(170-175, 60-70), G(175-180, 70-80), GG(180-190, 80-90)
            const sizes = [
                { label: 'P',  hMin: 0,   hMax: 170, wMin: 0,  wMax: 60 },
                { label: 'M',  hMin: 170, hMax: 175, wMin: 60, wMax: 70 },
                { label: 'G',  hMin: 175, hMax: 180, wMin: 70, wMax: 80 },
                { label: 'GG', hMin: 180, hMax: 999, wMin: 80, wMax: 999 },
            ];
            // Determina tamanho por altura e por peso separadamente, depois pega o maior
            let sizeByHeight = 'P';
            if (h >= 180) sizeByHeight = 'GG';
            else if (h >= 175) sizeByHeight = 'G';
            else if (h >= 170) sizeByHeight = 'M';

            let sizeByWeight = 'P';
            if (w >= 80) sizeByWeight = 'GG';
            else if (w >= 70) sizeByWeight = 'G';
            else if (w >= 60) sizeByWeight = 'M';

            // Pega o maior dos dois para garantir conforto
            const order = ['P', 'M', 'G', 'GG'];
            const idx = Math.max(order.indexOf(sizeByHeight), order.indexOf(sizeByWeight));
            return order[idx];
        }

        function showSizeRecommendation() {
            if (!isKit) return;
            const size = recommendSize(heightInput.value, weightInput.value);
            const resultEl = document.getElementById('q-size-result');
            const valueEl = document.getElementById('q-size-value');
            if (size) {
                valueEl.textContent = size;
                resultEl.style.display = 'block';
            } else {
                resultEl.style.display = 'none';
            }
        }

        let userPhoto = null;
        let selectedProductImg = '';

        function extractProductImages() {
            const invalidKeywords = ['provador', 'logo', 'provoulevou', 'icon', 'play', 'video', 'badge', 'whatsapp', 'tabela', 'medidas'];
            const allImgs = document.querySelectorAll(
                '.js-product-slide-img, .product-slider-image, ' +
                '.product-images img, .product-images-slider img, ' +
                '.js-product-thumb img, .product-thumb img, ' +
                '.js-product-slide img'
            );
            const seen = new Set();
            const urls = [];
            allImgs.forEach(img => {
                // Nuvemshop usa data-image-large para versao grande
                let src = img.dataset?.imageLarge || img.dataset?.src || img.src || '';
                if (!src || src.includes('data:image')) return;
                if (invalidKeywords.some(kw => src.toLowerCase().includes(kw))) return;
                // Normaliza para URL absoluta
                if (src.startsWith('//')) src = 'https:' + src;
                const clean = src.split('?')[0];
                if (seen.has(clean)) return;
                seen.add(clean);
                if (img.naturalWidth > 100 || img.width > 100 || src.includes('mitiendanube') || src.includes('tiendanube') || src.includes('nuvemshop')) {
                    urls.push(src);
                }
            });
            if (urls.length === 0) {
                const og = document.querySelector('meta[property="og:image"]')?.content;
                if (og) urls.push(og);
            }
            return urls.slice(0, 15);
        }

        function populateProductPicker() {
            try {
                const imgs = extractProductImages();
                const container = document.getElementById('q-product-images-container');
                const group = document.getElementById('q-photo-selector-group');
                if (!container || !group) return;
                container.textContent = '';
                // Madui: seletor de foto desativado, sempre usa a primeira imagem
                group.style.display = 'none';
                selectedProductImg = imgs[0] || '';
                return;
                // (codigo abaixo permanece como referencia mas nunca executa)
                const defaultIdx = imgs.length > 1 ? 1 : 0;
                selectedProductImg = imgs[defaultIdx];

                imgs.forEach((url, i) => {
                    const box = document.createElement('div');
                    box.style.cssText = 'width:70px; height:90px; border: 2px solid ' + (i === defaultIdx ? 'var(--q-primary)' : 'var(--q-gray)') + '; border-radius:4px; overflow:hidden; cursor:pointer; opacity: ' + (i === defaultIdx ? '1' : '0.5') + '; transition: 0.3s;';
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
                    box.appendChild(img);
                    box.addEventListener('click', () => {
                        selectedProductImg = url;
                        [...container.children].forEach(child => {
                            child.style.borderColor = 'var(--q-gray)';
                            child.style.opacity = '0.5';
                        });
                        box.style.borderColor = 'var(--q-primary)';
                        box.style.opacity = '1';
                    });
                    container.appendChild(box);
                });
            } catch(_) {}
        }

        function openModal() { populateProductPicker(); modal.style.display = 'flex'; lockBodyScroll(); }
        function closeModal() { modal.style.display = 'none'; unlockBodyScroll(); }

        // Bloqueia mousedown/pointerdown para impedir lightbox da Shopify
        ['mousedown', 'mouseup', 'pointerdown', 'pointerup'].forEach(evt => {
            openBtn.addEventListener(evt, (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, true);
        });
        // Click abre o modal e bloqueia propagacao
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openModal();
        }, true);
        if (inlineBtn) inlineBtn.onclick = () => openModal();
        closeBtn.onclick = () => closeModal();
        backBtn.onclick = () => closeModal();
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        retryBtn.onclick = () => {
            document.getElementById('q-step-result').style.display = 'none';
            uploadStep.style.display = 'block';
            document.querySelector('.q-card-ia').classList.remove('is-result');
            userPhoto = null;
            realInput.value = '';
            document.getElementById('q-pre-view').style.display = 'none';
            checkFields();
        };

        triggerUpload.onclick = () => realInput.click();

        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            checkFields();
        });

        function checkFields() {
            const nums = phoneInput.value.replace(/\D/g, '');
            const phoneOk = nums.length >= 10 && nums.length <= 11;
            document.getElementById('q-phone-error').style.display = (phoneInput.value.length > 0 && !phoneOk) ? 'block' : 'none';
            phoneInput.style.borderColor = (phoneInput.value.length > 0 && !phoneOk) ? '#ef4444' : 'var(--q-border)';
            genBtn.disabled = !(userPhoto && phoneOk && document.getElementById('q-accept-terms').checked);
        }

        document.getElementById('q-accept-terms').onchange = checkFields;

        realInput.onchange = (e) => {
            userPhoto = e.target.files[0];
            if (userPhoto) {
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
            if (!userPhoto) return;
            confirmStep.style.display = 'flex';
            confirmStep.style.pointerEvents = 'auto';
        };

        confirmBtnNo.onclick = () => {
            confirmStep.style.display = 'none';
            confirmStep.style.pointerEvents = 'none';
        };

        confirmBtnYes.onclick = async () => {
            confirmStep.style.display = 'none';
            confirmStep.style.pointerEvents = 'none';
            uploadStep.style.display = 'none';
            document.getElementById('q-loading-box').style.display = 'block';

            const keyToUse = window.PROVOU_LEVOU_API_KEY;
            if (!keyToUse || keyToUse.includes("COLOQUE_A_CHAVE_AQUI")) {
                alert("Erro: API Key nao configurada.");
                document.getElementById('q-loading-box').style.display = 'none';
                uploadStep.style.display = 'block';
                return;
            }

            // Usa a imagem selecionada pelo cliente no picker
            const prodImg = selectedProductImg || (document.querySelector('meta[property="og:image"]')?.content || '');
            // Pega o titulo do produto de forma robusta (ignora h1.logo do header)
            let prodName = '';
            const titleSelectors = ['.js-product-name', 'h1.js-product-name', 'meta[property="og:title"]'];
            for (const sel of titleSelectors) {
                const el = document.querySelector(sel);
                const val = el?.innerText?.trim() || el?.content?.trim() || '';
                if (val) { prodName = val; break; }
            }
            if (!prodName) prodName = document.title;

            try {
                const fd = new FormData();
                fd.append('person_image', userPhoto);
                fd.append('whatsapp', '55' + phoneInput.value.replace(/\D/g, ''));
                fd.append('phone_raw', phoneInput.value);
                fd.append('product_name', prodName);
                fd.append('api_key', keyToUse);

                if (prodImg) {
                    try { const b = await fetch(prodImg).then(r => r.blob()); fd.append('product_image', b, 'p.png'); } catch (_) { }
                }

                const res = await fetch(WEBHOOK_URL, { method: 'POST', body: fd });
                if (res.ok) {
                    const blob = await res.blob();
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-final-view-img').src = URL.createObjectURL(blob);
                    document.querySelector('.q-card-ia').classList.add('is-result');
                    document.getElementById('q-step-result').style.display = 'flex';
                    showSizeRecommendation();
                } else if (res.status === 401 || res.status === 403) {
                    document.getElementById('q-loading-box').style.display = 'none';
                    uploadStep.style.display = 'block';
                    alert("Provas virtuais indisponiveis nesta loja no momento.");
                } else { throw new Error(); }
            } catch (e) {
                document.getElementById('q-loading-box').style.display = 'none';
                uploadStep.style.display = 'block';
                alert('Ocorreu um erro ao processar sua imagem. Tente novamente.');
            }
        };
    }


    const isProductPage = window.location.pathname.includes('/produtos/') ||
        window.location.pathname.includes('/products/') ||
        document.querySelector('.js-product-detail, .js-product-container') !== null ||
        window.location.pathname.includes('preview.html') ||
        window.location.protocol === 'file:';

    if (isProductPage) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
        else init();
    }
})();

/**
 * Sistema de Decoraciones Navideñas Profesional
 * Incluye: Luces, Nieve, Estrellas, Confeti
 * Configuración desde el Back Office de PrestaShop
 */

class ChristmasDecorations {
    constructor() {
        // Configuración por defecto
        this.config = {
            lights: {
                enabled: true,
                count: 20,
                colors: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff'],
                blinkSpeed: 2000,
                showCable: true
            },
            snow: {
                enabled: true,
                type: 'classic',
                count: 50,
                speed: 1,
                size: 'medium',
                opacity: 0.8
            },
            stars: {
                enabled: true,
                count: 20,
                twinkleSpeed: 1500
            },
            confetti: {
                enabled: false,
                count: 30,
                colors: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff']
            }
        };

        // 1. Cargar configuración desde el back office si existe (configuración del admin)
        if (typeof psmxChristmasConfig !== 'undefined') {
            this.config.lights.enabled = psmxChristmasConfig.lights.enabled;
            this.config.lights.count = psmxChristmasConfig.lights.count;
            this.config.lights.showCable = psmxChristmasConfig.lights.showCable;

            this.config.snow.enabled = psmxChristmasConfig.snow.enabled;
            this.config.snow.type = psmxChristmasConfig.snow.type;
            this.config.snow.count = psmxChristmasConfig.snow.count;
            this.config.snow.speed = psmxChristmasConfig.snow.speed;
            this.config.snow.size = psmxChristmasConfig.snow.size;

            this.config.stars.enabled = psmxChristmasConfig.stars.enabled;
            this.config.stars.count = psmxChristmasConfig.stars.count;

            this.config.confetti.enabled = psmxChristmasConfig.confetti.enabled;
            this.config.confetti.count = psmxChristmasConfig.confetti.count;
        }

        // 2. Cargar personalizaciones del cliente desde localStorage (si existen)
        this.loadUserConfig();

        // Contenedores
        this.containers = {};

        // Animaciones activas
        this.animations = {
            snow: null,
            stars: null,
            confetti: null
        };
    }

    // Cargar personalizaciones del cliente desde localStorage
    loadUserConfig() {
        const saved = localStorage.getItem('psmx_christmas_user_config');
        if (saved) {
            try {
                const userConfig = JSON.parse(saved);
                // Sobreescribir solo los valores que el cliente personalizó
                Object.keys(userConfig).forEach(key => {
                    if (this.config[key]) {
                        this.config[key] = { ...this.config[key], ...userConfig[key] };
                    }
                });
            } catch (e) {
                console.error('Error cargando configuración del cliente:', e);
            }
        }
    }

    // Guardar personalizaciones del cliente
    saveUserConfig() {
        localStorage.setItem('psmx_christmas_user_config', JSON.stringify(this.config));
    }

    // Inicializar todas las decoraciones
    init() {
        // Crear panel de control para el cliente
        this.createControlPanel();
        if (this.config.lights.enabled) {
            this.initLights();
        }

        if (this.config.snow.enabled) {
            this.initSnow();
        }

        if (this.config.stars.enabled) {
            this.initStars();
        }

        if (this.config.confetti.enabled) {
            this.initConfetti();
        }
    }

    // Crear panel de control para el cliente
    createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'psmx-christmas-panel';
        panel.className = 'psmx-christmas-panel';

        const lightsHtml = `
            <div class="psmx-config-section">
                <div class="psmx-config-header">
                    <label class="psmx-switch">
                        <input type="checkbox" id="lights-enabled" ${this.config.lights.enabled ? 'checked' : ''}>
                        <span class="psmx-slider"></span>
                    </label>
                    <h4>💡 Luces</h4>
                </div>
                <div class="psmx-config-options">
                    <label>
                        Cantidad: <span id="lights-count-value">${this.config.lights.count}</span>
                        <input type="range" id="lights-count" min="10" max="50" value="${this.config.lights.count}">
                    </label>
                    <label>
                        <input type="checkbox" id="lights-cable" ${this.config.lights.showCable ? 'checked' : ''}>
                        Mostrar cable
                    </label>
                </div>
            </div>
        `;

        const snowHtml = `
            <div class="psmx-config-section">
                <div class="psmx-config-header">
                    <label class="psmx-switch">
                        <input type="checkbox" id="snow-enabled" ${this.config.snow.enabled ? 'checked' : ''}>
                        <span class="psmx-slider"></span>
                    </label>
                    <h4>❄️ Nieve</h4>
                </div>
                <div class="psmx-config-options">
                    <label>
                        Tipo:
                        <select id="snow-type">
                            <option value="classic" ${this.config.snow.type === 'classic' ? 'selected' : ''}>Clásica</option>
                            <option value="stars" ${this.config.snow.type === 'stars' ? 'selected' : ''}>Estrellas</option>
                            <option value="mixed" ${this.config.snow.type === 'mixed' ? 'selected' : ''}>Mixta</option>
                        </select>
                    </label>
                    <label>
                        Cantidad: <span id="snow-count-value">${this.config.snow.count}</span>
                        <input type="range" id="snow-count" min="10" max="150" value="${this.config.snow.count}">
                    </label>
                    <label>
                        Velocidad: <span id="snow-speed-value">${this.config.snow.speed}x</span>
                        <input type="range" id="snow-speed" min="0.5" max="3" step="0.5" value="${this.config.snow.speed}">
                    </label>
                    <label>
                        Tamaño:
                        <select id="snow-size">
                            <option value="small" ${this.config.snow.size === 'small' ? 'selected' : ''}>Pequeño</option>
                            <option value="medium" ${this.config.snow.size === 'medium' ? 'selected' : ''}>Mediano</option>
                            <option value="large" ${this.config.snow.size === 'large' ? 'selected' : ''}>Grande</option>
                        </select>
                    </label>
                </div>
            </div>
        `;

        const starsHtml = `
            <div class="psmx-config-section">
                <div class="psmx-config-header">
                    <label class="psmx-switch">
                        <input type="checkbox" id="stars-enabled" ${this.config.stars.enabled ? 'checked' : ''}>
                        <span class="psmx-slider"></span>
                    </label>
                    <h4>⭐ Estrellas</h4>
                </div>
                <div class="psmx-config-options">
                    <label>
                        Cantidad: <span id="stars-count-value">${this.config.stars.count}</span>
                        <input type="range" id="stars-count" min="5" max="50" value="${this.config.stars.count}">
                    </label>
                </div>
            </div>
        `;

        const confettiHtml = `
            <div class="psmx-config-section">
                <div class="psmx-config-header">
                    <label class="psmx-switch">
                        <input type="checkbox" id="confetti-enabled" ${this.config.confetti.enabled ? 'checked' : ''}>
                        <span class="psmx-slider"></span>
                    </label>
                    <h4>🎊 Confeti</h4>
                </div>
                <div class="psmx-config-options">
                    <label>
                        Cantidad: <span id="confetti-count-value">${this.config.confetti.count}</span>
                        <input type="range" id="confetti-count" min="10" max="100" value="${this.config.confetti.count}">
                    </label>
                </div>
            </div>
        `;

        panel.innerHTML = `
            <div class="psmx-panel-toggle" title="Configuración Navideña">
                <span class="psmx-panel-icon">🎄</span>
            </div>
            <div class="psmx-panel-content">
                <div class="psmx-panel-header">
                    <h3>🎄 Configuración del Cliente</h3>
                    <button class="psmx-panel-close">&times;</button>
                </div>
                <div class="psmx-panel-body">
                    <div class="psmx-quick-actions">
                        <button class="psmx-disable-all-btn">🚫 Desactivar Todo</button>
                        <button class="psmx-enable-all-btn">✅ Activar Todo</button>
                    </div>
                    ${lightsHtml}
                    ${snowHtml}
                    ${starsHtml}
                    ${confettiHtml}
                    <button class="psmx-apply-btn">Aplicar Cambios</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.bindPanelEvents();
    }

    // Eventos del panel
    bindPanelEvents() {
        const toggle = document.querySelector('.psmx-panel-toggle');
        const panel = document.querySelector('.psmx-panel-content');
        const close = document.querySelector('.psmx-panel-close');
        const applyBtn = document.querySelector('.psmx-apply-btn');
        const disableAllBtn = document.querySelector('.psmx-disable-all-btn');
        const enableAllBtn = document.querySelector('.psmx-enable-all-btn');

        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        close.addEventListener('click', () => {
            panel.classList.remove('active');
        });

        // Desactivar todo
        disableAllBtn.addEventListener('click', () => {
            document.getElementById('lights-enabled').checked = false;
            document.getElementById('snow-enabled').checked = false;
            document.getElementById('stars-enabled').checked = false;
            document.getElementById('confetti-enabled').checked = false;
        });

        // Activar todo
        enableAllBtn.addEventListener('click', () => {
            document.getElementById('lights-enabled').checked = true;
            document.getElementById('snow-enabled').checked = true;
            document.getElementById('stars-enabled').checked = true;
            document.getElementById('confetti-enabled').checked = true;
        });

        const ranges = panel.querySelectorAll('input[type="range"]');
        ranges.forEach(range => {
            range.addEventListener('input', (e) => {
                const valueSpan = document.getElementById(e.target.id + '-value');
                if (valueSpan) {
                    let value = e.target.value;
                    if (e.target.id === 'snow-speed') {
                        value += 'x';
                    }
                    valueSpan.textContent = value;
                }
            });
        });

        applyBtn.addEventListener('click', () => {
            this.updateConfig();
            this.saveUserConfig();
            this.reload();
            panel.classList.remove('active');
        });
    }

    // Actualizar configuración desde el panel
    updateConfig() {
        this.config.lights.enabled = document.getElementById('lights-enabled').checked;
        this.config.lights.count = parseInt(document.getElementById('lights-count').value);
        this.config.lights.showCable = document.getElementById('lights-cable').checked;

        this.config.snow.enabled = document.getElementById('snow-enabled').checked;
        this.config.snow.type = document.getElementById('snow-type').value;
        this.config.snow.count = parseInt(document.getElementById('snow-count').value);
        this.config.snow.speed = parseFloat(document.getElementById('snow-speed').value);
        this.config.snow.size = document.getElementById('snow-size').value;

        this.config.stars.enabled = document.getElementById('stars-enabled').checked;
        this.config.stars.count = parseInt(document.getElementById('stars-count').value);

        this.config.confetti.enabled = document.getElementById('confetti-enabled').checked;
        this.config.confetti.count = parseInt(document.getElementById('confetti-count').value);
    }

    // Recargar decoraciones
    reload() {
        this.cleanup();

        if (this.config.lights.enabled) {
            this.initLights();
        }

        if (this.config.snow.enabled) {
            this.initSnow();
        }

        if (this.config.stars.enabled) {
            this.initStars();
        }

        if (this.config.confetti.enabled) {
            this.initConfetti();
        }
    }

    // Limpiar decoraciones
    cleanup() {
        if (this.animations.snow) cancelAnimationFrame(this.animations.snow);
        if (this.animations.stars) cancelAnimationFrame(this.animations.stars);
        if (this.animations.confetti) cancelAnimationFrame(this.animations.confetti);

        Object.values(this.containers).forEach(container => {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });

        this.containers = {};
    }

    // Inicializar luces
    initLights() {
        const container = document.createElement('div');
        container.className = 'psmx-christmas-lights';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            pointer-events: none;
        `;

        // Cable
        if (this.config.lights.showCable) {
            const cable = document.createElement('div');
            cable.className = 'psmx-lights-cable';
            container.appendChild(cable);
        }

        // Crear luces
        const lightsWrapper = document.createElement('div');
        lightsWrapper.className = 'psmx-lights-wrapper';

        for (let i = 0; i < this.config.lights.count; i++) {
            const bulb = document.createElement('div');
            bulb.className = 'psmx-bulb';

            // Color aleatorio de la paleta
            const color = this.config.lights.colors[i % this.config.lights.colors.length];
            bulb.style.setProperty('--bulb-color', color);

            // Delay de animación aleatorio
            bulb.style.animationDelay = Math.random() * this.config.lights.blinkSpeed + 'ms';

            lightsWrapper.appendChild(bulb);
        }

        container.appendChild(lightsWrapper);
        document.body.appendChild(container);
        this.containers.lights = container;
    }

    // Inicializar nieve
    initSnow() {
        const canvas = document.createElement('canvas');
        canvas.className = 'psmx-snow-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.body.appendChild(canvas);
        this.containers.snow = canvas;

        const ctx = canvas.getContext('2d', { alpha: true });
        const particles = [];

        // Crear partículas
        const sizeMultiplier = this.config.snow.size === 'small' ? 0.5 :
                              this.config.snow.size === 'large' ? 1.5 : 1;

        for (let i = 0; i < this.config.snow.count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: (Math.random() * 3 + 1) * sizeMultiplier,
                density: Math.random() * this.config.snow.count,
                type: this.config.snow.type === 'mixed' ? (Math.random() > 0.5 ? 'snow' : 'star') :
                      this.config.snow.type === 'stars' ? 'star' : 'snow',
                speedY: Math.random() * 0.5 + 0.5,
                speedX: Math.random() * 0.5 - 0.25
            });
        }

        let angle = 0;
        let lastTime = performance.now();
        const targetFPS = 30; // Limitar a 30 FPS para mejor rendimiento
        const frameDelay = 1000 / targetFPS;
        let frameTimer = 0;

        const animate = (currentTime) => {
            if (!this.animations.snow) return; // Parar si se desactivó

            const deltaTime = currentTime - lastTime;
            frameTimer += deltaTime;

            // Solo actualizar cada frameDelay ms (throttling)
            if (frameTimer >= frameDelay) {
                // Limitar delta time para evitar saltos cuando se cambia de pestaña
                const safeDelta = Math.min(deltaTime, 100);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                angle += 0.01 * (safeDelta / 16.67); // Normalizar a 60fps

                particles.forEach((p, i) => {
                    if (p.type === 'snow') {
                        // Copos de nieve clásicos
                        ctx.fillStyle = `rgba(255, 255, 255, ${this.config.snow.opacity})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Estrellas de nieve (simplificadas)
                        this.drawSnowflake(ctx, p.x, p.y, p.radius * 2, 6);
                    }

                    // Actualizar posición con delta time
                    const speedMultiplier = (safeDelta / 16.67) * this.config.snow.speed;
                    p.y += p.speedY * speedMultiplier;
                    p.x += Math.sin(angle) * 0.5 * speedMultiplier;

                    // Resetear si sale de la pantalla
                    if (p.y > canvas.height + 10) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                    if (p.x > canvas.width + 10) {
                        p.x = -10;
                    } else if (p.x < -10) {
                        p.x = canvas.width + 10;
                    }
                });

                frameTimer = 0;
            }

            lastTime = currentTime;
            this.animations.snow = requestAnimationFrame(animate);
        };

        this.animations.snow = requestAnimationFrame(animate);

        // Ajustar tamaño en resize (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 250);
        });
    }

    // Dibujar copo de nieve (estrella)
    drawSnowflake(ctx, x, y, radius, points) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.config.snow.opacity})`;
        ctx.strokeStyle = `rgba(200, 230, 255, ${this.config.snow.opacity})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            const angle = (Math.PI * 2 * i) / points;
            const x1 = x + Math.cos(angle) * radius;
            const y1 = y + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x1, y1);
            } else {
                ctx.lineTo(x1, y1);
            }

            // Puntas internas
            const angleInner = (Math.PI * 2 * (i + 0.5)) / points;
            const x2 = x + Math.cos(angleInner) * (radius * 0.5);
            const y2 = y + Math.sin(angleInner) * (radius * 0.5);
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    // Inicializar estrellas brillantes
    initStars() {
        const container = document.createElement('div');
        container.className = 'psmx-stars-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
        `;

        for (let i = 0; i < this.config.stars.count; i++) {
            const star = document.createElement('div');
            star.className = 'psmx-star';
            star.innerHTML = '✨';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 50 + '%';
            star.style.animationDelay = Math.random() * this.config.stars.twinkleSpeed + 'ms';
            star.style.fontSize = (Math.random() * 10 + 10) + 'px';
            container.appendChild(star);
        }

        document.body.appendChild(container);
        this.containers.stars = container;
    }

    // Inicializar confeti
    initConfetti() {
        const canvas = document.createElement('canvas');
        canvas.className = 'psmx-confetti-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9996;
        `;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.body.appendChild(canvas);
        this.containers.confetti = canvas;

        const ctx = canvas.getContext('2d', { alpha: true });
        const particles = [];

        // Crear partículas de confeti
        for (let i = 0; i < this.config.confetti.count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 5 - 2.5,
                speed: Math.random() * 3 + 2,
                color: this.config.confetti.colors[Math.floor(Math.random() * this.config.confetti.colors.length)],
                size: Math.random() * 8 + 4
            });
        }

        let lastTime = performance.now();
        const targetFPS = 30;
        const frameDelay = 1000 / targetFPS;
        let frameTimer = 0;

        const animate = (currentTime) => {
            if (!this.animations.confetti) return;

            const deltaTime = currentTime - lastTime;
            frameTimer += deltaTime;

            if (frameTimer >= frameDelay) {
                const safeDelta = Math.min(deltaTime, 100);
                const speedMultiplier = safeDelta / 16.67;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach((p, i) => {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);

                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);

                    ctx.restore();

                    // Actualizar con delta time
                    p.y += p.speed * speedMultiplier;
                    p.rotation += p.rotationSpeed * speedMultiplier;

                    // Resetear
                    if (p.y > canvas.height + 20) {
                        p.y = -20;
                        p.x = Math.random() * canvas.width;
                    }
                });

                frameTimer = 0;
            }

            lastTime = currentTime;
            this.animations.confetti = requestAnimationFrame(animate);
        };

        this.animations.confetti = requestAnimationFrame(animate);

        // Ajustar tamaño en resize (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 250);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.christmasDecorations = new ChristmasDecorations();
    window.christmasDecorations.init();
});

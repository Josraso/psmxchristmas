/**
 * Sistema de Decoraciones Navideñas Profesional
 * Incluye: Luces, Nieve, Estrellas, Confeti
 * Con panel de configuración completo
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
                type: 'classic', // classic, stars, mixed
                count: 50,
                speed: 1,
                size: 'medium', // small, medium, large
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

        // Cargar configuración guardada
        this.loadConfig();

        // Contenedores
        this.containers = {};

        // Animaciones activas
        this.animations = {
            snow: null,
            stars: null,
            confetti: null
        };
    }

    // Cargar configuración desde localStorage
    loadConfig() {
        const saved = localStorage.getItem('psmx_christmas_config');
        if (saved) {
            try {
                const savedConfig = JSON.parse(saved);
                this.config = { ...this.config, ...savedConfig };
            } catch (e) {
                console.error('Error cargando configuración:', e);
            }
        }
    }

    // Guardar configuración
    saveConfig() {
        localStorage.setItem('psmx_christmas_config', JSON.stringify(this.config));
    }

    // Inicializar todas las decoraciones
    init() {
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

    // Crear panel de control
    createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'psmx-christmas-panel';
        panel.className = 'psmx-christmas-panel';
        panel.innerHTML = `
            <div class="psmx-panel-toggle" title="Configuración Navideña">
                <span class="psmx-panel-icon">🎄</span>
            </div>
            <div class="psmx-panel-content">
                <div class="psmx-panel-header">
                    <h3>🎄 Decoración Navideña</h3>
                    <button class="psmx-panel-close">&times;</button>
                </div>
                <div class="psmx-panel-body">
                    <!-- Luces -->
                    <div class="psmx-config-section">
                        <div class="psmx-config-header">
                            <label class="psmx-switch">
                                <input type="checkbox" id="lights-enabled" ${this.config.lights.enabled ? 'checked' : ''}>
                                <span class="psmx-slider"></span>
                            </label>
                            <h4>💡 Luces</h4>
                        </div>
                        <div class="psmx-config-options" id="lights-options">
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

                    <!-- Nieve -->
                    <div class="psmx-config-section">
                        <div class="psmx-config-header">
                            <label class="psmx-switch">
                                <input type="checkbox" id="snow-enabled" ${this.config.snow.enabled ? 'checked' : ''}>
                                <span class="psmx-slider"></span>
                            </label>
                            <h4>❄️ Nieve</h4>
                        </div>
                        <div class="psmx-config-options" id="snow-options">
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

                    <!-- Estrellas -->
                    <div class="psmx-config-section">
                        <div class="psmx-config-header">
                            <label class="psmx-switch">
                                <input type="checkbox" id="stars-enabled" ${this.config.stars.enabled ? 'checked' : ''}>
                                <span class="psmx-slider"></span>
                            </label>
                            <h4>⭐ Estrellas Brillantes</h4>
                        </div>
                        <div class="psmx-config-options" id="stars-options">
                            <label>
                                Cantidad: <span id="stars-count-value">${this.config.stars.count}</span>
                                <input type="range" id="stars-count" min="5" max="50" value="${this.config.stars.count}">
                            </label>
                        </div>
                    </div>

                    <!-- Confeti -->
                    <div class="psmx-config-section">
                        <div class="psmx-config-header">
                            <label class="psmx-switch">
                                <input type="checkbox" id="confetti-enabled" ${this.config.confetti.enabled ? 'checked' : ''}>
                                <span class="psmx-slider"></span>
                            </label>
                            <h4>🎊 Confeti Navideño</h4>
                        </div>
                        <div class="psmx-config-options" id="confetti-options">
                            <label>
                                Cantidad: <span id="confetti-count-value">${this.config.confetti.count}</span>
                                <input type="range" id="confetti-count" min="10" max="100" value="${this.config.confetti.count}">
                            </label>
                        </div>
                    </div>

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

        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        close.addEventListener('click', () => {
            panel.classList.remove('active');
        });

        // Actualizar valores en tiempo real
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

        // Aplicar cambios
        applyBtn.addEventListener('click', () => {
            this.updateConfig();
            this.saveConfig();
            this.reload();
            panel.classList.remove('active');
        });
    }

    // Actualizar configuración desde el panel
    updateConfig() {
        // Luces
        this.config.lights.enabled = document.getElementById('lights-enabled').checked;
        this.config.lights.count = parseInt(document.getElementById('lights-count').value);
        this.config.lights.showCable = document.getElementById('lights-cable').checked;

        // Nieve
        this.config.snow.enabled = document.getElementById('snow-enabled').checked;
        this.config.snow.type = document.getElementById('snow-type').value;
        this.config.snow.count = parseInt(document.getElementById('snow-count').value);
        this.config.snow.speed = parseFloat(document.getElementById('snow-speed').value);
        this.config.snow.size = document.getElementById('snow-size').value;

        // Estrellas
        this.config.stars.enabled = document.getElementById('stars-enabled').checked;
        this.config.stars.count = parseInt(document.getElementById('stars-count').value);

        // Confeti
        this.config.confetti.enabled = document.getElementById('confetti-enabled').checked;
        this.config.confetti.count = parseInt(document.getElementById('confetti-count').value);
    }

    // Recargar decoraciones
    reload() {
        // Limpiar todo
        this.cleanup();

        // Reinicializar
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
        // Detener animaciones
        if (this.animations.snow) cancelAnimationFrame(this.animations.snow);
        if (this.animations.stars) cancelAnimationFrame(this.animations.stars);
        if (this.animations.confetti) cancelAnimationFrame(this.animations.confetti);

        // Eliminar contenedores
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

        const ctx = canvas.getContext('2d');
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
                      this.config.snow.type === 'stars' ? 'star' : 'snow'
            });
        }

        let angle = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            angle += 0.01;

            particles.forEach((p, i) => {
                if (p.type === 'snow') {
                    // Copos de nieve clásicos
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.config.snow.opacity})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Estrellas de nieve
                    this.drawSnowflake(ctx, p.x, p.y, p.radius * 2, 6);
                }

                // Actualizar posición
                p.y += (Math.cos(angle + p.density) + 1 + p.radius / 2) * this.config.snow.speed;
                p.x += Math.sin(angle) * 2 * this.config.snow.speed;

                // Resetear si sale de la pantalla
                if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
                    particles[i] = {
                        x: Math.random() * canvas.width,
                        y: -10,
                        radius: p.radius,
                        density: p.density,
                        type: p.type
                    };
                }
            });

            this.animations.snow = requestAnimationFrame(animate);
        };

        animate();

        // Ajustar tamaño en resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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

        const ctx = canvas.getContext('2d');
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

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);

                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);

                ctx.restore();

                // Actualizar
                p.y += p.speed;
                p.rotation += p.rotationSpeed;

                // Resetear
                if (p.y > canvas.height) {
                    particles[i] = {
                        x: Math.random() * canvas.width,
                        y: -20,
                        rotation: Math.random() * 360,
                        rotationSpeed: p.rotationSpeed,
                        speed: p.speed,
                        color: p.color,
                        size: p.size
                    };
                }
            });

            this.animations.confetti = requestAnimationFrame(animate);
        };

        animate();

        // Ajustar tamaño en resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.christmasDecorations = new ChristmasDecorations();
    window.christmasDecorations.init();
});

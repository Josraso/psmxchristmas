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

        // Cargar configuración desde el back office si existe
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

        // Contenedores
        this.containers = {};

        // Animaciones activas
        this.animations = {
            snow: null,
            stars: null,
            confetti: null
        };
    }

    // Inicializar todas las decoraciones
    init() {
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

document.addEventListener('DOMContentLoaded', function() {
    // Luces de Navidad
    if (document.getElementById('psmxchristmas-lights')) {
        let luces = document.createElement('div');
        luces.classList.add('christmas-lights');
        for (let i = 0; i < 20; i++) {
            let bulb = document.createElement('span');
            bulb.classList.add('bulb');
            luces.appendChild(bulb);
        }
        document.getElementById('psmxchristmas-lights').appendChild(luces);
    }

    // Efecto copos de nieve
    if (document.getElementById('psmxchristmas-snow')) {
        let canvas = document.getElementById('psmxchristmas-snow');
        let ctx = canvas.getContext('2d');
        let W = window.innerWidth;
        let H = 200;
        canvas.width = W;
        canvas.height = H;
        let mp = 50;
        let particles = [];
        for (let i = 0; i < mp; i++) {
            particles.push({
                x: Math.random()*W,
                y: Math.random()*H,
                r: Math.random()*4+1,
                d: Math.random()*mp
            });
        }
        function draw() {
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.beginPath();
            for (let i = 0; i < mp; i++) {
                let p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
            }
            ctx.fill();
            update();
        }
        let angle = 0;
        function update() {
            angle += 0.01;
            for (let i = 0; i < mp; i++) {
                let p = particles[i];
                p.y += Math.cos(angle+p.d) + 1 + p.r/2;
                p.x += Math.sin(angle) * 2;
                if (p.x > W + 5 || p.x < -5 || p.y > H) {
                    if (i % 3 > 0) {
                        particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
                    } else {
                        if (Math.sin(angle) > 0) {
                            particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
                        } else {
                            particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
                        }
                    }
                }
            }
        }
        setInterval(draw, 33);
    }
});

/* Cursor dot */
const dot = document.querySelector('.cursor-dot');
document.addEventListener('mousemove', e => {
    dot.style.top = e.clientY + 'px';
    dot.style.left = e.clientX + 'px';
});

/* Menu toggle */
const menuToggle = document.getElementById('menuToggle'),
      sideMenu = document.getElementById('sideMenu'),
      closeBtn = document.querySelector('.close-btn');

function syncMenu() {
    sideMenu.classList.toggle('show', menuToggle.checked);
    document.body.classList.toggle('menu-open', menuToggle.checked);
}

menuToggle.addEventListener('change', syncMenu);
closeBtn.addEventListener('click', () => { menuToggle.checked = false; syncMenu() });
document.querySelectorAll('#sideMenu a').forEach(a => a.addEventListener('click', () => { menuToggle.checked = false; syncMenu() }));

/* Benefit tabs */
const tabs = document.querySelectorAll('#benefitList li'),
      benefitImg = document.getElementById('benefitImg'),
      images = [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=80', /* Dashboard/Data */
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80', /* Analytics */
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=960&q=80', /* Innovation/Tech Lab */
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=960&q=80'  /* Security/Cloud */
      ];

tabs.forEach(li => li.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    li.classList.add('active');
    benefitImg.src = images[li.dataset.idx];
}));

/* Animación de Nodos (Canvas) */
const canvas = document.getElementById('graph-canvas');
if (canvas) { 
    const ctx = canvas.getContext('2d');
    let width, height, nodes, mouse;

    const config = {
        nodeCount: 250,
        nodeRadius: 2.5,
        connectionDist: 100,
        rotationSpeed: 0.0005,
        mouseRepelDist: 150,
        nodeColor: '150, 200, 255',
    };

    class Node {
        constructor() {
            this.x = (Math.random() - 0.5) * (window.innerWidth);
            this.y = (Math.random() - 0.5) * (window.innerHeight);
            this.z = (Math.random() - 0.5) * (window.innerWidth);
            this.projX = 0;
            this.projY = 0;
            this.projScale = 0;
        }

        project(fov) {
            const scale = fov / (fov + this.z);
            this.projScale = scale;
            this.projX = this.x * scale + width / 2;
            this.projY = this.y * scale + height / 2;
        }

        draw() {
            this.project(width * 0.8);
            if (this.projX > 0 && this.projX < width && this.projY > 0 && this.projY < height) {
                ctx.beginPath();
                const radius = config.nodeRadius * this.projScale;
                const opacity = Math.min(this.projScale * 1.5, 1);
                ctx.fillStyle = `rgba(${config.nodeColor}, ${opacity})`;
                ctx.arc(this.projX, this.projY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function setup() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        } else {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        mouse = { x: width / 2, y: height / 2 };
        nodes = [];
        for (let i = 0; i < config.nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    function rotate(p, angleX, angleY) {
        let cosY = Math.cos(angleY);
        let sinY = Math.sin(angleY);
        let tempX = p.x * cosY - p.z * sinY;
        let tempZ = p.x * sinY + p.z * cosY;
        p.x = tempX;
        p.z = tempZ;

        let cosX = Math.cos(angleX);
        let sinX = Math.sin(angleX);
        let tempY = p.y * cosX - p.z * sinX;
        p.z = p.y * sinX + p.z * cosX;
        p.y = tempY;
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach(node => {
            rotate(node, config.rotationSpeed, config.rotationSpeed);
            node.draw();
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dx = n1.projX - n2.projX;
                const dy = n1.projY - n2.projY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.connectionDist) {
                    const opacity = 1 - (dist / config.connectionDist);
                    ctx.beginPath();
                    ctx.moveTo(n1.projX, n1.projY);
                    ctx.lineTo(n2.projX, n2.projY);
                    ctx.strokeStyle = `rgba(${config.nodeColor}, ${opacity * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }
    
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('resize', setup);
    
    setup();
    draw();
}
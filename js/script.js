/* Cursor dot */
const dot = document.querySelector('.cursor-dot');
if (dot) {
    document.addEventListener('mousemove', e => {
        dot.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
    });
}

/* Menu toggle */
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const closeBtn = document.querySelector('.close-btn');

function syncMenu() {
    if (!menuToggle || !sideMenu) return;
    sideMenu.classList.toggle('show', menuToggle.checked);
    document.body.classList.toggle('menu-open', menuToggle.checked);
}

if (menuToggle && sideMenu) {
    menuToggle.addEventListener('change', syncMenu);
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            menuToggle.checked = false;
            syncMenu();
        });
    }
    document.querySelectorAll('#sideMenu a').forEach(a => a.addEventListener('click', () => {
        menuToggle.checked = false;
        syncMenu();
    }));
}

/* Benefit tabs */
const tabs = document.querySelectorAll('#benefitList li');
const benefitImg = document.getElementById('benefitImg');
const images = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=960&q=80'
];

if (tabs.length && benefitImg) {
    tabs.forEach(li => li.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        li.classList.add('active');
        benefitImg.src = images[li.dataset.idx];
    }));
}

/* Blog content */
const blogPosts = {
    'llm-seguro': {
        title: 'Implementando Modelos de Lenguaje (LLMs) corporativos de forma segura',
        date: '12.02.2026',
        author: 'Equipo Quantics',
        readTime: '6 min de lectura',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1280&q=80',
        imageAlt: 'Candado holográfico sobre circuito digital',
        intro: 'Adoptar LLMs en la empresa requiere una arquitectura que combine productividad, cumplimiento y control operativo.',
        sections: [
            {
                heading: '1. Define límites claros para uso interno y externo',
                paragraphs: ['Los equipos de negocio deben operar con asistentes que separen entornos de prueba y productivos. Esto evita filtraciones involuntarias y acelera auditorías cuando se integran múltiples áreas.']
            },
            {
                heading: '2. Protege los datos sensibles desde el diseño',
                paragraphs: ['Aplica anonimización previa, enmascaramiento dinámico y políticas de retención por tipo de dato. La seguridad efectiva no ocurre al final del proyecto: se diseña junto con cada flujo conversacional.']
            },
            {
                heading: '3. Mide riesgos y desempeño continuamente',
                paragraphs: ['Monitorear prompts, respuestas y tasas de error permite detectar sesgos, alucinaciones y desviaciones del modelo. El gobierno continuo transforma la IA en una capacidad confiable para el negocio.'],
                bullets: ['Trazabilidad de prompts por unidad de negocio.', 'Alertas por respuesta fuera de política.', 'Reentrenamiento orientado a casos críticos.']
            }
        ]
    },
    'bi-accion': {
        title: 'De los datos a la acción: Estrategias de BI para líderes del mañana',
        date: '05.02.2026',
        author: 'Laboratorio de Datos Quantics',
        readTime: '5 min de lectura',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1280&q=80',
        imageAlt: 'Equipo revisando paneles analíticos',
        intro: 'El Business Intelligence moderno no se trata de más dashboards, sino de mejores decisiones con contexto.',
        sections: [
            {
                heading: 'Alinea métricas con decisiones reales',
                paragraphs: ['Cada KPI debe estar vinculado a una decisión operativa concreta y a un responsable. Sin esa relación, la analítica pierde impacto y se vuelve solo reporte histórico.']
            },
            {
                heading: 'Unifica fuentes y lenguaje',
                paragraphs: ['Un modelo semántico compartido evita debates sobre qué número es el correcto. Cuando ventas, finanzas y operaciones leen la misma verdad, la ejecución se acelera.']
            }
        ]
    },
    'agentes-rpa': {
        title: 'Agentes IA + RPA: el nuevo estándar para operaciones 24/7',
        date: '29.01.2026',
        author: 'Práctica de Automatización Quantics',
        readTime: '7 min de lectura',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1280&q=80',
        imageAlt: 'Brazo robótico en operación industrial',
        intro: 'Combinar RPA con agentes de IA permite pasar de tareas automatizadas a procesos completos autosupervisados.',
        sections: [
            {
                heading: 'De bots aislados a células autónomas',
                paragraphs: ['Los agentes interpretan contexto, deciden rutas de ejecución y activan bots RPA cuando se requieren acciones transaccionales. Esto reduce handoffs manuales y tiempos muertos.']
            }
        ]
    },
    'ia-gobierno': {
        title: 'Gobierno de IA: 6 prácticas para escalar sin perder control',
        date: '22.01.2026',
        author: 'Oficina de Transformación Quantics',
        readTime: '6 min de lectura',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1280&q=80',
        imageAlt: 'Directorio revisando estrategia empresarial',
        intro: 'Escalar IA exige un marco de gobierno práctico: liviano para innovar, robusto para cumplir.',
        sections: [
            {
                heading: 'El marco mínimo viable',
                paragraphs: ['Define comité transversal, catálogo de casos de uso, matriz de riesgos y criterios de aprobación. Con este núcleo, puedes crecer sin frenar la experimentación.']
            }
        ]
    },
    'costo-cloud': {
        title: 'FinOps inteligente: cómo reducir un 30% del gasto cloud con analítica predictiva',
        date: '15.01.2026',
        author: 'Equipo Cloud & Analytics Quantics',
        readTime: '5 min de lectura',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1280&q=80',
        imageAlt: 'Ingeniero optimizando infraestructura cloud',
        intro: 'Controlar costo cloud ya no depende de reportes mensuales: hoy se anticipa consumo y se ajusta capacidad en tiempo real.',
        sections: [
            {
                heading: 'Predicción + automatización financiera',
                paragraphs: ['Con modelos de demanda y reglas de apagado inteligente se reducen picos innecesarios. La visibilidad por producto habilita accountability real en cada equipo.']
            }
        ]
    }
};

const articleContainer = document.getElementById('blogArticle');
const relatedContainer = document.getElementById('relatedArticles');

if (articleContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const post = blogPosts[id] || blogPosts['llm-seguro'];

    document.title = `${post.title} – Quantics`;

    const sectionsHTML = post.sections.map(section => `
        <section>
            <h2>${section.heading}</h2>
            ${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
            ${section.bullets ? `<ul>${section.bullets.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
        </section>
    `).join('');

    articleContainer.innerHTML = `
        <a href="blog.html" class="view-all">Volver al Blog <span class="arrow"><i class="fas fa-arrow-up-right-from-square"></i></span></a>
        <div class="tag">Artículo</div>
        <h1>${post.title}</h1>
        <div class="article-meta"><span>${post.date}</span><span>${post.author}</span><span>${post.readTime}</span></div>
        <img src="${post.image}" alt="${post.imageAlt}" class="article-cover">
        <div class="article-content">
            <p>${post.intro}</p>
            ${sectionsHTML}
        </div>
    `;

    if (relatedContainer) {
        const relatedPosts = Object.entries(blogPosts).filter(([key]) => key !== id).slice(0, 2);
        relatedContainer.innerHTML = relatedPosts.map(([key, item]) => `
            <article class="article-card">
                <a href="blog-detalle.html?id=${key}"><img src="${item.image}" alt="${item.imageAlt}"></a>
                <h3 class="article-title"><a href="blog-detalle.html?id=${key}">${item.title}</a></h3>
                <p class="article-date">${item.date}</p>
            </article>
        `).join('');
    }
}

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
        nodeColor: '150, 200, 255'
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
        for (let i = 0; i < config.nodeCount; i++) nodes.push(new Node());
    }

    function rotate(p, angleX, angleY) {
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const tempX = p.x * cosY - p.z * sinY;
        p.z = p.x * sinY + p.z * cosY;
        p.x = tempX;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const tempY = p.y * cosX - p.z * sinX;
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

        /* Cursor dot (De tu código original) */
        const dot = document.querySelector('.cursor-dot');
        document.addEventListener('mousemove', e => {
            dot.style.top = e.clientY + 'px';
            dot.style.left = e.clientX + 'px';
        });

        /* Animación de Nodos (Canvas de tu código original) */
        const canvas = document.getElementById('graph-canvas');
        if (canvas) { 
            const ctx = canvas.getContext('2d');
            let width, height, nodes, mouse;

            const config = {
                nodeCount: 150, // Reducido un poco para rendimiento detrás del panel
                nodeRadius: 2,
                connectionDist: 100,
                rotationSpeed: 0.0005,
                nodeColor: '0, 180, 216', // Color Cyan de NexusAI
            };

            class Node {
                constructor() {
                    this.x = (Math.random() - 0.5) * (window.innerWidth);
                    this.y = (Math.random() - 0.5) * (window.innerHeight);
                    this.z = (Math.random() - 0.5) * (window.innerWidth);
                    this.projX = 0; this.projY = 0; this.projScale = 0;
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
                        const opacity = Math.min(this.projScale * 1.5, 0.8);
                        ctx.fillStyle = `rgba(${config.nodeColor}, ${opacity})`;
                        ctx.arc(this.projX, this.projY, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            function setup() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                nodes = [];
                for (let i = 0; i < config.nodeCount; i++) nodes.push(new Node());
            }

            function rotate(p, angleX, angleY) {
                let cosY = Math.cos(angleY); let sinY = Math.sin(angleY);
                let tempX = p.x * cosY - p.z * sinY; let tempZ = p.x * sinY + p.z * cosY;
                p.x = tempX; p.z = tempZ;
                let cosX = Math.cos(angleX); let sinX = Math.sin(angleX);
                let tempY = p.y * cosX - p.z * sinX; p.z = p.y * sinX + p.z * cosX;
                p.y = tempY;
            }
            
            function draw() {
                ctx.clearRect(0, 0, width, height);
                nodes.forEach(node => { rotate(node, config.rotationSpeed, config.rotationSpeed); node.draw(); });
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const n1 = nodes[i], n2 = nodes[j];
                        const dx = n1.projX - n2.projX, dy = n1.projY - n2.projY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < config.connectionDist) {
                            const opacity = 1 - (dist / config.connectionDist);
                            ctx.beginPath(); ctx.moveTo(n1.projX, n1.projY); ctx.lineTo(n2.projX, n2.projY);
                            ctx.strokeStyle = `rgba(${config.nodeColor}, ${opacity * 0.4})`;
                            ctx.lineWidth = 0.5; ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(draw);
            }
            window.addEventListener('resize', setup);
            setup(); draw();
        }

        /* --- LÓGICA DE LA APP --- */
        let companyData = {};

        function switchView(viewId) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${viewId}`).classList.add('active');
        }

        async function startFlow() {
            const name = document.getElementById('company-name').value;
            const ind = document.getElementById('industry').value;
            if(!name || !ind) return;
            
            companyData.name = name;
            companyData.industry = ind;
            document.getElementById('tag-company').innerText = name;

            switchView(2);

            setTimeout(() => {
                document.getElementById('loading-title').innerText = "Sintetizando modelo de datos";
                document.getElementById('loading-sub').innerText = "Iniciando motor de IA de Nexus...";
            }, 1500);

            setTimeout(() => {
                switchView(3);
                setTimeout(initiateInterview, 500);
            }, 3000);
        }

        function createMessage(content, sender, isTyping = false) {
            const wrapper = document.createElement('div');
            wrapper.className = `message ${sender}`;
            if(isTyping) wrapper.id = 'typing-indicator';

            const avatarIcon = sender === 'ai' ? `<i class="fas fa-brain"></i>` : `<i class="fas fa-user"></i>`;
            const bubbleContent = isTyping ? `<div class="dot-typing"><span></span><span></span><span></span></div>` : content;

            wrapper.innerHTML = `
                <div class="avatar">${avatarIcon}</div>
                <div class="bubble">${bubbleContent}</div>
            `;
            return wrapper;
        }

        function initiateInterview() {
            const history = document.getElementById('chat-history');
            const msg = createMessage(`He analizado la huella digital de <strong>${companyData.name}</strong>. Sabemos que en el sector de <em>${companyData.industry}</em>, la automatización es clave. Desde la dirección general, ¿cuál es el proceso manual que más frena el crecimiento de tu equipo hoy?`, 'ai');
            history.appendChild(msg);
        }

        function showTyping() {
            const history = document.getElementById('chat-history');
            history.appendChild(createMessage('', 'ai', true));
            history.scrollTop = history.scrollHeight;
        }

        function sendMessage() {
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            if(!text) return;

            const history = document.getElementById('chat-history');
            const existingTyping = document.getElementById('typing-indicator');
            if(existingTyping) existingTyping.remove();

            history.appendChild(createMessage(text, 'user'));
            input.value = '';
            history.scrollTop = history.scrollHeight;

            setTimeout(showTyping, 400);

            setTimeout(() => {
                document.getElementById('typing-indicator').remove();
                const response = createMessage("Interesante. Esa es una clara oportunidad para implementar RPA y Modelos Predictivos. Lo he registrado. Puedes continuar la charla o hacer clic en 'Finalizar Sesión' arriba para generar el reporte de auditoría.", 'ai');
                history.appendChild(response);
                history.scrollTop = history.scrollHeight;
            }, 2500);
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') sendMessage();
        }

        function finishInterview() {
            document.getElementById('loading-title').innerText = "Estructurando Output";
            document.getElementById('loading-sub').innerText = "Generando archivo JSON para el equipo de NexusAI...";
            switchView(2);

            setTimeout(() => {
                generateMockJSON();
                switchView(4);
            }, 2500);
        }

        function generateMockJSON() {
            const outputData = {
                metadata: {
                    empresa: companyData.name,
                    industria: companyData.industry,
                    agente_ia: "NexusAI Engine",
                    estado: "Completado"
                },
                diagnostico: {
                    cuello_de_botella: "Procesos manuales identificados",
                    solucion_propuesta: ["RPA", "LLM Integrado"],
                    potencial_automatizacion: "Alto"
                },
                transcripcion_extraida: true
            };

            const jsonString = JSON.stringify(outputData, null, 2);
            const highlightedJSON = jsonString
                .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
                .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
                .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');

            document.getElementById('json-output').innerHTML = highlightedJSON;
        }
    

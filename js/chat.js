/* Cursor dot */
const dot = document.querySelector('.cursor-dot');
document.addEventListener('mousemove', (e) => {
    if (!dot) return;
    dot.style.top = `${e.clientY}px`;
    dot.style.left = `${e.clientX}px`;
});

/* Animación de Nodos */
const canvas = document.getElementById('graph-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width;
    let height;
    let nodes;

    const config = {
        nodeCount: 150,
        nodeRadius: 2,
        connectionDist: 100,
        rotationSpeed: 0.0005,
        nodeColor: '0, 180, 216',
    };

    class Node {
        constructor() {
            this.x = (Math.random() - 0.5) * window.innerWidth;
            this.y = (Math.random() - 0.5) * window.innerHeight;
            this.z = (Math.random() - 0.5) * window.innerWidth;
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

            if (
                this.projX > 0 &&
                this.projX < width &&
                this.projY > 0 &&
                this.projY < height
            ) {
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

        for (let i = 0; i < config.nodeCount; i += 1) {
            nodes.push(new Node());
        }
    }

    function rotate(p, angleX, angleY) {
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const tempX = p.x * cosY - p.z * sinY;
        const tempZ = p.x * sinY + p.z * cosY;
        p.x = tempX;
        p.z = tempZ;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const tempY = p.y * cosX - p.z * sinX;
        p.z = p.y * sinX + p.z * cosX;
        p.y = tempY;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach((node) => {
            rotate(node, config.rotationSpeed, config.rotationSpeed);
            node.draw();
        });

        for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dx = n1.projX - n2.projX;
                const dy = n1.projY - n2.projY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.connectionDist) {
                    const opacity = 1 - dist / config.connectionDist;
                    ctx.beginPath();
                    ctx.moveTo(n1.projX, n1.projY);
                    ctx.lineTo(n2.projX, n2.projY);
                    ctx.strokeStyle = `rgba(${config.nodeColor}, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', setup);
    setup();
    draw();
}

/* --- LÓGICA DE LA APP --- */
let companyData = {};
let chatSessionId = null;
let isSendingMessage = false;
let humanVerificationToken = null;

const API_BASE_URL =
    window.NEXUS_API_BASE_URL || 'https://api-y2upbboyhq-tl.a.run.app/v1';

window.onTurnstileSuccess = function onTurnstileSuccess(token) {
    humanVerificationToken = token;
};

window.onTurnstileExpired = function onTurnstileExpired() {
    humanVerificationToken = null;
};

window.onTurnstileError = function onTurnstileError() {
    humanVerificationToken = null;
};

function switchView(viewId) {
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');
}

function createMessage(content, sender, isTyping = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${sender}`;
    if (isTyping) wrapper.id = 'typing-indicator';

    const avatarIcon =
        sender === 'ai'
            ? '<i class="fas fa-brain"></i>'
            : '<i class="fas fa-user"></i>';

    const bubbleContent = isTyping
        ? '<div class="dot-typing"><span></span><span></span><span></span></div>'
        : content;

    wrapper.innerHTML = `
        <div class="avatar">${avatarIcon}</div>
        <div class="bubble">${bubbleContent}</div>
    `;

    return wrapper;
}

function getChatHistoryElement() {
    return document.getElementById('chat-history');
}

function appendMessage(content, sender) {
    const history = getChatHistoryElement();
    if (!history) return;

    history.appendChild(createMessage(content, sender));
    history.scrollTop = history.scrollHeight;
}

function showTyping() {
    const history = getChatHistoryElement();
    if (!history) return;

    history.appendChild(createMessage('', 'ai', true));
    history.scrollTop = history.scrollHeight;
}

function hideTyping() {
    const existingTyping = document.getElementById('typing-indicator');
    if (existingTyping) existingTyping.remove();
}

function getChatInputElement() {
    return document.getElementById('chat-input');
}

function setChatInputEnabled(enabled) {
    const input = getChatInputElement();
    if (!input) return;

    input.disabled = !enabled;
    if (enabled) input.focus();
}

function isChatViewActive() {
    const view = document.getElementById('view-3');
    return Boolean(view && view.classList.contains('active'));
}

async function apiRequest(path, payload) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    let data = {};
    try {
        data = await response.json();
    } catch (_) {
        data = {};
    }

    if (!response.ok) {
        const message =
            data?.error?.message ||
            'No pudimos procesar la solicitud en este momento.';
        throw new Error(message);
    }

    return data;
}

async function startFlow() {
    const companyNameInput = document.getElementById('company-name');
    const industryInput = document.getElementById('industry');
    const contactEmailInput = document.getElementById('contact-email');

    const name = companyNameInput ? companyNameInput.value.trim() : '';
    const ind = industryInput ? industryInput.value.trim() : '';
    const email = contactEmailInput ? contactEmailInput.value.trim() : '';

    if (!name || !ind || !email) {
        alert('Completa nombre de empresa, rubro y email.');
        return;
    }

    if (!humanVerificationToken) {
        alert('Completa la validación de humano antes de iniciar el diagnóstico.');
        return;
    }

    companyData = {
        name,
        industry: ind,
        email,
    };

    const tagCompany = document.getElementById('tag-company');
    if (tagCompany) {
        tagCompany.innerText = name;
    }

    switchView(2);

    const loadingTitle = document.getElementById('loading-title');
    const loadingSub = document.getElementById('loading-sub');

    if (loadingTitle) loadingTitle.innerText = 'Conectando con nuestro Agente';
    if (loadingSub) loadingSub.innerText = '';

    try {
        const session = await apiRequest('/sessions', {
            company: {
                name,
                industry: ind,
            },
            contact: {
                email,
            },
            client: {
                locale: navigator.language || 'es-ES',
                timezone:
                    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            },
            captcha: {
                provider: 'turnstile',
                token: humanVerificationToken,
            },
        });

        chatSessionId = session.sessionId;

        switchView(3);
        const history = getChatHistoryElement();
        if (history) {
            history.innerHTML = '';
        }

        const initialMessage =
            session.assistantMessage ||
            'Sesión iniciada. ¿Qué reto quieres priorizar primero?';

        appendMessage(initialMessage, 'ai');
        setChatInputEnabled(true);

        humanVerificationToken = null;
    } catch (error) {
        switchView(1);
        alert(`No se pudo iniciar el diagnóstico: ${error.message}`);
    }
}

async function sendMessage() {
    const input = getChatInputElement();
    const text = input ? input.value.trim() : '';

    if (!text || isSendingMessage) return;

    if (!chatSessionId) {
        alert('La sesión aún no está inicializada. Reinicia el diagnóstico.');
        return;
    }

    isSendingMessage = true;
    setChatInputEnabled(false);

    appendMessage(text, 'user');
    if (input) input.value = '';
    showTyping();

    try {
        const data = await apiRequest(`/sessions/${chatSessionId}/messages`, {
            message: text,
        });

        hideTyping();

        const aiResponse =
            data.assistantMessage ||
            'He registrado tu respuesta para el diagnóstico.';

        appendMessage(aiResponse, 'ai');

        if (data.sessionCompleted === true) {
            await finishInterview();
            return;
        }
    } catch (error) {
        hideTyping();
        appendMessage(`No pude contactar al agente de IA. ${error.message}`, 'ai');
    } finally {
        isSendingMessage = false;

        if (isChatViewActive()) {
            setChatInputEnabled(true);
        }
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function finishInterview() {
    if (!chatSessionId) {
        alert('No existe una sesión activa para finalizar.');
        return;
    }

    const loadingTitle = document.getElementById('loading-title');
    const loadingSub = document.getElementById('loading-sub');

    if (loadingTitle) loadingTitle.innerText = 'Diagnóstico Finalizado';
    if (loadingSub) loadingSub.innerText = 'Procesando entrevista...';

    switchView(2);

    try {
        const result = await apiRequest(`/sessions/${chatSessionId}/finalize`, {
            format: 'json',
            includeTranscript: true,
        });

        renderJSONOutput(result.report || result);
        switchView(4);
    } catch (error) {
        switchView(3);
        appendMessage(`No pude finalizar el diagnóstico. ${error.message}`, 'ai');
        setChatInputEnabled(true);
    }
}

function renderJSONOutput(outputData) {
    const jsonString = JSON.stringify(outputData, null, 2);
    const highlightedJSON = jsonString
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');

    const output = document.getElementById('json-output');
    if (output) {
        output.innerHTML = highlightedJSON;
    }
}
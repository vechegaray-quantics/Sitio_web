const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        feedback.textContent = 'Por favor completa los campos obligatorios antes de enviar.';
        feedback.className = 'form-feedback error';
        form.reportValidity();
        return;
    }

    const data = new FormData(form);
    const name = data.get('name');

    feedback.textContent = `Gracias, ${name}. Hemos recibido tu solicitud y te contactaremos pronto.`;
    feedback.className = 'form-feedback success';
    form.reset();
});

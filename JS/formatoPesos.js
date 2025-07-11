export function aplicarFormatoPesos(selector) {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach((el) => {
        var _a;
        const texto = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.replace(/[^-\d]/g, ''); // conservar el signo "-"
        const valor = texto ? Number(texto) : NaN;
        if (!isNaN(valor)) {
            // Formatear valor
            el.textContent = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(valor);
            // Color rojo si es negativo
            el.style.color = valor < 0 ? '#b91c1c' : ''; // rojo oscuro si negativo
        }
    });
}

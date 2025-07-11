export function aplicarFormatoPesos(selector) {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach((el) => {
        var _a;
        const texto = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.replace(/[^-\d]/g, '');
        const valor = texto ? Number(texto) : NaN;
        if (!isNaN(valor)) {
            el.textContent = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(valor);
            el.style.color = valor < 0 ? '#b91c1c' : '';
        }
    });
}

    export function aplicarFormatoPesos(selector: string): void {
    const elementos = document.querySelectorAll<HTMLElement>(selector);

    elementos.forEach((el) => {
        const texto = el.textContent?.replace(/[^-\d]/g, ''); // conservar el signo "-"
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

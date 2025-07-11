    export function aplicarFormatoPesos(selector: string): void {
    const elementos = document.querySelectorAll<HTMLElement>(selector);

    elementos.forEach((el) => {
        const texto = el.textContent?.replace(/[^-\d]/g, ''); 
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

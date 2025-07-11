export class NotasManager {
    private notas: Array<{titulo: string, contenido: string}> = [];
    private notasContainer: HTMLElement;
    private mensajeElement: HTMLElement;
    private usuarioId: string;

    constructor() {
        
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
        this.usuarioId = usuarioActivo.documento || '';

        
        this.notasContainer = document.createElement('div');
        this.notasContainer.id = 'notas-container';
        this.notasContainer.style.marginTop = '20px';
        
        
        this.mensajeElement = document.createElement('div');
        this.mensajeElement.id = 'notas-mensaje';
        this.mensajeElement.style.cssText = `
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            display: none;
        `;

        
        const notasDiv = document.getElementById('notas');
        notasDiv?.insertBefore(this.mensajeElement, notasDiv.children[2]);
        notasDiv?.appendChild(this.notasContainer);

        this.cargarNotas();
        this.inicializarEventos();
    }

    private inicializarEventos(): void {
        document.getElementById('btnGuardarNotas')?.addEventListener('click', () => this.guardarNota());
        document.getElementById('btnCancelarNotas')?.addEventListener('click', () => this.cancelar());
    }

    private guardarNota(): void {
        const titulo = (document.getElementById('tituloNota') as HTMLInputElement).value.trim();
        const contenido = (document.getElementById('txtNotas') as HTMLTextAreaElement).value.trim();

        if (!titulo || !contenido) {
            this.mostrarMensaje('Por favor ingrese título y contenido', true);
            return;
        }

        this.notas.push({ titulo, contenido });
        this.guardarNotasEnStorage();
        this.mostrarNotas();
        this.limpiarFormulario();
        this.mostrarMensaje('Nota guardada exitosamente');
    }

    private mostrarNotas(): void {
        this.notasContainer.innerHTML = '';

        if (this.notas.length === 0) {
            this.notasContainer.innerHTML = '<p>No hay notas guardadas</p>';
            return;
        }

        this.notas.forEach((nota, index) => {
            const notaElement = document.createElement('div');
            notaElement.className = 'nota-item';

            const tituloElement = document.createElement('div');
            tituloElement.className = 'nota-titulo';
            tituloElement.innerHTML = `
                <span>${nota.titulo}</span>
                <button class="btn-eliminar">✖️</button>
            `;

            const contenidoElement = document.createElement('div');
            contenidoElement.className = 'nota-contenido';
            contenidoElement.textContent = nota.contenido;
            contenidoElement.style.display = 'none'; // Asegurar que empiece oculto

            tituloElement.addEventListener('click', () => {
                
                contenidoElement.style.display = contenidoElement.style.display === 'none' ? 'block' : 'none';
                
                
                const indicator = tituloElement.querySelector('.toggle-indicator');
                if (indicator) {
                    indicator.textContent = contenidoElement.style.display === 'none' ? '▶' : '▼';
                }
            });

            tituloElement.querySelector('.btn-eliminar')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.eliminarNota(index);
            });

            notaElement.appendChild(tituloElement);
            notaElement.appendChild(contenidoElement);
            this.notasContainer.appendChild(notaElement);
        });
    }

    private eliminarNota(index: number): void {
        this.notas.splice(index, 1);
        this.guardarNotasEnStorage();
        this.mostrarNotas();
        this.mostrarMensaje('Nota eliminada');
    }

    private cargarNotas(): void {
        const notasGuardadas = localStorage.getItem(`app-notas-${this.usuarioId}`);
        if (notasGuardadas) {
            this.notas = JSON.parse(notasGuardadas);
            this.mostrarNotas();
        }
    }

    private guardarNotasEnStorage(): void {
        localStorage.setItem(`app-notas-${this.usuarioId}`, JSON.stringify(this.notas));
    }

    private limpiarFormulario(): void {
        (document.getElementById('tituloNota') as HTMLInputElement).value = '';
        (document.getElementById('txtNotas') as HTMLTextAreaElement).value = '';
    }

    private cancelar(): void {
        document.getElementById('notas')!.style.display = 'none';
        document.getElementById('OpenSesion')!.style.display = 'block';
    }

    private mostrarMensaje(texto: string, esError: boolean = false): void {
        this.mensajeElement.textContent = texto;
        this.mensajeElement.style.display = 'block';
        this.mensajeElement.style.backgroundColor = esError ? '#FFEBEE' : '#E8F5E9';
        this.mensajeElement.style.color = esError ? '#C62828' : '#2E7D32';
        this.mensajeElement.style.borderLeft = `4px solid ${esError ? '#C62828' : '#2E7D32'}`;
        
        setTimeout(() => {
            this.mensajeElement.style.display = 'none';
        }, 5000);
    }
}
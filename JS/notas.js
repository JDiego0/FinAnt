export class NotasManager {
    constructor() {
        this.notas = [];
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
        notasDiv === null || notasDiv === void 0 ? void 0 : notasDiv.insertBefore(this.mensajeElement, notasDiv.children[2]);
        notasDiv === null || notasDiv === void 0 ? void 0 : notasDiv.appendChild(this.notasContainer);
        this.cargarNotas();
        this.inicializarEventos();
    }
    inicializarEventos() {
        var _a, _b;
        (_a = document.getElementById('btnGuardarNotas')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.guardarNota());
        (_b = document.getElementById('btnCancelarNotas')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.cancelar());
    }
    guardarNota() {
        const titulo = document.getElementById('tituloNota').value.trim();
        const contenido = document.getElementById('txtNotas').value.trim();
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
    mostrarNotas() {
        this.notasContainer.innerHTML = '';
        if (this.notas.length === 0) {
            this.notasContainer.innerHTML = '<p>No hay notas guardadas</p>';
            return;
        }
        this.notas.forEach((nota, index) => {
            var _a;
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
            (_a = tituloElement.querySelector('.btn-eliminar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
                e.stopPropagation();
                this.eliminarNota(index);
            });
            notaElement.appendChild(tituloElement);
            notaElement.appendChild(contenidoElement);
            this.notasContainer.appendChild(notaElement);
        });
    }
    eliminarNota(index) {
        this.notas.splice(index, 1);
        this.guardarNotasEnStorage();
        this.mostrarNotas();
        this.mostrarMensaje('Nota eliminada');
    }
    cargarNotas() {
        const notasGuardadas = localStorage.getItem(`app-notas-${this.usuarioId}`);
        if (notasGuardadas) {
            this.notas = JSON.parse(notasGuardadas);
            this.mostrarNotas();
        }
    }
    guardarNotasEnStorage() {
        localStorage.setItem(`app-notas-${this.usuarioId}`, JSON.stringify(this.notas));
    }
    limpiarFormulario() {
        document.getElementById('tituloNota').value = '';
        document.getElementById('txtNotas').value = '';
    }
    cancelar() {
        document.getElementById('notas').style.display = 'none';
        document.getElementById('OpenSesion').style.display = 'block';
    }
    mostrarMensaje(texto, esError = false) {
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

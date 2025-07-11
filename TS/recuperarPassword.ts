export class RecuperarPassword {
    private usuarioActivo: any;
    private mensajeElement: HTMLElement;

    constructor() {
        this.mensajeElement = document.getElementById("msgErrorRecuperacion")!;
        this.inicializarEventos();
        this.cargarUsuarioActivo();
    }

    private cargarUsuarioActivo(): void {
        const usuarioGuardado = localStorage.getItem('usuarioActivo');
        if (usuarioGuardado) {
            this.usuarioActivo = JSON.parse(usuarioGuardado);
            this.mostrarPreguntaSecreta();
        }
    }

    private mostrarPreguntaSecreta(): void {
        const preguntaElement = document.getElementById("PreguntaScretaGuardada")!;
        preguntaElement.textContent = this.usuarioActivo.preguntaSecreta || "No hay pregunta secreta registrada";
    }

    private inicializarEventos(): void {
        const btnComprobar = document.getElementById("btnComprobar")!;
        const btnCambiarContrasena = document.getElementById("btnCambiarContrasena")!;
        const btnCancelar = document.getElementById("btnCancelarRecuperacion")!;

        btnComprobar.addEventListener("click", () => this.validarDatos());
        btnCambiarContrasena.addEventListener("click", () => this.cambiarContrasena());
        btnCancelar.addEventListener("click", () => this.cancelarRecuperacion());
    }

    private validarDatos(): void {
        const respuesta = (document.getElementById("respuestaSecretaGuardada") as HTMLInputElement).value;
        const documento = (document.getElementById("documento") as HTMLInputElement).value;

        if (!respuesta || !documento) {
            this.mostrarMensaje("Por favor complete todos los campos", true);
            return;
        }

        if (documento !== this.usuarioActivo.documento) {
            this.mostrarMensaje("Documento incorrecto", true);
            return;
        }

        if (respuesta !== this.usuarioActivo.respuestaSecreta) {
            this.mostrarMensaje("Respuesta secreta incorrecta", true);
            return;
        }

        this.mostrarMensaje("Datos validados correctamente");
        document.getElementById("panelNuevaContra")!.style.display = "block";
    }

    private cambiarContrasena(): void {
        const nuevaContrasena = (document.getElementById("nuevaContrasena") as HTMLInputElement).value;
        const confirmacion = (document.getElementById("confirmaNuevaContrasena") as HTMLInputElement).value;

        if (!nuevaContrasena || !confirmacion) {
            this.mostrarMensaje("Por favor complete ambos campos", true);
            return;
        }

        if (nuevaContrasena !== confirmacion) {
            this.mostrarMensaje("Las contraseñas no coinciden", true);
            return;
        }

        
        this.actualizarContrasenaEnSistema(nuevaContrasena);
        this.mostrarMensaje("Contraseña cambiada exitosamente");

        setTimeout(() => {
            document.getElementById("olvidoPassword")!.style.display = "none";
            document.getElementById("Inicio")!.style.display = "block";
        }, 1500);
    }

    private actualizarContrasenaEnSistema(nuevaContrasena: string): void {
        
        const usuariosGuardados = localStorage.getItem('myApp_users_v1');
        if (!usuariosGuardados) return;

        const usuarios = JSON.parse(usuariosGuardados);
        
        
        const usuarioIndex = usuarios.findIndex((u: any) => u.documento === this.usuarioActivo.documento);
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].contrasena = nuevaContrasena;
            
            
            localStorage.setItem('myApp_users_v1', JSON.stringify(usuarios));
            
            
            this.usuarioActivo.contrasena = nuevaContrasena;
            localStorage.setItem('usuarioActivo', JSON.stringify(this.usuarioActivo));
        }
    }

    private cancelarRecuperacion(): void {
        document.getElementById("olvidoPassword")!.style.display = "none";
        document.getElementById("Inicio")!.style.display = "block";
        this.limpiarFormulario();
    }

    private limpiarFormulario(): void {
        (document.getElementById("respuestaSecretaGuardada") as HTMLInputElement).value = "";
        (document.getElementById("documento") as HTMLInputElement).value = "";
        (document.getElementById("nuevaContrasena") as HTMLInputElement).value = "";
        (document.getElementById("confirmaNuevaContrasena") as HTMLInputElement).value = "";
        document.getElementById("panelNuevaContra")!.style.display = "none";
        this.mensajeElement.textContent = "";
    }

    private mostrarMensaje(texto: string, esError: boolean = false): void {
        this.mensajeElement.textContent = texto;
        this.mensajeElement.style.color = esError ? "#C62828" : "#2E7D32";
        this.mensajeElement.style.fontWeight = "bold";
    }
}
export class RecuperarPassword {
    constructor() {
        this.mensajeElement = document.getElementById("msgErrorRecuperacion");
        this.inicializarEventos();
        this.cargarUsuarioActivo();
    }
    cargarUsuarioActivo() {
        const usuarioGuardado = localStorage.getItem('usuarioActivo');
        if (usuarioGuardado) {
            this.usuarioActivo = JSON.parse(usuarioGuardado);
            this.mostrarPreguntaSecreta();
        }
    }
    mostrarPreguntaSecreta() {
        const preguntaElement = document.getElementById("PreguntaScretaGuardada");
        preguntaElement.textContent = this.usuarioActivo.preguntaSecreta || "No hay pregunta secreta registrada";
    }
    inicializarEventos() {
        const btnComprobar = document.getElementById("btnComprobar");
        const btnCambiarContrasena = document.getElementById("btnCambiarContrasena");
        const btnCancelar = document.getElementById("btnCancelarRecuperacion");
        btnComprobar.addEventListener("click", () => this.validarDatos());
        btnCambiarContrasena.addEventListener("click", () => this.cambiarContrasena());
        btnCancelar.addEventListener("click", () => this.cancelarRecuperacion());
    }
    validarDatos() {
        const respuesta = document.getElementById("respuestaSecretaGuardada").value;
        const documento = document.getElementById("documento").value;
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
        document.getElementById("panelNuevaContra").style.display = "block";
    }
    cambiarContrasena() {
        const nuevaContrasena = document.getElementById("nuevaContrasena").value;
        const confirmacion = document.getElementById("confirmaNuevaContrasena").value;
        if (!nuevaContrasena || !confirmacion) {
            this.mostrarMensaje("Por favor complete ambos campos", true);
            return;
        }
        if (nuevaContrasena !== confirmacion) {
            this.mostrarMensaje("Las contraseñas no coinciden", true);
            return;
        }
        // Actualizar contraseña en localStorage
        this.actualizarContrasenaEnSistema(nuevaContrasena);
        this.mostrarMensaje("Contraseña cambiada exitosamente");
        setTimeout(() => {
            document.getElementById("olvidoPassword").style.display = "none";
            document.getElementById("Inicio").style.display = "block";
        }, 1500);
    }
    actualizarContrasenaEnSistema(nuevaContrasena) {
        // Obtener todos los usuarios
        const usuariosGuardados = localStorage.getItem('myApp_users_v1');
        if (!usuariosGuardados)
            return;
        const usuarios = JSON.parse(usuariosGuardados);
        // Encontrar y actualizar el usuario
        const usuarioIndex = usuarios.findIndex((u) => u.documento === this.usuarioActivo.documento);
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].contrasena = nuevaContrasena;
            // Guardar cambios
            localStorage.setItem('myApp_users_v1', JSON.stringify(usuarios));
            // Actualizar usuario activo
            this.usuarioActivo.contrasena = nuevaContrasena;
            localStorage.setItem('usuarioActivo', JSON.stringify(this.usuarioActivo));
        }
    }
    cancelarRecuperacion() {
        document.getElementById("olvidoPassword").style.display = "none";
        document.getElementById("Inicio").style.display = "block";
        this.limpiarFormulario();
    }
    limpiarFormulario() {
        document.getElementById("respuestaSecretaGuardada").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("nuevaContrasena").value = "";
        document.getElementById("confirmaNuevaContrasena").value = "";
        document.getElementById("panelNuevaContra").style.display = "none";
        this.mensajeElement.textContent = "";
    }
    mostrarMensaje(texto, esError = false) {
        this.mensajeElement.textContent = texto;
        this.mensajeElement.style.color = esError ? "#C62828" : "#2E7D32";
        this.mensajeElement.style.fontWeight = "bold";
    }
}

export class RegistroUsuario {
    constructor() {
        this.users = [];
        this.STORAGE_KEY = 'myApp_users_v1';
        this.btnRegistrar = document.getElementById("btnRegistrar");
        this.btnCancelarRegistro = document.getElementById("btnCancelarRegistro");
        this.registroUsuario = document.getElementById("registroUsuario");
        this.inicio = document.getElementById("Inicio");
        this.mensajeElement = document.createElement('div');
        this.mensajeElement.id = 'mensajeRegistro';
        this.mensajeElement.style.margin = '10px 0';
        this.mensajeElement.style.padding = '10px';
        this.mensajeElement.style.borderRadius = '5px';
        this.registroUsuario.appendChild(this.mensajeElement);
        this.cargarUsersDesdeLocalStorage();
        this.inicializarEventos();
    }
    mostrarMensaje(texto, esError = false) {
        this.mensajeElement.textContent = texto;
        this.mensajeElement.style.backgroundColor = esError ? '#ffebee' : '#e8f5e9';
        this.mensajeElement.style.color = esError ? '#c62828' : '#2e7d32';
        this.mensajeElement.style.display = 'block';
        setTimeout(() => {
            this.mensajeElement.style.display = 'none';
        }, 5000);
    }
    cargarUsersDesdeLocalStorage() {
        const usersGuardados = localStorage.getItem(this.STORAGE_KEY);
        if (usersGuardados) {
            this.users = JSON.parse(usersGuardados);
        }
    }
    guardarUsersEnLocalStorage() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    }
    inicializarEventos() {
        this.btnRegistrar.addEventListener("click", () => this.registrarNuevoUser());
        this.btnCancelarRegistro.addEventListener("click", () => this.cancelarRegistro());
    }
    registrarNuevoUser() {
        const nombre = document.getElementById("txtNombre").value;
        const documento = document.getElementById("txtDocumento").value;
        const telefono = document.getElementById("txtTelefono").value;
        const correo = document.getElementById("txtCorreo").value;
        const preguntaSecreta = document.getElementById("txtPreguntaSecreta").value;
        const respuestaSecreta = document.getElementById("txtRespuestaSecreta").value;
        const contrasena = document.getElementById("txtContrasenaRegistro").value;
        const confirmarContrasena = document.getElementById("txtConfirmarContrasena").value;
        if (contrasena !== confirmarContrasena) {
            this.mostrarMensaje("Las contraseñas no coinciden", true);
            return;
        }
        if (!nombre || !documento || !correo || !contrasena) {
            this.mostrarMensaje("Por favor complete todos los campos obligatorios", true);
            return;
        }
        if (this.users.some(user => user.documento === documento)) {
            this.mostrarMensaje("Este documento ya está registrado", true);
            return;
        }
        const nuevoUser = {
            id: Date.now(),
            nombre,
            documento,
            telefono,
            correo,
            preguntaSecreta,
            respuestaSecreta,
            contrasena
        };
        this.users.push(nuevoUser);
        this.guardarUsersEnLocalStorage();
        this.limpiarFormulario();
        this.mostrarMensaje("Usuario registrado con éxito. Redirigiendo...");
        setTimeout(() => {
            this.registroUsuario.style.display = "none";
            this.inicio.style.display = "block";
        }, 2000);
    }
    limpiarFormulario() {
        document.getElementById("txtNombre").value = "";
        document.getElementById("txtDocumento").value = "";
        document.getElementById("txtTelefono").value = "";
        document.getElementById("txtCorreo").value = "";
        document.getElementById("txtPreguntaSecreta").value = "";
        document.getElementById("txtRespuestaSecreta").value = "";
        document.getElementById("txtContrasenaRegistro").value = "";
        document.getElementById("txtConfirmarContrasena").value = "";
    }
    cancelarRegistro() {
        this.registroUsuario.style.display = "none";
        this.inicio.style.display = "block";
        this.limpiarFormulario();
    }
    obtenerUsers() {
        return this.users;
    }
    buscarUserPorCorreo(correo) {
        return this.users.find(user => user.correo === correo);
    }
}

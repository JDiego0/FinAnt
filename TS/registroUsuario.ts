export class RegistroUsuario {
    private users: Array<any> = [];
    private readonly STORAGE_KEY = 'myApp_users_v1';
    private mensajeElement: HTMLElement;

    private btnRegistrar: HTMLElement;
    private btnCancelarRegistro: HTMLElement;
    private registroUsuario: HTMLElement;
    private inicio: HTMLElement;

    constructor() {
        this.btnRegistrar = document.getElementById("btnRegistrar")!;
        this.btnCancelarRegistro = document.getElementById("btnCancelarRegistro")!;
        this.registroUsuario = document.getElementById("registroUsuario")!;
        this.inicio = document.getElementById("Inicio")!;
        
        
        this.mensajeElement = document.createElement('div');
        this.mensajeElement.id = 'mensajeRegistro';
        this.mensajeElement.style.margin = '10px 0';
        this.mensajeElement.style.padding = '10px';
        this.mensajeElement.style.borderRadius = '5px';
        this.registroUsuario.appendChild(this.mensajeElement);

        this.cargarUsersDesdeLocalStorage();
        this.inicializarEventos();
    }

    private mostrarMensaje(texto: string, esError: boolean = false): void {
        this.mensajeElement.textContent = texto;
        this.mensajeElement.style.backgroundColor = esError ? '#ffebee' : '#e8f5e9';
        this.mensajeElement.style.color = esError ? '#c62828' : '#2e7d32';
        this.mensajeElement.style.display = 'block';
        
        
        setTimeout(() => {
            this.mensajeElement.style.display = 'none';
        }, 5000);
    }

    private cargarUsersDesdeLocalStorage(): void {
        const usersGuardados = localStorage.getItem(this.STORAGE_KEY);
        if (usersGuardados) {
            this.users = JSON.parse(usersGuardados);
        }
    }

    private guardarUsersEnLocalStorage(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    }

    private inicializarEventos(): void {
        this.btnRegistrar.addEventListener("click", () => this.registrarNuevoUser());
        this.btnCancelarRegistro.addEventListener("click", () => this.cancelarRegistro());
    }

    private registrarNuevoUser(): void {
        const nombre = (document.getElementById("txtNombre") as HTMLInputElement).value;
        const documento = (document.getElementById("txtDocumento") as HTMLInputElement).value;
        const telefono = (document.getElementById("txtTelefono") as HTMLInputElement).value;
        const correo = (document.getElementById("txtCorreo") as HTMLInputElement).value;
        const preguntaSecreta = (document.getElementById("txtPreguntaSecreta") as HTMLInputElement).value;
        const respuestaSecreta = (document.getElementById("txtRespuestaSecreta") as HTMLInputElement).value;
        const contrasena = (document.getElementById("txtContrasenaRegistro") as HTMLInputElement).value;
        const confirmarContrasena = (document.getElementById("txtConfirmarContrasena") as HTMLInputElement).value;

        
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

    private limpiarFormulario(): void {
        (document.getElementById("txtNombre") as HTMLInputElement).value = "";
        (document.getElementById("txtDocumento") as HTMLInputElement).value = "";
        (document.getElementById("txtTelefono") as HTMLInputElement).value = "";
        (document.getElementById("txtCorreo") as HTMLInputElement).value = "";
        (document.getElementById("txtPreguntaSecreta") as HTMLInputElement).value = "";
        (document.getElementById("txtRespuestaSecreta") as HTMLInputElement).value = "";
        (document.getElementById("txtContrasenaRegistro") as HTMLInputElement).value = "";
        (document.getElementById("txtConfirmarContrasena") as HTMLInputElement).value = "";
    }

    private cancelarRegistro(): void {
        this.registroUsuario.style.display = "none";
        this.inicio.style.display = "block";
        this.limpiarFormulario();
    }

    public obtenerUsers(): Array<any> {
        return this.users;
    }

    public buscarUserPorCorreo(correo: string): any {
        return this.users.find(user => user.correo === correo);
    }
}
import { aplicarFormatoPesos } from "./formatoPesos.js";

export function inicioSesion() {
    // Obtener elementos del DOM
    const btnIniciar = document.getElementById("btnIniciar")!;
    const btnCancelar = document.getElementById("btnCancelar")!;
    const WindowIniciarSesion = document.getElementById("WindowIniciarSesion")!;
    const Inicio = document.getElementById("Inicio")!;
    const OpenSesion = document.getElementById("OpenSesion")!;
    const btnOlvidoPass = document.getElementById("btnOlvidoPass")!;
    const olvidoPassword = document.getElementById("olvidoPassword")!;
    // Crear elemento para mensajes
    const mensajeElement = document.createElement('div');
    mensajeElement.id = 'mensajeLogin';
    mensajeElement.style.cssText = `
        margin: 10px 0;
        padding: 12px;
        border-radius: 5px;
        display: none;
        font-family: Arial, sans-serif;
    `;
    WindowIniciarSesion.insertBefore(mensajeElement, WindowIniciarSesion.firstChild);

    // Función para mostrar mensajes
    const mostrarMensaje = (texto: string, esError: boolean = false) => {
        mensajeElement.textContent = texto;
        mensajeElement.style.display = 'block';
        mensajeElement.style.backgroundColor = esError ? '#FFEBEE' : '#E8F5E9';
        mensajeElement.style.color = esError ? '#C62828' : '#2E7D32';
        mensajeElement.style.borderLeft = `4px solid ${esError ? '#C62828' : '#2E7D32'}`;
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            mensajeElement.style.display = 'none';
        }, 5000);
    };

    // Evento para el botón de iniciar sesión
    btnIniciar.addEventListener("click", () => {
        const txtUsuario = (document.getElementById("txtUsuario") as HTMLInputElement).value;
        const txtContrasena = (document.getElementById("txtContrasena") as HTMLInputElement).value;

        // Validar campos vacíos
        if (!txtUsuario || !txtContrasena) {
            mostrarMensaje("Por favor ingrese documento y contraseña", true);
            return;
        }

        // Obtener usuarios del localStorage
        const usuariosGuardados = localStorage.getItem('myApp_users_v1');
        if (!usuariosGuardados) {
            mostrarMensaje("No hay usuarios registrados", true);
            return;
        }

        const usuarios = JSON.parse(usuariosGuardados);

        // Buscar usuario
        const usuarioValido = usuarios.find((user: any) => 
            user.documento === txtUsuario && user.contrasena === txtContrasena
        );

        if (usuarioValido) {
            mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...");
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                WindowIniciarSesion.style.display = "none";
                OpenSesion.style.display = "block";
                aplicarFormatoPesos(".valorMto");
                // Guardar sesión activa
                localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
            }, 1000);
        } else {
            mostrarMensaje("Documento o contraseña incorrectos", true);
        }
    });

    // Evento para el botón cancelar
    btnCancelar.addEventListener("click", () => {
        WindowIniciarSesion.style.display = "none";
        Inicio.style.display = "block";
        mensajeElement.style.display = "none";
    });

    btnOlvidoPass.addEventListener("click",()=>{
        WindowIniciarSesion.style.display="none";
        olvidoPassword.style.display = "block";
    })
}
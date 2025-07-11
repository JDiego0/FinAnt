import { inicio } from "./inicio.js";

import { NotasManager } from './notas.js';
import { inicioSesion } from './inicioSesion.js';
import { RegistroUsuario } from './registroUsuario.js';
import { RecuperarPassword } from './recuperarPassword.js';
import { accionesMenu } from "./accionesMenu.js";
import { ajustarSaldo } from "./ajustarSaldo.js";
import { registrarMovimiento } from "./registroMovimiento.js";
import { actualizarCuentas } from "./actualizarCuentas.js";




class MainApp {
    constructor() {
        this.inicializarModulos();
    }

    private inicializarModulos(): void {
        // Módulos que no requieren usuario activo
        new RegistroUsuario();
        new RecuperarPassword();
        inicioSesion();
        inicio();
        accionesMenu();
        ajustarSaldo();
        registrarMovimiento();
        actualizarCuentas(); 

        // Módulos que requieren usuario activo
        if (this.verificarUsuarioActivo()) {
            new NotasManager();
            
        }
    }

    private verificarUsuarioActivo(): boolean {
        return localStorage.getItem('usuarioActivo') !== null;
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});
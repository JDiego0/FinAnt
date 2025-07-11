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
        
        new RegistroUsuario();
        new RecuperarPassword();
        inicioSesion();
        inicio();
        accionesMenu();
        ajustarSaldo();
        registrarMovimiento();
        actualizarCuentas(); 

        
        if (this.verificarUsuarioActivo()) {
            new NotasManager();
            
        }
    }

    private verificarUsuarioActivo(): boolean {
        return localStorage.getItem('usuarioActivo') !== null;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});
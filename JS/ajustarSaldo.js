import { actualizarCuentas } from "./actualizarCuentas.js";
export function ajustarSaldo() {
    const ajustarSaldo = document.getElementById("ajustarSaldo");
    const selectCuentaAjuste = document.getElementById("selectCuentaAjuste");
    const txtNuevoSaldo = document.getElementById("txtNuevoSaldo");
    const botonAjustarSaldo = document.getElementById("botonAjustarSaldo");
    const btnCancelarAjuste = document.getElementById("btnCancelarAjuste");
    const OpenSesion = document.getElementById("OpenSesion");
    const msgActualizarSaldo = document.getElementById("msgActualizarSaldo");
    const cuentas = ["Efectivo", "Ahorros", "Inversiones"];
    cuentas.forEach(id => {
        const valorGuardado = localStorage.getItem(id);
        const elemento = document.getElementById(id);
        if (valorGuardado !== null && elemento) {
            elemento.textContent = valorGuardado;
        }
    });
    botonAjustarSaldo.addEventListener("click", () => {
        if (parseInt(txtNuevoSaldo.value) < 0 || isNaN(parseInt(txtNuevoSaldo.value))) {
            msgActualizarSaldo.textContent = "Por favor ingresa un valor valido";
        }
        else {
            let cuentaAfectada = selectCuentaAjuste.value;
            let valorActualizar = txtNuevoSaldo.value;
            document.getElementById(cuentaAfectada).textContent = valorActualizar;
            localStorage.setItem(cuentaAfectada, valorActualizar);
            msgActualizarSaldo.textContent = "Saldo actualizado exitosamente!";
            setTimeout(() => {
                msgActualizarSaldo.textContent = "";
                txtNuevoSaldo.value = "";
                ajustarSaldo.style.display = "none";
                OpenSesion.style.display = "block";
                actualizarCuentas();
            }, 2000);
        }
    });
    btnCancelarAjuste.addEventListener("click", () => {
        msgActualizarSaldo.textContent = "";
        txtNuevoSaldo.value = "";
        ajustarSaldo.style.display = "none";
        OpenSesion.style.display = "block";
    });
}

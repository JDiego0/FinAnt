import { actualizarCuentas } from "./actualizarCuentas.js";
import { aplicarFormatoPesos } from "./formatoPesos.js";
export function registrarMovimiento() {
    const tipo = document.getElementById("tipo");
    const txtFecha = document.getElementById("txtFecha");
    const txtDescripcion = document.getElementById("txtDescripcion");
    const txtValor = document.getElementById("txtValor");
    const selectCuenta = document.getElementById("selectCuenta");
    const botonRegistrarMovimiento = document.getElementById("botonRegistrarMovimiento");
    const btnCancelarMovimiento = document.getElementById("btnCancelarMovimiento");
    const registroMovimiento = document.getElementById("registroMovimiento");
    const OpenSesion = document.getElementById("OpenSesion");
    const msgRegistrarMovimiento = document.getElementById("msgRegistrarMovimiento");
    const Movimientos = document.getElementById("Movimientos");
    cargarMovimientosGuardados();
    actualizarCuentas();
    botonRegistrarMovimiento.addEventListener("click", () => {
        const tipoMov = tipo.value;
        const fechaMov = txtFecha.value;
        const descripcionMov = txtDescripcion.value;
        const valorMov = txtValor.value;
        const cuentaMov = selectCuenta.value;
        if (fechaMov === "" || descripcionMov === "" || valorMov === "") {
            msgRegistrarMovimiento.textContent = "Por favor completa todos los campos";
            return;
        }
        const movimiento = {
            id: Date.now(),
            tipo: tipoMov,
            fecha: fechaMov,
            descripcion: descripcionMov,
            valor: parseFloat(valorMov),
            cuenta: cuentaMov,
            aplicado: false // por defecto no aplicado
        };
        guardarMovimiento(movimiento);
        mostrarMovimiento(movimiento);
        aplicarFormatoPesos(".valorMto");
        msgRegistrarMovimiento.textContent = "Movimiento registrado exitosamente!";
        setTimeout(() => {
            msgRegistrarMovimiento.textContent = "";
            txtFecha.value = "";
            txtDescripcion.value = "";
            txtValor.value = "";
            registroMovimiento.style.display = "none";
            OpenSesion.style.display = "block";
        }, 2000);
    });
    btnCancelarMovimiento.addEventListener("click", () => {
        msgRegistrarMovimiento.textContent = "";
        txtFecha.value = "";
        txtDescripcion.value = "";
        txtValor.value = "";
        registroMovimiento.style.display = "none";
        OpenSesion.style.display = "block";
    });
    function guardarMovimiento(movimiento) {
        let movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos.push(movimiento);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
    }
    function eliminarMovimiento(id) {
        let movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos = movimientos.filter((mov) => mov.id !== id);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
    }
    function actualizarMovimientoEnStorage(movimientoActualizado) {
        let movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos = movimientos.map((mov) => mov.id === movimientoActualizado.id ? movimientoActualizado : mov);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
    }
    function actualizarSaldo(cuenta, valor, tipo, aplicar) {
        const cuentaActual = parseFloat(localStorage.getItem(cuenta) || "0");
        let nuevoSaldo = cuentaActual;
        if (aplicar) {
            nuevoSaldo += tipo === "ingreso" ? valor : -valor;
        }
        else {
            nuevoSaldo -= tipo === "ingreso" ? valor : -valor;
        }
        localStorage.setItem(cuenta, nuevoSaldo.toString());
    }
    function mostrarMovimiento(movimiento) {
        const fila = document.createElement("div");
        fila.classList.add("movimientoRow");
        fila.setAttribute("data-id", movimiento.id);
        fila.innerHTML = `
            <div class="${movimiento.tipo}">${movimiento.tipo.toUpperCase()}</div> 
            <div><input type="checkbox" ${movimiento.aplicado ? "checked" : ""}></div> 
            <div>${movimiento.fecha}</div>
            <div>${movimiento.descripcion}</div>
            <div class="valorMto">${movimiento.valor}</div> 
            <div>${movimiento.cuenta}</div> 
            <div><button class="delete-btn">✖</button></div>
        `;
        const chkAplicar = fila.querySelector("input[type='checkbox']");
        const btnEliminar = fila.querySelector(".delete-btn");
        chkAplicar.addEventListener("change", () => {
            movimiento.aplicado = chkAplicar.checked;
            actualizarSaldo(movimiento.cuenta, movimiento.valor, movimiento.tipo, movimiento.aplicado);
            actualizarMovimientoEnStorage(movimiento);
            actualizarCuentas();
        });
        btnEliminar.addEventListener("click", () => {
            const confirmacion = confirm("¿Seguro que deseas eliminar este movimiento?");
            if (confirmacion) {
                fila.remove();
                eliminarMovimiento(movimiento.id);
                // No revertimos efecto del checkbox ni tocamos los saldos
            }
        });
        Movimientos.appendChild(fila);
    }
    function cargarMovimientosGuardados() {
        const movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos.forEach((movimiento) => {
            mostrarMovimiento(movimiento);
        });
    }
}

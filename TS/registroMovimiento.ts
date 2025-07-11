import { actualizarCuentas } from "./actualizarCuentas.js";
import { aplicarFormatoPesos } from "./formatoPesos.js";



export function registrarMovimiento() {
    const tipo = document.getElementById("tipo") as HTMLInputElement;
    const txtFecha = document.getElementById("txtFecha") as HTMLInputElement;
    const txtDescripcion = document.getElementById("txtDescripcion") as HTMLInputElement;
    const txtValor = document.getElementById("txtValor") as HTMLInputElement;
    const selectCuenta = document.getElementById("selectCuenta") as HTMLInputElement;
    const botonRegistrarMovimiento = document.getElementById("botonRegistrarMovimiento")!;
    const btnCancelarMovimiento = document.getElementById("btnCancelarMovimiento")!;
    const registroMovimiento = document.getElementById("registroMovimiento")!;
    const OpenSesion = document.getElementById("OpenSesion")!;
    const msgRegistrarMovimiento = document.getElementById("msgRegistrarMovimiento") as HTMLSpanElement;
    const Movimientos = document.getElementById("Movimientos")!;

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
            aplicado: false 
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

    function guardarMovimiento(movimiento: any) {
        let movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos.push(movimiento);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
    }

    function eliminarMovimiento(id: number) {
        let movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos = movimientos.filter((mov: any) => mov.id !== id);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
    }

    function actualizarMovimientoEnStorage(movimientoActualizado: any) {
        let movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos = movimientos.map((mov: any) =>
            mov.id === movimientoActualizado.id ? movimientoActualizado : mov
        );
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
    }

    function actualizarSaldo(cuenta: string, valor: number, tipo: string, aplicar: boolean) {
        const cuentaActual = parseFloat(localStorage.getItem(cuenta) || "0");

        let nuevoSaldo = cuentaActual;

        if (aplicar) {
            nuevoSaldo += tipo === "ingreso" ? valor : -valor;
        } else {
            nuevoSaldo -= tipo === "ingreso" ? valor : -valor;
        }

        localStorage.setItem(cuenta, nuevoSaldo.toString());
    }

    function mostrarMovimiento(movimiento: any) {
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

        const chkAplicar = fila.querySelector("input[type='checkbox']") as HTMLInputElement;
        const btnEliminar = fila.querySelector(".delete-btn") as HTMLButtonElement;

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
                
            }
        });

        Movimientos.appendChild(fila);
    }

    function cargarMovimientosGuardados() {
        const movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
        movimientos.forEach((movimiento: any) => {
            mostrarMovimiento(movimiento);
        });
    }
}

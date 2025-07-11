import { aplicarFormatoPesos } from "./formatoPesos.js";

export function actualizarCuentas() {
    const efectivo = document.getElementById("Efectivo")!;
    const ahorros = document.getElementById("Ahorros")!;
    const inversiones = document.getElementById("Inversiones")!;
    const totalCtas = document.getElementById("totalCtas")!;

    const valEfectivo = parseFloat(localStorage.getItem("Efectivo") || "0");
    const valAhorros = parseFloat(localStorage.getItem("Ahorros") || "0");
    const valInversiones = parseFloat(localStorage.getItem("Inversiones") || "0");

    efectivo.textContent = valEfectivo.toString();
    efectivo.dataset.valor = valEfectivo.toString();

    ahorros.textContent = valAhorros.toString();
    ahorros.dataset.valor = valAhorros.toString();

    inversiones.textContent = valInversiones.toString();
    inversiones.dataset.valor = valInversiones.toString();

    const total = valEfectivo + valAhorros + valInversiones;
    totalCtas.textContent = total.toString();
    totalCtas.dataset.valor = total.toString();

    aplicarFormatoPesos('#Efectivo');
    aplicarFormatoPesos('#Ahorros');
    aplicarFormatoPesos('#Inversiones');
    aplicarFormatoPesos('#totalCtas');
    aplicarFormatoPesos(".valorMto");

}

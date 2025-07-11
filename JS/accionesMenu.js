export function accionesMenu() {
    const btnRegistrarMovimiento = document.getElementById("btnRegistrarMovimiento");
    const btnAjustarSaldo = document.getElementById("btnAjustarSaldo");
    const btnNotas = document.getElementById("btnNotas");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const OpenSesion = document.getElementById("OpenSesion");
    const registroMovimiento = document.getElementById("registroMovimiento");
    const ajustarSaldo = document.getElementById("ajustarSaldo");
    const notas = document.getElementById("notas");
    const Inicio = document.getElementById("Inicio");
    btnRegistrarMovimiento.addEventListener("click", () => {
        OpenSesion.style.display = "none";
        registroMovimiento.style.display = "block";
    });
    btnAjustarSaldo.addEventListener("click", () => {
        OpenSesion.style.display = "none";
        ajustarSaldo.style.display = "block";
    });
    btnNotas.addEventListener("click", () => {
        OpenSesion.style.display = "none";
        notas.style.display = "block";
    });
    btnCerrarSesion.addEventListener("click", () => {
        OpenSesion.style.display = "none";
        Inicio.style.display = "block";
    });
}

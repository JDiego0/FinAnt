export function inicio(){
    const btnInicioSesion = document.getElementById("btnIniciarSesion")!;
    const btnRegistrarUsuario = document.getElementById("btnRegUsuario")!;
    const WindowIniciarSesion = document.getElementById("WindowIniciarSesion")!;
    const Inicio = document.getElementById("Inicio")!;
    const registroUsuario = document.getElementById("registroUsuario")!;

    if (btnInicioSesion) {
        btnInicioSesion.addEventListener("click", () => {
        Inicio.style.display = "none";
        WindowIniciarSesion.style.display = "block";
        });
    }

    if (btnRegistrarUsuario) {
        btnRegistrarUsuario.addEventListener("click", () => {
        Inicio.style.display = "none";
        registroUsuario.style.display = "block";
        });
    }
}
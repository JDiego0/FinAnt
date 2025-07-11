import { actualizarCuentas } from "./actualizarCuentas.js";

export function ajustarSaldo(){
    const ajustarSaldo = document.getElementById("ajustarSaldo")!;
    const selectCuentaAjuste = document.getElementById("selectCuentaAjuste")as HTMLInputElement | HTMLSelectElement;
    const txtNuevoSaldo = document.getElementById("txtNuevoSaldo")as HTMLInputElement | HTMLSelectElement;
    const botonAjustarSaldo = document.getElementById("botonAjustarSaldo")!;
    const btnCancelarAjuste = document.getElementById("btnCancelarAjuste")!;
    const OpenSesion = document.getElementById("OpenSesion")!;
    const msgActualizarSaldo = document.getElementById("msgActualizarSaldo")as HTMLSpanElement;

    const cuentas = ["Efectivo", "Ahorros", "Inversiones"];

    cuentas.forEach(id => {
        const valorGuardado = localStorage.getItem(id); 
        const elemento = document.getElementById(id);   
        if (valorGuardado !== null && elemento) {
            elemento.textContent = valorGuardado;       
        }
    });

    botonAjustarSaldo.addEventListener("click",()=>{

        if(parseInt(txtNuevoSaldo.value) < 0 || isNaN(parseInt(txtNuevoSaldo.value)) )  {
            msgActualizarSaldo.textContent = "Por favor ingresa un valor valido"
        }else{

        let cuentaAfectada = selectCuentaAjuste.value;
        let valorActualizar = txtNuevoSaldo.value;
        (document.getElementById(cuentaAfectada)as HTMLInputElement | HTMLSelectElement).textContent = valorActualizar;

        localStorage.setItem(cuentaAfectada, valorActualizar);

        msgActualizarSaldo.textContent = "Saldo actualizado exitosamente!";

        setTimeout(()=>{
            msgActualizarSaldo.textContent = "";
            txtNuevoSaldo.value = "";
            ajustarSaldo.style.display = "none";
            OpenSesion.style.display = "block";
            actualizarCuentas();
        },2000);
            
        }
    })

    btnCancelarAjuste.addEventListener("click",()=>{
        msgActualizarSaldo.textContent = "";
        txtNuevoSaldo.value = "";
        ajustarSaldo.style.display = "none";
        OpenSesion.style.display = "block";
    })
}



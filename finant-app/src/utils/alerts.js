import Swal from 'sweetalert2';

const base = {
  confirmButtonColor: '#4f46e5',
  cancelButtonColor: '#f1f5f9',
  borderRadius: '1rem',
  fontFamily: 'Inter, sans-serif',
};

export const toast = (icon, title, timer = 2500) =>
  Swal.fire({
    ...base,
    toast: true,
    position: 'top-end',
    icon,
    title,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
  });

export const confirm = (title, text) =>
  Swal.fire({
    ...base,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#e2e8f0',
  });

export const alert = (icon, title, text) =>
  Swal.fire({ ...base, icon, title, text });
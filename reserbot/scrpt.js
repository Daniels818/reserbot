document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReserva");
    const mensaje = document.getElementById("mensaje");
  
    form.addEventListener("submit", (e) => {
      const nombre = form.nombre.value.trim();
      const fecha = form.fecha.value;
      const hora = form.hora.value;
      const servicio = form.servicio.value;
  
      // Validaciones
      if (nombre.length < 3) {
        e.preventDefault();
        mostrarMensaje("⚠ El nombre debe tener al menos 3 caracteres", "error");
        return;
      }
  
      if (!fecha || !hora) {
        e.preventDefault();
        mostrarMensaje("⚠ Debes elegir una fecha y una hora", "error");
        return;
      }
  
      if (!servicio) {
        e.preventDefault();
        mostrarMensaje("⚠ Selecciona un servicio", "error");
        return;
      }
  
      // Mensaje de confirmación
      mostrarMensaje("✅ Reserva enviada, por favor espera la confirmación...", "ok");
    });
  
    function mostrarMensaje(texto, tipo) {
      mensaje.textContent = texto;
      mensaje.style.padding = "10px";
      mensaje.style.borderRadius = "5px";
      if (tipo === "error") {
        mensaje.style.color = "white";
        mensaje.style.background = "red";
      } else {
        mensaje.style.color = "white";
        mensaje.style.background = "green";
      }
    }
  });
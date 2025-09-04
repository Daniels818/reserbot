// Configuración de Supabase - CAMBIAR POR TUS CREDENCIALES
const SUPABASE_URL = 'https://tuproyecto.supabase.co'; // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'tu_clave_anonima_aqui'; // Reemplaza con tu clave anónima

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReserva");
    const mensaje = document.getElementById("mensaje");

    // Event listener para el formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Siempre prevenir el envío normal del form
        
        const nombre = form.nombre.value.trim();
        const fecha = form.fecha.value;
        const hora = form.hora.value;
        const servicio = form.servicio.value;

        // Validaciones existentes
        if (nombre.length < 3) {
            mostrarMensaje("⚠️ El nombre debe tener al menos 3 caracteres", "error");
            return;
        }

        if (!fecha || !hora) {
            mostrarMensaje("⚠️ Debes elegir una fecha y una hora", "error");
            return;
        }

        if (!servicio) {
            mostrarMensaje("⚠️ Selecciona un servicio", "error");
            return;
        }

        // Validación adicional: fecha no puede ser en el pasado
        const fechaReserva = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaReserva < hoy) {
            mostrarMensaje("⚠️ No puedes hacer reservas en fechas pasadas", "error");
            return;
        }

        // Mostrar mensaje de carga
        mostrarMensaje("⏳ Procesando reserva...", "loading");

        // Enviar datos a Supabase
        try {
            const { data, error } = await supabase
                .from('reservas')
                .insert([
                    {
                        nombre: nombre,
                        fecha: fecha,
                        hora: hora,
                        servicio: servicio
                    }
                ]);

            if (error) {
                console.error('Error de Supabase:', error);
                mostrarMensaje("❌ Error al procesar la reserva: " + error.message, "error");
                return;
            }

            // Éxito
            mostrarMensaje("✅ ¡Reserva confirmada exitosamente!", "success");
            
            // Limpiar formulario
            form.reset();
            
            // Opcional: Cargar lista actualizada de reservas
            cargarReservas();
            
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje("❌ Error de conexión. Intenta nuevamente.", "error");
        }
    });

    // Función para mostrar mensajes (mejorada)
    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.style.padding = "15px";
        mensaje.style.borderRadius = "8px";
        mensaje.style.marginTop = "10px";
        mensaje.style.fontWeight = "bold";
        mensaje.style.textAlign = "center";
        
        switch(tipo) {
            case "error":
                mensaje.style.color = "white";
                mensaje.style.background = "#e74c3c";
                break;
            case "success":
                mensaje.style.color = "white";
                mensaje.style.background = "#27ae60";
                break;
            case "loading":
                mensaje.style.color = "white";
                mensaje.style.background = "#f39c12";
                break;
            default:
                mensaje.style.color = "white";
                mensaje.style.background = "#3498db";
        }

        // Auto-ocultar mensaje después de 5 segundos (excepto errores)
        if (tipo !== "error") {
            setTimeout(() => {
                mensaje.style.display = "none";
            }, 5000);
        }
        
        mensaje.style.display = "block";
    }

    // Función para cargar y mostrar reservas existentes (opcional)
    async function cargarReservas() {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .select('*')
                .order('fecha', { ascending: true });

            if (error) {
                console.error('Error al cargar reservas:', error);
                return;
            }

            // Si tienes un contenedor para mostrar reservas
            const listaReservas = document.getElementById("listaReservas");
            if (listaReservas && data) {
                mostrarListaReservas(data, listaReservas);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para mostrar lista de reservas (opcional)
    function mostrarListaReservas(reservas, contenedor) {
        if (reservas.length === 0) {
            contenedor.innerHTML = '<p>No hay reservas registradas</p>';
            return;
        }

        let html = '<h3>Reservas Registradas:</h3>';
        reservas.forEach(reserva => {
            html += `
                <div class="reserva-item" style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <strong>${reserva.nombre}</strong><br>
                    📅 ${reserva.fecha} a las ${reserva.hora}<br>
                    🏷️ ${reserva.servicio}<br>
                    <small>Creada: ${new Date(reserva.creado_en).toLocaleDateString()}</small>
                </div>
            `;
        });

        contenedor.innerHTML = html;
    }

    // Cargar reservas al inicio (opcional)
    cargarReservas();

    // Función para probar la conexión con Supabase
    async function probarConexion() {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .select('count', { count: 'exact' });
                
            if (error) {
                console.error('Error de conexión:', error);
                mostrarMensaje("❌ Error de conexión con la base de datos", "error");
            } else {
                console.log('Conexión exitosa con Supabase');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Probar conexión al cargar la página
    probarConexion();
});

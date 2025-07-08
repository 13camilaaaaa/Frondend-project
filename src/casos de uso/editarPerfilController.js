import Swal from "sweetalert2";
import { Validation } from "../helpers/Validation";

export function editarPerfilController() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        console.warn("No se encontró usuario en localStorage.");
        return;
    }

    // rellenar campos
    document.getElementById("nombre_input").value = usuario.nombre_usuario || "";
    document.getElementById("apellido_input").value = usuario.apellido_usuario || "";
    document.getElementById("cedula_input").value = usuario.numero_identificacion || "";
    document.getElementById("telefono_input").value = usuario.telefono_usuario || "";

    // cargar tipos de identificación desde la API
    async function cargarTiposIdentificacion() {
        try {
            const res = await fetch("http://localhost:3000/api/tipos-identificacion");
            const result = await res.json();
            const tipos = result.data;

            const select = document.getElementById("tipo_identificacion_input");

            tipos.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.id;
                option.textContent = tipo.nombre_tipo;

                if (usuario.id_tipo_identificacion && tipo.id === usuario.id_tipo_identificacion) {
                    option.selected = true;
                }

                select.appendChild(option);
            });

        } catch (error) {
            console.error("Error al cargar tipos de identificación", error);
        }
    }

    cargarTiposIdentificacion();

    // manejar envío del formulario
    const form = document.getElementById("formulario_editar_perfil");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

       // obtener valores
        const nombre = document.getElementById("nombre_input").value.trim();
        const apellido = document.getElementById("apellido_input").value.trim();
        const cedula = document.getElementById("cedula_input").value.trim();
        const telefono = document.getElementById("telefono_input").value.trim();
        const idTipoIdentificacion = parseInt(document.getElementById("tipo_identificacion_input").value);


        // validaciones básicas
        if (!Validation.isNotEmpty(nombre) || !Validation.isNotEmpty(apellido) || !Validation.isNotEmpty(cedula) || !Validation.isNotEmpty(telefono)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, completa todos los campos.",
            });
            return;
        }
        
        // Validación del nombre y apellido
        if (!Validation.isTextOnly(nombre) || !Validation.isTextOnly(apellido)) {
            Swal.fire("Error", "El nombre y apellido solo deben contener letras", "error");
            return;
        }
        if (!Validation.hasMinLength(nombre, 3) ||
            !Validation.hasMinLength(apellido, 3)) {
            Swal.fire("Error", "El nombre y apellido deben tener al menos 3 caracteres", "error");
            return;
        }
        if (!Validation.hasMaxLength(nombre, 50) ||
            !Validation.hasMaxLength(apellido, 50)) {
            Swal.fire("Error", "El nombre y apellido no pueden exceder los 50 caracteres", "error");
            return;
        }

        // Validación del teléfono
        if (!Validation.isNumberOnly(telefono)) {
            Swal.fire("Error", "El teléfono solo debe contener números", "error");
            return;
        }
        if (!Validation.hasMinLength(telefono, 10)) {
            Swal.fire("Error", "El teléfono debe tener al menos 10 dígitos", "error");
            return;
        }
        if (!Validation.hasMaxLength(telefono, 15)) {
            Swal.fire("Error", "El teléfono no puede exceder los 15 dígitos", "error");
            return;
        }

        // Validación de la cédula
        if (!Validation.isNumberOnly(cedula)) {
            Swal.fire("Error", "La cédula solo debe contener números", "error");
            return;
        }
        if (!Validation.isValidCedula(cedula)) {
            Swal.fire("Error","La cédula debe contener entre 6 y 10 números.", "error");
            return;
        }


        if (!idTipoIdentificacion || isNaN(idTipoIdentificacion)) {
            Swal.fire("Error", "Selecciona un tipo de identificación válido.", "error");
            return;
        }



        // construir payload
        const data = {
            id: usuario.id,
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            numero_identificacion: cedula,
            telefono_usuario: telefono,
            id_tipo_identificacion: idTipoIdentificacion
        };

        try {
    const response = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
        // actualizar localStorage
        const usuarioActualizado = { ...usuario, ...data };
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

        // mensaje SweetAlert bonito
        Swal.fire({
            icon: "success",
            title: "¡Perfil actualizado!",
            text: "Tus datos se han guardado correctamente.",
            confirmButtonText: "Volver al perfil",
            confirmButtonColor: "#3085d6"
        }).then(() => {
            location.hash = "#perfil";
        });

    } else {
        // error controlado por el servidor (por ejemplo, cédula duplicada)
        Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: result.message || "Verifica los datos ingresados.",
        });
    }

} catch (err) {
    console.error(err);
    Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: "Ocurrió un problema al guardar los cambios. Intenta más tarde.",
    });
}
})
}


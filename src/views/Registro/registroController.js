import Swal from "sweetalert2";
import { Validation } from "../../helpers/Validation";

export const registroController = async () => {
    await new Promise(requestAnimationFrame);

    const form = document.querySelector(".register-form");
    const nombre_usuario = document.querySelector("#nombre_usuario");
    const apellido_usuario = document.querySelector("#apellido_usuario");
    const correo_usuario = document.querySelector("#correo_usuario");
    const telefono_usuario = document.querySelector("#telefono_usuario");
    const contrasena = document.querySelector("#contrasena");
    const confirmPass = document.querySelector("#confirmar_contrasena");

    // 🎯 impedir números o símbolos en nombre y apellido
    const soloLetras = (inputElement) => {
        inputElement.addEventListener("input", () => {
            inputElement.value = inputElement.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
        });
    };

    const soloNumeros = (inputElement) => {
        inputElement.addEventListener("input", () =>
            inputElement.value = inputElement.value.replace(/[^0-9\s]/g, "")
        );
    };

    soloLetras(nombre_usuario);
    soloLetras(apellido_usuario);
    soloNumeros(telefono_usuario);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();


        if (!Validation.isNotEmpty(nombre_usuario.value) ||
            !Validation.isNotEmpty(apellido_usuario.value) ||
            !Validation.isNotEmpty(correo_usuario.value) ||
            !Validation.isNotEmpty(telefono_usuario.value) ||
            !Validation.isNotEmpty(contrasena.value)) {
            Swal.fire("Error", "Por favor, completa todos los campos", "error");
            return;
        }

        // Validación del nombre y apellido
        if (!Validation.hasMaxLength(nombre_usuario.value, 50) ||
            !Validation.hasMaxLength(apellido_usuario.value, 50)) {
            Swal.fire("Error", "El nombre y apellido no pueden exceder los 50 caracteres", "error");
            return;
        }
        if (!Validation.hasMinLength(nombre_usuario.value, 3) ||
            !Validation.hasMinLength(apellido_usuario.value, 3)) {
            Swal.fire("Error", "El nombre y apellido deben tener al menos 3 caracteres", "error");
            return;
        }

        // Validación del correo
        if (!Validation.hasMaxLength(correo_usuario.value, 100)) {
            Swal.fire("Error", "El correo electrónico no puede exceder los 100 caracteres", "error");
            return;
        }
        if (!Validation.isValidEmail(correo_usuario.value)) {
            Swal.fire("Error", "Por favor, ingresa un correo electrónico válido", "error");
            return;
        }

        // Validación del teléfono
        if (!Validation.hasMinLength(telefono_usuario.value, 10)) {
            Swal.fire("Error", "El teléfono debe tener al menos 10 dígitos", "error");
            return;
        }
        if (!Validation.hasMaxLength(telefono_usuario.value, 15)) {
            Swal.fire("Error", "El teléfono no puede exceder los 15 dígitos", "error");
            return;
        }

        // Validación de la contraseña
        if (!Validation.isValidPassword(contrasena.value)) {
            Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una minúscula y un número", "error");
            return;
        }
        if (contrasena.value !== confirmPass.value) {
            Swal.fire("Error", "Las contraseñas no coinciden", "error");
            return;
        }
        if (!Validation.hasMaxLength(contrasena.value, 100)) {
            Swal.fire("Error", "La contraseña no puede exceder los 100 caracteres", "error");
            return;
        }


        const data = {
            nombre_usuario: nombre_usuario.value,
            apellido_usuario: apellido_usuario.value,
            correo_usuario: correo_usuario.value,
            telefono_usuario: telefono_usuario.value,
            contrasena: contrasena.value
        };

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire("¡Registro exitoso!", "Ahora puedes iniciar sesión", "success");
                form.reset();
                location.hash = "#login";
            } else {
                Swal.fire("Error", result.message || "Hubo un problema al registrarte", "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Error en el servidor", "error");
        }
    });
};

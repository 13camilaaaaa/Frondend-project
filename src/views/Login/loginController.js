import Swal from "sweetalert2";
import { Validation } from "../../helpers/Validation";

export const loginController = async () => {
    await new Promise(requestAnimationFrame);

    console.log("loginController loaded and executed!"); // Verifica si el controlador se carga


    const form = document.querySelector(".login-form");
    const email = document.querySelector("#login-username");
    const password = document.querySelector("#login-password");

// Prevenir la re-ejecución del listener del formulario si el controlador se carga múltiples veces
    // Es buena práctica asegurarse de que un listener solo se adjunte una vez.
    if (form.dataset.listenerAttached) {
        return;
    }
    form.dataset.listenerAttached = 'true';

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!Validation.isNotEmpty(email.value) || !Validation.isNotEmpty(password.value)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, completa todos los campos.",
            });
            return;
        }

        if (!Validation.isValidEmail(email.value)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, ingresa un correo electrónico válido.",
            });
            return;
        }


        if (!Validation.isValidPassword(password.value)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una mayúscula y un número.",
            });
            return;
        }

        const data = {
            correo_usuario: email.value,
            contrasena: password.value
        };

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                const { usuario, token, token_refresco } = result.data;

                // guardar los datos en localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("refresh_token", token_refresco); // opcional
                localStorage.setItem("usuario", JSON.stringify(usuario));
                
                window.dispatchEvent(new Event('loginSuccess'));

                // mostrar mensaje de bienvenida
                Swal.fire({
                    icon: "success",
                    title: `¡Bienvenido, ${usuario.nombre_usuario || 'usuario'}!`,
                    showConfirmButton: false,
                    timer: 2000
                });

                // redireccionar a inicio y actualizar el header
                location.hash = "";
                window.dispatchEvent(new CustomEvent("modificarBotonSesion"));

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message || "Credenciales incorrectas"
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar al servidor."
            });
        }
    });
};


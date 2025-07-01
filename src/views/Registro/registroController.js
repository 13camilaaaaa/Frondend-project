import Swal from "sweetalert2";

export const registroController = async () => {
    await new Promise(requestAnimationFrame);

    const form = document.querySelector(".register-form");
    const nombre_usuario = document.querySelector("#nombre_usuario");
    const apellido_usuario = document.querySelector("#apellido_usuario");
    const correo_usuario = document.querySelector("#correo_usuario");
    const telefono_usuario = document.querySelector("#telefono_usuario");
    const contrasena = document.querySelector("#contrasena");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nombre_usuario: nombre_usuario.value,
            apellido_usuario: apellido_usuario.value,
            correo_usuario: correo_usuario.value,
            telefono_usuario: telefono_usuario.value,
            contrasena: contrasena.value
        };

        const confirmPass = document.querySelector("#confirmar_contrasena").value;

        if (data.contrasena !== confirmPass) {
            Swal.fire("Error", "Las contraseñas no coinciden", "error");
            return;
        }

        

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

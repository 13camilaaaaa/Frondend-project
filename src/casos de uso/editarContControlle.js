import Swal from "sweetalert2";
import { Validation } from "../helpers/Validation.js";

export const editarContController = () => {
    console.log("cargado editar contraseña");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        console.warn("No se encontró información del usuario.");
        return;
    }

    // saludo
    const saludo = document.querySelector(".saludo_usuario");
    if (saludo) {
        saludo.textContent = `Hola, ${usuario.nombre_usuario}!`;
    }

    // mostrar correo
    const notificationText = document.querySelector(".notification-text");
    if (notificationText && usuario.correo_usuario) {
        notificationText.innerHTML = `Se ha enviado un código de verificación a <strong>${usuario.correo_usuario}</strong>.`;
    }

    // elementos clave
    const resendBtn = document.querySelector(".btn-resend");
    const codigoInput = document.getElementById("codigo");
    const passwordInput = document.getElementById("nueva-contrasena");
    const saveBtn = document.querySelector(".btn-save-password");
    let codigoGenerado = null;
    let codigoValidado = false;

    // toggle contraseña
    const togglePassword = document.querySelector(".toggle-password");
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.querySelector("i").classList.toggle("fa-eye");
            togglePassword.querySelector("i").classList.toggle("fa-eye-slash");
        });
    }

    // reenviar código
    resendBtn.addEventListener('click', async () => {
        // muestra alerta de espera antes de enviar el correo
        Swal.fire({
            title: 'Enviando código...',
            text: 'Esto puede tardar unos segundos. Por favor espera.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading(); // muestra el spinner
            }
        });
        try {
            const resp = await fetch('http://localhost:3000/api/auth/enviar-codigo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: usuario.id,
                    correo: usuario.correo_usuario
                })
            });

            const data = await resp.json();
            if (data.success) {
                Swal.fire("Éxito", "Código enviado a tu correo 📩", "success");
            } else {
                Swal.fire("Error", data.message, "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo enviar el código", "error");
        }
    });


    // verificar código
    codigoInput.addEventListener("change", async () => {
        try {
            const resp = await fetch('http://localhost:3000/api/auth/verificar-codigo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: usuario.id,
                    codigo: codigoInput.value
                })
            });

            const data = await resp.json();
            if (data.success) {
                codigoValidado = true;
                saveBtn.disabled = false;
                Swal.fire("¡Código verificado!", "Ya puedes escribir tu nueva contraseña.", "success");
            } else {
                codigoValidado = false;
                saveBtn.disabled = true;
                Swal.fire("Código incorrecto", data.message, "error");
            }

        } catch (err) {
            console.error("Error al verificar el código:", err);
            Swal.fire("Error", "No se pudo verificar el código", "error");
        }
    });

    // guardar nueva contraseña
    saveBtn.addEventListener("click", async () => {
        if (!codigoValidado) return;

        const nuevaContrasena = passwordInput.value.trim();

        // Validación de la contraseña
        if (!Validation.isValidPassword(nuevaContrasena)) {
            Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una minúscula y un número", "error");
            return;
        }
        if (!Validation.hasMaxLength(nuevaContrasena, 100)) {
            Swal.fire("Error", "La contraseña no puede exceder los 100 caracteres", "error");
            return;
        }

        try {
            const resp = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}/contrasena`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contrasena: nuevaContrasena })
            });
            const result = await resp.json();

            if (resp.ok) {
                Swal.fire("¡Éxito!", "Tu contraseña ha sido actualizada correctamente.", "success").then(() => {
                    // redirigir después del OK
                    window.location.hash = "#autenticacion";
                });
                passwordInput.value = "";
                codigoInput.value = "";
                saveBtn.disabled = true;
                codigoValidado = false;
            } else {
                Swal.fire("Error", result.message || "No se pudo actualizar la contraseña", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error al actualizar la contraseña.", "error");
        }
    });

    // info importante
    const info = document.querySelector("#info_importante");
    info.addEventListener("click", async (e) => {
        Swal.fire({
            title: "Información importante 🛑",
            html: `
                <p><strong>¡Hola querido/a ${usuario.nombre_usuario}!</strong> Nos alegra mucho tenerte aquí 💛</p><br>
                <p>Queremos recordarte que el <strong>cambio de contraseña solo se puede realizar a través del correo electrónico que tienes registrado en tu cuenta</strong>.</p>
                <p>Por eso, asegúrate de tener acceso a tu correo antes de solicitar el código de verificación.</p>
                <p><strong>¿No te ha llegado el código?</strong><br>Espera unos segundos y revisa también tu carpeta de <em>Spam o Correo no deseado</em>.</p>
                <p>Si necesitas actualizar tu correo o tienes problemas para recibir el código, puedes escribirnos a través de nuestro canal de servicio al cliente 📩</p>
                <p>Gracias por tu confianza. ¡Estamos aquí para ayudarte! 💬🙌</p>
            `,
            icon: "info",
            confirmButtonText: "Entendido"
        });
    });
};

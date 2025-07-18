import Swal from "sweetalert2";
import { Validation } from "../helpers/Validation.js";

export const editarcorrController = () => {
    console.log("cargado editar correo");

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

    let codigoValidado = false;

    // mostrar el correo al que se enviará el código
    const textoCorreo = document.querySelector(".texto-correo-envio");
    if (textoCorreo) {
        textoCorreo.innerHTML = `Verifica tu correo <strong>${ocultarCorreo(usuario.correo_usuario)}</strong> para ingresar el código.`;
    }

    // botón reenviar código
    const btnReenviarCorreo = document.querySelector(".btn-reenviar-correo");
    if (btnReenviarCorreo) {
        btnReenviarCorreo.addEventListener("click", async () => {
            Swal.fire({
                title: "Un momento...",
                text: "Estamos generando el código de verificación. Por favor espera ⏳",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const response = await fetch("http://localhost:3000/api/auth/correo/reenviar-codigo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: usuario.id,
                        correo: usuario.correo_usuario
                    })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire("¡Código enviado!", `Se ha enviado un código al correo: ${ocultarCorreo(usuario.correo_usuario)}`, "success");
                } else {
                    Swal.fire("Error", data.message || "No se pudo enviar el código", "error");
                }
            } catch (error) {
                console.error("Error al reenviar código:", error);
                Swal.fire("Error", "Ocurrió un problema al enviar el código", "error");
            }
        });
    }

    const codigoInput = document.getElementById("codigo");
    const saveBtn = document.querySelector(".btn-save-password");

    codigoInput.addEventListener("change", async () => {
        const codigo = codigoInput.value.trim();

        if (!codigo) {
            return Swal.fire("Campo vacío", "Ingresa el código recibido en tu correo.", "warning");
        }

        try {
            const resp = await fetch('http://localhost:3000/api/auth/verificar-codigo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: usuario.id, codigo })
            });

            const data = await resp.json();
            if (data.success) {
                codigoValidado = true;
                saveBtn.disabled = false;
                Swal.fire("¡Código verificado!", "Ya puedes escribir tu nuevo correo.", "success");
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

    function ocultarCorreo(correo) {
        if (!correo || !correo.includes("@")) return "********";

        const [nombre, dominioCompleto] = correo.split("@");
        const dominioPartes = dominioCompleto.split(".");
        const dominioNombre = dominioPartes[0]; // parte antes del .com

        const visibleNombre = nombre[0];
        const visibleDominio = dominioNombre[0];
        const dominioRestante = dominioCompleto.slice(1); // incluye .com o .co

        return `${visibleNombre}${"*".repeat(nombre.length - 1)}@${visibleDominio}${"*".repeat(dominioNombre.length - 1)}.${dominioPartes.slice(1).join(".")}`;
    }

    saveBtn.addEventListener("click", async () => {
        const nuevoCorreo = document.getElementById("nuevo-correo").value.trim();

        if (!nuevoCorreo || !codigoInput.value.trim()) {
            return Swal.fire("Campos vacíos", "Por favor completa ambos campos.", "warning");
        }

        if (!codigoValidado) {
            return Swal.fire("Código no verificado", "Debes ingresar un código válido antes de actualizar tu correo.", "warning");
        }

        if (!Validation.isValidEmail(nuevoCorreo)) {
            return Swal.fire("Correo inválido", "Por favor ingresa un correo válido.", "warning");
        }

        try {
            const updateResp = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}/correo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nuevo_correo: nuevoCorreo })
            });

            const updateData = await updateResp.json();

            if (updateResp.ok) {
                Swal.fire("¡Correo actualizado!", "Tu correo electrónico ha sido cambiado exitosamente.", "success");

                // actualizar en localStorage
                usuario.correo_usuario = nuevoCorreo;
                localStorage.setItem("usuario", JSON.stringify(usuario));

                // limpiar campos
                document.getElementById("nuevo-correo").value = "";
                codigoInput.value = "";
                codigoValidado = false;
                saveBtn.disabled = true;
            } else {
                Swal.fire("Error", updateData.message || "No se pudo actualizar el correo.", "error");
            }
        } catch (error) {
            console.error("Error al validar o actualizar el correo:", error);
            Swal.fire("Error", "Ocurrió un error inesperado.", "error");
        }
    });

    // información importante
    const info = document.querySelector("#info_importante");
    info.addEventListener("click", () => {
        Swal.fire({
            title: "¡Atención importante! ⚠️",
            html: `
                <p><strong>Hola ${usuario.nombre_usuario} 👋</strong></p><br>
                <p>Queremos recordarte que tu <strong>correo electrónico registrado</strong> es un dato clave en tu cuenta.</p>
                <p>Es el medio que usamos para:</p>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>✔️ Enviar códigos de verificación</li>
                    <li>✔️ Recuperar tu contraseña</li>
                    <li>✔️ Notificarte sobre tu cuenta</li>
                </ul>
                <p>🔐 <strong>También es el correo con el que inicias sesión</strong>, así que por favor asegúrate de tener acceso a él antes de hacer cualquier cambio.</p>
                <p>Si modificas este correo, asegúrate de que sea uno válido, seguro y que puedas revisar con facilidad.</p>
                <p>¿No te llegó el código? Revisa tu bandeja de entrada y también la carpeta de <em>Spam o Correo no deseado</em>.</p>
                <p>Si necesitas ayuda, nuestro equipo de <strong>servicio al cliente</strong> está disponible para ti 💬</p>
                <p>Gracias por confiar en nosotros 💛</p>
            `,
            icon: "info",
            confirmButtonText: "Entendido"
        });
    });
};

import Swal from "sweetalert2";

export const autenticacionController = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        console.warn("No se encontró información del usuario.");
        return;
    }

    // saludo personalizado
    const saludo = document.querySelector(".saludo_usuario");
    if (saludo) {
        saludo.textContent = `Hola, ${usuario.nombre_usuario}!`;
    }

    // referencia a los elementos de texto
    const textoContrasena = document.querySelector(".contraseña-p");
    const textoCorreo = document.querySelector(".correo-p");

    // ✅ Validación basada en lógica: si el usuario tiene ID, asumimos que ya tiene contraseña
    if (usuario.id) {
        textoContrasena.textContent = "Usted ya tiene una contraseña definida.";
    } else {
        textoContrasena.textContent = "Aún no tiene una contraseña definida.";
    }

    // ✅ Validación del correo real desde el objeto
    if (usuario.correo_usuario && usuario.correo_usuario.trim() !== "") {
        textoCorreo.textContent = `Usted tiene un correo ya definido`;
    } else {
        textoCorreo.textContent = "Aún no ha registrado su correo.";
    }

    document.getElementById("editarContrasenaBtn").addEventListener("click", () => {
        location.hash = "#autenticacion/cont";
    });

    document.getElementById("editarCorreoBtn").addEventListener("click", () => {
        location.hash = "#autenticacion/corr";
    });


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

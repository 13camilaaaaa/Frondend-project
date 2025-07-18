// src/views/Perfil/perfilController.js

export function perfilController() {
    // obtener el objeto del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        console.warn("No se encontró información del usuario.");
        return;
    }

    // llenar los campos del perfil
    document.getElementById("nombre_cuenta").textContent = usuario.nombre_usuario || "";
    document.getElementById("apellido_cuenta").textContent = usuario.apellido_usuario || "";
    document.getElementById("email_cuenta").textContent = ocultarCorreo(usuario.correo_usuario);
    document.getElementById("cedula_cuenta").textContent = usuario.numero_identificacion || "N/A";
    document.getElementById("telefono_cuenta").textContent = usuario.telefono_usuario || "";

    // actualizar el saludo
    const saludo = document.querySelector(".saludo_usuario");
    if (saludo) {
        saludo.textContent = `Hola, ${usuario.nombre_usuario}!`;
    }

    document.getElementById("editarPerfilBtn").addEventListener("click", () => {
        location.hash = "#perfil/edit";
    });

    function ocultarCorreo(correo) {
    if (!correo || !correo.includes("@")) return "********";
    const [nombre, dominio] = correo.split("@");
    const visible = nombre[0];
    return `${visible}${"*".repeat(nombre.length - 1)}@${dominio}`;
}

}

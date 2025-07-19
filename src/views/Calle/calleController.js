export const calleController = () => {
    // obtener el objeto del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        console.warn("No se encontró información del usuario.");
        return;
    }
    // actualizar el saludo
    const saludo = document.querySelector(".saludo_usuario");
    if (saludo) {
        saludo.textContent = `Hola, ${usuario.nombre_usuario}!`;
    }
    const contenedor = document.getElementById("contenedor_direcciones");
    const mensaje = document.getElementById("mensaje_sin_direcciones");
    // limpiar
    mensaje.innerHTML = "";
    // validamos si hay datos de dirección
    if (
        usuario.direccion_tipo_via &&
        usuario.direccion_numero_via &&
        usuario.direccion_ciudad &&
        usuario.direccion_departamento &&
        usuario.direccion_pais
    ) {
        // construir dirección visualmente
        const direccionHTML = `
        <p>${usuario.direccion_tipo_via} ${usuario.direccion_numero_via}${usuario.direccion_complemento} -${usuario.direccion_barrio}</p>
        <p>${usuario.direccion_ciudad} ${usuario.direccion_departamento}</p>
        <p>${usuario.direccion_pais}</p>
    `;
        mensaje.innerHTML = direccionHTML;
    } else {
        mensaje.innerHTML = "<p>Aún no tienes una dirección registrada.</p>";
    }
    document.getElementById("btn_anadir_calle").addEventListener("click", () => {
        location.hash = "#calle/edit";
    });
};

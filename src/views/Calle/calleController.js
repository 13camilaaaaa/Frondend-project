// views/Calle/calleController.js
export const calleController = () => {
    // resalta el botón activo en el sidebar
    const links = document.querySelectorAll('.perfil-link');
    const hash = location.hash.replace("#", "");

    links.forEach(link => {
        const ruta = link.getAttribute("href").replace("#", "");
        if (ruta === hash) {
            link.classList.add("activo");
        } else {
            link.classList.remove("activo");
        }
    });

    // podrías también cargar datos desde el backend aquí si quieres
};

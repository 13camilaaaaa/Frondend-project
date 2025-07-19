export function modificarBotonSesion() {
    const authSection = document.querySelector("#authSection");
    const loginText = authSection.querySelector("span");
    const userContainer = document.querySelector("#user-info-container");

    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (token && usuario) {
        // limpiar lo anterior
        userContainer.innerHTML = "";

        const userInfo = document.createElement("div");
        userInfo.classList.add("user-info");

        userInfo.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${usuario.nombre_usuario}</span>
        `;

        userInfo.style.cursor = "pointer";
        userInfo.onclick = () => {
            location.hash = "#perfil";
        };

        userContainer.appendChild(userInfo);
        authSection.innerHTML = "";
        const cerrarIcon = document.createElement("i");
        cerrarIcon.classList.add("fas", "fa-sign-out-alt");
        cerrarIcon.style.marginRight = "5px";
        const cerrarText = document.createElement("span");
        cerrarText.classList.add("menu__link-text");
        cerrarText.textContent = "Cerrar sesión";
        authSection.append(cerrarIcon, cerrarText);
        authSection.onclick = () => {
            localStorage.clear();
            location.hash = "#login";
            window.dispatchEvent(new CustomEvent("modificarBotonSesion"));
        };
    } else {
        userContainer.innerHTML = "";
        loginText.textContent = "Iniciar sesión";
        authSection.onclick = () => {
            location.hash = "#login";
        };
    }
}


// src/componentes/modificarBotonSesion.js
import Swal from "sweetalert2";

export function modificarBotonSesion() {
    const authElement = document.querySelector("#authSection");
    if (!authElement) return;

    const token = localStorage.getItem("token");

    authElement.innerHTML = "";

    if (token) {
        const logoutIcon = document.createElement("i");
        logoutIcon.classList.add("fas", "fa-sign-out-alt");

        const logoutText = document.createElement("span");
        logoutText.textContent = "Cerrar sesión";
        logoutText.classList.add("menu__link-text");

        authElement.append(logoutIcon, logoutText);

        authElement.removeAttribute("href");

        authElement.onclick = (e) => {
            e.preventDefault();
            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Tu sesión será cerrada.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar"
            }).then(result => {
                if (result.isConfirmed) {
                    const usuario = JSON.parse(localStorage.getItem("usuario"));
                    const id = usuario?.id;

                    if (id) {
                        fetch("http://localhost:3000/api/auth/logout", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ id })
                        })
                        .then(res => res.json())
                        .then(res => {
                            if (res.success) {
                                localStorage.clear();
                                location.hash = "#login";
                                window.dispatchEvent(new CustomEvent("modificarBotonSesion"));
                            } else {
                                Swal.fire("Error", "No se pudo cerrar sesión correctamente.", "error");
                            }
                        })
                        .catch(err => {
                            console.error("Error al cerrar sesión:", err);
                            Swal.fire("Error", "Fallo de conexión al cerrar sesión.", "error");
                        });
                    } else {
                        localStorage.clear();
                        location.hash = "#login";
                        window.dispatchEvent(new CustomEvent("modificarBotonSesion"));
                    }
                }
            });
        };
    } else {
        authElement.setAttribute("href", "#login");
        authElement.onclick = null;

        const loginIcon = document.createElement("i");
        loginIcon.classList.add("fas", "fa-user");

        const loginText = document.createElement("span");
        loginText.textContent = "Iniciar sesión";
        loginText.classList.add("menu__link-text");

        authElement.append(loginIcon, loginText);
    }
}

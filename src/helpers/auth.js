export const estaAutenticado = () => {
    if (localStorage.accessToken === undefined) {
        // alert("Usuario no autenticado");
        return false
    } else {
        // alert("Usuario autenticado");
        return true;
    }
}

import Swal from "sweetalert2";

const API_URL = "http://localhost:3000";

export const fetchConToken = async (url, options = {}) => {
    let token = localStorage.getItem("token");

    // Agrega el token si existe
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    let response = await fetch(`${API_URL}${url}`, options);

    // Si el token expiró, intenta renovar
    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
            const refreshResp = await fetch(`${API_URL}/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken })
            });

            const refreshData = await refreshResp.json();

            if (refreshData.success && refreshData.data?.token) {
                // actualizar token
                localStorage.setItem("token", refreshData.data.token);

                // reintentar petición original con nuevo token
                options.headers.Authorization = `Bearer ${refreshData.data.token}`;
                response = await fetch(`${API_URL}${url}`, options);
            } else {
                // si falla la renovación, cerrar sesión
                mostrarAlertaSesionExpirada();
                return null;
            }
        } else {
            mostrarAlertaSesionExpirada();
            return null;
        }
    }

    return response;
};

function mostrarAlertaSesionExpirada() {
    Swal.fire({
        title: "Sesión expirada",
        text: "Debes iniciar sesión nuevamente.",
        icon: "warning",
        confirmButtonText: "Aceptar"
    }).then(() => {
        localStorage.clear();
        location.hash = "#login";
        window.dispatchEvent(new CustomEvent("modificandoHeader"));
    });
}

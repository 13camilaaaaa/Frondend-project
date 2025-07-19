
import { jwtDecode } from "jwt-decode";

export const estaAutenticado = () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        const ahora = Date.now() / 1000;

        if (exp < ahora) {
            return renovarToken(refreshToken);
        }
        return true;
    } catch (error) {
        return false;
    }
};

const renovarToken = async (refreshToken) => {
    if (!refreshToken) return false;
    try {
        const response = await fetch("http://localhost:3000/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await response.json();
        if (data.success && data.data?.token) {
            localStorage.setItem("token", data.data.token);
            return true;
        }
        localStorage.clear();
        return false;
    } catch (err) {
        localStorage.clear();
        return false;
    }
};

// src/router/router.js
import { inicioController } from "../views/Inicio/inicioController.js";
import { generosController } from "../views/Generos/generosController.js"; // Asegúrate de esta importación
import { contactoController } from "../views/Contacto/contactoController.js";
import { buscarController } from "../views/Buscar/buscarController.js"; // Asegúrate de esta importación
// Controladores para Autenticación (separados)
import { loginController } from "../views/Login/loginController.js";
import { registroController } from "../views/Registro/registroController.js";


import { loadView } from "../helpers/loadView.js";

const routes = {
    "/": {// lo que se visualiza al ingresar a la aplicación
        template: "Inicio/index.html",
        controlador: inicioController,
        // private: false
    },
    contacto: { // se visualiza el servicio al cliente
        template: "Contacto/index.html",
        controlador: contactoController,
        // private: false
    },
    login: { // se visualiza el formulario de inicio de sesión
        template: "Login/index.html",
        controlador: loginController,
        // private: false 
    },
    registro: { // se visualiza el formulario de registro
        template: "Registro/index.html",
        controlador: registroController,
        // private: false
    },
    'productos/:generos': {
        template: "Generos/index.html",
        controlador: generosController,
        // private: false
    },
    'buscar/:query': {
        template: "Buscar/index.html",
        controlador: buscarController,
        // private: false
    }
};

export const router = async (app) => {
    const hash = location.hash.slice(1);
    const [rutas, params] = matchRoute(hash);
    // 
    if (!rutas) {
        await loadView(app, 'Inicio/index.html');
        inicioController();
        return;
    }

    // if (rutas.private && !estaAutenticado()) {
    //     location.hash = "#login"
    //     return;
    // }
    // Llamando la vista
    await loadView(app, rutas.template);
    // Ejecutar el controldor
    requestAnimationFrame(() => {
        rutas.controlador(params);
    });

};

const matchRoute = (hash) => {
    const arreglo = hash.split("/");

    for (const route in routes) {
        const b = route.split("/");
        if (b.length !== arreglo.length) continue;
        const params = {};

        const matched = b.every((parte, i) => {
            if (parte.startsWith(":")) {
                const partName = parte.slice(1);
                const value = arreglo[i];
                params[partName] = value;
                return true;
            }
            if (parte === arreglo[i]) {
                return true;
            }
        });

        if (matched) {
            return [routes[route], params];
        }
    }
    return [null, null];
};
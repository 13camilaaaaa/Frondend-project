// src/router/router.js
import { inicioController } from "../views/Inicio/inicioController.js";
import { productosController } from "../views/Productos/productoController.js"; // Asegúrate de esta importación
import { contactoController } from "../views/Contacto/contactoController.js";

// Controladores para Autenticación (separados)
import { loginController } from "../views/Login/loginController.js";
import { registroController } from "../views/Registro/registroController.js";


import { loadView } from "../helpers/loadView.js";

const routes = {
    "/": {// lo que se visualiza al ingresar a la aplicación
        template: "Inicio/index.html",
        controlador: inicioController
    },
    // inicio: {// lo que se visualiza al ingresar a la aplicación
    //     template: "Inicio/index.html",
    //     controlador: inicioController
    // },
    tienda: { // se visualiza todos los productos
        template: "Tienda/index.html",
        controlador: productosController
    },
    contacto: { // se visualiza el servicio al cliente
        template: "Contacto/index.html",
        controlador: contactoController
    },
    login: { // se visualiza el formulario de inicio de sesión
        template: "Login/index.html",
        controlador: loginController
    },
    registro: { // se visualiza el formulario de registro
        template: "Registro/index.html",
        controlador: registroController
    }
};

export const router = async (app) => {
    const hash = location.hash.slice(1);
    const [rutas, params] = matchRoute(hash);
    // 
    

    // if (rutas.private && !estaAutenticado()) {
    //     location.hash = "#login"
    //     return;
    // }
    // Llamando la vista
    await loadView(app, rutas.template);
    // Ejecutar el controldor
    rutas.controlador(params);

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
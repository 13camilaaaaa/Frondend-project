import { inicioController } from "../views/Inicio/inicioController.js";
import { generosController } from "../views/Generos/generosController.js";
import { contactoController } from "../views/Contacto/contactoController.js";
import { buscarController } from "../views/Buscar/buscarController.js";
import { enviosController } from "../views/Envios/enviosController.js";
import { pagosController } from "../views/Pagos/pagosController.js";
import { devolucionesController } from "../views/Devoluciones/devolucionesController.js";
import { tiendaController } from "../views/Tienda/tiendaController.js";
import { productoController } from "../views/Producto/productoController.js";

// Controladores para Autenticación (separados)
import { loginController } from "../views/Login/loginController.js";
import { registroController } from "../views/Registro/registroController.js";


import { loadView } from "../helpers/loadView.js";
import { estaAutenticado } from "../helpers/auth.js";

const routes = {
    "/": {// lo que se visualiza al ingresar a la aplicación
        template: "Inicio/index.html",
        controlador: inicioController,
        private: false
    },
    contacto: { // se visualiza el servicio al cliente
        template: "Contacto/index.html",
        controlador: contactoController,
        private: false
    },
    login: { // se visualiza el formulario de inicio de sesión
        template: "Login/index.html",
        controlador: loginController,
        private: false
    },
    registro: { // se visualiza el formulario de registro
        template: "Registro/index.html",
        controlador: registroController,
        private: false
    },
    envios: {
        template: "Envios/index.html",
        controlador: enviosController,
        private: false
    },
    pagos: {
        template: "Pagos/index.html",
        controlador: pagosController,
        private: false
    },
    devoluciones: {
        template: "Devoluciones/index.html",
        controlador: devolucionesController,
        private: true
    },
    contactanos: {
        template: "Contactanos/index.html",
        private: false,
    },
    tienda: {
        template: "Tienda/index.html",
        controlador: tiendaController,
        private: false
    },
    'productos/:id': {
        template: "Producto/index.html",
        controlador: productoController,
        private: false
    },
    'generos/:nombre': {
        template: "Generos/index.html",
        controlador: generosController,
        private: false
    },
    'buscar/:query': {
        template: "Buscar/index.html",
        controlador: buscarController,
        private: false
    }
};

export const router = async (app) => {
    const fullHash = location.hash.slice(1);
    const basePath = fullHash.split('?')[0];
    const [rutas, params] = matchRoute(basePath); 

    if (!rutas) {
        await loadView(app, 'Inicio/index.html');
        inicioController();
        return;
    }

    if (rutas.private && !estaAutenticado()) {
        location.hash = "#login"
        return;
    }

    await loadView(app, rutas.template);

    requestAnimationFrame(() => {
        if (rutas.controlador) {
            rutas.controlador(params);
        }
    });
};

const matchRoute = (basePath) => { 
    const arreglo = basePath.split("/"); 

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
            return false; 
        });

        if (matched) {
            return [routes[route], params];
        }
    }
    return [null, null]; 
};

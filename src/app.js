

// Estilos generales y por vista
import './main.css';
import './views/Login/style.css';
import './views/Registro/style.css';
import './views/Inicio/style.css';
import './views/Buscar/style.css';

// Componentes globales
import './componentes/header.js';
import './componentes/footer.js';

// Lógica del buscador en el header (búsqueda en tiempo real + sugerencias)
import { buscarController } from "./views/Buscar/buscarController.js";


// SPA Router
import { router } from './router/router.js';

const app = document.querySelector('#app');

window.addEventListener('DOMContentLoaded', () => {
    router(app);
});

window.addEventListener('hashchange', () => {
    router(app);
});


